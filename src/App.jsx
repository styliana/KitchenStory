import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import RecipeListPage from './pages/RecipeListPage';
import AddRecipePage from './pages/AddRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import AuthPage from './pages/AuthPage'; // Nowy import
import { AuthProvider, useAuth } from './context/AuthContext'; // Nowy import

// Mały komponent pomocniczy do nagłówka
function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="flex gap-4 items-center">
      {user ? (
        <>
          <span className="text-xs text-orange-800 font-bold bg-orange-100 px-3 py-1 rounded-full">
            👤 {user.email.split('@')[0]}
          </span>
          <Link to="/add" className="btn-primary text-sm flex items-center gap-2">
            <span>+</span> Dodaj
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-orange-600">
            Wyloguj
          </button>
        </>
      ) : (
        <>
          <Link to="/auth" className="btn-primary text-sm shadow-orange-200">
            Zaloguj się
          </Link>
        </>
      )}
    </nav>
  );
}

// Komponent chroniący trasę (dla /add)
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  return user ? children : null;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-orange-50/30">
        <header className="bg-white shadow-sm border-b-4 border-orange-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="group">
              <h1 className="text-3xl font-bold text-orange-600 flex items-center gap-2">
                <span className="text-4xl group-hover:rotate-12 transition-transform">🥘</span> 
                KitchenStory
              </h1>
              <p className="text-xs text-gray-500 font-sans tracking-wider uppercase ml-12">Community Cookbook</p>
            </Link>

            <NavBar />
          </div>
        </header>

        <main className="flex-grow max-w-5xl mx-auto w-full p-6">
          <Routes>
            <Route path="/" element={<RecipeListPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Chroniona trasa - tylko dla zalogowanych */}
            <Route path="/add" element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <footer className="text-center py-8 text-orange-800/60 text-sm">
          &copy; {new Date().getFullYear()} KitchenStory. Gotowane z pasją.
        </footer>
      </div>
    </AuthProvider>
  );
}