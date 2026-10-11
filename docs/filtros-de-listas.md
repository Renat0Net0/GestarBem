# Filtros da agenda e do histórico

A agenda permite combinar busca textual, tipo e situação (todos, agendados ou concluídos). Os registros combinam busca textual e tipo. A busca ignora maiúsculas e acentos e considera título/valor, tipo e observações.

Os filtros operam apenas sobre os dados da conta já carregados pela API. Não alteram ou excluem dados, não são persistidos ao sair da página e não filtram lembretes ou contagens do painel. O botão Limpar filtros restaura a lista completa. Uma lista vazia tem mensagem diferente de uma busca sem resultados.

Os controles têm rótulos, a contagem usa role=status e o layout permite reorganização em telas estreitas. Se concluir ou editar um item o retirar dos resultados, o foco retorna ao botão de criação. A validação manual de teclado, leitor de tela e layout permanece pendente.

## Atualização local

Substituir frontend/agenda.html, agenda.js, records.html, records.js e agenda.css pela versão da branch feat/prototipo-acessivel. Atualizar o navegador com Ctrl+F5. Não há migração de banco nem mudança no backend.

## Conferência sugerida

- Buscar uma palavra do título, valor ou observação.
- Buscar vacinacao sem acentos e verificar o tipo Vacinação.
- Combinar busca e tipo; na agenda também situação.
- Usar texto inexistente e conferir mensagem de ausência de resultados.
- Limpar filtros e conferir todos os cards.
- Concluir um item no filtro Agendados; conferir sua saída da lista e destino do foco.
- Editar tipo ou valor de um item sob filtro; conferir nova lista e persistência após recarregar.
