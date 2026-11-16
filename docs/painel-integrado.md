# Painel da conta

account.html passa a apresentar Meu painel, com saudação e conta confirmadas por /api/auth/me, atalhos de agenda/registros/perfil/IA, resumo de agenda e registros consultados nas respectivas APIs. Nenhum dado fictício do antigo index.html é copiado para a conta. A IA permanece espaço reservado, sem envio de dados e sem chat ativo.

Próximos compromissos: até três agendados não concluídos com data igual ou posterior a hoje em Manaus, ordenados por data/horário. A contagem inclui todos os compromissos ainda não concluídos, inclusive atrasados; o rótulo explicita esse alcance. Registros recentes usam os primeiros três retornados pela API, que ordena data e criação de forma decrescente. Contagem não é análise clínica. Falha em um recurso não impede mostrar o outro; não apresentar zero em caso de falha. Mensagens e botão de nova tentativa em cada seção.

Perfil mantém APIs e IDs existentes e mostra estimativa atual; campos de edição ficam em details nativo, aberto pela usuária. Formulários existentes permanecem com o mesmo contrato. Painel utiliza texto no DOM, respostas sem cache e cookies same-origin. Sessão ausente retorna ao login. Layout em duas colunas em telas maiores e uma coluna em largura reduzida; navegação consistente com agenda e registros.

## Atualizar

Na branch feat/prototipo-acessivel, baixar e extrair ZIP. Copiar frontend/account.html, frontend/dashboard.js, frontend/dashboard.css, frontend/agenda.html e frontend/records.html para C:\Projetos\GestarBem\frontend. Não alterar .env nem banco. Manter profile.js, auth-ui.js, records.js, agenda.js e folhas de estilo existentes. Com servidor funcionando, abrir http://localhost:3000 e atualizar Ctrl+F5. Não é necessário reiniciar backend para esses arquivos estáticos.

## Verificação

- Conferir conta, nome e e-mail, resumo e atalhos.
- Conta vazia deve mostrar estados vazios e zero somente após resposta válida.
- Criar compromisso ou registro, voltar ao painel e verificar resumo atualizado.
- Concluir compromisso e conferir que desaparece dos próximos; histórico continua na agenda.
- Abrir Editar meu perfil gestacional, salvar, recarregar e conferir estimativa.
- Alternar entre duas contas; todos os resumos devem corresponder à conta atual.
- Sessão ausente deve retornar ao login.
- Simular erro em uma API; mensagem e nova tentativa devem funcionar sem zerar informações como se tivessem carregado.
- Operar navegação e details por teclado, conferir foco visível e leitores de tela, zoom e largura de 320px.

## Evidência

Sintaxe dashboard.js verificada. HTML conferido quanto a IDs únicos, vínculos de rótulos, scripts presentes e referências fixas do painel. Backend não mudou, sem nova migração ou dependência. Verificação visual em navegador e avaliação WCAG completa ainda pendentes. Usuário confirmou anteriormente CRUD dos registros e adaptação dos campos de peso e pressão; painel novo ainda exige os testes acima. Notificações, regras clínicas, IA, recuperação de senha e auditoria continuam pendentes.
