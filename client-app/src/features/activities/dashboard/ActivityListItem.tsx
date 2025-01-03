import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Item, Button, Label, SegmentGroup, Segment, ItemGroup, ItemImage, ItemContent, ItemHeader, ItemDescription, Icon } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from 'date-fns';
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    activity: Activity;
}

function ActivityListItem({ activity }: Props) {

    return (

        <SegmentGroup>
            <Segment>
                {activity.isCancelled && 
                    <Label color="red" style = {{textAlign : 'center'}} attached="top" content = "cancelled" />
                }
                <ItemGroup>
                    <Item>
                        <ItemImage style={{marginBottom: 3}} size="tiny" circular src="/assets/user.png" />
                        <ItemContent>
                            <ItemHeader as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </ItemHeader>
                            <ItemDescription>
                                Hosted by {activity.host?.displayName}
                            </ItemDescription>
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
        </SegmentGroup>
    )
}

export default observer(ActivityListItem);
