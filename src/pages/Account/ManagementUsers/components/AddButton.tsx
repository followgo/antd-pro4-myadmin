import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

interface AddButtonProps {
    onClick: () => void,
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
    return (
        <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} onClick={onClick}>
            <PlusOutlined /> 添加
        </Button>
    )
}

export default AddButton