import React from "react";
import { handleSubmit, FormContainer } from "./util";
import {
  Button,
  TextField,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
} from "@mui/material";
import { Form } from "mui-form-handler";
import { isEmail } from "validator";

const validateEmail = (val) => {
  if (val.length === 0) return "This field is required";
  else if (!isEmail(val)) return "Not valid email address";
};

const validateCheckbox = (val) => {
  if (!val) return "Must accept the agreement to continue";
};

const validateRadioGroup = (val) => {
  switch (val) {
    case "warning":
      return { color: "warning.main", message: "Warning message" };
    case "inherit":
      return { color: "inherit", message: "Uncolored message" };
    default:
      return "Error message";
  }
};

function BasicForm() {
  return (
    <Form
      component={<FormContainer />}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Basic form example
      </Typography>
      <TextField
        label="Email"
        name="email"
        margin="normal"
        defaultValue={"example@mail.com"}
        validateFn={validateEmail}
      />
      <FormControl
        name="radio-group"
        showMsgOn="change"
        validateFn={validateRadioGroup}
      >
        <FormLabel>RadioGroup</FormLabel>
        <RadioGroup name="radio-group" row defaultValue="error">
          <FormControlLabel value="error" control={<Radio />} label="error" />
          <FormControlLabel
            value="warning"
            control={<Radio />}
            label="warning"
          />
          <FormControlLabel
            value="inherit"
            control={<Radio />}
            label="inherit"
          />
        </RadioGroup>
      </FormControl>
      <FormControlLabel
        name="checkbox"
        validateFn={validateCheckbox}
        control={<Checkbox />}
        label="I have read and agree to the privacy policy"
      />
      <Button type="submit" variant="contained" size="large">
        Submit
      </Button>
    </Form>
  );
}

export default BasicForm;
