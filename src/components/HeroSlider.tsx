  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import {
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Snowflake,
  } from "lucide-react";
  import SafeImage from "../utils/SafeImage";

  // Hero Slider Images and Content
  const slides = [
    {
      id: 1,
      image: "/banners/banner1.jpg",
      title: "Frozen Chicken Favourites",
      description: "Easy-to-prepare chicken snacks, ready when you are.",
      button: "Shop Chicken",
      link: "/shop",
    },
    {
      id: 2,
      image: "/banners/banner2.jpg",
      title: "Vegetarian Snacks",
      description: "Tasty vegetarian favourites for quick, satisfying meals.",
      button: "Shop Vegetarian",
      link: "/shop",
    },
    {
      id: 3,
      image: "/banners/banner3.jpg",
      title: "Frozen Food, Made Easy",
      description: "Find convenient frozen favourites for every occasion.",
      button: "Browse Products",
      link: "/shop",
    },
    {
      id: 4,
      image: "/banners/banner4.jpg",
      title: "Your Freezer Favourites",
      description: "Stock up on snacks and mealtime favourites you love.",
      button: "Shop Now",
      link: "/shop",
    },
  ];

  const HeroSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Automatic Slider
    useEffect(() => {
      if (
        slides.length <= 1 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const interval = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6500);

      return () => window.clearInterval(interval);
    }, []);

    if (slides.length === 0) return null;

    return (
      <section className="relative w-full overflow-hidden bg-[#111111]">
        {/* Slider Main */}
        <div className="relative h-[400px] w-full sm:h-[480px] md:h-[520px] lg:h-[570px] xl:h-[620px]">
          {/* Background Image */}
          <SafeImage
            key={slides[currentSlide].image}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            priority={currentSlide === 0}
            sizes="100vw"
            quality={75}
            className="hero-slide-image object-cover object-center"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

          {/* Hero Content */}
          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto w-full max-w-[1500px] px-6 text-center sm:px-14 sm:text-left md:px-16 lg:px-20 xl:px-24">
              <div className="mx-auto max-w-[650px] sm:mx-0">
                {/* Brand Label */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm sm:mb-5 sm:px-4 sm:py-2">
                  <Snowflake
                    size={15}
                    className="text-[#65C92E] sm:h-4 sm:w-4"
                  />
                  <span>RK FROZEN FOOD</span>
                </div>

                {/* Heading */}
                <h1 className="mb-3 text-[30px] font-bold leading-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)] sm:mb-4 sm:text-[50px]">
                  {slides[currentSlide].title}
                </h1>

                {/* Description */}
                <p className="mx-auto mb-5 max-w-[500px] text-[15px] font-normal leading-6 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] sm:mx-0 sm:mb-7 sm:leading-7">
                  {slides[currentSlide].description}
                </p>

                {/* Explore Button */}
                <Link
                  href={slides[currentSlide].link}
                  className="group inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#65C92E] px-5 py-2.5 text-[15px] font-semibold text-[#111111] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#55B525] hover:shadow-xl sm:min-h-[50px] sm:gap-3 sm:px-7"
                >
                  {slides[currentSlide].button}
                  <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Previous Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute bottom-4 left-3 top-auto z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#111111] shadow-lg transition hover:scale-110 hover:bg-[#65C92E] sm:bottom-auto sm:left-5 sm:top-1/2 sm:h-10 sm:w-10 sm:-translate-y-1/2 md:left-8 md:h-11 md:w-11"
          >
            <ChevronLeft size={21} />
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute bottom-4 right-3 top-auto z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#111111] shadow-lg transition hover:scale-110 hover:bg-[#65C92E] sm:bottom-auto sm:right-5 sm:top-1/2 sm:h-10 sm:w-10 sm:-translate-y-1/2 md:right-8 md:h-11 md:w-11"
          >
            <ChevronRight size={21} />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-5 sm:gap-2.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentSlide === index ? "true" : undefined}
                className={`h-2.5 rounded-full border border-white transition-all duration-300 sm:h-3 ${
                  currentSlide === index
                    ? "w-7 bg-[#65C92E] sm:w-9"
                    : "w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  export default HeroSlider;