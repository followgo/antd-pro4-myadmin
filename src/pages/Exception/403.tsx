import { Link } from 'umi';
import { Result, Button } from 'antd';
import React from 'react';

export default () => (
  <Result
    status="403"
    title="403 Forbidden"
    style={{
      background: 'none',
    }}
    subTitle="抱歉，您没有访问此页面的权限。"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);
