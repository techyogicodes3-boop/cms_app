'use client';
import React, { useState } from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import { CatalogueProvider } from "./layout/CatalogueContext";
import AuthGuard from "../../components/auth/AuthGuard";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard requiredRole="admin">
      <CatalogueProvider>
        <div className="min-h-screen bg-[#FFF9F3]">
          <div className="fixed left-0 top-0 z-30 hidden h-dvh lg:block">
            <Sidebar />
          </div>

          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-[#2B140E]/55 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close admin menu backdrop"
              />
              <div className="absolute left-0 top-0 h-dvh">
                <Sidebar onNavigate={() => setSidebarOpen(false)} onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          )}

          <div className="flex min-h-screen flex-col lg:ml-64">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-x-hidden p-3 sm:p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </CatalogueProvider>
    </AuthGuard>
  );
}
