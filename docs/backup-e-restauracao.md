# Backup e restauração do PostgreSQL

O script scripts/backup.ps1 gera um arquivo PostgreSQL no formato custom, sem sobrescrever backups anteriores. Usa pg_dump e verifica o catálogo com pg_restore --list. Senha solicitada pelo próprio PostgreSQL; não colocá-la no comando, script, documentação ou GitHub. O script não lê nem altera backend/.env. Não instala tarefas agendadas e não restaura bancos automaticamente.

## Fazer uma cópia

Copiar scripts/backup.ps1 para C:\Projetos\GestarBem\scripts\backup.ps1. No PowerShell:

    cd C:\Projetos\GestarBem
    powershell -NoProfile -File .\scripts\backup.ps1

Digite a senha do usuário postgres quando solicitada. O script usa PostgreSQL 18 em C:\Program Files\PostgreSQL\18\bin e banco gestarbem em localhost:5432. O destino padrão é a pasta GestarBemBackups dentro de Documentos do Windows; o caminho exato aparece ao finalizar. Se Documentos estiver sincronizado com um serviço de nuvem, o arquivo poderá ser sincronizado conforme a configuração do Windows. Escolha um destino local se preferir, por exemplo:

    powershell -NoProfile -File .\scripts\backup.ps1 -OutputDirectory 'C:\Backups\GestarBem'

Se a execução estiver bloqueada por política, não altere a política global sem verificar a configuração da máquina. O arquivo pode ser inspecionado antes da execução.

O backup contém os dados de todas as contas, inclusive hashes de senhas, sessões, informações de saúde e histórico. O formato custom não é criptografia. Guarde em pasta protegida e não envie ao GitHub. .gitignore exclui extensões dump/backup e a pasta backups, mas isso não protege arquivos já versionados nem cópias renomeadas. Permissões, criptografia, retenção e uma segunda cópia segura precisam de definição operacional antes de uso real.

## Conferir restauração sem tocar no banco atual

Esta etapa é para a rodada final. Feche o backend para não confundir o banco de demonstração com o de restauração. Crie um banco novo e vazio com nome exclusivo, por exemplo gestarbem_restore_teste_20261012. Se o nome já existir, createdb falhará: não apague o banco existente; escolha outro nome.

No PowerShell, com os comandos em linhas separadas:

    & 'C:\Program Files\PostgreSQL\18\bin\createdb.exe' -h localhost -p 5432 -U postgres -W gestarbem_restore_teste_20261012

Depois de confirmar que a criação terminou sem erro, substitua o caminho do arquivo no comando seguinte pelo caminho impresso pelo backup:

    & 'C:\Program Files\PostgreSQL\18\bin\pg_restore.exe' -h localhost -p 5432 -U postgres -W --dbname gestarbem_restore_teste_20261012 --no-owner --no-privileges --single-transaction --exit-on-error 'C:\Backups\GestarBem\NOME-DO-ARQUIVO.dump'

Não executar esse comando apontando para gestarbem. Não usar --clean no banco atual. Restaurar somente arquivos produzidos por você ou por fonte confiável, pois backups podem conter comandos SQL.

Para inspecionar o banco restaurado:

    & 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -p 5432 -U postgres -d gestarbem_restore_teste_20261012

Somente depois do prompt do psql:

    \dt
    SELECT count(*) FROM users;
    SELECT count(*) FROM gestational_events;
    SELECT count(*) FROM gestational_records;
    SELECT count(*) FROM activity_log;
    SELECT tgname FROM pg_trigger WHERE NOT tgisinternal ORDER BY tgname;
    \q

Comparar contagens e gatilhos com o banco de origem no momento do backup. Isso ainda não substitui verificar leitura e escrita por uma instância do site ligada exclusivamente ao banco de teste. A recuperação completa da aplicação fica pendente até essa validação. Sessões restauradas exigem tratamento antes de uso em outro ambiente; não expor uma cópia como se fosse produção.

## Evidências e limitações

Registrar data, versão, tamanho do arquivo, resultado do catálogo e restauração, contagens e responsável. Não publicar dados ou arquivo de backup nas evidências. Uma cópia criada com sucesso não demonstra, por si só, restauração completa nem disponibilidade do serviço.

O script e os comandos foram revisados, mas não executados no Windows/PostgreSQL do usuário. A verificação real integra a rodada final, conforme combinado.
