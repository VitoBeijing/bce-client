/**
 * Component - Transfer Component
 *
 * @file Transfer.js
 * @author mudio(job.mudio@gmail.com)
 */

import React, {Component, PropTypes} from 'react';

import Header from './Header';
import styles from './Transfer.css';
import SideBar from '../App/SideBar';
import UploadItem from './UploadItem';
import DownloadItem from './DownloadItem';
import {TransCategory} from '../../utils/BosType';

export default class Transfer extends Component {
    static propTypes = {
        uploads: PropTypes.array,
        downloads: PropTypes.array,
        category: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    renderCategoryContent() {
        const {category} = this.props;

        if (category === TransCategory.Upload) {
            return this.renderUpload();
        } else if (category === TransCategory.Download) {
            return this.renderDownload();
        } else if (category === TransCategory.Complete) {
            return this.renderComplete();
        }
    }

    renderUpload() {
        const {uploads = [], dispatch} = this.props;

        return (
            <div className={styles.content}>
                {
                    uploads.map(item => (
                        <UploadItem key={item.uuid} {...item} dispatch={dispatch} />
                    ))
                }
                {
                    uploads.length === 0
                    && <span className={`fa fa-cloud-upload ${styles.nocontent}`}>没有上传任务~(&gt;_&lt;)!!!</span>
                }
            </div>
        );
    }

    renderDownload() {
        const {downloads = [], dispatch} = this.props;

        return (
            <div className={styles.content}>
                {
                    downloads.map(item => (
                        <DownloadItem key={item.uuid} {...item} dispatch={dispatch} />
                    ))
                }
                {
                    downloads.length === 0
                    && <span className={`fa fa-cloud-download ${styles.nocontent}`}>没有下载任务~(&gt;_&lt;)!!!</span>
                }
            </div>
        );
    }

    renderComplete() {
        const {uploads = [], downloads = [], dispatch} = this.props;
        const isEmpty = uploads.length + downloads.length === 0;

        return (
            <div className={styles.content}>
                {
                    uploads.map(item => (
                        <UploadItem key={item.uuid} {...item} dispatch={dispatch} />
                    ))
                }
                {
                    downloads.map(item => (
                        <DownloadItem key={item.uuid} {...item} dispatch={dispatch} />
                    ))
                }
                {
                    isEmpty
                    && <span className={`fa fa-cloud-download ${styles.nocontent}`}>没有完成任务~(&gt;_&lt;)!!!</span>
                }
            </div>
        );
    }

    render() {
        const {dispatch, category} = this.props;

        return (
            <div className={styles.container}>
                <SideBar />
                <div className={styles.body}>
                    <Header dispatch={dispatch} category={category} />
                    {this.renderCategoryContent()}
                </div>
            </div>
        );
    }
}
