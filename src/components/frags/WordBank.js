import "../../styles/WordBank.css";
import { useEffect, useRef, useState } from "react";
import WordBankEntry from "./WordBankEntry";
import { useBuildMaster } from "../contexts/BuildMasterProvider";
import { useDragDrop } from "../contexts/DragDropProvider";

export default function WordBank({ puzzle, wordList, axis, toggleAxis }) {
  const { answerKey, answers, rows, cols } = puzzle;
  const [wordBank, setWordBank] = useState(new Map());
  const [error, setError] = useState("");
  const [newPuzzle, setNewPuzzle] = useBuildMaster();
  const [newWord, setNewWord] = useState("");
  const newWordInput = useRef();
  const newWordBtn = useRef();
  const { holding } = useDragDrop();

  const maxLength = rows >= cols ? rows : cols;

  // =========== CLEAR ERROR ===========
  useEffect(() => error && setError(""), [newWord]);

  // =========== REVERSE MAP ===========

  const reverse = mapArr =>
    new Map([...mapArr].map(([key, value]) => [value, key]));

  // =========== ADD BY GROUP ===========

  const addByGroup = () => {
    const wordBankGroups = reverse(
      new Map([...wordBank].filter(entry => entry[1]))
    );
    const sums = new Map(
      [...answers.values()].map(answer => [answer.sum, answer.name])
    );

    const newWords = new Map([...wordBank].filter(entry => !entry[1]));
    const result = reverse(new Map([...reverse(sums)]));

    return new Map([...newWords, ...result]);
  };

  useEffect(() => setWordBank(addByGroup()), [answers]);

  // =========== ADD WORD (to Word Bank) ===========

  const addWord = e => {
    e.preventDefault();
    const entry = newWord.replaceAll(" ", "").trim();

    if (newWord.length > 1) {
      if (!wordBank.has(entry)) {
        setWordBank(prev => new Map([...prev]).set(entry, undefined));
        setNewWord("");
      } else {
        setError(`${entry} is already in play.`);
      }
    }
  };

  // =========== ADD BULK ===========

  const bulkAdd = words =>
    setWordBank(
      prev => new Map([...prev, ...words.map(word => [word, undefined])])
    );

  useEffect(() => wordList.length && bulkAdd(wordList), [wordList]);

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
          onDragOver={e => e.preventDefault()}
          onDrop={() => holding.entry && editWord(holding.entry)}
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
            // toggleAxis={toggleAxis}
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
