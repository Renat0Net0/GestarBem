# GestarBem — Nielsen e WCAG 2.2 AA

Revisão de 15/10/2026. A meta permanece WCAG 2.2 nível AA, abrangendo critérios A e AA aplicáveis, páginas completas e fluxos completos. Esta documentação não constitui declaração de conformidade. Remover rótulos de demonstração não muda o estado da avaliação.

## Escopo atual

Entrada, login/cadastro, painel/perfil/assistente, agenda, registros/gráficos, histórico, configurações, resumo e ajuda. Frontend HTML/CSS/JavaScript servido pelo backend Express com PostgreSQL. A tela antiga em app.js não é carregada pela entrada atual e não integra esta revisão; não reativá-la sem avaliação.

## Correções desta revisão

- Navegação da conta na mesma ordem nas seis telas autenticadas, incluindo ajuda e configurações; página atual identificada onde há item correspondente.
- Controles Calendário e Lista com texto visível além dos ícones; orientação de rolagem e alternativa em lista.
- Mensagem de erro da IA associada ao campo de pergunta e confirmação; aria-invalid, foco no campo e limpeza do estado ao limpar.
- Nova tentativa de carregar a IA sem recarregar toda a página; retorno de foco ao estado após nova tentativa.
- Alvo da confirmação da IA ampliado pelo rótulo, foco reforçado e estados selecionados com sublinhado/contorno, além da cor.
- Quebra de ações e colunas que podem encolher em telas estreitas; foco interno nas células do calendário e suporte a cores forçadas.
- Preservadas confirmação de exclusão, mensagens de andamento, cancelar/Escape, retorno ao acionador e conteúdo após erro.

## Heurísticas de Nielsen

| Heurística | Evidência de implementação | Avaliação restante |
|---|---|---|
| Visibilidade do estado | Carregamento, salvamento, conclusão, paginação e retorno da IA em texto | Anúncio efetivo com leitor de tela |
| Correspondência com o mundo real | Vocabulário do acompanhamento, datas brasileiras, unidades nos registros | Compreensão com participantes |
| Controle e liberdade | Cancelar/Escape, editar/reabrir, confirmação antes de excluir, limpar IA | Fluxos completos com teclado; exclusão não tem desfazer após confirmação |
| Consistência e padrões | Navegação da conta na mesma ordem e ajuda na mesma posição | Conferência visual entre telas |
| Prevenção de erros | Validação, limites de datas, confirmação de senha e exclusão | Rodada formal com PostgreSQL |
| Reconhecimento | Rótulos permanentes, filtros nomeados, botões Calendário/Lista e contexto da IA | Observação de tarefas |
| Eficiência | Filtros, calendário/lista, paginação e atalhos do painel | Tempo e dificuldades nas tarefas |
| Minimalismo | Conteúdo organizado por seção, filtros recolhíveis, detalhes sobre IA | Avaliação com usuários |
| Recuperação de erros | Erros em texto, campo inválido e foco; nova tentativa da IA | Falhas reais de rede e leitor de tela |
| Ajuda | Ajuda e privacidade consistente, instruções em formulários e unidades | Clareza do conteúdo |

## Matriz WCAG — acompanhamento, sem certificação

“Código” significa evidência de implementação ou inspeção estática; não aprovação do critério. A avaliação deve considerar todos os critérios aplicáveis na versão final.

