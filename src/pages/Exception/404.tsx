import { Link } from 'umi';
import { Result, Button } from 'antd';
import React from 'react';

export default () => (
  <Result
    status="404"
    title="404 Not Found"
    style={{
      background: 'none',
    }}
    subTitle="抱歉，您访问的页面不存在。"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);
