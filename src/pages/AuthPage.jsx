import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Przełącznik: Logowanie czy Rejestracja
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/'); // Po sukcesie idź na główną
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        alert('Konto utworzone! Możesz się teraz zalogować.');
        setIsLogin(true); // Przełącz na logowanie
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-orange-100">
        <h2 className="text-3xl font-bold text-center mb-6 font-serif">
          {isLogin ? 'Witaj w kuchni! 👋' : 'Dołącz do nas! 📝'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-kitchen w-full p-3"
              placeholder="twoj@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Hasło</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-kitchen w-full p-3"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3 text-lg"
          >
            {loading ? 'Przetwarzanie...' : (isLogin ? 'Zaloguj się' : 'Zarejestruj się')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 hover:underline font-bold"
          >
            {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
          </button>
        </div>
      </div>
    </div>
  );
}