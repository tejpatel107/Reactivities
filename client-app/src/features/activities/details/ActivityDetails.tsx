import { Grid, GridColumn } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

function ActivityDetails() {

    const {activityStore} = useStore();
    const {selectedActivity : activity, loadActivity, loadingInitial, clearActivityStore } = activityStore;
    const {id} = useParams();

    useEffect(() => {
        if(id) loadActivity(id); 
        return () => { clearActivityStore(); }
    },[id, loadActivity, clearActivityStore])

    if (loadingInitial || !activity) return <LoadingComponent />;

    return (

        <Grid>
            <GridColumn width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat activityId={activity.id} />
            </GridColumn>
            <GridColumn width={6}>
                <ActivityDetailedSidebar activity={activity}/>
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDetails);