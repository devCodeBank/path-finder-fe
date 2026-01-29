import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <Input
                placeholder=" "
                className={cn(
                    'h-[56px] peer border-[#CCCCCC80] bg-white pb-1 text-[#333333] hover:text-[#333333] font-[400] text-[13px] placeholder:text-[13px] placeholder:font-[400] placeholder:text-[#333333]/40 hover:placeholder:text-[#333333]/40 focus-visible:ring-0 focus-visible:border-[#666666] hover:border-[#333333] hover:text-[#333333]  disabled:text-[#333333]/50 disabled:font-[400] disabled:border-[#DDDDDD] disabled:opacity-100',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
    return (
        <Label
            className={cn(
                'absolute start-2 z-10 origin-[0] transform px-2 text-[14px] font-[500] duration-300 cursor-text pointer-events-none bg-white text-[#333333] top-1 peer-disabled:font-[400] peer-disabled:text-[#333333]/70',
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = InputProps & { label?: string; labelClassName?: string; floatLabel?: boolean; required?: boolean };

const FloatingLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(({ id, label, className, labelClassName, required, ...props }, ref) => {
    const floatLabel = props.floatLabel;
    const inputProps = { ...props };
    delete inputProps.floatLabel;
    return (
        <div className={cn("relative", className)}>
            <FloatingInput ref={ref} id={id} {...inputProps} />
            <FloatingLabel
                htmlFor={id}
                className={cn(
                    floatLabel
                        ? "top-1 -translate-y-4 scale-100"
                        : "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 top-1 -translate-y-4 scale-100",
                    "peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-100",
                    labelClassName
                )}
            >
                <span>{label}</span>
                {required && <span className="text-[#333333]/70"> *</span>}
            </FloatingLabel>
        </div>
    );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export interface SelectProps {
    label?: string;
    labelClassName?: string;
    options: { value: string; label: string }[];
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    maxVisibleOptions?: number;
    floatLabel?: boolean;
    required?: boolean;
    placeholder?: string;
}

const FloatingLabelSelect = ({
    className,
    label,
    labelClassName,
    options,
    id,
    value,
    onValueChange,
    defaultValue,
    disabled,
    maxVisibleOptions,
    floatLabel,
    required,
    placeholder
}: SelectProps) => {
    const hasValue = value || defaultValue;
    const [isOpen, setIsOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const selectedValue = value ?? defaultValue ?? "";
    const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label ?? "";
    const placeholderText = placeholder ?? "Select";
    const visibleCount = maxVisibleOptions ? Math.min(maxVisibleOptions, options.length) : 0;

    return (
        <div className={cn("relative", isOpen ? "z-20" : "", className)}>
            <div className="relative">
                {maxVisibleOptions ? (
                    <>
                        <button
                            type="button"
                            id={id}
                            ref={buttonRef}
                            disabled={disabled}
                            onClick={() => setIsOpen((prev) => !prev)}
                            onBlur={() => setIsOpen(false)}
                            className={cn(
                                "h-[56px] w-full peer border border-[#CCCCCC80] bg-white rounded-md px-3 pb-1 text-left text-[#333333] font-[400] !text-[13px] focus:outline-none focus:ring-0 focus:border-[#666666] focus-visible:border-[#666666] hover:border-[#666666] disabled:text-[#666666]/50 disabled:font-[400] disabled:border-[#DDDDDD] disabled:opacity-100 disabled:cursor-not-allowed",
                                className
                            )}
                        >
                            <span
                                className={cn(
                                    "block truncate",
                                    disabled
                                        ? "text-[#666666]/50"
                                        : selectedLabel
                                            ? "text-[#333333]"
                                            : "text-[#333333]/40"
                                )}
                            >
                                {selectedLabel || placeholderText}
                            </span>
                        </button>
                        <ChevronDown
                            className={cn(
                                "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform",
                                disabled ? "text-[#CCCCCC]" : "text-[#666666]",
                                isOpen ? "rotate-180" : ""
                            )}
                        />
                        {isOpen && (
                            <div
                                className="absolute left-0 top-[calc(100%+4px)] z-20 w-full rounded-md border border-[#CCCCCC80] bg-white shadow-[0px_6px_16px_0px_#0000001F] overflow-y-auto"
                                style={{
                                    maxHeight: visibleCount ? `${visibleCount * 32}px` : undefined,
                                    scrollbarGutter: "stable",
                                }}
                            >
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            onValueChange?.(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full px-3 py-2 text-left text-[13px] text-[#333333] hover:bg-[#F3F4F6]",
                                            opt.value === selectedValue ? "bg-[#F3F4F6]" : ""
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <select
                            id={id}
                            value={value}
                            onChange={(event) => onValueChange?.(event.target.value)}
                            defaultValue={defaultValue}
                            disabled={disabled}
                            className={cn(
                                "h-[56px] w-full peer border border-[#CCCCCC80] bg-white rounded-md px-3 pb-1 text-[#333333] font-[400] !text-[13px] focus:outline-none focus:ring-0 focus:border-[#666666] focus-visible:border-[#666666] hover:border-[#666666] disabled:text-[#666666]/50 disabled:font-[400] disabled:border-[#DDDDDD] disabled:opacity-100 disabled:cursor-not-allowed appearance-none",
                                className
                            )}
                        >
                            <option value="" disabled hidden>
                                {placeholderText}
                            </option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className={cn(
                                "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2",
                                disabled ? "text-[#CCCCCC]" : "text-[#666666]"
                            )}
                        />
                    </>
                )}
            </div>
            <FloatingLabel
                htmlFor={id}
                className={cn(
                    "peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-100 peer-focus:text-[#666666]",
                    floatLabel
                        ? 'top-1 -translate-y-4 scale-100'
                        : hasValue
                            ? 'top-1 -translate-y-4 scale-100'
                            : 'top-1/2 -translate-y-1/2 scale-100',
                    labelClassName
                )}
            >
                <span>{label}</span>
                {required && <span className="text-[#333333]"> *</span>}
            </FloatingLabel>
        </div>
    );
};
FloatingLabelSelect.displayName = 'FloatingLabelSelect';

export { FloatingInput, FloatingLabel, FloatingLabelInput, FloatingLabelSelect };
