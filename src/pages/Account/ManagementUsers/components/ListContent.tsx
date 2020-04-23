import { IUserAccount } from "@/services/user";

const ListContent = ({ data: { owner, createdAt, percent, status }, }: { data: IUserAccount }) => (
    <div className={styles.listContent}>
        <div className={styles.listContentItem}>
            <span>Owner</span>
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