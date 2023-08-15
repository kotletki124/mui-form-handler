import {
  cloneElement,
  createContext,
  createElement,
  useContext,
  useMemo,
} from "react";
import { flushSync } from "react-dom";
import FormReducer from "./FormReducer.js";
import ValidatedField from "./ValidatedFieldComponent.js";
import { recursiveFilter, recursiveMap, useReducerWithThunk } from "./util.js";
import { CircularProgress } from "@mui/material";

const getId = (c) => c.props.name;

const FormContext = createContext({});

function useFormContext() {
  return useContext(FormContext);
}

function Form({
  children,
  component,
  onSubmit,
  showMsgOn: showMsgOnForm,
  reserveSpaceForMsg: reserveSpaceForMsgForm,
  debounceTime: debounceTimeForm,
  noAutoDisable: noAutoDisableForm,
  noEndAdornments: noEndAdornmentsForm,
  ...propsForm
}) {
  const [state, dispatch] = useReducerWithThunk(FormReducer, init());
  const contextValue = useMemo(
    () => ({
      submitForm: handleSubmit,
      validate: handleValidate,
      setFieldValue: (fieldId, value) =>
        dispatch({ type: "setValue", payload: { value, fieldId } }),
      submitting: state.submitting,
      fields: state.fields,
    }),
    [state.fields, state.submitting]
  );

  function init() {
    let fields = recursiveFilter(children, (c) => c.props.validateFn),
      state = { submitting: false };

    state.fields = fields.reduce((res, c) => {
      let fieldId = getId(c);
      if (!fieldId)
        throw new Error("Missing name attribute on a validated component.");
      res[fieldId] = {};
      res[fieldId].id = fieldId;
      res[fieldId].value = c.props.value || c.props.defaultValue || "";
      res[fieldId].validateFn = c.props.validateFn;
      res[fieldId].validating = false;
      res[fieldId].validated = false;
      res[fieldId].touched = false;
      return res;
    }, {});
    return state;
  }

  function hasErrors() {
    return Promise.any(
      Object.values(state.fields).map(
        (f) =>
          new Promise((resolve, reject) => {
            return f.validationPromise.then((err) => {
              if (err && (typeof err === "string" || err.error)) resolve(true);
              else reject(false);
            });
          })
      )
    ).catch(() => false);
  }

  const validateField = async function (field, value = field.value) {
    if (field.validateFn)
      return await field.validateFn(value, {
        validate: handleValidate,
        submitForm: handleSubmit,
        fields: state.fields,
      });
    else return null;
  };

  const validateAction =
    (field, value = field.value) =>
    async (dispatch) => {
      const defaultError = {
        error: true,
        message: "",
      };
      let validationPromise = validateField(field, value);
      dispatch({
        type: "setValidationPromise",
        payload: {
          fieldId: field.id,
          value: validationPromise,
        },
      });
      let res = await validationPromise;
      let error =
        typeof res === "string"
          ? { ...defaultError, message: res }
          : { ...defaultError, error: false, ...res };
      dispatch({
        type: "setError",
        payload: {
          fieldId: field.id,
          validationPromise,
          value: error,
        },
      });
    };

  function handleValidate(fieldId, options = {}) {
    let { force, value } = options;
    let field = state.fields[fieldId];
    if (field.touched || force) dispatch(validateAction(field, value));
  }

  const submitAction = (event) => async (dispatch) => {
    dispatch({ type: "setSubmitting", payload: { value: true } });
    event.preventDefault();
    const data = new FormData(event.target);
    recursiveFilter(
      children,
      (c) => c.props.validateFn && !state.fields[getId(c)].validated
    ).forEach((c) =>
      flushSync(() => handleValidate(getId(c), { force: true }))
    );
    let hasErr = await hasErrors();
    if (!hasErr && onSubmit) await onSubmit(event, data);
    dispatch({ type: "setSubmitting", payload: { value: false } });
  };

  const handleSubmit = async (event) => {
    dispatch(submitAction(event));
  };

  return (
    <FormContext.Provider value={contextValue}>
      {cloneElement(
        component,
        { onSubmit: handleSubmit, ...propsForm },
        recursiveMap(children, (c) => {
          const {
            validateFn,
            noAutoDisable: noAutoDisableField,
            noEndAdornments: noEndAdornmentsField,
            showMsgOn: showMsgOnField,
            reserveSpaceForMsg: reserveSpaceForMsgField,
            debounceTime: debounceTimeField,
            ...props
          } = c.props;

          let noAutoDisable =
              noAutoDisableField !== undefined
                ? noAutoDisableField
                : noAutoDisableForm,
            noEndAdornments =
              noEndAdornmentsField !== undefined
                ? noEndAdornmentsField
                : noEndAdornmentsForm;

          if (validateFn) {
            let showMsgOn = showMsgOnField || showMsgOnForm,
              reserveSpaceForMsg =
                reserveSpaceForMsgField !== undefined
                  ? reserveSpaceForMsgField
                  : reserveSpaceForMsgForm,
              debounceTime =
                debounceTimeField !== undefined
                  ? debounceTimeField
                  : debounceTimeForm;
            const name = getId(c);

            return createElement(ValidatedField, {
              ...props,
              name,
              component: { ...c, props },
              error: !state.submitting && state.fields[name].error,
              onFocus: (e, fieldId) => {
                if (props.onFocus) props.onFocus(e);
                dispatch({
                  type: "setTouched",
                  payload: { value: true, fieldId },
                });
              },
              onChange: (e, fieldId) => {
                const value =
                  e.target.type === "checkbox"
                    ? e.target.checked
                    : e.target.value;
                if (props.onChange) props.onChange(e);
                flushSync(() =>
                  dispatch({ type: "setValue", payload: { value, fieldId } })
                );
                if (showMsgOn === "change") handleValidate(fieldId, { value });
              },
              onBlur: (e, fieldId) => {
                if (props.onBlur) props.onBlur(e);
                if (
                  showMsgOn === "blur" ||
                  (showMsgOn === "change" && e.target.value === "")
                )
                  handleValidate(fieldId, { value: e.target.value });
              },
              validating: state.fields[name].validating,
              disabled: !noAutoDisable && (props.disabled || state.submitting),
              reserveSpaceForMsg,
              debounceTime,
              noEndAdornments,
            });
          } else if (c && props.type === "submit")
            return createElement(c.type, {
              ...props,
              disabled: !noAutoDisable && (props.disabled || state.submitting),
              endIcon:
                (!noEndAdornments &&
                  state.submitting &&
                  createElement(CircularProgress, {
                    color: "inherit",
                    size: 20,
                  })) ||
                undefined,
            });
          else
            return cloneElement(c, {
              disabled: !noAutoDisable && (props.disabled || state.submitting),
            });
        })
      )}
    </FormContext.Provider>
  );
}

export { Form as default, useFormContext };
