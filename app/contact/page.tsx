"use client"

import TopStories from "@/components/topStories/TopStories";
import React from "react";
import { contactFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/button/Button";
import CustomTextArea from "@/components/customInput/CustomTextArea";

const fieldClass = '!border-gray-100'

const Contacts = () => {
    const formSchema = contactFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: '',
            message: ''
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    return (
        <section className="flex gap-5 max-xl:flex-col">
            <div className="xl:w-[60%] max-w-full">
                <h1 className="heading max-md:text-center font-century-schoolbook">Contact Us</h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 w-full xl:max-w-[70%] max-w-full mt-12 max-md:px-5"
                    >
                        <CustomInput
                            control={form.control}
                            name="name"
                            label="Name"
                            fieldClassName={`${fieldClass}`}
                            placeholder="Name Here.."
                            schema={formSchema}
                        />
                        <CustomInput
                            control={form.control}
                            name="email"
                            label="Email"
                            fieldClassName={`${fieldClass}`}
                            placeholder="Email Here.."
                            schema={formSchema}
                        />
                        <CustomTextArea
                            control={form.control}
                            name="message"
                            label="Message"
                            fieldClassName={`${fieldClass}`}
                            placeholder="Message Here.."
                            schema={formSchema}
                        />
                        <div className="flex justify-end">
                            <Button variant="primary" className="w-fit max-md:w-full">SUBMIT</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="xl:max-w-[40%] max-xl:px-5">
                <TopStories showViewMore={true} />
            </div>
        </section>
    );
};

export default Contacts;
