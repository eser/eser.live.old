import * as React from "react";
import { composeEventHandlers } from "../../core/primitive/mod.ts";
import { useControllableState } from "../use-controllable-state/mod.ts";
import { Primitive } from "../primitive/mod.ts";

import type * as Radix from "../primitive/mod.ts";

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = "Toggle";

type ToggleElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<
  typeof Primitive.button
>;
interface ToggleProps extends PrimitiveButtonProps {
  /**
   * The controlled state of the toggle.
   */
  pressed?: boolean;
  /**
   * The state of the toggle when initially rendered. Use `defaultPressed`
   * if you do not need to control the state of the toggle.
   * @defaultValue false
   */
  defaultPressed?: boolean;
  /**
   * The callback that fires when the state of the toggle changes.
   */
  onPressedChange?(pressed: boolean): void;
}

const Toggle = React.forwardRef<ToggleElement, ToggleProps>(
  (props, forwardedRef) => {
    const {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      ...buttonProps
    } = props;

    const [pressed = false, setPressed] = useControllableState({
      prop: pressedProp,
      onChange: onPressedChange,
      defaultProp: defaultPressed,
    });

    return (
      <Primitive.button
        type="button"
        aria-pressed={pressed}
        data-state={pressed ? "on" : "off"}
        data-disabled={props.disabled ? "" : undefined}
        {...buttonProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => {
          if (!props.disabled) {
            setPressed(!pressed);
          }
        })}
      />
    );
  },
);

Toggle.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const Root = Toggle;

export {
  //
  Root,
  Toggle,
};
export type { ToggleProps };
