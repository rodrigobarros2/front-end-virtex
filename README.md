Gostaria de informar que, devido a uma viagem de grande importância, não consegui trabalhar no projeto durante o sábado, domingo e segunda-feira como pode ver por meio dos commits do GitHub. No entanto, utilizei o tempo disponível para entregar uma solução que atenda às expectativas e aos requisitos técnicos estabelecidos.


Pensei em uma alternativa para a implementação de uma OLT com duas saídas que obtive, mas não implementei. A ideia é criar um único input no front-end, que seria armazenado no banco de dados pelo back-end. Quando um novo input for enviado, o back-end recuperaria os dados do banco e verificaria se slot, port e ont_id são iguais, atualizando os dados com uma rota PUT. Dessa forma, os campos SN e State ficariam combinados.

Outra linha de raciocínio seria realizar o parsing das informações no lado do cliente e enviar para o back-end somente o JSON (comecei dessa forma inicialmente, mas depois passei o parsing para o back-end).

Como não tenho um entendimento completo sobre OLTs, "TALVEZ" não tenha abordado a melhor escolha. No entanto, uma troca de ideias com alguém que compreenda melhor o assunto poderia esclarecer mais meu raciocínio sobre a implementação do software.

Outras melhorias que continuarei implementando, até obter o feedback de vocês, incluem: paginação da tabela, uma rota DELETE para remover uma saída específica, e validação no back-end e front-end com Zod.

Caso queiram rodar localmente, basta seguir os seguintes passos

## Rodando localmente

Clone o projeto

Entre no diretório do projeto

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run start
```
