# 🌍 Alerta Vermelho - Pandemic Web Game

Este projeto é uma versão web inspirada no jogo de tabuleiro cooperativo "Pandemic", onde os jogadores devem trabalhar juntos para conter surtos de doenças ao redor do mundo.

## 🧩 Tecnologias utilizadas

Vite + React

## 🚀 Como rodar o projeto localmente

Para rodar o projeto localmente em versão de _produção_, siga os seguintes passos:

1. Clone o repositório:

```bash
git clone https://github.com/GS-Toledo/Alerta-Vermelho.git
```

2. Construa o projeto:

```bash
npm run build
```

3. Inicie o servidor:

```bash
npm run start
```

4. Divirta-se!

Já para rodar em versão de _desenvolvimento_, faça o seguinte:

1. Crie um Github Codespace.
2. Selecione o ramo desejado.
3. Inicie o servidor:

```bash
npm run dev
```

4. Divirta-se!

## Regras

O repositório possui algumas regras para permitir o melhor aproveitamento das contribuições dos desenvolvedores.
- Não é permitido alterar diretamente os ramos permanentes, como `main` e `development`, seja por `git commit` ou `git merge`.
- As melhorias e correções devem ser feitas em ramos temporários que duram horas ou poucos dias. Opcionalmente, os prefixo `feature` ou `fix` podem ser utilizado.
- As contribuições devem possuir:
    - Testes unitários.
    - Oferecer uma cobertura de código de pelo menos 75%.
- As contribuições devem ser integradas aos ramos permanentes através de **Pull Requests**. Para ser aceita, a solicitação deve:
    - Ser aprovada por pelo menos 1 contribuidor.
    - Passar pelas verificações automáticas de teste e construção.
- Documente o que você está contribuindo. Crie **Issues**, abra **Pull Requests** e adicione **Comentários** no código.
- Por último, mas não menos importante, respeite as regras. Elas existem por uma razão.

### Testes unitários

Os testes unitários devem ser criados dentro do pacote (`core` ou `react`), ao lado do código que está sendo testado com o infixo de teste. Ou seja, se o arquivo que está sendo testado `game.ts`, o teste unitário será `game.test.ts`, e o diretório ficará assim:
- `game.ts`
- `game.test.ts`

#### Como escrevê-los

Primeiro, vamos ver um exemplo de teste unitário para a classe `Game` do pacote `core`:

```ts
import Game from './game';

describe('Game', () => {
    it('should instantiate the game', () => {
        const game = new Game();

        expect(game).toBeInstanceOf(Game);
    });

    it('should be in round 1', () => {
        const game = new Game();

        expect(game.getRound()).toBe(1);
    });
});
```

Para escrever testes unitários, você deve importar o módulo que deseja testar e utilizar as funções de teste do `vitest`, como `describe`, `it`, `expect`, etc. O exemplo acima mostra como instanciar a classe `Game` e verificar se ela está funcionando corretamente.

#### Estrutura básica

Os testes unitários devem seguir a seguinte estrutura:
- **Arrange**: Configuração do teste, onde você instancia os objetos necessários e define o estado inicial.
- **Act**: Ação que você deseja testar, como chamar um método ou alterar o estado de um objeto.
- **Assert**: Verificação do resultado esperado, onde você compara o resultado obtido com o resultado esperado usando as funções de asserção do `vitest`.

Por exemplo:

```ts
// Arrange
const game = new Game({
    players: ['Alice', 'Bob'],
});

// Act
game.start();

// Assert
expect(game.getCurrentPlayer()).toBe('Alice');
```

#### Como rodá-los

Para rodar os testes do pacote `core`, execute:
```bash
npm run core:test
```

Para rodar os testes do pacote `react`, execute:
```bash
npm run react:test
```

Por padrão, após a execução, o `vitest` começará a escutar por alterações nos arquivos de teste e executará os testes novamente sempre que houver uma modificação. Portanto, basta deixar o terminal aberto e fazer as alterações necessárias nos arquivos de teste para ver os resultados em tempo real.

### Cobertura de código

A cobertura de código é uma métrica importante para garantir que os testes estão cobrindo todas as partes do código. O `vitest` já vem configurado para gerar relatórios de cobertura automaticamente.

Para verificar a cobertura de código, basta executar os comandos abaixo.

Para o pacote `core`:
```bash
npm run core:coverage
```

Para o pacote `react`:
```bash
npm run react:coverage
```

O relatório de cobertura será mostrado no terminal e também será gerado um arquivo HTML na pasta `coverage` do respectivo pacote. Você pode abrir esse arquivo em um navegador para visualizar a cobertura de forma mais detalhada.

Nossa meta é termos pelo menos 75% de cobertura de código.