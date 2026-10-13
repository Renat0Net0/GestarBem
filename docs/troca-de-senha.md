# Troca de senha autenticada

POST /api/account/password exige sessão, limite de tentativas já usado pela autenticação e validação de Origin do servidor. Valida senha atual, nova senha de 6 a 128 caracteres, confirmação e diferença da senha atual. Dentro de uma transação, bloqueia a linha da usuária, verifica o hash scrypt, atualiza o hash e remove todas as sessões dessa conta. A identidade vem da sessão, não do corpo. Em falha ocorre rollback; senha incorreta não altera dados. O cookie atual é limpo após commit.

settings.html é acessível pelo painel. Mostrar nova senha afeta a nova senha e confirmação; senha atual permanece oculta. Depois de sucesso os campos são limpos e há link Entrar novamente. A troca não apaga perfil, agenda, registros ou atividades. Recuperação de senha esquecida continua pendente. Não há registro de conteúdo de senha nos logs; esta etapa não acrescenta auditoria de autenticação ao activity_log.

Atualizar backend/server.mjs, acrescentar account-settings.mjs; atualizar frontend/account.html e acrescentar settings.html e settings.js. Reiniciar backend. Sem migração e sem alteração no .env.

Verificação final: senha atual errada, confirmação diferente, senha curta/longa, senha igual à atual, troca válida, antiga recusada/nova aceita, invalidação de outra sessão, falha transacional e isolamento entre contas. Validação JavaScript e fluxos com cliente de banco simulado conferidos; A rodada completa com PostgreSQL/navegador continua pendente; veja o relato exploratório abaixo.

## Relato exploratório local — 12/10/2026

Renato confirmou “tudo certo” após o roteiro de validação local: senha atual incorreta recusada; nova senha com cinco caracteres recusada; senha com seis caracteres aceita; senha antiga recusada e nova aceita no login; perfil, compromissos e registros preservados; segunda sessão solicitando login após a troca.

Fonte: confirmação do usuário nesta conversa. Navegador, versão exata do commit e evidências individuais não foram informados. Esta confirmação registra os passos do roteiro como relato exploratório, sem certificar a execução formal dos 30 cenários ou os casos adicionais de senha longa, confirmação diferente, senha repetida, falha transacional real e isolamento entre contas. Os testes automatizados com banco simulado permanecem evidência separada.

## Foco e falhas de resposta — 12/10/2026

Após erros do servidor, o foco vai para o primeiro campo inválido na ordem visual; em falhas gerais, vai para a mensagem de erro, com tabindex=-1. Se a verificação da sessão falhar, o botão Tentar novamente recebe foco. Respostas sem JSON válido são tratadas como alteração não confirmada, orientando a conferir o login antes de repetir. Ao limpar os campos, a visibilidade das senhas volta ao estado oculto.

Verificação: sintaxe JavaScript aprovada e quatro cenários com DOM/respostas simulados (falha geral, erros de campos em ordem diferente, resposta ilegível e falha da verificação de sessão). Também verificados desbloqueio dos controles e limpeza/ocultação de senha ao sair. Não adicionados ao npm test: verificação exploratória separada. Teclado e leitor de tela em navegador real ainda precisam de validação.
