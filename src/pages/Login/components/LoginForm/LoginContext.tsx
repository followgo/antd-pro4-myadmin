import { createContext } from 'react'

export interface ILoginContextProps {
    tabUtil?: {
        addTab: (id: string) => void
        removeTab: (id: string) => void
    };
    updateActive?: (activeItem: { [key: string]: string } | string) => void
}

const props: ILoginContextProps = {}
const LoginContext: React.Context<ILoginContextProps> = createContext(props)
export default LoginContext