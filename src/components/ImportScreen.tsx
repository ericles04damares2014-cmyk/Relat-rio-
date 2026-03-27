import React, { useRef } from 'react';
import * as XLSX from 'xlsx';
import { FileUp, UploadCloud, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { EquipmentData } from '../types';

interface ImportScreenProps {
  onDataImported: (data: EquipmentData[]) => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

export const ImportScreen: React.FC<ImportScreenProps> = ({ onDataImported, toggleTheme, theme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const rawData = XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[];
      
      const formattedData = rawData.map(row => {
        const newRow = { ...row };
        Object.keys(newRow).forEach(key => {
          const val = newRow[key];
          
          // If it's a Date object (from cellDates: true), format it strictly
          if (val instanceof Date) {
            const day = String(val.getDate()).padStart(2, '0');
            const month = String(val.getMonth() + 1).padStart(2, '0');
            const year = val.getFullYear();
            const hours = String(val.getHours()).padStart(2, '0');
            const minutes = String(val.getMinutes()).padStart(2, '0');
            const seconds = String(val.getSeconds()).padStart(2, '0');
            newRow[key] = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
          }
        });
        return newRow;
      });
      
      onDataImported(formattedData as EquipmentData[]);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-report-gradient flex items-center justify-center p-6 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 transition-all duration-500"
      >
        <div className="p-16 md:p-24 text-center relative">
          <button 
            onClick={toggleTheme}
            className="absolute top-6 right-6 p-3 rounded-full bg-agro-green/10 text-agro-green hover:bg-agro-green/20 transition-colors"
            title="Mudar Tema"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="mb-12">
            <h1 className="text-5xl font-black text-agro-green tracking-tighter">RELATÓRIO 88</h1>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            className="hidden"
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-agro-orange text-white font-black flex items-center justify-center gap-4 mx-auto text-2xl px-16 py-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 group w-full max-w-sm"
          >
            <FileUp size={32} className="group-hover:animate-bounce" />
            IMPORTAR PLANILHA
          </button>
        </div>
      </motion.div>
    </div>
  );
};
