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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let timer: number | NodeJS.Timeout;
    if (openDialog) {
      timer = setTimeout(() => {
        setOpenDialog(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [openDialog]);

  return (
    <>
      <section className="w-full ">
        <div className="">
          <div className="w-full mx-3 ">
          <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
          <h1 className="text-4xl font-bold font-century-schoolbook">Contact Us</h1>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 mt-10 w-[100vw] max-w-[1200px] px-4 md:px-8 lg:px-16 xl:px-24 mx-auto"
            >
              <CustomInput
                control={form.control}
                name="name"
                label="Name"
                fieldClassName={`${fieldClass} w-full`}
                placeholder="Name Here..."
                schema={formSchema}
              />
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                fieldClassName={`${fieldClass} w-full`}
                placeholder="Email Here..."
                schema={formSchema}
              />
              <CustomTextArea
                control={form.control}
                name="message"
                label="Message"
                fieldClassName={`${fieldClass} w-full`}
                placeholder="Message Here..."
                schema={formSchema}
              />

              <div className="flex justify-end">
                <Button variant="primary" type="submit" className="hover:bg-white hover:text-black">
                  SUBMIT
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
