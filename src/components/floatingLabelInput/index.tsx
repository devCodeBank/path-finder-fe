import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  floatLabel?: boolean;
};

const baseInputClass =
  "h-[36px] w-full rounded-[4px] border border-[#CCCCCC80] bg-white px-3 text-[13px] text-[#333333] hover:border-[#666666] focus:border-[#333333] focus:outline-none disabled:text-[#9E9E9E] disabled:border-[#DDDDDD] disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-[#EAEAEA]/25";

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
  hideChevron?: boolean;
}

export interface FloatingLabelSelectHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const FloatingLabelSelect = React.forwardRef<FloatingLabelSelectHandle, SelectProps>(({
  label,
  options,
  id,
  value,
  onValueChange,
  disabled,
  placeholder,
  className,
  required,
  hideChevron = false,
}: SelectProps, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  React.useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDropdownStyle({
        position: "fixed",
        left: rect.left,
        top: rect.bottom + 4,
        width: rect.width,
        zIndex: 2400,
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label ?? "";
  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
  };
  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  React.useImperativeHandle(ref, () => ({
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
  }));

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[14px] font-medium text-[#333333]/70">
          {label}
          {required && <span className="text-[#333333]/70"> *</span>}
        </label>
      )}
      <div className="relative" ref={wrapperRef}>
        <button
          id={id}
          type="button"
          ref={triggerRef}
          className={cn(
            baseInputClass,
            "flex items-center justify-between text-left",
            hideChevron ? "pr-3" : "pr-8",
            disabled && "cursor-not-allowed",
            className
          )}
          onClick={() => {
            toggleDropdown();
          }}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!displayValue && placeholder ? "text-[#9E9E9E]" : "")}>
            {displayValue || placeholder || ""}
          </span>
        </button>
        {!hideChevron && (
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]",
              disabled && "text-[#9E9E9E]"
            )}
          />
        )}
        {isOpen && !disabled && typeof document !== "undefined" &&
          createPortal(
            <ul
              ref={listRef}
              role="listbox"
              style={dropdownStyle}
              className="max-h-56 overflow-y-auto rounded-[4px] border border-[#CCCCCC80] bg-white py-1 text-[13px] text-[#333333] shadow-[0px_6px_16px_0px_#0000001A]"
            >
              {placeholder && (
                <li
                  role="option"
                  aria-selected={!value}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-[#9E9E9E] hover:bg-[#F3F4F6]",
                    !value && "bg-[#F3F4F6]"
                  )}
                  onClick={() => {
                    onValueChange?.("");
                    setIsOpen(false);
                  }}
                >
                  {placeholder}
                </li>
              )}
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "cursor-pointer px-3 py-2 hover:bg-[#F3F4F6]",
                      isSelected && "bg-[#F3F4F6]"
                    )}
                    onClick={() => {
                      onValueChange?.(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>,
            document.body
          )}
      </div>
    </div>
  );
});

FloatingLabelSelect.displayName = "FloatingLabelSelect";

export { FloatingLabelInput, FloatingLabelSelect };
