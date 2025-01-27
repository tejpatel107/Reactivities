import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom";
import { Button, Grid, GridColumn, Header } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Activity } from "../../../app/models/activity";

interface Props {
    activity: Activity
}

function ActivityDeleteConfirmation({ activity }: Props) {

    const { modalStore, activityStore: { deleteAnActivity } } = useStore();

    return (
        <Grid style={{ padding: '20px' }} textAlign='center'>
            <GridColumn>
                <Header as='h4'>
                    Are you sure you want to delete this event?
                </Header>
                <Button
                    color='red'
                    content='No'
                    style={{ marginRight: "20px" }}
                    onClick={() => modalStore.closeModal()}
                />
                <Button
                    color='green'
                    content='Yes'
                    onClick={() => {
                        deleteAnActivity(activity.id),
                        modalStore.closeModal()
                    }}
                    as={Link} to={'/activities'}
                />
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDeleteConfirmation);