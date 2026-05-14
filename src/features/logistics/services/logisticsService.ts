import { supabase } from "@/lib/supabase";
import type {
  Checklist,
  ChecklistItem,
  DashboardData,
  ExportHistory,
  ExtractedTransportData,
  LogisticsUser,
  Submission,
} from "@/features/logistics/types";

type LocalState = {
  users: LogisticsUser[];
  checklists: Checklist[];
  submissions: Submission[];
  export_history: ExportHistory[];
};

const LOCAL_STORAGE_KEY = "logistics_app_state_v1";
const SESSION_KEY = "logistics_session_user";

const nowIso = () => new Date().toISOString();

const buildId = () => crypto.randomUUID();

const readState = (): LocalState => {
  const state = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!state) {
    return { users: [], checklists: [], submissions: [], export_history: [] };
  }

  try {
    return JSON.parse(state) as LocalState;
  } catch {
    return { users: [], checklists: [], submissions: [], export_history: [] };
  }
};

const writeState = (state: LocalState) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

const normalizeChecklist = (
  checklist: Omit<Checklist, "items" | "created_at" | "status"> & {
    created_at?: string;
    status?: Checklist["status"];
    items: Omit<ChecklistItem, "id" | "checklist_id" | "checked">[];
    id?: string;
  },
): Checklist => {
  const id = checklist.id ?? buildId();
  return {
    id,
    codigo_at: checklist.codigo_at,
    share_token: checklist.share_token,
    observacoes_renato: checklist.observacoes_renato,
    status: checklist.status ?? "pending",
    created_at: checklist.created_at ?? nowIso(),
    items: checklist.items.map((item) => ({
      id: buildId(),
      checklist_id: id,
      artigo: item.artigo,
      descricao: item.descricao,
      quantidade: item.quantidade,
      unidade: item.unidade,
      checked: false,
    })),
  };
};

export const logisticsService = {
  getSessionUser() {
    const user = localStorage.getItem(SESSION_KEY);
    return user ? (JSON.parse(user) as LogisticsUser) : null;
  },

  async login(name: string, phone: string): Promise<LogisticsUser> {
    const state = readState();
    const user: LogisticsUser = {
      id: buildId(),
      name,
      phone,
      role: "admin",
      created_at: nowIso(),
    };

    state.users = [
      ...state.users.filter((existing) => existing.phone !== phone),
      user,
    ];
    writeState(state);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    if (supabase) {
      await supabase.from("users").upsert(user, { onConflict: "phone" });
    }

    return user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  async createChecklist(extracted: ExtractedTransportData, observacoes_renato: string): Promise<Checklist> {
    const state = readState();
    const checklist = normalizeChecklist({
      codigo_at: extracted.codigo_at,
      observacoes_renato,
      share_token: buildId(),
      items: extracted.items,
    });

    state.checklists = [checklist, ...state.checklists];
    writeState(state);

    if (supabase) {
      await supabase.from("checklists").insert({
        id: checklist.id,
        codigo_at: checklist.codigo_at,
        share_token: checklist.share_token,
        observacoes_renato: checklist.observacoes_renato,
        status: checklist.status,
        created_at: checklist.created_at,
      });

      await supabase.from("checklist_items").insert(
        checklist.items.map((item) => ({
          id: item.id,
          checklist_id: checklist.id,
          artigo: item.artigo,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          checked: item.checked,
        })),
      );
    }

    return checklist;
  },

  async getDashboardData(): Promise<DashboardData> {
    const state = readState();
    const pending = state.checklists.filter((checklist) => checklist.status === "pending");
    const completed = state.checklists.filter((checklist) => checklist.status === "completed");

    return {
      pending,
      completed,
      submissions: state.submissions,
    };
  },

  async getChecklistByToken(token: string) {
    const state = readState();
    const checklist = state.checklists.find((entry) => entry.share_token === token) ?? null;
    const submission = checklist
      ? state.submissions.find((entry) => entry.checklist_id === checklist.id) ?? null
      : null;

    return { checklist, submission };
  },

  async getChecklistById(id: string) {
    const state = readState();
    const checklist = state.checklists.find((entry) => entry.id === id) ?? null;
    const submission = checklist
      ? state.submissions.find((entry) => entry.checklist_id === checklist.id) ?? null
      : null;

    return { checklist, submission };
  },

  async submitChecklist(
    token: string,
    responsavel: string,
    observacoes: string,
    checkedItemIds: string[],
  ) {
    const state = readState();
    const checklistIndex = state.checklists.findIndex((entry) => entry.share_token === token);

    if (checklistIndex === -1) {
      throw new Error("Checklist não encontrada.");
    }

    const existing = state.checklists[checklistIndex];
    const submission: Submission = {
      id: buildId(),
      checklist_id: existing.id,
      responsavel,
      observacoes,
      assinatura: responsavel,
      submitted_at: nowIso(),
    };

    const updatedChecklist: Checklist = {
      ...existing,
      status: "completed",
      items: existing.items.map((item) => ({
        ...item,
        checked: checkedItemIds.includes(item.id),
      })),
    };

    state.checklists[checklistIndex] = updatedChecklist;
    state.submissions = [submission, ...state.submissions.filter((item) => item.checklist_id !== existing.id)];
    writeState(state);

    if (supabase) {
      await supabase.from("checklist_items")
        .update({ checked: true })
        .in("id", checkedItemIds);

      await supabase.from("checklists")
        .update({ status: "completed" })
        .eq("id", updatedChecklist.id);

      await supabase.from("submissions").insert(submission);
    }

    return { checklist: updatedChecklist, submission };
  },

  async saveExportHistory(checklist_id: string, export_format: ExportHistory["export_format"], file_name: string) {
    const state = readState();

    const exportHistory: ExportHistory = {
      id: buildId(),
      checklist_id,
      export_format,
      file_name,
      created_at: nowIso(),
    };

    state.export_history = [exportHistory, ...state.export_history];
    writeState(state);

    if (supabase) {
      await supabase.from("export_history").insert(exportHistory);
    }

    return exportHistory;
  },
};
