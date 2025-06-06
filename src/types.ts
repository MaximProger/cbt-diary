export type IEntry = {
  id: number;
  created_at: string;
  created_by: string;
  worst_case: string;
  worst_consequences: string;
  what_can_i_do: string;
  how_will_i_cope: string;
};

export type IEntryCreate = Omit<IEntry, 'id'>;

export type IFormData = {
  worstCase: string;
  worstConsequences: string;
  whatCanIDo: string;
  howWillICope: string;
};

export type ISearchFormData = {
  search: string;
  sort: boolean;
};

export type IAuthFormData = {
  email: string;
};

export interface IToast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  message: string;
  duration?: number; // в миллисекундах, по умолчанию 5000
}
