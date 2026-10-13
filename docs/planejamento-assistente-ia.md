# Proposta do Assistente GestarBem

Preparada em 13/10/2026 para demonstração acadêmica. A integração não foi adicionada ao código do repositório: o endpoint foi bloqueado pela revisão automática por exigir autorização explícita para enviar texto digitado à OpenAI.

## Benefício e escopo da primeira versão

Auxiliar no uso da agenda, lembretes, registros e resumo imprimível; ajudar a organizar perguntas para levar a consultas. Demonstrar integração entre frontend, backend autenticado e um serviço de IA. O assistente não terá acesso automático ao perfil, agenda, registros, exames ou banco.

Uma pergunta por vez, sem memória de conversa. Não criar ou alterar itens, interpretar exames/medições, diagnosticar ou prescrever. Essas restrições são instruções ao modelo, não garantia de segurança clínica. Apenas dados fictícios na demonstração.

## Envio proposto para autorização

Destino: OpenAI, endpoint HTTPS https://api.openai.com/v1/responses.
Conteúdo: exclusivamente a pergunta digitada (até 1.000 caracteres), instruções fixas do assistente e parâmetros técnicos do modelo. Não incluir nome, e-mail, ID da conta, perfil, exames ou registros automaticamente. Qualquer informação escrita na pergunta seria transmitida junto do texto.

Antes de cada envio, a interface exigirá confirmação de que a pergunta será enviada à OpenAI e que serão usados dados fictícios. Chave de API somente no .env do backend, nunca no navegador ou GitHub. Chamadas podem gerar cobrança na conta da API.

## Implementação preparada, ainda não versionada

Rotas de disponibilidade e envio autenticadas; limite de oito perguntas por minuto por conta e uma chamada simultânea por conta por processo; timeout de 30 segundos; saída limitada; modelo configurável no ambiente; store=false. Esse parâmetro não garante retenção zero de todos os registros do provedor.

No painel: formulário, confirmação de envio, mensagem de andamento, resposta como texto sem execução de HTML, foco em erros/resposta e botão para limpar. Sem persistência de perguntas ou respostas no banco do GestarBem.

## Verificação disponível

Foram preparados e executados sete testes do módulo com provedor simulado; em conjunto com os 26 testes anteriores, 33 passaram. Sintaxe do módulo, integração do servidor preparada e script frontend conferida. Não houve chamadas reais à OpenAI. Esses resultados se referem ao código preparado neste ambiente, não a uma versão disponibilizada no repositório.

Pendente: autorização do envio externo, versionamento da implementação, configuração local da chave, integração real, avaliação das respostas e conferência da interface. O funcionamento atual do site permanece o anterior à proposta.

## Demonstração sugerida após implantação

1. Como configuro um lembrete para uma consulta?
2. Como salvo um resumo em PDF?
3. Ajude a organizar perguntas para conversar com o profissional.
4. Você consegue ver meus registros? (Explicar que não acessa a conta.)
5. Qual dose de medicamento devo tomar? (Não prescrever.)

Fontes: https://developers.openai.com/api/docs/guides/text e https://developers.openai.com/api/docs/guides/migrate-to-responses.

## Revisão personalizada — 13/10/2026

O usuário escolheu a integração via API após esclarecer os custos, devido à capacidade limitada do computador. A proposta foi ampliada: contexto lido pelo backend a partir da identidade da sessão, com DUM e estimativa gestacional, até oito próximos compromissos abertos (tipo, título, data e hora), até doze registros recentes (tipo, valor e data). Sem envio automático de nome, e-mail, senha, identificadores ou campos de observações. Textos livres dos itens ainda podem conter informações sensíveis.

Implementação preparada, ainda não gravada: contexto por conta; base de três sínteses OMS verificadas (contatos de pré-natal, alimentação/atividade física e temas para consultas); resposta estruturada com referências validadas; interface com divulgação dos dados compartilhados e confirmação; limite de quatro chamadas/minuto; reserva global persistente com migração 008 proposta, padrão de cinquenta tentativas e teto de duzentas, sem zerar no reinício. Falhas também consomem tentativas. O limite é de chamadas, não uma garantia de valor financeiro.

Verificação local: 34 testes aprovados, incluindo oito do novo módulo com banco e provedor simulados. Nenhuma chamada paga realizada. Base OMS limitada: não cobre todas as dúvidas da gestação nem constitui validação clínica. Perguntas sem apoio nos conteúdos devem receber explicação da limitação, sem inventar fatos.

Bloqueio: revisão automática rejeitou gravar backend/assistant.mjs por permitir transmitir dados da conta autenticada, potencialmente reais e sensíveis; a autorização foi interpretada como cobrindo somente demonstração fictícia. Não foram publicados endpoint, interface ou migração. Pendência: autorização explícita para o envio dos campos da conta à OpenAI antes de incorporar a versão personalizada; depois configuração local da chave e validação real.

Fonte OMS verificada: https://www.who.int/news/item/07-11-2016-new-guidelines-on-antenatal-care-for-a-positive-pregnancy-experience.
