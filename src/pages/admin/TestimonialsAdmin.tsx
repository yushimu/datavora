import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  company: string;
  rating: number;
  review: string;
  review_en?: string;
  photo: string;
};

export function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: "",
    company: "",
    rating: 5,
    review: "",
    review_en: "",
    photo: ""
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setTestimonials(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
    const method = editingId ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", company: "", rating: 5, review: "", review_en: "", photo: "" });
    fetchTestimonials();
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      rating: testimonial.rating,
      review: testimonial.review,
      review_en: testimonial.review_en || "",
      photo: testimonial.photo || ""
    });
    setEditingId(testimonial.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      fetchTestimonials();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Testimonials Manager</h1>
          <p className="text-gray-500">Manage client feedback and reviews.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", company: "", rating: 5, review: "", review_en: "", photo: "" });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0 overflow-hidden">
                {testimonial.photo ? <img src={testimonial.photo} className="w-full h-full object-cover" /> : testimonial.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-black">{testimonial.name}</h3>
                <p className="text-gray-400 text-sm">{testimonial.company}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-6 line-clamp-3">{testimonial.review}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(testimonial)} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(testimonial.id)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-black">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Client Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company (Optional)</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rating (1-5)</label>
                  <input required type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Photo URL (Optional)</label>
                  <input type="text" value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Review (ID)</label>
                  <textarea required rows={4} value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Review (EN) - Optional</label>
                  <textarea rows={4} value={formData.review_en} onChange={e => setFormData({...formData, review_en: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black"></textarea>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all">
                Save Testimonial
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
