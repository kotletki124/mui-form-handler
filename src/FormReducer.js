export default function FormReducer(state, action) {
  let newState = { ...state },
    { fieldId, value } = action.payload,
    field = newState.fields[fieldId];
  switch (action.type) {
    case "setValue":
      field.validated = false;
      field.value = value;
      return newState;
    case "setTouched":
      let valueChanged = field.touched !== value;
      field.touched = value;
      return valueChanged ? newState : state;
    case "setValidationPromise":
      field.validating = true;
      field.validationPromise = value;
      return newState;
    case "setError":
      if (field.validationPromise === action.payload.validationPromise) {
        field.validating = false;
        field.validated = true;
        field.error = value;
      }
      return newState;
    case "setSubmitting":
      newState.submitting = value;
      return newState;
    default:
      throw new Error();
  }
}
