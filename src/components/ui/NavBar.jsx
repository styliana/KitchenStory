import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b-4 border-orange-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="group">
          <h1 className="text-3xl font-bold text-orange-600 flex items-center gap-2">
            <span className="text-4xl group-hover:rotate-12 transition-transform">🥘</span> 
            KitchenStory
          </h1>
          <p className="text-xs text-gray-500 font-sans tracking-wider uppercase ml-12">Community Cookbook</p>
        </Link>

        {/* NAWIGACJA */}
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/my-recipes" className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">
                Moje przepisy
              </Link>
              <Link to="/add" className="btn-primary text-sm flex items-center gap-2">
                <span>+</span> Dodaj
              </Link>
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-orange-800 font-bold">
                  {user.email?.split('@')[0]}
                </span>
                <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                  Wyloguj
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn-primary text-sm shadow-orange-200">
              Zaloguj się
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}