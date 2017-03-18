/**
 * MiddleWare - UploadQueue MiddleWare
 *
 * @file UploadQueue.js
 * @author mudio(job.mudio@gmail.com)
 */

import _ from 'lodash';
import async from 'async';
import {EventEmitter} from 'events';

import {UploadConfig} from '../config';
import {error, info} from '../../utils/logger';
import {getRegionClient} from '../api/client';
import {UploadStatus} from '../utils/TransferStatus';
import {UploadNotify, UploadCommandType} from '../utils/TransferNotify';

export default class UploadQueue extends EventEmitter {
    static TaskProperties = [
        'uuid', 'name', 'basedir', 'region', 'bucket',
        'prefix', 'status', 'keymap'
    ];

    static MetaProperties = [
        'path', 'relative', 'totalSize'
    ];

    constructor(task) {
        super();

        // 检查任务
        if (!this._checkProperties(task, UploadQueue.TaskProperties)) {
            throw new TypeError(`task ${task.uuid} must has properties: ${UploadQueue.TaskProperty.join('、')}`);
        }
        // 暂停状态
        this._suspend = false;
        // 保存任务
        this._task = task;
        // 设置事件触发器
        this.dispatch = window.globalStore.dispatch;
        // 起始状态必须为Waiting
        if (this._task.status !== UploadStatus.Waiting
            && this._task.status !== UploadStatus.Error
            && this._task.status !== UploadStatus.Suspended) {
            throw new TypeError(`Upload task = ${task.uuid} status must be Waiting、Suspended、Error!`);
        }

        // 初始化队列
        this._queue = async.queue(
            (...args) => this._upload(...args), UploadConfig.MetaLimit
        );
        // 事件绑定
        this._queue.empty = () => this.emit('empty');
        this._queue.drain = () => this.emit('drain');
        this._queue.error = () => this._error();
        this._queue.saturated = () => this.emit('saturated');
        this._queue.unsaturated = () => this.emit('unsaturated');
        // 获取keymap
        const {keymap} = task;
        const {waitingQueue, errorQueue} = JSON.parse(localStorage.getItem(keymap.key));
        // 等待任务放入队列中
        waitingQueue.forEach(
            metaKey => this._queue.push(
                {metaKey, ...task},
                err => this._finally(err, metaKey, task)
            )
        );
        // 错误任务放入队列中
        errorQueue.forEach(
            metaKey => this._queue.push(
                {metaKey, ...task},
                err => this._finally(err, metaKey, task)
            )
        );
        // 通知任务开始，状态设置为Running
        this.dispatch({type: UploadNotify.Launch, uuid: this._task.uuid});
    }

    // 属性检查，属性太多代码写着写着就忘记了
    _checkProperties(task, properties = []) {
        return properties.reduce(
            (hasProperty, property) => hasProperty && (property in task),
            true
        );
    }

    // 通知任务状态变化
    _finally(err, metaKey, item) {
        const {uuid, region, bucket, prefix, name, keymap} = item;
        const queueMap = JSON.parse(localStorage.getItem(keymap.key));

        if (err) {
            error(
                'Failed Region = %s, Bucket = %s, Prefix = %s, Name = %s, Error = %s',
                region, bucket, prefix, prefix, name, err.message
            );

            // 子任务错误
            if (metaKey) {
                queueMap.waitingQueue = queueMap.waitingQueue.filter(key => key !== metaKey);
                queueMap.errorQueue = [metaKey, ...queueMap.errorQueue];

                Object.assign(keymap, {
                    error: queueMap.errorQueue.length,
                    waiting: queueMap.waitingQueue.length
                });
            }

            // 保存配置
            localStorage.setItem(keymap.key, JSON.stringify(queueMap));

            // 通知任务有错误发生了
            this.dispatch({uuid, keymap, error: err.message, type: UploadNotify.Error});
        } else {
            info(
                'Finish Region = %s, Bucket = %s, Prefix = %s, Name = %s',
                region, bucket, prefix, prefix, name
            );

            // 子任务完成
            if (metaKey) {
                queueMap.waitingQueue = queueMap.waitingQueue.filter(key => key !== metaKey);
                queueMap.completeQueue = [metaKey, ...queueMap.completeQueue];

                Object.assign(keymap, {
                    waiting: queueMap.waitingQueue.length,
                    complete: queueMap.completeQueue.length
                });
            }

            // 保存配置
            localStorage.setItem(keymap.key, JSON.stringify(queueMap));

            // 全部任务完成
            if (queueMap.waitingQueue.length === 0 && queueMap.errorQueue.length === 0) {
                this.dispatch({uuid, keymap, type: UploadNotify.Finish});
            } else {
                // 同步下状态
                this.dispatch({
                    [UploadCommandType]: {uuid, keymap, command: UploadNotify.Progress}
                });
            }
        }

        this._checkPaused();
    }

    // 最多分片1000片，除了最后一片其他片大小相等且大于等于UploadConfig.PartSize
    _decompose(uuid, region, bucket, object, metaFile) {
        const {uploadId, path, totalSize, parts} = metaFile;
        const minPartSize = Math.ceil(totalSize / 1000);
        const averagePartSize = Math.max(UploadConfig.PartSize, minPartSize);
        const partNumbers = parts.map(part => +part.partNumber);

        // 分片集合
        const uploadParts = [];

        let leftSize = totalSize;
        let offset = 0;
        let partNumber = 1;

        while (leftSize > 0) {
            const partSize = Math.min(leftSize, averagePartSize);

            uploadParts.push({uuid, uploadId, region, bucket, object, path, partNumber, partSize, start: offset});

            leftSize -= partSize;
            offset += partSize;
            partNumber += 1;
        }

        // 排除已上传的part
        return uploadParts.filter(part => partNumbers.indexOf(part.partNumber) === -1);
    }

