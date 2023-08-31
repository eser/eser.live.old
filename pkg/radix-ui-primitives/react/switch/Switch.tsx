import * as React from "preact/compat";
import { composeEventHandlers } from "../../core/primitive/mod.ts";
import { useComposedRefs } from "../compose-refs/mod.ts";
import { createContextScope } from "../context/mod.ts";
import { useControllableState } from "../use-controllable-state/mod.ts";
import { usePrevious } from "../use-previous/mod.ts";
import { useSize } from "../use-size/mod.ts";
import { Primitive } from "../primitive/mod.ts";

import type * as Radix from "../primitive/mod.ts";
import type { Scope } from "../context/mod.ts";

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const SWITCH_NAME = "Switch";

type ScopedProps<P> = P & { __scopeSwitch?: Scope };
const [createSwitchContext, createSwitchScope] = createContextScope(
  SWITCH_NAME,
);

type SwitchContextValue = { checked: boolean; disabled?: boolean };
const [SwitchProvider, useSwitchContext] = createSwitchContext<
  SwitchContextValue
>(SWITCH_NAME);

type SwitchElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<
  typeof Primitive.button
>;
interface SwitchProps extends PrimitiveButtonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  onCheckedChange?(checked: boolean): void;
}

const Switch = React.forwardRef<SwitchElement, SwitchProps>(
  (props: ScopedProps<SwitchProps>, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      ...switchProps
    } = props;
    const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setButton(node),
    );
    const hasConsumerStoppedPropagationRef = React.useRef(false);
    // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = button ? Boolean(button.closest("form")) : true;
    const [checked = false, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked,
      onChange: onCheckedChange,
    });

    return (
      <SwitchProvider
        scope={__scopeSwitch}
        checked={checked}
        disabled={disabled}
      >
        <Primitive.button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-required={required}
          data-state={getState(checked)}
          data-disabled={disabled ? "" : undefined}
          disabled={disabled}
          value={value}
          {...switchProps}
          ref={composedRefs}
          onClick={composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event
                .isPropagationStopped();
              // if switch is in a form, stop propagation from the button so that we only propagate
              // one click event (from the input). We propagate changes from an input so that native
              // form validation works and form events reflect switch updates.
              if (!hasConsumerStoppedPropagationRef.current) {
                event.stopPropagation();
              }
            }
          })}
        />
        {isFormControl && (
          <BubbleInput
            control={button}
            bubbles={!hasConsumerStoppedPropagationRef.current}
            name={name}
            value={value}
            checked={checked}
            required={required}
            disabled={disabled}
            // We transform because the input is absolutely positioned but we have
            // rendered it **after** the button. This pulls it back to sit on top
            // of the button.
            style={{ transform: "translateX(-100%)" }}
          />
        )}
      </SwitchProvider>
    );
  },
);

Switch.displayName = SWITCH_NAME;

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = "SwitchThumb";

type SwitchThumbElement = React.ElementRef<typeof Primitive.span>;
type PrimitiveSpanProps = Radix.ComponentPropsWithoutRef<typeof Primitive.span>;
interface SwitchThumbProps extends PrimitiveSpanProps {}

const SwitchThumb = React.forwardRef<SwitchThumbElement, SwitchThumbProps>(
  (props: ScopedProps<SwitchThumbProps>, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return (
      <Primitive.span
        data-state={getState(context.checked)}
        data-disabled={context.disabled ? "" : undefined}
        {...thumbProps}
        ref={forwardedRef}
      />
    );
  },
);

SwitchThumb.displayName = THUMB_NAME;

/* ---------------------------------------------------------------------------------------------- */

type InputProps = Radix.ComponentPropsWithoutRef<"input">;
interface BubbleInputProps extends Omit<InputProps, "checked"> {
  checked: boolean;
  control: HTMLElement | null;
  bubbles: boolean;
}

const BubbleInput = (props: BubbleInputProps) => {
  const { control, checked, bubbles = true, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);
  const prevChecked = usePrevious(checked);
  const controlSize = useSize(control);

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(
      inputProto,
      "checked",
    ) as PropertyDescriptor;
    const setChecked = descriptor.set;
    if (prevChecked !== checked && setChecked) {
      const event = new Event("click", { bubbles });
      setChecked.call(input, checked);
      input.dispatchEvent(event);
    }
  }, [prevChecked, checked, bubbles]);

  return (
    <input
      type="checkbox"
      aria-hidden
      defaultChecked={checked}
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      style={{
        ...props.style,
        ...controlSize,
        position: "absolute",
        pointerEvents: "none",
        opacity: 0,
        margin: 0,
      }}
    />
  );
};

function getState(checked: boolean) {
  return checked ? "checked" : "unchecked";
}

const Root = Switch;
const Thumb = SwitchThumb;

export {
  createSwitchScope,
  //
  Root,
  //
  Switch,
  SwitchThumb,
  Thumb,
};
export type { SwitchProps, SwitchThumbProps };
