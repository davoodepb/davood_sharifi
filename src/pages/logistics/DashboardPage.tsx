import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/features/logistics/components/AppLayout";
import { logisticsService } from "@/features/logistics/services/logisticsService";
import type { DashboardData } from "@/features/logistics/types";

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData>({ pending: [], completed: [], submissions: [] });

  useEffect(() => {
    logisticsService.getDashboardData().then(setData);
  }, []);

  return (
    <AppLayout title="Dashboard">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Pendentes</p>
          <p className="text-3xl font-bold text-blue-700">{data.pending.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Concluídos</p>
          <p className="text-3xl font-bold text-emerald-600">{data.completed.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Atividade recente</p>
          <p className="text-3xl font-bold text-slate-800">{data.submissions.length}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <h2 className="font-semibold">Checklists pendentes</h2>
        {data.pending.map((checklist) => (
          <div key={checklist.id} className="rounded-xl border bg-white p-4">
            <p className="text-sm font-semibold">Código AT: {checklist.codigo_at}</p>
            <p className="text-xs text-slate-500">{new Date(checklist.created_at).toLocaleString()}</p>
            <Link className="mt-2 inline-block text-sm font-semibold text-blue-700" to={`/checklist/${checklist.share_token}`}>
              Abrir checklist
            </Link>
          </div>
        ))}
        {!data.pending.length && <p className="text-sm text-slate-500">Sem pendências no momento.</p>}
      </div>

      <div className="mt-4 space-y-3">
        <h2 className="font-semibold">Checklists concluídos</h2>
        {data.completed.map((checklist) => (
          <div key={checklist.id} className="rounded-xl border bg-white p-4">
            <p className="text-sm font-semibold">Código AT: {checklist.codigo_at}</p>
            <Link className="mt-2 inline-block text-sm font-semibold text-emerald-700" to={`/completed/${checklist.id}`}>
              Ver resultado
            </Link>
          </div>
        ))}
        {!data.completed.length && <p className="text-sm text-slate-500">Nenhum checklist concluído ainda.</p>}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
