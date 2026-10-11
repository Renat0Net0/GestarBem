# Validação funcional do GestarBem

## Protocolo

Executar em ambiente local com dados fictícios, duas contas de teste e a versão do código registrada. Não usar dados reais de saúde. Anotar navegador, data, commit e responsável. Para cada cenário registrar resultado observado, evidência e estado: aprovado, reprovado ou não executado.

Os relatos anteriores do usuário são evidências exploratórias. A tabela permanece pendente até uma rodada formal documentada; os testes automatizados não substituem essa execução.

Meta: pelo menos 27 dos 30 cenários aprovados (90%). Calcular aprovados / 30 × 100; informar também quantos foram executados, reprovados e ficaram pendentes. Não considerar um cenário aprovado sem evidência.

## Cenários

| ID | Cenário | Procedimento | Resultado esperado | Estado |
|---|---|---|---|---|
| TF-01 | Cadastro válido | Criar uma conta com e-mail exclusivo e senha válida. | Cadastro confirmado; login disponível. | Não executado |
| TF-02 | Cadastro incompleto | Enviar cadastro com campos obrigatórios vazios. | Campos identificados; nenhuma conta criada. | Não executado |
| TF-03 | Confirmação de senha | Cadastrar com senhas diferentes. | Erro na confirmação; dados preenchidos preservados. | Não executado |
| TF-04 | Login válido | Entrar com credenciais de uma conta de teste. | Painel exibido com a usuária correta. | Não executado |
| TF-05 | Login inválido | Entrar com senha incorreta. | Mensagem de erro; acesso negado. | Não executado |
| TF-06 | Encerramento da sessão | Sair e abrir novamente account.html. | Retorno ao login; dados protegidos. | Não executado |
| TF-07 | Perfil persistente | Salvar DUM e observações; recarregar. | Valores permanecem na mesma conta. | Não executado |
| TF-08 | DUM inválida | Informar DUM posterior a hoje. | Salvamento bloqueado com indicação do campo. | Não executado |
| TF-09 | Observações do perfil | Enviar observações acima de 1000 caracteres. | Validação impede armazenamento acima do limite. | Não executado |
| TF-10 | Separação de perfis | Salvar perfil na conta A; entrar na conta B. | Dados de A ausentes no perfil de B. | Não executado |
| TF-11 | Criar compromisso | Cadastrar compromisso para hoje ou data futura. | Card aparece e permanece após recarregar. | Não executado |
| TF-12 | Editar compromisso | Alterar título, horário e observações. | Card e banco refletem os novos valores. | Não executado |
| TF-13 | Excluir compromisso | Confirmar exclusão de um compromisso fictício. | Item removido e ausente após recarregar. | Não executado |
| TF-14 | Cancelar exclusão | Cancelar a confirmação de exclusão. | Compromisso preservado. | Não executado |
| TF-15 | Data passada na agenda | Tentar cadastrar compromisso anterior a hoje. | Data rejeitada e mensagem apresentada. | Não executado |
| TF-16 | Tipos da agenda | Cadastrar e remover um exemplo de cada tipo disponível. | Todos os tipos aceitos, incluindo Vacinação e Medição. | Não executado |
| TF-17 | Concluir e reabrir | Concluir um compromisso e depois reabri-lo. | Estado atualizado e persistente. | Não executado |
| TF-18 | Separação de agendas | Criar compromisso na conta A; entrar na conta B. | Compromisso de A não aparece em B. | Não executado |
| TF-19 | Peso | Escolher Peso e preencher valor numérico válido. | Unidade kg apresentada e valor salvo corretamente. | Não executado |
| TF-20 | Pressão arterial | Escolher Pressão arterial e preencher os dois valores. | Dois campos disponíveis; valor salvo em mmHg. | Não executado |
| TF-21 | Troca do tipo de registro | Alternar Peso, Pressão arterial e Observação. | Campos, rótulos e unidades acompanham o tipo; campo oculto não bloqueia envio. | Não executado |
| TF-22 | Editar registro | Editar um registro e recarregar. | Alterações persistem. | Não executado |
| TF-23 | Excluir registro | Excluir um registro fictício e recarregar. | Registro permanece excluído. | Não executado |
| TF-24 | Data futura em registro | Tentar salvar registro com data posterior a hoje. | Envio bloqueado com indicação do campo. | Não executado |
| TF-25 | Separação de registros | Criar registro na conta A; entrar na conta B. | Registro de A ausente em B. | Não executado |
| TF-26 | Lembrete no dia | Criar compromisso hoje com lembrete No dia; recarregar painel. | Lembrete aparece no card lateral. | Não executado |
| TF-27 | Marcar lembrete como visto | Marcar como visto e recarregar. | Aviso permanece oculto; compromisso continua na agenda. | Não executado |
| TF-28 | Ausência de lembretes | Marcar todos os avisos como vistos e abrir as três páginas. | Card lateral desaparece e conteúdo ocupa o espaço disponível. | Não executado |
| TF-29 | Antecedência do lembrete | Criar exemplos dentro e fora das janelas de 1, 2 e 7 dias; recarregar. | Somente avisos dentro da janela aparecem. | Não executado |
| TF-30 | Painel integrado | Criar registros e compromissos; retornar ao painel. | Contagens e listas correspondem aos dados da conta, após atualização da página. | Não executado |

## Registro da execução

Para cada ID: data; versão/commit; navegador; resultado observado; estado; caminho da evidência ou descrição reproduzível; problema encontrado. Evidências não devem expor senhas, cookies ou informações pessoais.

## Revisão de utilização e acessibilidade

Esta revisão complementa os 30 cenários e não certifica conformidade com WCAG ou com as heurísticas de Nielsen.

- Percorrer login, painel, agenda e registros com Tab e Shift+Tab; verificar ordem, foco visível, ativação de botões e ausência de bloqueios.
- Abrir e fechar os formulários com teclado, inclusive Escape; verificar retorno de foco e campos com erro. Testar erros recebidos do servidor além dos erros locais.
- Verificar leitura de rótulos, unidades, mensagens e mudanças de estado com NVDA.
- Verificar zoom de 200% e 400%, tela estreita e rolagem, sem conteúdo sobreposto ou controles inacessíveis.
- Medir contraste dos textos, controles e foco; registrar valores, não apenas impressão visual.
- Verificar mensagens de carregamento, sucesso e falha; cancelamento de ações; confirmação de exclusão; consistência da navegação; preservação dos dados após erro.
- Testar falha de conexão e nova tentativa. Uma falha não deve ser apresentada como ausência de dados.

A avaliação de usabilidade com dez participantes deve ter protocolo próprio, tarefas, consentimento e resultados registrados. Está pendente.

## Verificação automatizada

Executar `npm test` na pasta backend. A suíte atual contém 19 testes de validação e verificações com dependências simuladas. Não representa teste completo do navegador, integração real com PostgreSQL nem aprovação dos 30 cenários acima.
