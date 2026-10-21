# Registros de acompanhamento

records.html consome GET/POST /api/records e PUT/DELETE /api/records/:recordId. Permite peso, pressão arterial, sintomas, medicamentos, consultas realizadas, exames realizados, vacinas e observações, com descrição/valor e unidade em texto, data e observações. Não interpreta valores, não avalia risco e não prescreve cuidados. Não há anexos nem campos clínicos estruturados nesta etapa.

## Atualizar no Windows

Pare o servidor com Ctrl+C. Baixe e extraia a branch feat/prototipo-acessivel do GitHub. Preserve backend/.env e copie:

- backend/server.mjs, backend/package.json, backend/records.mjs e backend/records.test.mjs para C:\Projetos\GestarBem\backend.
- frontend/account.html, frontend/agenda.html, frontend/records.html e frontend/records.js para C:\Projetos\GestarBem\frontend. Manter agenda.css, auth.css e style.css existentes.
- database/005-records.sql para C:\Projetos\GestarBem\database.

As dependências não mudaram. No PowerShell:

```
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -p 5432 -U postgres -d gestarbem
```

Após informar a senha e aparecer gestarbem=#:

```
\i 'C:/Projetos/GestarBem/database/005-records.sql'
\dt
\q
```

Aplicar uma vez; preserva tabelas anteriores. Cria gestational_records, com regra de tipos em escapes Unicode e SQL ASCII para evitar problemas de importação. Não repetir 001, 002, 003 ou 004.

No PowerShell:

```
cd C:\Projetos\GestarBem\backend
npm test
npm start
```

Manter terminal aberto. Entrar em http://localhost:3000, atualizar Ctrl+F5 e clicar Abrir meus registros. Se retornar recurso não encontrado, conferir atualização do server.mjs e reiniciar o processo que atende porta 3000.

## Segurança, interface e validação

Rotas usam req.user.id e consultas parametrizadas. UPDATE/DELETE combinam ID e proprietária; user_id recebido não é utilizado. Sessão obrigatória; escritas exigem Origin. Tipo fora da lista, datas inexistentes ou futuras e campos fora dos limites retornam 422. Data até hoje em America/Manaus; valores até 200 e observações até 1000 caracteres. Identificador inválido retorna 400; registro de outra conta ou inexistente retorna 404.

DOM recebe texto sem interpolação HTML. Campos têm rótulos, mensagens por campo e foco no primeiro erro. Estado de carregamento/salvamento e confirmação; preservação dos campos em erro; modal nativo, Escape e retorno de foco; exclusão com confirmação nativa.

## Testes locais com dados fictícios

1. Criar registro para cada tipo, especialmente Pressão arterial e Observação, verificando acentos.
2. Salvar, recarregar e sair/entrar; conferir persistência.
3. Editar e conferir após recarregar.
4. Cancelar exclusão mantém registro; confirmar remove.
5. Hoje e datas passadas válidas aceitas; amanhã, data inexistente, tipo desconhecido e limites excedidos recusados, também pela API.
6. Segunda conta não deve exibir registros da primeira; PUT/DELETE com ID alheio devem retornar 404 e preservar os dados.
7. API deve recusar sessão ausente. Falha de servidor deve preservar o formulário.
8. Conferir teclado, leitor de tela, zoom e largura de 320px.

## Evidências e limites

Dezesseis testes unitários passaram (autenticação, perfil, agenda e registros); sintaxe verificada. Teste de proprietária dos registros usa banco simulado, não substitui integração real. Migração, persistência e isolamento dos novos registros precisam dos testes acima no PostgreSQL do usuário. Validação visual e conformidade WCAG completa continuam pendentes.

Usuário confirmou nas etapas anteriores perfil persistente e separado entre duas contas; CRUD da agenda, correção de acentos e bloqueio de agendamentos no passado. Novos registros ainda não foram confirmados pelo usuário. Notificações, regras clínicas, IA e logs de auditoria permanecem pendentes. O site estático publicado continua demonstração sem essa API local.

## Campos adaptados ao tipo

O tipo é o primeiro controle do formulário e recebe foco ao abrir. Peso usa campo numérico positivo, duas casas decimais e unidade kg fixa. Pressão arterial usa dois inteiros positivos de até três dígitos, com rótulos sistólica e diastólica e mmHg; valor serializado como primeiro/segundo mmHg. Esses limites são de formato, não classificação clínica. Outros tipos usam texto com rótulos e exemplos próprios; medicamento permanece livre pois as unidades variam conforme a prescrição.

Servidor valida formato e unidade de peso e pressão. Banco conserva value em texto, sem nova migração. Edição reconhece formatos anteriores como 68 kg, 68,5 kg e 120/80 mmHg. Se um registro antigo não puder ser convertido, seu valor original aparece na ajuda e os campos numéricos precisam ser preenchidos para salvar; não há conversão clínica ou alteração automática no banco. Mudar de tipo limpa os campos de valor para evitar reutilizar uma medição incompatível.

Atualizar frontend/records.html, frontend/records.js, backend/records.mjs e backend/records.test.mjs, reiniciar backend e Ctrl+F5. Dezessete testes unitários passaram; teste visual e de leitor de tela deste formulário adaptado ainda pendente. Conferir escolha do tipo primeiro, peso decimal e kg, dois valores de pressão e mmHg, edição de registros anteriores e preservação de dados quando a validação falhar.
