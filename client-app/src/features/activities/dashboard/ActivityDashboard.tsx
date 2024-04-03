import { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";

function ActivityDahsboard() {

    const {activityStore} = useStore();
    const {loadActivities, activityRegistery} = activityStore;

    useEffect(() => {
        if (activityRegistery.size <= 1) loadActivities();
      }, [loadActivities,activityRegistery.size]);
    
    if(activityStore.loading) return <LoadingComponent content="Loading app" />; 

    return (
        <Grid>
            <Grid.Column width={'10'}>
                <ActivityList />
            </Grid.Column>
            <GridColumn width={'6'}>
                <h2>Activity filters</h2>
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDahsboard);