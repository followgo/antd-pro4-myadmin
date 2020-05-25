import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Input, Tag, Divider, Modal, message } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { connect, Dispatch } from 'umi'
import { ConnectState, ITagState } from '@/models/connect'
import styles from './style.less'

const ContentTags: React.FC<{ dispatch: Dispatch, tags: ITagState[], loading?: boolean }> = ({ dispatch, tags, loading }) => {
  const [newIptVisible, setNewIptVisible] = useState<boolean>(false)
  const [newIptValue, setNewIptValue] = useState<string>('')
  const [editIptValue, setEditIptValue] = useState<string>('')

  // 获取服务器的所有标签
  useEffect(() => { dispatch({ type: 'tags/query' }) }, [])

  const handleAddTag = () => {
    dispatch({
      type: 'tags/createItem', payload: { name: newIptValue }, callback: () => {
        setNewIptVisible(false)
        setNewIptValue('')
      }
    })
  }
  const enterEditMode = (tag: ITagState) => {
    dispatch({ type: 'tags/setEditStatus', payload: { uuid: tag.uuid, isEditing: true } })
    setEditIptValue(tag.name)
  }
  const handleEditTag = (tag: ITagState) => {
    const callback = () => {
      dispatch({ type: 'tags/setEditStatus', payload: { uuid: tag.uuid, isEditing: false } })
      setEditIptValue('')
    }

    if (tag.name === editIptValue) {
      callback()
    } else {
      dispatch({ type: 'tags/updateItem', payload: { uuid: tag.uuid, name: editIptValue }, callback })
    }
  }
  // 删除事件
  const handleDeleteTag = (e: any, tag: ITagState) => {
    e.preventDefault() // 阻止默认的删除事件

    Modal.confirm({
      title: '你确定要删除此标签吗？',
      icon: <ExclamationCircleOutlined />,
      content: `标签：${tag.name}`,
      okType: 'danger',
      onOk() {
        dispatch({ type: 'tags/deleteItem', payload: { uuid: tag.uuid } })
      },
      onCancel() { message.info('你放弃了操作') },
    })
  }

  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
  return (
    <>
      <PageHeaderWrapper title={false}>
        <Card loading={loading}>
          <p>标签的颜色只是为了好看，没有其它意义。</p>
          <p>双击标签可以重命名</p>
          <Divider />

          {
            tags.map((item, index) => {
              if (item.isEditing) {
                return (
                  <Input type="text" size="large" className={styles.editInput} autoFocus
                    key={item.uuid} value={editIptValue} onChange={e => setEditIptValue(e.target.value)}
                    onBlur={() => handleEditTag(item)}
                    onPressEnter={() => handleEditTag(item)}
                  />
                )
              }
              return (
                <Tag closable className={styles.tagPlus} color={colors[index % colors.length]}
                  key={item.uuid}
                  onDoubleClick={() => enterEditMode(item)}
                  onClose={e => handleDeleteTag(e, item)}
                >
                  {item.name}
                </Tag>
              )

            })
          }

          {/* 新添加输入框 */}
          {newIptVisible
            ?
            (
              <Input type="text" size="large" className={styles.editInput} autoFocus
                value={newIptValue} onChange={e => setNewIptValue(e.target.value)}
                onBlur={() => handleAddTag()}
                onPressEnter={() => handleAddTag()}
              />
            )
            :
            (
              <Tag
                onClick={() => setNewIptVisible(true)}
                className={styles.tagPlusDashed}>
                <PlusOutlined /> 新标签
              </Tag>
            )
          }
        </Card>
      </PageHeaderWrapper>
    </>
  )
}

export default connect(({ tags, loading }: ConnectState) => ({
  tags,
  loading: loading.effects['tags/query'],
}))(ContentTags)
