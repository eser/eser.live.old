import * as React from "preact/compat";
import { composeEventHandlers } from "../../core/primitive/mod.ts";
import { useComposedRefs } from "../compose-refs/mod.ts";
import { createContext, createContextScope } from "../context/mod.ts";
import { useId } from "../id/mod.ts";
import { useControllableState } from "../use-controllable-state/mod.ts";
import { DismissableLayer } from "../dismissable-layer/mod.ts";
import { FocusScope } from "../focus-scope/mod.ts";
import { Portal as PortalPrimitive } from "../portal/mod.ts";
import { Presence } from "../presence/mod.ts";
import { Primitive } from "../primitive/mod.ts";
import { useFocusGuards } from "../focus-guards/mod.ts";
import { RemoveScroll } from "react-remove-scroll";
import { hideOthers } from "aria-hidden";
import { Slot } from "../slot/mod.ts";

import type * as Radix from "../primitive/mod.ts";
import type { Scope } from "../context/mod.ts";

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = "Dialog";

type ScopedProps<P> = P & { __scopeDialog?: Scope };
const [createDialogContext, createDialogScope] = createContextScope(
  DIALOG_NAME,
);

type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<DialogContentElement>;
  contentId: string;
  titleId: string;
  descriptionId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  modal: boolean;
};

const [DialogProvider, useDialogContext] = createDialogContext<
  DialogContextValue
>(DIALOG_NAME);

interface DialogProps {
  children?: React.ComponentChildren;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  modal?: boolean;
}

const Dialog: React.FC<DialogProps> = (
  props: ScopedProps<DialogProps>,
) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true,
  } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<DialogContentElement>(null);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <DialogProvider
      scope={__scopeDialog}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={useId()}
      titleId={useId()}
      descriptionId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(
        () => setOpen((prevOpen) => !prevOpen),
        [
          setOpen,
        ],
      )}
      modal={modal}
    >
      {children}
    </DialogProvider>
  );
};

Dialog.displayName = DIALOG_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = "DialogTrigger";

type DialogTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = Radix.ComponentPropsWithoutRef<
  typeof Primitive.button
>;
interface DialogTriggerProps extends PrimitiveButtonProps {}

const DialogTrigger = React.forwardRef<
  DialogTriggerElement,
  DialogTriggerProps
>(
  (props: ScopedProps<DialogTriggerProps>, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(
      forwardedRef,
      context.triggerRef,
    );
    return (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    );
  },
);

DialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = "DialogPortal";

type PortalContextValue = { forceMount?: true };
const [PortalProvider, usePortalContext] = createDialogContext<
  PortalContextValue
>(PORTAL_NAME, {
  forceMount: undefined,
});

type PortalProps = Radix.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface DialogPortalProps {
  children?: React.ComponentChildren;
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps["container"];
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const DialogPortal: React.FC<DialogPortalProps> = (
  props: ScopedProps<DialogPortalProps>,
) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      {React.Children.map(
        children,
        (child) => (
          <Presence present={forceMount || context.open}>
            <PortalPrimitive asChild container={container}>
              {child}
            </PortalPrimitive>
          </Presence>
        ),
      )}
    </PortalProvider>
  );
};

DialogPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = "DialogOverlay";

type DialogOverlayElement = DialogOverlayImplElement;
interface DialogOverlayProps extends DialogOverlayImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const DialogOverlay = React.forwardRef<
  DialogOverlayElement,
  DialogOverlayProps
>(
  (props: ScopedProps<DialogOverlayProps>, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal
      ? (
        <Presence present={forceMount || context.open}>
          <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
        </Presence>
      )
      : null;
  },
);

DialogOverlay.displayName = OVERLAY_NAME;

type DialogOverlayImplElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface DialogOverlayImplProps extends PrimitiveDivProps {}

const DialogOverlayImpl = React.forwardRef<
  DialogOverlayImplElement,
  DialogOverlayImplProps
