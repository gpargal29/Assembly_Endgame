import {useState} from "react";
import {clsx} from "clsx"
import {languages} from "./languages.js";
import { getFarewellText, getRandomWord} from "./utils.js";
import Confetti from "react-confetti"

export default function AssemblyEndgame() {

  // State values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())   // Lazy initialization function
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))

  const isGameLost = wrongGuessCount >= numGuessesLeft

  const isGameOver = isGameWon || isGameLost

  const lastGuessedLetter =  guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)  // Make sure the last guessed letter is a true value but doesn't include in the current word 

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

  function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
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

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return(
    <span key={index} className={letterClassName}>
      {shouldRevealLetter ? letter.toUpperCase() : ""}
    </span>
    )})

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
    disabled={isGameOver}
    aria-disabled={guessedLetters.includes(letter)}
    aria-label={`Letter ${letter}`}
    onClick={() => addGuessedLetter(letter)}
    >
      {letter.toUpperCase()}
    </button>
  )})

  const gameStatusClass = clsx("game-status", {
    won: isGameWon ,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  // Helper function
  function renderGameStatus(){
    if (!isGameOver && isLastGuessIncorrect) {
      return <p className="farewell-message">
        {getFarewellText(languages[wrongGuessCount-1].name)}
      </p>
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    } 
    
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }
    return null
  }

  return (
    <main>
      {
        isGameWon && <Confetti
          recycle={false}
          numberOfPieces={1000}
        />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}  
      </section>

      <section className="language-chips">{languageElements}</section>
      
      <section className="word">
        {letterElements}
      </section>

      {/* Combined visually-hidden aria-live region for status updates */}
      <section 
        className="sr-only" 
        aria-live="polite" 
        role="status"
      >

        <p>
          {currentWord.includes(lastGuessedLetter) ? 
            `Correct! The letter ${lastGuessedLetter} is in the word.` : 
            `Sorry, the letter ${lastGuessedLetter} is not in the word.`
          }
          You have {numGuessesLeft} attempts left.
        </p>

        <p>Current word: {currentWord.split("").map(letter => 
          guessedLetters.includes(letter) ? letter + ".": "blank").join(" ")}</p>
            
      </section>

      <section className="keyboard">{keyboardElements}</section>

      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  );
}
