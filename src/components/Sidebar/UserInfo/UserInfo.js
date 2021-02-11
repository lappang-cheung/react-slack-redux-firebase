import { Grid , Header, Icon, Image, Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import firebase from '../../../server/firebase'

const UserInfoGridRow = styled(Grid.Row)`
    padding: 1.2rem;
`

const UserInfoHeaderDisplay = styled(Header)`
    padding: 1.2rem;
`

const UserInfo = props => {

    const getDropDownOptions = () => {
        return [{
            key: 'signout',
            text: <span onClick={signOut}>Sign Out</span>
        }]
    }

    const signOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("user has signed out"))
    }
    
    if (props.user){
        return(
            <Grid>
                <Grid.Column>
                    <UserInfoGridRow>
                        <Header inverted as="h2">
                            <Icon name="slack"/>
                            <Header.Content>Slack</Header.Content>
                        </Header>
                        <UserInfoHeaderDisplay inverted as="h4">
                            <Dropdown
                                trigger={
                                    <span>
                                        <Image src={props.user.photoURL} avatar/>
                                        {props.user.displayName}
                                    </span>
                                }
                                options={getDropDownOptions()}
                            />
                        </UserInfoHeaderDisplay>
                    </UserInfoGridRow>
                </Grid.Column>
            </Grid>
        )
    }
    return null    
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(UserInfo)