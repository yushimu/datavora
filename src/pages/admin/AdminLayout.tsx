import { Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, Package, FolderGit2, LogOut, Briefcase, MessageSquare, Images, Settings } from "lucide-react";

export function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (!data.authenticated && location.pathname !== "/admin/login") {
        navigate("/admin/login");
      }
    } catch (e) {
      setIsAuthenticated(false);
      navigate("/admin/login");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    navigate("/admin/login");
  };

  if (isAuthenticated === null) return <div className="p-8 text-center">Loading...</div>;

  if (!isAuthenticated && location.pathname !== "/admin/login") {
    return null; // Will redirect in useEffect
  }

  if (!isAuthenticated && location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const navItemClass = (isActive: boolean) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
      isActive 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="flex h-screen bg-gray-50 text-black font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] text-white p-6 flex flex-col border-r border-white/10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0a0a0a] font-black text-xl leading-none">D</span>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">ADMIN</h2>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/admin" className={navItemClass(location.pathname === "/admin")}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link to="/admin/products" className={navItemClass(location.pathname.includes("/admin/products"))}>
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link to="/admin/services" className={navItemClass(location.pathname === "/admin/services")}>
            <Briefcase className="w-5 h-5" />
            Services
          </Link>
          <Link to="/admin/service-gallery" className={navItemClass(location.pathname.includes("/admin/service-gallery"))}>
            <Images className="w-5 h-5" />
            Service Gallery
          </Link>
          <Link to="/admin/portfolio" className={navItemClass(location.pathname.includes("/admin/portfolio"))}>
            <FolderGit2 className="w-5 h-5" />
            Portfolio
          </Link>
          <Link to="/admin/testimonials" className={navItemClass(location.pathname.includes("/admin/testimonials"))}>
            <MessageSquare className="w-5 h-5" />
            Testimonials
          </Link>
          <Link to="/admin/settings" className={navItemClass(location.pathname.includes("/admin/settings"))}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors mt-auto w-full text-left font-medium">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-8 lg:p-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
