# Orientações de conforto para desconfortos na gestação

Atualização: 28/10/2026. Conteúdo educativo implementado em frontend/symptom-care.js; revisão profissional e teste com gestantes pendentes. Não representa protocolo validado ou triagem clínica.

## Funcionamento
Em Meus registros → Novo → Sintoma, abrir “O que pode ajudar em desconfortos comuns?” e escolher um tema. Não há reconhecimento de texto, diagnóstico ou prescrição. As dicas são fixas, sem chamada à IA.
Os dez sinais atuais continuam com orientação imediata; selecionar qualquer sinal oculta as dicas. Não selecionar sinais não descarta urgência. Avisos de febre, vômitos com intolerância a líquidos, piora e dúvidas ficam sempre presentes.
As restrições individuais do pré-natal prevalecem. Não são sugeridos medicamentos, chás, suplementos ou pomadas.
O tema de autocuidado não é salvo automaticamente; o relato do sintoma é salvo apenas pela ação Salvar registro.

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
Sintaxe e lógica em DOM simulado: dez temas, trinta dicas, bloqueio por cada um dos dez sinais, limpeza ao sair. Não houve teste visual em navegador.
Homologar: teclado, anúncio da região dinâmica por leitor de tela, mensagens prioritárias visíveis, celular/zoom, mudança de tipo, reabertura do formulário e combinações de sinais.
Submeter o conteúdo e a redação dos sinais/limites à revisão de profissional de saúde antes de alegar validação clínica ou usar como protocolo com pacientes.
