# Logística Checklist PWA

Aplicação React + Vite + Tailwind para automação de checklist logístico.

## Funcionalidades

- Login com persistência de sessão local
- Dashboard com checklists pendentes/concluídos
- Upload de PDF e extração **somente** de: Chave AT, Artigo, Descrição, Quantidade, Unidade
- Geração de checklist com campo **Observações do Renato**
- Link único por checklist com compartilhamento por WhatsApp
- Preenchimento por colaborador em layout mobile-first
- Salvamento da submissão e tela de checklist concluída
- Exportação para `.xlsx` e `.csv` (compatível com Access)
- Preparação para Supabase (DB principal) e Firebase (auth/notificações/analytics)
- PWA instalável com service worker e manifest

## Configuração de ambiente

Crie `.env`:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Sem variáveis Supabase, o app usa armazenamento local para operação offline/demo.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run test
```
