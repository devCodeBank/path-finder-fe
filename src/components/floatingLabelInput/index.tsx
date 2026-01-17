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
                    'h-[56px] peer border-[#CCCCCC] bg-white pb-1 text-[#333333]  hover:text-[#333333] font-[400] !text-[13px] placeholder:text-[13px] placeholder:font-[400] placeholder:text-[#333333]/70 hover:placeholder:text-[#333333] focus-visible:ring-0 focus-visible:border-[#666666] hover:border-[#666666] disabled:bg-[#EAEAEA]/25 disabled:text-[#9CA3AF] disabled:border-[#DDDDDD] disabled:opacity-100',
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
                'absolute start-2 z-10 origin-[0] transform px-2 text-[16px] font-[500] duration-300 cursor-text pointer-events-none bg-white text-[#333333]',
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = InputProps & { label?: string };

const FloatingLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatingLabelInputProps
>(({ id, label, className, ...props }, ref) => {
    return (
        <div className={cn("relative", className)}>
            <FloatingInput ref={ref} id={id} {...props} />
            <FloatingLabel
                htmlFor={id}
                className={cn(
                    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
                    "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[#717171]",
                    "top-2 -translate-y-4 scale-75"
                )}
            >
                {label}
            </FloatingLabel>
        </div>
    );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export interface SelectProps {
    label?: string;
    options: { value: string; label: string }[];
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
}

const FloatingLabelSelect = ({
    className,
    label,
    options,
    id,
    value,
    onValueChange,
    defaultValue,
    disabled
}: SelectProps) => {
    const hasValue = value || defaultValue;

    return (
        <div className={cn("relative", className)}>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={(event) => onValueChange?.(event.target.value)}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    className={cn(
                        "h-[56px] w-full peer border border-[#CCCCCC] bg-white rounded-md px-3 pb-1 text-[#333333] font-[400] !text-[13px] focus:outline-none focus:ring-0 focus:border-[#666666] focus-visible:border-[#666666] hover:border-[#666666] disabled:bg-[#EAEAEA]/25 disabled:text-[#9CA3AF] disabled:border-[#DDDDDD] disabled:opacity-100 appearance-none",
                        className
                    )}
                >
                    <option value="" disabled hidden />
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]" />
            </div>
            <FloatingLabel
                htmlFor={id}
                className={cn(
                    "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[#717171]",
                    hasValue
                        ? 'top-2 -translate-y-4 scale-75'
                        : 'top-1/2 -translate-y-1/2 scale-100'
                )}
            >
                {label}
            </FloatingLabel>
        </div>
    );
};
FloatingLabelSelect.displayName = 'FloatingLabelSelect';

export { FloatingInput, FloatingLabel, FloatingLabelInput, FloatingLabelSelect };
