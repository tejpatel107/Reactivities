import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form} from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { v4 as uuid } from 'uuid';

function ActivityForm() {

    const { activityStore } = useStore();
    const { createAnActivity, updateAnActivity,
        loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: null,
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title : Yup.string().required("The activity title is required!"),
        description : Yup.string().required("The activity description is required!"),
        city : Yup.string().required(),
        date : Yup.string().required("Date is required"),
        venue : Yup.string().required(),
        category : Yup.string().required()
    })

    useEffect(() => {
        if (id) loadActivity(id).then((activity) => setActivity(activity!));
    }, [id, loadActivity]);

    function handleFormSubmit (activity : Activity) {
        if(!activity.id){
            activity.id=uuid();
            createAnActivity(activity).then(()=>navigate(`/activities/${activity.id}`));
        } else {
            updateAnActivity(activity).then(()=>navigate(`/activities/${activity.id}`));
        }
    }

    if (loadingInitial) return <LoadingComponent content="loading activity ..." />;

    return (
        <Segment clearing>
            <Header content="Activity Details" sub color="teal"/>
            <Formik
                validationSchema={validationSchema} 
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder="Title" name="title" />
                        <MyTextArea rows={3} placeholder="Description" name="description" />
                        <MySelectInput placeholder="Category" name="category" options={categoryOptions} />
                        <MyDateInput 
                            name="date" 
                            placeholderText="Date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content="Locations Details" sub color="teal"/>
                        <MyTextInput placeholder="City" name="city" />
                        <MyTextInput placeholder="Venue" name="venue" />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated="right" positive type='submit' content='Submit' />
                        <Button floated="right" type='button' content='Cancel' as={Link} to="/activities" />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
}

export default observer(ActivityForm);