import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, Form, Tooltip } from 'antd';
import { connect, Dispatch } from 'umi';
import React, { useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Store } from 'antd/es/form/interface'
import { ConnectState } from '@/models/connect';
import { IWebsiteBaseSettings } from '@/services/website-settings';

interface IBaseSettingsProps {
  loading?: boolean
  baseSettings: IWebsiteBaseSettings
  dispatch: Dispatch
}

const BaseSettings: React.FC<IBaseSettingsProps> = ({ loading, baseSettings, dispatch }) => {
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 7 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, md: { span: 10 } },
  }
  const submitFormLayout = {
    wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 } }
  }

  useEffect(() => {
    dispatch({ type: 'website_base/fetch' })
  }, [])

  useEffect(() => form.setFieldsValue(baseSettings), [baseSettings])

  const onFinish = (values: Store) => {
    dispatch({ type: 'website_base/update', payload: values })
  }

  return (
    <PageHeaderWrapper title={false}>
      <Form style={{ marginTop: 8 }} form={form} name="basic" onFinish={onFinish}>

        <Form.Item {...formItemLayout} name="global_title_suffix" label={
          <span>全局标题后缀&nbsp;
              <Tooltip title="一般使用组织简称"><QuestionCircleOutlined /></Tooltip>
          </span>
        }>
          <Input placeholder=" - 地球" style={{ display: 'inline-block', width: 'calc(50%)' }} />
        </Form.Item>

        <Form.Item {...formItemLayout} label="根URL" name="root_url" rules={[
          { required: true, message: '请输入根URL' },
        ]}>
          <Input placeholder="https://www.xx.xx" />
        </Form.Item>

        <Form.Item {...formItemLayout} label="版权声明" name="copyright_notice">
          <Input placeholder="©2019 xx Co. Ltd., All rights reserved." />
        </Form.Item>

        <Form.Item  {...formItemLayout} label="ICP备案" style={{ marginBottom: 0 }}>
          <Form.Item name="icp_record_number" style={{ display: 'inline-block', width: 'calc(40% - 8px)' }}>
            <Input placeholder="京ICP备04000001号" />
          </Form.Item>
          <Form.Item name="icp_record_url" style={{ display: 'inline-block', width: 'calc(60% - 1px)', marginLeft: '8px' }}>
            <Input placeholder="http://www.beian.miit.gov.cn/" />
          </Form.Item>
        </Form.Item>

        <Form.Item {...formItemLayout} name="head_rawcode" label={
          <span>全局 head 代码
              <Tooltip title="此代码会插入到页面的 </head> 前"><QuestionCircleOutlined /></Tooltip>
          </span>
        }>
          <Input.TextArea style={{ minHeight: 32 }} rows={6} />
        </Form.Item>

        <Form.Item {...formItemLayout} name="body_rawcode" label={
          <span>全局 body 代码
              <Tooltip title="此代码会插入到页面的 </body> 前"><QuestionCircleOutlined /></Tooltip>
          </span>
        }>
          <Input.TextArea style={{ minHeight: 32 }} rows={6} />
        </Form.Item>

        <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            更新
          </Button>
        </Form.Item>
      </Form>
    </PageHeaderWrapper>
  )
}

export default connect(({ website_base, loading }: ConnectState) => ({
  baseSettings: website_base,
  loading: loading.effects['website_base/fetch'] || loading.effects['website_base/update'],
}))(BaseSettings)
