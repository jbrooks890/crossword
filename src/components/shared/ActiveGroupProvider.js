import { useContext, createContext, useState } from "react";

const ActiveGroup = createContext();
export const useActiveGroup = () => useContext(ActiveGroup);

export function ActiveGroupProvider({ state, children }) {
  // const [activeGroup, setActiveGroup] = useState(init ? stat : "");
  const [activeGroup, setActiveGroup, preview, setPreview, game, setGame] =
    state;
  // console.log({activeGroup})

  return (
    <ActiveGroup.Provider
      value={[activeGroup, setActiveGroup, preview, setPreview, game, setGame]}
    >
      {children}
    </ActiveGroup.Provider>
  );
}
