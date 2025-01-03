import { observer } from 'mobx-react-lite'
import { List, Image, Popup } from 'semantic-ui-react'
import { Profile } from '../../../app/models/Profile'
import { Link } from 'react-router-dom'
import ProfileCard from '../../profile/ProfileCard'

interface Props {
    attendees: Profile[]
}

function ActivityListItemAttendee({ attendees }: Props) {
    return (

        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                            <Image size='mini' circular src='assets/user.png' />
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