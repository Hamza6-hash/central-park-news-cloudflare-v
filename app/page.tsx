"use client"
import TopStories from "@/components/topStories/TopStories";
import Image from "next/image";
import DummyImage from "@/assets/Rectangle-2.png";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { ArticleWithDetails, fireServices } from "@/app/services/firestoreService";
import { Timestamp } from 'firebase/firestore';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const SocialMediaTag = ({ icon, link }: SocialMedia) => {
  return (
    <div className="rounded-full border border-primary-500 p-2 cursor-pointer">
      {icon}
    </div>
  );
};

const socialMediaArray = [
  {
    icon: <FaTwitter className="text-primary-500" size={20} />,
    link: "",
  },
  {
    icon: <FaFacebookSquare className="text-primary-500" size={20} />,
    link: "",
  },
];

const formatDate = (timestamp: any) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString(); // Converts to Date and formats it
  }
  return '';
};


export default function Home() {
  const { data: articles, error } = useQuery<ArticleWithDetails[]>({
    queryKey: ['featuredArticles'],
    queryFn: fireServices.getFeaturedArticles,
    placeholderData: keepPreviousData,
  });

  if (error) {
    console.error('Error fetching articles:', error);
  }

  return (
    <section className="flex gap-9 max-xl:flex-col w-full">
      {articles?.map((article: any) => (
        <div key={article.id}>
          <div className="xl:w-[644px] max-w-full">
            <div className="space-y-3 mb-4">
              <h1 className="font-century-schoolbook text-3xl capitalize px-sm-generic max-md:text-center">
                {article.title} {/* Keep this if necessary, else consider removing */}
              </h1>

              {article.imageURL && (
                <Image
                  src={article.imageURL.length ? article.imageURL : DummyImage}
                  alt="Description of image"
                  width={1200}
                  height={800}
                  quality={100}
                  style={{ objectFit: 'cover' }}
                />
              ) ||
                <Image
                  src={DummyImage}
                  alt="Description of image"
                  width={1200}
                  height={800}
                  quality={100}
                  style={{ objectFit: 'cover' }}
                />
              }
              <div className="flex items-center text-lg max-sm:text-xs gap-2 px-sm-generic">
                <hr className="w-6 h-1" />
                <h6 className="capitalize">{article.author.author_name}</h6>
                <span className="text-primary-500">|</span>
                <p className="text-primary-500 italic">{formatDate(article.publishDate)}</p>
              </div>
            </div>
            <article className="space-y-2 capitalize text-justify md:text-lg text-base px-sm-generic">
              <p>{article.content}</p>
            </article>

            <div className="my-10 max-md:flex max-md:flex-col max-md:items-center max-md:justify-center">
              <p className="font-bold mb-2">Share This:</p>
              <div className="flex gap-4">
                {socialMediaArray.map((item, index) => (
                  <React.Fragment key={index}>
                    <SocialMediaTag icon={item.icon} link={item.link} />
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="w-full h-60 bg-gray-100 flex justify-center items-center">
              {Array.isArray(article.tags) ? article.tags.join(', ') : article.tags}
            </div>
          </div>
        </div>
      ))}
      <div className="xl:w-[520px]">
        <TopStories />
      </div>
    </section>
  );
}
