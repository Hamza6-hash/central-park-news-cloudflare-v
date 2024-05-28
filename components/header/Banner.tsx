"use client";

import { subscribtionFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/button/Button";
import AppDownloadButton from "../button/AppDownloadButton ";
import { BiLogoPlayStore } from "react-icons/bi";
import { IoLogoApple } from "react-icons/io5";
import SocialMedia from "../common/SocialMedia";
import Image from "next/image";

const Banner = () => {
    const formSchema = subscribtionFormSchema();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
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
        <section className="banner">
            <div className="space-y-6 px-6 md:px-0 w-[780px]">
                <div className="w-full flex flex-col items-center gap-0.5">
                    <p className="text-primary-900  text-2xl font-medium">
                        Newsletter
                    </p>
                    <p className="text-gray-500 text-base">
                        Stay up to date with our latest news.
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex gap-4 sm:flex-row flex-col items-center justify-center w-full"
                    >
                        <div className="flex gap-4 sm:flex-row flex-col items-center justify-center sm:w-fit w-full">
                            <CustomInput
                                control={form.control}
                                name="email"
                                label=""
                                placeholder="Your email address"
                                fieldClassName={'sm:w-80'}
                                schema={formSchema}
                            />
                            <Button variant="gradient" className="py-3 px-6 w-full">SUBSCRIBE</Button>
                        </div>
                    </form>
                </Form>
                <div className="flex sm:flex-row sm:mb-0 mb-2.5 flex-col gap-4 items-center justify-between w-full px-2">
                    <div className="flex gap-4 items-center">
                        <AppDownloadButton
                            icon={<BiLogoPlayStore className="text-primary-900" size={26} />}
                            subHeading={
                                <Image
                                    src={"/GET-IT-ON.svg"}
                                    height={5}
                                    width={36}
                                    alt="Google Play"
                                />
                            }
                            heading={
                                <Image
                                    src={"/googlePlay.svg"}
                                    height={15}
                                    width={76}
                                    alt="Google Play"
                                />
                            }
                        />
                        <AppDownloadButton
                            icon={<IoLogoApple className="text-primary-900" size={26} />}
                            subHeading={
                                <Image
                                    src={"/download-on-the.svg"}
                                    height={6}
                                    width={60}
                                    alt="Google Play"
                                />
                            }
                            heading={
                                <Image
                                    src={"/appStore.svg"}
                                    height={15}
                                    width={70}
                                    alt="App Store"
                                />
                            }
                        />
                    </div>

                    <SocialMedia />
                </div>
            </div>
        </section>
    );
};

export default Banner;
