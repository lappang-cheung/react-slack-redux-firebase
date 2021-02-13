// Required Packages
import React from 'react';
import { Grid, Header, Icon, Image, Dropdown } from 'semantic-ui-react';
import { connect } from "react-redux";
import styled from 'styled-components'

// Custom Package
import firebase from '../../../server/firebase';

// Styled Components
const StyledUIGridRow = styled(Grid.Row)`
    padding : 1.3rem;
`
const StyledUIDisplayName = styled(Header)`
    padding : .25rem;
`

const UserInfo = (props) => {
    // Sign out opt
    const getDropDownOptions = () => {
        return [{
            key: 'signout',
            text: <span onClick={signOut} >Sign Out</span>
        }]
    }
    // Signout func
    const signOut = () => {
        firebase.auth()
            .signOut()
            .then(() => console.log("user signed out"));
    }
    //  Check user exist before render
    if (props.user) {
        return (<Grid>
            <Grid.Column>
                <StyledUIGridRow>
                    <Header inverted as="h2">
                        <Icon name="slack" />
                        <Header.Content>Slack</Header.Content>
                    </Header>
                    <StyledUIDisplayName inverted as="h4">
                        <Dropdown
                            trigger={
                                <span>
                                    <Image src={props.user.photoURL} avatar></Image>
                                    {props.user.displayName}
                                </span>
                            }
                            options={getDropDownOptions()}
                        >
                        </Dropdown>

                    </StyledUIDisplayName>
                </StyledUIGridRow>
            </Grid.Column>
        </Grid>)
    }
    return null;
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(UserInfo);