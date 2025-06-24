"use client";

import { subscribtionFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/button/Button";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import CustomToast from "../ui/customToast";


const Banner = () => {
    const formSchema = subscribtionFormSchema();
    const pathname = usePathname();
    const [showToast, setShowToast] = useState(false);
    const [res, setRes] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (!response.ok) {
                setRes(result.message);
            } else {
                setRes(null);
                form.reset();
                setShowToast(true);

            }
        } catch (error) {
            console.error(error);
            setRes("Something went wrong");
        }
    };

    const { mutate: subscribe, isPending } = useMutation({
        mutationFn: onSubmit,
    });

    // Reset form on route change
    useEffect(() => {
        form.reset();
    }, [pathname, form]);

    const onChangeField = (e: any) => {
        if (!e?.target?.value) form.reset();
        setRes(null);
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
                        onSubmit={form.handleSubmit((data: any) => subscribe(data))}
                        className="flex gap-4 sm:flex-row flex-col items-center justify-center w-full"
                    >
                        <div className="flex gap-4 sm:flex-row flex-col justify-center sm:w-fit w-full">
                            <div className="flex flex-col w-full">
                                <CustomInput
                                    control={form.control}
                                    name="email"
                                    label=""
                                    placeholder="Your email address"
                                    fieldClassName={'sm:w-80 font-century-gothic font-[400] text-[14px] not-italic text-[#A3A0A0]'}
                                    schema={formSchema}
                                    onChange={onChangeField}
                                />
                                {res && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {res}
                                    </p>
                                )}
                            </div>
                            <Button variant="gradient" className="py-3 px-6 w-full " disabled={isPending}>
                                {isPending ? "SUBSCRIBING..." : "SUBSCRIBE"}
                            </Button>
                        </div>
                    </form>
                </Form>
                <CustomToast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                />
            </div>
        </section>
    );
};

export default Banner;
