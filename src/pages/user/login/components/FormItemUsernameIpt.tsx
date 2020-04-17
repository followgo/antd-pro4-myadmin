import { Button, Col, Input, Row, Form, message } from 'antd'
import React, { useState, useCallback, useEffect } from 'react'
import omit from 'omit.js'
import { FormItemProps } from 'antd/es/form/FormItem'
import { getFakeCaptcha } from '@/services/login'

import ItemMap from './map'
import LoginContext, { LoginContextProps } from './LoginContext'
import styles from './index.less'


export interface IProps extends Partial<FormItemProps> {
    name?: string
    style?: React.CSSProperties
    placeholder?: string
    buttonText?: React.ReactNode
    countDown?: number
    getCaptchaButtonText?: string
    getCaptchaSecondText?: string
    updateActive?: LoginContextProps['updateActive']
    type?: string
    defaultValue?: string
    customProps?: { [key: string]: unknown }
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    tabUtil?: LoginContextProps['tabUtil']
}

const getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }: IProps) => {
    const options: {
        rules?: IProps['rules']
        onChange?: IProps['onChange']
        initialValue?: IProps['defaultValue']
    } = {
        rules: rules || (customProps.rules as IProps['rules']),
    }

    if (onChange) options.onChange = onChange
    if (defaultValue) options.initialValue = defaultValue
    return options
};

const FormItemUsernameIpt: React.FC<IProps> = (props) => {
    const [count, setCount] = useState<number>(props.countDown || 0)
    const [timing, setTiming] = useState(false)

    useEffect(() => {
        let interval: number = 0;
        if (timing) {
            interval = window.setInterval(() => {
                setCount((preSecond) => {
                    if (preSecond <= 1) {
                        setTiming(false);
                        clearInterval(interval);
                        // 重置秒数
                        return props.countDown || 60;
                    }
                    return preSecond - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timing]);
    if (!props.name) {
        return null;
    }

    const otherProps = restProps || {}
    return (
        <FormItem name={name} {...options}>
            <Input {...customProps} {...otherProps} />
        </FormItem>
    );
}