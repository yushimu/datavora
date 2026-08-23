import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, Star, Check, ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "../contexts/LanguageContext";
import { en } from "../locales/en";
import { id } from "../locales/id";

type Product = {
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

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { language, formatPrice } = useLanguage();
  const t = language === 'en' ? en : id;
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-100 p-4 sm:p-6 md:p-8 rounded-[20px] md:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-all relative overflow-hidden group">
      <div className="mb-3 sm:mb-5 md:mb-6">
        <div className="h-32 sm:h-40 md:h-48 w-full bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-5 md:mb-6 flex items-center justify-center border border-gray-100 overflow-hidden relative group/slider">
          {images.length > 0 ? (
            <>
              <img loading="lazy" src={images[currentImageIdx]} alt={product.title} className="w-full h-full object-cover transition-opacity duration-300" />
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white/80 hover:bg-white backdrop-blur rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity text-black">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white/80 hover:bg-white backdrop-blur rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover/slider:opacity-100 transition-opacity text-black">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
                    {images.map((_, idx) => (
                      <div key={idx} className={`h-1 sm:h-1.5 rounded-full transition-all ${idx === currentImageIdx ? 'w-3 sm:w-4 bg-primary' : 'w-1 sm:w-1.5 bg-white/60'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-zinc-400 text-[10px] sm:text-xs md:text-sm font-medium">{t.products.preview}</span>
          )}
        </div>
        <h3 className="text-sm sm:text-xl md:text-2xl lg:text-[26px] font-bold text-black mb-1.5 sm:mb-3 line-clamp-2 leading-snug">
          {language === 'en' && product.title_en ? product.title_en : product.title}
        </h3>
        <p className="text-zinc-500 mb-2 sm:mb-4 text-[10px] sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {language === 'en' && product.description_en ? product.description_en : product.description}
        </p>
      </div>
      
      <div className="flex-grow">
        <ul className="space-y-1.5 sm:space-y-2.5 mb-3 sm:mb-6 md:mb-8">
          {(language === 'en' && product.features_en && product.features_en.length > 0 ? product.features_en : product.features)?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-1.5 sm:gap-2.5">
              <div className="mt-0.5 bg-primary/10 p-0.5 sm:p-1 rounded-full text-primary shrink-0">
                <Check className="w-2 h-2 sm:w-3 sm:h-3" />
              </div>
              <span className="text-zinc-600 text-[9px] sm:text-xs md:text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-3 sm:pt-5 md:pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <span className="text-base sm:text-2xl md:text-3xl font-bold text-black">{formatPrice(product.price)}</span>
        <a 
          href={`https://wa.me/6285722641239?text=${encodeURIComponent(`saya mau "${product.title}"`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 sm:gap-2 bg-black text-white px-2 sm:px-4 md:px-5 min-h-[32px] sm:min-h-[40px] md:min-h-[44px] py-1.5 sm:py-2 md:py-3 rounded-lg sm:rounded-xl hover:bg-zinc-800 transition-colors font-bold text-[10px] sm:text-xs md:text-sm shadow-sm justify-center w-full sm:w-auto"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          {t.products.getNow}
        </a>
      </div>
    </div>
  );
};

export function Products() {
  const { language } = useLanguage();
  const t = language === 'en' ? en : id;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(t.products.allCats);
  const [selectedPrice, setSelectedPrice] = useState(t.products.allPrices);

  const [dbCategories, setDbCategories] = useState<{id: number; name: string}[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setProducts(data);
      })
      .catch(console.error);
      
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDbCategories(data);
      })
      .catch(console.error);
  }, []);

  const defaultProducts = [
    {
      id: 1,
      title: "FinDash Pro",
      categories: ["Dashboard", "Tracker"],
      description: "Automated financial dashboard for SaaS startups. Track MRR, Churn, and LTV automatically.",
      price: "$149",
      features: ["Automated Stripe Integration", "P&L Statement Generator", "Cash Flow Forecasting", "One-click PDF Export"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      images: [],
    },
    {
      id: 2,
      title: "Agency Project Manager",
      categories: ["Dashboard"],
      description: "Keep your team aligned with this advanced project tracking system. Includes Gantt charts, resource allocation, and client portals.",
      price: "$79",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      features: ["Interactive Gantt charts", "Team capacity planning", "Automated status reports", "Client-facing views"]
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const dynamicCategories = dbCategories.map(c => c.name);
  const categories = [t.products.allCats, ...(dynamicCategories.length > 0 ? dynamicCategories : ["Dashboard", "Template", "Tracker", "Web App", "Data Model"])];
  const priceRanges = [t.products.allPrices, t.products.under50, t.products.between50_100, t.products.above100];

  const filteredProducts = displayProducts.filter(p => {
    const catMatch = selectedCategory === t.products.allCats || (p.categories && p.categories.includes(selectedCategory));
    
    let priceMatch = true;
    const numPrice = parseFloat(p.price.replace(/[^0-9.]/g, ''));
    if (!isNaN(numPrice) && selectedPrice !== t.products.allPrices) {
      if (selectedPrice === t.products.under50) priceMatch = numPrice < 50;
      else if (selectedPrice === t.products.between50_100) priceMatch = numPrice >= 50 && numPrice <= 100;
      else if (selectedPrice === t.products.above100) priceMatch = numPrice > 100;
    }
    
    return catMatch && priceMatch;
  });

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-10 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 mb-4 md:mb-6">{t.products.title}</h1>
        <p className="text-sm md:text-base lg:text-lg text-zinc-600 px-4 md:px-0">
          {t.products.desc}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 bg-gray-50 p-2 rounded-2xl md:rounded-[20px] shadow-sm border border-gray-100">
        <div className="flex overflow-x-auto hide-scrollbar w-full lg:w-auto p-1 gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-white text-black shadow-sm ring-1 ring-gray-200"
                  : "text-zinc-500 hover:text-black hover:bg-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex w-full lg:w-auto p-1 items-center gap-2 border-t lg:border-t-0 lg:border-l border-gray-200 pt-3 lg:pt-0 lg:pl-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2 lg:ml-0">{t.products.priceLabel}</span>
          <select 
            className="bg-white border-none rounded-xl px-4 py-2.5 text-sm font-bold text-black focus:ring-2 focus:ring-primary/20 shadow-sm outline-none cursor-pointer"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            {priceRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <h3 className="text-xl font-bold text-zinc-400 mb-2">{t.products.noProducts}</h3>
          <p className="text-zinc-500">{t.products.tryAdjusting}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
