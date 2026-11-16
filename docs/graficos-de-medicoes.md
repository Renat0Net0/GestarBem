# Gráficos de medições

Meus registros inclui gráficos de Peso e Pressão arterial, atualizados após carregar, salvar, editar ou excluir registros. A seção recebe os mesmos dados da API da conta e não faz novas chamadas nem envia informações a serviços externos. Mostra até as 30 medições mais recentes do tipo, sem aplicar filtros da lista.

Aceita peso positivo com unidade kg e pressão com dois valores positivos e unidade mmHg, nos formatos do cadastro. Registros não reconhecidos são contados e informados para revisão na lista, sem alterar o banco. Sistólica e diastólica usam cor e traçado distintos. SVG tem título e descrição; tabela nativa oferece os valores completos. Um único ponto é exibido sem inventar tendência; zero valores apresenta mensagem própria. Não há metas, faixas clínicas, diagnóstico nem inferência de normalidade.

Os pontos são ordenados por data com distância uniforme; não são uma escala temporal proporcional. Medições do mesmo dia não têm horário e não se deve interpretar sua ordem como sequência horária. A legenda explica essa limitação. O limite de 30 também vale para a tabela, sem esconder a quantidade total disponível.

Atualizar frontend/records.html e records.js; adicionar measurements.js e measurements.css. Não há migração ou mudança na API. Verificar registros vazios, ponto único, valores iguais, dois tipos, 31 medições, formato antigo não reconhecido, edição/exclusão e tabela. Layout visual e acessibilidade no navegador pendentes nos testes finais.
