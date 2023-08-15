import * as React from "react";

export function getNestedProperty(obj, propChain) {
  if (!propChain) return null;
  const props = propChain.split(".");
  let currentProp = obj;
  for (const prop of props) {
    if (!currentProp.hasOwnProperty(prop)) {
      return null;
    }
    currentProp = currentProp[prop];
  }
  return currentProp;
}

export function recursiveMap(children, fn = (c) => c) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveMap(child.props.children, fn),
      });
    }

    if (child.props.control) {
      child = React.cloneElement(child, {
        control: fn(child.props.control),
      });
    }

    return fn(child);
  });
}

export function recursiveFilter(childrenArg, fn = () => true) {
  let children = [];
  recursiveMap(childrenArg, (child) => {
    if (fn(child)) children.push(child);
  });
  return children;
}

export function useReducerWithThunk(reducer, initialState) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const dispatchWithThunk = (action) => {
    if (typeof action === "function") {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return [state, dispatchWithThunk];
}

export function useDebounce(func, delay = 100) {
  const debouncedFunc = React.useMemo(() => debounce(func, delay), []);
  return debouncedFunc;
}

const debounce = (func, delay = 100) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
    return { cancel: () => clearTimeout(timeoutId) };
  };
};
