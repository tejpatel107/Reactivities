import { observer } from 'mobx-react-lite'
import { List, Image } from 'semantic-ui-react'
import { Profile } from '../../../app/models/Profile'
import { Link } from 'react-router-dom'

interface Props {
    attendees: Profile[]
}

function ActivityListItemAttendee({ attendees }: Props) {
    return (

        <List horizontal>
            <List.Item >
                <Image size='mini' circular src='assets/user.png' />
            </List.Item>
            <List.Item >
                <Image size='mini' circular src='assets/user.png' />
            </List.Item><List.Item >
                <Image size='mini' circular src='assets/user.png' />
            </List.Item>
        </List>
        // <List horizontal>
        //     {attendees.map(attendee => (
        //             <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
        //                 <Image size='mini' circular src='assets/user.png' />
        //             </List.Item>
        //     ))}
        // </List>
    )
}

export default observer(ActivityListItemAttendee);