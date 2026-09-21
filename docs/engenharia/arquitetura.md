# Arquitetura do Sistema — GestarBem

## 1. Visão geral

O GestarBem será desenvolvido como uma plataforma web para auxiliar no
acompanhamento pré-natal.

A solução será organizada em camadas, permitindo a separação entre a
interface utilizada pela gestante, o backend responsável pelo processamento
das informações e o banco de dados responsável pelo armazenamento dos dados.

## 2. Arquitetura proposta

A arquitetura inicial será composta pelos seguintes componentes:

- Front-end;
- Backend;
- API REST;
- Banco de dados;
- Serviço de autenticação;
- Serviço de inteligência artificial;
- Serviço de notificações.

### Fluxo geral

Usuária
↓
Front-end
↓
API REST
↓
Backend
↓
Banco de dados

O backend também poderá realizar integração com:

- Serviço de inteligência artificial;
- Serviço de notificações.

## 3. Front-end

O front-end será responsável pela interação da usuária com a plataforma.

Tecnologias previstas:

- HTML;
- CSS;
- JavaScript.

A interface permitirá o acesso às funcionalidades do sistema, incluindo:

- Cadastro e perfil;
- Acompanhamento da gestação;
- Agenda;
- Lembretes;
- Consultas;
- Exames;
- Vacinas;
- Medicamentos;
- Sintomas;
- Alertas;
- Sugestões geradas pela inteligência artificial.

## 4. Backend

O backend será responsável pelo processamento das informações,
implementação das regras de negócio e comunicação entre o front-end,
banco de dados e serviços externos.

Tecnologias previstas:

- Node.js;
- Express.js.

O Express.js será utilizado para construção da API REST.

## 5. Banco de dados

O banco de dados previsto é o PostgreSQL.

Será utilizado para armazenar, entre outras informações:

- Dados da usuária;
- Informações da gestação;
- Consultas;
- Exames;
- Vacinas;
- Medições;
- Medicamentos;
- Sintomas;
- Lembretes;
- Alertas;
- Informações relacionadas às sugestões.

## 6. Autenticação e controle de acesso

A plataforma deverá possuir mecanismos de autenticação e controle de
acesso.

Está prevista a utilização de JWT ou solução equivalente.

O objetivo é impedir o acesso indevido às informações armazenadas no
sistema.

## 7. Inteligência artificial

A inteligência artificial será integrada por meio de uma API de modelo
de linguagem.

Sua utilização será exclusivamente sugestiva e informativa.

A IA não deverá:

- realizar diagnósticos;
- prescrever medicamentos;
- determinar tratamentos;
- realizar decisões clínicas;
- substituir profissionais de saúde.

A função da IA será auxiliar na geração de sugestões e informações gerais
relacionadas ao período gestacional.

## 8. Notificações

O sistema poderá utilizar Firebase Cloud Messaging ou solução equivalente
para o envio de lembretes e notificações compatíveis com o ambiente web.

Os lembretes poderão estar relacionados a:

- Consultas;
- Exames;
- Vacinação;
- Medicamentos;
- Medições;
- Outras atividades relacionadas ao pré-natal.

## 9. Segurança e privacidade

Como o sistema trabalhará com informações relacionadas à saúde, serão
considerados mecanismos de:

- Autenticação;
- Controle de acesso;
- Criptografia na comunicação;
- Armazenamento seguro;
- Registro de operações relevantes.

Também serão considerados os princípios aplicáveis da LGPD.

## 10. Diagrama simplificado

```text
┌─────────────────────┐
│       Gestante      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Front-end      │
│ HTML/CSS/JavaScript │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      API REST       │
│       Express       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Backend       │
│       Node.js       │
└──────┬─────┬────────┘
       │     │
       │     ├──────────────────┐
       │     ▼                  ▼
       │  ┌─────────────┐  ┌─────────────┐
       │  │ Inteligência│  │Notificações │
       │  │ Artificial  │  │             │
       │  └─────────────┘  └─────────────┘
       │
       ▼
┌─────────────────────┐
│     PostgreSQL      │
└─────────────────────┘



### Commit

Na parte inferior:

```text
docs: documenta arquitetura do sistema
