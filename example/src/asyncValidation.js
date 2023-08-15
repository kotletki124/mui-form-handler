import React from "react";
import { handleSubmit, FormContainer } from "./util";
import { Button, TextField, Typography } from "@mui/material";
import { Form } from "mui-form-handler";

const checkIfTaken = (value, time = 2000) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(value.includes("a"));
    }, time)
  );
};

const validateUsername = async (val) => {
  if (val.length === 0) return "This field is required";
  else if (val.length < 4) return "Must be 4 characters at least";
  else if (!/^[a-zA-Z0-9_.-]*$/.test(val))
    return 'Only latin letters, numbers, "_", "." and "-" allowed';
  else
    return (await checkIfTaken(val))
      ? "This username is already taken"
      : { color: "success.main" };
};

function AsyncValidationForm() {
  return (
    <Form
      component={<FormContainer />}
      onSubmit={handleSubmit}
      showMsgOn="change"
      autoComplete="off"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Async field validation example
      </Typography>
      <TextField
        name="username"
        label="Username"
        margin="normal"
        validateFn={validateUsername}
      />
      <Button type="submit" variant="contained" size="large">
        Submit
      </Button>
    </Form>
  );
}

export default AsyncValidationForm;
