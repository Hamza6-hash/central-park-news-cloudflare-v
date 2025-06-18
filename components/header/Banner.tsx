"use client";

import { subscribtionFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/button/Button";
import { usePathname } from "next/navigation";

const Banner = () => {
    const formSchema = subscribtionFormSchema();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {

        } catch (error) {
            console.error(error);
        } finally {

        }
    };

    // Reset form on route change
    useEffect(() => {
        form.reset();
    }, [pathname, form]);

    const onChangeField = (e: any) => {
        if (!e?.target?.value) form.reset();
    }

    return (
        <section className="banner">
            <div className="space-y-6 px-6 md:px-0 w-[780px]">
                <div className="w-full flex flex-col items-center gap-0.5">
                    <p className="text-primary-900  text-2xl font-medium">
                        Newsletter
                    </p>
                    <p className="text-primary-500 text-base">
                        Stay up to date with our latest news.
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex gap-4 sm:flex-row flex-col items-center justify-center w-full"
                    >
                        <div className="flex gap-4 sm:flex-row flex-col justify-center sm:w-fit w-full">
                            <CustomInput
                                control={form.control}
                                name="email"
                                label=""
                                placeholder="Your email address"
                                fieldClassName={'sm:w-80 font-century-gothic font-[400] text-[14px] not-italic text-[#A3A0A0]'}
                                schema={formSchema}
                                onChange={onChangeField}
                            />
                            <Button variant="gradient" className="py-3 px-6 w-full ">SUBSCRIBE</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default Banner;
