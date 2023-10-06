import { DataModelItem } from "../types";
import { getNestedValue } from "../helpers";
import { FormikProps } from "formik";
import { Autocomplete, TextField } from "@mui/material";

type FormikAutocompleteProps = {
    formik: FormikProps<any>;
    field: {
        name: string;
        label: string;
        dataType: string;
        fieldType: string;
        value: string;
    };
    dataModel: DataModelItem[];
};


const FormikAutocomplete = ({
    formik,
    field,
    dataModel,
}: FormikAutocompleteProps) => {
    const fieldError = getNestedValue(formik.errors, field.name);
    const touched = getNestedValue(formik.touched, field.name);
    const isError = touched && Boolean(fieldError);

    const dataModelItem = dataModel.find((item) => item.name === field.value) || null;

    return (
        <Autocomplete
            fullWidth
            sx={{
                my: 2,
            }}
            id={field.name}
            options={dataModel}
            getOptionLabel={(option) => option.label}
            value={dataModelItem}
            onChange={(_, value) => {
                formik.setFieldValue(field.name, value?.name || null);
            }}
            onBlur={() => {
                formik.handleBlur(field.name);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={field.label} // Set the label property
                    error={isError} // Set the error prop directly
                    helperText={isError ? fieldError : ""}
                />
            )}
        />
    );
};

export default FormikAutocomplete;