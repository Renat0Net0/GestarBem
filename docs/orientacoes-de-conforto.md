# Orientações de conforto para desconfortos na gestação

Atualização: 28/10/2026. Conteúdo educativo implementado em frontend/quick-help.js; revisão profissional e teste com gestantes pendentes. Não representa protocolo validado ou triagem clínica.

## Funcionamento
No menu principal, Auxílio rápido abre uma página dedicada com dez temas e trinta medidas gerais. As escolhas não são salvas nem enviadas à IA. A página mantém os limites e sinais de busca por atendimento visíveis antes das dicas. Não faz triagem: consultar um tema não descarta sinais de atenção.
Os sinais de atenção permanecem em Meus registros → Novo → Sintoma. As dicas foram retiradas desse formulário; não há mais bloqueio sincronizado entre páginas.
As restrições individuais do pré-natal prevalecem. Não são sugeridos medicamentos, chás, suplementos ou pomadas.

## Temas e fontes
- Enjoo leve: https://www.nhs.uk/pregnancy/common-symptoms/vomiting-and-morning-sickness/
- Azia leve: https://www.nhs.uk/pregnancy/common-symptoms/indigestion-and-heartburn/
- Intestino preso: https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/
- Desconforto nas costas: https://www.nhs.uk/pregnancy/common-symptoms/back-pain/
- Cansaço cotidiano: https://www.nhs.uk/pregnancy/common-symptoms/tiredness/
- Dificuldade para dormir: https://www.nhs.uk/pregnancy/common-symptoms/tiredness/
- Desconforto por hemorroidas já identificadas: https://www.nhs.uk/pregnancy/common-symptoms/piles/
- Sensação de calor sem febre: https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/
- Cãibras ocasionais nos pés ou panturrilhas: https://www.nhs.uk/pregnancy/common-symptoms/common-health-problems/
- Inchaço gradual nos dois pés ou tornozelos: https://www.nhs.uk/pregnancy/common-symptoms/swollen-ankles-feet-and-fingers/
Sinais urgentes e limites adicionais: https://www.cdc.gov/hearher/maternal-warning-signs/index.html
Todas as fontes foram consultadas em 28/10/2026; traduções e sínteses são da equipe do projeto, não recomendações individualizadas.
Não classificar dor no peito como azia, dor unilateral com inchaço como cãibra, sangramento desconhecido como hemorroida ou edema súbito como desconforto habitual.

## Verificações
Sintaxe e lógica em DOM simulado: dez temas, trinta dicas, seleção dos dez temas e limpeza ao sair (a versão anterior também verificou bloqueio no formulário). Não houve teste visual em navegador.
Homologar: teclado, anúncio da região dinâmica por leitor de tela, mensagens prioritárias visíveis, celular/zoom, mudança de tipo, reabertura do formulário e combinações de sinais.
Submeter o conteúdo e a redação dos sinais/limites à revisão de profissional de saúde antes de alegar validação clínica ou usar como protocolo com pacientes.
