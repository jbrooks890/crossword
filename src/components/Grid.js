import Cell from "./Cell";

export default function Grid({
  activeGroup,
  gridWidth,
  gridHeight,
  editorMode,
  answerKey,
  answers,
  setGroup,
  controls,
  onHover,
  focusCell,
  getLetter,
}) {
  const activeCells = Object.keys(answerKey);
  const activeCols = [];
  const activeRows = [];
  activeCells.forEach(cell => {
    const [col, _row] = cell.match(/[\d\.]+|\D+/g);
    const row = parseInt(_row);
    !activeCols.includes(col) && activeCols.push(col);
    !activeRows.includes(row) && activeRows.push(row);
  });

  /*   const getLetter = n => {
    const first = "a".charCodeAt(0);
    const last = "z".charCodeAt(0);
    const length = last - first + 1; // letter range

    // console.log(String.fromCharCode(first + n - 1));
    return String.fromCharCode(first + n).toUpperCase();
  }; */

  const drawGrid = () => {
    let rows = [];
    let count = 0;
    for (let y = 0; y < gridHeight; y++) {
      let row = [];
      for (let x = 0; x < gridWidth; x++) {
        const cellName = getLetter(x) + y;
        row.push(
          <Cell
            key={count++}
            cell_name={cellName}
            isJunction={false}
            index={[x, y]}
            answer={answerKey[cellName] ? answerKey[cellName] : null}
          />
        );
      }
      rows.push(row);
    }

    return rows.map((row, i) => <tr key={i}>{row}</tr>);
  };

  const setTabOrder = () => {
    let order = 0;
    const groupNames = Object.keys(answers);
    groupNames.forEach(name =>
      answers[name].group.forEach(id => {
        const cell = document.querySelector(`#${id}.cell`);
        const xBox = cell.querySelector(".acrossBox");
        const yBox = cell.querySelector(".downBox");
        const axis = name.split("-")[0] === "across" ? xBox : yBox;
        axis.tabIndex = order;
        order++;
      })
    );
  };

  const drawPuzzle = () => {
    const totalCells = gridWidth * gridHeight;
    let count = 0;
    let cells = [];
    // let allGroups = answers.map(answer => answer.group);
    let groupNames = Object.keys(answers);

    // console.log(allGroups);

    while (count < totalCells) {
      // 18 --> [0,1], 19 --> [1,1]
      let x = count % gridHeight;
      let y = Math.floor(count / gridWidth);
      let col = getLetter(x);
      let cellName = col + y;
      let groups = groupNames.filter(entry =>
        answers[entry].group.includes(cellName)
      );
      let display = [];

      groups.forEach(entry => {
        let across = entry.split("-")[0] === "across";
        let group = answers[entry].group;

        if (across) {
          if (group[0] === cellName) {
            display.push("first");
          } else if (group[group.length - 1] === cellName) {
            display.push("last");
          }
        } else {
          if (group[0] === cellName) {
            display.push("top");
          } else if (group[group.length - 1] === cellName) {
            display.push("bottom");
          }
        }
      });

      cells.push(
        <Cell
          key={count}
          cell_name={cellName}
          activeGroup={activeGroup}
          isJunction={groups.length > 1}
          index={[x, y]}
          answer={answerKey[cellName] ? answerKey[cellName] : null}
          groups={groups}
          display={display.length && display}
          crop={!activeCols.includes(col) || !activeRows.includes(y)}
          setGroup={setGroup}
          onHover={onHover}
          // onKeyDown={e => cellKeyDown(e)}
          controls={e => controls(e)}
          focusCell={focusCell}
        />
      );
      count++;
    }

    // console.log(cells[Math.floor(Math.random() * cells.length)]);
    return cells;
  };

  return (
    <div
      id="cw-grid"
      className="grid"
      style={{
        gridTemplate: `repeat(${activeRows.length}, 48px) / repeat(${activeCols.length}, 48px)`,
      }}
    >
      {drawPuzzle()}
    </div>
  );
}
