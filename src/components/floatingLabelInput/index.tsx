import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

/* =========================
   INPUT
========================= */

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                placeholder=" "
                className={cn(
                    `
          h-[56px] peer
          border border-[#CCCCCC80] bg-white pb-1
          text-[#333333] font-[400] text-[13px]

          placeholder:text-[#9E9E9E]/85
          hover:placeholder:text-[#9E9E9E]/85

          focus-visible:ring-0
          focus-visible:border-[#666666]
          hover:border-[#333333]

          disabled:text-[#9E9E9E]
          disabled:border-[#DDDDDD]
          disabled:opacity-100
          `,
                    className
                )}
                {...props}
            />
        );
    }
);
FloatingInput.displayName = "FloatingInput";

/* =========================
   LABEL (BASE)
========================= */

const FloatingLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
    return (
        <Label
            ref={ref}
            className={cn(
                `
        absolute start-2 z-10 origin-[0] transform px-2
        text-[14px] font-[500] duration-300
        cursor-text pointer-events-none bg-white
        `,
                className
            )}
            {...props}
        />
    );
});
FloatingLabel.displayName = "FloatingLabel";

/* =========================
   FLOATING INPUT
========================= */

type FloatingLabelInputProps = InputProps & {
    label?: string;
    floatLabel?: boolean;
    required?: boolean;
};

const FloatingLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(({ id, label, className, required, ...props }, ref) => {
    return (
        <div className={cn("relative", className)}>
            <FloatingInput ref={ref} id={id} {...props} />

            <FloatingLabel
                htmlFor={id}
                className="
          text-[#707070]
          peer-focus:text-[#707070]
          peer-disabled:!text-[#9E9E9E]
        

          top-1
         -translate-y-4
          scale-100
        "
            >
                {label}
                {required && <span className="text-[#707070]"> *</span>}
            </FloatingLabel>
        </div>
    );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

/* =========================
   SELECT
========================= */

export interface SelectProps {
    label?: string;
    options: { value: string; label: string }[];
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    id?: string;
    maxVisibleOptions?: number;
    placeholder?: string;
    className?: string;
}

const FloatingLabelSelect = ({
    label,
    options,
    id,
    value,
    onValueChange,
    disabled,
    maxVisibleOptions,
    placeholder,
    className,
}: SelectProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const selectedLabel =
        options.find((o) => o.value === value)?.label ?? "";
    const placeholderText = placeholder ?? "Select";

    React.useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={wrapperRef} className={cn("relative", className)}>
            <button
                type="button"
                id={id}
                disabled={disabled}
                onClick={() => !disabled && setIsOpen((p) => !p)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="
          peer h-[56px] w-full
          border border-[#CCCCCC80] bg-white rounded-md
          px-3 pb-1 text-left text-[13px]

          focus:outline-none
          focus:border-[#666666]

          disabled:text-[#9E9E9E]/75
          disabled:cursor-not-allowed
        "
            >
                <span
                    className={cn(
                        disabled
                            ? "text-[#9E9E9E]/75"
                            : selectedLabel
                                ? "text-[#333333]"
                                : "text-[#9E9E9E]"
                    )}
                >
                    {selectedLabel || placeholderText}
                </span>
            </button>

            <ChevronDown
                className={cn(
                    "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4",
                    disabled ? "text-[#ADADAD]" : "text-[#707070]"
                )}
            />
            {isOpen && !disabled && (
                <ul
                    role="listbox"
                    className="
            absolute z-20 mt-1 w-full
            rounded-md border border-[#CCCCCC80] bg-white
            shadow-[0px_6px_16px_0px_#00000029]
            overflow-auto
          "
                    style={{
                        maxHeight: maxVisibleOptions
                            ? `${maxVisibleOptions * 40}px`
                            : undefined,
                    }}
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <li key={option.value} role="option" aria-selected={isSelected}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onValueChange?.(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-3 py-2 text-left text-[13px] hover:bg-[#F2F2F2]",
                                        isSelected
                                            ? "bg-[#F7F7F7] text-[#333333]"
                                            : "text-[#333333]"
                                    )}
                                >
                                    {option.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* 🔥 THIS IS THE CRITICAL FIX */}
            <FloatingLabel
                htmlFor={id}
                className={cn(
                    `
          top-1 -translate-y-4 scale-100
          `,
                    disabled
                        ? "!text-[#ADADAD]" // ✅ FORCE disabled color
                        : "text-[#707070]"
                )}
            >
                {label}
            </FloatingLabel>
        </div>
    );
};

FloatingLabelSelect.displayName = "FloatingLabelSelect";

export {
    FloatingInput,
    FloatingLabel,
    FloatingLabelInput,
    FloatingLabelSelect,
};
