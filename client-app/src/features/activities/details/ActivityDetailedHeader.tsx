import { observer } from 'mobx-react-lite';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react'
import { Activity } from "../../../app/models/activity";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';
import ActivityDeleteConfirmation from '../form/ActivityDeleteConfirmation';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

function ActivityDetailedHeader({ activity }: Props) {

    const { activityStore, modalStore } = useStore();
    const { updateAttendance, loading, cancelActivity} = activityStore;
    const { openModal } = modalStore;
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {activity.isCancelled &&
                    <Label style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }} ribbon color="red" content="Canceled" />
                }
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle} />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by                                         <Link to={`/profiles/${activity.host?.username}`}>
                                        {activity.host?.displayName}
                                    </Link>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <>
                        <Button.Group>
                            <Button
                                color={activity.isCancelled ? 'green' : 'red'}
                                content={activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity'}
                                floated='left'
                                basic
                                onClick={cancelActivity}
                                loading={loading}
                            />
                            <Button
                                icon='trash'
                                color='red'
                                onClick={() => 
                                    openModal(<ActivityDeleteConfirmation activity={activity}/>)}
                            />
                        </Button.Group>
                        <Button
                            color='orange'
                            floated='right'
                            as={Link} to={`/ManageActivity/${activity.id}`}
                            disabled={activity.isCancelled}
                        >
                            Manage Event
                        </Button>
                    </>

                ) : activity.isGoing ? (
                    <Button loading={loading} onClick={updateAttendance} >
                        Cancel attendance</Button>
                ) : (
                    <Button
                        loading={loading}
                        onClick={updateAttendance}
                        color='teal'
                        disabled={activity.isCancelled}
                    >
                        Join Activity</Button>
                )
                }
            </Segment >
        </Segment.Group >
    )
}

export default observer(ActivityDetailedHeader);