import { useContext, createContext, useState } from "react";

const PlayMaster = createContext();
export const usePlayMaster = () => useContext(PlayMaster);

export function PlayMasterProvider({ state, children }) {
  // const [activeGroup, setPlayMaster] = useState(init ? stat : "");
  const [activeGroup, setPlayMaster, preview, setPreview, game, setGame] =
    state;
  // console.log({activeGroup})

  return (
    <PlayMaster.Provider
      value={[activeGroup, setPlayMaster, preview, setPreview, game, setGame]}
    >
      {children}
    </PlayMaster.Provider>
  );
}
