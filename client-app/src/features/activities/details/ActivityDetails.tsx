import React from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity : activity, openForm, cancelSelectActivity} = activityStore;

    if (!activity) return <LoadingComponent />;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <CardContent>
                <CardHeader>{activity.title}</CardHeader>
                <CardMeta>
                    <span className='date'>{activity.date}</span>
                </CardMeta>
                <CardDescription>
                    {activity.description}
                </CardDescription>
            </CardContent>
            <CardContent extra>
                <Button onClick={() => openForm(activity.id)} basic content="Edit" color="blue"/>
                <Button basic content="Cancel" color="grey" 
                onClick={cancelSelectActivity}/>
            </CardContent>
        </Card>
    )
}

export default observer(ActivityDetails);