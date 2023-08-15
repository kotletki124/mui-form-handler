import { CircularProgress, FormHelperText } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { cloneElement, useMemo } from "react";
import { getNestedProperty, useDebounce } from "./util";

function ValidatedField({
  name,
  validating,
  onFocus,
  onBlur,
  onChange,
  component,
  error: errorArg,
  reserveSpaceForMsg,
  debounceTime,
  noEndAdornments,
  ...otherProps
}) {
  const debouncedHandleChange = useDebounce(handleChange, debounceTime);

  function handleChange(e) {
    if (onChange) onChange(e, name);
  }

  function handleFocus(e) {
    if (onFocus) onFocus(e, name);
  }

  function handleBlur(e) {
    if (onBlur) onBlur(e, name);
  }

  let { error, message: helperText, color } = errorArg || {};
  if (color === "inherit" || validating) {
    error = false;
    color = undefined;
  } else error = error || color !== undefined;
  if (!helperText && reserveSpaceForMsg) helperText = " ";

  const outerTheme = useTheme();
  const palette = outerTheme.palette;
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          error: {
            main:
              getNestedProperty(palette, color) || color || palette.error.main,
          },
        },
      }),
    [color]
  );

  let props = {
    onFocus: handleFocus,
    onChange: debouncedHandleChange,
    onBlur: handleBlur,
    name,
    error,
    InputProps:
      (!noEndAdornments &&
        validating && {
          endAdornment: <CircularProgress color="inherit" size={20} />,
        }) ||
      undefined,
    ...otherProps,
  };

  return (
    <ThemeProvider theme={theme}>
      {cloneElement(component, props)}
      {!validating && helperText && helperText.length > 0 && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </ThemeProvider>
  );
}

export default ValidatedField;
