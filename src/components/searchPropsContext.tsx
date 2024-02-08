import { createContext,useContext,Dispatch,SetStateAction,useState } from "react";
import { SearchProps,SearchResults } from "@/types";

const defaultSearchProps:SearchProps = {
  filter: {
      elements: [],
      elementsExclude: [],
      precisely: false,
      "mp-ID": '',
      types: [],
      pam: false
  },
  page: 1,
  ordered: 'compoundname',
  asc: true
}

const defaultSearchResults:SearchResults = {
  results: [],
  total: 0
}

const SearchContext = createContext<SearchProps>(defaultSearchProps);
const SearchDispatchContext = createContext<Dispatch<SetStateAction<SearchProps>>>(() => {});
const SearchResultsContext = createContext<SearchResults>(defaultSearchResults);
const SearchResultsDispatchContext = createContext<Dispatch<SetStateAction<SearchResults>>>(() => {});

const AdvancedSymmetryContext = createContext<number[]>([])
const AdvancedSymmetryDispatchContext = createContext<Dispatch<SetStateAction<number[]>>>(() => {})

export function SearchPropsProvider({ children }:{ children:React.ReactNode }) {

  const [searchProps,setSearchProps] = useState<SearchProps>(defaultSearchProps);
  const [searchResults,setSearchResults] = useState<SearchResults>(defaultSearchResults);
  const [advancedSymmetry,setAdvancedSymmetry] = useState<number[]>([]);

  return (
    <SearchContext.Provider value={searchProps}>
      <SearchDispatchContext.Provider value={setSearchProps}>
        <SearchResultsContext.Provider value={searchResults}>
          <SearchResultsDispatchContext.Provider value={setSearchResults}>
            <AdvancedSymmetryContext.Provider value={advancedSymmetry}>
              <AdvancedSymmetryDispatchContext.Provider value={setAdvancedSymmetry}>
                {children}
              </AdvancedSymmetryDispatchContext.Provider>
            </AdvancedSymmetryContext.Provider>
          </SearchResultsDispatchContext.Provider>
        </SearchResultsContext.Provider>
      </SearchDispatchContext.Provider>
    </SearchContext.Provider>
  )
}

export const useSearchProps = () => useContext(SearchContext);
export const useSearchPropsDispatch = () => useContext(SearchDispatchContext);

export const useSearchResults = () => useContext(SearchResultsContext);
export const useSearchResultsDispatch = () => useContext(SearchResultsDispatchContext);

export const useAdvancedSymmetry = () => useContext(AdvancedSymmetryContext);
export const useAdvancedSymmetryDispatch = () => useContext(AdvancedSymmetryDispatchContext);