>(
  (props: ScopedProps<DialogOverlayImplProps>, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      <RemoveScroll as={Slot} allowPinchZoom shards={[context.contentRef]}>
        <Primitive.div
          data-state={getState(context.open)}
          {...overlayProps}
          ref={forwardedRef}
          // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
          style={{ pointerEvents: "auto", ...overlayProps.style }}
        />
      </RemoveScroll>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = "DialogContent";

type DialogContentElement = DialogContentTypeElement;
interface DialogContentProps extends DialogContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const DialogContent = React.forwardRef<
  DialogContentElement,
  DialogContentProps
>(
  (props: ScopedProps<DialogContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return (
      <Presence present={forceMount || context.open}>
        {context.modal
          ? <DialogContentModal {...contentProps} ref={forwardedRef} />
          : <DialogContentNonModal {...contentProps} ref={forwardedRef} />}
      </Presence>
    );
  },
);

DialogContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

type DialogContentTypeElement = DialogContentImplElement;
interface DialogContentTypeProps
  extends
    Omit<DialogContentImplProps, "trapFocus" | "disableOutsidePointerEvents"> {}

const DialogContentModal = React.forwardRef<
  DialogContentTypeElement,
  DialogContentTypeProps
>(
  (props: ScopedProps<DialogContentTypeProps>, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      context.contentRef,
      contentRef,
    );

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);

    return (
      <DialogContentImpl
        {...props}
        ref={composedRefs}
        // we make sure focus isn't trapped once `DialogContent` has been closed
        // (closed !== unmounted when animating out)
        trapFocus={context.open}
        disableOutsidePointerEvents
        onCloseAutoFocus={composeEventHandlers(
          props.onCloseAutoFocus,
          (event) => {
            event.preventDefault();
            context.triggerRef.current?.focus();
          },
        )}
        onPointerDownOutside={composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 &&
              originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;

            // If the event is a right-click, we shouldn't close because
            // it is effectively as if we right-clicked the `Overlay`.
            if (isRightClick) event.preventDefault();
          },
        )}
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) =>
          event.preventDefault())}
      />
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

const DialogContentNonModal = React.forwardRef<
  DialogContentTypeElement,
  DialogContentTypeProps
>(
  (props: ScopedProps<DialogContentTypeProps>, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = React.useRef(false);
    const hasPointerDownOutsideRef = React.useRef(false);

    return (
      <DialogContentImpl
        {...props}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event);

          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) {
              context.triggerRef.current
                ?.focus();
            }
            // Always prevent auto focus because we either focus manually or want user agent focus
            event.preventDefault();
          }

          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        }}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event);

          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }

          // Prevent dismissing when clicking the trigger.
          // As the trigger is already setup to close, without doing so would
          // cause it to close and immediately open.
          const target = event.target as HTMLElement;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();

          // On Safari if the trigger is inside a container with tabIndex={0}, when clicked
          // we will get the pointer down outside event on the trigger, but then a subsequent
          // focus outside event on the container, we ignore any focus outside event when we've
          // already had a pointer down outside event.
          if (
            event.detail.originalEvent.type === "focusin" &&
            hasPointerDownOutsideRef.current
          ) {
            event.preventDefault();
          }
        }}
      />
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

type DialogContentImplElement = React.ElementRef<typeof DismissableLayer>;
type DismissableLayerProps = Radix.ComponentPropsWithoutRef<
  typeof DismissableLayer
>;
type FocusScopeProps = Radix.ComponentPropsWithoutRef<typeof FocusScope>;
interface DialogContentImplProps
  extends Omit<DismissableLayerProps, "onDismiss"> {
  /**
   * When `true`, focus cannot escape the `Content` via keyboard,
   * pointer, or a programmatic focus.
   * @defaultValue false
   */
  trapFocus?: FocusScopeProps["trapped"];

  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps["onMountAutoFocus"];

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps["onUnmountAutoFocus"];
}

const DialogContentImpl = React.forwardRef<
  DialogContentImplElement,
  DialogContentImplProps
