import React from 'react';
import { Menu } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

export interface PopMenuProps {
  pos: { x: number; y: number };
  onHide: () => void;
}

const PopMenu: React.FC<PopMenuProps> = ({ pos, onHide }) => {
  const blockStyle: React.CSSProperties = {
    position: 'fixed',
    left: pos.x,
    top: pos.y,
    zIndex: 100000,
    border: '1px solid #91d5ff',
    boxShadow: '2px 2px 5px #ccc',
  };

  const menuStyle: React.CSSProperties = {};

  return (
    <div style={blockStyle} onMouseLeave={onHide}>
      <Menu mode="inline" style={menuStyle}>
        <Menu.Item key="1" icon={<PlusOutlined />}>
          新建子项
        </Menu.Item>
        <Menu.Item key="2" icon={<EditOutlined />}>
          编辑
        </Menu.Item>
        <Menu.Item key="3" icon={<DeleteOutlined />}>
          删除
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default PopMenu;
