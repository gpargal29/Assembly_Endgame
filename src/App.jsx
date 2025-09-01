import {useState} from "react";
import {clsx} from "clsx"
import {languages} from "./languages.js";

export default function AssemblyEndgame() {

  // State values
  const [currentWord, setCurrentWord] = useState("react")
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))

  const isGameLost = wrongGuessCount >= languages.length - 1

  const isGameOver = isGameWon || isGameLost

  // Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  
  // By default an event listener only receives the "event" object so make the function inline callback where we calling it so as to pass the parameter of our own choice 

  function addGuessedLetter(letter){
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]

      // or we could just build a set that won't allow duplicates
      
      // {const lettersSet = new Set(prevLetters)
      // lettersSet.add(letter)
      // return Array.from(lettersSet)}
    )
  }

  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount  // boolean value 
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    }
    const className = clsx("chip", isLanguageLost && "lost")
    return (
      <span 
      // className={`chip ${isLanguageLost ? "lost" : ""}`}
      className={className}
      style={styles} 
      key={lang.name}
      >
        {lang.name}
      </span>
    );
  });

  // Converting the string into array of letters using split function and then mapping the array afterwards 

  const letterElements = currentWord.split("").map((letter, index) => (
    <span key={index}>
      {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
    </span>
  ))

  const keyboardElements = alphabet.split("").map(letter => { 

    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
    <button 
    className={className}
    key={letter} 
    onClick={() => addGuessedLetter(letter)}
    >
      {letter.toUpperCase()}
    </button>
  )})

  const gameStatusClass = clsx("game-status", {
    won: isGameWon ,
    lost: isGameLost
  })

  // Helper function
  function renderGameStatus(){
    if (!isGameOver) {
      return null
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } else {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }
  }

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section className={gameStatusClass}>
        {renderGameStatus()}  
      </section>

      <section className="language-chips">{languageElements}</section>
      
      <section className="word">
        {letterElements}
      </section>

      <section className="keyboard">{keyboardElements}</section>

      {isGameOver && <button className="new-game">New Game</button>}
    </main>
  );
}
