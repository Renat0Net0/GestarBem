# Cadastro e login integrados

Ao executar o backend, http://localhost:3000 abre login.html. Criar uma conta exibe nome, e-mail, senha e confirmação. Após o cadastro, entre com as mesmas credenciais. A tela account.html consulta a sessão no servidor e permite sair. index.html continua a demonstração com dados temporários; não contém informações da conta autenticada.

## Atualizar a instalação existente no Windows

Pare o servidor com Ctrl+C. Baixe a branch feat/prototipo-acessivel. Copie frontend/login.html, frontend/account.html, frontend/auth.css, frontend/auth-ui.js e os arquivos backend/server.mjs, backend/auth.mjs e backend/auth.test.mjs para as mesmas pastas em C:\Projetos\GestarBem. Preserve backend/.env. Não reaplique a migração SQL: as tabelas existentes já atendem esta etapa.

No CMD:

```
cd /d C:\Projetos\GestarBem\backend
npm test
npm start
```

Abra http://localhost:3000. Use esse endereço, conforme APP_ORIGIN, sem alternar para 127.0.0.1 ou abrir HTML diretamente.

## Verificação manual com dados fictícios

1. Criar conta válida; verificar transição para entrada e mensagem de solicitação recebida.
2. Tentar campos vazios, e-mail inválido, senha curta e confirmação diferente; verificar mensagens e foco no primeiro erro.
3. Entrar com senha incorreta; verificar mensagem sem revelar existência de conta.
4. Entrar com credenciais corretas; verificar nome e e-mail da API.
5. Recarregar account.html; verificar sessão preservada.
6. Sair; abrir account.html novamente e verificar retorno ao login.
7. Interromper servidor; verificar mensagem de conexão e possibilidade de tentar novamente.
8. Operar todos os controles por teclado; verificar foco, leitura de erros e status com leitor de tela, zoom e tela estreita.

## Implementação e limites

Rótulos permanentes, campos nativos, erros por campo, foco no primeiro erro, mensagens de andamento, botão mostrar/ocultar senha, suporte a colagem e gerenciadores de senha. Não há armazenamento de senha ou token no localStorage. Nomes da API são inseridos como texto, sem interpolação HTML.

Sintaxe JavaScript e quatro testes unitários de autenticação verificados no ambiente de desenvolvimento. A execução anterior do servidor e a conexão ao PostgreSQL foram confirmadas pelo usuário; esta nova integração ainda exige os testes manuais acima com seu banco local. Conformidade WCAG e avaliação completa de Nielsen permanecem pendentes.

Ainda não há persistência do perfil gestacional, agenda ou registros, recuperação de senha, verificação de e-mail, notificações, regras clínicas nem IA ativa. O site publicado permanece uma demonstração estática; esta etapa funciona através do backend local.
