"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/assets/logo.webp";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/constants";
import CustomToast from "@/components/ui/customToast";


const UnsubscribeClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toatTitle, setToastTitle] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "alreadyUnsubscribed">("success");

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      if (response.ok) {
        setShowToast(true);
        setToastType("success");
        setToastTitle("Success");
        router.push("/");
      } else {
        setShowToast(true);
        setToastType("error");
        setToastTitle("Error");
      }
    } catch {
      setShowToast(true);
      setToastType("error");
      setToastTitle("Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  return (
    <div>
      <div className="w-full flex justify-center items-center bg-[#25405a] ">
        <Link href={routes.home}>
          <Image
            src={Logo}
            alt="Blockchain Briefing logo"
            quality={75}
            width={200}
            height={89}
            priority
            loading="eager"
            className="block"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="flex flex-col max-sm:min-h-[100vh] min-h-[95vh] bg-gradient-to-r from-[#25405a] to-[#4186c7]">
        <div className="flex flex-col items-center justify-center flex-1">
          <div
            className="w-[569px] max-sm:w-[90%] max-w-[569px] flex flex-col text-left "
            style={{ gap: "40px" }}
          >
            <div className="flex flex-col" style={{ gap: "16px" }}>
              <h1 className="text-[32px] font-montserrat font-bold text-white leading-tight">
                We're Sorry To See You Go.
              </h1>
              <p className="text-white text-[16px] font-montserrat leading-relaxed">
                If you no longer wish to receive emails, notifications, or
                updates from <b>Blockchain Briefing</b>, you can unsubscribe
                below.
              </p>
            </div>

            <div className="flex flex-col justify-between md:flex-row items-start gap-8">
              <button
                className="underline text-[16px] font-normal font-century-gothic text-[#6DBEE5] hover:text-[#5AADE0] transition-colors"
                onClick={() => router.push("/")}
                disabled={isLoading}
              >
                NEVERMIND, I WANT TO STAY SUBSCRIBED
              </button>
              <button
                className="bg-yellow-300 font-century-gothic hover:bg-yellow-400 text-gray-900 font-bold py-1 px-6 rounded transition-colors duration-200"
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "UNSUBSCRIBE"}
              </button>
            </div>

            {message && (
              <div className="text-white text-lg font-semibold">{message}</div>
            )}
          </div>
        </div>
        <footer className="text-center text-white py-4 bg-[#25405a]">
          COPYRIGHT 2024 © <b>BLOCKCHAIN BRIEFING</b>. ALL RIGHTS RESERVED
        </footer>
      </div>
      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        title={toatTitle}
        description={
          toastType === "error"
            ? "Please Try Again Later"
            : toastType === "success"
              ? "You have been successfully unsubscribed. You will no longer receive these notifications."
              : "You have already unsubscribed. You will no longer receive these notifications."
        }
        type={toastType}
      />
    </div>
  );
};

export default UnsubscribeClient;
