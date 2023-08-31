import * as React from "preact/compat";
import { composeEventHandlers } from "../../core/primitive/mod.ts";
import { createContextScope } from "../context/mod.ts";
import { useControllableState } from "../use-controllable-state/mod.ts";
import { useLayoutEffect } from "../use-layout-effect/mod.ts";
import { useComposedRefs } from "../compose-refs/mod.ts";
import { Primitive } from "../primitive/mod.ts";
import { Presence } from "../presence/mod.ts";
import { useId } from "../id/mod.ts";

import type * as Radix from "../primitive/mod.ts";
import type { Scope } from "../context/mod.ts";

/* -------------------------------------------------------------------------------------------------
 * Collapsible
 * -----------------------------------------------------------------------------------------------*/

const COLLAPSIBLE_NAME = "Collapsible";

type ScopedProps<P> = P & { __scopeCollapsible?: Scope };
const [createCollapsibleContext, createCollapsibleScope] = createContextScope(
  COLLAPSIBLE_NAME,
);

type CollapsibleContextValue = {
  contentId: string;
  disabled?: boolean;
  open: boolean;
  onOpenToggle(): void;
};

const [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext<
  CollapsibleContextValue
>(COLLAPSIBLE_NAME);

type CollapsibleElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface CollapsibleProps extends PrimitiveDivProps {
  defaultOpen?: boolean;
  open?: boolean;
  disabled?: boolean;
  onOpenChange?(open: boolean): void;
}

const Collapsible = React.forwardRef<CollapsibleElement, CollapsibleProps>(
  (props: ScopedProps<CollapsibleProps>, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;

    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    return (
      <CollapsibleProvider
        scope={__scopeCollapsible}
        disabled={disabled}
        contentId={useId()}
        open={open}
        onOpenToggle={React.useCallback(
          () => setOpen((prevOpen) => !prevOpen),
          [setOpen],
        )}
      >
        <Primitive.div
          data-state={getState(open)}
          data-disabled={disabled ? "" : undefined}
          {...collapsibleProps}
          ref={forwardedRef}
        />
      </CollapsibleProvider>
    );
  },
);

Collapsible.displayName = COLLAPSIBLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = "CollapsibleTrigger";

type CollapsibleTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<
  typeof Primitive.button
>;
interface CollapsibleTriggerProps extends PrimitiveButtonProps {}

const CollapsibleTrigger = React.forwardRef<
  CollapsibleTriggerElement,
  CollapsibleTriggerProps
>(
  (props: ScopedProps<CollapsibleTriggerProps>, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME, __scopeCollapsible);
    return (
      <Primitive.button
        type="button"
        aria-controls={context.contentId}
        aria-expanded={context.open || false}
        data-state={getState(context.open)}
        data-disabled={context.disabled ? "" : undefined}
        disabled={context.disabled}
        {...triggerProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    );
  },
);

CollapsibleTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * CollapsibleContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = "CollapsibleContent";

type CollapsibleContentElement = CollapsibleContentImplElement;
interface CollapsibleContentProps
  extends Omit<CollapsibleContentImplProps, "present"> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const CollapsibleContent = React.forwardRef<
  CollapsibleContentElement,
  CollapsibleContentProps
>(
  (props: ScopedProps<CollapsibleContentProps>, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(
      CONTENT_NAME,
      props.__scopeCollapsible,
    );
    return (
      <Presence present={forceMount || context.open}>
        {({ present }) => (
          <CollapsibleContentImpl
            {...contentProps}
            ref={forwardedRef}
            present={present}
          />
        )}
      </Presence>
    );
  },
);

CollapsibleContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

type CollapsibleContentImplElement = React.ElementRef<typeof Primitive.div>;
interface CollapsibleContentImplProps extends PrimitiveDivProps {
  present: boolean;
}

const CollapsibleContentImpl = React.forwardRef<
  CollapsibleContentImplElement,
  CollapsibleContentImplProps
>((props: ScopedProps<CollapsibleContentImplProps>, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME, __scopeCollapsible);
  const [isPresent, setIsPresent] = React.useState(present);
  const ref = React.useRef<CollapsibleContentImplElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = React.useRef<number | undefined>(0);
  const height = heightRef.current;
  const widthRef = React.useRef<number | undefined>(0);
  const width = widthRef.current;
  // when opening we want it to immediately open to retrieve dimensions
  // when closing we delay `present` to retrieve dimensions before closing
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = React.useRef(isOpen);
  const originalStylesRef = React.useRef<Record<string, string>>();

  React.useEffect(() => {
    const rAF = requestAnimationFrame(
      () => (isMountAnimationPreventedRef.current = false),
    );
    return () => cancelAnimationFrame(rAF);
  }, []);

  useLayoutEffect(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName,
      };
      // block any animations/transitions so the element renders at its full dimensions
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";

      // get width and height from full dimensions
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;

      // kick off any animations/transitions that were originally set up if it isn't the initial mount
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration =
          originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }

      setIsPresent(present);
    }
    /**
     * depends on `context.open` because it will change to `false`
     * when a close is triggered but `present` will be `false` on
     * animation end (so when close finishes). This allows us to
     * retrieve the dimensions *before* closing.
     */
  }, [context.open, present]);

  return (
    <Primitive.div
      data-state={getState(context.open)}
      data-disabled={context.disabled ? "" : undefined}
      id={context.contentId}
      hidden={!isOpen}
      {...contentProps}
      ref={composedRefs}
      style={{
        [`--radix-collapsible-content-height` as any]: height
          ? `${height}px`
          : undefined,
        [`--radix-collapsible-content-width` as any]: width
          ? `${width}px`
          : undefined,
        ...props.style,
      }}
    >
      {isOpen && children}
    </Primitive.div>
  );
});

/* -----------------------------------------------------------------------------------------------*/

function getState(open?: boolean) {
  return open ? "open" : "closed";
}

const Root = Collapsible;
const Trigger = CollapsibleTrigger;
const Content = CollapsibleContent;

export {
  //
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Content,
  createCollapsibleScope,
  //
  Root,
  Trigger,
};
export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
};
