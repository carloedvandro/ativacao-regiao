# Padronizar listas e tabela com rolagem

## Alterações
- Substituir os filtros nativos de Região, Estado e Plano por listas personalizadas, sem a barra cinza do navegador.
- Mostrar avisos discretos “Role para cima para visualizar o restante” e “Role para baixo para visualizar o restante” conforme a posição da lista.
- Remover a barra cinza da tabela completa e aplicar os mesmos avisos de rolagem no topo e no rodapé.
- Fixar a linha Região, Estado, Cidade, 100GB, 120GB e Total com fundo branco totalmente opaco, sem conteúdo aparecendo por trás.
- Definir larguras estáveis para as seis colunas, mantendo títulos e valores perfeitamente alinhados durante a rolagem.

## Verificação
- Testar os três filtros e a seleção de opções.
- Abrir a tabela completa, rolar até o meio e até o final, confirmando cabeçalho fixo, avisos corretos e ausência de barras visíveis.
- Conferir o resultado em computador e celular.

## Detalhes técnicos
- Usar o seletor visual já disponível no projeto, com área rolável sem scrollbar.
- Controlar os avisos pela posição real da rolagem, sem alterar os dados ou os filtros atuais.
