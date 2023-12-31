import * as Yup from "yup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import { FieldArray, Formik } from "formik";
import { DataModel } from "./types";
import { FormikAutocomplete, FormikTextField } from "./items";

type StaticMultiLevelFormProps = {
  dataModel?: DataModel;
};

const dataModels: DataModel = {
  typeOptions: [
    { name: null, label: "" },
    { name: "date", label: "date" },
    { name: "string", label: "string" },
    { name: "number", label: "number" },
  ],
  jobTypes: [
    { name: null, label: "" },
    {
      name: "summarizedByDateAggregation",
      label: "summarizedByDateAggregation",
    },
    { name: "dataGrid", label: "dataGrid" },
    { name: "gaCategories", label: "gaCategories" },
  ],
};

const validationSchema = Yup.object().shape({
  tableConfig: Yup.string().required("Required"),
  schemaList: Yup.array().of(
    Yup.object().shape({
      jobTypes: Yup.string().required("Required"),
      config: Yup.string().required("Required"),
      secondLevel: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Required"),
          type: Yup.string().required("Required"),
          thirdLevel: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required("Required"),
              type: Yup.string().required("Required"),
            })
          ),
        })
      ),
    })
  ),
});


const initialThirdLevel = {
  name: "",
  random: "",
};
const initialSecondLevel = {
  name: "",
  type: "",
  thirdLevel: [initialThirdLevel],
};
const initialSchemaList = {
  jobTypes: "",
  config: "",
  secondLevel: [initialSecondLevel],
};
const initialValues = {
  tableConfig: "",
  schemaList: [initialSchemaList],
};

