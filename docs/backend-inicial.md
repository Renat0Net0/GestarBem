# Backend inicial do GestarBem

Esta etapa prepara cadastro, login, consulta da sessão e saída com Node.js, Express e PostgreSQL. O site publicado continua em modo demonstração: a interface ainda não consome essa API e esta API não está hospedada.

## Executar no Windows

1. Verifique `node --version` e `psql --version` no terminal. Se psql não for reconhecido, PostgreSQL pode não estar instalado ou não estar no PATH; procure também pgAdmin no menu Iniciar.
2. Em um PostgreSQL de desenvolvimento, crie o banco gestarbem e aplique database/001-auth.sql pelo Query Tool do pgAdmin. A migração deve ser aplicada uma vez. Use apenas dados fictícios.
3. Abra a pasta backend no terminal e execute `npm install`.
4. Crie backend/.env localmente, sem versionar, com:

```dotenv
DATABASE_URL=postgresql://USUARIO:SENHA@localhost:5432/gestarbem
APP_ORIGIN=http://localhost:3000
PORT=3000
NODE_ENV=development
```

5. Execute `npm test` e `npm start`. Abra http://localhost:3000. O frontend ainda mostra a demonstração; testar API não transforma o dashboard em área autenticada.

## Contrato da API

| Método | Caminho | Entrada ou resultado |
| --- | --- | --- |
| GET | /api/health | Verifica conexão ao banco |
| POST | /api/auth/register | name, email, password, confirmPassword; validação 422 ou resposta genérica 202 |
| POST | /api/auth/login | email e password; cookie de sessão e dados básicos da conta |
| GET | /api/auth/me | Conta da sessão ou 401 |
| POST | /api/auth/logout | Invalida sessão e cookie; 204 |

POST exige o cabeçalho Origin igual a APP_ORIGIN e Content-Type application/json. Em Postman, definir Origin: http://localhost:3000 e manter cookies entre as solicitações. Cadastro não inicia sessão automaticamente. Resposta genérica de cadastro evita revelar existência de endereço; recuperação de conta ainda não implementada.

## Segurança e limites

Senhas com scrypt assíncrono, salt aleatório e comparação segura. Tokens aleatórios, hash no banco, expiração de oito horas, invalidação na saída e rotação no login. Cookies HttpOnly e SameSite Strict, Secure e prefixo __Host- em produção. SQL parametrizado, cabeçalhos Helmet, limite do JSON, restrição de origem e limitação de tentativas por IP. Senhas de 15 a 128 caracteres permitem colagem e gerenciadores, sem regras artificiais de composição.

A limitação em memória serve apenas a um processo; produção requer armazenamento compartilhado, revisão da topologia de proxy, HTTPS, configuração da conexão TLS ao banco, proteção contra abuso distribuído e monitoramento. O servidor escuta localhost por padrão. Não há verificação de e-mail, recuperação, direitos de exclusão/exportação, logs de auditoria nem proteção de dados clínicos implementados. Não usar dados reais nesta etapa.

## Validação

Testes unitários de hash, senha, token e validação de cadastro passaram localmente; sintaxe do servidor verificada. Dependências npm e banco PostgreSQL não foram executados neste ambiente. Endpoints, migração, sessões e integração precisam de testes reais antes de uso.

## Próxima etapa

Conectar formulários acessíveis de cadastro/login ao backend, preservar erros por campo e foco, permitir gerenciadores de senhas, colagem e mostrar/ocultar senha. Acrescentar persistência de perfil e recursos com autorização por proprietária. Autenticação acessível continua sujeita à WCAG 2.2 AA. O modo demonstração deve permanecer explicitamente separado do modo autenticado.
