import "../../styles/WordBank.css";
import { useEffect, useRef, useState } from "react";
import WordBankEntry from "./WordBankEntry";
import { useBuildMaster } from "../shared/BuildMasterProvider";

export default function WordBank({ puzzle }) {
  const { answers, rows, cols } = puzzle;
  // const sums = [...answers.values()].map(entry => entry.sum);
  const sums = new Map(
    [...answers.values()].map(answer => [answer.sum, answer.name])
  );
  console.log(sums);
  const [wordBank, setWordBank] = useState(
    new Map([
      ["FANG", undefined],
      ["SWORD", undefined],
      ["DRAGON", undefined],
    ])
  );
  const [error, setError] = useState("");
  // const [placed, setPlaced] = useState([]);
  const newWord = useRef();

  const maxLength = rows >= cols ? rows : cols;

  // =========== RESET WORD ENTRY INPUT ===========
  useEffect(() => {
    newWord.current.value = "";
  }, [wordBank]);

  // useEffect(() => error && setError(""), [newWord.current]);

  // =========== REVERSE MAP ===========

  const reverse = mapArr =>
    new Map([...mapArr].map(([key, value]) => [value, key]));

  // =========== ADD BY GROUP ===========

  const addByGroup = sums => {
    const wordBankGroups = reverse(
      new Map([...wordBank].filter(entry => entry[1]))
    );
    const newWords = new Map([...wordBank].filter(entry => !entry[1]));
    const result = reverse(new Map([...wordBankGroups, ...reverse(sums)]));
    return new Map([...newWords, ...result]);
  };

  useEffect(() => setWordBank(addByGroup(sums)), [answers]);

  // =========== ADD WORD (to Word Bank) ===========

  const addWord = e => {
    e.preventDefault();
    const { value } = e.target;
    const entry = value.replace(" ", "").trim().toUpperCase();
    value && setWordBank(prev => new Map([...prev]).set(entry, null));
    // : setError(`${entry} is already in play.`);
  };

  // =========== PLACE WORD (on the Grid) ===========

  const placeWord = (target, group) => {
    console.log({ target, group });
    setWordBank(prev => new Map([...prev]).set(target, group));
  };

  return (
    <div className="word-bank">
      <div className="word-bank-new flex col">
        <h5>new word</h5>
        <input
          ref={newWord}
          onKeyDown={e => e.key === "Enter" && addWord(e)}
          maxLength={maxLength}
          onChange={() => (error ? setError("") : null)}
        />
      </div>
      <div className={`word-bank-error ${error ? "active" : ""}`}>
        {error && error}
      </div>
      <ul className="word-bank-list flex col start">
        {[...wordBank].map(([entry, group], i) => (
          <WordBankEntry
            key={i}
            entry={entry}
            placed={group ? group : null}
            // setPlaced={() => setPlaced(prev => [...prev, i])}
            placeWord={placeWord}
          />
        ))}
      </ul>
    </div>
  );
}
