import { redirect } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import UnsubscribeClient from "./UnsubscribeClient";

async function checkUserAndRedirect(email: string | null) {
  if (!email) {
    redirect("/");
  }

  try {
    const userDoc = doc(db, "blog", "blockchainBriefing", "subscribeUsers", email);
    const userExists = await getDoc(userDoc);

    if (!userExists.exists()) {
      redirect("/");
    }
  } catch (error) {
    redirect("/");
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { email: string; token: string };
}) {
  await checkUserAndRedirect(searchParams.email);
  
  return <UnsubscribeClient />;
}
