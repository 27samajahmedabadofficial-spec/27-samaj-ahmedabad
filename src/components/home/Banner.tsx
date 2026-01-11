import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Welcome to 27 Samaj Ahmedabad Community",
    subtitle: "Connect, Share & Grow Together",
    gradient: "from-primary via-orange-400 to-amber-300",
  },
  {
    id: 2,
    title: "Upcoming Annual Gathering",
    subtitle: "Join us for the celebration",
    gradient: "from-secondary via-blue-400 to-cyan-300",
  },
  {
    id: 3,
    title: "Community Support Program",
    subtitle: "Together we make a difference",
    gradient: "from-emerald-500 via-teal-400 to-cyan-300",
  },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-2xl shadow-soft">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full h-40 sm:h-48 bg-gradient-to-br ${banner.gradient} p-6 flex flex-col justify-center`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-md">
                {banner.title}
              </h2>
              <p className="text-sm sm:text-base text-white/90 drop-shadow">
                {banner.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
