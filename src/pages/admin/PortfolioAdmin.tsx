import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import { compressImage } from "../../lib/imageUtils";

type PortfolioItem = {
  id: number;
  title: string;
  title_en?: string;
  category: string;
  category_en?: string;
  description: string;
  description_en?: string;
  problem: string;
  problem_en?: string;
  solution: string;
  solution_en?: string;
  features: string[];
  features_en?: string[];
  tools: string[];
  image: string;
  images: string[];
};

export function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isEditing, setIsEditing] = useState<PortfolioItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({ features: [], tools: [], images: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/portfolio/${isEditing.id}` : "/api/portfolio";
    
    // Set first image as the main image if exists and not already set
    const dataToSave = { ...formData };
    if (dataToSave.images && dataToSave.images.length > 0 && !dataToSave.image) {
      dataToSave.image = dataToSave.images[0];
    }
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });

    setIsEditing(null);
    setIsAdding(false);
    setFormData({ features: [], tools: [], images: [] });
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files) as File[];
    const newImages: string[] = [];
    
    for (const file of files) {
      try {
        const compressedBase64 = await compressImage(file, 800, 0.7);
        newImages.push(compressedBase64);
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }));
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Portfolio Manager</h1>
          <p className="text-gray-500">Manage your past projects and case studies.</p>
        </div>
        <button onClick={() => { setIsAdding(true); setFormData({ features: [], tools: [], image: "" }); }} className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            {((p.images && p.images.length > 0) ? p.images[0] : p.image) && (
              <div className="w-full h-48 bg-gray-100 overflow-hidden">
                <img src={(p.images && p.images.length > 0) ? p.images[0] : p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full mb-3 self-start">{p.category}</div>
              <h3 className="text-xl font-bold mb-2 text-black">{p.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{p.description}</p>
              <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-50">
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(p); setFormData(p); }} className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="w-10 h-10 flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-black">{isEditing ? "Edit Portfolio Project" : "Add Portfolio Project"}</h2>
              <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title (ID)</label>
                  <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title (EN) - Optional</label>
                  <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.title_en || ""} onChange={e => setFormData({...formData, title_en: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category (ID)</label>
                  <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Web App, Finance" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category (EN) - Optional</label>
                  <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.category_en || ""} onChange={e => setFormData({...formData, category_en: e.target.value})} placeholder="e.g. Web App, Finance" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Images</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-4 bg-gray-50">
                   <input 
                     type="file" 
                     multiple 
                     accept="image/*" 
                     className="hidden" 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                   />
                   <button 
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     className="bg-white border border-gray-200 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 shadow-sm"
                   >
                     <Upload className="w-4 h-4" /> Upload Images
                   </button>
                   
                   {formData.images && formData.images.length > 0 && (
                     <div className="flex flex-wrap gap-3 mt-4 w-full justify-center">
                       {formData.images.map((img, idx) => (
                         <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                           <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => removeImage(idx)}
                             className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X className="w-6 h-6" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description (ID)</label>
                  <textarea rows={2} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description (EN) - Optional</label>
                  <textarea rows={2} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.description_en || ""} onChange={e => setFormData({...formData, description_en: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Problem (ID)</label>
                  <textarea rows={3} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.problem || ""} onChange={e => setFormData({...formData, problem: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Problem (EN) - Optional</label>
                  <textarea rows={3} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.problem_en || ""} onChange={e => setFormData({...formData, problem_en: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Solution (ID)</label>
                  <textarea rows={3} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.solution || ""} onChange={e => setFormData({...formData, solution: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Solution (EN) - Optional</label>
                  <textarea rows={3} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.solution_en || ""} onChange={e => setFormData({...formData, solution_en: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Features (ID - comma separated)</label>
                  <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.features?.join(", ") || ""} onChange={e => setFormData({...formData, features: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Features (EN - comma separated)</label>
                  <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.features_en?.join(", ") || ""} onChange={e => setFormData({...formData, features_en: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tools (comma separated)</label>
                  <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.tools?.join(", ") || ""} onChange={e => setFormData({...formData, tools: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} />
                </div>
              </div>
              
              <button onClick={handleSave} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all mt-4">Save Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
