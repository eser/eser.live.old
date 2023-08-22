// import type { Signal } from "@preact/signals";
import { useSignal } from "@preact/signals";
import { Button } from "../(_components)/Button.tsx";

// deno-lint-ignore no-empty-interface
interface CounterProps {
  // count: Signal<number>;
}

export default function Counter(_props: CounterProps) {
  const count = useSignal(3);

  return (
    <div class="flex gap-8 py-6">
      <Button onClick={() => count.value -= 1}>-1</Button>
      <p class="text-3xl">{count}</p>
      <Button onClick={() => count.value += 1}>+1</Button>
    </div>
  );
}
