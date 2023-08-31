import * as React from "react";
import { TestContext } from "./_testContext.ts";

export interface TestProps {
}

export function Test(props: React.PropsWithChildren<TestProps>) {
  return (
    <TestContext.Provider value={"eser"}>
      {props.children}
    </TestContext.Provider>
  );
}