    _uploadPartFile(part, callback) {
        const {uuid, uploadId, region, bucket, object, path, partNumber, partSize, start} = part;
        const client = getRegionClient(region);

        // 如果任务暂停了，就暂停上传分片
        if (this._suspend) {
            info(
                'Suspend uuid = %s, PartNumber = %s, Part = %s',
                uuid, partNumber, JSON.stringify(part)
            );

            return callback(new Error('Upload Task Suspend!'));
        }

        info(
            'Start uuid = %s, PartNumber = %s, Part = %s',
            uuid, partNumber, JSON.stringify(part)
        );

        return client.uploadPartFromFile(
            bucket, object, uploadId,
            partNumber, partSize, path, start
        ).then(
            res => {
                const eTag = res.http_headers.etag;

                info(
                    'Finish Uuid = %s, PartNumber = %s, PartSize = %s eTag = %s',
                    uuid, partNumber, partSize, eTag
                );

                // 完成分片任务
                callback(null, {eTag, partNumber, partSize});

                // 通知分片进度
                this.dispatch({
                    [UploadCommandType]: {uuid, increaseSize: partSize, command: UploadNotify.Progress}
                });
            },
            callback
        );
    }

    // 上传任务
    _upload(abstractTask, done) {
        const {uuid, region, bucket, prefix, metaKey} = abstractTask;
        const client = getRegionClient(region);

        let metaFile = null;

        try {
            metaFile = JSON.parse(localStorage.getItem(metaKey));

            if (!this._checkProperties(metaFile, UploadQueue.MetaProperties)) {
                throw new TypeError(
                    `MetaFile ${metaFile.uuid} must has properties: ${UploadQueue.MetaProperties.join('、')}`
                );
            }
        } catch (ex) {
            done(ex);
        }

        const {path, relative, totalSize} = metaFile;
        // 处理下window分隔符问题
        const suffix = relative.replace(/\\/g, '/');
        const object = prefix ? `/${prefix}${suffix}` : suffix;

        // 1. 判断上传大小，如果小于PartLimit *  PartSize 就别分片了
        if (totalSize <= UploadConfig.PartLimit * UploadConfig.PartSize) {
            // 上传完了交给最后的处理逻辑
            return client.putObjectFromFile(bucket, object, path).then(
                () => {
                    // 通知进度
                    this.dispatch({
                        [UploadCommandType]: {uuid, increaseSize: totalSize, command: UploadNotify.Progress}
                    });
                    // 完成
                    done();
                },
                done
            );
        }

        // 2. 分片上传，初始化上传
        const workFlowPromise = new Promise((resolve, reject) => {
            if (metaFile.uploadId) {
                return client.listParts(bucket, object, metaFile.uploadId).then(
                    res => resolve(res.body),
                    reject
                );
            }
            return client.initiateMultipartUpload(bucket, object).then(
                res => resolve({uploadId: res.body.uploadId, parts: []}),
                reject
            );
        });

        workFlowPromise.then(
            res => {
                const {uploadId, parts} = res;
                // 3. 保存metaFile信息, 分解任务
                metaFile = Object.assign(metaFile, {uploadId, parts});
                const tasks = this._decompose(uuid, region, bucket, object, metaFile);

                async.mapLimit(tasks, UploadConfig.PartLimit,
                    (...args) => this._uploadPartFile(...args),
                    (err, allResponse = []) => {
                        // 统计已完成parts
                        const uploadedParts = _.compact(allResponse);
                        const finishParts = [...parts, ...uploadedParts];

                        // 4. 如果没有错误，则完成上传
                        if (!err) {
                            finishParts.map(
                                part => Object({partNumber: part.partNumber, eTag: part.ETag})
                            ).sort(
                                (lhs, rhs) => lhs.partNumber > rhs
                            );

                            client.completeMultipartUpload(
                                bucket, object, uploadId, finishParts
                            ).then(
                                () => {
                                    metaFile.finish = true;
                                    localStorage.setItem(metaKey, JSON.stringify(metaFile));
                                    done();
                                },
                                _err => {
                                    localStorage.setItem(metaKey, JSON.stringify(metaFile));
                                    // 完成map
                                    done(_err);
                                }
                            );
                        } else {
                            metaFile.offsetSize = finishParts.reduce(
                                (total, item) => total + item.partSize, 0
                            );

                            localStorage.setItem(metaKey, JSON.stringify(metaFile));

                            done(err);
                        }
                        // 流程结束
                    }
                );
                // end mapLimit
            },
            done
        );
    }

    _error(err) {
        error('UploadTask Error = %s', err.message);
    }

    _checkPaused() {
        const {uuid} = this._task;

        if (this._suspend && this._queue.idle()) {
            this.emit('suspend');
            // 任务已暂停
            this.dispatch({taskId: uuid, type: UploadNotify.Suspended});
        }
    }

    // 挂起任务
    suspend() {
        this._suspend = true;
        // 暂停队列，不在提交新任务
        this._queue.kill();
    }
}
