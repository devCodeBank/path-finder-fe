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
                    'h-[56px] peer border-[#CCCCCC80] bg-white pb-1 text-[#333333] hover:text-[#333333] font-[500] text-[13px] placeholder:text-[13px] placeholder:font-[400] placeholder:text-[#333333]/40 hover:placeholder:text-[#333333]/40 focus-visible:ring-0 focus-visible:border-[#666666] hover:border-[#666666] disabled:bg-[#EAEAEA]/25 disabled:text-[#9CA3AF] disabled:font-[400] disabled:border-[#DDDDDD] disabled:opacity-100',
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
                'absolute start-2 z-10 origin-[0] transform px-2 text-[14px] font-[500] duration-300 cursor-text pointer-events-none bg-white text-[#333333] top-1 peer-disabled:font-[400] peer-disabled:text-[#9CA3AF]',
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
                    "peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-100 peer-focus:text-[#717171]",
                    labelClassName
                )}
            >
                <span>{label}</span>
                {required && <span className="text-[#333333]"> *</span>}
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
    const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties | null>(null);
    const selectedValue = value ?? defaultValue ?? "";
    const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label ?? "";
    const placeholderText = placeholder ?? "Select";
    const visibleCount = maxVisibleOptions ? Math.min(maxVisibleOptions, options.length) : 0;

    React.useEffect(() => {
        if (!isOpen || !buttonRef.current) {
            setMenuStyle(null);
            return;
        }

        const updateMenuPosition = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) {
                return;
            }
            setMenuStyle({
                position: "fixed",
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                zIndex: 2000,
            });
        };

        updateMenuPosition();
        window.addEventListener("scroll", updateMenuPosition, true);
        window.addEventListener("resize", updateMenuPosition);

        return () => {
            window.removeEventListener("scroll", updateMenuPosition, true);
            window.removeEventListener("resize", updateMenuPosition);
        };
    }, [isOpen]);

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
                                "h-[56px] w-full peer border border-[#CCCCCC80] bg-white rounded-md px-3 pb-1 text-left text-[#333333] font-[500] !text-[13px] focus:outline-none focus:ring-0 focus:border-[#666666] focus-visible:border-[#666666] hover:border-[#666666] disabled:bg-[#EAEAEA]/25 disabled:text-[#9CA3AF] disabled:font-[400] disabled:border-[#DDDDDD] disabled:opacity-100",
                                className
                            )}
                        >
                            <span
                                className={cn(
                                    "block truncate",
                                    disabled
                                        ? "text-[#9CA3AF]"
                                        : selectedLabel
                                            ? "text-[#333333]"
                                            : "text-[#333333]/40"
                                )}
                            >
                                {selectedLabel || placeholderText}
                            </span>
                        </button>
                        <ChevronDown className={cn(
                            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171] transition-transform",
                            isOpen ? "rotate-180" : ""
                        )} />
                        {isOpen && menuStyle && (
                            <div
                                className="rounded-md border border-[#CCCCCC80] bg-white shadow-[0px_6px_16px_0px_#0000001F] overflow-y-auto"
                                style={{
                                    ...menuStyle,
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
                                "h-[56px] w-full peer border border-[#CCCCCC80] bg-white rounded-md px-3 pb-1 text-[#333333] font-[500] !text-[13px] focus:outline-none focus:ring-0 focus:border-[#666666] focus-visible:border-[#666666] hover:border-[#666666] disabled:bg-[#EAEAEA]/25 disabled:text-[#9CA3AF] disabled:font-[400] disabled:border-[#DDDDDD] disabled:opacity-100 appearance-none",
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
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]" />
                    </>
                )}
            </div>
            <FloatingLabel
                htmlFor={id}
                className={cn(
                    "peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-100 peer-focus:text-[#717171]",
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
