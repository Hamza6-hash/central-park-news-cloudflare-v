import { redirect } from "next/navigation";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import UnsubscribeClient from "./UnsubscribeClient";

interface UserData {
  email: string;
  tokenCreatedAt: Timestamp;
  tokenExpiresAt: Timestamp;
  tokenUsed: boolean;
  unsubscribeToken: string;
}

async function validateUser(email: string): Promise<void | null | UserData> {
  if (!email) {
    redirect("/?toast=expired");
  }

  try {
    const userDocRef = doc(db, "blog", "blockchainBriefing", "subscribeUsers", email);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      redirect("/");
    }

    const userData = userSnap.data() as UserData;
    const now = new Date();

    if (userData.tokenUsed === true) {
      redirect("/?toast=token-already-used");
    }

    if (userData.tokenExpiresAt.toDate() < now) {
      redirect("/?toast=expired");
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
  const email = searchParams?.email;
  // @ts-ignore
  await validateUser(email);

  return <UnsubscribeClient />;
}