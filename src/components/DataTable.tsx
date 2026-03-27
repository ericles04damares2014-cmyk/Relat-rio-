import React, { useState, useMemo, useRef } from 'react';
import { 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Download,
  RefreshCw
} from 'lucide-react';
import { EquipmentData, SortConfig } from '../types';
import { cn } from '../lib/utils';
import * as htmlToImage from 'html-to-image';

interface DataTableProps {
  data: EquipmentData[];
  searchTerm: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, searchTerm }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const tableRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Dynamically determine columns based on data keys
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    
    // Get all unique keys from all rows (to handle sparse data)
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });

    const mandatoryKeys = [
      'Cód. Equip.',
      'Desc. Equip.',
      'Ano/OS',
      'Local',
      'Serviço',
      'Desc. Motivo',
      'Desc. Fazenda',
      'Dt. Abertura',
      'Destino'
    ];

    // Normalize keys for comparison (remove accents, dots, lowercase)
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.\/]/g, "").trim();
    
    const normalizedMandatory = mandatoryKeys.map(normalize);
    
    // Find which keys in the data match the mandatory ones
    const matchedMandatory: string[] = [];
    const remainingKeys = new Set(allKeys);

    mandatoryKeys.forEach((mKey, idx) => {
      const normM = normalizedMandatory[idx];
      const foundKey = Array.from(remainingKeys).find(k => normalize(k) === normM);
      if (foundKey) {
        matchedMandatory.push(foundKey);
        remainingKeys.delete(foundKey);
      }
    });

    // Combine them: matched mandatory first, then the rest
    const finalKeys = [
      ...matchedMandatory,
      ...Array.from(remainingKeys)
    ];

    return finalKeys.map(key => ({
      key: key as keyof EquipmentData,
      label: key
    }));
  }, [data]);

  const handleSort = (key: keyof EquipmentData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.values(item).some((val) => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const downloadTableImage = async () => {
    if (!exportRef.current) return;
    
    setIsDownloading(true);
    try {
      // A4 Landscape is 297mm x 210mm
      // At 96 DPI, that's 1123px x 794px
      // We'll use a fixed width to simulate landscape and let height grow if needed,
      // but styled to look like a document.
      
      const dataUrl = await htmlToImage.toPng(exportRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `Relatorio_88_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div 
        ref={tableRef}
        className="bg-white dark:bg-agro-dark-surface rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transition-colors duration-300"
      >
        <div className="overflow-auto flex-grow custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-full">
            <thead className="sticky top-0 z-10 bg-agro-gradient">
              {/* Merged Title Row */}
              <tr>
                <th 
                  colSpan={columns.length} 
                  className="px-6 py-3 text-center text-2xl font-black text-white uppercase tracking-[0.2em] border-b border-white/20 bg-agro-green/20"
                >
                  RELATORIO ATUALIZADO 88
                </th>
              </tr>
              {/* Column Headers Row */}
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th 
                    key={col.key}
                    className="px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors whitespace-nowrap"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortConfig.key === col.key ? (
                        sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-white" /> : <ArrowDown size={14} className="text-white" />
                      ) : (
                        <ArrowUpDown size={14} className="text-white/40" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sortedData.length > 0 ? (
                sortedData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={cn(
                      "hover:bg-agro-green/5 dark:hover:bg-agro-green/10 transition-colors group",
                      idx % 2 === 0 ? "bg-white dark:bg-agro-dark-surface" : "bg-slate-50/50 dark:bg-slate-800/30"
                    )}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-1 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-agro-dark-surface flex items-center justify-between transition-colors duration-300">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Exibindo todos os <span className="font-semibold text-slate-700 dark:text-slate-200">{sortedData.length}</span> registros na mesma página
          </div>
          
          <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Fim da listagem
          </div>
        </div>
      </div>

      {/* Action Button for Download */}
      <div className="flex justify-end">
        <button 
          onClick={downloadTableImage}
          disabled={isDownloading || data.length === 0}
          className="btn-gradient py-3 px-8 flex items-center gap-3 shadow-xl disabled:opacity-50"
        >
          {isDownloading ? (
            <RefreshCw className="animate-spin" size={20} />
          ) : (
            <ImageIcon size={20} />
          )}
          <span className="font-bold uppercase tracking-wider">Baixar Relatório A4 (Paisagem)</span>
        </button>
      </div>

      {/* Hidden Export Template (A4 Landscape Style) */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        <div 
          ref={exportRef}
          className="bg-white p-12 flex flex-col gap-8"
          style={{ width: '1500px', minHeight: '1060px' }} // Proportional to A4 Landscape
        >
          {/* Header */}
          <div className="flex justify-between items-end border-b-8 border-agro-orange pb-8">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-7xl font-black text-agro-green tracking-tighter mb-1">RELATÓRIO 88</h1>
                <p className="text-2xl text-slate-500 font-bold">Gestão de Equipamentos e Serviços</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl text-slate-700 font-black bg-slate-100 px-4 py-2 rounded-lg inline-block">
                Emissão: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-3xl overflow-hidden border-2 border-agro-green shadow-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-agro-green">
                  {columns.map((col) => (
                    <th 
                      key={col.key}
                      className="px-4 py-1 text-left text-[10px] font-black text-white uppercase tracking-wider border-r border-white/10 last:border-0"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-agro-green/5"}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-0.5 text-[10px] text-slate-800 font-bold border-r border-slate-100 last:border-0 whitespace-nowrap">
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
