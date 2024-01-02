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

export function SearchPropsProvider({ children }:{ children:React.ReactNode }) {

  const [searchProps,setSearchProps] = useState<SearchProps>(defaultSearchProps);
  const [searchResults,setSearchResults] = useState<SearchResults>(defaultSearchResults);

  return (
    <SearchContext.Provider value={searchProps}>
      <SearchDispatchContext.Provider value={setSearchProps}>
        <SearchResultsContext.Provider value={searchResults}>
          <SearchResultsDispatchContext.Provider value={setSearchResults}>
            {children}
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