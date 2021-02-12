import { connect } from 'react-redux'
import { Menu, Icon } from 'semantic-ui-react'

import { setChannel } from '../../../store/actions/actionCreator'

const FavouriteChannels = (props) => {

    const displayChannels = () => {
        if (Object.keys(props.favouriteChannels.length > 0)) {
            return Object.keys(props.favouriteChannels).map(channelId => {
                return <Menu.Item 
                    key={channelId}
                    name={props.favouriteChannels[channelId]}
                    onClick={() => props.selectChannel({ 
                        id: channelId, 
                        name: props.favouriteChannels[channelId]}
                    )}
                    active={props.channel && channelId === props.channel.id}
                >
                    {"# " + props.favouriteChannels[channelId]}
                </Menu.Item>
            })
        }
    }

    return (
        <Menu.Menu>
            <Menu.Item>
                <span>
                    <Icon name="mail" /> Channel
                </span>
                ({Object.keys(props.favouriteChannels).length})
            </Menu.Item>
            {displayChannels()}
        </Menu.Menu>
    )
}

const mapStateToProps = state => {
    return {
        channel: state.channel.currentChannel,
        favouriteChannels: state.favouriteChannel
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectChannel: channel => dispatch(setChannel(channel))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteChannels)