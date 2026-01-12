import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="group">
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-600 flex items-center gap-2">
            <span className="text-3xl sm:text-4xl group-hover:rotate-12 transition-transform">🥘</span> 
            <span className="hidden sm:inline">KitchenStory</span>
            <span className="sm:hidden">KS</span>
          </h1>
        </Link>

        {/* NAWIGACJA */}
        <nav className="flex gap-3 sm:gap-6 items-center">
          {user ? (
            <>
              <Link to="/my-recipes" className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors hidden sm:block">
                Moje przepisy
              </Link>
              <Link to="/add" className="btn-primary text-sm flex items-center gap-2 px-4">
                <span>+</span> <span className="hidden sm:inline">Dodaj</span>
              </Link>
              
              <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                {/* Link do Profilu / Ustawień */}
                <Link to="/settings" className="flex items-center gap-2 group" title="Ustawienia profilu">
                   <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-800 group-hover:bg-orange-200 transition-colors">
                     {user.email[0].toUpperCase()}
                   </div>
                </Link>

                <button onClick={handleLogout} className="text-xs sm:text-sm text-gray-400 hover:text-red-500 transition-colors">
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