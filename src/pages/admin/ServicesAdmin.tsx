import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Service = {
  id: number;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  icon: string;
};

export function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Partial<Service>>({
    title: "",
    title_en: "",
    description: "",
    description_en: "",
    icon: "CheckCircle2"
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/services/${editingId}` : "/api/services";
    const method = editingId ? "PUT" : "POST";
    
    // Remove id from payload if it exists
    const { id, ...dataToSave } = formData as Service;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        alert(`Failed to save: ${errData.error || response.statusText}`);
        return;
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: "", title_en: "", description: "", description_en: "", icon: "CheckCircle2" });
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      title: service.title,
      title_en: service.title_en || "",
      description: service.description,
      description_en: service.description_en || "",
      icon: service.icon
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      fetchServices();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Services Manager</h1>
          <p className="text-gray-500">Manage your business services and offerings.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", title_en: "", description: "", description_en: "", icon: "CheckCircle2" });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
            <h3 className="font-bold text-xl mb-2 text-black">{service.title}</h3>
            <p className="text-gray-500 text-sm mb-6">{service.description}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(service)} className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(service.id)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-black">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title (ID)</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title (EN) - Optional</label>
                  <input type="text" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Icon Name (Lucide React)</label>
                <input required type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black" placeholder="e.g. CheckCircle2, LineChart" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description (ID)</label>
                  <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description (EN) - Optional</label>
                  <textarea rows={4} value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} className="w-full border-gray-200 bg-gray-50 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-black"></textarea>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all">
                Save Service
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
