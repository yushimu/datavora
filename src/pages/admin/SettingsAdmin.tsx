import React, { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

export function SettingsAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      setNewCategoryName("");
      setIsAdding(false);
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
          <p className="text-gray-500">Configure global settings and taxonomies.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Product Categories</h2>
          <button 
            onClick={() => setIsAdding(true)} 
            className="text-sm bg-primary/10 text-primary font-bold px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
        
        {isAdding && (
          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-xl">
            <input 
              type="text" 
              placeholder="New Category Name" 
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 text-black"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              autoFocus
            />
            <button onClick={handleAddCategory} className="bg-primary text-white font-bold px-6 py-2 rounded-lg hover:bg-primary-hover">Save</button>
            <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-black"><X className="w-5 h-5" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 group">
              <span className="font-medium text-black">{cat.name}</span>
              <button 
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 p-1.5 rounded-md"
                aria-label="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-6 text-gray-500">
              No categories found. Add one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
