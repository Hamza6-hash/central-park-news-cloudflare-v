"use client"
import TopStories from "@/components/topStories/TopStories";
import Image from "next/image";
import DummyImg from "@/assets/Rectangle-3.png";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import React from "react";

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

// async function hitPythonApi() {
//   const response = await fetch("http://localhost:3000/api", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await response.json();
//   console.log(data)
//   return data;
// }

export default function Home() {
  // const data = await hitPythonApi();
  // console.log(data);

  // for testing
  // async function hitPythonApi() {
  //   const response = await fetch("http://localhost:5238/api/hello", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   console.log(data);
  //   return data;
  // }

  return (
    <section className="flex gap-10 max-xl:flex-col w-full">
      {/* <button onClick={hitPythonApi}>OnClick</button> */}
      <div className="xl:w-[650px] max-w-full">
        <div className="space-y-3 mb-4">
          <h1 className="font-century-schoolbook text-3xl capitalize px-sm-generic max-md:text-center">
            Oligarch Son Told to Pay Mom
          </h1>
          <Image
            src={DummyImg}
            alt="new image"
            width={1200}
            quality={100}
            objectFit="cover"
          />
          <div className="flex items-center text-lg max-sm:text-xs gap-2 px-sm-generic">
            <hr className="w-6 h-1" />
            <h6 className="capitalize">
              Docket Digest News Room
            </h6>
            <span className="text-primary-500">|</span>
            <p className="text-primary-500 italic">
              April 21, 2021
            </p>
          </div>
        </div>
        <article className="space-y-2 capitalize text-justify text-2xl px-sm-generic">
          <p>
            After losing a court decision over his part in shielding assets from
            his mother, Temur Akhmedov, the son of a Russian oligarch embroiled
            in the UK’s biggest divorce lawsuit, will have to compensate his
            mother $100 million.
          </p>
          <p>{`Temur Akhmedov and his billionaire father, Farkhad Akhmedov, worked together to prevent his mother from receiving a $627 million court-ordered divorce settlement. The court described Temur as “an untrustworthy person who will go to every length to help his parent (referring to father).”`}</p>
          <p>
            The trial drew public attention when Temur admitted to losing more
            than $50 million while day trading as a college student. He argued
            that instead of shielding his father’s wealth from his mother, he
            lost some of it by poor investments.
          </p>
          <p>
            Temur’s mother is attempting to reclaim some of the money by
            demanding the keys to a luxurious apartment overlooking London’s
            Hyde Park. She has been denied any divorce settlements, forcing her
            to depend on attorneys in helping her prosecute lawsuits in at least
            six nations.
          </p>
        </article>

        <div className="my-8 max-md:flex max-md:flex-col max-md:items-center max-md:justify-center">
          <p className="font-bold mb-2">Share This:</p>
          <div className="flex gap-4">
            {socialMediaArray.map((item) => {
              return (
                <React.Fragment key={item.link}>
                  <SocialMediaTag icon={item.icon} link={item.link} />
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="w-full h-60 bg-gray-100 flex justify-center items-center">
          Advertisement
        </div>
      </div>
      <div className="xl:w-[510px]">
        <TopStories />
      </div>
    </section>
  );
}
