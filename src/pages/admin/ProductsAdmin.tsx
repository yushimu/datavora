import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import { compressImage } from "../../lib/imageUtils";

export type Product = {
  id: number;
  title: string;
  title_en?: string;
  categories: string[];
  description: string;
  description_en?: string;
  price: string;
  features: string[];
  features_en?: string[];
  image: string;
  images: string[];
};

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({ features: [], images: [], categories: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSave = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/products/${isEditing.id}` : "/api/products";
    
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
    setFormData({ features: [], images: [], categories: [] });
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setFormData({ ...p, categories: p.categories || [] });
    setIsEditing(p);
  };

  const handleAddNew = () => {
    setFormData({ features: [], images: [], categories: [] });
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
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

  const Modal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black">{isEditing ? "Edit Product" : "Add Product"}</h2>
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
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price (Base Price in IDR)</label>
            <input type="text" className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.price || ""} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map(cat => {
                const isSelected = formData.categories?.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      const current = formData.categories || [];
                      if (isSelected) {
                        setFormData({...formData, categories: current.filter(c => c !== cat.name)});
                      } else {
                        setFormData({...formData, categories: [...current, cat.name]});
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat.name}
                  </button>
                )
              })}
              {categories.length === 0 && <span className="text-sm text-gray-500">No categories found. Please add in Settings.</span>}
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
              <textarea rows={3} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description (EN) - Optional</label>
              <textarea rows={3} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" value={formData.description_en || ""} onChange={e => setFormData({...formData, description_en: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Features (ID - comma separated)</label>
              <textarea 
                rows={3}
                className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" 
                value={formData.features?.join(", ") || ""} 
                onChange={e => setFormData({...formData, features: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Features (EN - comma separated)</label>
              <textarea 
                rows={3}
                className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" 
                value={formData.features_en?.join(", ") || ""} 
                onChange={e => setFormData({...formData, features_en: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} 
              />
            </div>
          </div>
          <button onClick={handleSave} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">Save Product</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Products Manager</h1>
          <p className="text-gray-500">Manage your product offerings and pricing.</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-6">
            {((p.images && p.images.length > 0) ? p.images[0] : p.image) && (
              <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img src={(p.images && p.images.length > 0) ? p.images[0] : p.image} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-1">
                  {(p.categories && p.categories.length > 0) ? p.categories.map(cat => (
                    <span key={cat} className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">{cat}</span>
                  )) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Uncategorized</span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1 text-black">{p.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(p.features || []).slice(0,2).map((f, i) => (
                    <span key={i} className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded-md">{f}</span>
                  ))}
                  {p.features && p.features.length > 2 && <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded-md">+{p.features.length - 2}</span>}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                <span className="font-bold text-primary text-lg">{p.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(p); setFormData(p); }} className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="w-10 h-10 flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {(isAdding || isEditing) && <Modal />}
    </div>
  );
}
