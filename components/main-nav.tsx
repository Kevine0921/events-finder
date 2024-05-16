import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { NavItem } from "@/types/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.gif"
          alt="Commune AI NovelSeeker"
          width={100}
          height={100}
        />
        <span className="inline-block text-6xl font-bold ">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  );
}
