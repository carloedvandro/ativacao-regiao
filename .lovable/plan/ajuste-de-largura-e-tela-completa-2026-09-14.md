# Ajuste de largura e tela completa

## O que será alterado
- Ampliar a página **Ativações por cidade** para usar a mesma largura lateral do painel principal no computador.
- Manter filtros e lista alinhados, aproveitando toda a área disponível sem criar rolagem lateral desnecessária.
- Transformar **Região · Estado · Cidade** em uma visualização de tela inteira com fundo branco sólido.
- Impedir que qualquer conteúdo do painel principal apareça atrás da tabela.
- Preservar o cabeçalho fixo, os avisos de rolagem e o fechamento da tabela.

## Detalhes técnicos
- Usar o mesmo limite de largura e espaçamento lateral do painel principal na rota de cidades.
- Trocar o diálogo centralizado por uma camada opaca que ocupa toda a janela, com tabela flexível em largura e altura.
- Validar as duas telas no formato computador e confirmar a rolagem sem barra cinza visível.
