# Resumo para impressão

O painel oferece um link para summary.html. A página carrega o nome da conta, perfil, toda a agenda e todos os registros pelas APIs já protegidas pela sessão. Não inclui senha, token, e-mail, seleções temporárias dos sinais de atenção ou diagnósticos. Não aplica os filtros nem a paginação das outras páginas.

O botão de impressão fica disponível apenas após todos os módulos carregarem. Em qualquer falha, limpa o conteúdo e permite atualizar; não apresenta um resumo parcial como completo. A composição ocorre no navegador, com textContent e sem localStorage, serviços de PDF ou envio externo. O usuário escolhe impressão ou PDF no diálogo do navegador. O arquivo salvo não acompanha alterações posteriores dos dados.

CSS de impressão remove controles e fundo decorativo e prevê páginas A4. Não há garantia de PDF acessível ou etiquetado; isso depende do navegador. A validação visual de impressão permanece pendente.

## Atualização

Substituir frontend/account.html e acrescentar frontend/summary.html, summary.js e summary.css. Nenhuma migração ou alteração no backend. Recarregar o painel com Ctrl+F5 e abrir Resumo para impressão.

## Conferência ao final

Verificar conta vazia, dados nas três seções, mais de dez itens sem truncamento, observações longas, caracteres HTML exibidos como texto, falha em uma API sem impressão parcial, sessão expirada, troca de conta, volta pelo histórico, navegação por teclado e prévia de impressão com múltiplas páginas. Usar dados fictícios.
