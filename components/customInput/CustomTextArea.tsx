import React from 'react';
import {
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Control, FieldPath } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Textarea } from '@/components/ui/textarea';

// Define the CustomInput interface at the file level
interface CustomInput<T extends ZodType<any, any>> {
    control: Control<z.infer<T>>;
    name: FieldPath<z.infer<T>>;
    label: string;
    placeholder: string;
    fieldClassName?: string;
    schema: T;
}

// Define the CustomTextArea component at the file level
const CustomTextArea = <T extends ZodType<any, any>>(
    {
        control,
        name,
        label,
        placeholder,
        fieldClassName,
        schema
    }: CustomInput<T>
) => {
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
                            <Textarea
                                placeholder={placeholder}
                                rows={7}
                                className={`input-class ${fieldClassName}`}
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

export default CustomTextArea;
