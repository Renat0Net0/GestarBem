> Atualização: o fluxo atual fica no formulário de Sintoma em `frontend/records.html`, controlado por `frontend/records.js`. O antigo script `attention.js` foi removido por não ser utilizado. O texto abaixo registra a proposta anterior e não descreve a localização atual.

# Regras de atenção — proposta v1

Estado: dez seleções e orientação integradas ao painel. Verificações locais de estrutura e lógica realizadas; validação manual visual, de acessibilidade e clínica pendente. Pesquisa consultada em 11/10/2026.

## Finalidade

Apresentar orientação para procurar atendimento quando a usuária informar um sinal de atenção. Não diagnosticar, prescrever, classificar a gestação ou afirmar que a ausência de seleção indica segurança.

## Catálogo

Cada regra será acionada por seleção explícita do sinal em um formulário sobre o momento atual. Não inferir sintomas por palavras em observações, por registros antigos nem por IA. A seleção deve ser opcional; não selecionar nada significa ausência de informação, não ausência de risco.

| ID | Sinal informado | Identificador proposto | Fonte |
|---|---|---|---|
| RA-01 | Sangramento vaginal | `sangramento_vaginal` | MS |
| RA-02 | Dor forte ou persistente na barriga | `dor_abdominal_intensa` | MS |
| RA-03 | Dor de cabeça intensa ou persistente | `cefaleia_intensa` | MS |
| RA-04 | Mudança na visão | `alteracao_visual` | MS |
| RA-05 | Inchaço repentino no rosto ou nas mãos | `inchaco_repentino` | MS |
| RA-06 | Perda de líquido pela vagina | `perda_liquido` | CDC |
| RA-07 | Dificuldade para respirar | `dificuldade_respiratoria` | CDC |
| RA-08 | Dor no peito | `dor_peito` | CDC |
| RA-09 | Desmaio | `desmaio` | CDC |
| RA-10 | Bebê se movimentando menos que o habitual | `movimentos_reduzidos` | CDC |

## Mensagem proposta

Para qualquer regra acionada, apresentar o sinal selecionado e a orientação: **Procure atendimento de saúde imediatamente. Informe que está grávida e descreva o que está sentindo.**

Um único card pode listar vários sinais selecionados, sem ranking nem pontuação. O aviso é orientação de encaminhamento, não diagnóstico. Deve aparecer ao selecionar o sinal, sem depender de salvar um formulário ou de resposta do servidor.

As fontes recomendam atendimento imediato diante dos sinais listados. O Ministério da Saúde também orienta recorrer à maternidade/urgência ou ao Samu 192 quando necessário. O CDC considera mudança do padrão de movimentos relevante; a regra não exigirá esperar um número de horas nem uma contagem fixa.

## Decisões de produto

- Usar uma seção própria no painel: Sinais de atenção. Não confundir com lembretes da agenda ou com o espaço de IA.
- Manter a orientação de atendimento visível durante a seleção. Não usar Marcar como visto para sugerir resolução clínica.
- Mostrar nomes dos sinais, orientação e links das fontes; não depender apenas de cor.
- Oferecer uma lista informativa mesmo sem seleção. Informar que a lista não cobre todas as situações e que preocupações devem ser comunicadas à equipe de saúde.
- Permitir limpar a seleção sem apagar registros de acompanhamento.
- A primeira integração não persistirá as seleções nem as transmitirá. Registros de sintomas já existentes continuam independentes.
- Não usar mudança de peso, calendário de exames ou valores de pressão para produzir diagnóstico. Regras numéricas exigem especificação adicional.

Estas decisões são escolhas de implementação do projeto; as fontes sustentam os sinais e o encaminhamento, não validam o software. A revisão clínica do conteúdo e a validação de usabilidade ainda estão pendentes.

## Critérios para a futura integração

Cada uma das dez seleções deve produzir a orientação; múltiplas seleções devem listar todos os sinais. Nenhuma seleção deve produzir mensagem tranquilizadora. Verificar teclado, rótulos dos controles, anúncio do aviso sem repetição excessiva, foco visível, contraste e tela estreita. Testar funcionamento sem conexão, pois a orientação local não depende da API. Não apresentar as dez regras como implementadas até concluir integração e verificação.

## Referências

**MS:** BRASIL. Ministério da Saúde. Caderneta Brasileira da Gestante. Seção 2.6, página impressa 28 (página 29 do arquivo PDF). Disponível em: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-mulher/publicacoes/caderneta-brasileira-da-gestante.pdf. Acesso em: 11 out. 2026.

**CDC:** Centers for Disease Control and Prevention. Urgent Maternal Warning Signs and Symptoms. HEAR HER Campaign. 15 maio 2024. Disponível em: https://www.cdc.gov/hearher/maternal-warning-signs/index.html. Acesso em: 11 out. 2026.

## Integração local

Na implementação atual, os sinais de atenção são apresentados no formulário de Sintoma em frontend/records.html e tratados por frontend/records.js. Não há seção separada no painel.

O texto de orientação e os sinais permanecem disponíveis sem JavaScript. Com JavaScript, cada seleção atualiza a lista de sinais e uma mensagem de estado sem mover o foco. Limpar seleção retorna o foco à primeira opção, sem afirmar resolução. Ao recarregar ou retornar pelo histórico, a seleção é limpa.

Para conferir, selecionar cada uma das dez opções, combinar opções, limpar, navegar com teclado e recarregar. A orientação deve permanecer visível mesmo sem seleção. Esta etapa não substitui a rodada formal de testes pendente.
