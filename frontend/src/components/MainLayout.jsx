import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { Menu, X } from 'lucide-react'

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md"
        onClick={toggleMobileMenu}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Left Sidebar */}
      <div 
        className={`fixed md:relative z-40 h-full bg-white border-r border-gray-200 w-64 transition-transform duration-300 ease-in-out
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <LeftSidebar />
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 transition-all duration-300 ml-0 md:-ml-40">
        <main className="max-w-4xl mx-auto px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout