import { type ReactNode } from "react";

export interface ConditionalProps {
  test: boolean;
  then?: ReactNode;
  else?: ReactNode;
  children?: ReactNode;
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
