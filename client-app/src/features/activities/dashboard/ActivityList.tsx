import { SyntheticEvent, useState } from 'react';
import { Button, Item, ItemGroup, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

function ActivityList(){

    const [target,setTarget] = useState('');
    const {activityStore} = useStore();
    const {deleteAnActivity, activitiesByDate, loading} = activityStore;
    function handleDeleteActivity(e : SyntheticEvent<HTMLButtonElement>, id  : string) {
        setTarget(e.currentTarget.name);
        deleteAnActivity(id);
    }
    return (
        <Segment>
            <ItemGroup divided>
                {activitiesByDate.map(activity => (
                    <Item.Content key={activity.id}>
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
                                loading={loading && target ===  activity.id}
                                onClick={(e)=>handleDeleteActivity(e,activity.id)} 
                                floated="right" content="Delete" color="red"/>
                            <Label content={activity.category} />
                        </Item.Extra>
                    </Item.Content>
                ))}
            </ItemGroup>            
        </Segment>
    )
}

export default observer(ActivityList);