# GestarBem

Primeira etapa do site baseada no arquivo Pre_Projeto_GestarBem (3).docx, recebido em 5 de outubro de 2026.

## Proposta e decisões

Plataforma web para uso direto pela gestante. Reúne perfil, acompanhamento, agenda, lembretes, regras de atenção e sugestões gerais por IA. Não contempla perfil profissional, clínicas ou familiares. IoT é opcional e posterior.

O documento prevê HTML/CSS/JavaScript, Node.js/Express e PostgreSQL. Esta primeira entrega implementa a interface com HTML/CSS/JavaScript sem dependências, como protótipo de interação. Nenhuma informação é persistida ou enviada a uma API. Não implementar falso login ou falsa IA. Dados fictícios explícitos e memória da página são adequados a esta fase, mas insuficientes para uso real.

## Pendências do pré-projeto

- Cronograma sem datas.
- Objetivos específicos listam três itens e não cobrem IA, regras, segurança e testes previstos nos resultados.
- Referência Flutter sem uso previsto na arquitetura web.
- Referências com nomes de páginas em vez de URLs verificáveis.
- Regras de atenção ainda sem catálogo de critérios, fontes, versões e casos de teste.

## Heurísticas de Nielsen

| Heurística | Decisão da primeira versão | Validação pendente |
| --- | --- | --- |
| Visibilidade do estado | Agenda informa Agendado/Concluído; confirmação de salvamento; demonstração identificada | Leitura das mensagens com NVDA |
| Correspondência com o mundo real | Termos consulta, vacina, data, horário; datas brasileiras | Testes com gestantes |
| Controle e liberdade | Cancelar, fechar por Escape, editar, reabrir e desfazer exclusão | Teste de recuperação de erros |
| Consistência e padrões | Navegação e botões consistentes, mesma estrutura de formulário | Revisão de todas as telas |
| Prevenção de erros | Obrigatoriedade, limites, datas e escape de conteúdo inserido | Testes de campos e datas |
| Reconhecimento em vez de memorização | Rótulos permanentes, registros visíveis e navegação nomeada | Usabilidade |
| Flexibilidade e eficiência | Atalhos no painel, operação por teclado e edição | Teclado e dispositivo móvel |
| Estética e minimalismo | Painel com agenda, histórico e próximo passo | Usabilidade |
| Reconhecer e recuperar erros | Campo inválido recebe foco e mensagem; conteúdo preservado | Leitor de tela |
| Ajuda e documentação | Ajuda contextual e página dedicada | Compreensão com usuários |

## Meta WCAG 2.2 AA

Meta de projeto, não declaração de conformidade. Os quatro princípios são perceptível, operável, compreensível e robusto.

| Princípio | Critérios relevantes | Implementação / verificação |
| --- | --- | --- |
| Perceptível | 1.3.1, 1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11 | HTML semântico, rótulos, estado em texto, paleta com contraste calculado; testar zoom 200%, reflow a 320px e 400% |
| Operável | 2.1.1, 2.1.2, 2.4.1, 2.4.2, 2.4.3, 2.4.6, 2.4.7, 2.4.11, 2.5.3, 2.5.8 | Link para pular navegação, foco visível, título por tela, dialog nativo com Escape e retorno de foco; botões com altura mínima 44px; validar ordem, largura e obstrução do foco |
| Compreensível | 3.1.1, 3.2.1, 3.2.2, 3.2.3, 3.3.1, 3.3.2, 3.3.3 | pt-BR, rótulos claros, navegação consistente, erros anunciados e campos preservados |
| Robusto | 4.1.2, 4.1.3 | Controles nativos, aria-current, dialog nomeado, mensagens role=status e role=alert; validar NVDA/Firefox e VoiceOver/Safari |

Não basta um scanner automático ou contraste para declarar WCAG AA. Avaliar todos os critérios aplicáveis e processos completos, inclusive cadastro, autenticação e recuperação quando existirem. Autenticação futura deve permitir gerenciadores, colagem de senha e alternativas acessíveis (3.3.8); evitar entrada redundante (3.3.7).

## Próximas etapas técnicas

1. Ajustar objetivos e cronograma; confirmar identidade visual com o usuário.
2. Criar API Express e migrações PostgreSQL para usuárias, gestações, compromissos, registros, lembretes e eventos de auditoria.
3. Implementar autenticação e autorização por proprietária em cada recurso; hash de senha, sessão segura, HTTPS, validação no servidor, política de retenção e direitos sobre dados. A escolha de sessão/JWT deve ser documentada.
4. Integrar cinco tipos de lembretes reais (consultas, exames, vacinas, medicamentos, medições), com permissão explícita, conteúdo discreto e fallback interno.
5. Documentar e validar pelo menos dez regras com fontes oficiais, revisão profissional e limites explícitos. Não inventar limiares clínicos para preencher a meta.
6. Integrar IA somente pelo servidor, com chave secreta, minimização dos dados enviados, limites de uso e testes de diagnóstico/prescrição e sinais de alerta. A IA não deve decidir classificação clínica.
7. Criar pelo menos trinta cenários funcionais, meta de 90% de aprovação, testes de acessibilidade e avaliação com dez usuários conforme procedimentos institucionais.

## Referências do projeto de interface

- Nielsen Norman Group: https://www.nngroup.com/articles/ten-usability-heuristics/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Referência rápida: https://www.w3.org/WAI/WCAG22/quickref/

## Verificação desta entrega

Sintaxe JavaScript, contraste da paleta e testes de lógica com DOM simulado verificados por ferramentas locais. Os testes cobrem as seis telas, escape de conteúdo, validação obrigatória, criação e edição de registro. Nenhum navegador automatizado ou leitor de tela foi utilizado nesta etapa; nenhuma conformidade completa foi comprovada. Os testes manuais permanecem obrigatórios antes da versão funcional real.

## Atualização visual de 5 de outubro de 2026

Paleta solicitada pelo usuário: branco, lilás claro e rosa suave nos fundos; roxo e ameixa nos textos, botões e foco para preservar contraste. Contrastes calculados: texto #392d46 sobre #fcfaff, texto secundário #685b73 sobre #fcfaff, branco sobre botão #70438a e borda #9986a5 sobre branco. Testes manuais de acessibilidade continuam pendentes.

## Espaço reservado para IA

A área Orientações contém a seção Assistente GestarBem, com aviso Em breve, temas ilustrativos e formulário indisponível. Há acesso pelo painel. Nenhum envio, interpretação clínica ou compartilhamento com IA está implementado. Na integração futura, preservar limites informativos, minimização dos dados e validação de respostas definidos no pré-projeto.

## Executar o protótipo do repositório

Sirva a pasta frontend com um servidor estático (por exemplo, extensão Live Server do VS Code). Não há instalação de dependências para o frontend. Para verificar a lógica, execute na raiz do repositório: `node tests/interface.test.cjs`. Node.js deve estar instalado. O teste usa DOM simulado; não comprova conformidade WCAG.
