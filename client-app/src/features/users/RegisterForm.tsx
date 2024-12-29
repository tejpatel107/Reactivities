import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationError from '../errors/ValidationError';

function RegisterForm() {

    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch((error) => { setErrors({error}) })}
            validationSchema={Yup.object({
                displayName: Yup.string().required('Please enter a display name'),
                username: Yup.string().required('Please enter a username'),
                email: Yup.string().required('Please enter an email'),
                password: Yup.string().required('Please enter a password'),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) =>
            (<Form className='ui form error' onSubmit={handleSubmit} autoComplete='off' >
                <Header as='h2' content="Sign up to Reactivities!" color='teal' textAlign='center' />
                <MyTextInput placeholder='Display Name' name='displayName' />
                <MyTextInput placeholder='Username' name='username' />
                <MyTextInput placeholder='email' name='email' />
                <MyTextInput placeholder='password' name='password' type="password" />
                <ErrorMessage
                    name='error'
                    render={() => 
                        <ValidationError errors={errors.error as unknown as string[]}/>
                    }
                />
                <Button
                    disabled={!isValid || !dirty || isSubmitting}
                    loading={isSubmitting}
                    positive content="Sing Up"
                    type="submit" fluid />
            </Form>
            )}
        </Formik >
    )
}

export default observer(RegisterForm);