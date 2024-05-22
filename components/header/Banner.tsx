"use client"

import { subscribtionFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from "react";
import { Form, } from "@/components/ui/form"
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/button/Button";
import AppDownloadButton from "../button/AppDownloadButton ";
import { BiLogoPlayStore } from "react-icons/bi";
import { IoLogoApple } from "react-icons/io5";
import SocialMedia from "../common/SocialMedia";


const Banner = () => {
    const formSchema = subscribtionFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            contactNumber: undefined
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {

        } catch (error) {
            console.log(error);
        } finally {

        }
    }

    return (
        <section className="banner">
            <div className="w-full flex flex-col items-center gap-0.5">
                <p className="text-primary-900  text-xl font-century-schoolbook">Newsletter</p>
                <p className="text-gray-500 text-base">Stay up to date with our latest news.</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 w-full max-lg:flex-col">
                    <CustomInput
                        control={form.control}
                        name='email'
                        label=''
                        placeholder='Your email address'
                        schema={formSchema}
                    />
                    <CustomInput
                        control={form.control}
                        name='contactNumber'
                        label=''
                        placeholder='Your contact number'
                        schema={formSchema}
                    />
                    <Button
                        variant='gradient'
                    >
                        SUBSCRIBE
                    </Button>
                </form>
            </Form>
            <div className="flex items-center justify-between w-full">
                <div className="flex gap-4 items-center">
                    <AppDownloadButton icon={<BiLogoPlayStore className="text-primary-900" size={30} />} subHeading="GET IT ON" heading="Google Play" />
                    <AppDownloadButton icon={<IoLogoApple className="text-primary-900" size={30} />} subHeading="Download on the" heading="App Store" />
                </div>

                <SocialMedia />
            </div>
        </section>
    );
};

export default Banner;
