import { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Your style was unique. You brought a new and fresh approach to my 20-year old Forum practice. Your style was fluid, responsive, and rose to the needs of the group and not the agenda. You are patient and flexible, but when you turned the ship you did so with strength and confidence.",
    author: "Dan Hoffman",
    title: "CEO & Founder, Circles"
  },
  {
    id: 2,
    quote: "We had a fantastic experience with International Facilitators Organization. They were professional, flexible, and brought great energy to our Forum Stir Fry. Truly easy to work with from start to finish.",
    author: "Åsa Westin",
    title: "Manager, YPO Dallas Chapter"
  },
  {
    id: 3,
    quote: "The feedback we received from our members regarding your insight was overwhelmingly positive. Your expertise and experience were truly inspiring, and the generated thought will undoubtedly benefit our members for years to come.",
    author: "Omar Issa",
    title: "Executive Director, TRTCLE Corporation"
  },
  {
    id: 4,
    quote: "Thank you for an outstanding facilitation of our retreat. I think we made about 3 years of progress in one day. We are very grateful for your gifts.",
    author: "Roy R. Morris",
    title: "Partner, Dunlap, Bennett, & Ludwig"
  },
  {
    id: 5,
    quote: "Long-term relationships between peers makes the forum experience very special.",
    author: "Neil Balter",
    title: "Founder, California Closets Co."
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-advance every 15 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 15000);

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 15000);
      } else if (e.key === 'ArrowRight') {
        goToNext();
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 15000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  return (
    <div className="relative overflow-hidden">
      <div className="p-10">
        <h3 className="text-gray-100 text-3xl solway-medium text-center mt-12">
          Testimonials
        </h3>
      </div>

      <div className="relative min-h-[350px] md:min-h-[350px]">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 translate-x-0'
                : index < currentIndex
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="flex md:mx-14 text-center justify-center">
              <span className="text-lime-300 text-9xl font-cursive leading-12">
                &quot;
              </span>
              <p className="text-white text-xl md:text-3xl font-script text-pretty leading-8">
                {testimonial.quote}
              </p>
            </div>
            <div className="pt-2 md:pt-6 pb-10 md:mx-14 mx-6 text-center">
              <p className="text-gray-200 text-md text-pretty md:text-xl font-sans">
                —{testimonial.author}, {testimonial.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 pb-10">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 15000);
            }}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-lime-300'
                : 'w-3 bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          goToPrevious();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 15000);
        }}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-lime-300 transition-colors duration-200 text-4xl font-bold opacity-50 hover:opacity-100"
        aria-label="Previous testimonial"
      >
        ‹
      </button>
      <button
        onClick={() => {
          goToNext();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 15000);
        }}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-lime-300 transition-colors duration-200 text-4xl font-bold opacity-50 hover:opacity-100"
        aria-label="Next testimonial"
      >
        ›
      </button>
    </div>
  );
}
