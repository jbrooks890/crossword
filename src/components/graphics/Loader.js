import "../../styles/Loader.css";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import { loadingWords } from "../../utility/misc";
import { useEffect, useRef, useState } from "react";

export default function Loader({ isLoading = true }) {
  const [loaded, setLoaded] = useState(!isLoading);
  const wordList = loadingWords.split(" ");
  const [loadWord, setLoadWord] = useState("Loading");
  const loader = useRef();
  const logo = useRef();
  const word = useRef();

  function getWord(prev) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    return word === prev ? getWord() : word;
  }

  // useEffect(() => !loaded && refreshWord(), [loaded, loadWord]);

  // useEffect(() => !loaded && setTimeout(() => setLoaded(true), 5000), []);
  useEffect(() => {
    const timer =
      !loaded && setTimeout(() => setLoadWord(prev => getWord(prev)), 5000);
    return () => clearTimeout(timer);
  }, [loadWord]);

  // useEffect(() => {
  //   const refreshWord = () =>
  //     setTimeout(() => setLoadWord(prev => getWord(prev)), 500);
  //   !loaded && word.current.addEventListener("animationend", refreshWord);
  //   return () => word.current.removeEventListener("animationend", refreshWord);
  // });

  return (
    <div ref={loader} className={`loader ${loaded ? "loaded" : "loading"}`}>
      <XWORD_LOGO ref={logo} />
      {/* <svg>
        <text>{getWord()}</text>
      </svg> */}
      <h3 ref={word} className="loading-word">
        {loadWord
          .concat("...")
          .split("")
          .map((letter, i, word) => (
            <span
              key={i}
              style={{ ["--i"]: i, ["--delay"]: word.length + "s" }}
            >
              {letter}
            </span>
          ))}
      </h3>
    </div>
  );
}
