import React, { useState } from 'react'
import { Alert, Checkbox } from 'antd'
import { connect, Dispatch } from 'umi'
import { StateType } from '@/models/login'
import { LoginParamsType } from '@/services/login'
import { ConnectState } from '@/models/connect'

import styles from './style.less'
