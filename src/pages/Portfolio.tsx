import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2
} from "lucide-react";

import testimonialsData from "../data/testimonials.json";

type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  tools: string[];
  image: string;
  images?: string[];
};

export function Portfolio() {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalImageIdx, setModalImageIdx] = useState(0);

  // Reset modal image when selecting a new project
  useEffect(() => {
    if (selectedProject) setModalImageIdx(0);
  }, [selectedProject]);

  // Fetch data
  useEffect(() => {
    fetch("/api/portfolio")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPortfolioData(data);
        } else {
          // Fallback to local JSON if DB is empty or fails
          import("../data/portfolio.json").then((module) => {
            setPortfolioData(module.default as PortfolioItem[]);
          });
        }
      })
      .catch(e => {
        console.error(e);
        import("../data/portfolio.json").then((module) => {
          setPortfolioData(module.default as PortfolioItem[]);
        });
      });
  }, []);


  // Touch handlers for slider
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) nextSlide();
    if (touchStart - touchEnd < -50) prevSlide();
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonialsData.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProject]);

  return (
    <div className="w-full bg-white text-black font-sans relative">
      
      {/* SECTION 1 — HERO */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-24 max-h-[90vh] md:max-h-[80vh] overflow-y-auto flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Portfolio
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-6 leading-tight">
              Real Data Projects That Solve Real Business Problems
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-zinc-500 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore dashboards, automation systems, financial reports, and custom web apps built for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#projects"
                className="w-full sm:w-auto px-6 md:px-8 min-h-[44px] py-3 flex items-center justify-center bg-primary text-white rounded-xl md:rounded-[20px] font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl hover:bg-[#059669] transition-all duration-300 text-center text-sm md:text-base"
              >
                View Projects
              </a>
              <Link
                to="/services"
                className="w-full sm:w-auto px-6 md:px-8 min-h-[44px] py-3 flex items-center justify-center bg-white border border-gray-200 text-black rounded-xl md:rounded-[20px] font-bold hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 text-center gap-2 text-sm md:text-base"
              >
                Request Yours
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full flex justify-center lg:justify-end mt-8 lg:mt-0">
            {/* Premium Laptop Mockup */}
            <div className="w-full max-w-[400px] md:max-w-[500px]">
              <div className="w-full aspect-[16/10] bg-black rounded-t-[16px] md:rounded-t-[20px] border-[6px] md:border-[8px] border-black relative overflow-hidden flex flex-col">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 rounded-full"></div>
                {/* Screen Content - Executive Dashboard */}
                <div className="flex-1 bg-white m-1 mt-3 md:mt-4 rounded-sm flex flex-col p-2 md:p-3 overflow-hidden">
                  <div className="flex justify-between items-center mb-3 md:mb-4 border-b border-gray-100 pb-2">
                    <div className="h-2 md:h-3 w-16 md:w-24 bg-gray-200 rounded-full"></div>
                    <div className="flex gap-1.5 md:gap-2">
                      <div className="h-2 md:h-3 w-6 md:w-8 bg-primary/20 rounded-full"></div>
                      <div className="h-2 md:h-3 w-6 md:w-8 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 md:gap-3 mb-2 md:mb-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-10 md:h-12 bg-primary/5 rounded-md border border-primary/10 p-1.5 md:p-2 flex flex-col justify-between">
                        <div className="h-1 md:h-1.5 w-6 md:w-8 bg-primary/30 rounded-full"></div>
                        <div className="h-2 md:h-3 w-8 md:w-12 bg-primary/60 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 flex gap-2 md:gap-3">
                    <div className="flex-[2] border border-gray-100 rounded-md p-1.5 md:p-2 flex flex-col justify-end gap-1">
                      <div className="flex items-end gap-1 h-full pt-2 md:pt-4">
                        {[30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-[1] border border-gray-100 rounded-md p-1.5 md:p-2 flex flex-col gap-1.5 md:gap-2">
                       <div className="h-1.5 md:h-2 w-8 md:w-10 bg-gray-200 rounded-full mb-0.5 md:mb-1"></div>
                       {[1, 2, 3].map((i) => (
                         <div key={i} className="h-2 md:h-3 w-full bg-gray-50 rounded-sm"></div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-3 md:h-4 bg-gray-300 rounded-b-[16px] md:rounded-b-[20px] relative shadow-xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-1 md:h-1.5 bg-gray-400 rounded-b-md"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — FEATURED PORTFOLIO */}
      <section id="projects" className="bg-gray-50 py-16 md:py-24 border-y border-gray-100">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-black mb-3 md:mb-4">
              Featured Projects
            </h2>
            <p className="text-zinc-500 text-sm md:text-base lg:text-lg px-4 md:px-0">
              A curated selection of our finest custom data solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {portfolioData.map((project) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-2xl sm:rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                  {project.images && project.images.length > 0 ? (
                    <img loading="lazy" src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : project.image ? (
                    <img loading="lazy" src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-200 to-gray-50 group-hover:scale-110 transition-transform duration-700"></div>
                  )}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <span className="px-1.5 py-0.5 sm:px-3 sm:py-1 bg-white/90 backdrop-blur-sm text-black text-[9px] sm:text-xs font-bold rounded-full shadow-sm">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 backdrop-blur-[2px]">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-primary">
                      <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 -rotate-45" />
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-sm sm:text-lg font-bold text-black mb-1 sm:mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-5 md:mb-6 line-clamp-2 leading-relaxed flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-5 md:mb-6">
                    {(project.tools || []).slice(0, 2).map((tool, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-gray-50 text-zinc-600 rounded-md text-[9px] sm:text-[10px] md:text-xs font-medium border border-gray-100">
                        {tool}
                      </span>
                    ))}
                    {project.tools && project.tools.length > 2 && (
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-gray-50 text-zinc-600 rounded-md text-[9px] sm:text-[10px] md:text-xs font-medium border border-gray-100">
                        +{project.tools.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="w-full min-h-[32px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center py-1.5 sm:py-2.5 md:py-3 bg-white border border-gray-200 text-black rounded-lg sm:rounded-xl md:rounded-[12px] font-bold text-[10px] sm:text-xs md:text-sm hover:bg-black hover:text-white hover:border-black transition-colors duration-300"
                  >
                    View Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — ACHIEVEMENT COUNTERS (Animated on Scroll) */}
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {[
            { label: "Projects Completed", value: "120+" },
            { label: "Premium Templates", value: "50+" },
            { label: "Client Satisfaction", value: "98%" },
            { label: "Years Experience", value: "4+" }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — CLIENT TESTIMONIALS */}
      <section className="bg-black text-white py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold tracking-tight mb-4">
              Client Testimonials
            </h2>
            <p className="text-white/50 text-base lg:text-lg">
              Hear what our clients have to say about working with us.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div 
              className="overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonialsData.map((testimonial, idx) => (
                  <div key={idx} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center">
                      <div className="flex gap-1 text-primary mb-8">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <p className="text-lg md:text-2xl font-medium leading-relaxed mb-10 text-white/90">
                        "{testimonial.review}"
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center font-bold border border-white/20">
                          {testimonial.photo}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-white">{testimonial.name}</div>
                          <div className="text-white/50 text-sm">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Navigation */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonialsData.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-primary w-8' : 'bg-white/30'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FINAL CTA */}
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 py-24">
        <div className="bg-white border border-gray-200 rounded-[20px] p-12 md:p-20 text-center shadow-[0_20px_50px_rgb(0,0,0,0.06)]">
          <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold text-black mb-6">
            Your Business Could Be the Next Success Story
          </h2>
          <p className="text-base md:text-lg text-zinc-500 mb-10 max-w-2xl mx-auto">
            Need a custom dashboard or data solution? Let's build it together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 min-h-[44px] py-3 flex items-center justify-center bg-primary text-white rounded-[20px] font-bold text-lg hover:bg-[#059669] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
            >
              Request Custom Solution
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 min-h-[44px] py-3 flex items-center justify-center bg-white border border-gray-200 text-black rounded-[20px] font-bold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300"
            >
              Browse Digital Products
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3 — PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm opacity-100 transition-opacity">
          <div 
            className="absolute inset-0"
            onClick={() => setSelectedProject(null)}
          ></div>
          <div className="bg-white rounded-[24px] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row">
            
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-black hover:bg-gray-100 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image/Graphic Placeholder */}
            <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-100 relative overflow-hidden shrink-0 group/modalslider">
               {(selectedProject.images && selectedProject.images.length > 0) || selectedProject.image ? (
                 <>
                   <img loading="lazy"
                     src={(selectedProject.images && selectedProject.images.length > 0) ? selectedProject.images[modalImageIdx] : selectedProject.image} 
                     alt={selectedProject.title} 
                     className="w-full h-full object-cover transition-opacity duration-300"
                   />
                   {selectedProject.images && selectedProject.images.length > 1 && (
                     <>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setModalImageIdx(prev => (prev - 1 + (selectedProject.images?.length || 1)) % (selectedProject.images?.length || 1)); }}
                         className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white backdrop-blur rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover/modalslider:opacity-100 transition-opacity text-black z-10"
                       >
                         <ChevronLeft className="w-5 h-5" />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setModalImageIdx(prev => (prev + 1) % (selectedProject.images?.length || 1)); }}
                         className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white backdrop-blur rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover/modalslider:opacity-100 transition-opacity text-black z-10"
                       >
                         <ChevronRight className="w-5 h-5" />
                       </button>
                       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                         {selectedProject.images.map((_, idx) => (
                           <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === modalImageIdx ? 'w-4 bg-primary' : 'w-1.5 bg-white/60'}`} />
                         ))}
                       </div>
                     </>
                   )}
                 </>
               ) : (
                 <>
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-200 to-gray-50"></div>
                   <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="w-full aspect-square bg-white shadow-xl rounded-2xl border border-gray-100 flex items-center justify-center p-6 text-center">
                        <div>
                          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3">
                            {selectedProject.category}
                          </div>
                          <div className="text-xl font-bold text-black opacity-30">
                            {selectedProject.title} Snapshot
                          </div>
                        </div>
                      </div>
                   </div>
                 </>
               )}
            </div>
            
            <div className="p-8 md:p-10 flex-1 flex flex-col">
              <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2">
                {selectedProject.category}
              </span>
              <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold text-black mb-6">
                {selectedProject.title}
              </h2>
              
              <div className="space-y-8 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    The Problem
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {selectedProject.problem}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-black mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    The Solution
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-black mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(selectedProject.features || []).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-zinc-700 text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="pt-8 mt-8 border-t border-gray-100">
                <div className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Tools Used</div>
                <div className="flex flex-wrap gap-2">
                  {(selectedProject.tools || []).map((tool, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-black rounded-lg text-sm font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

