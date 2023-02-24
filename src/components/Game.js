import { useState, useRef } from "react";
import "./Game.css";

const Game = ({
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
  const [letter, setLetter] = useState("");

  //cria referencia a algum lugar
  const letterInputRef = useRef(null);

  //função que recebe o formulario com a letra
  const handleSubmit = (e) => {
    e.preventDefault();

    //enviando letra adigitada para ver se possui na palavra
    verifyLetter(letter);

    //limpando o campo de texto
    setLetter("");

    //serve para focar no elemento apos o fim do submit
    //serve para deixar sempre selecionado a caixa de texto para nao ficar clicando toda hora para inserir dados
    letterInputRef.current.focus();
  };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Advinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span> {pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      <div className="wordContainer">
        {letters.map((letter, i) =>
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">
              {letter}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Tente advinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            required
            //recebendo o valor digitado atraves do onChange
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef} //referencia o elemento no DOM
          />
          <button>Jogar</button>
        </form>
      </div>
      <div className="wrongLetterContainer">
        <p>Letras ja utilizadas:</p>
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter}, </span>
        ))}
      </div>
    </div>
  );
};

export default Game;
