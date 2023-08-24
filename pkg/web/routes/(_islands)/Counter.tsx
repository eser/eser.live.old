// import type { Signal } from "@preact/signals";
import { useSignal } from "@preact/signals";
import { Button } from "@web/components/ui/button.tsx";

// deno-lint-ignore no-empty-interface
interface CounterProps {
  // count: Signal<number>;
}

export default function Counter(_props: CounterProps) {
  const count = useSignal(3);

  return (
    <div className="flex items-center	gap-8 py-6">
      <Button variant="outline" size="default" onClick={() => count.value -= 1}>
        -1
      </Button>
      <div>{count}</div>
      <Button variant="outline" size="default" onClick={() => count.value += 1}>
        +1
      </Button>
    </div>
  );
}
