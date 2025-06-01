"use client";

import TopStories from "@/components/topStories/TopStories";
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
    } finally {
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
      <section className="w-full">
        <div className="w-full">
          <h1 className="text-4xl font-bold  font-century-schoolbook">
            Contact Us
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 mt-10 md:px-[10rem]"
            >
              <CustomInput
                control={form.control}
                name="name"
                label="Name"
                fieldClassName={fieldClass}
                placeholder="Name Here..."
                schema={formSchema}
              />
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                fieldClassName={fieldClass}
                placeholder="Email Here..."
                schema={formSchema}
              />
              <CustomTextArea
                control={form.control}
                name="message"
                label="Message"
                fieldClassName={fieldClass}
                placeholder="Message Here..."
                schema={formSchema}
              />

              <div className="flex justify-end">
                <Button variant="primary" type="submit">
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

export default ContactClient