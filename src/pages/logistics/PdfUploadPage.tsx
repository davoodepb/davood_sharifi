import { useState } from "react";
import { AppLayout } from "@/features/logistics/components/AppLayout";
import { extractTransportDataFromPdf } from "@/features/logistics/lib/pdfExtraction";
import { logisticsService } from "@/features/logistics/services/logisticsService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Checklist, ExtractedTransportData } from "@/features/logistics/types";

const PdfUploadPage = () => {
  const [extracted, setExtracted] = useState<ExtractedTransportData | null>(null);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [renatoObs, setRenatoObs] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const data = await extractTransportDataFromPdf(file);
      setExtracted(data);
      setChecklist(null);
    } finally {
      setLoading(false);
    }
  };

  const generateChecklist = async () => {
    if (!extracted) return;
    const created = await logisticsService.createChecklist(extracted, renatoObs);
    setChecklist(created);
  };

  const sendWhatsApp = () => {
    if (!checklist) return;
    const base = window.location.origin;
    const link = `${base}/checklist/${checklist.share_token}`;
    const text = `Checklist Código AT ${checklist.codigo_at}: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <AppLayout title="PDF Upload">
      <div className="space-y-4 rounded-xl border bg-white p-4">
        <input
          accept="application/pdf"
          className="block w-full rounded-lg border p-3 text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
          type="file"
        />
        {loading && <p className="text-sm text-slate-500">Lendo PDF...</p>}

        {extracted && (
          <>
            <p className="text-sm font-semibold">Chave/Código AT: {extracted.codigo_at}</p>
            <div className="overflow-auto rounded-lg border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-2">Artigo</th>
                    <th className="p-2">Descrição</th>
                    <th className="p-2">Quantidade</th>
                    <th className="p-2">Unidade</th>
                  </tr>
                </thead>
                <tbody>
                  {extracted.items.map((item) => (
                    <tr key={`${item.artigo}-${item.descricao}`} className="border-t">
                      <td className="p-2">{item.artigo}</td>
                      <td className="p-2">{item.descricao}</td>
                      <td className="p-2">{item.quantidade}</td>
                      <td className="p-2">{item.unidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Observações do Renato</label>
              <Textarea
                className="min-h-24"
                onChange={(event) => setRenatoObs(event.target.value)}
                value={renatoObs}
              />
            </div>

            <Button className="h-12 w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => void generateChecklist()}>
              Gerar Checklist
            </Button>
          </>
        )}

        {checklist && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm font-semibold">Checklist gerada com sucesso.</p>
            <p className="text-xs">Link: /checklist/{checklist.share_token}</p>
            <Button className="mt-3 h-11 w-full bg-green-600 hover:bg-green-700" onClick={sendWhatsApp}>
              Enviar link por WhatsApp
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PdfUploadPage;
