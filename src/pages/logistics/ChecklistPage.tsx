import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/features/logistics/components/AppLayout";
import { logisticsService } from "@/features/logistics/services/logisticsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Checklist } from "@/features/logistics/types";

const ChecklistPage = () => {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [responsavel, setResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    logisticsService.getChecklistByToken(token).then(({ checklist: found }) => {
      setChecklist(found);
      if (found) {
        setCheckedItems(found.items.filter((item) => item.checked).map((item) => item.id));
      }
    });
  }, [token]);

  const viewedAt = useMemo(() => new Date().toLocaleString(), []);

  const toggle = (itemId: string) => {
    setCheckedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await logisticsService.submitChecklist(token, responsavel, observacoes, checkedItems);
    navigate(`/completed/${result.checklist.id}`);
  };

  if (!checklist) {
    return (
      <AppLayout title="Checklist">
        <p className="rounded-xl border bg-white p-4 text-sm">Checklist não encontrada.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Checklist">
      <form className="space-y-4 rounded-xl border bg-white p-4" onSubmit={onSubmit}>
        <p className="text-sm font-semibold">Código AT: {checklist.codigo_at}</p>
        <p className="text-xs text-slate-500">Visualizado em: {viewedAt}</p>

        <div className="space-y-2">
          {checklist.items.map((item) => (
            <label key={item.id} className="flex items-start gap-3 rounded-lg border p-3">
              <input
                checked={checkedItems.includes(item.id)}
                className="mt-1 h-5 w-5"
                onChange={() => toggle(item.id)}
                type="checkbox"
              />
              <div className="text-sm">
                <p className="font-semibold">{item.descricao}</p>
                <p className="text-slate-500">Artigo: {item.artigo}</p>
                <p className="text-slate-500">Quantidade: {item.quantidade} {item.unidade}</p>
              </div>
            </label>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Observações do Renato</label>
          <Textarea className="min-h-24" readOnly value={checklist.observacoes_renato} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Responsável colaborador</label>
          <Input
            className="h-11"
            onChange={(event) => setResponsavel(event.target.value)}
            required
            value={responsavel}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Observações do colaborador</label>
          <Textarea
            className="min-h-24"
            onChange={(event) => setObservacoes(event.target.value)}
            value={observacoes}
          />
        </div>

        <Button className="h-12 w-full bg-blue-600 hover:bg-blue-700" type="submit">
          Enviar checklist
        </Button>
      </form>
    </AppLayout>
  );
};

export default ChecklistPage;
