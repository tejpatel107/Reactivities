import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity : activity, loadActivity, loadingInitial } = activityStore;
    const {id} = useParams();

    useEffect(() => {
        if(id) loadActivity(id); 
    },[id, loadActivity])

    if (loadingInitial || !activity) return <LoadingComponent />;

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
                <Button as={Link} to={`/EditActivity/${activity.id}`} basic content="Edit" color="blue"/>
                <Button basic content="Cancel" color="grey" as={Link}  to="/activities"/>
            </CardContent>
        </Card>
    )
}

export default observer(ActivityDetails);