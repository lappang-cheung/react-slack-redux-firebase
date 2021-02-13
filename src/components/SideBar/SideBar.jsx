//  Required Packages
import React from 'react';
import { Menu } from 'semantic-ui-react';
import styled from 'styled-components'

// Custom Components
import UserInfo from './UserInfo/UserInfo';
import Channels from './Channels/Channels';
import PrivateChat from './PrivateChat/PrivateChat';
import FavouriteChannels from './FavouriteChannels/FavouriteChannels';

// Styled Components
const StyledSideBar = styled(Menu)`
    background : #4c3c4c !important;
    font-size : 1.2rem  !important;
    overflow-y: auto;
`

// Sidebar component
export const SideBar = () => {
    return (
    <StyledSideBar 
        vertical fixed='left' 
        borderless size='large' 
        className='side_bar'
    >
        <UserInfo />
        <FavouriteChannels />
        <Channels />
        <PrivateChat />
    </StyledSideBar>
    )
}