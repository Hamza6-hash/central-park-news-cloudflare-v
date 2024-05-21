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
        <section className="flex gap-5">
            <div className="w-[60%]">
                <h1 className="heading">Contact Us</h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 w-full max-w-[70%] mt-12"
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
                        <Button variant="primary" className="w-fit">SUBMIT</Button>
                    </form>
                </Form>
            </div>
            <div className="w-[40%]">
                <TopStories showViewMore={true} />
            </div>
        </section>
    );
};

export default Contacts;
