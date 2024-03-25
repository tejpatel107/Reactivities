import React from "react";
import { Grid, GridColumn, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities : Activity[];
    selectedActivity : Activity | undefined;
    selectActivity: (id : string) => void;
    cancelSelectActivity: () => void;
    editMode : boolean;
    openForm : (id:string) => void;
    closeForm : () => void;
    createOrEdit : (activity: Activity)  => void;
    deleteActivity : (id: string)  => void;
}

export default function ActivityDahsboard({activities, selectedActivity, selectActivity, cancelSelectActivity, editMode, openForm, closeForm, createOrEdit, deleteActivity} : Props) {
    return (
        <Grid>
            <Grid.Column width={'10'}>
                <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity = {deleteActivity}/>
            </Grid.Column>
            <GridColumn width={'6'}>
                { selectedActivity && 
                    <ActivityDetail 
                        activity={selectedActivity} 
                        cancelSelectActivity={cancelSelectActivity} 
                        openForm={openForm} /> }
                { editMode && <ActivityForm closeForm={closeForm} activity={selectedActivity}  createOrEdit={createOrEdit} /> }
            </GridColumn>
        </Grid>
    )
}