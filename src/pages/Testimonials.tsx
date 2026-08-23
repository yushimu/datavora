import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

export function Testimonials() {
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setDbTestimonials(data);
      })
      .catch(console.error);
  }, []);

  const defaultTestimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Director of Operations",
      company: "Vertex Inc.",
      content: "Datavora transformed our chaotic data into a streamlined, beautiful system that saves us hours every week. Their custom data solution was exactly what we needed to scale our processes without adding overhead.",
      rating: 5,
    },
    {
      id: 2,
      name: "Marcus Thorne",
      role: "Managing Partner",
      company: "Lumina Partners",
      content: "The venture capital deal tracker is an absolute masterpiece. It's not just functional; it's aesthetically pleasing and incredibly intuitive. The team at Datavora understands both finance and design.",
      rating: 5,
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Head of Marketing",
      company: "Echo Marketing",
      content: "We purchased their Ultimate Financial Tracker and it blew us away. Clean layout, brilliant automation, and it perfectly handles our complex agency revenue streams.",
      rating: 5,
    },
    {
      id: 4,
      name: "David Chen",
      role: "Founder",
      company: "Stratos E-Commerce",
      content: "Datavora's custom inventory solution paid for itself in the first month by catching stock discrepancies we were previously missing. Exceptional service and a beautiful end product.",
      rating: 5,
    },
    {
      id: 5,
      name: "Rachel Kim",
      role: "VP Finance",
      company: "Nexus Tech",
      content: "I've worked with many consultants, but Datavora stands out for their ability to take a messy brief and deliver a polished, high-performance financial model. They are true data architects.",
      rating: 5,
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Operations Manager",
      company: "Oasis Health",
      content: "The staff scheduling matrix they built for us reduced our scheduling time by 70%. It handles all our compliance rules automatically. A game-changer for our clinic.",
      rating: 5,
    }
  ];

  const displayTestimonials = dbTestimonials.length > 0 
    ? dbTestimonials.map(t => ({
        id: t.id,
        name: t.name,
        role: "Client", // Add default role since it's not in db yet, or we can just ignore it
        company: t.company,
        content: t.review,
        rating: t.rating,
        photo: t.photo
      }))
    : defaultTestimonials;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-5 md:px-12 lg:px-20 py-12">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-bold text-zinc-900 mb-6">Client Testimonials</h1>
        <p className="text-base lg:text-lg text-zinc-600">
          Don't just take our word for it. Here's what professionals say about our digital products and custom services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white/40 backdrop-blur-md p-8 rounded-[32px] border border-gray-100 shadow-sm relative">
            <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10" />
            <div className="flex gap-1 text-amber-400 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-zinc-700 leading-relaxed mb-8 relative z-10">"{testimonial.content}"</p>
            <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
              {testimonial.photo ? (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img src={testimonial.photo} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {testimonial.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-bold text-black">{testimonial.name}</div>
                <div className="text-sm text-zinc-500">{testimonial.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
