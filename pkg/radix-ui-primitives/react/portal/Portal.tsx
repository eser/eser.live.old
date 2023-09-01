import * as React from "react";
import * as ReactDOM from "react-dom";
import { Primitive } from "../primitive/mod.ts";

import type * as Radix from "../primitive/mod.ts";

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = "Portal";

type PortalElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface PortalProps extends PrimitiveDivProps {
  /**
   * An optional container where the portaled content should be appended.
   */
  container?: HTMLElement | null;
}

const Portal = React.forwardRef<PortalElement, PortalProps>(
  (props, forwardedRef) => {
    const { container = globalThis?.document?.body, ...portalProps } = props;
    return container
      ? ReactDOM.createPortal(
        <Primitive.div {...portalProps} ref={forwardedRef} />,
        container,
      )
      : null;
  },
);

Portal.displayName = PORTAL_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Portal;

export {
  Portal,
  //
  Root,
};
export type { PortalProps };
