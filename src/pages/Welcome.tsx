import React from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, } from 'antd'
import CodePreview from '@/components/CodePreview'

export default (): React.ReactNode => (
  <PageHeaderWrapper title={false}>
    <Card>
      <CodePreview>Hello UmiJS</CodePreview>
    </Card>
  </PageHeaderWrapper>
)
