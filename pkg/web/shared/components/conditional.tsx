import { JSX } from "preact";

export interface ConditionalProps {
  test: boolean;
  then?: JSX.Element;
  else?: JSX.Element;
  children?: JSX.Element;
}

export const Conditional = (props: ConditionalProps) => {
  if (props.test) {
    if (props.then) {
      return props.then;
    }

    return props.children;
  }

  if (props.else) {
    return props.else;
  }

  return null;
};
