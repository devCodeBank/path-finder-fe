import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <Input
                placeholder=" "
                className={cn(
                    'h-[56px] peer border-[#CCCCCC] shadow-[0px_4px_4px_0px_#00000014] text-[#333333] font-[500] text-[16px] focus-visible:ring-0 focus-visible:border-[#6E41E2]',
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
                'absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform px-2 text-sm text-[#333333]  text-[14px] font-[500] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 cursor-text pointer-events-none',
                'bg-white peer-disabled:bg-[#F3F4F6] peer-focus:text-[#717171]',
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
            <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
        </div>
    );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingInput, FloatingLabel, FloatingLabelInput };
