import { Grid , Header, Icon, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'

const UserInfo = props => {

    if (props.user){
        return(
            <Grid>
                <Grid.Column>
                    <Grid.Row>
                        <Header inverted as="h2">
                            <Icon name="slack"/>
                            <Header.Content>Slack</Header.Content>
                        </Header>
                        <Header inverted as="h4">
                            <span>
                                <Image src={props.user.photoURL} avatar/>
                                {props.user.displayName}
                            </span>
                        </Header>
                    </Grid.Row>
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