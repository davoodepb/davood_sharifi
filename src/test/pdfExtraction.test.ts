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

  it("keeps decimal point values when parsing quantities", () => {
    const text = `
      Chave AT: AT-55
      AR03  Produto C  1.5  UN
      AR04  Produto D  1.234,56  KG
    `;

    const result = extractTransportDataFromText(text);
    expect(result.items[0].quantidade).toBe(1.5);
    expect(result.items[1].quantidade).toBe(1234.56);
  });

  it("treats comma values as decimal in PT transport format", () => {
    const text = `
      Chave AT: AT-56
      AR05  Produto E  1,234  UN
    `;

    const result = extractTransportDataFromText(text);
    expect(result.items[0].quantidade).toBe(1.234);
  });
});
