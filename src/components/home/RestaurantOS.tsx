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

  const [activeIndex, setActiveIndex] = useState(2);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playingState, setPlayingState] = useState<{ [key: number]: boolean }>({});
  const [fullscreenVideo, setFullscreenVideo] = useState<Testimonial | null>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const popupVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synchronize play/pause states based on active index
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      video.muted = isMuted;

      if (idx === activeIndex && !fullscreenVideo) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayingState((prev) => ({ ...prev, [idx]: true }));
            })
            .catch(() => {
              setPlayingState((prev) => ({ ...prev, [idx]: false }));
            });
        }
      } else {
        video.pause();
        video.currentTime = 0;
        setPlayingState((prev) => ({ ...prev, [idx]: false }));
      }
    });
  }, [activeIndex, isMuted, fullscreenVideo]);

  // Pinned Sticky Scroll Handler: Locks screen in place while scrolling through videos
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || fullscreenVideo) return;
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [testimonials.length, fullscreenVideo]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const openFullscreen = (item: Testimonial, e: React.MouseEvent) => {
    e.stopPropagation();
    setFullscreenVideo(item);
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

                        <div className="flex items-center gap-1.5">
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

                          {/* Fullscreen Expand Popup Button */}
                          <button
                            onClick={(e) => openFullscreen(item, e)}
                            className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#FF4F18] transition-all cursor-pointer"
                            aria-label="Open fullscreen video popup"
                            title="Watch in fullscreen popup"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                          </button>
                        </div>
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

          {/* Carousel Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-6 select-none">
            {/* Left Navigation Arrow */}
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
              }
              className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-white hover:bg-[#FF4F18] hover:text-white hover:border-[#FF4F18] active:scale-95 transition-all shadow-md cursor-pointer"
              aria-label="Previous testimonial video"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[#111111] dark:text-white hover:bg-[#FF4F18] hover:text-white hover:border-[#FF4F18] active:scale-95 transition-all shadow-md cursor-pointer"
              aria-label="Next testimonial video"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Popup Modal */}
      {fullscreenVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Modal Button */}
            <button
              onClick={() => setFullscreenVideo(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#FF4F18] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close modal popup"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player Container */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative aspect-[9/16] md:aspect-auto max-h-[60vh] md:max-h-[85vh]">
              <video
                ref={popupVideoRef}
                src={fullscreenVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Testimonial Information & Controls */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-zinc-950 text-white overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-xs font-extrabold">
                    {fullscreenVideo.stat}
                  </span>
                </div>

                <blockquote className="text-lg md:text-xl font-medium leading-relaxed text-zinc-100 italic">
                  "{fullscreenVideo.quote}"
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-[#FF4F18] flex items-center justify-center text-white text-base font-bold shadow-md">
                    {fullscreenVideo.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {fullscreenVideo.author}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {fullscreenVideo.role},{" "}
                      <span className="text-zinc-300 font-medium">
                        {fullscreenVideo.location}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Prev / Next Modal Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-zinc-900 mt-6">
                <button
                  onClick={() => {
                    const currentIdx = testimonials.findIndex((t) => t.id === fullscreenVideo.id);
                    const prevIdx = (currentIdx - 1 + testimonials.length) % testimonials.length;
                    setFullscreenVideo(testimonials[prevIdx]);
                    setActiveIndex(prevIdx);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Previous
                </button>

                <button
                  onClick={() => {
                    const currentIdx = testimonials.findIndex((t) => t.id === fullscreenVideo.id);
                    const nextIdx = (currentIdx + 1) % testimonials.length;
                    setFullscreenVideo(testimonials[nextIdx]);
                    setActiveIndex(nextIdx);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






