import React from 'react';

export interface DataNode {
  checkable?: boolean;
  children?: DataNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  isLeaf?: boolean;
  key: string | number;
  title?: React.ReactNode;
  selectable?: boolean;
  switcherIcon?: IconType;
  /** Set style of TreeNode. This is not recommend if you don't have any force requirement */
  className?: string;
  style?: React.CSSProperties;
}
export interface EventDataNode extends DataNode {
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  loaded: boolean;
  loading: boolean;
  halfChecked: boolean;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  pos: string;
  active: boolean;
}
export declare type IconType = React.ReactNode | ((props: TreeNodeProps) => React.ReactNode);
export declare type Key = string | number;

// 拖到事件的参数
export interface handleDropProps {
  event: React.MouseEvent;
  node: EventDataNode;
  dragNode: EventDataNode;
  dragNodesKeys: Key[];
  dropPosition: number;
  dropToGap: boolean;
}

export interface handleRightClickProps {
  event: React.MouseEvent;
  node: EventDataNode;
}
