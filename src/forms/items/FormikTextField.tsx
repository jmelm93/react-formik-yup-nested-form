import { FormikProps } from "formik";
import { TextField } from "@mui/material";
import { getNestedValue } from "../helpers";

type FormikTextFieldProps = {
    formik: FormikProps<any>;
    field: {
        name: string;
        label: string;
        dataType: string;
        fieldType: string;
        value: string;
    };
};

const FormikTextField = ({ formik, field }: FormikTextFieldProps) => {
    const fieldError = getNestedValue(formik.errors, field.name);
    const touched = getNestedValue(formik.touched, field.name);

    return (
        <TextField
            fullWidth
            sx={{
                my: 2,
            }}
            id={field.name}
            name={field.name}
            label={field.label}
            value={field.value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={touched && Boolean(fieldError)}
            helperText={touched && fieldError ? (fieldError as string) : ""}
        />
    );
};

export default FormikTextField;