import * as React from "react";
import { cn } from "../../../utils/index";

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, placeholder, type, onClick, ...rest }, ref) => {
    return (
      <input
        type={type}
        placeholder={placeholder || "Search"}
        className={cn(
          `naxatw-flex naxatw-h-11 naxatw-border-b-2 naxatw-border-grey-300 naxatw-bg-transparent
            naxatw-px-3 naxatw-text-sm naxatw-text-grey-800 file:naxatw-font-medium placeholder:naxatw-text-grey-400
             hover:naxatw-border-primary-400 focus:naxatw-border-primary-400 focus:naxatw-bg-transparent
            focus:naxatw-outline-none disabled:naxatw-cursor-not-allowed disabled:naxatw-opacity-50`,
          className
        )}
        ref={ref}
        onClick={onClick}
        {...rest}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;
