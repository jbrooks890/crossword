export default function GameControlsHelp({ mode }) {
  const Play = "Play";
  const Build = "Build";
  const Touch = "Touch";
  const Keyboard = "Keyboard";

  const CONTROLS = new Map([
    [
      { btn: "Space", btnAbbr: "spc", charCode: " " },
      new Map([
        // [{Mode: isTouch?}, "function description"]
        [{ Play: Keyboard }, "Toggle orientation at cell joint"],
        [{ Play: Touch }, "Skip to next cell"],
        [{ Build: Keyboard }, "Toggle orientation"],
      ]),
    ],
    [
      { btn: "Tab", btnAbbr: "tab", charCode: "" },
      new Map([
        [{ Play: Keyboard }, "Skip to next cell"],
        [{ Play: Touch }, "Skip to next cell"],
      ]),
    ],
    [
      { btn: "Enter/Return", btnAbbr: "entr/rtn", charCode: "" },
      new Map([
        [{ Play: Keyboard }, "Skip to next word"],
        [{ Play: Touch }, "Skip to next word"],
        // [{ Build: Keyboard }, "Skip to next word"],
      ]),
    ],
    [
      { btn: "Backspace/Delete", btnAbbr: "bspc/del", charCode: "" },
      new Map([
        [{ Play: Keyboard }, "Delete letter"],
        [{ Play: Touch }, "Delete letter"],
        [{ Build: Keyboard }, "Delete letter"],
        [{ Build: Touch }, "Delete letter"],
      ]),
    ],
    [
      { btn: "Zero", btnAbbr: "0", charCode: "" },
      new Map([[{ Play: Keyboard }, "Jump to first letter"]]),
    ],
  ]);
}