>(
  (props: ScopedProps<DialogContentImplProps>, forwardedRef) => {
    const {
      __scopeDialog,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      ...contentProps
    } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);

    // Make sure the whole tree has focus guards as our `Dialog` will be
    // the last element in the DOM (beacuse of the `Portal`)
    useFocusGuards();

    return (
      <>
        <FocusScope
          asChild
          loop
          trapped={trapFocus}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
          <DismissableLayer
            role="dialog"
            id={context.contentId}
            aria-describedby={context.descriptionId}
            aria-labelledby={context.titleId}
            data-state={getState(context.open)}
            {...contentProps}
            ref={composedRefs}
            onDismiss={() => context.onOpenChange(false)}
          />
        </FocusScope>
        {process.env.NODE_ENV !== "production" && (
          <>
            <TitleWarning titleId={context.titleId} />
            <DescriptionWarning
              contentRef={contentRef}
              descriptionId={context.descriptionId}
            />
          </>
        )}
      </>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = "DialogTitle";

type DialogTitleElement = React.ElementRef<typeof Primitive.h2>;
type PrimitiveHeading2Props = Radix.ComponentPropsWithoutRef<
  typeof Primitive.h2
>;
interface DialogTitleProps extends PrimitiveHeading2Props {}

const DialogTitle = React.forwardRef<
  DialogTitleElement,
  DialogTitleProps
>(
  (props: ScopedProps<DialogTitleProps>, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return (
      <Primitive.h2 id={context.titleId} {...titleProps} ref={forwardedRef} />
    );
  },
);

DialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = "DialogDescription";

type DialogDescriptionElement = React.ElementRef<typeof Primitive.p>;
type PrimitiveParagraphProps = Radix.ComponentPropsWithoutRef<
  typeof Primitive.p
>;
interface DialogDescriptionProps extends PrimitiveParagraphProps {}

const DialogDescription = React.forwardRef<
  DialogDescriptionElement,
  DialogDescriptionProps
>(
  (props: ScopedProps<DialogDescriptionProps>, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return (
      <Primitive.p
        id={context.descriptionId}
        {...descriptionProps}
        ref={forwardedRef}
      />
    );
  },
);

DialogDescription.displayName = DESCRIPTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = "DialogClose";

type DialogCloseElement = React.ElementRef<typeof Primitive.button>;
interface DialogCloseProps extends PrimitiveButtonProps {}

const DialogClose = React.forwardRef<
  DialogCloseElement,
  DialogCloseProps
>(
  (props: ScopedProps<DialogCloseProps>, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return (
      <Primitive.button
        type="button"
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () =>
          context.onOpenChange(false))}
      />
    );
  },
);

DialogClose.displayName = CLOSE_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? "open" : "closed";
}

const TITLE_WARNING_NAME = "DialogTitleWarning";

const [WarningProvider, useWarningContext] = createContext(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog",
});

type TitleWarningProps = { titleId?: string };

const TitleWarning: React.FC<TitleWarningProps> = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);

  const MESSAGE =
    `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;

  React.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) throw new Error(MESSAGE);
    }
  }, [MESSAGE, titleId]);

  return null;
};

const DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";

type DescriptionWarningProps = {
  contentRef: React.RefObject<DialogContentElement>;
  descriptionId?: string;
};

const DescriptionWarning: React.FC<DescriptionWarningProps> = (
  { contentRef, descriptionId },
) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE =
    `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;

  React.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    // if we have an id and the user hasn't set aria-describedby={undefined}
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);

  return null;
};

const Root = Dialog;
const Trigger = DialogTrigger;
const Portal = DialogPortal;
const Overlay = DialogOverlay;
const Content = DialogContent;
const Title = DialogTitle;
const Description = DialogDescription;
const Close = DialogClose;

export {
  Close,
  Content,
  createDialogScope,
  Description,
  //
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Overlay,
  Portal,
  //
  Root,
  Title,
  Trigger,
  //
  WarningProvider,
};
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
};
