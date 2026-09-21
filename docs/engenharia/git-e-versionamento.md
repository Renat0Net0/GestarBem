# Git e Versionamento — GestarBem

## 1. Objetivo

O Git será utilizado como sistema de controle de versão do projeto
GestarBem, permitindo acompanhar alterações realizadas no código,
manter diferentes versões do sistema e facilitar o trabalho colaborativo
entre os integrantes.

O GitHub será utilizado como plataforma de hospedagem do repositório.

## 2. Branches

O projeto utilizará inicialmente três tipos de branches:

### principal

Representará a versão estável do sistema.

### develop

Será utilizada para integração das funcionalidades em desenvolvimento.

### feature

Será utilizada para o desenvolvimento de funcionalidades específicas.

Exemplos:

- feature/cadastro
- feature/agenda
- feature/acompanhamento
- feature/exames
- feature/ia

## 3. Fluxo de desenvolvimento

O fluxo básico será:

```text
develop
   ↓
feature/nova-funcionalidade
   ↓
desenvolvimento
   ↓
commit
   ↓
push
   ↓
Pull Request
   ↓
develop
