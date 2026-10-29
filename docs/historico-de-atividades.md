# Histórico de atividades

A migração 007-activity.sql cria activity_log e gatilhos nas tabelas de perfil, compromissos e registros. Cada INSERT/UPDATE/DELETE registra proprietária, tipo de entidade, UUID do item, operação e data. Não persiste valores anteriores/novos, nomes, e-mails, IP, observações, medições, senhas ou tokens. A conversão da linha para JSON é apenas intermediária em memória na função do gatilho; não é armazenada no log.

O gatilho executa dentro da mesma transação da modificação: uma falha na gravação da atividade também impede a modificação. Operações anteriores à instalação não são reconstruídas. Concluir/reabrir ou marcar lembrete como visto altera o compromisso e gera updated. Leituras, login/logout e seleções temporárias de atenção não são registrados nesta etapa. Uma edição sem mudança efetiva também pode gerar updated.

O vínculo é com a proprietária do dado. A função não identifica um operador distinto em alterações diretas por administradores no banco. Esse histórico não é prova inviolável nem substitui auditoria de infraestrutura. O usuário atual de banco possui privilégios elevados; separar privilégios e definir retenção/descarte antes de produção. O log não tem chave estrangeira com exclusão em cascata, para não apagar automaticamente o histórico; a política de retenção ainda precisa ser definida.

GET /api/activity usa requireUser e WHERE owner_user_id=$1 com req.user.id. Retorna as 50 atividades mais recentes, sem aceitar identificador de proprietária do cliente. A página activity.html acessa apenas a API e limpa a exibição em falhas ou ao sair; link no painel. Não há edição/exclusão pela interface nem envio externo.

## Instalação no Windows

Copiar database/007-activity.sql; backend/activity.mjs e server.mjs; frontend/activity.html, activity.js e account.html. Preservar backend/.env.

Abrir psql pelo PowerShell:

    & "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe" -h localhost -p 5432 -U postgres -d gestarbem

Somente depois de aparecer gestarbem=#:

    \\i 'C:/Projetos/GestarBem/database/007-activity.sql'
    \\q

Parar o servidor com Ctrl+C no terminal que o está executando e iniciar novamente com npm start na pasta backend. Atualizar o painel com Ctrl+F5.

## Verificações pendentes

PostgreSQL real: instalação e atomicidade dos gatilhos; criação/edição/exclusão em cada módulo; rollback sem atividade persistida; isolamento entre contas; conclusão/lembrete; mais de 50 atividades e histórico de item excluído. Não considerar dados anteriores como automaticamente auditados. A sintaxe JavaScript e a consulta de proprietária foram verificadas por simulação, sem executar a migração neste ambiente.
