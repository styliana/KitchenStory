import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input'; // <--- Nowy import
import Button from '../components/ui/Button'; // <--- Nowy import

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
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
        navigate('/');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        alert('Konto utworzone! Możesz się teraz zalogować.');
        setIsLogin(true);
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
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Adres Email"
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.com"
          />
          
          <Input 
            label="Hasło"
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
          />

          <Button 
            type="submit" 
            isLoading={loading}
            className="w-full"
            variant="primary"
          >
            {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Button 
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
          </Button>
        </div>
      </div>
    </div>
  );
}