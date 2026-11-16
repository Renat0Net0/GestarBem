# Calendário mensal da agenda

A agenda abre na visão Calendário, no mês atual de Manaus. Pode alternar para Lista, mantendo a edição, conclusão, exclusão, filtros e paginação existentes. O calendário mostra contagem por dia, horário e até dois títulos; os demais são indicados por quantidade. Selecionar um dia apresenta os cards completos abaixo. Sem dia selecionado, apresenta os cards do mês. A visão Lista consulta todos os resultados dos filtros.

Anterior/Próximo atravessam meses e anos; Mês atual retorna ao mês corrente. Alterar filtros limpa a seleção do dia. A data atual tem indicação acessível além da borda; os botões dos dias possuem data, contagem e estado de seleção. A tabela possui cabeçalhos e legenda. Em telas estreitas, a tabela mantém sete colunas com rolagem horizontal, enquanto os cards ficam abaixo. Selecionar dia move o foco ao título da lista; a seleção não altera os dados.

Não há nova API, migração, pacote ou gravação da preferência. Os compromissos vêm da conta autenticada, conforme a API existente. Não suporta arrastar compromissos entre datas.

## Atualização local

Substituir frontend/agenda.html, agenda.js e agenda.css; Ctrl+F5. Conferir calendário vazio, dias com múltiplos itens, alternância para lista, filtros, mudanças de mês/ano, fevereiro bissexto, criação/edição/exclusão e teclado. Sintaxe e cálculo de meses verificados. Layout real e leitor de tela pendentes na rodada final.
