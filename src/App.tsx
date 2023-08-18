import * as Yup from 'yup';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import { useFormik, FormikProps } from "formik";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";


const dataModels: DataModel = {
  "typeOptions":[
    { "name": null, "label": "" },
    {"name":"date","label":"date"},
    {"name":"string","label":"string"},
    {"name":"number","label":"number"}
  ],
  "jobTypes": [
    { "name": null, "label": "" },
    { "name": "summarizedByDateAggregation", "label": "summarizedByDateAggregation" },
    { "name": "dataGrid", "label": "dataGrid" },
    { "name": "gaCategories", "label": "gaCategories" }
  ]
}


const getNestedValue = (obj: any, path: string) => {
  // Helper function to get nested field value when you have a string path
  // e.g., "schemaList[0].secondLevel[0].name"
  return path
    .split(/[\[\].]+/)
    .reduce((o, k) => (o || {})[k], obj) 
    || undefined;
};

type DataModel = {
  [key: string]: DataModelItem[];
}

type DataModelItem = {
  label: string;
  name: string | null;
  type?: string;
};

type FormikAutocompleteProps = {
  formik: FormikProps<any>;
  field: {
    name: string;
    label: string;
    dataType: string;
    fieldType: string;
  };
  dataModel: DataModelItem[];
};

type FormikTextFieldProps = {
  formik: FormikProps<any>;
  field: {
    name: string;
    label: string;
    dataType: string;
    fieldType: string;
  };
};

const FormikTextField = ({ formik, field }: FormikTextFieldProps) => {
  const fieldError = getNestedValue(formik.errors, field.name);
  const touched = getNestedValue(formik.touched, field.name);

  return (
    <TextField
      fullWidth
      sx={{
        my: 2
      }}
      id={field.name}
      name={field.name}
      label={field.label}
      value={formik.values[field.name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={touched && Boolean(fieldError)}
      helperText={touched && fieldError ? fieldError as string : ''}
    />
  );
};


const FormikAutocomplete = ({ formik, field, dataModel }: FormikAutocompleteProps) => {
  const fieldError = getNestedValue(formik.errors, field.name);
  const touched = getNestedValue(formik.touched, field.name);
  const isError = touched && Boolean(fieldError);

  const fieldValue = getNestedValue(formik.values, field.name);
  const dataModelItem = dataModel.find((item) => item.name === fieldValue) || null;

  return (
    <Autocomplete
      fullWidth
      sx={{
        my: 2
      }}
      id={field.name}
      options={dataModel}
      getOptionLabel={(option) => option.label}
      value={dataModelItem}

      onChange={(_, value) => {
        formik.setFieldValue(field.name, value?.name || null)
      }}
      onBlur={() => {
        formik.handleBlur(field.name);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={field.label} // Set the label property
          error={isError} // Set the error prop directly
          helperText={isError ? fieldError : ''}
        />
      )}
    />
  );
};


const validationSchema = Yup.object().shape({
  tableConfig: Yup.string().required('Required'),
  schemaList: Yup.array().of(
    Yup.object().shape({
      jobTypes: Yup.string().required('Required'),
      config: Yup.string().required('Required'),
      secondLevel: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Required'),
          type: Yup.string().required('Required'),
          thirdLevel: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required('Required'),
              type: Yup.string().required('Required'),
            })
          ),
        })
      ),
    })
  ),
});

type StaticMultiLevelFormProps = {
  dataModel?: DataModel;
};

