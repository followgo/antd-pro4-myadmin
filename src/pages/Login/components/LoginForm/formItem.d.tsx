import { FormItemProps } from 'antd/es/form/FormItem'
import { ILoginContextProps } from './LoginContext'

export interface IFormItemProps extends Partial<FormItemProps> {
    name?: string
    style?: React.CSSProperties
    placeholder?: string
    buttonText?: React.ReactNode
    countDown?: number
    getCaptchaButtonText?: string
    getCaptchaSecondText?: string
    updateActive?: ILoginContextProps['updateActive']
    type?: string
    defaultValue?: string
    customProps?: { [key: string]: unknown }
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    tabUtil?: ILoginContextProps['tabUtil']
}

interface IFormItemOptions {
    rules?: IFormItemProps['rules']
    onChange?: IFormItemProps['onChange']
    initialValue?: IFormItemProps['defaultValue']
}

export function getFormItemOptions({ onChange, defaultValue, customProps = {}, rules }: IFormItemProps): IFormItemOptions {
    const options: IFormItemOptions = {
        rules: rules || (customProps.rules as IFormItemProps['rules']),
    }

    if (onChange) options.onChange = onChange
    if (defaultValue) options.initialValue = defaultValue
    return options
}