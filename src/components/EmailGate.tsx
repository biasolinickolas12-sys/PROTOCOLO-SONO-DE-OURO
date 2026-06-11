import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowRight, X } from "lucide-react";

interface EmailGateProps {
  onSuccess: (email: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export function EmailGate({ onSuccess, onClose, isDarkMode }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return;
    }
    onSuccess(email);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`w-full max-w-md p-8 rounded-2xl border-2 shadow-2xl relative ${
          isDarkMode 
            ? "bg-bg-sidebar border-gold-accent/30 text-white" 
            : "bg-white border-orange-600 text-slate-900"
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X size={20} />
        </button>

        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto ${
          isDarkMode ? "bg-gold-accent/10 text-gold-accent" : "bg-orange-100 text-orange-600"
        }`}>
          <Mail size={32} />
        </div>

        <h2 className="text-2xl font-serif text-center mb-2 tracking-tight">Acesso ao Protocolo</h2>
        <p className={`text-center mb-8 text-sm leading-relaxed ${isDarkMode ? "text-text-dim" : "text-slate-600"}`}>
          Insira seu e-mail para desbloquear o guia completo e iniciar sua jornada para o descanso de elite.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                isDarkMode 
                  ? "bg-bg-main/50 border-border-dark focus:border-gold-accent text-white" 
                  : "bg-orange-50 border-orange-200 focus:border-orange-600 text-slate-900"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${
              isDarkMode 
                ? "bg-gold-accent text-bg-main" 
                : "bg-orange-600 text-white"
            }`}
          >
            DESBLOQUEAR ACESSO
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-[10px] text-center opacity-40 uppercase tracking-widest">
          Sua privacidade é prioridade. Não enviamos spam.
        </p>
      </motion.div>
    </motion.div>
  );
}
