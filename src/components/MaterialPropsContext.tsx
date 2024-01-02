import { createContext,useContext,Dispatch,SetStateAction,useState } from "react";

const SOCContext = createContext<number>(0);
const SOCDispatchContext = createContext<Dispatch<SetStateAction<number>>>(() => {});

export function MaterialProvider({ children }:{ children:React.ReactNode }) {

  const [soc,setSOC] = useState<number>(0);

  return (
    <SOCContext.Provider value={soc}>
      <SOCDispatchContext.Provider value={setSOC}>
        {children}
      </SOCDispatchContext.Provider>
    </SOCContext.Provider>
  )
}

export const useSOC = () => useContext(SOCContext);
export const useSOCDispatch = () => useContext(SOCDispatchContext);