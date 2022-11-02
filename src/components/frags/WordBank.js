import "../../styles/WordBank.css";
import { useEffect, useRef, useState } from "react";
import WordBankEntry from "./WordBankEntry";
import { useBuildMaster } from "../shared/BuildMasterProvider";

export default function WordBank() {
  const [wordBank, setWordBank] = useState(["FANG", "SWORD", "DRAGON"]);
  const [placed, setPlaced] = useState([]);
  const newWord = useRef();

  const [puzzle] = useBuildMaster();
  const maxLength = puzzle.rows >= puzzle.cols ? puzzle.rows : puzzle.cols;

  // console.log(wordBank);
  useEffect(() => {
    newWord.current.value = "";
  }, [wordBank]);

  const addWord = e => {
    const { value } = e.target;
    e.preventDefault();
    value &&
      setWordBank(prev => [
        ...prev,
        value.replace(" ", "").trim().toUpperCase(),
      ]);
    // e.target.value = "";
  };

  return (
    <div className="word-bank">
      <div className="word-bank-new flex col">
        <h5>new word</h5>
        <input
          ref={newWord}
          onKeyDown={e => e.key === "Enter" && addWord(e)}
          maxLength={maxLength}
        />
      </div>
      <ul className="word-bank-list flex col start">
        {wordBank.map((entry, i) => (
          <WordBankEntry
            key={i}
            entry={entry}
            placed={placed.includes(i)}
            setPlaced={() => setPlaced(prev => [...prev, i])}
          />
        ))}
      </ul>
    </div>
  );
}
