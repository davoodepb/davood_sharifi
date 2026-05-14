export type ChecklistStatus = "pending" | "completed";

export interface LogisticsUser {
  id: string;
  name: string;
  phone: string;
  role: "admin" | "collaborator";
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  checklist_id: string;
  artigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  checked: boolean;
}

export interface Checklist {
  id: string;
  codigo_at: string;
  share_token: string;
  observacoes_renato: string;
  status: ChecklistStatus;
  created_at: string;
  items: ChecklistItem[];
}

export interface Submission {
  id: string;
  checklist_id: string;
  responsavel: string;
  observacoes: string;
  assinatura: string;
  submitted_at: string;
}

export interface ExportHistory {
  id: string;
  checklist_id: string;
  export_format: "xlsx" | "csv";
  file_name: string;
  created_at: string;
}

export interface ExtractedTransportData {
  codigo_at: string;
  items: Array<Pick<ChecklistItem, "artigo" | "descricao" | "quantidade" | "unidade">>;
}

export interface DashboardData {
  pending: Checklist[];
  completed: Checklist[];
  submissions: Submission[];
}
