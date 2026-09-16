"use client";

import { useState, useEffect, useRef } from "react";

interface Testimonial {
  id: string;
  videoUrl: string;
  posterUrl?: string;
  quote: string;
  stat: string | React.ReactNode;
  initials: string;
  author: string;
  role: string;
  location: string;
}

export default function RestaurantOSPage() {
  const testimonials: Testimonial[] = [
    {
      id: "rajesh-kumar",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-kitchen-41563-large.mp4",
      quote:
        "Before Digitory, our busiest hours were stressful. Now every team gets live updates, and everything runs much more smoothly.",
      stat: "↑ 22% faster service",
      initials: "RK",
      author: "Rajesh Kumar",
      role: "Owner",
      location: "BygBrewski Bangalore",
    },
    {
      id: "priya-mehta",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-waiter-serving-food-to-customers-in-a-restaurant-41558-large.mp4",
      quote:
        "We spend less time managing operations and more time serving customers. Digitory helps us run every outlet with confidence.",
      stat: "3 Hours Saved Every Day",
      initials: "PM",
      author: "Priya Mehta",
      role: "Ops Head",
      location: "Toit Brewpub",
    },
    {
      id: "amit-shah",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-coffee-barista-making-a-latte-art-41549-large.mp4",
      quote:
        "We reduced food waste and improved inventory tracking. Within the first three months, we recovered nearly ₹2 lakh every month.",
      stat: "₹2 Lakh Saved Every Month",
      initials: "AS",
      author: "Amit Shah",
      role: "F&B Director",
      location: "Bier Library",
    },
    {
      id: "ananya-sharma",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-bar-tender-preparing-a-cocktail-41550-large.mp4",
      quote:
        "Digitory integrated seamlessly with our POS and kitchen display system. Order errors dropped to almost zero across outlets.",
      stat: "95% Reduction in Errors",
      initials: "AS",
      author: "Ananya Sharma",
      role: "General Manager",
      location: "Social Offline",
    },
    {
      id: "vikram-roy",
      videoUrl:
        "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-decorating-a-plate-41561-large.mp4",
      quote:
        "Scaling to 5 new outlets was effortless with Digitory's centralized multi-location dashboards and real-time inventory alerts.",
      stat: "5x Faster Outlet Expansion",
      initials: "VR",
      author: "Vikram Roy",
      role: "Co-Founder",
      location: "Truffles & Co",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playingState, setPlayingState] = useState<{ [key: number]: boolean }>({});

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synchronize play/pause states based on active index
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      video.muted = isMuted;

      if (idx === activeIndex) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayingState((prev) => ({ ...prev, [idx]: true }));
            })
            .catch(() => {
              // Auto-play was prevented by browser policy
              setPlayingState((prev) => ({ ...prev, [idx]: false }));
            });
        }
      } else {
        video.pause();
        video.currentTime = 0;
        setPlayingState((prev) => ({ ...prev, [idx]: false }));
      }
    });
  }, [activeIndex, isMuted]);

  // Pinned Sticky Scroll Handler: Locks screen in place while scrolling through videos
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;
      if (scrollableDistance <= 0) return;

      // Calculate scroll progress ratio inside section (0 to 1)
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));

      // Map progress to current video index
      const targetIndex = Math.min(
        testimonials.length - 1,
        Math.floor(progress * testimonials.length)
      );

      setActiveIndex(targetIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [testimonials.length]);

  const togglePlayPause = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[idx];
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlayingState((prev) => ({ ...prev, [idx]: true }));
    } else {
      video.pause();
      setPlayingState((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      // Swipe left -> next
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    } else if (distance < -minSwipeDistance) {
      // Swipe right -> prev
      setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[200vh] md:h-[240vh] bg-white dark:bg-[#08090A]"
    >
      {/* Sticky Locked Container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center font-sans antialiased text-[#111111] dark:text-white overflow-hidden py-4 md:py-8">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
            <div>

              <h2 className="text-2xl sm:text-3xl md:text-[38px] font-[850] tracking-tight leading-[1.15] text-[#111111] dark:text-white">
                What our <span className="text-[#FF4F18]">customers say</span>
              </h2>
            </div>

            {/* Section Controls */}
            <div className="flex items-center gap-2 select-none">
              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                }
                className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                aria-label="Previous testimonial video"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                aria-label="Next testimonial video"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div
            className="relative w-full py-2 overflow-hidden select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Centered Slider Track */}
            <div className="flex items-center justify-center min-h-[380px] md:min-h-[440px] relative">
              {testimonials.map((item, idx) => {
                const isActive = idx === activeIndex;
                // Calculate index distance relative to active
                const offset = idx - activeIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isActive) setActiveIndex(idx);
                    }}
                    className={`absolute transition-all duration-500 ease-out transform origin-center cursor-pointer ${isActive
                      ? "z-30 scale-100 opacity-100 pointer-events-auto"
                      : Math.abs(offset) === 1
                        ? "z-20 scale-85 opacity-55 hover:opacity-80"
                        : "z-10 scale-75 opacity-25 hover:opacity-50"
                      }`}
                    style={{
                      transform: `translateX(${offset * 210}px) scale(${isActive ? 1 : Math.abs(offset) === 1 ? 0.86 : 0.72
                        })`,
                    }}
                  >
                    {/* Compact Vertical Video Card (9:16 portrait) */}
                    <div className={`relative w-[200px] sm:w-[220px] md:w-[240px] aspect-[9/16] rounded-[22px] overflow-hidden shadow-xl transition-all duration-500 border ${isActive
                      ? "border-[#FF4F18]/50 ring-4 ring-[#FF4F18]/20 shadow-[0_15px_40px_rgba(255,79,24,0.15)]"
                      : "border-zinc-200 dark:border-zinc-800"
                      }`}>
                      {/* HTML5 Video Element */}
                      <video
                        ref={(el) => { videoRefs.current[idx] = el; }}
                        src={item.videoUrl}
                        loop
                        playsInline
                        muted={isMuted}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Gradient Overlay for Top Controls & Bottom Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

                      {/* Top Status Bar & Quick Actions */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        {/* Mute/Unmute Toggle Button */}
                        <button
                          onClick={toggleMute}
                          className="flex items-center gap-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white transition-all cursor-pointer"
                          aria-label={!isActive || isMuted ? "Unmute video audio" : "Mute video audio"}
                        >
                          {!isActive || isMuted ? (
                            <>
                              <svg className="w-3 h-3 text-[#FF4F18]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                              </svg>
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Muted</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 text-[#10B981] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Sound On</span>
                            </>
                          )}
                        </button>

                        {isActive && (
                          <button
                            onClick={(e) => togglePlayPause(idx, e)}
                            className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all cursor-pointer"
                            aria-label={playingState[idx] ? "Pause Video" : "Play Video"}
                          >
                            {playingState[idx] ? (
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Bottom Content Area */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col justify-end text-white space-y-2.5">
                        {/* Slanted Quotes */}
                        <div className="flex gap-1">
                          <span className="w-1 h-3.5 bg-[#FF4F18] rounded-full" />
                          <span className="w-1 h-3.5 bg-[#FF4F18] rounded-full" />
                        </div>

                        {/* Quote snippet */}
                        <p className="text-[11px] md:text-[12px] leading-snug font-medium text-zinc-100 line-clamp-3">
                          "{item.quote}"
                        </p>

                        {/* Stat Pill */}
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-[11px] font-extrabold backdrop-blur-sm">
                            {item.stat}
                          </span>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center pt-1 border-t border-white/10">
                          <div className="w-7 h-7 rounded-full bg-[#FF4F18] flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-md">
                            {item.initials}
                          </div>
                          <div className="ml-2.5 min-w-0">
                            <h4 className="font-extrabold text-[12px] text-white truncate">
                              {item.author}
                            </h4>
                            <p className="text-[10px] font-medium text-zinc-300 truncate">
                              {item.role}, <span className="text-zinc-400">{item.location}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-4 select-none">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx
                  ? "w-7 bg-[#FF4F18]"
                  : "w-2.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                  }`}
                aria-label={`Go to video testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}





