"use client";
import { Button } from "@/components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const BottomImageCarousel = dynamic(
  () => import("./BottomImageCarousel").then((mod) => mod.BottomImageCarousel),
  {
    ssr: false,
  },
);

type ImageCarouselProps = {
  images: {
    id: string;
    url: string;
  }[];
  showBottomCarousel?: boolean;
};

export function ImageCarousel({
  images,
  showBottomCarousel = true,
}: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePreviousClick = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1,
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };
  return (
    <section className="w-full">
      <div className="relative w-full h-[400px] overflow-hidden rounded-xl bg-gray-100">
        <Button
          onClick={handlePreviousClick}
          variant="ghost"
          size="sm"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </Button>

        {images.map((image, index) => (
          <Image
            src={image.url}
            alt={`Slide ${index + 1}`}
            fill
            className={
              currentImageIndex === index ? "object-contain" : "hidden"
            }
            unoptimized
            key={image.id}
          />
        ))}

        <Button
          onClick={handleNextClick}
          variant="ghost"
          size="sm"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
      {showBottomCarousel && (
        <BottomImageCarousel
          images={images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      )}
    </section>
  );
}
