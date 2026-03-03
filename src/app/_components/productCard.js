"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import SaladImage from "./images/Salad-3.png";

export const ProductCard = ({
  title,
  description,
  price,
  imageSrc,
  imageAlt,
  actionSlot,
  onClick,
  className,
  unoptimized = false,
}) => {
  const isInteractive = typeof onClick === "function";

  const handleKeyDown = (event) => {
    if (!isInteractive) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={cn(
        "flex h-[342px] w-full max-w-[397px] flex-col gap-10 rounded-3xl border border-[#E4E4E7] bg-[#FFFFFF] p-4",
        isInteractive && "cursor-pointer",
        className
      )}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div className="relative h-[210px] w-full max-w-[365.333px] overflow-hidden rounded-2xl bg-[#F4F4F5] bg-center bg-no-repeat bg-cover">
        <Image
          src={imageSrc || SaladImage}
          alt={imageAlt || title || "Product image"}
          width={366}
          height={210}
          className="h-[210px] w-full object-cover object-center"
          unoptimized={Boolean(imageSrc) || unoptimized}
        />

        {actionSlot ? (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">{actionSlot}</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-[24px] font-semibold leading-[32px] tracking-[-0.025em] text-[#EF4444]">
            {title}
          </h3>
          <p className="shrink-0 text-[18px] font-semibold leading-[28px] text-[#18181B]">{price}</p>
        </div>

        <p className="line-clamp-2 text-[14px] font-normal leading-[20px] text-[#71717A]">
          {description}
        </p>
      </div>
    </article>
  );
};
