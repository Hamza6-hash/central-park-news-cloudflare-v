"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const UnsubscribeClient = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const unsubscribe = async () => {
    if (!email || !token) {
      setMessage("Invalid unsubscribe link. Email and token are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("You have been successfully unsubscribed from all future emails.");
      } else {
        setMessage(data.error || "Failed to unsubscribe. Please try again.");
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setMessage("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (email && token) {
      unsubscribe();
    } else {
      setMessage("Invalid unsubscribe link. Missing required parameters.");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token]);

  if (!email || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
          <p>This unsubscribe link is invalid or incomplete.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          {isLoading ? "Processing..." : "Unsubscribe"}
        </h1>
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        ) : (
          <p className="text-lg">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UnsubscribeClient; 