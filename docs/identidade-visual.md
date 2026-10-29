# Identidade visual compartilhada

Tema baseado na imagem de referência fornecida em 29/10/2026. A captura não permite identificar a fonte original ou os valores RGB exatos: a reprodução é aproximada.

- Texto e títulos: Segoe UI, com Arial/Helvetica como alternativas locais.
- Saudação: Georgia, com Times New Roman como alternativa.
- Primária: #95516e; hover: #793c57; vínculos e destaques: #75374f.
- Fundo: #fbf9f8; superfície: branco; rosa claro: #f8e9ef; destaque verde: #85a79a.
- Texto principal #30353b; texto secundário #62565d; borda de campos #a58392.

frontend/theme.css é carregado por último nas dez páginas. Não usa fontes remotas. Mantém layout responsivo, foco e configurações de impressão existentes. Cores dos gráficos foram alinhadas à paleta.

Verificação matemática das combinações: branco sobre primária 5,71:1; texto secundário sobre branco 6,98:1; vinho sobre rosa 7,41:1; borda de campo sobre branco 3,35:1; verde do gráfico sobre branco 6,12:1. Isso não equivale a auditoria de todas as combinações e estados WCAG. Revisão visual no navegador ainda pendente.

Nenhuma alteração de lógica de negócio, API, banco de dados ou conteúdo das funcionalidades.
