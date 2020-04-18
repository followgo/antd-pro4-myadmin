import React, { Component } from 'react';
import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;
const passwordStrength = {
  strong: <span className="strong">安全</span>,
  medium: <span className="medium">一般</span>,
  weak: <span className="weak">不安全</span>,
};

class SecurityView extends Component {
  getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          当前密码强度：
          {passwordStrength.medium}
        </>
      ),
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: '备用邮箱',
      description: '未设置',
      actions: [<a key="Modify">修改</a>],
    }
  ]

  render() {
    const data = this.getData();
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </>
    )
  }
}

export default SecurityView;
