import { describe, expect, it } from "vitest";
import { extractTransportDataFromText } from "@/features/logistics/lib/pdfExtraction";

describe("extractTransportDataFromText", () => {
  it("extracts only required transport fields", () => {
    const text = `
      Guia de Transporte
      Chave AT: AT-7781
      AR01  Produto A especial  10  UN
      AR02  Produto B industrial  2,5  KG
      QR CODE: 12345
    `;

    const result = extractTransportDataFromText(text);

    expect(result.codigo_at).toBe("AT-7781");
    expect(result.items).toEqual([
      { artigo: "AR01", descricao: "Produto A especial", quantidade: 10, unidade: "UN" },
      { artigo: "AR02", descricao: "Produto B industrial", quantidade: 2.5, unidade: "KG" },
    ]);
  });
});
