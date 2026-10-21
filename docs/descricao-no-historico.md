# Descrição junto da data no histórico

A API consulta o item atual com LEFT JOIN por UUID e proprietária. A interface mostra a data/hora da atividade junto do tipo e valor do registro ou tipo e título do compromisso, sem botão Ver. Também mostra separadamente a data do item, quando aplicável. Não copia conteúdo para activity_log; alterações no item podem atualizar a descrição de atividades antigas. A indicação Dados atuais evita apresentar essa descrição como uma fotografia histórica.

Quando o item não existe mais, os detalhes ficam indisponíveis. Os logs anteriores não permitem recuperar valores excluídos. Não se reconstrói conteúdo nem se considera o título atual como valor anterior à edição. Perfil mostra apenas identificação do módulo. UUIDs deixam de ocupar a apresentação principal.

Atualizar backend/activity.mjs e frontend/activity.js. Reiniciar o backend; Ctrl+F5 no histórico. Sem migração. Consulta SQL revisada e API simulada; integração real PostgreSQL e layout pendentes.
