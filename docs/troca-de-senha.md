# Troca de senha autenticada

POST /api/account/password exige sessão, limite de tentativas já usado pela autenticação e validação de Origin do servidor. Valida senha atual, nova senha de 15 a 128 caracteres, confirmação e diferença da senha atual. Dentro de uma transação, bloqueia a linha da usuária, verifica o hash scrypt, atualiza o hash e remove todas as sessões dessa conta. A identidade vem da sessão, não do corpo. Em falha ocorre rollback; senha incorreta não altera dados. O cookie atual é limpo após commit.

settings.html é acessível pelo painel. Mostrar nova senha afeta a nova senha e confirmação; senha atual permanece oculta. Depois de sucesso os campos são limpos e há link Entrar novamente. A troca não apaga perfil, agenda, registros ou atividades. Recuperação de senha esquecida continua pendente. Não há registro de conteúdo de senha nos logs; esta etapa não acrescenta auditoria de autenticação ao activity_log.

Atualizar backend/server.mjs, acrescentar account-settings.mjs; atualizar frontend/account.html e acrescentar settings.html e settings.js. Reiniciar backend. Sem migração e sem alteração no .env.

Verificação final: senha atual errada, confirmação diferente, senha curta/longa, senha igual à atual, troca válida, antiga recusada/nova aceita, invalidação de outra sessão, falha transacional e isolamento entre contas. Validação JavaScript e fluxos com cliente de banco simulado conferidos; PostgreSQL/navegador reais pendentes.
