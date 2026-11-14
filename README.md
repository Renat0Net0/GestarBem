<div align="center">

# GestarBem

**Plataforma web para organizar consultas, lembretes e registros do pré-natal.**

![Frontend HTML CSS JavaScript](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-7543A8)
![Node.js 24+](https://img.shields.io/badge/Node.js-24%2B-6C3BAA)
![PostgreSQL](https://img.shields.io/badge/Banco-PostgreSQL-563182)

[Aplicação online](https://gestarbem.onrender.com) · [Reportar problema ou sugerir melhoria](https://github.com/Renat0Net0/GestarBem/issues)

</div>

## Sobre o projeto

O GestarBem reúne informações do pré-natal que podem ficar dispersas entre anotações, agendas e aplicativos. A plataforma foi desenvolvida como Trabalho de Conclusão de Curso em Sistemas de Informação no Centro Universitário FAMETRO, com foco no uso por gestantes.

| Funcionalidade | O que permite fazer |
| --- | --- |
| Perfil gestacional | Informar a data da última menstruação (DUM) e consultar a idade gestacional estimada. |
| Agenda e lembretes | Registrar compromissos, consultar datas e acompanhar lembretes. |
| Registros e resumo | Organizar informações do acompanhamento e consultar os dados salvos. |
| Histórico de atividades | Consultar ações recentes do perfil, da agenda e dos registros. |
| Auxílio rápido e assistente | Acessar orientações gerais e esclarecer dúvidas relacionadas à gestação. |
| Configurações da conta | Alterar senha, exportar dados em JSON ou excluir a conta. |

## Demonstração

[Abrir a tela inicial do GestarBem](https://gestarbem.onrender.com/login.html)

[Assistir à demonstração completa no YouTube (2 min 22 s)](https://youtu.be/lUewZ3geTK8)

### Capturas de tela

| Login | Agenda | Assistente |
| --- | --- | --- |
| [![Tela de login com campos de e-mail e senha](docs/demo/login.png)](docs/demo/login.png) | [![Calendário mensal com consultas agendadas](docs/demo/agenda.png)](docs/demo/agenda.png) | [![Formulário do assistente com opções de contexto](docs/demo/assistente.png)](docs/demo/assistente.png) |

### Cadastro de uma consulta

O GIF mostra como cadastrar uma consulta, configurar o lembrete para o dia do compromisso e conferir o evento no calendário.

![Cadastro de uma consulta e confirmação no calendário](docs/demo/demonstracao.gif)

## Como usar

1. Abra a aplicação e crie uma conta.
2. Acesse o painel e preencha o perfil gestacional. A DUM pode ser informada depois.
3. Na agenda, cadastre um compromisso futuro e configure um lembrete.
4. Em registros, selecione o tipo de acompanhamento e preencha os campos correspondentes.
5. Consulte o resumo e o histórico para revisar as informações registradas.

## Tecnologias

- **Interface:** HTML, CSS e JavaScript.
- **Servidor:** Node.js, Express, Helmet e express-rate-limit.
- **Dados:** PostgreSQL, com Neon na implantação.
- **Serviços:** Render para hospedagem e API da OpenAI para o assistente.
- **Versionamento:** Git e GitHub.

## Instalação local

Pré-requisitos: Git, Node.js 24 ou superior, npm e uma instância PostgreSQL com as tabelas do GestarBem inicializadas.

```bash
git clone https://github.com/Renat0Net0/GestarBem.git
cd GestarBem/backend
npm install
```

Crie o arquivo `backend/.env` com a conexão do seu banco:

```dotenv
DATABASE_URL=postgresql://usuario:senha@localhost:5432/gestarbem
APP_ORIGIN=http://localhost:3000
PORT=3000
```

Para ativar o assistente localmente, configure também `AI_ENABLED=true`, `OPENAI_API_KEY` e, se necessário, `OPENAI_MODEL`. Mantenha suas credenciais no arquivo de ambiente local.

```bash
npm start
```

Abra [localhost:3000](http://localhost:3000). Para checar a conexão com o banco, acesse [localhost:3000/api/health](http://localhost:3000/api/health).

## Estrutura do projeto

| Caminho | Conteúdo |
| --- | --- |
| [frontend/](frontend/) | Páginas e recursos da interface web. |
| [backend/](backend/) | Servidor, módulos de autenticação, perfil, agenda, registros, lembretes, assistente e testes. |
| [backend/server.mjs](backend/server.mjs) | Ponto de entrada do servidor Express. |

## Testes

Na pasta `backend`, execute:

```bash
npm test
```

O comando cobre autenticação, perfil, agenda, registros, lembretes, configurações, assistente e dados da conta. O histórico possui um teste de integração separado, executável com `npm run test:activity:db` em um banco preparado para testes.

## Equipe

- Kenderson Montero Rodrigues
- Renato Campos Florêncio Neto
- Orientação de Prof.ª MBA Luana Leal
