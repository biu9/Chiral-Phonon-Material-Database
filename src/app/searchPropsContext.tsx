import { createContext,useContext,Dispatch,SetStateAction,useState } from "react";

const defaultSearchProps:SearchProps = {
  filter: {
      elements: [],
      elementsExclude: [],
      precisely: false,
      "mp-ID": '',
      symmetry: [],
      types: [],
      pam: false
  },
  page: 1,
  ordered: '',
  asc: true
}

interface SearchProps {
  filter: {
      elements: {
          name: string,
          number: number
      }[],
      elementsExclude: {
          name: string,
          number: number
      }[],
      precisely: boolean,
      "mp-ID": string,
      symmetry: number[],
      types: {
          chiral: 'chiral' | 'achiral',
      }[],
      pam: boolean
  },
  page: number,
  ordered: string,
  asc: boolean
}

const SearchContext = createContext<SearchProps>(defaultSearchProps);
const SearchDispatchContext = createContext<Dispatch<SetStateAction<SearchProps>> | null>(null);

export function SearchPropsProvider({ children }:{ children:React.ReactNode }) {

  const [searchProps,setSearchProps] = useState<SearchProps>(defaultSearchProps);

  return (
    <SearchContext.Provider value={searchProps}>
      <SearchDispatchContext.Provider value={setSearchProps}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchContext.Provider>
  )
}

export const useSearchProps = () => useContext(SearchContext);

export const useSearchPropsDispatch = () => useContext(SearchDispatchContext);