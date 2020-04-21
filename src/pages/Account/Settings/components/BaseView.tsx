import { Button, Input, Form, message } from 'antd'
import React, { Component } from 'react'
import { connect } from 'umi'
import { ConnectState, IUserModelState } from '@/models/connect'
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

interface BaseViewProps {
  currentUser?: IUserModelState;
}

class BaseView extends Component<BaseViewProps> {
  view: HTMLDivElement | undefined = undefined;

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  };

  handleFinish = () => {
    message.success('accountandsettings.basic.update.success');
  };

  render() {
    const { currentUser } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >
            <Form.Item name="uuid" label="唯一识别码（只读）">
              <Input readOnly />
            </Form.Item>

            <Form.Item name="email" label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="nickname" label="绰号"
              rules={[
                { required: true, message: '请输入绰号' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" type="primary" size="large">
                更新个人信息
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

export default connect(({ user }: ConnectState) => ({
  currentUser: user,
}))(BaseView)