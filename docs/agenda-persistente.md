# Agenda persistente

Acesse agenda.html pelo botão Abrir minha agenda em account.html. Criação, edição, conclusão/reabertura e exclusão consultam a API /api/events. Dados fictícios por conta, sem envio de notificações nesta etapa. Datas e horários representam o calendário local informado, sem conversão para UTC nem agendamento de entregas.

## Atualização da instalação existente

Pare o servidor com Ctrl+C. Preserve backend/.env. Na branch feat/prototipo-acessivel, baixe Code > Download ZIP e extraia. Copie:

- backend/server.mjs, backend/package.json, backend/agenda.mjs e backend/agenda.test.mjs para C:\Projetos\GestarBem\backend.
- frontend/account.html, frontend/agenda.html, frontend/agenda.js e frontend/agenda.css para C:\Projetos\GestarBem\frontend.
- database/003-agenda.sql para C:\Projetos\GestarBem\database.

As dependências não mudaram. Não substituir .env e não repetir migrações anteriores.

Abra CMD ou PowerShell, execute:

```
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d gestarbem
```

Em PowerShell, acrescente `&` antes do caminho entre aspas. Informe a senha local. Somente quando aparecer gestarbem=#, execute:

```
\i 'C:/Projetos/GestarBem/database/003-agenda.sql'
\dt
\q
```

A migração é aplicada uma vez e cria gestational_events, preservando contas e perfis. Resultado esperado: BEGIN, CREATE TABLE, CREATE INDEX, COMMIT. Em caso de erro, investigar antes de repetir.

No terminal do backend:

```
cd C:\Projetos\GestarBem\backend
npm test
npm start
```

Mantenha esse terminal aberto. Use http://localhost:3000 e Ctrl+F5. Entre na conta e clique em Abrir minha agenda. Se /api/events retornar recurso não encontrado, confira as rotas atualizadas e reinicie o processo correto.

## Contrato e acesso

GET /api/events lista compromissos da sessão. POST /api/events cria. PUT /api/events/:eventId substitui título, tipo, data, horário, observações e estado done. DELETE remove. Todos exigem sessão; escritas também exigem Origin conforme APP_ORIGIN. Identificadores inválidos retornam 400, validação 422 e recursos não pertencentes à conta ou ausentes retornam 404.

Nenhum user_id enviado é utilizado. SELECT filtra req.user.id; UPDATE e DELETE filtram simultaneamente ID do compromisso e proprietária. INSERT atribui a proprietária da sessão. SQL parametrizado, índice por conta/data, exclusão em cascata se a conta for removida. Limite de título 100 e observações 1000; datas reais entre 1900 e 2100; horários de 00:00 a 23:59. Dados são inseridos no DOM como texto.

## Verificação manual

1. Criar compromisso fictício e recarregar; deve permanecer.
2. Editar título/data/horário e recarregar; deve mostrar os novos valores.
3. Concluir e reabrir; estado deve persistir após sair/entrar.
4. Excluir: cancelar confirmação deve preservar; confirmar deve remover após recarregar.
5. Criar em duas contas; nenhuma deve consultar ou alterar a agenda da outra. Testar ID de outra proprietária via API autenticada: PUT/DELETE devem retornar 404 sem alterar a primeira agenda.
6. Sair: GET/POST/PUT/DELETE devem recusar sessão ausente.
7. Testar data inválida, horário inválido, limites de texto e título vazio, inclusive via API.
8. Desligar servidor durante ação; erro deve ser anunciado e formulário preservado.
9. Testar teclado, Escape e retorno do foco, zoom, leitor de tela e largura de 320px. Exclusão exige confirmação nativa do navegador.

## Validação e limites

Onze testes unitários passaram: autenticação, perfil e agenda. Testes de agenda validam campos e o uso da proprietária da sessão nas rotas com banco simulado. Sintaxe JavaScript verificada. Não substituem execução de migração e testes HTTP com PostgreSQL real, ainda pendentes nesta etapa. Perfil anterior foi verificado pelo usuário: persistência após recarregar e ausência dos dados da primeira conta na segunda.

Validação visual e WCAG completa pendentes. Não declarar conformidade AA a partir dos testes unitários. Site estático publicado mantém a demonstração; esta agenda funciona pelo backend local. Registros clínicos, lembretes, regras de atenção e IA ainda não estão ativos.

## Correção de importação no Windows

Erro PostgreSQL 23514 ao usar Vacinação ou Medição pode indicar que a regra gestational_events_type_check foi criada com codificação incorreta. A migração 003 agora utiliza escapes Unicode em SQL composto somente por ASCII. Para tabelas já criadas, aplicar somente database/004-agenda-types.sql: substitui a regra em uma transação, sem apagar ou alterar agendamentos. Se houver registros incompatíveis, a transação falha e preserva a regra anterior; investigar esses registros antes de prosseguir. Não repetir 003 em tabela existente.

Após aplicar 004, testar Vacinação e Medição, recarregar e verificar persistência. Testar também que tipo desconhecido continua sendo recusado pelo servidor e banco. Essa correção ainda exige execução e confirmação no PostgreSQL local do usuário.

## Datas de agendamento

Novos compromissos e edições do formulário exigem hoje ou uma data futura, considerando America/Manaus no servidor e navegador. O formulário recalcula a data mínima no envio, inclusive se ficar aberto durante a virada do dia. Horários anteriores no mesmo dia são permitidos. Concluir/reabrir compromissos que já passaram continua permitido quando somente o estado muda; alterar seus outros campos exige reagendamento para hoje ou futuro. Exclusão e consulta de histórico continuam disponíveis. Testar ontem (recusado), hoje e amanhã (aceitos), inclusive enviando diretamente à API. Não requer migração de banco.
