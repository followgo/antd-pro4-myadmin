import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, Form, Tooltip } from 'antd';
import { connect, Dispatch } from 'umi';
import React from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Store } from 'antd/es/form/interface'

interface IBaseSettingsProps {
  submitting: boolean
  dispatch: Dispatch
}

const BaseSettings: React.FC<IBaseSettingsProps> = ({ submitting, dispatch }) => {
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 7 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, md: { span: 10 } },
  }
  const submitFormLayout = {
    wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 } }
  }

  const onFinish = (values: Store) => {
    dispatch({
      type: 'formBasicForm/submitRegularForm',
      payload: values,
    })
  }

  return (
    <PageHeaderWrapper title={false}>
      <Form style={{ marginTop: 8 }} form={form} name="basic" initialValues={{ public: '1' }} onFinish={onFinish}>

        <Form.Item {...formItemLayout} label="标题" name="title" rules={[
          { required: true, message: '请输入标题' },
        ]}>
          <Input />
        </Form.Item>

        <Form.Item {...formItemLayout} name="keywords" label={
          <span>
            SEO关键字<Tooltip title="3-5个关键字，使用英文逗号分割"><QuestionCircleOutlined /></Tooltip>
          </span>
        }>
          <Input />
        </Form.Item>

        <Form.Item {...formItemLayout} name="description" label="SEO描述">
          <Input.TextArea style={{ minHeight: 24 }} rows={4} />
        </Form.Item>

        <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            更新
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  )
}

export default BaseSettings
