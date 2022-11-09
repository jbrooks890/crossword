import "../../styles/WordBank.css";
import { useEffect, useRef, useState } from "react";
import WordBankEntry from "./WordBankEntry";
import { useBuildMaster } from "../shared/BuildMasterProvider";

export default function WordBank({ puzzle, axis, toggleAxis }) {
  const { answers, rows, cols } = puzzle;
  const sums = new Map(
    [...answers.values()].map(answer => [answer.sum, answer.name])
  );
  // console.log(sums);
  const [wordBank, setWordBank] = useState(
    new Map([
      ["FANG", undefined],
      ["SWORD", undefined],
      ["DRAGON", undefined],
    ])
  );
  const [error, setError] = useState("");
  const [newPuzzle, setNewPuzzle] = useBuildMaster();
  const [newWord, setNewWord] = useState("");
  const newWordInput = useRef();
  const newWordBtn = useRef();

  const maxLength = rows >= cols ? rows : cols;

  // console.log(wordBank, sums);

  // =========== CLEAR ERROR ===========
  useEffect(() => error && setError(""), [newWord]);

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
    // const { value } = e.target;
    // const entry = value.replace(" ", "").trim().toUpperCase();
    const entry = newWord.replace(" ", "").trim();
    // console.log({ entry }, wordBank.has(entry));

    if (newWord.length > 1) {
      if (!wordBank.has(entry)) {
        setWordBank(prev => new Map([...prev]).set(entry, undefined));
        setNewWord("");
      } else {
        setError(`${entry} is already in play.`);
      }
    }
  };

  // =========== PLACE WORD (on the Grid) ===========

  const placeWord = (target, group) => {
    console.log({ target, group });
    setWordBank(prev => new Map([...prev]).set(target, group));
  };

  // =========== EDIT WORD ===========

  const editWord = entry => {
    setWordBank(
      prev => new Map([...prev].filter(target => target[0] !== entry))
    );
    setNewWord(entry);
    newWordInput.current.focus();
  };

  // =========== REMOVE WORD (from the Grid) ===========

  const removeWord = (entry, placed) => {
    const { answerKey, answers } = newPuzzle;
    const newAnswerKey = { ...answerKey };

    answers.get(placed).group.forEach(id => {
      // UNLESS CELL IS A JUNCTION
      const isJunction =
        [...answers.values()].filter(entry => entry.group.includes(id)).length >
        1;
      !isJunction && delete newAnswerKey[id];
    });

    setWordBank(prev => new Map([...prev]).set(entry, undefined));
    setNewPuzzle(prev => ({
      ...prev,
      answerKey: newAnswerKey,
    }));
  };

  // =========== DELETE WORD (from word bank) ===========

  const deleteWord = entry =>
    setWordBank(
      prev => new Map([...prev].filter(target => target[0] !== entry))
    );

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div className="word-bank">
      <div className="word-bank-new flex">
        {/* <h5>new word</h5> */}
        <input
          ref={newWordInput}
          onKeyDown={e => e.key === "Enter" && addWord(e)}
          maxLength={maxLength}
          placeholder="New Word"
          onChange={e => {
            setNewWord(e.target.value.toUpperCase());
          }}
          value={newWord}
        />
        <button
          ref={newWordBtn}
          className={newWord.length > 1 ? "active" : ""}
          onClick={e => addWord(e)}
        >
          +
        </button>
      </div>
      <div className={`word-bank-error ${error ? "active" : ""}`}>
        {error && error}
      </div>
      <ul className="word-bank-list flex col start">
        {[...wordBank].map(([entry, placed], i) => (
          <WordBankEntry
            key={i}
            entry={entry}
            placed={placed ? placed : null}
            axis={axis}
            toggleAxis={toggleAxis}
            placeWord={placeWord}
            editWord={() => editWord(entry)}
            removeWord={() => removeWord(entry, placed)}
            deleteWord={() => deleteWord(entry)}
          />
        ))}
      </ul>
    </div>
  );
}
