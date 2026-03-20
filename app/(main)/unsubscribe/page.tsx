import { redirect } from "next/navigation";
export const runtime = "edge";
import UnsubscribeClient from "./UnsubscribeClient";
import { liveUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { getSubscribeUserByEmail } from "@/lib/services";

export const metadata: Metadata = {
  title: "Unsubscribe | Central Park News",
  description: "Manage your subscription preferences for Central Park News.",
  alternates: {
    canonical: `${liveUrl}/unsubscribe`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

async function validateUser(email: string) {
  if (!email) {
    redirect("/?toast=expired");
  }

  try {
    const user = await getSubscribeUserByEmail(email);

    if (!user) {
      redirect("/");
    }

    if (user.tokenUsed === true) {
      redirect("/?toast=token-already-used");
    }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    redirect("/?toast=user-check-failed");
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { email?: string; token?: string };
}) {
  const email = searchParams?.email ?? "";
  await validateUser(email);

  return <UnsubscribeClient />;
}
