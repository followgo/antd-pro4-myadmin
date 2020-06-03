import React from 'react';
import { Tree, message } from 'antd';
import { DataNode, EventDataNode, handleDropProps, handleRightClickProps } from './interface';
import PopMenu from './PopMenu';

const treeData: DataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          { title: 'leaf1', key: '0-0-2-0', children: [] },
          {
            title: 'leaf2',
            key: '0-0-2-1',
            children: [],
          },
        ],
      },
      {
        title: 'parent 2-0',
        key: '0-22-0',
        children: [],
      },
    ],
  },
];

const TreeNodes: React.FC<{}> = () => {
  const [popMenuStatus, setPopMenuStatus] = React.useState(false);
  const [popMenuPosition, setPopMenuPosition] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [tData, setTData] = React.useState(treeData);
  const [lastSelectedNode, setLastSelectedNode] = React.useState<DataNode>(); // 被选中的node

  // 递归查询节点
  const find = (
    data: DataNode[],
    key: string | number,
    callback: (index: number, arr: DataNode[]) => void,
  ) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].key === key) {
        callback(i, data);
        break;
      }

      const { children = [] } = data[i];
      if (children.length > 0) {
        find(children, key, callback);
      }
    }
  };

  // 单击node事件
  const handleClick = (node: EventDataNode) => {
    setLastSelectedNode(node)
  };

  // 右键单击node事件
  const handleRightClick = (info: handleRightClickProps) => {
    setLastSelectedNode(info.node)

    const { pageX, pageY } = info.event;
    setPopMenuStatus(true);
    setPopMenuPosition({ x: pageX, y: pageY });
  };

  // 拖动放下事件
  const handleDrop = (info: handleDropProps) => {
    const newData = [...tData];
    const { node, dragNode, dropPosition, dropToGap } = info;
    const { key: nodeKey, children: _nodeChildren, expanded: nodeIsExpanded } = node;
    const nodeChildren = (_nodeChildren as DataNode[]) || undefined;
    const { key: dragNodeKey } = dragNode;

    // 检查参数
    if (!nodeKey || !dragNodeKey) {
      message.error('对象的 Key 为空或未定义');
      return;
    }

    // 查找被拖拽的条目
    let dragItem: DataNode = { title: '', key: '', children: [] };
    find(newData, dragNodeKey, (index, arr) => {
      dragItem = arr[index];
      arr.splice(index, 1);
    });
    if (!dragItem.key) {
      message.warning('被拖拽的对象为空');
      return;
    }

    if (!dropToGap) {
      // Drop on the content
      find(newData, nodeKey, (index, arr) => {
        const item = arr[index];
        if (item.children) {
          item.children.push(dragItem);
        } else {
          item.children = [dragItem];
        }
      });
    } else if ((nodeChildren || []).length > 0 && nodeIsExpanded && dropPosition === 1) {
      find(newData, nodeKey, (index, arr) => {
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
      find(newData, nodeKey, (index, arr) => {
        childrenIdx = index;
        droppedOnChildren = arr;
      });

      if (dropPosition === -1) {
        droppedOnChildren.splice(childrenIdx, 0, dragItem);
      } else {
        droppedOnChildren.splice(childrenIdx + 1, 0, dragItem);
      }
    }

    setTData(newData);
  };

  return (
    <>
      <Tree
        className="draggable-tree"
        treeData={tData}
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

      {popMenuStatus ? (
        <PopMenu pos={popMenuPosition} onHide={() => setPopMenuStatus(false)} />
      ) : null}
    </>
  );
};

export default TreeNodes;
