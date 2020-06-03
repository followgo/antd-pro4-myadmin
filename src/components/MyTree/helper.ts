import { DataNode } from "./interface";

// 递归查询树的节点
export const lookupNode = (
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
        if (children.length > 0) lookupNode(children, key, callback)
    }
}

// 比较拖动后的树数据，返回被改变的节点
export const compareTreeData = (oldData: DataNode[], newData: DataNode[]): DataNode[] => {
    const loop = (data: DataNode[], callback: (index: number, arr: DataNode[]) => void) => {
        for (let i = 0; i < data.length; i += 1) {
            callback(i, data)

            const { children = [] } = data[i];
            if (children.length > 0) loop(children, callback)
        }
    }

    loop(oldData, (index,arr)=>{
        
    })


    return []
}