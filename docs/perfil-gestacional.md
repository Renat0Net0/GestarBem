# Perfil gestacional persistente

A tela account.html exibe a conta autenticada e o formulário de DUM e observações. GET /api/profile consulta e POST /api/profile salva o perfil da conta da sessão. O servidor ignora identificadores de proprietária enviados pelo cliente e utiliza req.user.id em ambas as consultas. SQL parametrizado; uma linha por usuária; atualização atômica por UPSERT. Campos opcionais podem ser limpos. A DUM retorna como YYYY-MM-DD, evitando deslocamento de dia na conversão do PostgreSQL.

A estimativa é diferença de dias de calendário entre DUM e hoje, sem representar datação clínica. Só é exibida até 42 semanas; fora da faixa, orientar conferência com o profissional. Não há regra de diagnóstico. Observações limitadas a 1.000 caracteres, data real válida sem futuro, validação no servidor e mensagens por campo no navegador.

## Atualização no Windows

1. Pare o backend com Ctrl+C e preserve backend/.env.
2. Baixe feat/prototipo-acessivel pelo GitHub. Copie backend/server.mjs, backend/package.json, backend/profile.mjs e backend/profile.test.mjs; frontend/account.html e frontend/profile.js; database/002-profile.sql para as pastas correspondentes em C:\Projetos\GestarBem. As dependências não mudaram.
3. Abra SQL Shell (psql) e conecte ao servidor com as credenciais locais. Execute `\c gestarbem` e depois `\i 'C:/Projetos/GestarBem/database/002-profile.sql'`. Aplicar uma vez. Não executar novamente 001-auth.sql; não apagar o banco nem as contas existentes.
4. Execute `\dt` para confirmar gestational_profiles além de users e sessions. Saia com `\q`.
5. No CMD, `cd /d C:\Projetos\GestarBem\backend`, execute `npm test`, depois `npm start`.
6. Abra http://localhost:3000 e entre. Atualize com Ctrl+F5 se necessário.

## Verificação com dados fictícios

- Salvar DUM e observação e verificar confirmação e estimativa.
- Recarregar e sair/entrar; verificar recuperação dos valores.
- Alterar sem salvar e clicar Cancelar alterações; verificar restauração do último perfil carregado/salvo.
- Limpar os campos e salvar; verificar remoção dos valores antigos.
- Testar data futura, inexistente e texto longo; não deve gravar dados inválidos.
- Entrar em segunda conta; deve começar com perfil vazio e nunca exibir dados da primeira. Salvar perfil diferente e confirmar ambos após alternar contas.
- Após saída, chamadas GET e POST /api/profile devem retornar 401. POST autenticado com user_id de outra conta deve continuar atualizando somente a conta da sessão.
- Interromper servidor durante tentativa de salvar; verificar erro e preservação dos campos.
- Testar teclado, foco, mensagens com leitor de tela, zoom e largura de 320 pixels.

## Evidência e pendências

Sintaxe JavaScript verificada e sete testes unitários de autenticação e validação passaram. Revisão das consultas confirma filtro por sessão e parâmetros. Migração e endpoints não foram executados com PostgreSQL neste ambiente; persistência real e isolamento precisam da verificação manual acima. Acessibilidade completa e conformidade WCAG continuam pendentes. Dados reais não devem ser usados nesta fase.

Agenda e registros continuam na demonstração temporária em index.html. O perfil autenticado aparece em account.html, sem preencher o perfil fictício do protótipo. O site estático publicado não executa a API local.
