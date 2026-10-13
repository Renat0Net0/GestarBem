# Estado de implementação — GestarBem

Atualizado em 12/10/2026. Este documento registra implementação, relatos exploratórios e pendências separadamente. Não certifica WCAG, LGPD, segurança clínica ou aprovação dos testes do TCC.

## Funcionalidades

| Módulo | Implementação atual | Pendência de validação |
|---|---|---|
| Cadastro e sessão | Cadastro, login, logout, senha com scrypt e sessão no PostgreSQL | Rodada formal de autenticação e isolamento |
| Configurações da conta | Troca de senha de 6 a 128 caracteres, confirmação, senha atual e encerramento de sessões; seis testes automatizados | Fluxos locais confirmados pelo usuário em 12/10/2026; rodada formal e casos adicionais pendentes (troca-de-senha.md) |
| Perfil | DUM e observações por conta; estimativa gestacional | Revisar cálculo e textos com os cenários finais |
| Agenda | CRUD, concluir/reabrir, datas futuras, filtros, paginação e calendário mensal | Teclado, telas estreitas, viradas de mês e isolamento |
| Registros | CRUD por conta; tipo primeiro e unidades de peso/pressão | Valores inválidos, limites e isolamento |
| Lembretes | Antecedência de 0, 1, 2 ou 7 dias; avisos internos; marcar visto | Demonstrar pelo menos cinco lembretes conforme o objetivo acadêmico; quatro antecedências não equivalem automaticamente a cinco funcionalidades |
| Sinais de atenção | Dez seleções explícitas com orientação local e referências | Revisão clínica e testes; não são dez inferências automáticas sobre o histórico |
| Resumo | Perfil, agenda e registros para imprimir ou salvar PDF pelo navegador | Impressão multipágina, falhas e acessibilidade do resultado |
| Gráficos | Peso e pressão, até 30 medições recentes, tabela equivalente | Layout, leitores de tela e formatos antigos |
| IA | Espaço reservado, sem integração ou envio de dados | Mantida para etapa posterior por decisão do projeto |

Os relatos do usuário confirmam diversos fluxos locais. Eles não substituem a execução documentada dos 30 cenários nem a avaliação com dez participantes.

## Arquitetura em funcionamento

Navegador com HTML/CSS/JavaScript → API Express → PostgreSQL. O backend serve o frontend em localhost:3000. Sessão por cookie HttpOnly, SameSite Strict; token armazenado no banco como hash. A API identifica a conta pela sessão e utiliza consultas parametrizadas. Dados não são guardados em localStorage. O resumo é montado no navegador; o PDF é produzido pelo diálogo de impressão. Gráficos usam SVG, sem serviço externo.

Tabelas utilizadas: users, sessions, gestational_profiles, gestational_events e gestational_records. Migrações já existentes devem ser aplicadas na ordem documentada; não apagar ou recriar tabelas para atualizar o frontend.

## Requisitos não funcionais

| Requisito | Evidência atual | Trabalho restante |
|---|---|---|
| Autenticação e controle de acesso | Sessões, expiração, rotas por proprietária | Testes HTTP/PostgreSQL completos e revisão de falhas |
| Proteção de senhas | Hash scrypt com salt | Revisão de configuração e operação |
| Proteção da comunicação | Configuração de produção exige origem HTTPS e cookie Secure | Implantar e validar TLS no ambiente de hospedagem; localhost atual utiliza HTTP |
| Rastreabilidade | GitHub registra alterações de código | Histórico transacional de perfil/agenda/registros implementado na migração 007; validação PostgreSQL e política de retenção pendentes |
| Confiabilidade | Tratamento de erros, tentativas novamente e 26 testes automatizados aprovados em 12/10/2026 (banco simulado) | Integração real, backup e teste de restauração |
| Acessibilidade e utilização | HTML semântico, rótulos, foco, estados, tabela equivalente aos gráficos | Avaliação final de teclado, leitores de tela, contraste e zoom; não declarar conformidade completa |
| Privacidade | Separação por conta e seleções temporárias locais | Definir retenção, exclusão, transparência, finalidade e procedimentos com a orientação do projeto |
| Desempenho | Pool de conexão, limites de requisição, paginação visual | Medir tempos; paginação visual não limita os dados recebidos da API |
| Versionamento | Branch feat/prototipo-acessivel e PR 16 | Revisar e integrar no fluxo escolhido; o PR aberto não significa merge na main |

## Próximas entregas

1. Aplicar a migração 007 e validar a rastreabilidade de perfil, agenda e registros; a auditoria usa metadados mínimos e não copia o conteúdo de saúde.
2. Definir as informações de privacidade e os procedimentos de gestão de dados para o protótipo, com a orientadora.
3. Preparar backup, restauração e configuração de hospedagem quando houver decisão de implantação.
4. Ao final do desenvolvimento, executar os 30 cenários, registrar evidências, calcular a taxa de aprovação e realizar avaliação de usabilidade com dez participantes conforme testes-usabilidade.md; roteiro preparado, coleta ainda não realizada.

Recuperação de senha, envio de e-mail, notificações externas e IA não estão implementados. Não apresentar esses itens como recursos disponíveis. A inclusão no escopo deve ser tratada como decisão de produto, não como requisito já cumprido.

## Documentação associada

Consulte testes-usabilidade.md, troca-de-senha.md, testes-funcionais.md, regras-de-atencao.md, lembretes-internos.md, calendario-da-agenda.md, filtros-de-listas.md, resumo-para-impressao.md e graficos-de-medicoes.md. A documentação de uma funcionalidade não é evidência de execução de todos os seus testes.
