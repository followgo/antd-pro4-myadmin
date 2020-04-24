import React from 'react'
import { IUserState } from '@/models/connect'
import styles from '../style.less'


const ListContent = (user: IUserState) => (
    <div className={styles.listContent}>
        <div className={styles.listContentItem}>
            <span>唯一</span>
            <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
            <span>开始时间</span>
            <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
            <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div>
    </div>
)

export default ListContent