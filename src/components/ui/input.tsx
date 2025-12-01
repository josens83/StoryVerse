/**
 * Input Component
 *
 * A styled form input with optional label and error message support.
 * Fully accessible with proper focus states and error styling.
 *
 * @module components/ui/input
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Input component
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display below the input */
  error?: string;
  /** Label text displayed above the input */
  label?: string;
}

/**
 * A styled input component with label and error support
 *
 * @example
 * // Basic input
 * <Input placeholder="Enter your name" />
 *
 * @example
 * // With label and error
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Invalid email address"
 * />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label ? (
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        ) : null}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-950 dark:placeholder:text-gray-400',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
