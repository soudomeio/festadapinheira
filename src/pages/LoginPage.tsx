import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PineLogo from '@/components/PineLogo';

interface LoginPageProps {
  onGoToRegister: () => void;
}

export default function LoginPage({ onGoToRegister }: LoginPageProps) {
  const { login } = useAuth();
  const [nick, setNick] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(nick, senha);
      if (!success) {
        setError('Nick ou senha incorretos');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#1a202c] flex flex-col items-center justify-center px-6">
      <PineLogo />

      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-10 space-y-4">
        <div>
          <label className="block text-[#a0aec0] text-sm font-medium mb-1.5">
            Nick do Casal
          </label>
          <input
            type="text"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="Ex: CasalPinheira"
            className="w-full bg-[#2d3748] text-white rounded-xl px-4 py-3.5 outline-none border border-[#4a5568] focus:border-[#ecc94b] transition-colors placeholder:text-[#4a5568]"
          />
        </div>

        <div>
          <label className="block text-[#a0aec0] text-sm font-medium mb-1.5">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              className="w-full bg-[#2d3748] text-white rounded-xl px-4 py-3.5 pr-12 outline-none border border-[#4a5568] focus:border-[#ecc94b] transition-colors placeholder:text-[#4a5568]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-[#f56565] text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !nick || !senha}
          className="w-full bg-[#ecc94b] text-[#1a202c] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d4b43f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#1a202c] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={20} />
              Entrar
            </>
          )}
        </button>
      </form>

      <p className="text-[#a0aec0] text-sm mt-6">
        Ainda não tem conta?{' '}
        <button onClick={onGoToRegister} className="text-[#ecc94b] font-medium hover:underline">
          Cadastre-se
        </button>
      </p>

      <p className="text-[#4a5568] text-xs mt-8 text-center max-w-xs">
        Este aplicativo é destinado a maiores de 18 anos.
      </p>
    </div>
  );
}
