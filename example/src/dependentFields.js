import React from "react";
import { handleSubmit, FormContainer } from "./util";
import { Button, TextField, Typography } from "@mui/material";
import { Form, useFormContext } from "mui-form-handler";

const validatePassword = (val, { validate }) => {
  if (validate) validate("confirm-password");
  if (val.length === 0) return "This field is required";
  else if (val.length < 6) return "Must be 6 characters at least";
  else if (val.length > 5 && val.length < 8)
    return {
      error: false,
      color: "warning.main",
      message: "Recommended length - 8 or more characters",
    };
  else return { color: "success.main" };
};

const validateConfirmPassword = (val, { fields }) => {
  if (fields["password"].value !== val) return "Must equal password";
  else return validatePassword(val, {});
};

const validateMyField = (val, { fields }) => {
  if (!fields["password"].touched || !fields["confirm-password"].touched)
    return { error: true, color: "inherit", message: "Fields untouched" };
  else if (fields["password"].value !== fields["confirm-password"].value)
    return "Passwords do not match";
  else
    return { error: false, message: "Passwords match", color: "success.main" };
};

function MyField({ onChange, ...props }) {
  const { fields, setFieldValue, validate } = useFormContext();

  const passwordField = fields["password"],
    confirmPasswordField = fields["confirm-password"];

  const passwordVal =
    (!passwordField.touched && "untouched") || passwordField.value;
  const confirmPasswordVal =
    (!confirmPasswordField.touched && "untouched") ||
    confirmPasswordField.value;

  React.useEffect(() => {
    setFieldValue(
      "my-field",
      `password              : ${passwordVal}
confirm-password : ${confirmPasswordVal}`
    );
    validate("my-field", { force: true });
  }, [
    passwordField.value,
    passwordField.touched,
    confirmPasswordField.value,
    confirmPasswordField.touched,
  ]);

  return (
    <TextField
      multiline
      onChange={(e) => {
        setFieldValue("my-field", e.target.value);
        onChange(e);
      }}
      value={fields["my-field"].value}
      {...props}
    />
  );
}

function DependentFieldsForm() {
  return (
    <Form
      component={<FormContainer />}
      onSubmit={handleSubmit}
      showMsgOn="change"
      reserveSpaceForMsg
      autoComplete="off"
      sx={{
        "& > .MuiTextField-root": {
          margin: 0,
        },
        "& > .MuiFormHelperText-root": {
          marginBottom: 0.5,
        },
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Dependent fields form example
      </Typography>
      <TextField
        name="password"
        label="Password"
        type="password"
        margin="normal"
        validateFn={validatePassword}
      />
      <TextField
        name="confirm-password"
        label="Confirm Password"
        type="password"
        margin="normal"
        validateFn={validateConfirmPassword}
      />
      <MyField
        name="my-field"
        validateFn={validateMyField}
        showMsgOn="submit"
      />
      <Button type="submit" variant="contained" size="large">
        Submit
      </Button>
    </Form>
  );
}

export default DependentFieldsForm;
