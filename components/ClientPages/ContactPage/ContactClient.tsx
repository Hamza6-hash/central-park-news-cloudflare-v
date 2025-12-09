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
const COOLDOWN_SECONDS = 300; // 5 minutes

const ContactClient = () => {
  const formSchema = contactFormSchema();
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "cooldown">("success");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  // Calculate remaining cooldown from localStorage
  const getRemainingCooldown = (): number => {
    if (typeof window === "undefined") return 0;

    const storedCooldown = localStorage.getItem("contact_form_cooldown");
    if (!storedCooldown) return 0;

    const cooldownEndTime = parseInt(storedCooldown);
    const now = Date.now();
    const remaining = Math.ceil((cooldownEndTime - now) / 1000);

    if (remaining <= 0) {
      localStorage.removeItem("contact_form_cooldown");
      return 0;
    }

    return remaining;
  };

  // Check for cooldown on mount
  useEffect(() => {
    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setIsLocked(true);
      setCooldownRemaining(remaining);
    }

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "contact_form_cooldown") {
        const newRemaining = getRemainingCooldown();
        if (newRemaining > 0) {
          setIsLocked(true);
          setCooldownRemaining(newRemaining);
        } else {
          setIsLocked(false);
          setCooldownRemaining(0);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Countdown timer - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldownRemaining(remaining);

      if (remaining <= 0) {
        setIsLocked(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCooldown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startCooldown = () => {
    const cooldownEndTime = Date.now() + COOLDOWN_SECONDS * 1000;
    localStorage.setItem("contact_form_cooldown", cooldownEndTime.toString());
    setIsLocked(true);
    setCooldownRemaining(COOLDOWN_SECONDS);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Prevent submission if already locked
    if (isLocked || isSubmitting) {
      return;
    }

    form.clearErrors("root");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to send message");
      }

      // Success - start cooldown and show dialog
      startCooldown();
      setDialogType("success");
      setOpenDialog(true);
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send your message. Please try again.";

      // Check if it's a cooldown error
      if (errorMessage.includes("Please wait")) {
        setDialogType("cooldown");
        setOpenDialog(true);
      } else {
        form.setError("root", { message: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || isLocked;
  const buttonText = isLocked
    ? `Please wait… (${formatCooldown(cooldownRemaining)})`
    : isSubmitting
      ? "SENDING..."
      : "SUBMIT";

  return (
    <>
      <section className="w-full">
        <div className="">
          <div className="w-full mx-auto max-sm:px-6 md:px-8 max-[760px]:px-8 lg:px-8 xl:px-8">
            <hr className={`w-64 h-0.5 mb-2 bg-gray-200`} />
            <h1 className="text-4xl font-bold font-century-schoolbook text-[#2B4864]">
              Contact Us
            </h1>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 mt-10 w-[100vw] font-century-gothic max-w-[800px] px-8 mx-auto"
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
                <Button
                  disabled={isButtonDisabled}
                  className="bg-[#303130] text-white sm:w-[35%] transition-all   ease-in hover:bg-[#a9aca9] hover:text-black duration-300 py-3 px-6 w-full "
                >
                                           
                  {buttonText}
                </Button>
              </div>
            </form>
          </Form>

          <ThankYouDialog
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            cooldownRemaining={cooldownRemaining}
            type={dialogType}
          />
        </div>
      </section>
    </>
  );
};

export default ContactClient;