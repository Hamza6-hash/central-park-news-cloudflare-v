import { db } from "./firebaseConfig";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

// not the one which is active
export const getFiveRelatedNewsByCategory = async (category: string, slug: string) => {
    if (!db) {
      throw new Error("Database connection is not available");
    }
  
    const ref = collection(db, "blog/centralparkNews/newsletter");
    const q = query(ref, where("category", "==", category), where("titleSlug", "!=", slug), orderBy("createdAt", "desc"), limit(6));
    const snapshot = await getDocs(q);
  
    if (snapshot.empty) return [];
  
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            citation: undefined,
        }
    });
  };