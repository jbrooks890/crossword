import { useState, useEffect, useCallback, useRef } from "react";
import { getLetter } from "../../services/customHooks";
import { useActiveGroup } from "../shared/ActiveGroupProvider";

export default function Cell({ cell_name: id, index, editorMode, ...props }) {
  const {
    isJunction,
    answer,
    groups,
    display,
    crop,
    controls,
    hoverGroup,
    focusCell,
    axis,
    toggleAxis,
    operations,
    preview,
    updateGrid,
    updateAnswerKey,
    captureAnswer,
  } = props;
  const { active: editing, phase } = editorMode;
  const [activeGroup, _, previewGroup, setPreviewGroup, game] =
    useActiveGroup();
  const cellInput = useRef();

  // useEffect(() => id === "J3" && console.log(groups), []);

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
            e.preventDefault();
            toggleAxis(prev => !prev);
            break;
          case "Backspace":
            if (content.length < 1) {
            }
            break;
          case "ArrowLeft":
            e.preventDefault();
            navTo(index, [-1, 0]);
            break;
          case "ArrowRight":
            e.preventDefault();
            navTo(index, [1, 0]);
            break;
          case "ArrowUp":
            e.preventDefault();
            navTo(index, [0, -1]);
            break;
          case "ArrowDown":
            e.preventDefault();
            navTo(index, [0, 1]);
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
    const groupNames = groups.map(group => group.name);
    return {
      cell: {
        classes: formatClassList(
          [
            answer && "show",
            groupNames.join(" "),
            groups.map(group => group.dir).join(" "),
            isJunction && "junction",
            display && display.join(" "),
            crop && "crop ",
            activeGroup && groupNames.includes(activeGroup) && "active",
            game.input.get(id) && "user-entry",
            game.assists.includes(id) && "assisted",
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

  const AxisSelector = () => (
    <div className="axis-select">
      {groups.map((group, i) => {
        // const dir = group.split("-")[0];
        const { name, dir } = group;
        return (
          <button
            key={i}
            className={`select-${dir}`}
            onClick={e => {
              e.preventDefault();
              // focusCell(id, axisGroups.get(dir));
              focusCell(id, name);
            }}
          ></button>
        );
      })}
    </div>
  );

  const formatClassList = arr =>
    arr
      .filter(entry => entry)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

  // id === "H2" && console.log(formatCell());

  // --------------------------------
  // :::::::::::: RENDER ::::::::::::
  return (
    <div
      id={id}
      className={formatClassList([
        "cell",
        axis ? "edit-across" : "edit-down",
        editing && !preview ? "build" : formatCell().cell.classes,
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
        className={`cell-input ${id} ${answer ? "show" : null}`}
        type="text"
        size="1"
        maxLength="1"
        tabIndex="-1"
        onFocus={e => e.currentTarget.select()}
        onChange={editing && !preview ? captureAnswer : undefined}
        onClick={
          () =>
            !editing && focusCell(id, !isJunction ? groups[0].name : undefined) //TODO
        }
        onKeyDown={e => (editing ? editControls(e) : controls(e))}
        onKeyUp={e => (editing ? editControls(e) : controls(e))}
        placeholder={editing ? id : undefined}
        // value={!editing && game.assists.includes(id) ? }
      />
    </div>
  );
}