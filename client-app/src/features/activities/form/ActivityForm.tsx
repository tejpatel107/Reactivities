import React, { ChangeEvent, useState } from "react";
import { Button, Form, FormInput, FormTextArea, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activity : Activity | undefined;
    closeForm : () => void;
    createOrEdit : (activity : Activity) => void;
}

export default function ActivityForm({activity: selectedActivity, closeForm, createOrEdit} : Props) {
    
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    } 
    
    const [activity, setActivity] = useState<Activity>(initialState);

    function handleSubmit () {
        createOrEdit(activity);
    }

    function handleChangeEvent(event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <FormInput placeholder="Title" 
                name="title" value={activity.title} onChange={handleChangeEvent}/>
                <FormTextArea placeholder="Description" 
                name="description" value={activity.description} onChange={handleChangeEvent}/>
                <FormInput placeholder="Category" 
                name="category" value={activity.category} onChange={handleChangeEvent}/>
                <FormInput placeholder="Date" 
                name="date" value={activity.date} onChange={handleChangeEvent}/>
                <FormInput placeholder="City" 
                name="city" value={activity.city} onChange={handleChangeEvent}/>
                <FormInput placeholder="Venue" 
                name="venue" value={activity.venue} onChange={handleChangeEvent}/>
                <Button floated="right" positive type= 'submit' content='Submit' />
                <Button onClick={closeForm} floated="right" type= 'button' content='Cancel' />
            </Form>
        </Segment>
    )
}