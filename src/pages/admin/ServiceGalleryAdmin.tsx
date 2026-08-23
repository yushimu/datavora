import React, { useState, useEffect, useRef } from "react";
import { Trash2, Upload, Plus } from "lucide-react";

import { compressImage } from "../../lib/imageUtils";

type GalleryImage = {
  id: number;
  image: string;
};

export function ServiceGalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/service-gallery");
      const data = await res.json();
      setImages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files) as File[];
    
    for (const file of files) {
      try {
        const compressedBase64 = await compressImage(file, 1200, 0.7);
        await fetch("/api/service-gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: compressedBase64 }),
        });
      } catch (err) {
        console.error("Error compressing/uploading image:", err);
      }
    }
    
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    fetchImages();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await fetch(`/api/service-gallery/${id}`, { method: "DELETE" });
      fetchImages();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Service Gallery</h1>
          <p className="text-gray-500">Manage images for the slider on the Services page.</p>
        </div>
        <div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all"
          >
            <Upload className="w-5 h-5" />
            Upload Images
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="relative group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden aspect-video">
            <img src={img.image} alt="Gallery item" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                onClick={() => handleDelete(img.id)}
                className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-100 rounded-2xl border-dashed">
            No images in the gallery yet. Click "Upload Images" to add some!
          </div>
        )}
      </div>
    </div>
  );
}
