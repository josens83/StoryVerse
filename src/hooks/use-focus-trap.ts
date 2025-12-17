/**
 * useFocusTrap Hook
 *
 * Traps focus within a container element for accessibility (Chapter 17).
 * Essential for modals, dialogs, and dropdown menus to ensure keyboard
 * users can't accidentally navigate outside.
 *
 * @module hooks/use-focus-trap
 *
 * @example
 * function Modal({ isOpen, onClose }) {
 *   const modalRef = useRef<HTMLDivElement>(null);
 *   useFocusTrap(modalRef, isOpen);
 *
 *   return (
 *     <div ref={modalRef} role="dialog" aria-modal="true">
 *       <button onClick={onClose}>Close</button>
 *       <p>Modal content</p>
 *     </div>
 *   );
 * }
 */

import { useEffect, useRef, type RefObject } from 'react';

/** Selector for all focusable elements */
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(', ');

interface UseFocusTrapOptions {
  /** Whether to return focus to the previously focused element on unmount */
  returnFocusOnDeactivate?: boolean;
  /** Selector for the initial focus element (defaults to first focusable) */
  initialFocus?: string;
  /** Whether to close on Escape key press */
  closeOnEscape?: boolean;
  /** Callback when Escape is pressed */
  onEscape?: () => void;
}

/**
 * Trap focus within a container element
 *
 * @param containerRef - Ref to the container element
 * @param isActive - Whether the focus trap is active
 * @param options - Configuration options
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  options: UseFocusTrapOptions = {}
) {
  const { returnFocusOnDeactivate = true, initialFocus, closeOnEscape = true, onEscape } = options;

  // Store the element that had focus before trap was activated
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements in the container
    const getFocusableElements = () => {
      const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);
      return Array.from(elements).filter(
        (el) => el.offsetParent !== null // Filter out hidden elements
      );
    };

    // Set initial focus
    const setInitialFocus = () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        return;
      }

      if (initialFocus) {
        const initialElement = container.querySelector<HTMLElement>(initialFocus);
        if (initialElement) {
          initialElement.focus();
          return;
        }
      }

      // Focus the first focusable element
      focusableElements[0]?.focus();
    };

    // Handle Tab key to trap focus
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Escape key
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onEscape?.();
        return;
      }

      // Only trap Tab key
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift+Tab on first element -> go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
        return;
      }

      // Tab on last element -> go to first
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
        return;
      }
    };

    // Prevent focus leaving the container via click
    const handleFocusIn = (event: FocusEvent) => {
      if (!container.contains(event.target as Node)) {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0]?.focus();
        }
      }
    };

    // Set initial focus after a brief delay to ensure DOM is ready
    requestAnimationFrame(setInitialFocus);

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      // Return focus to previously focused element
      if (returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, containerRef, initialFocus, returnFocusOnDeactivate, closeOnEscape, onEscape]);
}

/**
 * Hook to manage focus return after modal closes
 *
 * @example
 * function Modal({ isOpen, onClose }) {
 *   const { triggerRef, contentRef } = useFocusReturn();
 *
 *   return (
 *     <>
 *       <button ref={triggerRef} onClick={() => setOpen(true)}>
 *         Open Modal
 *       </button>
 *       {isOpen && (
 *         <div ref={contentRef} role="dialog">
 *           <button onClick={onClose}>Close</button>
 *         </div>
 *       )}
 *     </>
 *   );
 * }
 */
export function useFocusReturn() {
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return () => {
      // Return focus to trigger element when component unmounts
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, []);

  return { triggerRef, contentRef };
}
