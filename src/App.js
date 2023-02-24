//CSS
//importantdo arquivos do css
import "./App.css";

//REACT
//importando routes do react
import { useCallback, useEffect, useState } from "react";

//DADOS
//importando dados do arquivo
import { wordsList } from "./data/words";

//COMPONENTES
//Importando componetes
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

//os estagios abaixo servem para fazer a progressao do jogo
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  //abaixo criamos a variael que ira conter o estaagio do jogo
  //iremos deixar o estagio por padrao em start, onde é o começar
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  //variavel para tamanho de tentativas
  const guessesQty = 3;

  const [pickedWord, setPickedWord] = useState(""); //variavel para palavras escolhidas
  const [pickedCategory, setPickedCategory] = useState(""); //variavel para categorias escolhidas aleatorias
  const [letters, setLetters] = useState([]); //variavel para letras digitadas

  //letras advinhadasc
  const [guessedLetters, setGuessedLetters] = useState([]);
  //letras erradas
  const [wrongLetters, setWrongLetters] = useState([]);
  //chances de jogar
  const [guesses, setGuesses] = useState(guessesQty);
  //pontuação
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words); //criando o array com todas as palavras

    //abaixo tem uma variavel que recebe um valor aleatorio das categorias, que é sorteado por Math.random e é arredondado para um valor menor com o Math.floor, e sorteamos um num atravez do tamanho do array

    //pegar as categorias
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pegar as palavras da categoria selecionada sorteando um valor aleatorio
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //função para mudar o estagio e começar o jogo
  const startGame = useCallback(() => {
    //resetando todos os estados
    clearLettersStates();
    //resgate de letras
    //pega palavra e pega categoria
    //recebemos a categoria e a palavra como retorno da função abaixo
    const { word, category } = pickWordAndCategory();

    //criando um array, quebrando ele com a função slipt("separador"),
    let wordLetters = word.split("");

    //colocando as letras como minusculas para nao ter erro depois
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //Setando estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    //começar jogo
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //função para verificar as letras digitadas
  const verifyLetter = (letter) => {
    //deixamos todas as letras recebidas minusculas
    const normalizedLetter = letter.toLowerCase();

    //checar se as letras ja foram utilziadas
    if (
      //se ja foi utilizado, o usuario nao perdera a chance de jogar
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    //inclui letra ou remove
    if (letters.includes(normalizedLetter)) {
      //letra certa
      //o comando abaixo serve para adição de array
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      //letra errada
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      //contador que vai diminuindo as tentativas se errar
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  //função para zerar alguns estados
  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //função para recomecar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  //ele serve para monitorar dados e vai monitorar se as tentativas acabaram
  useEffect(() => {
    if (guesses <= 0) {
      //resetando todos os estados
      clearLettersStates();
      //serve para reinicar o jogo quando acabarem as tentativas
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //checar vitoria
  useEffect(() => {
    //criando um array de letras unicas
    const uniqueLetters = [...new Set(letters)];

    //condição de vitoria
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      //adiciona score
      setScore((actualScore) => (actualScore += 100));
      //restart na palavra
      startGame();
      setGuesses(guessesQty)
    }
  }, [guessedLetters, letters, startGame,gameStage]);

  return (
    <div className="App">
      {/*O estagio esta atrelado aos componentes, ou seja, em cada estagio ira exibir um component diferente*/}
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
