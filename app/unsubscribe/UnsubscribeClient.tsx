"use client";
import React, { use, useEffect, useState } from "react";
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
  const [toastType, setToastType] = useState<'success' | 'error'>('success');



  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowToast(true)
        setToastType('success');
        setToastTitle("Success")
      } else {
        setShowToast(true)
        setToastType('error');
        setToastTitle("Error")
      }
    } catch {
      setShowToast(true)
      setToastType('error');
      setToastTitle("Error")

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



  if (!email || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#25405a] to-[#4186c7]">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
        <p>This unsubscribe link is invalid or incomplete.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center bg-[#25405a]">
        <Link href={routes.home}>
          <Image
            src={Logo}
            alt="Blockchain Briefing logo"
            quality={75}
            width={140}
            height={60}
            priority
            loading="eager"
            className="block"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="flex flex-col max-sm:min-h-[110vh] min-h-[95vh] bg-gradient-to-r from-[#25405a] to-[#4186c7]">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-[45%] max-sm:w-[80%] flex flex-col text-start ">
            <h1 className="text-[32px] font-montserrat font-bold text-white mb-4">
              We’re Sorry To See You Go.
            </h1>
            <p className="text-white text-[16px] mb-8 max-w-xl font-montserrat ">
              If you no longer wish to receive emails, notifications, or updates
              from <b>Blockchain Briefing</b>, you can unsubscribe below.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <button
                className="underline text-[16px] font-normal font-century-gothic text-[#6DBEE5]"
                onClick={() => router.push("/")}
                disabled={isLoading}
              >
                NEVERMIND, I WANT TO STAY SUBSCRIBED
              </button>
              <button
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded transition"
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "UNSUBSCRIBE"}
              </button>
            </div>
          </div>
          {message && (
            <div className="mt-8 text-white text-lg font-semibold">
              {message}
            </div>
          )}
        </div>
        <footer className="text-center text-white py-4 bg-[#25405a]">
          COPYRIGHT 2024 © <b>BLOCKCHAIN BRIEFING</b>. ALL RIGHTS RESERVED
        </footer>
      </div>
      <CustomToast
        show={showToast}
        onClose={() => setShowToast(false)}
        title={toatTitle}
        description={"Please Try Again Later"}
        type={toastType}
      />

    </div>
  );
};

export default UnsubscribeClient;
