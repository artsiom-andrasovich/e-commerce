import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type ImageCarouselProps = {
  images: {
    id: string;
    url: string;
  }[];
  currentImageIndex: number;
  setCurrentImageIndex: Dispatch<SetStateAction<number>>;
};

const itemWidth = 100;

export function BottomImageCarousel({
  images,
  currentImageIndex,
  setCurrentImageIndex,
}: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const visibleItems = Math.floor(container.clientWidth / itemWidth);
    const scrollAmount = (currentImageIndex - (visibleItems - 1) / 2) * itemWidth;
    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  }, [currentImageIndex]);
  return (
    <div
      ref={containerRef}
      className=" p-4 mt-2 flex w-fit mx-auto relative overflow-x-auto rounded-xl bg-gray-200 shadow-md "
    >
      {images.map((image, index) => (
        <Image
          className={`border-2 ${
            currentImageIndex === index
              ? "border-primary "
              : "border-transparent"
          }`}
          key={image.id}
          src={image.url}
          alt={`Slide ${index + 1}`}
          width={80}
          height={80}
          unoptimized
          quality={10}
          onClick={() => setCurrentImageIndex(index)}
        />
      ))}
    </div>
  );
}
