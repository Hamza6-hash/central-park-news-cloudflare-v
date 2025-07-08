import React, { ChangeEventHandler } from 'react';
import {
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Control, FieldPath } from "react-hook-form";
import type { ZodTypeAny, infer as zInfer } from "zod";

interface CustomInputProps<T extends ZodTypeAny> {
    control: Control<zInfer<T>>;
    name: FieldPath<zInfer<T>>;
    label: string;
    placeholder: string;
    type?: string;
    fieldClassName?: string;
    schema: T;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

const CustomInput = <T extends ZodTypeAny>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    fieldClassName,
    schema,
    onChange,
}: CustomInputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className="form-item">
                    {label && <FormLabel className="form-label">{label}</FormLabel>}
                    <div className="flex w-full flex-col">
                        <FormControl>
                            <Input
                                placeholder={placeholder}
                                className={`input-class ${fieldClassName}`}
                                onChangeCapture={onChange}
                                type={type}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage className="form-message mt-2" />
                    </div>
                </div>
            )}
        />
    );
};

export default CustomInput;
