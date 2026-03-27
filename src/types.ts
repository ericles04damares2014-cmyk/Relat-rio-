export interface EquipmentData {
  'Cód. Equip.': string | number;
  'Desc. Equip.': string;
  'Ano/OS': string | number;
  'Local': string;
  'Serviço': string;
  'Desc. Motivo': string;
  'Desc. Fazenda': string;
  'Dt. Abertura': string;
  'Destino': string;
  [key: string]: any;
}

export type SortConfig = {
  key: keyof EquipmentData | null;
  direction: 'asc' | 'desc';
};
