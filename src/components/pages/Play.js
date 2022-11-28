import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Frame from "../frags/Frame";
import HintBox from "../frags/HintBox";
import Grid from "../frags/Grid";
import ButtonCache from "../frags/ButtonCache";
import HintCache from "../frags/HintCache";
import apiUrl from "../../config";
import CommentSection from "../frags/CommentSection";
import AnswerInput from "../frags/AnswerInput";
import { PlayMasterProvider } from "../contexts/PlayMasterProvider";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useAuth } from "../contexts/AuthContextProvider";

export default function Play() {
  const location = useLocation();
  const { state: puzzle } = location;
  const { id } = useParams();
  const [activePuzzle, setActivePuzzle] = useState(
    puzzle ? initialize(puzzle) : {}
  );
  const { LOADED, answerKey, answers, comments } = activePuzzle;
  const [game, setGame] = useState();
  const [activeGroup, setActiveGroup] = useState(
    puzzle ? puzzle.answers[0].name : ""
  );
  const [preview, setPreview] = useState([]);
  const [hintCacheOpen, setHintCacheOpen] = useState(false);

  const $MOBILE = useMediaQuery();
  const [gridMini, toggleGridMini] = useState($MOBILE);

  const { auth, gameplay, setGameplay } = useAuth();

  const wrapper = useRef();

  // const $CAN_HOVER = useMediaQuery("hover");
  const PUZZLE_LINK = `${apiUrl}/puzzles/${id}`;
  const COMMENTS_LINK = `${apiUrl}/puzzle/comments/${id}`;

  // useEffect(() => activePuzzle && console.log(activePuzzle), []);
  useEffect(() => game && console.log(game), [game]);

  // <><><><><><><><><><><><><><><><><><><><><><><><><><><>
  // ::::::::::::::::::::\ LOAD GAME /::::::::::::::::::::
  // <><><><><><><><><><><><><><><><><><><><><><><><><><><>

  useEffect(() => {
    const session = JSON.parse(sessionStorage.getItem(id));
    // console.log(session);

    if (LOADED && !game) {
      setGame(
        auth?.username && gameplay.has(id)
          ? gameplay.get(id)
          : session
          ? { ...session, input: new Map(Object.entries(session.input)) }
          : {
              user: auth?.username ?? "",
              input: activePuzzle
                ? clearUserInput(activePuzzle?.answerKey)
                : null,
              assists: [],
              history: [],
              errors: [],
              startTime: 0, // Date obj
              READY: true,
              FINISHED: false,
              COMPLETED: false,
            }
      );
    }
  }, [activePuzzle]);

  // <><><><><><><><><><><><><><><><><><><><><><><><><><>
  // %%%%%%%%%%%%%%%%%%%%/ UNMOUNT \%%%%%%%%%%%%%%%%%%%%%
  // <><><><><><><><><><><><><><><><><><><><><><><><><><>

  // TUTORIAL:
  // https://blog.joshsoftware.com/2021/08/09/react-tricks-customizing-your-useeffect-to-run-only-when-you-want/

  const unmounting = useRef(false);

  useEffect(() => {
    return () => (unmounting.current = true);
  }, []);

  useEffect(() => {
    return () => {
      if (unmounting.current && game) {
        auth?.username
          ? setGameplay(prev => new Map([...prev]).set(id, game))
          : sessionStorage.setItem(
              id,
              JSON.stringify({
                ...game,
                input: Object.fromEntries([...game.input]),
              })
            );
      }
    };
  }, [game]);

  // =========== FETCH DATA ===========

  const fetchData = async () => {
    console.log("running fetchData()");
    try {
      const response = await axios.get(PUZZLE_LINK);
      const { puzzle } = response.data;
      setActivePuzzle(initialize(puzzle));
      setActiveGroup(puzzle.answers[0].name);
    } catch (e) {
      console.log(e);
    }
  };

  // =========== FETCH COMMENTS ===========

  const fetchComments = async () => {
    try {
      const response = await axios.get(COMMENTS_LINK);
      const { comments } = response.data;
      setActivePuzzle(prev => ({
        ...prev,
        comments,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  // =========== GENERATE ===========

  const getComments = () => {
    // setActiveGroup(puzzle.answers[0].name);
    comments.length && fetchComments();
  };

  useEffect(() => (puzzle ? getComments() : fetchData()), []);

  // =========== INITIALIZE ===========

  function initialize(puzzle) {
    return {
      ...puzzle,
      answers: new Map(puzzle.answers.map(entry => [entry.name, { ...entry }])),
      LOADED: true,
    };
  }

  // =========== CLEAR USER INPUT ===========

  function clearUserInput(answerKey) {
    return new Map(Object.keys(answerKey).map(id => [id, ""]));
  }

  // =========== RESET USER INPUT ===========

  function resetUserInput(answerKey) {
    setGame(prev => ({
      ...prev,
      input: clearUserInput(answerKey),
    }));
  }

  // =========== GET CELL DATA ===========
  const cellData = id => {
    const element = document.getElementById(id);
    const input = element.querySelector(".cell-input");
    const groups = element.getAttribute("data-groups").split(" ");
    const isJunction = element.classList.contains("junction");
    const x = parseInt(element.getAttribute("data-coord-x"));
    const y = parseInt(element.getAttribute("data-coord-y"));
    const direction = isJunction ? "junction" : groups[0].split("-")[0];
    return { id, element, input, groups, isJunction, x, y, direction };
  };

  // =========== FOCUS CELL ===========
  const focusCell = (id, group = activeGroup) => {
    group !== activeGroup && setGroup(group);
    cellData(id).input.focus();
  };

  // =========== SET GROUP ===========
  const setGroup = name => {
    if (name !== activeGroup) {
      setActiveGroup(name);
    }
  };

  // =========== BUTTON CONTROLS ===========
  const buttonControls = e => {
    // console.log(e);
    const {
      type,
      key: press,
      altKey,
      ctrlKey,
      shiftKey,
      currentTarget: input,
      which,
    } = e;
    const { parentElement: cell } = input;
    const { id } = cell;
    const content = input.value;
    const printable = which >= 65 && which <= 90;
    const isJunction = document
      .getElementById(id)
      .classList.contains("junction");
    const index = [
      parseInt(cell.getAttribute("data-coord-x")),
      parseInt(cell.getAttribute("data-coord-y")),
    ];
    const groups = cell.getAttribute("data-groups").split(" ");

    // console.log({ e, press, type });
    // console.log(index);

    switch (type) {
      // ++++++ KEY UP ++++++
      case "keyup":
        printable && focusNext(id);
        break;
      // ++++++ KEY DOWN ++++++
      case "keydown":
        switch (press) {
          case "Tab":
            e.preventDefault();
            focusNext(id);
            break;
          case "Backspace":
            // const { group } = answers.find(group => group.name === activeGroup);
            const { group } = answers.get(activeGroup);
            if (content.length < 1) {
              const prev = group.indexOf(id) - 1;

              if (prev < 0) {
                input.blur();
              } else {
                focusCell(group[prev]);
              }
            }
            break;
          case "Enter":
            e.preventDefault();
            focusNextGroup();
            break;
          case " ": // SPACE BAR
            e.preventDefault();
            if (isJunction) {
              focusCell(
                id,
                groups.find(group => group !== activeGroup)
              );
            }
            break;
          case "ArrowLeft":
            e.preventDefault();
            shiftKey
              ? focusFirst(activeGroup, true)
              : focusNearest(id, index, [-1, 0]);
            break;
          case "ArrowRight":
            e.preventDefault();
            focusNearest(id, index, [1, 0]);
            break;
          case "ArrowUp":
            e.preventDefault();
            shiftKey
              ? focusFirst(activeGroup, true)
              : focusNearest(id, index, [0, -1]);
            break;
          case "ArrowDown":
            e.preventDefault();
            focusNearest(id, index, [0, 1]);
            break;
          case "0":
            e.preventDefault();
            focusFirst(undefined, true);
            break;
          case ".":
            e.preventDefault();
            focusLast(undefined, true);
            break;
        }
        break;
    }
  };

  // =========== FOCUS NEXT ===========
  const focusNext = id => {
    const { isJunction, groups } = cellData(id);
    const { group } = answers.get(activeGroup);
    const currPos = group.indexOf(id);
    const lastCell = currPos === group.length - 1;

    if (!lastCell) {
      focusCell(group[currPos + 1]);
    } else {
      if (isJunction) {
        const altGroupName = groups.find(group => group !== activeGroup);
        const altGroup = answers.get(altGroupName).group;

        let next = altGroup.indexOf(id) + 1;
        if (next > altGroup.length - 1) {
          focusFirst(altGroupName);
        } else {
          focusCell(altGroup[next], altGroupName);
        }
      }
    }
  };

  // =========== FIND REMAINING ===========
  const findRemaining = () => {
    const remainder = [...game.input.values()].filter(userInput => !userInput);
    setGame(prev => ({ ...prev, FINISHED: !remainder.length }));
    return remainder;
  };

  // =========== FOCUS NEXT GROUP ===========
  const focusNextGroup = (name = activeGroup) => {
    // const groups = Object.keys(answers);
    const groups = [...answers.keys()];
    const index = groups.indexOf(name);
    let next = index + 1 >= groups.length ? groups[0] : groups[index + 1];

    // console.log(`Group: ${index + 1}/${groups.length}`);
    findRemaining().length && focusFirst(next);
  };

  // =========== FOCUS FIRST ===========
  const focusFirst = (name = activeGroup, strict = false) => {
    // console.log("%cFOCUS FIRST", "color: limegreen");
    const { group } = answers.get(name);
    const targets = group.filter(id => cellData(id).input.value.length === 0);

    if (strict) {
      focusCell(group[0], name);
    } else {
      if (targets.length) {
        focusCell(targets[0], name);
      } else {
        focusNextGroup(name);
      }
    }
  };

  // =========== FOCUS LAST ===========
  const focusLast = (name = activeGroup, strict = false) => {
    const { group } = answers.get(name);
    const targets = group.filter(id => cellData(id).input.value.length === 0);

    targets.length
      ? focusCell(
          strict ? group[group.length - 1] : targets[targets.length - 1],
          name
        )
      : focusNextGroup(name);
  };

  // =========== GET LETTER ===========
  const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
  };

  // =========== FOCUS NEAREST ===========
  const focusNearest = (id, [x, y], [xDiff, yDiff]) => {
    // console.log("%cFOCUS NEAREST", "color: yellow");
    const cell = document.getElementById(id);
    const actives = Object.keys(answerKey).sort();
    let cols = [];
    let rows = [];
    actives.forEach(entry => {
      const [col, _row] = entry.match(/[\d\.]+|\D+/g);
      const row = parseInt(_row);
      !cols.includes(col) && cols.push(col);
      !rows.includes(row) && rows.push(parseInt(row));
    });

    // console.log("Active groups:", actives);

    // AXIS: checking for candidates along an 'axis'
    const [dir, axis] =
      Math.abs(xDiff) > Math.abs(yDiff) ? ["across", cols] : ["down", rows];

    let destination;

    for (let distance = 1; distance < axis.length; distance++) {
      const [destX, destY] = [x + xDiff * distance, y + yDiff * distance];
      const candidate = getLetter(destX) + destY;

      if (
        destX < 0 ||
        destY < 0 ||
        destX >= axis.length ||
        destY >= axis.length
      )
        break;
      if (answerKey[candidate]) {
        destination = candidate;
        break;
      }
    }

    if (destination) {
      const cell = document.getElementById(destination);
      const isJunction = cell.classList.contains("junction");
      const groups = cell.getAttribute("data-groups").split(" ");
      const group = isJunction
        ? groups.find(group => group.includes(dir))
        : groups[0];
      focusCell(destination, group);
    }
  };

  // =========== GET HINTS ===========
  const getHints = () => {
    let list = new Map();
    answers.forEach((entry, name) => list.set(name, entry.hint));
    return list;
  };

  // =========== GIVE HINT ===========
  const giveHint = () => {
    const remaining = [...game.input.keys()].filter(
      id => game.input.get(id).length === 0
    );
    const id = remaining[Math.floor(Math.random() * remaining.length)];

    game.assists.length < 3 &&
      setGame(prev => ({
        ...prev,
        input: new Map([...prev.input, [id, answerKey[id]]]),
        assists: [...prev.assists, id],
      }));
  };

  // =========== UPDATE USER INPUT ===========
  const updateUserInput = (id, value) =>
    setGame(prev => ({
      ...prev,
      input: new Map([...prev.input, [id, value]]),
    }));

  // =========== CLEAR PUZZLE ===========
  const clearPuzzle = () =>
    setGame(prev => ({
      ...prev,
      input: new Map(
        [...prev.input].map(([id, value]) => [
          id,
          game.assists.includes(id) ? value : "",
        ])
      ),
    }));

  // =========== CHECK WORK ===========
  const checkWork = () => {
    // CHECK USER ENTRIES MATCHES EXACTLY THE ANSWER KEY
    const { input } = game;
    input.forEach((userInput, cell) => {
      if (userInput !== answerKey[cell]) return false;
    });
    return true;
  };

  // <><><><><><><><><><><> WIN PUZZLE <><><><><><><><><><><>
  const evalGame = () => {
    if (checkWork()) {
    }
  };

  const cellOperations = {
    controls: e => buttonControls(e),
    focusCell,
    getLetter,
  };

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::

  return (
    <div id="play-page">
      {LOADED && activeGroup && (
        <>
          <PlayMasterProvider
            state={[
              activeGroup,
              setActiveGroup,
              preview,
              setPreview,
              game,
              setGame,
            ]}
          >
            <Frame
              puzzle={activePuzzle}
              submit={e => console.log("Puzzle completed!")}
            >
              <div
                ref={wrapper}
                id="cw-grid-wrap"
                className={`flex col ${gridMini ? "mini" : ""} ${
                  hintCacheOpen ? "viewing-hints" : ""
                }`}
              >
                {!$MOBILE && (
                  <HintBox
                    hint={answers.get(activeGroup).hint}
                    toggleCache={() => setHintCacheOpen(prev => !prev)}
                  />
                )}
                <div id="puzzle-window" className="flex">
                  <Grid
                    puzzle={activePuzzle}
                    mini={gridMini}
                    toggleMini={toggleGridMini}
                    controls={e => buttonControls(e)}
                    focusCell={focusCell}
                    getLetter={getLetter}
                    operations={cellOperations}
                  />
                  {!gridMini && (
                    <HintCache
                      hints={getHints()}
                      focusFirst={focusFirst}
                      open={hintCacheOpen}
                      close={() => setHintCacheOpen(false)}
                      gridMini={gridMini}
                    />
                  )}
                </div>
                {gridMini && game && (
                  <AnswerInput
                    entry={answers.get(activeGroup)}
                    userInput={
                      new Map(
                        [...game.input].filter(([id]) =>
                          answers.get(activeGroup).group.includes(id)
                        )
                      )
                    }
                    updateInput={updateUserInput}
                    focusNextGroup={focusNextGroup}
                    hintCacheOpen={hintCacheOpen}
                    toggleHintCache={() => setHintCacheOpen(prev => !prev)}
                  />
                )}
                {gridMini && (
                  <HintCache
                    hints={getHints()}
                    focusFirst={focusFirst}
                    open={hintCacheOpen}
                    close={() => setHintCacheOpen(false)}
                    gridMini={gridMini}
                    groupCells={
                      new Map(
                        [...answers].map(([group, entry]) => [
                          group,
                          entry.group,
                        ])
                      )
                    }
                  />
                )}
              </div>
              {LOADED && (
                <ButtonCache giveHint={giveHint} clear={clearPuzzle} />
              )}
            </Frame>
          </PlayMasterProvider>
          {typeof comments[0] === "object" && (
            <CommentSection comments={comments} owner={id} />
          )}
        </>
      )}
    </div>
  );
}
