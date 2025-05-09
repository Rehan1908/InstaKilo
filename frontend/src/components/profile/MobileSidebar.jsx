import React from 'react'
import { Link } from 'react-router-dom'
import { X, Menu, Home, Search, PlusSquare, Film, User } from 'lucide-react'

const MobileSidebar = ({ isOpen, toggle, user }) => {
  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggle}
          className="p-2 rounded-full bg-white shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="flex flex-col p-5">
          <div className="py-6">
            <h2 className="text-xl font-bold mb-6">Instakilo</h2>
            <nav className="space-y-6">
              <Link to="/" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <Home size={24} />
                <span>Home</span>
              </Link>
              <Link to="/explore" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <Search size={24} />
                <span>Search</span>
              </Link>
              <Link to="/create" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <PlusSquare size={24} />
                <span>Create</span>
              </Link>
              <Link to="/reels" className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <Film size={24} />
                <span>Reels</span>
              </Link>
              <Link to={`/profile/${user?.username}`} className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-md">
                <User size={24} />
                <span>Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggle}
        />
      )}
    </>
  )
}

export default MobileSidebar