const App = ({ dataModel = dataModels }: StaticMultiLevelFormProps) => {
  const initialValues = {
    tableConfig: "",
    schemaList: [
      {
        jobTypes: "",
        config: "",
        secondLevel: [
          {
            name: "",
            type: "",
            thirdLevel: [
              { 
                name: "", 
                type: "" 
              }
            ],
          },
        ],
      },
    ],
  };


  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log("submitting formik values:", values);
    },
  });


  const handleRemoveField = (removeIndex: number, fieldName: string, formik: any) => {
    const newFieldValue = (formik.values[fieldName] || []).filter(
      (_: any, i: number) => i !== removeIndex
    );
    formik.setFieldValue(fieldName, newFieldValue);
  };


  const handleAddField = (fieldName: string, formik: FormikProps<any>) => {
    const pattern: RegExp = /\[(\d+)\]/g;
    const fieldNameForInit = fieldName.replace(pattern, '[0]');
    const newObjectWithInitialValues = JSON.parse(JSON.stringify(getNestedValue(formik.initialValues, fieldNameForInit)));
    const currentValues = getNestedValue(formik.values, fieldName) || [];
    const newArray = currentValues.concat(newObjectWithInitialValues[0]);
    formik.setFieldValue(fieldName, newArray);
  };


  return (
    <Box 
      sx={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <FormikTextField
          formik={formik}
          field={{
            name: "tableConfig",
            label: "Table Config",
            dataType: "string",
            fieldType: "TextField",
          }}
        />

        <IconButton 
          onClick={() => handleAddField("schemaList", formik)}
          sx={{
            my: 2,
            px: 2,
            borderRadius: "5px",
            color: '#1976D2', 
            border: "1px solid #1976D2",
          }}
        >
          <AddCircleOutline sx={{ mr: 1 }} />
          Add Schema List
        </IconButton>

        {formik.values.schemaList.map((schema, index) => (
          <Box 
            key={index}
            sx={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              p: '10px',
              my: '10px',
              backgroundColor: '#f4f4f4',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={1}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 1 }}>
                Schema List {index + 1}
              </Typography>
              <Box flexGrow={1} />
              <IconButton
                aria-label="delete"
                onClick={() => handleRemoveField(index, "schemaList", formik)}
                sx={{
                  backgroundColor: "#ffebee",
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                }}
              >
                <DeleteOutline />
              </IconButton>   
            </Stack>
            <FormikAutocomplete
              formik={formik}
              field={{
                name: `schemaList[${index}].jobTypes`,
                label: "Job Types",
                dataType: "string",
                fieldType: "Autocomplete",
              }}
              dataModel={dataModel.jobTypes}
            />

            <FormikTextField
              formik={formik}
              field={{
                name: `schemaList[${index}].config`,
                label: "Config",
                dataType: "string",
                fieldType: "TextField",
              }}
            />

            <IconButton 
              onClick={() => handleAddField(`schemaList[${index}].secondLevel`, formik)}
              sx={{
                my: 2,
                px: 2,
                borderRadius: "5px",
                color: '#1976D2', 
                border: "1px solid #1976D2",
              }}
            >
              <AddCircleOutline sx={{ mr: 1 }} />
              Add 2nd Level
            </IconButton>

            {schema.secondLevel.map((secondLevel, secondIndex) => (
              <Box 
                key={secondIndex}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  p: '8px',
                  my: '8px',
                  // Even lighter grey background color
                  backgroundColor: '#f9f9f9', 
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" mb={2}  mt={1}>
                  <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 1 }}>
                    2nd Level {secondIndex + 1}
                  </Typography>
                  <Box flexGrow={1} />
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveField(secondIndex, `schemaList[${index}].secondLevel`, formik)}
                    sx={{
                      backgroundColor: "#ffebee",
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>   
                </Stack>
                <FormikTextField
                  formik={formik}
                  field={{
                    name: `schemaList[${index}].secondLevel[${secondIndex}].name`,
                    label: "Name",
                    dataType: "string",
                    fieldType: "TextField",
                  }}
                />

                <FormikAutocomplete
                  formik={formik}
                  field={{
                    name: `schemaList[${index}].secondLevel[${secondIndex}].type`,
                    label: "Type",
                    dataType: "string",
                    fieldType: "Autocomplete",
                  }}
                  dataModel={dataModel.typeOptions}
                />

                <IconButton 
                  onClick={() => handleAddField(`schemaList[${index}].secondLevel[${secondIndex}].thirdLevel`, formik)}
                  sx={{
                    my: 2,
                    px: 2,
                    borderRadius: "5px",
                    color: '#1976D2', 
                    border: "1px solid #1976D2",
                  }}
                >
                  <AddCircleOutline sx={{ mr: 1 }} />
                  Add 3rd Level
                </IconButton>
                {secondLevel.thirdLevel.map((thirdLevel, thirdIndex) => (
                  <Box 
                    key={thirdIndex}
                    sx={{
                      border: '1px solid #eee',
                      borderRadius: '6px',
                      p: '6px',
                      my: '6px',
                      // Another shade of light grey
                      backgroundColor: '#fdfdfd', 
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={1}>
                      <Typography variant="h6" component="h2" sx={{ mb: 2, mt: 1 }}>
                      3rd Level {thirdIndex + 1}
                      </Typography>
                      <Box flexGrow={1} />
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleRemoveField(secondIndex, `schemaList[${index}].secondLevel[${secondIndex}].thirdLevel`, formik)}
                        sx={{
                          backgroundColor: "#ffebee",
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                        }}
                      >
                        <DeleteOutline />
                      </IconButton>   
                    </Stack>
                    <FormikTextField
                      formik={formik}
                      field={{
                        name: `schemaList[${index}].secondLevel[${secondIndex}].thirdLevel[${thirdIndex}].name`,
                        label: "Name",
                        dataType: "string",
                        fieldType: "TextField",
                      }}
                    />

                    <FormikAutocomplete
                      formik={formik}
                      field={{
                        name: `schemaList[${index}].secondLevel[${secondIndex}].thirdLevel[${thirdIndex}].type`,
                        label: "Type",
                        dataType: "string",
                        fieldType: "Autocomplete",
                      }}
                      dataModel={dataModel.typeOptions}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        ))}

        <Button 
          fullWidth
          variant="contained" 
          color="primary" 
          type="submit"
          sx={{
            py: 1,
            mt: 2,
            mb: 4,
            fontSize: '20px'
          }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default App;
