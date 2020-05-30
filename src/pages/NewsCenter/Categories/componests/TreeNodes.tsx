import React from 'react'
import { Tree } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import { DataNode, Key, EventDataNode } from 'rc-tree/lib/interface';

export interface TreeNode {
    title: string,
    key: string,
    children?: TreeNode[]
}

const treeData: TreeNode[] = [
    {
        title: 'parent 1',
        key: '0-0',
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0'
            },
            {
                title: 'parent 1-2',
                key: '0-0-2',
                children: [
                    { title: 'leaf', key: '0-0-2-0', },
                    {
                        title: 'leaf',
                        key: '0-0-2-1',
                    },
                ],
            },
            {
                title: 'parent 2-0',
                key: '0-22-0',
            },
        ],
    },
];

const TreeNodes: React.FC<{}> = () => {
    // 单击node事件
    const handleSelect = (selectedKeys: Key[]) => {
        if (!selectedKeys || selectedKeys.length === 0) return
        console.log('selected', selectedKeys)
    };

    // 拖动放下事件
    const handleDrop = (info: { node: EventDataNode; dragNode: EventDataNode; dragNodesKeys: Key[]; dropPosition: number; dropToGap: boolean }) => {
        const { node: dropNode, dragNode, dragNodesKeys, dropPosition, dropToGap } = info

        const loop = (data: TreeNode[], key: string, callback: (item: TreeNode, index: number, arr: TreeNode[]) => void) => {
            for (let i = 0; i < data.length; i += 1) {
                if (data[i].key === key) {
                    callback(data[i], i, data)
                    break
                } else {
                    const { children = [] } = data[i]
                    if (children.length) loop(children, key, callback)
                }
            }
        }


        const data = [...treeData]

        // 找被拖拽的对象
        let dragObj
        loop(data, dragNode.key.toString(), (item, index, arr) => {
            arr.splice(index, 1)
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropNode.key.toString(), (item, index, arr) => {
                item.children = item.children || [];
                item.children.push(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, item => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        // this.setState({
        //     gData: data,
        // });
    };

    return (
        <Tree className="draggable-tree"
            blockNode showLine autoExpandParent defaultExpandAll defaultExpandParent draggable
            treeData={treeData}
            onSelect={handleSelect} // 点击触发
            onDrop={handleDrop}
        />
    )
}

export default TreeNodes