/**
 * Action - Downloader Action & Creater
 *
 * @file downloader.js
 * @author mudio(job.mudio@gmail.com)
 */

/* eslint object-property-newline: 0 */

import {getUuid} from '../utils/utils';
import {getRegionClient} from '../api/client';
import {DownloadNotify, DownloadCommandType} from '../utils/TransferNotify';

export function downloadStart(taskIds = []) {
    return {
        [DownloadCommandType]: {
            command: DownloadNotify.Start,      // 开始任务
            taskIds                             // 如果为空，顺序开始等待任务， 不为空，开始指定任务
        }
    };
}

export function downloadRemove(taskIds = []) {
    return {
        [DownloadCommandType]: {
            command: DownloadNotify.Remove,    // 删除任务
            taskIds                            // 如果为空，顺序开始等待任务， 不为空，开始指定任务
        }
    };
}

export function downloadSuspend(taskIds = []) {
    return {
        [DownloadCommandType]: {
            command: DownloadNotify.Suspending,    // 删除任务
            taskIds                            // 如果为空，顺序开始等待任务， 不为空，开始指定任务
        }
    };
}

export function createDownloadTask(region, bucket, prefix, keys, basedir) {
    return dispatch => {
        const client = getRegionClient(region);

        keys.forEach(object => {
            const uuid = getUuid();
            const name = object.replace(prefix, '');
            // 初始化任务
            dispatch({
                uuid, region, bucket, prefix, name, basedir, type: DownloadNotify.Init
            });

            client.listAllObjects(bucket, object).then(
                contents => {
                    let totalSize = 0;
                    const metaKeys = contents.map(item => {
                        // 创建任务uuid
                        const metaKey = getUuid();
                        const metaFile = {
                            offsetSize: 0,
                            eTag: item.eTag,
                            totalSize: item.size,
                            relative: item.key.replace(prefix, ''),
                        };

                        totalSize += item.size;

                        localStorage.setItem(metaKey, JSON.stringify(metaFile));

                        return metaKey;
                    });
                    // 建立keymap
                    const keymapId = getUuid();
                    localStorage.setItem(keymapId, JSON.stringify({
                        errorQueue: [],
                        completeQueue: [],
                        waitingQueue: metaKeys
                    }));
                    // 建立新任务
                    dispatch({
                        type: DownloadNotify.New, uuid, totalSize,
                        keymap: {key: keymapId, waiting: keys.length, error: 0, complete: 0}
                    });
                    // 立即开始这个任务
                    dispatch(downloadStart([uuid]));
                },
                response => dispatch({
                    type: DownloadNotify.Error,
                    error: response.body
                })
            );
        });
    };
}
