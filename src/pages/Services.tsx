import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { ChevronDown, ArrowRight, CheckCircle2, LineChart } from "lucide-react";

export function Services() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    business: "",
    type: "",
    description: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setServices(data);
      })
      .catch(console.error);

    fetch("/api/service-gallery")
      .then(res => res.json())
      .then(data => {
        setGalleryImages(data);
      })
      .catch(console.error);
  }, []);

  const totalSlides = galleryImages.length > 0 ? galleryImages.length : 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello DATAVORA, I'm interested in a custom data solution.\n\nName: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\nBusiness: ${formData.business}\nSolution Type: ${formData.type}\nDescription: ${formData.description}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/15551234567?text=${encoded}`, "_blank");
  };

  const defaultServices = [
    {
      icon: "LineChart",
      title: "Financial Dashboard",
      description: "Automated P&L, cash flow forecasting, and budget tracking with visual charts."
    },
    {
      icon: "Package",
      title: "Inventory Management",
      description: "Track stock levels, set reorder points, and analyze COGS across multiple locations."
    },
    {
      icon: "Users",
      title: "HR Attendance",
      description: "Manage employee shifts, calculate overtime, and track leave balances automatically."
    },
    {
      icon: "Briefcase",
      title: "Sales CRM",
      description: "Lightweight, customizable pipeline tracker to close deals and manage client data."
    },
    {
      icon: "LayoutDashboard",
      title: "KPI Executive Dashboard",
      description: "High-level metrics and performance indicators consolidated into one clean view."
    },
    {
      icon: "Code",
      title: "Google Sheets Automation",
      description: "Custom Apps Script to connect APIs, send automated emails, and run background tasks."
    }
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.CheckCircle2;
    return <IconComponent className="w-7 h-7" />;
  };

  const steps = [
    "Consultation",
    "Planning",
    "Development",
    "Revision",
    "Delivery"
  ];

  const faqs = [
    {
      q: "How long does a project take?",
      a: "Most custom data solutions take between 1 to 3 weeks depending on the complexity of databases, integrations, and automation required."
    },
    {
      q: "Do you use Excel or Google Sheets?",
      a: "We develop for both platforms. We will recommend the best tool based on your specific requirements for collaboration and processing speed."
    },
    {
      q: "Can I request revisions?",
      a: "Yes. Every custom project includes a dedicated revision phase to ensure the final product aligns perfectly with your business workflow."
    },
    {
      q: "Do you provide source files?",
      a: "Absolutely. Once the project is delivered and finalized, you maintain 100% ownership of the data solution and its underlying code or templates."
    },
    {
      q: "Can this include Apps Script automation?",
      a: "Yes, we specialize in writing custom Google Apps Script and Excel VBA to automate data entry, generate PDFs, and send scheduled emails."
    }
  ];

  return (
    <div className="w-full bg-white text-black font-sans">
      
      {/* SECTION 1 — HERO */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-24 max-h-[90vh] md:max-h-[80vh] overflow-y-auto flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Custom Data Solutions
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-6 leading-tight">
              Need a Data Solution Built Just for Your Business?
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-zinc-500 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 px-4 md:px-0">
              We architect scalable databases, custom web applications, and intelligent dashboards to automate your workflows.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 px-4 sm:px-0">
              <a
                href="#request-form"
                className="w-full sm:w-auto px-6 md:px-8 min-h-[44px] py-3 flex items-center justify-center bg-primary text-white rounded-xl md:rounded-[20px] font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl hover:bg-[#059669] transition-all duration-300 text-center text-sm md:text-base"
              >
                Request Now
              </a>
              <Link
                to="/portfolio"
                className="w-full sm:w-auto px-6 md:px-8 min-h-[44px] py-3 flex items-center justify-center bg-white border border-gray-200 text-black rounded-xl md:rounded-[20px] font-bold hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 text-center gap-2 text-sm md:text-base"
              >
                View Portfolio
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full mt-8 lg:mt-0 relative">
            <div className="w-full aspect-[4/3] relative">
              {galleryImages.length > 0 ? (
                galleryImages.map((img, idx) => (
                  <div key={img.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <div className="w-full h-full rounded-[20px] shadow-[0_20px_50px_rgb(0,0,0,0.06)] overflow-hidden">
                      <img src={img.image} alt={`Service showcase ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Slide 0: Analytics Dashboard */}
                  <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <div className="w-full h-full rounded-[20px] shadow-[0_20px_50px_rgb(0,0,0,0.06)] overflow-hidden">
                      <img src="/src/assets/images/dashboard_mockup_1787411722000.jpg" alt="Analytics Dashboard Mockup" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Slide 1: Smart Spreadsheet */}
                  <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <div className="w-full h-full rounded-[20px] shadow-[0_20px_50px_rgb(0,0,0,0.06)] overflow-hidden">
                      <img src="/src/assets/images/spreadsheet_mockup_1787411737597.jpg" alt="Smart Spreadsheet Mockup" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Slide 2: Kanban CRM */}
                  <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeSlide === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <div className="w-full h-full rounded-[20px] shadow-[0_20px_50px_rgb(0,0,0,0.06)] overflow-hidden">
                      <img src="/src/assets/images/kanban_mockup_1787411757979.jpg" alt="Kanban CRM Mockup" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === i ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — SERVICES */}
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold tracking-tight text-black mb-4">
            Purpose-Built Solutions
          </h2>
          <p className="text-zinc-500">
            We architect precise, scalable data systems tailored to your specific operational needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service, idx) => (
            <div 
              key={idx} 
              className="group p-8 bg-white border border-gray-100 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-[16px] flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {renderIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{service.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — HOW IT WORKS */}
      <section className="bg-gray-50 py-24 border-y border-gray-100">
        <div className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold tracking-tight text-black mb-4">
              How It Works
            </h2>
            <p className="text-zinc-500">
              A streamlined, transparent process from initial consultation to final delivery.
            </p>
          </div>

          <div className="relative">
            {/* Desktop Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
            {/* Mobile Line */}
            <div className="md:hidden absolute top-0 left-[27px] w-1 h-full bg-gray-200 rounded-full"></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-4 relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-row md:flex-col items-center gap-6 md:gap-4 w-full md:w-[18%]">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white border-[4px] border-gray-100 shadow-sm flex items-center justify-center font-bold text-xl text-black transition-colors duration-300 hover:border-primary hover:text-primary">
                    {idx + 1}
                  </div>
                  <div className="md:text-center">
                    <h4 className="font-bold text-black">{step}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHY DATAVORA */}
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="w-full aspect-square md:aspect-[4/3] bg-gray-50 rounded-[20px] border border-gray-200 shadow-sm relative overflow-hidden flex items-center justify-center p-8">
              {/* Dashboard Illustration Placeholder */}
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-[16px] flex flex-col items-center justify-center bg-white/50 text-gray-400 gap-4">
                <LineChart className="w-16 h-16 text-primary/40" />
                <span className="font-medium text-lg">Premium Dashboard Framework</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full order-1 lg:order-2">
            <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold tracking-tight text-black mb-6">
              Built to Enterprise Standards
            </h2>
            <p className="text-base lg:text-lg text-zinc-500 mb-10">
              We don't just build templates; we build scalable data applications. Every project adheres to strict structural and visual guidelines.
            </p>
            
            <ul className="space-y-5">
              {[
                "Professional Formula",
                "Pivot Table Ready",
                "Dashboard Visualization",
                "Apps Script Automation",
                "Easy to Maintain",
                "Business Ready"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-black text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5 — REQUEST FORM */}
      <section id="request-form" className="bg-black py-24">
        <div className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1 text-white">
              <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold tracking-tight mb-6">
                Let's Discuss Your Project.
              </h2>
              <p className="text-white/60 text-base lg:text-lg mb-10 max-w-md">
                Fill out the form with your project details, and we'll review your requirements and get back to you with a custom proposal via WhatsApp.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-white/80">
                  <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium">Fast Response Time</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium">Free Initial Consultation</span>
                </div>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium">Secure & Confidential</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-8 md:p-10 rounded-[20px] shadow-2xl">
                <h3 className="text-2xl font-bold text-black mb-8">Request Custom Solution</h3>
                <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-black">WhatsApp Number</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black">Business Type</label>
                      <select 
                        required
                        value={formData.business}
                        onChange={(e) => setFormData({...formData, business: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black appearance-none"
                      >
                        <option value="">Select industry...</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Education">Education</option>
                        <option value="HR">HR</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-black">Solution Type</label>
                      <select 
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black appearance-none"
                      >
                        <option value="">Select type...</option>
                        <option value="Dashboard">Dashboard</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Attendance">Attendance</option>
                        <option value="Budgeting">Budgeting</option>
                        <option value="Reporting">Reporting</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-black">Project Description</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-5 py-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none text-black"
                      placeholder="Briefly describe what you need the data solution to do..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full min-h-[44px] py-4 flex items-center justify-center bg-primary text-white rounded-[16px] font-bold text-lg hover:bg-[#059669] hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    Request via WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FAQ */}
      <section className="max-w-[800px] mx-auto px-5 py-24">
        <div className="text-center mb-16">
          <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold tracking-tight text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-500">Everything you need to know about our custom data services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-[20px] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-6 flex justify-between items-center font-bold text-black bg-white focus:outline-none"
              >
                {faq.q}
                <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180 bg-primary/10 text-primary" : "text-gray-400"}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              <div 
                className={`grid transition-all duration-300 ease-in-out ${openFaq === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 text-zinc-500 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — FOOTER CTA */}
      <section className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 pb-24">
        <div className="bg-primary rounded-[20px] p-12 md:p-20 text-center relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10">
            <h2 className="text-[24px] md:text-[28px] lg:text-[36px] font-bold text-white mb-6">
              Let's Build Your Ideal Data Solution
            </h2>
            <p className="text-base lg:text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              Tell us your workflow and we'll transform it into an efficient data solution.
            </p>
            <a
              href="#request-form"
              className="inline-flex min-h-[44px] items-center justify-center px-8 py-4 bg-black text-white rounded-[20px] font-bold text-lg hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              Start Your Project
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
