import { useContext, createContext } from "react";

const BuildMaster = createContext();
export const useBuildMaster = () => useContext(BuildMaster);

export function BuildMasterProvider({ children, state }) {
  return (
    <BuildMaster.Provider value={[...state]}>{children}</BuildMaster.Provider>
  );
}
