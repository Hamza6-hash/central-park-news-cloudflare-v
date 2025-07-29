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
import CustomToast from "../ui/customToast";


const Banner = () => {
    const formSchema = subscribtionFormSchema();
    const pathname = usePathname();
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState<'success' | 'error' | 'alreadyUnsubscribed'>('success');
    const [toastTitle, setToastTitle] = useState<string>('Success');
    const [toastDescription, setToastDescription] = useState<string>('Thanks For Subscribing.');
    const [res, setRes] = useState<string | null>(null);

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
                setToastType('error');
                setToastTitle('Subscription Failed');
                setToastDescription(result.message || 'Failed to subscribe. Try again later');
                setShowToast(true);
                setRes(result.message);
            } else {
                setToastType('success');
                setToastTitle('Success');
                setToastDescription('Thanks for subscribing!');
                setShowToast(true);
                setRes(null);
                form.reset();
            }
        } catch (error) {
            console.error(error);
            setToastType('error');
            setToastTitle('Error');
            setToastDescription('Something went wrong.');
            setShowToast(true);
            setRes('Something went wrong');
        }
    };

    const { mutate: subscribe, isPending } = useMutation({
        mutationFn: onSubmit,
    });

    // Reset form on route change
    useEffect(() => {
        form.reset();
        setRes(null)
    }, [pathname, form]);;


    const onChangeField = (e: any) => {
        if (!e?.target?.value) form.reset();
        setRes(null);
    }


    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showToast]);



    return (
        <section className="banner">
            <div className="space-y-6 px-6 md:px-0 w-[780px]">
                <div className="w-full flex flex-col items-center gap-0.5">
                    <p className="text-[#363636]  text-2xl font-medium">
                        Newsletter
                    </p>
                    <p className="text-[#807F7F] text-base">
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
                            <Button className="bg-[#303130] hover:bg-white hover:text-black transition-all duration-300 ease-in text-white py-3 px-6 w-full " disabled={isPending}>
                                {isPending ? "SUBSCRIBING..." : "SUBSCRIBE"}
                            </Button>
                        </div>
                    </form>
                </Form>
                <CustomToast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    title={toastTitle}
                    description={toastDescription}
                    type={toastType}
                />
            </div>
        </section>
    );
};

export default Banner;
