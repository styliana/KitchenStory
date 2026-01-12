import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { uploadImageToSupabase } from '../services/imageService';

// Komponenty UI
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Stany formularza
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Stany techniczne
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Podgląd nowego avatara przed uploadem
  const fileInputRef = useRef(null);

  // 1. Pobierz obecne dane profilu
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Błąd pobierania profilu:', error);
      } else if (data) {
        setUsername(data.username || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  // Obsługa wyboru pliku
  const handleFileSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Tworzymy lokalny URL do podglądu (bez wysyłania na serwer)
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Zapisywanie zmian
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // Jeśli wybrano nowy plik, wyślij go do Storage
      if (selectedFile) {
        finalAvatarUrl = await uploadImageToSupabase(selectedFile);
      }

      const updates = {
        id: user.id,
        username,
        bio,
        avatar_url: finalAvatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        // Obsługa błędu unikalności nicku
        if (error.code === '23505') {
          alert('Ta nazwa użytkownika jest już zajęta. Wybierz inną.');
        } else {
          throw error;
        }
      } else {
        alert('Profil zaktualizowany! ✅');
        // Opcjonalnie: odśwież stronę lub przekieruj na profil
        navigate(`/chef/${user.id}`);
      }
    } catch (error) {
      console.error('Błąd zapisu:', error);
      alert('Wystąpił błąd podczas zapisywania profilu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 font-serif">Edytuj Profil</h2>
        <p className="text-gray-500 text-sm mt-2">Dostosuj to, jak widzą Cię inni kucharze.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-orange-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- SEKCJA AVATARA --- */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {/* Wyświetlamy podgląd (jeśli jest nowy) lub obecny avatar */}
              <img 
                src={previewUrl || avatarUrl || `https://ui-avatars.com/api/?name=${username}`} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-50 shadow-md group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold uppercase tracking-wider">Zmień</span>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-orange-600 font-bold hover:underline"
            >
              Wgraj nowe zdjęcie
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* --- POLA TEKSTOWE --- */}
          <div className="space-y-6">
            <Input
              label="Nazwa użytkownika (Nick)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="np. MistrzPatelni"
              required
              minLength={3}
            />
            
            <Textarea
              label="Bio (O mnie)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Napisz coś o sobie... np. Uwielbiam kuchnię włoską i eksperymenty z deserami."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-50">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate(`/chef/${user.id}`)}
            >
              Anuluj
            </Button>
            <Button 
              type="submit" 
              isLoading={saving}
              className="px-8 shadow-orange-200"
            >
              Zapisz zmiany
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}