import { Mail, MapPin, Phone } from "lucide-react";

export function Contact() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16">
        <div>
          <h1 className="text-2xl sm:text-[30px] md:text-[36px] lg:text-[48px] font-bold text-zinc-900 mb-4 sm:mb-6">Let's build something great.</h1>
          <p className="text-sm sm:text-base lg:text-lg text-zinc-600 mb-8 sm:mb-12">
            Whether you need a custom data solution or have questions about our digital products, our team is ready to help.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-inner flex items-center justify-center border border-gray-100 text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-black mb-1">Email Us</h3>
                <p className="text-zinc-500 mb-2 text-sm">Our friendly team is here to help.</p>
                <a href="mailto:yunusshifa112@gmail.com" className="text-primary font-bold hover:underline">yunusshifa112@gmail.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-inner flex items-center justify-center border border-gray-100 text-black shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-black mb-1">Office</h3>
                <p className="text-zinc-500 mb-2 text-sm">Come say hello at our office.</p>
                <p className="text-black font-semibold text-sm">Biru, Kec. Majalaya, Kabupaten Bandung,<br/>Jawa Barat Indonesia 40392</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-inner flex items-center justify-center border border-gray-100 text-black shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="pt-1">
                <h3 className="text-lg font-bold text-black mb-1">Phone / WhatsApp</h3>
                <p className="text-zinc-500 mb-2 text-sm">Mon-Fri from 8am to 5pm.</p>
                <a href="https://wa.me/6285722641239" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover:text-primary transition-colors">+62 857-2264-1239</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl p-5 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] border border-gray-100 shadow-xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <h2 className="text-xl sm:text-[24px] md:text-[28px] lg:text-[36px] font-bold text-black mb-6 sm:mb-8 relative z-10">Send us a message</h2>
          <form className="space-y-4 sm:space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-xs sm:text-sm font-bold text-black">First Name</label>
                <input 
                  type="text" 
                  id="firstName"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors shadow-inner text-black text-sm sm:text-base"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-xs sm:text-sm font-bold text-black">Last Name</label>
                <input 
                  type="text" 
                  id="lastName"
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors shadow-inner text-black text-sm sm:text-base"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-bold text-black">Email Address</label>
              <input 
                type="email" 
                id="email"
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors shadow-inner text-black text-sm sm:text-base"
                placeholder="john@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs sm:text-sm font-bold text-black">Message</label>
              <textarea 
                id="message"
                rows={4}
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none shadow-inner text-black text-sm sm:text-base"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full min-h-[40px] sm:min-h-[44px] flex items-center justify-center py-3 sm:py-4 bg-black text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-zinc-800 transition-colors shadow-lg mt-2 sm:mt-4"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
