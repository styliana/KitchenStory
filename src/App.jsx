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
import SettingsPage from './pages/SettingsPage'; // <--- NOWY IMPORT

// UI
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';
import Loader from './components/ui/Loader';

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
      <div className="min-h-screen flex flex-col bg-orange-50/30 font-sans text-gray-800">
        <NavBar />

        <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<RecipeListPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            <Route path="/chef/:id" element={<ChefProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* TRASY CHRONIONE */}
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
            
            {/* NOWA TRASA */}
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