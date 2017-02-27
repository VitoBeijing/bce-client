/**
 * Component - ContextMenu Component
 *
 * @file ContextMenu.js
 * @author mudio(job.mudio@gmail.com)
 */

/* eslint react/no-string-refs: 0 */

import classnames from 'classnames';
import React, {Component, PropTypes} from 'react';

import styles from './ContextMenu.css';
import {
    MENU_COPY_COMMAND,
    MENU_MOVE_COMMAND,
    MENU_VIEW_COMMAND,
    MENU_TRASH_COMMAND,
    MENU_SHARE_COMMAND,
    MENU_RENAME_COMMAND,
    MENU_DOWNLOAD_COMMAND
} from '../../actions/context';

export default class ContextMenu extends Component {
    static propTypes = {
        pageX: PropTypes.number.isRequired,
        pageY: PropTypes.number.isRequired,
        offsetX: PropTypes.number.isRequired,
        offsetY: PropTypes.number.isRequired,
        commands: PropTypes.array.isRequired,
        onCommand: PropTypes.func.isRequired
    };

    static defaultProps = {
        pageX: 0,
        pageY: 0,
        offsetX: 0,
        offsetY: 0,
        datasource: []
    };

    static menuCommands = {
        [MENU_COPY_COMMAND]: {name: '复制', icon: 'copy', command: MENU_COPY_COMMAND},
        [MENU_TRASH_COMMAND]: {name: '删除', icon: 'trash', command: MENU_TRASH_COMMAND},
        [MENU_SHARE_COMMAND]: {name: '分享', icon: 'chain', command: MENU_SHARE_COMMAND},
        [MENU_MOVE_COMMAND]: {name: '移动到', icon: 'arrows', command: MENU_MOVE_COMMAND},
        [MENU_VIEW_COMMAND]: {name: '查看', icon: 'low-vision', command: MENU_VIEW_COMMAND},
        [MENU_RENAME_COMMAND]: {name: '重命名', icon: 'pencil', command: MENU_RENAME_COMMAND},
        [MENU_DOWNLOAD_COMMAND]: {name: '下载', icon: 'cloud-download', command: MENU_DOWNLOAD_COMMAND}
    };

    render() {
        const {offsetX, offsetY, pageX, pageY, commands, onCommand} = this.props;
        const datasource = commands.map(key => ContextMenu.menuCommands[key]);

        let left = offsetX;
        let top = offsetY;

        if (document.body.clientWidth - pageX <= 120) {
            left -= 120;
        }
        if (document.body.clientHeight - pageY <= datasource.length * 30) {
            top -= datasource.length * 30;
        }

        return (
            <div className={styles.container} style={{left, top}}>
                {
                    datasource.map((item, index) => (
                        <div key={index} onClick={() => onCommand(item.command)}
                            className={classnames(styles.menuItem, {[styles.trash]: item.icon === 'trash'})}
                        >
                            <i className={`fa fa-${item.icon} fa-fw`} />
                            {item.name}
                        </div>
                    ))
                }
            </div>
        );
    }
}
