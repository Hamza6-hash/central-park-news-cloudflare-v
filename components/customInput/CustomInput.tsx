import React from 'react';
import {
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Control, FieldPath } from 'react-hook-form';
import { z, ZodType } from 'zod';

// Define the CustomInputProps interface at the file level
interface CustomInputProps<T extends ZodType<any, any>> {
    control: Control<z.infer<T>>;
    name: FieldPath<z.infer<T>>;
    label: string;
    placeholder: string;
    type?: string;
    fieldClassName?: string;
    schema: T; // Pass the schema as a prop
}

// Define the CustomInput component at the file level
const CustomInput = <T extends ZodType<any, any>>({
    control,
    name,
    label,
    placeholder,
    type = 'text',
    fieldClassName,
    schema
}: CustomInputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className='form-item'>
                    {label !== '' && <FormLabel className='form-label'>
                        {label}
                    </FormLabel>}
                    <div className="flex w-full flex-col">
                        <FormControl>
                            <Input
                                placeholder={placeholder}
                                className={`input-class ${fieldClassName}`}
                                type={type}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage className='form-message mt-2' />
                    </div>
                </div>
            )}
        />
    )
}

export default CustomInput;
