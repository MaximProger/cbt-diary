export type IEntry = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  date: Date;
  worstCase: string;
  worstConsequences: string;
  whatCanIDo: string;
  howWillICope: string;
};

export type IFormData = {
  worstCase: string;
  worstConsequences: string;
  whatCanIDo: string;
  howWillICope: string;
};
