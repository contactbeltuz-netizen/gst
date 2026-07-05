import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "MyGST Solution completely transformed our compliance processes. They successfully recovered over ₹20L in blocked ITC within just a few months.",
    name: "Rajesh Kumar",
    role: "CFO, TechFlow India",
    avatar: "R"
  },
  {
    id: 2,
    quote: "Their expert legal desk resolved a highly complex multi-crore GST notice efficiently. Their domain expertise is unmatched in the industry.",
    name: "Priya Sharma",
    role: "Director, BuildCorp SMEs",
    avatar: "P"
  },
  {
    id: 3,
    quote: "Their GST advisory team seamlessly integrated with our financial workflows. Filing monthly returns is now completely stress-free.",
    name: "Amit Patel",
    role: "Founder, RetailNet",
    avatar: "A"
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto py-16 px-6 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Trusted by Industry Leaders
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          See what our clients say about our enterprise-grade services.
        </p>
      </div>
      
      <div 
        className="relative h-[320px] md:h-[280px] flex items-center justify-center max-w-4xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide} 
          className="absolute left-0 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition backdrop-blur-xl shadow-lg shadow-black/20 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-0 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition backdrop-blur-xl shadow-lg shadow-black/20 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute w-full px-16 lg:px-24"
            >
              <div className="p-8 md:p-10 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 flex flex-col items-center text-center shadow-xl">
                <Quote className="w-10 h-10 text-amber-500/50 mb-6" />
                <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed mb-8">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold">{testimonials[currentIndex].name}</p>
                    <p className="text-slate-400 text-sm">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${idx === currentIndex ? "bg-amber-400 w-8" : "bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
