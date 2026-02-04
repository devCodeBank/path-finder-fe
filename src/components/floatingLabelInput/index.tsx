import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  floatLabel?: boolean;
};

const baseInputClass =
  "h-[36px] w-full rounded-[4px] border border-[#CCCCCC80] bg-white px-3 text-[13px] text-[#333333] hover:border-[#666666] focus:border-[#333333] focus:outline-none disabled:text-[#9E9E9E] disabled:border-[#DDDDDD] disabled:cursor-not-allowed disabled:opacity-100";

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ id, label, required, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[14px] font-medium text-[#333333]/70">
            {label}
            {required && <span className="text-[#333333]/70"> *</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(baseInputClass, className)}
          {...props}
        />
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  maxVisibleOptions?: number;
  floatLabel?: boolean;
}

const FloatingLabelSelect = ({
  label,
  options,
  id,
  value,
  onValueChange,
  disabled,
  placeholder,
  className,
  required,
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[14px] font-medium text-[#333333]/70">
          {label}
          {required && <span className="text-[#333333]/70"> *</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(baseInputClass, "appearance-none pr-8", className)}
          value={value ?? ""}
          onChange={(event) => onValueChange?.(event.target.value)}
          disabled={disabled}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
      </div>
    </div>
  );
};

FloatingLabelSelect.displayName = "FloatingLabelSelect";

export { FloatingLabelInput, FloatingLabelSelect };
