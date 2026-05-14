import ExcelJS from "exceljs";
import type { Checklist, Submission } from "@/features/logistics/types";

const headers = [
  "Código AT",
  "Artigo",
  "Descrição",
  "Quantidade",
  "Unidade",
  "Responsável",
  "Observações do Renato",
  "Observações do Colaborador",
  "Data e Hora",
];

const rowsFromChecklist = (checklist: Checklist, submission?: Submission) =>
  checklist.items.map((item) => [
    checklist.codigo_at,
    item.artigo,
    item.descricao,
    item.quantidade,
    item.unidade,
    submission?.responsavel ?? "",
    checklist.observacoes_renato,
    submission?.observacoes ?? "",
    submission?.submitted_at ?? "",
  ]);

export const exportChecklistToCsv = (checklist: Checklist, submission?: Submission) => {
  const escape = (value: string | number) => {
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };

  const csv = [headers, ...rowsFromChecklist(checklist, submission)]
    .map((row) => row.map(escape).join(","))
    .join("\n");

  return new Blob([csv], { type: "text/csv;charset=utf-8" });
};

export const exportChecklistToXlsx = async (checklist: Checklist, submission?: Submission) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Checklist");

  worksheet.addRow(headers);
  rowsFromChecklist(checklist, submission).forEach((row) => worksheet.addRow(row));

  worksheet.getRow(1).font = { bold: true };
  worksheet.columns = headers.map((header) => ({ header, width: Math.max(header.length + 4, 18) }));

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};
