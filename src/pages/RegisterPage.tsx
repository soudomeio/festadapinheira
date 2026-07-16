import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Camera, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PREFERENCES } from '@/data/mockData';
import PineLogo from '@/components/PineLogo';

interface RegisterPageProps {
  onGoToLogin: () => void;
}

export default function RegisterPage({ onGoToLogin }: RegisterPageProps) {
  const { register, registeredUsers } = useAuth();
  const [step, setStep] = useState(1);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nick: '',
    nomeDele: '',
    nomeDela: '',
    cidade: '',
    senha: '',
    fotos: [] as string[],
    preferencias: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.nick.trim()) errs.nick = 'Nick é obrigatório';
    else if (registeredUsers.some(u => u.nick.toLowerCase() === formData.nick.toLowerCase())) {
      errs.nick = 'Este nick já existe';
    }
    if (!formData.nomeDele.trim()) errs.nomeDele = 'Nome dele é obrigatório';
    if (!formData.nomeDela.trim()) errs.nomeDela = 'Nome dela é obrigatória';
    if (!formData.cidade.trim()) errs.cidade = 'Cidade é obrigatória';
    if (!formData.senha || formData.senha.length < 4) errs.senha = 'Mínimo 4 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (formData.fotos.length === 0) errs.fotos = 'Adicione pelo menos 1 foto';
    if (formData.preferencias.length === 0) errs.preferencias = 'Selecione pelo menos 1 preferência';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setShowDisclaimer(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onGoToLogin();
  };

  const handleSubmit = () => {
    if (!acceptedTerms) return;
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: `user_${Date.now()}`,
        nick: formData.nick,
        nomeDele: formData.nomeDele,
        nomeDela: formData.nomeDela,
        cidade: formData.cidade,
        preferencias: formData.preferencias,
        fotos: formData.fotos,
        bio: '',
        idadeDele: 30,
        idadeDela: 28,
        online: true,
      };
      register(newUser, formData.senha);
      setLoading(false);
    }, 1000);
  };

  const togglePreference = (id: string) => {
    setFormData(prev => ({
      ...prev,
      preferencias: prev.preferencias.includes(id)
        ? prev.preferencias.filter(p => p !== id)
        : [...prev.preferencias, id],
    }));
  };

  const addPhoto = () => {
    // Simulate photo upload with random couple images
    const randomPhotos = [
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    ];
    const randomPhoto = randomPhotos[Math.floor(Math.random() * randomPhotos.length)];
    if (formData.fotos.length < 6) {
      setFormData(prev => ({ ...prev, fotos: [...prev.fotos, randomPhoto] }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({ ...prev, fotos: prev.fotos.filter((_, i) => i !== index) }));
  };

  return (
    <div className="min-h-screen bg-[#1a202c] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={handleBack} className="text-[#a0aec0] hover:text-white p-1">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 flex justify-center">
          <PineLogo small />
        </div>
        <div className="w-8" />
      </div>

      {/* Progress */}
      <div className="flex gap-2 px-6 mt-2 mb-4">
        {[1, 2].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full bg-[#2d3748]">
            <div
              className="h-full rounded-full bg-[#ecc94b] transition-all duration-300"
              style={{ width: step >= i ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="text-white text-xl font-bold">Dados do Casal</h2>

            <div>
              <label className="block text-[#a0aec0] text-sm font-medium mb-1.5">Nick do Casal *</label>
              <input
                type="text"
                value={formData.nick}
                onChange={(e) => setFormData(prev => ({ ...prev, nick: e.target.value }))}
                placeholder="Ex: CasalAventura"
                className={`w-full bg-[#2d3748] text-white rounded-xl px-4 py-3 outline-none border ${
                  errors.nick ? 'border-[#f56565]' : 'border-[#4a5568] focus:border-[#ecc94b]'
                } transition-colors placeholder:text-[#4a5568]`}
              />
              {errors.nick && <p className="text-[#f56565] text-xs mt-1">{errors.nick}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a0aec0] text-sm font-medium mb-1.5">Nome Dele *</label>
                <input
                  type="text"
                  value={formData.nomeDele}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomeDele: e.target.value }))}
                  placeholder="Nome"
                  className={`w-full bg-[#2d3748] text-white rounded-xl px-4 py-3 outline-none border ${
                    errors.nomeDele ? 'border-[#f56565]' : 'border-[#4a5568] focus:border-[#ecc94b]'
                  } transition-colors placeholder:text-[#4a5568]`}
                />
                {errors.nomeDele && <p className="text-[#f56565] text-xs mt-1">{errors.nomeDele}</p>}
              </div>
              <div>
                <label className="block text-[#a0aec0] text-sm font-medium mb-1.5">Nome Dela *</label>
                <input
                  type="text"
                  value={formData.nomeDela}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomeDela: e.target.value }))}
                  placeholder="Nome"
                  className={`w-full bg-[#2d3748] text-white rounded-xl px-4 py-3 outline-none border ${
                    errors.nomeDela ? 'border-[#f56565]' : 'border-[#4a5568] focus:border-[#ecc94b]'
                  } transition-colors placeholder:text-[#4a5568]`}
                />
                {errors.nomeDela && <p className="text-[#f56565] text-xs mt-1">{errors.nomeDela}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[#a0aec0] text-sm font-medium mb-1.5">Cidade *</label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                placeholder="Sua cidade"
                className={`w-full bg-[#2d3748] text-white rounded-xl px-4 py-3 outline-none border ${
                  errors.cidade ? 'border-[#f56565]' : 'border-[#4a5568] focus:border-[#ecc94b]'
                } transition-colors placeholder:text-[#4a5568]`}
              />
              {errors.cidade && <p className="text-[#f56565] text-xs mt-1">{errors.cidade}</p>}
            </div>

            <div>
              <label className="block text-[#a0aec0] text-sm font-medium mb-1.5">Senha *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  placeholder="Mínimo 4 caracteres"
                  className={`w-full bg-[#2d3748] text-white rounded-xl px-4 py-3 pr-12 outline-none border ${
                    errors.senha ? 'border-[#f56565]' : 'border-[#4a5568] focus:border-[#ecc94b]'
                  } transition-colors placeholder:text-[#4a5568]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0aec0] hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.senha && <p className="text-[#f56565] text-xs mt-1">{errors.senha}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-white text-xl font-bold">Fotos e Preferências</h2>

            {/* Photos */}
            <div>
              <label className="block text-[#a0aec0] text-sm font-medium mb-2">
                Fotos do Casal * <span className="text-[#4a5568]">(máx. 6)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {formData.fotos.map((foto, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={foto} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-[#f56565] rounded-full flex items-center justify-center"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
                {formData.fotos.length < 6 && (
                  <button
                    onClick={addPhoto}
                    className="aspect-square rounded-xl border-2 border-dashed border-[#4a5568] flex flex-col items-center justify-center gap-1 hover:border-[#ecc94b] transition-colors"
                  >
                    <Camera size={24} className="text-[#4a5568]" />
                    <span className="text-[#4a5568] text-xs">Adicionar</span>
                  </button>
                )}
              </div>
              {errors.fotos && <p className="text-[#f56565] text-xs mt-1">{errors.fotos}</p>}
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-[#a0aec0] text-sm font-medium mb-2">
                Preferências * <span className="text-[#4a5568]">(marque todas que se aplicam)</span>
              </label>
              <div className="space-y-2">
                {PREFERENCES.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      formData.preferencias.includes(pref.id)
                        ? 'border-[#ecc94b] bg-[#ecc94b]/10'
                        : 'border-[#4a5568] bg-[#2d3748]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        formData.preferencias.includes(pref.id)
                          ? 'bg-[#ecc94b] border-[#ecc94b]'
                          : 'border-[#4a5568]'
                      }`}
                    >
                      {formData.preferencias.includes(pref.id) && <Check size={14} className="text-[#1a202c]" />}
                    </div>
                    <span className={`text-sm ${formData.preferencias.includes(pref.id) ? 'text-[#ecc94b]' : 'text-white'}`}>
                      {pref.label}
                    </span>
                  </button>
                ))}
              </div>
              {errors.preferencias && <p className="text-[#f56565] text-xs mt-1">{errors.preferencias}</p>}
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-[#ecc94b] text-[#1a202c] font-bold py-3.5 rounded-xl mt-6 hover:bg-[#d4b43f] transition-colors"
        >
          {step === 1 ? 'Continuar' : 'Finalizar Cadastro'}
        </button>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-6">
          <div className="bg-[#2d3748] rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#ecc94b]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">!</span>
              </div>
              <h3 className="text-white text-lg font-bold">Termos de Uso</h3>
            </div>

            <div className="bg-[#1a202c] rounded-xl p-4 max-h-48 overflow-y-auto">
              <p className="text-[#a0aec0] text-sm leading-relaxed">
                Este aplicativo é <strong className="text-white">meramente a fins de entretenimento</strong> e pode conter conteúdo adulto. Ao continuar, você declara que:
              </p>
              <ul className="text-[#a0aec0] text-sm mt-2 space-y-1 list-disc list-inside">
                <li>É maior de 18 anos</li>
                <li>Concorda com o compartilhamento de conteúdo adulto</li>
                <li>Respeitará todos os usuários da plataforma</li>
                <li>Não compartilhará dados de outros usuários</li>
                <li>Entende que este é um ambiente de diversão consensual</li>
              </ul>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  acceptedTerms ? 'bg-[#ecc94b] border-[#ecc94b]' : 'border-[#4a5568]'
                }`}
              >
                {acceptedTerms && <Check size={14} className="text-[#1a202c]" />}
              </div>
              <span className="text-[#a0aec0] text-sm">Li e aceito os termos de uso</span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={!acceptedTerms || loading}
              className="w-full bg-[#ecc94b] text-[#1a202c] font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4b43f] transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1a202c] border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Aceito e Quero Entrar'
              )}
            </button>

            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full text-[#a0aec0] text-sm py-2 hover:text-white"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
