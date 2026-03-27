import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  Truck, 
  MapPin, 
  Calendar,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-agro-gradient flex items-center justify-center text-white shadow-md">
          <Truck size={24} />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 leading-tight">AgroDash</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Gestão Rural</p>
        </div>
      </div>

      <nav className="flex-grow px-4 space-y-1 mt-4">
        <a href="#" className="sidebar-item sidebar-item-active">
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </a>
        <a href="#" className="sidebar-item">
          <FileSpreadsheet size={20} />
          <span className="font-medium">Relatórios</span>
        </a>
        <a href="#" className="sidebar-item">
          <MapPin size={20} />
          <span className="font-medium">Campos</span>
        </a>
        <a href="#" className="sidebar-item">
          <Calendar size={20} />
          <span className="font-medium">Cronograma</span>
        </a>
        
        <div className="pt-8 pb-2 px-4">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sistema</p>
        </div>
        
        <a href="#" className="sidebar-item">
          <Settings size={20} />
          <span className="font-medium">Configurações</span>
        </a>
        <a href="#" className="sidebar-item">
          <HelpCircle size={20} />
          <span className="font-medium">Suporte</span>
        </a>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};
