# Revisão de privacidade, acessibilidade e escopo

Data: 28/10/2026. Esta revisão não certifica conformidade legal, clínica ou WCAG.

## Entrega técnica

- Configurações permite exportar os dados próprios em JSON, após conferir senha. Senhas, tokens e sessões não entram no arquivo.
- Exclusão exige senha e a palavra EXCLUIR. A operação é transacional, apaga somente a conta autenticada, perfil, compromissos, registros, sessões e histórico dessa conta. Atividades produzidas pelos gatilhos são apagadas por último.
- A exclusão não remove arquivos baixados, logs ou backups externos. Não alegar apagamento universal.
- Exportação usa snapshot consistente do PostgreSQL. Não há nova migração; requer migrações 001 a 008 existentes.
- IA abre em “Somente minha pergunta”. O contexto só é consultado se includeContext for true. Não há checkbox de autorização por pergunta. O aviso junto ao botão explica o envio e o seletor permite mudar o escopo.
- A opção selecionada não é uma prova de adequação legal do tratamento. Não usar consent:true como evidência suficiente de consentimento.
- Ajuda informa hospedagem, fornecedores, exportação, exclusão e contato do projeto.
- Controles de conta recebem ajustes de largura, quebra de texto e tamanho para facilitar reflow.

## Evidências executadas

42 testes automatizados de backend passaram em 28/10/2026, incluindo seis novos casos de exportação/exclusão e dois de minimização do contexto da IA. O banco e o provedor são simulados. Sintaxe dos scripts e git diff --check passaram.
O teste Chromium tests/privacy-browser.cjs foi preparado, mas não executou: não há navegador instalado e o download falhou. Não contabilizar isso como aprovação visual, WCAG ou testes com participantes.

## Verificação em ambiente de homologação

Usar duas contas fictícias A e B. Não usar o banco de produção para testar exclusão.
1. Acessar exportação/exclusão sem sessão: 401.
2. Exportar A: conferir perfil, todos os eventos/registros e histórico; não conter hashes, tokens, sessões nem itens de B.
3. Senha incorreta: não exportar nem excluir.
4. Exclusão sem confirmação literal: não apagar.
5. Excluir A: sessões anteriores deixam de funcionar; B permanece intacta.
6. Conferir no PostgreSQL ausência de registros e atividades de A, inclusive atividades criadas pelos gatilhos durante a exclusão.
7. Simular falha transacional: rollback; não confirmar sucesso.
8. Verificar download, estado de processamento, erros, foco e prevenção de envio duplicado.
9. Modo educativo da IA: só pergunta; modo pessoal: no máximo oito compromissos e doze registros, sem nome/e-mail/observações.
10. Validar exportação multipágina em resumo e volume representativo de dados. Exportação JSON não equivale a portabilidade legal automaticamente.

## WCAG 2.2 AA e Nielsen

Avaliar cada página e processo, registrar critério, passos, resultado, evidência e correção:
- Teclado: cadastro/login, calendário/lista, filtros, diálogos, edição/exclusão, configurações e IA. Sem armadilhas.
- Foco visível, ordem lógica, retorno após fechar diálogo e anúncio de resultado/erro.
- Zoom 200% e 400%, largura 320 CSS px, orientação e espaçamento de texto; nenhuma perda de conteúdo/ação.
- Contraste calculado em todos os estados, inclusive hover, erro, foco, controles e gráficos.
- NVDA/Firefox ou Chrome: nomes, estados, títulos, mensagens de status e tabelas equivalentes.
- Autenticação permite colar senha/gerenciador; não exigir testes cognitivos.
- Mensagens devem descrever ações e recuperação, sem jargão; avaliar consistência entre ajuda e produto.
- Aplicar avaliação das dez heurísticas com gravidade e teste de usabilidade com dez participantes, segundo protocolo institucional. Não inventar resultados.
Referências: https://www.w3.org/TR/WCAG22/ e https://www.nngroup.com/articles/ten-usability-heuristics/

## Decisões institucionais necessárias

A equipe e a orientadora precisam definir e registrar:
- Identidade formal do controlador e responsabilidades; validar que gestarbem@gmail.com é monitorado para solicitações.
- Finalidades e bases legais adequadas a dados de saúde, inclusive uso de IA; comprovação e revogação quando aplicáveis.
- Fluxos para acesso/correção/eliminação e verificação proporcional de identidade; prazos legais aplicáveis.
- Política de retenção de contas, logs, backups e restauração com reaplicação de exclusões.
- Contratos, regiões, suboperadores e mecanismo de transferência internacional de Render, Neon e OpenAI. Não presumir adequação por usar HTTPS.
- Plano de incidentes, controle de acesso administrativo, backup e teste de restauração.
- Condições para participantes menores de idade e para pesquisa com pessoas; não iniciar coleta real sem decisão institucional.
Até formalizar esses pontos, demonstrar com dados fictícios.
Referências: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares e https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados

## Rastreabilidade do pré-projeto

| Meta | Situação e evidência necessária |
|---|---|
| Cadastro, perfil, agenda e registros | Implementados; executar cenários formais e isolamento |
| Cinco tipos de lembrete | Consulta, Exame, Vacinação, Medicamento e Medição existem na agenda; demonstrar um aviso de cada. Quatro antecedências não equivalem a cinco tipos |
| Dez regras de atenção | Dez regras por seleção explícita de sinal atual. Não são análise automática do histórico |
| Fluxo de regras do pré-projeto | Ajustar com orientadora a descrição para seleção explícita ou especificar processamento adicional validado; não inventar limiares clínicos |
| IA educativa | Integração existente e minimização reforçada; avaliar perguntas dentro/fora do tema e respostas clínicas indevidas |
| 30 cenários e 90% de aprovação | Executar roteiro em docs/testes-funcionais.md, registrar evidências e calcular resultado |
| Dez participantes | Executar protocolo em docs/testes-usabilidade.md quando autorizado |
| Hospedagem | Render e Neon relatados em funcionamento; validar configuração e operação |
| Recuperação de senha | Pendente; exige fluxo seguro de entrega de token e provedor, não reutilizar senha por e-mail |

## Publicação e reversão

Entregar por branch separada e PR para revisão antes de chegar ao serviço publicado. Não alterar .env nem chaves.
Após merge, aguardar deploy, Ctrl+F5 e validar com contas fictícias. Nenhuma exclusão ocorre ao implantar; somente após ação autenticada.
Para reverter, reverter o commit de funcionalidade em Git e republicar. Reversão de código não recupera contas excluídas.
