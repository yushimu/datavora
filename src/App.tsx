/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { Services } from "./pages/Services";
import { Portfolio } from "./pages/Portfolio";
import { Testimonials } from "./pages/Testimonials";
import { Contact } from "./pages/Contact";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Login } from "./pages/admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { ProductsAdmin } from "./pages/admin/ProductsAdmin";
import { PortfolioAdmin } from "./pages/admin/PortfolioAdmin";
import { ServicesAdmin } from "./pages/admin/ServicesAdmin";
import { ServiceGalleryAdmin } from "./pages/admin/ServiceGalleryAdmin";
import { TestimonialsAdmin } from "./pages/admin/TestimonialsAdmin";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        {/* Public Routes with Main Layout */}
        <Route path="/" element={<Layout><PageWrapper><Home /></PageWrapper></Layout>} />
        <Route path="/products" element={<Layout><PageWrapper><Products /></PageWrapper></Layout>} />
        <Route path="/services" element={<Layout><PageWrapper><Services /></PageWrapper></Layout>} />
        <Route path="/portfolio" element={<Layout><PageWrapper><Portfolio /></PageWrapper></Layout>} />
        <Route path="/testimonials" element={<Layout><PageWrapper><Testimonials /></PageWrapper></Layout>} />
        <Route path="/contact" element={<Layout><PageWrapper><Contact /></PageWrapper></Layout>} />

        {/* Admin Routes without Main Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="service-gallery" element={<ServiceGalleryAdmin />} />
          <Route path="portfolio" element={<PortfolioAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
