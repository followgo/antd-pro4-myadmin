import React from 'react'
import { Tree, message } from 'antd'
import { AntTreeNodeDropEvent, AntTreeNodeProps } from 'antd/lib/tree/Tree'

export interface MyTreeMenuItem {
    title: string,
    key: string,
    children: MyTreeMenuItem[]
}

const treeData: MyTreeMenuItem[] = [
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
                    { title: 'leaf', key: '0-0-2-0', children: [], },
                    {
                        title: 'leaf',
                        key: '0-0-2-1', children: [],
                    },
                ],
            },
            {
                title: 'parent 2-0',
                key: '0-22-0', children: [],
            },
        ],
    },
];

const TreeNodes: React.FC<{}> = () => {
    const [tData, setTData] = React.useState(treeData)

    // 单击node事件
    const handleClick = (node: AntTreeNodeProps) => {
        console.log(node)
    }

    // 拖动放下事件
    const handleDrop = (info: AntTreeNodeDropEvent) => {
        const newData = [...treeData]
        const { node, dragNode, dropPosition, dropToGap } = info
        const { key: nodeKey, children: _nodeChildren, expanded: nodeIsExpanded } = (node as AntTreeNodeProps)
        const nodeChildren = (_nodeChildren as MyTreeMenuItem[] || undefined)
        const { key: dragNodeKey } = (dragNode as AntTreeNodeProps)

        // 检查参数
        if (!nodeKey || !dragNodeKey) {
            message.error('对象的 Key 为空或未定义')
            return
        }

        // 递归查询节点
        const loop = (data: MyTreeMenuItem[], key: string | number, callback: (index: number, arr: MyTreeMenuItem[]) => void) => {
            for (let i = 0; i < data.length; i += 1) {
                if (data[i].key === key) {
                    callback(i, data)
                    break
                }

                const { children = [] } = data[i]
                if (children.length > 0) {
                    loop(children, key, callback)
                }
            }
        }

        // 查找被拖拽的条目
        let dragItem: MyTreeMenuItem = { title: '', key: '', children: [] }
        loop(newData, dragNodeKey, (index, arr) => {
            dragItem = arr[index]
            arr.splice(index, 1)
        })
        if (!dragItem.key) {
            message.warning('被拖拽的对象为空')
            return
        }

        if (!dropToGap) { // Drop on the content
            loop(newData, nodeKey, (index, arr) => {
                const item = arr[index]
                item.children.push(dragItem)
            })

        } else if ((nodeChildren || []).length > 0 && nodeIsExpanded && dropPosition === 1) {
            loop(newData, nodeKey, (index, arr) => {// 添加到头部
                arr[index].children.unshift(dragItem)
            })

        } else {
            let droppedOnChildren: MyTreeMenuItem[] = []
            let childrenIdx: number = 0
            loop(newData, nodeKey, (index, arr) => {
                childrenIdx = index
                droppedOnChildren = arr
            })

            if (dropPosition === -1) {
                droppedOnChildren.splice(childrenIdx, 0, dragItem)
            } else {
                droppedOnChildren.splice(childrenIdx + 1, 0, dragItem)
            }
        }

        setExpandedKeys([dragItem.key])

        setTData(newData)
    }

    return (
        <Tree className="draggable-tree" treeData={tData}
            blockNode showLine draggable
            defaultExpandParent autoExpandParent defaultExpandAll
            onDrop={info => handleDrop(info)}
            onClick={(_e, node) => handleClick(node)}
        />
    )
}

export default TreeNodes