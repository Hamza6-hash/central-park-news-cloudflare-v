import React, { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

const Page = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    }>
      <UnsubscribeClient />
    </Suspense>
  );
};

export default Page;
