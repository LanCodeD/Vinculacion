"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoSlide = true,
  autoSlideInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoSlide) {
      const slideInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoSlideInterval);
      return () => clearInterval(slideInterval);
    }
  }, [autoSlide, autoSlideInterval, images.length]);

  return (
    <div className="relative w-full max-w-lg aspect-[4/3] overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Slide ${index}`}
            fill
            className="object-contain"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
