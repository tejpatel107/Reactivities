import { observer } from 'mobx-react-lite'
import { List, Image, Popup } from 'semantic-ui-react'
import { Profile } from '../../../app/models/Profile'
import { Link } from 'react-router-dom'
import ProfileCard from '../../profile/ProfileCard'

interface Props {
    attendees: Profile[]
}

function ActivityListItemAttendee({ attendees }: Props) {

    const styles = {
        borderColor: 'blue',
        borderWidth: 3
    }

    return (

        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                            <Image 
                                size='mini' 
                                circular 
                                bordered
                                style = {attendee.following ? styles : null}
                                src={attendee.image || 'assets/user.png'} />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>



    )
}

export default observer(ActivityListItemAttendee);