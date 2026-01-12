import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importy Stron
import RecipeListPage from './pages/RecipeListPage';
import AddRecipePage from './pages/AddRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import AuthPage from './pages/AuthPage';
import MyRecipesPage from './pages/MyRecipesPage';
import ChefProfilePage from './pages/ChefProfilePage';
import SettingsPage from './pages/SettingsPage';

// Importy Komponentów UI
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';
import Loader from './components/ui/Loader';

// Guard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>; 

  return user ? children : null;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node
};

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50/50 font-sans text-gray-800 selection:bg-orange-100 selection:text-orange-900">
        
        <NavBar />

        {/* ZMIANA: Szerszy kontener (max-w-7xl) i większy padding (py-12) */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            {/* PUBLICZNE */}
            <Route path="/" element={<RecipeListPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            <Route path="/chef/:id" element={<ChefProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* PRYWATNE */}
            <Route path="/add" element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            } />
            
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            } />
            
            <Route path="/my-recipes" element={
              <ProtectedRoute>
                <MyRecipesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </AuthProvider>
  );
}