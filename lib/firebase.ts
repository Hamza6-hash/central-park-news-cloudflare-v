import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Author {
    id: string;
    name?: string;
    position: string;
}

export async function getAuthorName(authorId: string): Promise<string> {
    try {
        if (!authorId) return "Unknown Author";
        const authorRef = doc(db, 'blog/centralparkNews/authors', authorId);
        const authorDoc = await getDoc(authorRef);
        
        if (authorDoc.exists()) {
            const authorData = authorDoc.data() as Author;
            return authorData.name || "Unknown Author";
        }
        
        return "Unknown Author";
    } catch (error) {
        console.error("Error fetching author from the store:", error);
        return "Unknown Author";
    }
} 