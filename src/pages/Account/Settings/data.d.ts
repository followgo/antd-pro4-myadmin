export interface CurrentUser {
  nickname: string;
  avatar: string;
  uuid: string;
  notice: NoticeType[];
  email: string;
  signature: string;
  title: string;
  group: string;
  tags: TagType[];
  notifyCount: number;
  unreadCount: number;
  address: string;
  phone: string;
}
