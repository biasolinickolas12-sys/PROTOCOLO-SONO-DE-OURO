import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  Moon, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  BookOpen,
  Home,
  Sparkles,
  Lock
} from "lucide-react";
import { CHAPTERS } from "./data/chapters";
import { Reader } from "./components/Reader";
import { EmailGate } from "./components/EmailGate";
import { AppSettings } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "reader">("home");
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("sono_ouro_email"));
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [pendingChapter, setPendingChapter] = useState<number | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 18,
    isDarkMode: true,
    isToolbarVisible: true,
  });

  const CHAPTER_CARDS = [
    {
      title: "O CREPÚSCULO ARTIFICIAL",
      desc: "Entenda como a luz azul sequestra sua melatonina e mantém o cérebro em alerta máximo, sabotando sua biologia."
    },
    {
      title: "O RITUAL DE DESCONEXÃO",
      desc: "Técnica de esvaziamento mental para silenciar pensamentos e desligar a ansiedade antes de tocar o travesseiro."
    },
    {
      title: "O SANTUÁRIO DO SONO",
      desc: "Ajuste temperatura, som e luz para transformar seu quarto em uma verdadeira caverna de recuperação biológica."
    },
    {
      title: "A QUÍMICA DA NOITE",
      desc: "Domine suplementos naturais e janelas estratégicas para desarmar o estresse e otimizar sua química interna."
    },
    {
      title: "O DESPERTAR DE ELITE",
      desc: "Hackeie sua manhã com luz e hidratação para disparar o pico de energia natural e eliminar o cansaço crônico."
    }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentPage === "reader") {
        if (e.key === "ArrowRight") nextChapter();
        if (e.key === "ArrowLeft") prevChapter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, currentChapterIndex]);

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const adjustFontSize = (delta: number) => {
    setSettings(prev => ({ 
      ...prev, 
      fontSize: Math.max(12, Math.min(32, prev.fontSize + delta)) 
    }));
  };

  const toggleToolbar = () => {
    setSettings(prev => ({ ...prev, isToolbarVisible: !prev.isToolbarVisible }));
  };

  const nextChapter = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const startReading = (chapterIndex: number = 0) => {
    if (!userEmail) {
      setPendingChapter(chapterIndex);
      setIsGateOpen(true);
      return;
    }
    setCurrentChapterIndex(chapterIndex);
    setCurrentPage("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGateSuccess = (email: string) => {
    localStorage.setItem("sono_ouro_email", email);
    setUserEmail(email);
    setIsGateOpen(false);
    if (pendingChapter !== null) {
      setCurrentChapterIndex(pendingChapter);
      setCurrentPage("reader");
      setPendingChapter(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToHome = () => {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      settings.isDarkMode ? "bg-bg-main text-[#E2E8F0]" : "bg-orange-50 text-slate-900 theme-light"
    }`}>
      
      {/* Navigation / Toolbar */}
      <AnimatePresence>
        {settings.isToolbarVisible && (
          <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl border-b ${
              settings.isDarkMode ? "bg-bg-main/90 border-border-dark" : "bg-white/80 border-orange-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={goToHome}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 group ${
                  settings.isDarkMode ? "hover:bg-gold-accent/10" : "hover:bg-orange-500/10"
                }`}
              >
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                  settings.isDarkMode ? "border-gold-accent group-hover:bg-gold-accent/20" : "border-orange-600 group-hover:bg-orange-600/20"
                }`}>
                  <Home size={16} className={settings.isDarkMode ? "text-gold-accent" : "text-orange-600"} />
                </div>
                <span className={`hidden sm:inline font-serif text-lg tracking-wide ${
                  settings.isDarkMode ? "text-gold-accent" : "text-orange-600"
                }`}>Sono de Ouro</span>
              </button>
              
              {currentPage === "reader" && (
                <div className={`hidden md:flex items-center gap-2 px-4 py-1 rounded border text-xs tracking-widest uppercase font-medium ${
                  settings.isDarkMode ? "border-border-dark text-text-dim" : "border-orange-200 text-orange-700"
                }`}>
                  {currentChapterIndex === 0 ? "INTRODUÇÃO" : `Capítulo ${CHAPTERS[currentChapterIndex].id.toString().padStart(2, '0')}`}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Font Controls */}
              <div className={`flex items-center gap-1 rounded-lg border p-0.5 ${
                settings.isDarkMode ? "bg-border-dark/50 border-border-dark" : "bg-orange-100/50 border-orange-200"
              }`}>
                <button 
                  onClick={() => adjustFontSize(-2)}
                  className={`p-2 rounded transition-colors ${
                    settings.isDarkMode ? "hover:bg-gold-accent/10 text-text-dim hover:text-gold-accent" : "hover:bg-orange-500/20 text-orange-800"
                  }`}
                  title="Diminuir texto"
                >
                  <Minus size={16} />
                </button>
                <div className="w-8 text-center font-mono text-[10px] uppercase opacity-40">
                  {settings.fontSize}px
                </div>
                <button 
                  onClick={() => adjustFontSize(2)}
                  className={`p-2 rounded transition-colors ${
                    settings.isDarkMode ? "hover:bg-gold-accent/10 text-text-dim hover:text-gold-accent" : "hover:bg-orange-500/20 text-orange-800"
                  }`}
                  title="Aumentar texto"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 border rounded-lg transition-all ${
                  settings.isDarkMode 
                    ? "border-border-dark hover:border-gold-accent hover:text-gold-accent" 
                    : "border-orange-200 hover:border-orange-600 hover:text-orange-600"
                }`}
                title={settings.isDarkMode ? "Modo Claro" : "Modo Escuro"}
              >
                {settings.isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Hide Toolbar Toggle */}
              <button 
                onClick={toggleToolbar}
                className={`p-2 border rounded-lg transition-all ${
                  settings.isDarkMode 
                    ? "border-gold-accent text-gold-accent hover:bg-gold-accent/10" 
                    : "border-orange-600 text-orange-600 hover:bg-orange-600/10"
                }`}
                title="Esconder barra"
              >
                <EyeOff size={18} />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating Show Toolbar Button (when hidden) */}
      <AnimatePresence>
        {!settings.isToolbarVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleToolbar}
            className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-transform hover:scale-110 ${
              settings.isDarkMode 
                ? "bg-gold-accent text-bg-main shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                : "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]"
            }`}
          >
            <Eye size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <main className={`pt-24 pb-32 px-6 overflow-hidden`}>
        <AnimatePresence mode="wait">
          {currentPage === "home" ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto flex flex-col items-center text-center"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-6 mt-4"
              >
                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full border-2 flex items-center justify-center relative transition-all duration-500 ${
                  settings.isDarkMode 
                    ? "border-gold-accent shadow-[0_0_30px_rgba(212,175,55,0.5),inset_0_0_15px_rgba(212,175,55,0.3)]" 
                    : "border-orange-600 shadow-[0_0_30px_rgba(234,88,12,0.5),inset_0_0_15px_rgba(234,88,12,0.3)]"
                }`}>
                   <div className={`absolute inset-0 rounded-full animate-pulse ${
                     settings.isDarkMode ? "bg-gold-accent/5" : "bg-orange-600/5"
                   }`} />
                   <img 
                     src="/Captura de tela 2026-06-05 131524.png" 
                     alt="Protoclo Sono de Ouro"
                     className="w-full h-full rounded-full object-cover relative z-10"
                     referrerPolicy="no-referrer"
                   />
                </div>
              </motion.div>

              <h1 className={`text-5xl md:text-7xl font-serif tracking-tight mb-4 leading-tight ${
                settings.isDarkMode ? "text-gold-accent" : "text-orange-600"
              }`}>
                O Protocolo <br/> <span className="italic">Sono de Ouro</span>
              </h1>
              
              <p className={`text-lg md:text-xl mb-8 max-w-2xl leading-relaxed tracking-wide ${
                settings.isDarkMode ? "text-text-dim" : "text-slate-600"
              }`}>
                Desligue a mente acelerada e acorde com energia máxima. 
                Sua jornada para o descanso de elite começa aqui.
              </p>

              <button 
                onClick={() => startReading(0)}
                className={`group relative flex items-center gap-4 px-12 py-6 rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 mb-16 focus:ring-4 ${
                  settings.isDarkMode 
                    ? "bg-gold-accent text-bg-main shadow-[0_0_30px_rgba(212,175,55,0.4)] focus:ring-gold-accent/20" 
                    : "bg-orange-600 text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] focus:ring-orange-600/20"
                }`}
              >
                <BookOpen size={24} />
                INTRODUÇÃO
                <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
                {CHAPTER_CARDS.map((card, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                    onClick={() => startReading(i + 1)}
                    className={`p-8 rounded-xl border-4 transition-all cursor-pointer group ${
                      settings.isDarkMode 
                        ? "bg-bg-sidebar/50 border-gold-accent shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]" 
                        : "bg-white border-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.15)] hover:shadow-[0_0_30px_rgba(234,88,12,0.3)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[10px] tracking-[0.3em] font-medium uppercase ${
                        settings.isDarkMode ? "text-gold-accent" : "text-orange-700 font-bold"
                      }`}>
                        Capítulo 0{i + 1}
                      </span>
                      <div className={`flex-1 h-px ${settings.isDarkMode ? "bg-border-dark/50" : "bg-orange-200"}`} />
                    </div>
                    <h3 className={`text-lg font-serif mb-4 group-hover:translate-x-1 transition-transform ${
                      settings.isDarkMode ? "text-gold-accent" : "text-orange-800"
                    }`}>
                      {card.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${settings.isDarkMode ? "text-text-dim" : "text-slate-600"}`}>
                      {card.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto relative px-4 md:px-0"
            >
              <Reader 
                chapter={CHAPTERS[currentChapterIndex]} 
                fontSize={settings.fontSize} 
                isDarkMode={settings.isDarkMode} 
              />

              {/* Navigation Buttons */}
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-6 mt-24 border-t pt-12 pb-12 ${
                settings.isDarkMode ? "border-border-dark" : "border-orange-200"
              }`}>
                <button 
                  onClick={prevChapter}
                  disabled={currentChapterIndex === 0}
                  className={`flex items-center justify-center gap-3 px-6 py-3 min-w-[140px] rounded border transition-all ${
                    currentChapterIndex === 0 
                      ? "opacity-10 pointer-events-none" 
                      : settings.isDarkMode 
                        ? "border-border-dark hover:border-gold-accent text-text-dim hover:text-gold-accent" 
                        : "border-orange-200 hover:border-orange-600 text-orange-700 hover:text-orange-800"
                  }`}
                >
                  <ChevronLeft size={18} />
                  <span className="text-xs tracking-widest uppercase font-bold">Anterior</span>
                </button>

                <div className={`text-[10px] tracking-[0.3em] font-medium uppercase text-center ${
                  settings.isDarkMode ? "text-text-muted" : "text-orange-500"
                }`}>
                  {currentChapterIndex === 0 ? "INTRODUÇÃO" : `${currentChapterIndex} de ${CHAPTERS.length - 1}`}
                </div>

                <button 
                  onClick={nextChapter}
                  disabled={currentChapterIndex === CHAPTERS.length - 1}
                  className={`flex items-center justify-center gap-3 px-6 py-3 min-w-[140px] rounded border transition-all ${
                    currentChapterIndex === CHAPTERS.length - 1 
                      ? "opacity-10 pointer-events-none" 
                      : settings.isDarkMode 
                        ? "border-border-dark hover:border-gold-accent text-text-dim hover:text-gold-accent" 
                        : "border-orange-200 hover:border-orange-600 text-orange-700 hover:text-orange-800"
                  }`}
                >
                  <span className="text-xs tracking-widest uppercase font-bold">Próximo</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isGateOpen && (
          <EmailGate 
            isDarkMode={settings.isDarkMode} 
            onSuccess={handleGateSuccess} 
            onClose={() => setIsGateOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Footer / Progress Bar */}
      {currentPage === "reader" && (
        <div className={`fixed bottom-0 left-0 right-0 h-1 ${settings.isDarkMode ? "bg-border-dark" : "bg-orange-100"}`}>
          <motion.div 
            className={`h-full ${
              settings.isDarkMode ? "bg-gold-accent shadow-[0_0_10px_rgba(212,175,55,0.5)]" : "bg-orange-600"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentChapterIndex + 1) / CHAPTERS.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
