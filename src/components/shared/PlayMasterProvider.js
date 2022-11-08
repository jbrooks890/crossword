import { useContext, createContext, useState } from "react";

const PlayMaster = createContext();
export const usePlayMaster = () => useContext(PlayMaster);

export function PlayMasterProvider({ state, children }) {
  return (
    <PlayMaster.Provider value={[...state]}>{children}</PlayMaster.Provider>
  );
}
