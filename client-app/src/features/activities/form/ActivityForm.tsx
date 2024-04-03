import { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, FormInput, FormTextArea, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from  "uuid";

function ActivityForm() {
    
    const {activityStore} = useStore();
    const {createAnActivity, updateAnActivity, 
        loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();
    
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(id) loadActivity(id).then((activity)=>setActivity(activity!));
    },[id, loadActivity]);
    
    function handleSubmit () {
        if(!activity.id){
            activity.id=uuid();
            createAnActivity(activity).then(()=>navigate(`/activities/${activity.id}`));
        } else {
            updateAnActivity(activity).then(()=>navigate(`/activities/${activity.id}`));
        }
    }

    function handleChangeEvent(event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    if  (loadingInitial) return <LoadingComponent content="loading activity ..."/>;

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off' >
                <FormInput placeholder="Title" 
                name="title" value={activity.title} onChange={handleChangeEvent}/>
                <FormTextArea placeholder="Description" 
                name="description" value={activity.description} onChange={handleChangeEvent}/>
                <FormInput placeholder="Category" 
                name="category" value={activity.category} onChange={handleChangeEvent}/>
                <FormInput placeholder="Date" 
                name="date" type="date" value={activity.date} onChange={handleChangeEvent}/>
                <FormInput placeholder="City" 
                name="city" value={activity.city} onChange={handleChangeEvent}/>
                <FormInput placeholder="Venue" 
                name="venue" value={activity.venue} onChange={handleChangeEvent}/>
                <Button loading={loading} floated="right" positive type= 'submit' content='Submit' />
                <Button  floated="right" type= 'button' content='Cancel' as={Link}  to="/activities" />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);