import { Link } from "react-router-dom";
import { ArrowRight, FileSpreadsheet, Zap, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-16 lg:pt-20 pb-8 z-10 max-h-[90vh] md:max-h-[80vh] flex flex-col justify-center">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
              Premium Digital Solutions
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-6 md:mb-8 leading-tight">
              Empower Your Business with <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-primary">Data Solutions.</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-zinc-500 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
              Transform raw information into actionable insights with our custom web apps, scalable databases, and intelligent templates.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link
                to="/products"
                className="w-full sm:w-auto px-6 md:px-8 min-h-[44px] py-3 bg-primary text-white rounded-xl md:rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-[#059669] transition-all flex items-center justify-center gap-2 group text-sm md:text-base"
              >
                Explore Products
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto px-6 md:px-8 min-h-[44px] py-3 bg-white/50 backdrop-blur-md border border-gray-200 text-black rounded-xl md:rounded-2xl font-bold shadow-sm hover:bg-white transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Request Custom
              </Link>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 border-t border-gray-100 pt-8 md:pt-10"
            >
              {[
                { label: "Templates", value: "50+" },
                { label: "Projects", value: "120+" },
                { label: "Satisfaction", value: "98%" }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
                  className="flex flex-col gap-1"
                >
                  <span className="text-2xl md:text-4xl font-bold text-black">{stat.value}</span>
                  <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              icon: FileSpreadsheet,
              title: "Bespoke Data Systems",
              description: "Custom-architected databases, web applications, and analytics models that look beautiful and function flawlessly."
            },
            {
              icon: Zap,
              title: "Automated Workflows",
              description: "Eliminate manual data entry with smart macros and script-driven automation."
            },
            {
              icon: TrendingUp,
              title: "Actionable Insights",
              description: "Transform raw data into clear, visual dashboards that drive intelligent decision making."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/40 backdrop-blur-md border border-gray-100 p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-inner flex items-center justify-center border border-gray-100 mb-5 md:mb-6">
                <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">{feature.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-xs md:text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="bg-black/90 backdrop-blur-xl py-12 md:py-16 my-4 text-white relative overflow-hidden border-y border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 text-center relative z-10">
          <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-6 md:mb-8" />
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto">
            "Datavora transformed our chaotic data into a streamlined, beautiful system that saves us hours every week."
          </h2>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 border border-white/20"></div>
            <div className="text-left">
              <div className="text-white font-bold text-sm md:text-base">Sarah Jenkins</div>
              <div className="text-white/50 text-xs md:text-sm">Director of Operations, Vertex Inc.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 pb-10 md:pb-12 relative z-10">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] md:rounded-[32px] p-8 md:p-20 text-center relative overflow-hidden border border-gray-200 shadow-xl shadow-primary/5">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 md:mb-6">
              Ready to elevate your workflow?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-zinc-500 mb-8 md:mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who trust Datavora for their digital tools and custom solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 min-h-[44px] py-3 flex items-center justify-center bg-black text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-lg hover:bg-zinc-800 transition-colors duration-300 shadow-lg"
              >
                Let's Talk
              </Link>
            </div>
            
            <div className="mt-8 md:mt-12 flex items-center justify-center gap-4 md:gap-8 flex-wrap">
              {['Fast Delivery', 'Premium Quality', 'Ongoing Support'].map((benefit) => (
                <div key={benefit} className="flex items-center gap-1.5 md:gap-2 text-zinc-500 font-medium text-xs md:text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
