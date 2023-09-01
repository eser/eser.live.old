import { useContext } from "react";
import { TestContext } from "../../islands/_testContext.ts";

// deno-lint-ignore no-empty-interface
interface ValueFromContextProps {
  // count: Signal<number>;
}

export default function ValueFromContext(_props: ValueFromContextProps) {
  const value = useContext(TestContext);

  return (
    <div>
      {value}
    </div>
  );
}
