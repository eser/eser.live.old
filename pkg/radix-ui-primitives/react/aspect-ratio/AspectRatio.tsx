import * as React from "preact/compat";
import { Primitive } from "../primitive/mod.ts";

import type * as Radix from "../primitive/mod.ts";

/* -------------------------------------------------------------------------------------------------
 * AspectRatio
 * -----------------------------------------------------------------------------------------------*/

const NAME = "AspectRatio";

type AspectRatioElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface AspectRatioProps extends PrimitiveDivProps {
  ratio?: number;
}

const AspectRatio = React.forwardRef<AspectRatioElement, AspectRatioProps>(
  (props, forwardedRef) => {
    const { ratio = 1 / 1, style, ...aspectRatioProps } = props;
    return (
      <div
        style={{
          // ensures inner element is contained
          position: "relative",
          // ensures padding bottom trick maths works
          width: "100%",
          paddingBottom: `${100 / ratio}%`,
        }}
        data-radix-aspect-ratio-wrapper=""
      >
        <Primitive.div
          {...aspectRatioProps}
          ref={forwardedRef}
          style={{
            ...style,
            // ensures children expand in ratio
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
      </div>
    );
  },
);

AspectRatio.displayName = NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = AspectRatio;

export {
  AspectRatio,
  //
  Root,
};
export type { AspectRatioProps };
