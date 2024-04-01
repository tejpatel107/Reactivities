import React, { useState } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import { observer } from "mobx-react-lite";

function ActivityDahsboard() {

    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore;
    return (
        <Grid>
            <Grid.Column width={'10'}>
                <ActivityList />
            </Grid.Column>
            <GridColumn width={'6'}>
                { selectedActivity && 
                    <ActivityDetails /> }
                { editMode && <ActivityForm/> }
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDahsboard);