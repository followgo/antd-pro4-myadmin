import React from 'react';
import { Menu, Modal, message, Tree } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DataNode, handleRightClickProps, EventDataNode, handleDropProps, PopMenuProps, MyTreeProps } from './interface'
import { lookupNode } from './helper'
import { deepClone } from '@/utils/other';

// 点击树的节点弹出的泡泡菜单
const PopMenu: React.FC<PopMenuProps> = ({ pos, onHide, onClickNewChild, onClickEdit, onClickDelete }) => {
  const blockStyle: React.CSSProperties = {
    position: 'fixed',
    left: pos.x - 1,
    top: pos.y - 1,
    zIndex: 100000,
    border: '1px solid #91d5ff',
    boxShadow: '2px 2px 5px #ccc',
  }
  const handleClick = ({ key }: { key: string }) => {
    switch (key) {
      case '1':
        onClickNewChild()
        break
      case '2':
        onClickEdit()
        break
      case '3':
        Modal.confirm({
          title: '确定要删除选中的新闻类别吗？',
          icon: <ExclamationCircleOutlined />, okType: 'danger',
          onOk() { onClickDelete() },
          onCancel() { message.info('你放弃了操作') },
        })
      default:
    }

    // 隐藏菜单
    onHide()
  }
  return (
    <div style={blockStyle} onMouseLeave={onHide}>
      <Menu mode="inline" onClick={handleClick} >
        <Menu.Item key="1" icon={<PlusOutlined />}>新建子项</Menu.Item>
        <Menu.Item key="2" icon={<EditOutlined />}>编辑</Menu.Item>
        <Menu.Item key="3" icon={<DeleteOutlined />}>删除</Menu.Item>
      </Menu>
    </div>
  )
}

const MyTree: React.FC<MyTreeProps> = ({ loading, treeData }) => {
  const [popMenuVisible, setPopMenuVisible] = React.useState(false);
  const [popMenuPosition, setPopMenuPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [lastSelectedNode, setLastSelectedNode] = React.useState<DataNode>({ key: '' })


  // 单击node事件
  const handleClick = (node: EventDataNode) => {
    setLastSelectedNode(node)
  };

  // 右键单击node事件
  const handleRightClick = (info: handleRightClickProps) => {
    setLastSelectedNode(info.node)

    const { pageX, pageY } = info.event;
    setPopMenuPosition({ x: pageX, y: pageY })
    setPopMenuVisible(true)
  };

  // 拖动放下事件
  const handleDrop = (info: handleDropProps) => {
    const { node, dragNode, dropPosition, dropToGap } = info;
    const { key: nodeKey, children: _nodeChildren, expanded: nodeIsExpanded } = node;
    const nodeChildren = (_nodeChildren as DataNode[]) || undefined;
    const { key: dragNodeKey } = dragNode;

    const _treeData = deepClone(treeData) as DataNode[]

    // 检查参数
    if (!nodeKey || !dragNodeKey) {
      message.error('对象的 Key 为空或未定义');
      return;
    }

    // 查找被拖拽的条目
    let dragItem: DataNode = { title: '', key: '', children: [] };
    lookupNode(_treeData, dragNodeKey, (index: number, arr: DataNode[]) => {
      dragItem = arr[index]
      arr.splice(index, 1)
    });
    if (!dragItem.key) {
      message.warning('被拖拽的对象为空')
      return;
    }

    if (!dropToGap) {
      // Drop on the content
      lookupNode(_treeData, nodeKey, (index: number, arr: DataNode[]) => {
        const item = arr[index];
        if (item.children) {
          item.children.push(dragItem);
        } else {
          item.children = [dragItem];
        }
      });
    } else if ((nodeChildren || []).length > 0 && nodeIsExpanded && dropPosition === 1) {
      lookupNode(_treeData, nodeKey, (index: number, arr: DataNode[]) => {
        // 添加到头部
        const item = arr[index];
        if (item.children) {
          item.children.unshift(dragItem);
        } else {
          item.children = [dragItem];
        }
      });
    } else {
      let droppedOnChildren: DataNode[] = [];
      let childrenIdx: number = 0;
      lookupNode(_treeData, nodeKey, (index: number, arr: DataNode[]) => {
        childrenIdx = index;
        droppedOnChildren = arr;
      });

      if (dropPosition === -1) {
        droppedOnChildren.splice(childrenIdx, 0, dragItem);
      } else {
        droppedOnChildren.splice(childrenIdx + 1, 0, dragItem);
      }
    }
  }

  return (
    <>
      <Tree
        className="draggable-tree"
        treeData={treeData}
        blockNode
        showLine
        draggable
        defaultExpandParent
        autoExpandParent
        defaultExpandAll
        selectedKeys={lastSelectedNode ? [lastSelectedNode.key] : []}
        onDrop={handleDrop}
        onClick={(_e, node) => handleClick(node)}
        onRightClick={handleRightClick}
      />


      {popMenuVisible ? (
        <PopMenu
          pos={popMenuPosition}
          onHide={() => setPopMenuVisible(false)}
          onClickNewChild={() => { }}
          onClickEdit={() => { }}
          onClickDelete={() => { }}
        />
      ) : null}
    </>
  );
};

export default MyTree
