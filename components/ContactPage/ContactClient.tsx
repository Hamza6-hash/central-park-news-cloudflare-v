"use client";


import React, { useEffect, useState } from "react";
import { contactFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/button/Button";
import CustomTextArea from "@/components/customInput/CustomTextArea";
import ThankYouDialog from "@/components/dialogs/ThankYouDialog";

const fieldClass = "!border-gray-100";

const ContactClient = () => {
  const formSchema = contactFormSchema();
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setOpenDialog(true);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   let timer: number | NodeJS.Timeout;
  //   if (openDialog) {
  //     timer = setTimeout(() => {
  //       setOpenDialog(false);
  //     }, 2000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [openDialog]);

  return (
    <>
      <section className="w-full ">
        <div className="">
          <div className="w-full mx-auto max-sm:px-6 md:px-8 max-[760px]:px-8 lg:px-12 xl:px-8">
            <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
            <h1 className="text-4xl font-bold font-century-schoolbook text-[#2B4864] ">Contact Us</h1>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 mt-10 w-[100vw] font-century-gothic max-w-[1200px] px-8  mx-auto"
            >
              <CustomInput
                control={form.control}
                name="name"
                label="Name"
                fieldClassName={`${fieldClass} w-full font-century-gothic text-[#64748B]`}
                placeholder="Name Here..."
                schema={formSchema}
              />
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                fieldClassName={`${fieldClass} w-full font-century-gothic text-[#64748B]`}
                placeholder="Email Here..."
                schema={formSchema}
              />
              <CustomTextArea
                control={form.control}
                name="message"
                label="Message"
                fieldClassName={`${fieldClass} w-full font-century-gothic text-[#64748B]`}
                placeholder="Message Here..."
                schema={formSchema}
              />

              <div className="flex justify-end">
                <Button className="bg-[#303130] duration-300 hover:bg-white hover:text-black transition-all  ease-in text-white py-3 px-6 w-full sm:w-[15%]" >
                  {"SUBMIT"}
                </Button>
              </div>
            </form>
          </Form>

          <ThankYouDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </div>
      </section>
    </>
  );
};

export default ContactClient;
