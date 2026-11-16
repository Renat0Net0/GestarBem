# Avaliação de usabilidade — GestarBem

## Objetivo e estado

Avaliar se dez participantes conseguem realizar as tarefas principais do protótipo e identificar dificuldades para correção. Roteiro preparado em 12/10/2026; nenhuma sessão executada ou resultado coletado neste documento. Esta avaliação não substitui os 30 testes funcionais nem certifica acessibilidade.

## Preparação

- Registrar commit, data, navegador, dispositivo e facilitador de cada sessão.
- Utilizar somente contas e informações fictícias, diferentes por participante. Identificar participantes como P01 a P10; não registrar nomes, e-mails ou senhas pessoais.
- Preparar ambiente local com backend e PostgreSQL, migrações existentes e uma conta fictícia com compromissos e registros para as tarefas de consulta.
- Escolher participantes com perfis de familiaridade tecnológica variados; registrar somente categoria ampla quando relevante. Relatar como foram convidados e limitações da amostra.
- Reservar aproximadamente 20 a 30 minutos por sessão e fazer uma sessão piloto separada antes da coleta. Não incluir o piloto nos dez participantes.
- Verificar o procedimento acadêmico aplicável com a orientadora antes de recrutar participantes.

## Abertura e participação

Ler: “Estamos avaliando o GestarBem, não você. A participação é voluntária; você pode interromper a qualquer momento. Utilize apenas os dados fictícios fornecidos e, se puder, diga o que está procurando ou pensando. Registraremos dificuldades e resultados sem seu nome. Você concorda em participar?”

Registrar concordância e código do participante. Gravação não é necessária; se houver gravação ou captura de tela, explicar finalidade e obter autorização específica antes. Não gravar credenciais. Definir com a equipe onde guardar, quem acessa e quando excluir as evidências.

## Tarefas

Apresentar uma tarefa por vez, sem indicar menus ou sequência de cliques. Após cada tarefa, perguntar: “De 1 a 5, quão fácil foi realizar esta tarefa?”, sendo 1 muito difícil e 5 muito fácil.

| ID | Instrução ao participante | Critério observado de conclusão |
|---|---|---|
| U01 | Crie uma conta com os dados fictícios fornecidos e entre no sistema. | Painel da conta correta exibido. |
| U02 | Informe a DUM fictícia fornecida e acrescente uma observação ao perfil. | Perfil salvo e valores visíveis ao retornar. |
| U03 | Agende uma consulta para amanhã às 09h30 e configure um lembrete no dia. | Compromisso aparece com data, hora e lembrete corretos. |
| U04 | A consulta mudou para 10h30. Atualize o agendamento. | Novo horário aparece e permanece após atualização. |
| U05 | Registre um peso fictício de 68 kg na data de hoje. | Registro correto na lista; participante reconhece a unidade. |
| U06 | Encontre o compromisso e o registro que você criou usando os recursos disponíveis. | Ambos identificados; anotar uso espontâneo de filtros/calendário. |
| U07 | Marque a consulta como concluída e depois desfaça essa conclusão. | Compromisso concluído e reaberto. |
| U08 | Encontre o histórico das alterações e identifique o registro de peso criado. | Atividade e identificação do item reconhecidas. |
| U09 | Prepare um resumo das informações para impressão. | Resumo carregado e diálogo de impressão aberto; pode cancelar sem salvar arquivo. |
| U10 | Altere a senha da conta usando a nova senha fictícia fornecida e entre novamente. | Troca concluída e novo login realizado. |

Datas e contas devem ser preparadas para o dia efetivo de execução em Manaus. Para U10, usar senhas fictícias diferentes, com pelo menos seis caracteres, sem anotá-las nas evidências. Não orientar participantes a testar ou interpretar sinais de saúde reais.

## Condução e resultados

Iniciar cronômetro ao apresentar a tarefa e encerrar na conclusão ou abandono. Registrar resultado:
- S: sucesso sem instrução sobre como operar a interface.
- A: conclusão com ajuda do facilitador.
- F: tarefa tentada e não concluída.
- NE: não executada; explicar por quê.

Pedidos para repetir o enunciado não contam como ajuda de interface. Se for necessário ajudar, registrar a orientação exata. Interromper a tarefa se o participante desejar ou se houver bloqueio; explicar no relatório qualquer regra de tempo adotada. Não alterar a versão durante a rodada; se corrigir um bloqueio, registrar quais sessões usaram cada versão.

## Ficha individual

Código: ____ | Data: ____ | Commit: ____ | Navegador/dispositivo: ____  
Facilitador: ____ | Concordância: ____ | Familiaridade tecnológica (opcional): ____

| Tarefa | Resultado S/A/F/NE | Tempo em segundos | Facilidade 1–5 | Dificuldade ou ajuda oferecida | Evidência sem dados pessoais |
|---|---|---|---|---|---|
| U01 | | | | | |
| U02 | | | | | |
| U03 | | | | | |
| U04 | | | | | |
| U05 | | | | | |
| U06 | | | | | |
| U07 | | | | | |
| U08 | | | | | |
| U09 | | | | | |
| U10 | | | | | |

Perguntas finais:
1. Qual tarefa foi mais difícil e por quê?
2. Algum texto, botão ou mensagem ficou confuso?
3. O que você mudaria primeiro?

## Consolidação

Para cada tarefa, contar S, A, F e NE; apresentar número de participantes que a executaram. Taxa de sucesso sem ajuda = S / (S + A + F) × 100. Se o denominador for zero, informar “não avaliada”. Apresentar NE separadamente e não contar como sucesso. Informar tempo mediano das tarefas concluídas e facilidade mediana das respostas válidas, com tamanho de amostra.

Não aplicar automaticamente a meta de 90% dos testes funcionais à usabilidade. Interpretar resultados com as dificuldades observadas e as limitações de dez participantes.

| Problema observado | Tarefa | Participantes afetados | Impacto | Correção proposta | Commit da correção | Resultado do reteste |
|---|---|---|---|---|---|---|

Priorizar bloqueios que impedem concluir tarefas, depois erros que exigem ajuda e, por fim, dificuldades leves. Retestes devem ser identificados separadamente da rodada original.

## Entregas para o TCC

Método e recrutamento; versão avaliada; dez fichas anonimizadas; resultados por tarefa; dificuldades recorrentes; alterações realizadas e retestes; limitações da avaliação. Guardar evidências conforme o procedimento definido com a orientação, evitando publicação de dados pessoais no GitHub.
