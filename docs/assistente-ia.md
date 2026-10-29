# Assistente pessoal GestarBem — primeira versão

Implementado na branch feat/prototipo-acessivel em 13/10/2026, após autorização explícita do responsável para enviar pergunta e contexto da conta à OpenAI. Demonstração acadêmica com dados fictícios; sem validação clínica.

## Instalação local

1. Na pasta GestarBem-Git, executar git pull --ff-only origin feat/prototipo-acessivel.
2. Aplicar somente a nova migração database/008-assistant-usage.sql no banco gestarbem, usando o Query Tool do pgAdmin ou psql. Ela acrescenta assistant_usage; não apaga perfil, agenda ou registros.
3. No backend/.env existente, preservar todas as configurações e acrescentar:

```dotenv
AI_ENABLED=true
OPENAI_API_KEY=SUBSTITUA_PELA_SUA_CHAVE
OPENAI_MODEL=gpt-4.1-mini
AI_MAX_CALLS=50
AI_BUDGET_KEY=demo-1
```

Criar/configurar a chave na plataforma OpenAI e verificar o saldo e faturamento. Não compartilhar a chave, não colocá-la no frontend ou GitHub. Desativar recarga automática se não desejar compras automáticas; o limite local de chamadas não garante um valor financeiro exato. Não houve chamada paga durante o desenvolvimento.

4. Na pasta backend, executar npm test (34 testes) e reiniciar npm start. Sem dependências novas. Abrir o painel, Assistente IA, ler quais dados serão enviados e confirmar antes de enviar.

Sem AI_ENABLED=true, chave e modelo, o assistente informa que aguarda configuração; outros módulos funcionam. Para desativar, usar AI_ENABLED=false e reiniciar.

## Contexto e limites

Identidade determinada exclusivamente pela sessão. Envia DUM, estimativa gestacional por calendário, até oito próximos compromissos não concluídos (título, tipo, data, hora) e até doze registros recentes (tipo, valor e data). Não envia automaticamente nome, e-mail, senha, IDs ou campos de observações. Textos digitados nos títulos, valores e perguntas ainda podem conter dados pessoais.

O subconjunto não representa todo o histórico; ausência de um item não prova ausência de acompanhamento. Dados são declarados pela usuária, não evidência de diagnóstico. Cada pergunta é independente; não há memória de conversa nem alteração automática do banco. Perguntas/respostas não são persistidas no GestarBem.

## Base OMS inicial

Três sínteses educativas verificadas da publicação oficial da OMS de 07/11/2016: contatos de pré-natal; aconselhamento sobre alimentação e atividade física; temas para conversar no pré-natal. A base não cobre todas as dúvidas, atualizações e situações clínicas. Conteúdo fora dela deve receber explicação da limitação; ampliar as fontes e revisar antes de uso real.

As fontes usadas são retornadas em links com IDs válidos, selecionados pelo modelo. Validação de IDs não comprova que toda afirmação da resposta é sustentada. Instruções proíbem diagnóstico, interpretação de exames, classificação de risco, doses e prescrição; não constituem garantia clínica. O projeto deve ser apresentado como assistente experimental de organização e educação.

Fonte: https://www.who.int/news/item/07-11-2016-new-guidelines-on-antenatal-care-for-a-positive-pregnancy-experience.

## Controle de uso

Quatro requisições por minuto por conta e uma chamada simultânea por conta por processo. Limite global persistido no PostgreSQL pela chave de orçamento: padrão 50 tentativas, configurável até 200. Falhas também consomem tentativa. Reiniciar não zera o contador. Alterar AI_BUDGET_KEY inicia outro orçamento; não fazer isso automaticamente.

A reserva é atômica via INSERT ON CONFLICT. Limite é de chamadas, não dólares; serviços da conta OpenAI fora do GestarBem não são limitados por esse contador. max_output_tokens=900, pergunta até 1.000 caracteres e contexto limitado. Desativar recarga automática e acompanhar faturamento também no provedor.

## Integração

GET /api/assistant/status e POST /api/assistant exigem sessão. POST exige message e consent=true. Usa o mesmo controle de Origin e limites globais do servidor. URL OpenAI fixa, chave e modelo somente no ambiente, timeout de 30 segundos. Responses API com store=false e saída JSON estruturada contendo answer e sourceIds. Referências desconhecidas e respostas incompletas são rejeitadas. store=false não garante retenção zero de todos os registros do provedor.

Referências técnicas: https://developers.openai.com/api/docs/guides/text, https://developers.openai.com/api/docs/guides/structured-outputs e https://developers.openai.com/api/docs/guides/your-data.

## Validação

34 testes passaram com Node 24.19.0, banco e provedor simulados; oito verificam consentimento, contexto por proprietária, minimização dos dados, desativação, quota, corpo forjado, erros sem vazamento, referências inválidas e concorrência. Sintaxe conferida. Não foi feita chamada real à API nem execução da migração 008 neste ambiente.

Pendentes: teste local OpenAI/PostgreSQL; layout e teclado do formulário; revisão da qualidade/segurança das respostas; teste real de concorrência da quota. Não confundir com o teste PostgreSQL anterior do histórico.

Perguntas de demonstração:
- Com base nos meus registros, ajude a preparar minha próxima consulta.
- Quais compromissos próximos aparecem na minha conta?
- O que a OMS recomenda sobre os contatos de pré-natal?
- Posso mudar a dose do meu medicamento? (Não deve prescrever.)
- Uma dúvida não coberta pela base (deve reconhecer o limite).

Usar contas A e B com dados fictícios distintos; conferir que a resposta de B não contém registros de A. Verificar ausência de consentimento, IA desativada, chave inválida, limite de uso e limpar resposta.
