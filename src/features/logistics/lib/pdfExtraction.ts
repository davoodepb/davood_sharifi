import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { ExtractedTransportData } from "@/features/logistics/types";

GlobalWorkerOptions.workerSrc = workerSrc;

const toNumber = (value: string) => Number.parseFloat(value.replace(".", "").replace(",", "."));

const parseItemLine = (line: string) => {
  const normalized = line.trim().replace(/\s+/g, " ");
  if (!normalized) return null;

  const strictColumns = line.split(/\t+|\s{2,}/).map((part) => part.trim()).filter(Boolean);
  if (strictColumns.length >= 5) {
    const unidade = strictColumns.at(-1) ?? "";
    const quantidadeRaw = strictColumns.at(-2) ?? "0";
    const artigo = strictColumns[0];
    const descricao = strictColumns.slice(1, -2).join(" ");
    const quantidade = toNumber(quantidadeRaw);

    if (Number.isFinite(quantidade) && artigo && descricao && unidade) {
      return { artigo, descricao, quantidade, unidade };
    }
  }

  const match = normalized.match(/^(\S+)\s+(.+?)\s+(\d+[\d.,]*)\s+([A-Za-z]{1,8})$/);
  if (!match) return null;

  const [, artigo, descricao, quantidadeRaw, unidade] = match;
  const quantidade = toNumber(quantidadeRaw);
  if (!Number.isFinite(quantidade)) return null;

  return { artigo, descricao, quantidade, unidade };
};

export const extractTransportDataFromText = (text: string): ExtractedTransportData => {
  const codigoMatch = text.match(/(?:Chave\s*AT|C[oó]digo\s*AT)\s*[:-]?\s*([A-Za-z0-9-]+)/i);
  const codigo_at = codigoMatch?.[1]?.trim() ?? "SEM-CODIGO";

  const lines = text.split(/\r?\n/);
  const items = lines
    .map(parseItemLine)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    codigo_at,
    items,
  };
};

export const extractTransportDataFromPdf = async (file: File): Promise<ExtractedTransportData> => {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  const chunks: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join("\n");
    chunks.push(pageText);
  }

  return extractTransportDataFromText(chunks.join("\n"));
};
