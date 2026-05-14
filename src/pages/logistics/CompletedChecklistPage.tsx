import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/features/logistics/components/AppLayout";
import { Button } from "@/components/ui/button";
import { downloadBlob, exportChecklistToCsv, exportChecklistToXlsx } from "@/features/logistics/lib/exporters";
import { logisticsService } from "@/features/logistics/services/logisticsService";
import type { Checklist, Submission } from "@/features/logistics/types";

const CompletedChecklistPage = () => {
  const { id = "" } = useParams();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    logisticsService.getChecklistById(id).then((result) => {
      setChecklist(result.checklist);
      setSubmission(result.submission);
    });
  }, [id]);

  const exportFile = async (format: "xlsx" | "csv") => {
    if (!checklist) return;

    const fileName = `checklist-${checklist.codigo_at}-${new Date().toISOString().slice(0, 10)}.${format}`;

    const blob = format === "xlsx"
      ? await exportChecklistToXlsx(checklist, submission ?? undefined)
      : exportChecklistToCsv(checklist, submission ?? undefined);

    downloadBlob(blob, fileName);
    await logisticsService.saveExportHistory(checklist.id, format, fileName);
  };

  if (!checklist) {
    return (
      <AppLayout title="Checklist concluída">
        <p className="rounded-xl border bg-white p-4 text-sm">Resultado não encontrado.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Checklist concluída">
      <div className="space-y-3 rounded-xl border bg-white p-4">
        <p className="text-sm font-semibold">Código AT: {checklist.codigo_at}</p>
        <p className="text-sm">Responsável: {submission?.responsavel ?? "-"}</p>
        <p className="text-sm">Data/Hora: {submission?.submitted_at ? new Date(submission.submitted_at).toLocaleString() : "-"}</p>
        <p className="text-sm">Observações do Renato: {checklist.observacoes_renato || "-"}</p>
        <p className="text-sm">Observações do colaborador: {submission?.observacoes || "-"}</p>

        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2">Artigo</th>
                <th className="p-2">Descrição</th>
                <th className="p-2">Quantidade</th>
                <th className="p-2">Unidade</th>
                <th className="p-2">Check</th>
              </tr>
            </thead>
            <tbody>
              {checklist.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.artigo}</td>
                  <td className="p-2">{item.descricao}</td>
                  <td className="p-2">{item.quantidade}</td>
                  <td className="p-2">{item.unidade}</td>
                  <td className="p-2">{item.checked ? "✔" : "✖"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="h-11 bg-emerald-600 hover:bg-emerald-700" onClick={() => void exportFile("xlsx")}>
            Exportar Excel (.xlsx)
          </Button>
          <Button className="h-11" onClick={() => void exportFile("csv")} variant="outline">
            Exportar Access compatível (.csv)
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default CompletedChecklistPage;
