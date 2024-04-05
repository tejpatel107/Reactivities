import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Item, Button, Label, SegmentGroup, Segment, ItemGroup, ItemImage, ItemContent, ItemHeader, ItemDescription, Icon } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

interface Props {
    activity : Activity;
}

function ActivityListItem({activity} : Props) {

    const [target,setTarget] = useState('');
    const {activityStore} = useStore();
    const {deleteAnActivity, loading} = activityStore;
    
    function handleDeleteActivity(e : SyntheticEvent<HTMLButtonElement>, id  : string) {
        setTarget(e.currentTarget.name);
        deleteAnActivity(id);
    }
    return (

        <SegmentGroup>
            <Segment>
                <ItemGroup>
                    <Item>
                        <ItemImage size="tiny" circular src="/assets/user.png"/>
                        <ItemContent>
                            <ItemHeader as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </ItemHeader>
                            <ItemDescription>
                                Hosted by Tej
                            </ItemDescription>
                        </ItemContent>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {activity.date}
                    <Icon name="clock" /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <p>Attendees go here</p>
            </Segment>
            <Segment clearing>
                <span>
                    {activity.description}
                </span>
                <Button as={Link} to={`/activities/${activity.id}`} content="View" 
                color="teal" floated="right"/>
            </Segment>
        </SegmentGroup>

        // <Item key={activity.id}>
        //     <Item.Content >
        //         <Item.Header as='h4'>{activity.title} </Item.Header>
        //         <Item.Meta>{activity.date}</Item.Meta>
        //         <Item.Description>
        //             <div>{activity.description}</div>
        //             <div>{activity.city}, {activity.venue}</div>
        //         </Item.Description>
        //         <Item.Extra>
        //             <Button
        //                 // onClick={() => activityStore.selectActivity(activity.id)} 
        //                 as={Link} to={`/activities/${activity.id}`}
        //                 floated="right"
        //                 content="View"
        //                 color="blue"
        //             />
        //             <Button
        //                 name={activity.id}
        //                 loading={loading && target === activity.id}
        //                 onClick={(e) => handleDeleteActivity(e, activity.id)}
        //                 floated="right" content="Delete" color="red" />
        //             <Label content={activity.category} />
        //         </Item.Extra>
        //     </Item.Content>
        // </Item>
    )
}

export default observer(ActivityListItem);
