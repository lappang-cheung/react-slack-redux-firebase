import { Menu } from 'semantic-ui-react'
import styled  from 'styled-components'

import UserInfo from './UserInfo/UserInfo'

const SideMenu = styled(Menu)`
    background: #4c3c4c !important;
    font-size: 1.2rem !important;
`

const Sidebar = () => {
    return (
        <SideMenu vertical fixed="left" borderless size="large">
            <UserInfo />
        </SideMenu>
    )
}

export default Sidebar