import { type Signal } from "@preact/signals-react";
import { IS_BROWSER } from "$cool/lime/runtime.ts";
import { Button } from "$web/components/ui/button.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div className="flex items-center	gap-8 py-6">
      <Button variant="outline" size="default" onClick={() => props.count.value -= 1} disabled={!IS_BROWSER}>
        -1
      </Button>
      <div>{count}</div>
      <Button variant="outline" size="default" onClick={() => props.count.value += 1} disabled={!IS_BROWSER}>
        +1
      </Button>
    </div>
  );
}
