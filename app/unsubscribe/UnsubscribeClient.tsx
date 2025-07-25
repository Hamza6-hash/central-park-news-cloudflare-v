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

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

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
    <div className="h-screen w-screen fixed inset-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-center items-center bg-[#FFFFFF] py-2 flex-shrink-0">
        <Link href={routes.home}>
          <Image
            src={'/logo.png'}
            alt="Blockchain Briefing logo"
            quality={75}
            width={180}
            height={80}
            priority
            loading="eager"
            className="block"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#E1E1E1] overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
          <div className="w-[569px] max-sm:w-[90%] max-w-[569px] flex flex-col text-left" style={{ gap: '32px' }}>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <h1 className="text-[28px] sm:text-[32px] font-montserrat font-bold text-[#363636] leading-tight">
                We're Sorry To See You Go.
              </h1>
            <p className="text-[#363636] text-[14px] sm:text-[16px] font-montserrat leading-relaxed">
                If you no longer wish to receive emails, notifications, or updates
                from <b>Central Park News</b>, you can unsubscribe below.
              </p>
            </div>
            
            <div className="flex flex-col justify-between md:flex-row items-center gap-6">
              <button
                className="underline text-[14px] sm:text-[16px] font-normal font-century-gothic text-[#363636] hover:text-[#5AADE0] transition-colors text-center"
                onClick={() => router.push("/")}
                disabled={isLoading}
              >
                NEVERMIND, I WANT TO STAY SUBSCRIBED
              </button>
              <button
                className="bg-[#E4212B] max-sm:w-full font-century-gothic hover:bg-white hover:text-black text-white font-bold py-1 px-6 rounded transition-colors duration-200"
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
        
        {/* Footer */}
        <footer className="text-center text-[12px] text-white py-2 bg-[#303130] flex-shrink-0 ">
          COPYRIGHT 2024 © <b>CENTRAL PARK NEWS</b>. ALL RIGHTS RESERVED
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
