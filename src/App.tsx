import { useState, useEffect } from 'react';
import { DataTable } from './components/DataTable';
import { ImportScreen } from './components/ImportScreen';
import { EquipmentData } from './types';
import { Search, User, FileUp, RefreshCw, Truck, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<EquipmentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImported, setIsImported] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleDataImported = (importedData: EquipmentData[]) => {
    setData(importedData);
    setIsImported(true);
  };

  const handleReset = () => {
    setData([]);
    setIsImported(false);
    setSearchTerm('');
  };

  if (!isImported) {
    return <ImportScreen onDataImported={handleDataImported} toggleTheme={toggleTheme} theme={theme} />;
  }

  return (
    <div className="min-h-screen bg-agro-light dark:bg-agro-dark flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-agro-dark-surface border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-6 flex-grow max-w-3xl">
          <div className="flex items-center gap-3">
            <h1 className="font-black text-slate-800 dark:text-white text-2xl tracking-tighter">RELATÓRIO 88</h1>
          </div>
          
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-agro-green transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por equipamento, serviço, destino..." 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-agro-green/20 transition-all outline-none dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-8">
          <button 
            onClick={toggleTheme}
            className="btn-theme"
            title="Mudar Tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-xs uppercase tracking-widest">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-slate-500 hover:text-agro-green transition-colors px-3 py-2 rounded-lg hover:bg-agro-green/5"
            title="Nova Importação"
          >
            <RefreshCw size={20} />
            <span className="text-sm font-semibold">Novo Upload</span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />
          
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">Gestor Agro</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-agro-green/10 border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-agro-green">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-8 flex-grow flex flex-col max-w-[1600px] mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key="dashboard-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full gap-4"
          >
            {/* Stats / Info Bar */}
            <div className="flex items-center justify-between mb-2">
              <div className="bg-white dark:bg-agro-dark-surface px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-start transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-agro-green animate-pulse" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{data.length} Registros</span>
                </div>
                {data.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-bold uppercase ml-4">
                    {Object.keys(data[0]).length} Colunas Detectadas
                  </span>
                )}
              </div>
              
              <button className="btn-gradient py-2.5 px-6 text-sm flex items-center gap-2">
                <FileUp size={18} />
                Exportar Relatório
              </button>
            </div>

            {/* Table Container */}
            <div className="flex-grow overflow-hidden">
              <DataTable data={data} searchTerm={searchTerm} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
