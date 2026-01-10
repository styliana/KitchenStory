import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importy stron
import RecipeListPage from './pages/RecipeListPage';
import AddRecipePage from './pages/AddRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import AuthPage from './pages/AuthPage';
import MyRecipesPage from './pages/MyRecipesPage';

// Importy nowych komponentów UI
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';

// Komponent chroniący trasy (tylko dla zalogowanych)
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Podczas ładowania auth nie pokazujemy nic (lub spinner), żeby nie mignęło przekierowanie
  if (loading) return null; 

  return user ? children : null;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-orange-50/30 font-sans">
        
        {/* Nawigacja jako osobny komponent */}
        <NavBar />

        {/* Główna treść */}
        <main className="flex-grow w-full max-w-5xl mx-auto p-6">
          <Routes>
            {/* Trasy Publiczne */}
            <Route path="/" element={<RecipeListPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Trasy Chronione (Wymagają logowania) */}
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
          </Routes>
        </main>

        {/* Stopka jako osobny komponent */}
        <Footer />
        
      </div>
    </AuthProvider>
  );
}