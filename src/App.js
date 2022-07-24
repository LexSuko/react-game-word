import { useState, useEffect, useRef } from "react";
import './App.css';
const second = 60 ;

function App() {
  // const [words, setWords] = useState(["wordtune","ensures","that","your","writing","is","fluent","and","your","grammar","is","perfect"]);
  // const text = "wordtune ensures that your writing is fluent and your grammar is perfect";
  const text = "lorem ipsum dolor sit amet consectetur adipisicing elit at eos voluptatem aliquam enim magni in velit eum iure rerum vel cupiditate harum ratione odit expedita eligendi dolore ad earum vero";
  const [words, setWords] = useState([]);
  const textInput = useRef(null);
  const [countDown, setCountDown] = useState(second);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [currentChar, setCurrentChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setInCorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  
  useEffect(() => {

    getWordOfAText(text);
    
    if(status === "started"){
      textInput.current.focus();
    }
  }, [status])

  const getWordOfAText = (txt) => {
    let data = txt.split(" ");
    setWords(data);
  }
  const btStart = () =>{
    // console.log("Start");
    if(status === "finished"){
      setCurrWordIndex(0);
      setCorrect(0);
      setInCorrect(0);
      setCurrentCharIndex(-1);
      setCurrentChar(""); 
    }
    if(status !== "started"){
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if(prevCountdown === 0){
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return second
          }
          else{
            return prevCountdown - 1;
          }
        } )
      }, 1000) 
    }     
  }

  const handleKeyDown = (event) => {
    // console.log(event.key)
    if(event.key === "Enter"){
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrentCharIndex(-1);
    }
    else if(event.key === "Backspace") {
      if(currentCharIndex >= 0){
        setCurrentCharIndex(currentCharIndex - 1);
        setCurrentChar("")
      }
    }
    else if(event.key === " "){
      if(words[currWordIndex] === currInput.trim()){
        console.log("word : "+words[currWordIndex]);
        checkMatch();
        setCurrInput("");
        setCurrWordIndex(currWordIndex + 1);
        setCurrentCharIndex(-1);
      }
      else {
        setCurrentCharIndex(currentCharIndex + 1)
        setCurrentChar(event.key)
      }
    }
    else {
      setCurrentCharIndex(currentCharIndex + 1)
      setCurrentChar(event.key)
    }
  }

  const checkMatch = () => {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    // console.log({doesItMatch});
    if(doesItMatch){
      setCorrect(correct + 1);
    }
    else {
      setInCorrect(incorrect + 1);
    }
  }

  const getCharClass = (wordIdx, charIdx, char) => {
    // console.log("wordIdx : "+charIdx);
    if(wordIdx === currWordIndex && charIdx === currentCharIndex && currentChar && status !== "finished"){
      if(char === currentChar){
        return "word-sussess"
      }
      else {
        return "word-danger"
      }
    }
    else if(wordIdx === currWordIndex && currentCharIndex === (words[currWordIndex].length - 1) && words[currWordIndex] === currInput.trim()) {
      return "word-sussess"
    }
    else if(wordIdx === currWordIndex && currentCharIndex === (words[currWordIndex].length - 1) && words[currWordIndex] !== currInput.trim()) {
      return "word-danger"
    }
    else if(wordIdx === currWordIndex && currentCharIndex >= words[currWordIndex].length) {
      return "word-danger"
    }
    else {
      return ""
    }
  }

  return (
    <div className="main">
      <div className="container">
        <div className="card">
          <h1>Game Word</h1>

          {status !== "started" && (
            <div className="section-header">
              <h2>วิธีการเล่น</h2>
              <p>จะมีเวลาให้ 1 นาที พิมพ์ตามข้อความที่ปรากฏให้ถูกต้อง เมื่อมั่นใจว่าข้อความถูกให้กดปุ่ม Enter หรือ ถ้าข้อความเป็น<span>สีเขียว</span>ทั้งหมด ให้กดปุ่ม SpaceBar พอครบ 1 นาที จะมีการสรุปผลว่าภายใน 1 นาทีท่านทำได้กี่คำต่อนาที</p>
            </div>
          )}
          

          {status === "started" && (
            <>
              <div id="countdown">
                <div id="countdown-number">{countDown}</div>
                <svg>
                  <circle r="30" cx="33" cy="33"></circle>
                </svg>  
              </div>

              <div className="content">
                {words.map((word, index) => (
                  <span key={index}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(index, idx, char)} key={idx}>{char}</span>
                      ))}
                    </span>
                    <span> </span>  
                  </span>
                ))}
              </div>
            
              <div className="section-footer">
                <input disabled={status !== "started"} ref={textInput} type="text" className="input" onKeyDown={handleKeyDown} value={currInput} onChange={(e) => setCurrInput(e.target.value)}></input>
              </div>
              
            </>
              
            )}
            
            {status !== "started" && (
              <button className='btStart' onClick={btStart}>Start</button>
            )}
            {status === "finished" && (
              <div className="section-finished">
                <p>Word per minute:</p>
                <p>
                  {correct}
                </p>  
              </div>
            )}
        </div>
        
        
      </div>
      
    </div>
  );
}

export default App;
