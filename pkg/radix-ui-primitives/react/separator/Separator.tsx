import * as React from "react";
import { Primitive } from "../primitive/mod.ts";

import type * as Radix from "../primitive/mod.ts";

/* -------------------------------------------------------------------------------------------------
 *  Separator
 * -----------------------------------------------------------------------------------------------*/

const NAME = "Separator";
const DEFAULT_ORIENTATION = "horizontal";
const ORIENTATIONS = ["horizontal", "vertical"] as const;

type Orientation = typeof ORIENTATIONS[number];
type SeparatorElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface SeparatorProps extends PrimitiveDivProps {
  /**
   * Either `vertical` or `horizontal`. Defaults to `horizontal`.
   */
  orientation?: Orientation;
  /**
   * Whether or not the component is purely decorative. When true, accessibility-related attributes
   * are updated so that that the rendered element is removed from the accessibility tree.
   */
  decorative?: boolean;
}

const Separator = React.forwardRef<SeparatorElement, SeparatorProps>(
  (props, forwardedRef) => {
    const {
      decorative,
      orientation: orientationProp = DEFAULT_ORIENTATION,
      ...domProps
    } = props;
    const orientation = isValidOrientation(orientationProp)
      ? orientationProp
      : DEFAULT_ORIENTATION;
    // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
    const ariaOrientation = orientation === "vertical"
      ? orientation
      : undefined;
    const semanticProps = decorative
      ? { role: "none" }
      : { "aria-orientation": ariaOrientation, role: "separator" };

    return (
      <Primitive.div
        data-orientation={orientation}
        {...semanticProps}
        {...domProps}
        ref={forwardedRef}
      />
    );
  },
);

Separator.displayName = NAME;

Separator.propTypes = {
  orientation(props, propName, componentName) {
    const propValue = props[propName];
    const strVal = String(propValue);
    if (propValue && !isValidOrientation(propValue)) {
      return new Error(getInvalidOrientationError(strVal, componentName));
    }
    return null;
  },
};

/* -----------------------------------------------------------------------------------------------*/

// Split this out for clearer readability of the error message.
function getInvalidOrientationError(value: string, componentName: string) {
  return `Invalid prop \`orientation\` of value \`${value}\` supplied to \`${componentName}\`, expected one of:
  - horizontal
  - vertical

Defaulting to \`${DEFAULT_ORIENTATION}\`.`;
}

function isValidOrientation(orientation: any): orientation is Orientation {
  return ORIENTATIONS.includes(orientation);
}

const Root = Separator;

export {
  //
  Root,
  Separator,
};
export type { SeparatorProps };