const StaticMultiLevelForm = ({ dataModel = dataModels }: StaticMultiLevelFormProps) => {
  const handleSubmit = (values: any) => {
    // Handle form submission
    console.log(values);
  };
  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {(formikProps) => (
          <form onSubmit={formikProps.handleSubmit}>
            <FormikTextField
              formik={formikProps}
              field={{
                name: "tableConfig",
                label: "Table Config",
                dataType: "string",
                fieldType: "TextField",
                value: formikProps.values.tableConfig,
              }}
            />

            <FieldArray name="schemaList">
              {({ remove, push }: any) => (
                <>
                  <IconButton
                    onClick={() => push(initialSchemaList)}
                    sx={{
                      my: 2,
                      px: 2,
                      borderRadius: "5px",
                      color: "#1976D2",
                      border: "1px solid #1976D2",
                    }}
                  >
                    <AddCircleOutline sx={{ mr: 1 }} />
                    Add Schema List
                  </IconButton>
                  {formikProps.values.schemaList.map((schema, index) => (
                    <Box
                      key={index}
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        p: "10px",
                        my: "10px",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={2}
                        mt={1}
                      >
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{ mb: 2, mt: 1 }}
                        >
                          Schema List {index + 1}
                        </Typography>
                        <Box flexGrow={1} />
                        <IconButton
                          aria-label="delete"
                          onClick={() => remove(index)}
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
                        formik={formikProps}
                        field={{
                          name: `schemaList[${index}].jobTypes`,
                          label: "Job Types",
                          dataType: "string",
                          fieldType: "Autocomplete",
                          value: schema.jobTypes,
                        }}
                        dataModel={dataModel.jobTypes}
                      />

                      <FormikTextField
                        formik={formikProps}
                        field={{
                          name: `schemaList[${index}].config`,
                          label: "Config",
                          dataType: "string",
                          fieldType: "TextField",
                          value: schema.config,
                        }}
                      />

                      <FieldArray name={`schemaList[${index}].secondLevel`}>
                        {({ remove: removeSecondLevel, push: pushSecondLevel }: any) => (
                          <>
                            <IconButton
                              onClick={() =>
                                pushSecondLevel(initialSecondLevel)
                              }
                              sx={{
                                my: 2,
                                px: 2,
                                borderRadius: "5px",
                                color: "#1976D2",
                                border: "1px solid #1976D2",
                              }}
                            >
                              <AddCircleOutline sx={{ mr: 1 }} />
                              Add 2nd Level
                            </IconButton>
                            {schema.secondLevel.map(
                              (secondLevel, secondIndex) => (
                                <Box
                                  key={secondIndex}
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    p: "8px",
                                    my: "8px",
                                    backgroundColor: "#f9f9f9",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                    mb={2}
                                    mt={1}
                                  >
                                    <Typography
                                      variant="h6"
                                      component="h2"
                                      sx={{ mb: 2, mt: 1 }}
                                    >
                                      2nd Level {secondIndex + 1}
                                    </Typography>
                                    <Box flexGrow={1} />
                                    <IconButton
                                      aria-label="delete"
                                      onClick={() =>
                                        removeSecondLevel(secondIndex)
                                      }
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
                                    formik={formikProps}
                                    field={{
                                      name: `schemaList[${index}].secondLevel[${secondIndex}].name`,
                                      label: "Name",
                                      dataType: "string",
                                      fieldType: "TextField",
                                      value: secondLevel.name,
                                    }}
                                  />

                                  <FormikAutocomplete
                                    formik={formikProps}
                                    field={{
                                      name: `schemaList[${index}].secondLevel[${secondIndex}].type`,
                                      label: "Type",
                                      dataType: "string",
                                      fieldType: "Autocomplete",
                                      value: secondLevel.type,
                                    }}
                                    dataModel={dataModel.typeOptions}
                                  />

                                  <FieldArray
                                    name={`schemaList[${index}].secondLevel[${secondIndex}].thirdLevel`}
                                  >
                                    {({ remove: removeThirdLevel, push: pushThirdLevel }: any) => (
                                      <>
                                        <IconButton
                                          onClick={() =>
                                            pushThirdLevel(initialThirdLevel)
                                          }
                                          sx={{
                                            my: 2,
                                            px: 2,
                                            borderRadius: "5px",
                                            color: "#1976D2",
                                            border: "1px solid #1976D2",
                                          }}
                                        >
                                          <AddCircleOutline sx={{ mr: 1 }} />
                                          Add 3rd Level
                                        </IconButton>
                                        {secondLevel.thirdLevel.map(
                                          (thirdLevel, thirdIndex) => (
                                            <Box
                                              key={thirdIndex}
                                              sx={{
                                                border: "1px solid #eee",
                                                borderRadius: "6px",
                                                p: "6px",
                                                my: "6px",
                                                backgroundColor: "#fdfdfd",
                                              }}
                                            >
                                              <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                                mb={2}
                                                mt={1}
                                              >
                                                <Typography
                                                  variant="h6"
                                                  component="h2"
                                                  sx={{ mb: 2, mt: 1 }}
                                                >
                                                  3rd Level {thirdIndex + 1}
                                                </Typography>
                                                <Box flexGrow={1} />
                                                <IconButton
                                                  aria-label="delete"
                                                  onClick={() =>
                                                    removeThirdLevel(thirdIndex)
                                                  }
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
                                                formik={formikProps}
                                                field={{
                                                  name: `schemaList[${index}].secondLevel[${secondIndex}].thirdLevel[${thirdIndex}].name`,
                                                  label: "Name",
                                                  dataType: "string",
                                                  fieldType: "TextField",
                                                  value: thirdLevel.name,
                                                }}
                                              />

                                              <FormikAutocomplete
                                                formik={formikProps}
                                                field={{
                                                  name: `schemaList[${index}].secondLevel[${secondIndex}].thirdLevel[${thirdIndex}].type`,
                                                  label: "Random",
                                                  dataType: "string",
                                                  fieldType: "Autocomplete",
                                                  value: thirdLevel.random,
                                                }}
                                                dataModel={
                                                  dataModel.typeOptions
                                                }
                                              />
                                            </Box>
                                          )
                                        )}
                                      </>
                                    )}
                                  </FieldArray>
                                </Box>
                              )
                            )}
                          </>
                        )}
                      </FieldArray>
                    </Box>
                  ))}
                </>
              )}
            </FieldArray>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                py: 1,
                mt: 2,
                mb: 4,
                fontSize: "20px",
              }}
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default StaticMultiLevelForm;