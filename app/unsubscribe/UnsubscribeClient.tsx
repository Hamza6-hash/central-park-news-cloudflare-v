"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/assets/logo.webp";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/constants";

const UnsubscribeClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setMessage(
          "You have been successfully unsubscribed from all future emails."
        );
      } else {
        setMessage(data.error || "Failed to unsubscribe. Please try again.");
      }
    } catch {
      setMessage(
        "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            width={120}
            height={60}
            priority
            loading="eager"
            className="block"
            style={{ objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="flex flex-col min-h-[95vh] bg-gradient-to-r from-[#25405a] to-[#4186c7]">
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-4xl font-bold text-white mb-4">
            We’re Sorry To See You Go.
          </h1>
          <p className="text-white text-lg mb-8 max-w-xl text-center">
            If you no longer wish to receive emails, notifications, or updates
            from <b>Blockchain Briefing</b>, you can unsubscribe below.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <button
              className="underline text-white text-lg"
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
    </div>
  );
};

export default UnsubscribeClient;
