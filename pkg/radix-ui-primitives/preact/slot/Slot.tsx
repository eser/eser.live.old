import * as React from "preact/compat";
import { composeRefs } from "../compose-refs/mod.ts";

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ComponentChildren;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = React.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);

    if (slottable) {
      // the new element to render is the one passed as a child of `Slottable`
      const newElement = slottable.props.children as React.ComponentChildren;

      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          // because the new element will be the one rendered, we are only interested
          // in grabbing its children (`newElement.props.children`)
          if (React.Children.count(newElement) > 1) {
            return React.Children.only(null);
          }
          return React.isValidElement(newElement)
            ? (newElement.props.children as React.ComponentChildren)
            : null;
        } else {
          return child;
        }
      });

      return (
        <SlotClone {...slotProps} ref={forwardedRef}>
          {React.isValidElement(newElement)
            ? React.cloneElement(newElement, undefined, newChildren)
            : null}
        </SlotClone>
      );
    }

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {children}
      </SlotClone>
    );
  },
);

Slot.displayName = "Slot";

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/

interface SlotCloneProps {
  children: React.ComponentChildren;
}

const SlotClone = React.forwardRef<any, SlotCloneProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(slotProps, children.props),
        ref: forwardedRef
          ? composeRefs(forwardedRef, (children as any).ref)
          : (children as any).ref,
      });
    }

    return null;
  },
);

SlotClone.displayName = "SlotClone";

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const Slottable = ({ children }: { children: React.ComponentChildren }) => {
  return <>{children}</>;
};

/* ---------------------------------------------------------------------------------------------- */

type AnyProps = Record<string, any>;

function isSlottable(child: React.ComponentChildren): child is React.VNode {
  return React.isValidElement(child) && child.type === Slottable;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } // if it's `style`, we merge them
    else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

const Root = Slot;

export {
  //
  Root,
  Slot,
  Slottable,
};
export type { SlotProps };
