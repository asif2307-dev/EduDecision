import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[#f1f4f8] text-slate-800 overflow-hidden font-sans">
      {/* Left Institutional Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