| Critérios | Evidência ou situação | Pendência |
|---|---|---|
| 1.1.1 | SVG de gráfico nomeado e descrito; tabela equivalente; ícones decorativos ocultos | Leitura de gráfico/tabela no leitor de tela |
| 1.2.1–1.2.5 | Não há áudio/vídeo nas páginas revisadas | Reavaliar se mídia for incorporada |
| 1.3.1–1.3.3 | Estrutura, rótulos, regiões e instruções textuais | Ordem e relações no navegador/leitor |
| 1.3.4 | Layout sem bloqueio de orientação | Retrato e paisagem em dispositivo |
| 1.3.5 | Autocomplete nos campos de conta e senha | Conferir preenchimento automático real |
| 1.4.1–1.4.3 | Estados textuais, linhas diferenciadas e contraste da paleta calculado; sem áudio automático | Medir demais combinações, gradientes e estados |
| 1.4.4–1.4.5 | Texto HTML e unidades em texto; gráfico possui tabela | Ampliação de 200% |
| 1.4.10 | Ações quebram linha; colunas minmax(0,1fr); calendário/tabela em região de rolagem | Reflow a 320 CSS px e zoom de 400%, sem perda; verificar exceção de tabela |
| 1.4.11 | Bordas e foco com cores definidas | Contraste dos componentes em todos os estados |
| 1.4.12–1.4.13 | Alturas de texto flexíveis; sem conteúdo customizado dependente de hover | Espaçamento de texto e revisão de hover/foco |
| 2.1.1–2.1.2, 2.1.4 | Controles nativos e diálogos com Escape; sem atalhos de uma letra | Percurso completo, calendário e ausência de armadilhas |
| 2.2.1–2.2.2 | Sessão de oito horas; sem conteúdo animado obrigatório | Avaliar expiração de sessão e preservação/recuperação de trabalho; não dar este item como atendido |
| 2.3.1 | Sem efeitos intermitentes no código revisado | Verificação visual |
| 2.4.1–2.4.7 | Salto para main, títulos, h1, navegação, rótulos e foco | Ordem, destinos, nomes e foco visível em todos os fluxos |
| 2.4.11 | Margem de rolagem/foco e tratamento em região do calendário | Confirmar que o foco não fica totalmente oculto por conteúdo |
| 2.5.1–2.5.4, 2.5.7 | Sem gestos complexos ou arraste obrigatório; botões nativos | Verificar cancelamento de ponteiro e comandos de voz |
| 2.5.8 | Controles principais de 44px, rótulos clicáveis e confirmação da IA ampliada | Medir geometria/espaçamento dos demais alvos no navegador; 44px é escolha do projeto, não o mínimo AA de 24px |
| 3.1.1–3.1.2 | pt-BR e conteúdo principal em português | Trechos gerados e mudanças de idioma |
| 3.2.1–3.2.4, 3.2.6 | Ações explícitas; ajuda e navegação consistentes | Testar previsibilidade e consistência entre estados |
| 3.3.1–3.3.4 | Erros associados, validações, confirmação de exclusão e edição | Processos completos e mensagens do servidor |
| 3.3.7–3.3.8 | Colagem/gerenciadores permitidos, autocomplete e mostrar senha | Autenticação real, entradas redundantes e preenchimento automático |
| 4.1.2–4.1.3 | Nome/papel/estado, referências ARIA e mensagens de estado | NVDA e browser: anúncios sem depender de mudança de foco |

## Contraste calculado

Fórmula de luminância relativa sRGB. Resultados arredondados; não substituem inspeção dos fundos reais, opacidade e estados.

| Primeiro plano / fundo | Razão |
|---|---:|
| #392d46 / #fcfaff | 12,37:1 |
| #685b73 / #f2ebf8 | 5,41:1 |
| #ffffff / #70438a | 7,35:1 |
| #9986a5 / #ffffff (borda) | 3,33:1 |
| #74325c / #fcebf2 | 7,78:1 |

## Verificações executadas

- Nove páginas: idioma, título, um h1/main, IDs únicos, destinos de referências ARIA, rótulos de todos os inputs/selects/textareas e link de salto presentes.
- Sintaxe de todos os scripts frontend.
- Cinco cenários da IA com DOM/API simulados: pergunta vazia, consentimento ausente, resposta/fonte, falha de envio preservando pergunta e nova tentativa após falha de disponibilidade.
- 34 testes backend aprovados; não são testes WCAG.
- Nenhuma chamada paga de IA foi executada.
- Não foi possível executar navegador automatizado: Chromium ausente e download falhou. Não houve verificação visual, axe ou leitor de tela nesta rodada.

## Roteiro de aceitação pendente

Registrar commit, navegador, sistema, data, responsável e evidências por item. Usar dados fictícios.

1. Percorrer cadastro/login, painel/perfil, agenda, registros, gráficos, histórico, senha, IA, resumo e ajuda usando Tab/Shift+Tab, Enter, Espaço e Escape.
2. Conferir foco ao abrir, cancelar, salvar, excluir, paginar, falhar e tentar novamente; examinar foco nas bordas de regiões roláveis.
3. Verificar 200% de ampliação, 400% e viewport de 320 CSS px. Testar texto com espaçamento de linha 1,5, parágrafos 2em, letras 0,12em e palavras 0,16em.
4. NVDA com navegador compatível: rótulos/unidades, títulos, diálogos, erros, mensagens, estados selecionados, resultado da IA e tabela do gráfico.
5. Conferir contraste dos estados restantes, cores forçadas e geometria de alvos; validar retrato e paisagem.
6. Revisar expiração de sessão e recuperação dos dados preenchidos; concluir processos de autenticação com gerenciador e colagem de senha.
7. Rodar scanner automatizado como apoio e inspecionar os problemas; resultados de scanner não certificam a página.
8. Executar os 30 cenários funcionais e protocolo de usabilidade com dez participantes, separadamente.

Falhas devem virar pendências com critério afetado, reprodução, impacto, correção e reteste. Só declarar conformidade após avaliar todos os critérios A/AA aplicáveis nas páginas e processos completos.

## Referências

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Nielsen Norman Group: https://www.nngroup.com/articles/ten-usability-heuristics/
- Protocolo de usabilidade: testes-usabilidade.md
- Cenários funcionais: testes-funcionais.md
