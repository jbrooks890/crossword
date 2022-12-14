import { useState, useEffect, useCallback, useRef } from "react";
import { debounce, getLetter } from "../../utility/helperFuncs";
import { useBuildMaster } from "../contexts/BuildMasterProvider";
import { usePlayMaster } from "../contexts/PlayMasterProvider";
import { ReactComponent as AXIS_SELECTOR } from "../../assets/icons/orientation-icon.svg";

export default function Cell({ cell_name: id, index, editorMode, ...props }) {
  const {
    isJunction,
    answer,
    groups,
    display,
    crop,
    dropPreview,
    dragEnter,
    dragLeave,
    drop,
    member,
    controls,
    focusCell,
    axis,
    toggleAxis,
    preview,
  } = props;
  const { active: editing, phase } = editorMode;
  const $PLAY = usePlayMaster();
  const [
    activeGroup,
    setActiveGroup,
    previewGroup,
    setPreviewGroup,
    game,
    setGame,
  ] = $PLAY ? $PLAY : [];
  const $BUILD = useBuildMaster();
  const [newPuzzle, setNewPuzzle, orientation, setOrientation] = $BUILD
    ? $BUILD
    : [];

  const cellInput = useRef();

  // console.log(groups);

  // =========== EDITOR CONTROLS ===========
  const editControls = e => {
    const {
      type,
      key,
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

    switch (type) {
      // ++++++ KEY UP ++++++
      case "keyup":
        printable && toNext();
        break;
      // ++++++ KEY DOWN ++++++
      case "keydown":
        // console.log(key);
        switch (key) {
          case " ":
            // console.log(`%cTOGGLE AXIS!`, "color:lime");
            e.preventDefault();
            toggleAxis();
            break;
          case "Backspace":
            if (content.length < 1) {
            }
            break;
          case "ArrowLeft":
            e.preventDefault();
            navTo(index, [-1, 0]);
            !orientation && toggleAxis();
            break;
          case "ArrowRight":
            e.preventDefault();
            navTo(index, [1, 0]);
            !orientation && toggleAxis();
            break;
          case "ArrowUp":
            e.preventDefault();
            navTo(index, [0, -1]);
            orientation && toggleAxis();
            break;
          case "ArrowDown":
            e.preventDefault();
            navTo(index, [0, 1]);
            orientation && toggleAxis();
            break;
        }
        break;
    }
  };

  // =========== TO NEXT ===========
  const toNext = () => {
    const [x, y] = index;
    const next = axis ? getLetter(x + 1) + y : getLetter(x) + (y + 1);
    document.querySelector(`.${next}.cell-input`).focus();
  };

  // =========== TO CELL ===========
  const navTo = (index, diff) => {
    //DIFF = [x,y]
    const [x, y] = index;
    const [a, b] = diff;
    const destination = getLetter(x + a) + (y + b);
    document.querySelector(`.${destination}.cell-input`).focus();
  };

  // =========== FORMAT CELL ===========

  const formatCell = () => {
    // console.log(groups);
    const groupNames = groups.map(group => group.name);
    return {
      cell: {
        classes: formatClassList(
          [
            member && "show",
            groupNames.join(" "),
            groups.map(group => group.dir).join(" "),
            // isJunction && "junction",
            display && display.join(" "),
            activeGroup && groupNames.includes(activeGroup) && "active",
            game && game.input.get(id) && "user-entry",
            game && game.assists.includes(id) && "assisted",
          ].filter(entry => entry)
        ),
        attributes: {
          ["data-groups"]: groupNames.join(" "),
          onMouseEnter: () => setPreviewGroup(groupNames),
          onMouseLeave: () => setPreviewGroup([]),
        },
      },
      input: {
        attributes: {
          onClick: () =>
            focusCell(id, !isJunction ? groups[0].name : undefined),
          onKeyDown: e => controls(e),
          onKeyUp: e => controls(e),
        },
      },
    };
  };

  const AxisSelector = () => {
    const selectAxis = e => {
      const { target } = e;
      const classes = target.parentElement.classList;
      const arbiter = groups.reduce((prev, entry) =>
        entry.group.indexOf(id) <= prev.group.indexOf(id) ? entry : prev
      ).dir;

      const axis = classes.contains("horizontal")
        ? "across"
        : classes.contains("vertical")
        ? "down"
        : arbiter;

      const { name } = groups.find(group => group.dir === axis);
      setActiveGroup(name);
      cellInput.current.focus();
    };
    return (
      <div className="axis-select" onClick={e => selectAxis(e)}>
        <AXIS_SELECTOR />
      </div>
    );
  };
  // =========== FORMAT CLASS LIST ===========
  const formatClassList = arr =>
    arr
      .filter(entry => entry)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

  // id === "H2" && console.log(formatCell());

  // =========== UPDATE USER INPUT ===========
  const updateUserInput = (id, value) =>
    setGame(prev => ({
      ...prev,
      input: new Map([...prev.input, [id, value]]),
    }));

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::
  return (
    <div
      id={id}
      className={formatClassList([
        "cell",
        axis ? "edit-across" : "edit-down",
        // editing && !preview ? "build" : formatCell().cell.classes,
        editing && "build",
        crop && "crop",
        member && "member",
        dropPreview && "drop-preview",
        isJunction && "junction",
        member && formatCell().cell.classes,
        // groups && groups.length && groups.map(group => group.name).join(" "),
      ])}
      data-coord-x={index[0]}
      data-coord-y={index[1]}
      {...(!editing && formatCell().cell.attributes)}
    >
      {groups &&
        ["across", "down"].map((dir, i) => {
          const target = groups.find(group => group.dir === dir);
          return (
            <span
              key={i}
              className={formatClassList([
                `${dir}-box`,
                "axis-box",
                target && target.name,
                activeGroup &&
                  target &&
                  target.name === activeGroup &&
                  "active",
                previewGroup &&
                  target &&
                  previewGroup.includes(target.name) &&
                  "preview",
              ])}
              onFocus={e =>
                document.querySelector(`#${id} .cell-input`).focus()
              }
            ></span>
          );
        })}
      {!editing && isJunction && <AxisSelector />}
      <input
        ref={cellInput}
        className={`cell-input ${id} ${answer ? "show" : ""}`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        onFocus={e => e.currentTarget.select()}
        onChange={
          editing && !preview
            ? e =>
                setNewPuzzle(prev => ({
                  ...prev,
                  answerKey: {
                    ...prev.answerKey,
                    [id]: e.target.value.toUpperCase(),
                  },
                }))
            : game
            ? e => updateUserInput(id, e.target.value)
            : undefined
        }
        onClick={
          () =>
            !editing && focusCell(id, !isJunction ? groups[0].name : undefined) //TODO
        }
        onKeyDown={e => (editing ? editControls(e) : controls(e))}
        onKeyUp={e => (editing ? editControls(e) : controls(e))}
        onDragOver={e => editing && !preview && e.preventDefault()}
        onDragEnter={e => (dragEnter ? dragEnter(e, index) : null)}
        onDragLeave={dragLeave ? dragLeave : null}
        onDrop={drop ? drop : null}
        placeholder={dropPreview ? dropPreview : editing ? id : undefined}
        value={
          game && game.input.has(id)
            ? game.input.get(id)
            : editing && newPuzzle.answerKey[id]
            ? newPuzzle.answerKey[id]
            : ""
        }
      />
    </div>
  );
}
