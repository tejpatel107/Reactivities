import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Item, Button, Label, SegmentGroup, Segment, ItemGroup, ItemImage, ItemContent, ItemHeader, ItemDescription, Icon } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { format } from 'date-fns';
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    activity: Activity;
}

function ActivityListItem({ activity }: Props) {

    const [target, setTarget] = useState('');
    const { activityStore } = useStore();
    const { deleteAnActivity, loading } = activityStore;

    function handleDeleteActivity(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteAnActivity(id);
    }
    return (

        <SegmentGroup>
            <Segment>
                <ItemGroup>
                    <Item>
                        <ItemImage size="tiny" circular src="/assets/user.png" />
                        <ItemContent>
                            <ItemHeader as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </ItemHeader>
                            <Item.Description>
                                Hosted by {activity.host?.displayName}
                            </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color="green">
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </ItemContent>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name="clock" /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!}/>
            </Segment>
            <Segment clearing>
                <span>
                    {activity.description}
                </span>
                <Button as={Link} to={`/activities/${activity.id}`} content="View"
                    color="teal" floated="right" />
            </Segment>


            {/* <Item key={activity.id}>
                <Item.Content >
                    <Item.Header as='h4'>{activity.title} </Item.Header>
                    <Item.Meta>{activity.date}</Item.Meta>
                    <Item.Description>
                        <div>{activity.description}</div>
                        <div>{activity.city}, {activity.venue}</div>
                    </Item.Description>
                    <Item.Extra>
                        <Button
                            // onClick={() => activityStore.selectActivity(activity.id)} 
                            as={Link} to={`/activities/${activity.id}`}
                            floated="right"
                            content="View"
                            color="blue"
                        />
                        <Button
                            name={activity.id}
                            loading={loading && target === activity.id}
                            onClick={(e) => handleDeleteActivity(e, activity.id)}
                            floated="right" content="Delete" color="red" />
                        <Label content={activity.category} />
                    </Item.Extra>
                </Item.Content>
            </Item> */}
        </SegmentGroup>
    )
}

export default observer(ActivityListItem);
