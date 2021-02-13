//  Required Packages
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import styled from 'styled-components'

// Styled Components
const StyledDimmer = styled(Dimmer)`
    background-color: rgba(0, 0, 0, 1) !important;
`

export const AppLoader = (props) => {
    return (
        <StyledDimmer active={props.loading}>
            <Loader size="huge" content="Loading..." />
        </StyledDimmer>
    )
}