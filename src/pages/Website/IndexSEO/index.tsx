import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, Form, Tooltip, Card } from 'antd';
import { connect, Dispatch } from 'umi';
import React, { useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Store } from 'antd/es/form/interface'
import { ConnectState } from '@/models/connect';
import { IWebsiteIndexSEO } from '@/services/website-settings';

interface IBaseSettingsProps {
  loading?: boolean
  seo: IWebsiteIndexSEO
  dispatch: Dispatch
}

const IndexSEO: React.FC<IBaseSettingsProps> = ({ loading, seo, dispatch }) => {
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 7 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, md: { span: 10 } },
  }
  const submitFormLayout = {
    wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 } }
  }

  useEffect(() => {
    dispatch({ type: 'website_indexseo/fetch' })
  }, [])

  useEffect(() => form.setFieldsValue(seo), [seo])

  const onFinish = (values: Store) => {
    dispatch({ type: 'website_indexseo/update', payload: values })
  }

  return (
    <PageHeaderWrapper title={false}>
      <Card>
        <Form style={{ marginTop: 8 }} form={form} name="basic" onFinish={onFinish}>

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
            <Button type="primary" htmlType="submit" loading={loading}>
              更新
          </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(({ website_indexseo, loading }: ConnectState) => ({
  seo: website_indexseo,
  loading: loading.effects['website_indexseo/fetch'] || loading.effects['website_indexseo/update'],
}))(IndexSEO)
