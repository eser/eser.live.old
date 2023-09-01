import { type PropsWithChildren } from "react";
import { TestContext } from "./_testContext.ts";

export interface TestProps {
}

export function Test(props: PropsWithChildren<TestProps>) {
  return (
    <TestContext.Provider value={"eser"}>
      {props.children}
    </TestContext.Provider>
  );
}
