import "../../styles/Loader.css";
import { ReactComponent as XWORD_LOGO } from "../../assets/icons/xword-logo-2.svg";
import { loadingWords } from "../../utility/misc";
import { useEffect, useRef, useState } from "react";
import Modal from "../shared/Modal";
import useModal from "../../hooks/useModal";

export default function Loader({ isLoading, finish }) {
  const [loaded, setLoaded] = useState(false);
  const wordList = loadingWords.split(" ");
  const [loadWord, setLoadWord] = useState("Loading");
  const { isShowing, toggle } = useModal();
  const loader = useRef();
  const logo = useRef();
  const word = useRef();

  function getWord(prev) {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    return word === prev ? getWord() : word;
  }

  // CYCLE LOADING WORDS
  useEffect(() => {
    // console.log({ isLoading, loadWord });
    const timer = setTimeout(
      () => isLoading && setLoadWord(prev => getWord(prev)),
      5000
    );
    return () => clearTimeout(timer);
  }, [loadWord]);

  useEffect(() => {
    const finishLoading = () =>
      setTimeout(() => {
        setLoaded(true);
        finish();
      }, 300);
    word.current.lastElementChild.addEventListener(
      "transitionend",
      finishLoading
    );

    return () =>
      isLoading &&
      word.current.lastElementChild.removeEventListener(
        "transitionend",
        finishLoading
      );
  }, [isLoading]);

  return (
    <Modal isShowing={!loaded} hide={""} auto={true}>
      <div
        ref={loader}
        className={`loader ${
          isLoading ? "loading" : loaded ? "loaded" : "dismounting"
        } flex col center`}
      >
        <XWORD_LOGO ref={logo} />
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
    </Modal>
  );
}
