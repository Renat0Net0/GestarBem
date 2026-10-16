# Consulta do item pelo histórico

Ver registro e Ver compromisso abrem o formulário existente com os dados atuais do item, permitindo consulta e edição. Cancelar não modifica informações. Ver perfil navega para a seção de perfil. Os dados exibidos são atuais, não uma cópia dos valores na data da atividade.

Atividades referentes a itens excluídos (quando a exclusão está nas 50 atividades carregadas) mostram detalhes indisponíveis. Um link antigo também é tratado na página de destino: consulta apenas os itens retornados pela API da conta; item ausente ou de outra conta não é aberto. UUID inválido gera mensagem própria. Não há novo endpoint, duplicação de dados no histórico ou migração. O parâmetro item só identifica um item dentro da coleção já autorizada.

Atualizar frontend/activity.js, agenda.js e records.js. Conferir registro, compromisso, perfil, exclusão, link antigo, falha de carga e conta diferente nos testes finais.
