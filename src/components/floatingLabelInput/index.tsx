import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <Input
                placeholder=" "
                className={cn(
                    'h-[56px] peer border-[#CCCCCC] bg-white  pb-1 shadow-[0px_4px_4px_0px_#00000014] text-[#333333] font-[400] !text-[13px] focus-visible:ring-0 focus-visible:border-[#6E41E2] disabled:bg-white disabled:opacity-100',
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
                'absolute start-2 z-10 origin-[0] transform px-2 text-[14px] font-[500] duration-300 cursor-text pointer-events-none bg-white text-[#333333]',
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
            <Select
                value={value}
                onValueChange={onValueChange}
                defaultValue={defaultValue}
                disabled={disabled}
            >
                <SelectTrigger
                    id={id}
                    className={cn(
                        'h-[56px] w-full peer border-[#CCCCCC] bg-white rounded-md px-3  pb-1 shadow-[0px_4px_4px_0px_#00000014] text-[#333333] font-[400] !text-[13px] focus:ring-0 focus:border-[#6E41E2] disabled:bg-white disabled:opacity-100 [&>span]:mt-1.5',
                        className
                    )}
                >
                    <SelectValue placeholder=" " />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#CCCCCC] shadow-lg">
                    {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-[#333333] font-[500]">
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
