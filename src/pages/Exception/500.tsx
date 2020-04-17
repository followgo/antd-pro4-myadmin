import { Link } from 'umi';
import { Result, Button } from 'antd';
import React from 'react';

export default () => (
  <Result
    status="500"
    title="500 Internal Server Error"
    style={{
      background: 'none',
    }}
    subTitle="抱歉，服务器报告了一个错误。"
    extra={
      <Link to="/">
        <Button type="primary">返回首页</Button>
      </Link>
    }
  />
);
