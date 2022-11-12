import { createContext, useContext, useState } from "react";

const DragDrop = createContext();
export const useDragDrop = () => useContext(DragDrop);

export default function DragDropProvider({ children }) {
  const [holding, setHolding] = useState({});
  return (
    <DragDrop.Provider value={{ holding, setHolding }}>
      {children}
    </DragDrop.Provider>
  );
}
