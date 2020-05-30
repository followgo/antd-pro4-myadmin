import { Button, Input, Form } from 'antd'
import React from 'react'
import { connect, Dispatch } from 'umi'
import { ConnectState, IUserState } from '@/models/connect'
import { Store } from 'antd/es/form/interface'
import styles from './BaseView.less'

// const AvatarView = ({ avatar }: { avatar: string }) => (
//   <>
//     <div className={styles.avatar}>
//       <img src={avatar} alt="avatar" />
//     </div>
//     <Upload showUploadList={false}>
//       <div className={styles.button_view}>
//         <Button>
//           <UploadOutlined />
//           更换头像
//         </Button>
//       </div>
//     </Upload>
//   </>
// )

interface IBaseViewProps {
  dispatch: Dispatch
  currentUser: IUserState
  loading?: boolean
  updating?: boolean
}

class BaseView extends React.Component<IBaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish = (values: Store) => {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'current_user/updateProfile',
        payload: { data: values, patch_fields: ['account_name', 'nickname', 'email'] }
      })
    }
  };

  render() {
    const { currentUser, loading, updating } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onFinish={this.handleFinish} initialValues={currentUser}>

            <Form.Item name="uuid" label="ID（只读）">
              <Input readOnly />
            </Form.Item>

            <Form.Item name="email" label="邮箱" rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}>
              <Input />
            </Form.Item>

            <Form.Item name="account_name" label="登陆账号" rules={[
              { required: true, message: '请输入登陆账号' },
            ]}>
              <Input />
            </Form.Item>

            <Form.Item name="nickname" label="绰号" rules={[
              { required: true, message: '请输入绰号' },
            ]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" type="primary" loading={loading || updating}>
                {loading ? '加载...' : '更新'}
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div> */}
      </div>
    );
  }
}

export default connect(({ loading }: ConnectState) => ({
  loading: loading.effects['current_user/query'],
  updating: loading.effects['current_user/updateProfile'],
}))(BaseView)