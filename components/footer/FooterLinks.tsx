import React from 'react'
import Link from "next/link";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


const FooterLinks = () => {
    const pathName = usePathname();


    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <h4 className="font-bold text-primary-900 uppercase">LINKS</h4>
            <div className="flex sm:flex-row flex-col items-center gap-3">
                {navbarLinks.map((item, index) => {
                    const isActive =
                        pathName === item.route || pathName.startsWith(`${item.route}/`);

                    return (
                        <React.Fragment key={index}>
                            {!item.imgURL && <Link href={item.route} key={item.label}>
                                <p className={cn("footer-label", {
                                    "!font-bold": isActive,
                                })} >
                                    {item.label}
                                </p>
                            </Link>}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    )
}

export default FooterLinks