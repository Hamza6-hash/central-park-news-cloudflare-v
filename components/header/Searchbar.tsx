"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import { fireServices } from "@/app/services/firestoreService";
import { ArticleWithDetails } from "@/app/services/firestoreService";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Search } from "lucide-react";

interface SearchResult extends ArticleWithDetails {
  categoryName: string;
}

const Searchbar = () => {
  const pathName = usePathname();

  return (
    <section className="pt-[10px] px-generic w-full flex justify-center items-center">
      <div className="w-[1200px]">
        {pathName === "/" && (
          <div className="w-full flex items-center flex-row mt-12">
            <div className="flex py-2 px-4 font-bold bg-yellow-500 font-century-schoolbook rounded-full w-fit">
              <p>TODAY'S TOP STORY</p>
            </div>
          </div>

        )}
        </div>
    </section>
  );
};

export default Searchbar;