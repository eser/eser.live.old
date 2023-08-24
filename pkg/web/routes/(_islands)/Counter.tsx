// import type { Signal } from "@preact/signals";
import { useSignal } from "@preact/signals";
import { Button } from "@web/shared/components/ui/button.tsx";

// deno-lint-ignore no-empty-interface
interface CounterProps {
  // count: Signal<number>;
}

export default function Counter(_props: CounterProps) {
  const count = useSignal(3);

  return (
    <div class="flex gap-8 py-6">
      <Button variant="bright" size="lg" onClick={() => count.value -= 1}>
        -1
      </Button>
      <p>{count}</p>
      <Button variant="bright" size="lg" onClick={() => count.value += 1}>
        +1
      </Button>
    </div>
  );
}
