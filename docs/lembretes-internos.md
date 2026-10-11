# Lembretes internos

Agenda permite Sem lembrete, No dia, 1, 2 ou 7 dias antes. Os avisos aparecem em account.html ao carregar/recarregar o painel, a partir da data calculada e até a data do compromisso, usando America/Manaus. Abrange os tipos existentes Consulta, Exame, Vacinação, Medicamento e Medição, além de Outra atividade. São compromissos programados, sem inferir doses, condutas ou periodicidade.

Avisos de compromissos concluídos, marcados como vistos, sem configuração ou com data já passada não aparecem. Marcar como visto preserva o compromisso e guarda o estado no banco. Alterar data, horário ou antecedência reativa o aviso. O aviso é por data, não dispara no minuto do horário. Não existe atualização automática, envio por e-mail, push, serviço em segundo plano ou garantia de aviso fora do site. A usuária precisa abrir ou recarregar o painel.

## Atualização

Parar o servidor com Ctrl+C. Baixar e extrair a branch feat/prototipo-acessivel. Preservar .env. Copiar:

- backend/server.mjs, backend/package.json, backend/agenda.mjs, backend/agenda.test.mjs, backend/reminders.mjs e backend/reminders.test.mjs para C:\Projetos\GestarBem\backend.
- frontend/account.html, frontend/agenda.html, frontend/agenda.js e frontend/reminders.js para C:\Projetos\GestarBem\frontend.
- database/006-reminders.sql para C:\Projetos\GestarBem\database.

No PowerShell:

```
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d gestarbem
```

Depois da senha, somente quando aparecer gestarbem=#:

```
\i 'C:/Projetos/GestarBem/database/006-reminders.sql'
\q
```

Resultado esperado BEGIN, ALTER TABLE, COMMIT. Aplicar uma vez; não repetir migrações anteriores. Campos reminder_days (0,1,2,7 ou NULL) e reminder_seen são acrescentados sem apagar compromissos. Agendamentos existentes ficam sem lembrete até a usuária configurar.

```
cd C:\Projetos\GestarBem\backend
npm test
npm start
```

Abrir http://localhost:3000, entrar, atualizar Ctrl+F5 e editar/criar compromisso na agenda. Manter servidor aberto.

## API e segurança

GET /api/reminders filtra a conta da sessão, datas de início/fim, configuração, estado concluído e visto. POST /api/reminders/:reminderId/seen atualiza somente a conta da sessão; 404 para recurso alheio/inexistente e 401 sem sessão. Escritas seguem restrição de Origin do servidor. SQL parametrizado. Nenhum dado é enviado fora do site. Notificações futuras devem ter conteúdo discreto e permissão própria, sem exposição de exames.

## Verificação local

1. Compromisso de hoje com No dia: deve aparecer no painel.
2. Compromisso de amanhã com 1 dia antes: deve aparecer hoje.
3. Compromisso de amanhã com No dia: não deve aparecer hoje.
4. Verificar tipos consulta, exame, vacinação, medicamento e medição.
5. Marcar como visto, recarregar e verificar que permanece oculto e o compromisso continua na agenda.
6. Alterar data/horário/antecedência: verificar reativação quando estiver na janela do aviso.
7. Sem lembrete e concluído: não devem aparecer.
8. Segunda conta não deve ver nem marcar aviso de outra conta. API sem sessão deve recusar.
9. Falha na consulta ou marcação: mensagem, nova tentativa e preservação do item. Verificar teclado, foco e leitor de tela.

## Evidências e pendências

Dezenove testes unitários passaram (18 existentes/validação mais rota de lembretes com banco simulado); sintaxe verificada. Testes de rotas conferem escopo por conta e filtros, sem execução SQL real. Migração, janelas de antecedência e persistência precisam dos testes no PostgreSQL local. Validação WCAG completa e navegador continuam pendentes. Usuário confirmou módulos anteriores; novo recurso ainda aguarda sua validação. Não há regras clínicas ou IA ativa.
