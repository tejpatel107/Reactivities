import { useField } from "formik";
import { Label } from "semantic-ui-react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import { values } from "mobx";

interface Props {
    placeholder: string,
    name: string,
    label?: string,
}

export default function MyDateInput(props: Partial<ReactDatePickerProps>) {

    const [field, meta, helpers] = useField(props.name!);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <ReactDatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}   