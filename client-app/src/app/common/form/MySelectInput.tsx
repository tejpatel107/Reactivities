import { useField } from "formik";
import { Label, Select } from "semantic-ui-react";
import Form from "semantic-ui-react/dist/commonjs/collections/Form";

interface Props {
    placeholder: string,
    name: string,
    options: {text: string, value: string}[], 
    label?: string,
}

export default function MySelectInput(props: Props) {

    const [field, meta, helpers] = useField(props.name);

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select 
                clearable
                options={props.options}
                placeholder={props.placeholder}
                value = {field.value || null}
                onChange={(_, data) => {
                    helpers.setValue(data.value);
                }}            
                onBlur={()=>{helpers.setTouched(true)}}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}   