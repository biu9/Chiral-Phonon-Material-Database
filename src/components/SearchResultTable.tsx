'use client'
import { useEffect, useState } from 'react';
import { useSearchResults,useSearchProps,useSearchPropsDispatch,useSearchResultsDispatch } from '@/app/searchPropsContext';
import { SearchResults,SearchProps,SearchResult } from "@/types";
import { POST } from '@/request';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import IconButton from '@mui/material/IconButton';

const TableItem = ({ data }:{ data:SearchResult }) => {

  const compundTranslate = (compound:{ name:string,number:number }[]):string => {
    let res = '';
    for(let i=0;i<compound.length;i++) {
      res += compound[i].name;
      res += compound[i].number;
      res += ' ';
    }

    return res;
  }

  return (
    <div className="flex border-gray-300 hover:bg-slate-100 border-x-1 border-t-1 py-2">
      <div className="w-80 pl-2">{compundTranslate(data.compound)}</div>
      <div className="w-80">{data.symmetry}</div>
      <div className="flex-1">占位</div>
      <div className="w-80">{data.type.chiral}</div>
    </div>
  )
}

export function SearchResultTable() {
  const [compundAsc,setCompoundAsc] = useState<boolean>(true);

  const setSearchProps = useSearchPropsDispatch();
  const setSearchResults = useSearchResultsDispatch();
  const searchResults = useSearchResults();
  const searchProps = useSearchProps();

  const search = async () => {
    const res = await POST<SearchProps,SearchResults>('search/result?apifoxToken=RpVbtDPqSo3cCqyGKHU6cKlkLWLM1iwd',searchProps);
    if(setSearchResults) {
        setSearchResults(res);
    }
    console.log('res',res);
  }

  const handleNextPage = () => {
    if(setSearchProps) {
      setSearchProps({
        ...searchProps,
        page: searchProps.page + 1
      })
    }
    search();
  }

  const handlePrevPage = () => {
    if(setSearchProps) {
      setSearchProps({
        ...searchProps,
        page: searchProps.page - 1 < 1 ? 1 : searchProps.page - 1
      })
    }
    search();
  }

  const handleFirstPage = () => {
    if(setSearchProps) {
      setSearchProps({
        ...searchProps,
        page: 1
      })
    }
    search();
  }

  return (
    <div className="px-6 py-12">
      <div>
        <strong> 3244 </strong>
        Entries found
        <strong> H </strong>,showing:
      </div>
      <div className='shadow-lg'>
        <div className="flex">
          <div className="w-80 cursor-pointer" onClick={async () => {
            if(setSearchProps) {
              setSearchProps({
                ...searchProps,
                asc: !compundAsc
              })
            }
            search();
            setCompoundAsc(!compundAsc);
          }}>
            {
              compundAsc ? '🔺 Compound' : '🔻 Compound'
            }
          </div>
          <div className="w-80">Symmetry Group</div>
          <div className="flex-1">占位</div>
          <div className="w-80">Type</div>
        </div>
        {
          searchResults.results.map((item:SearchResult,index) => {
            return <TableItem key={index} data={item} />
          })
        }
        <div className="w-full border-t-1"></div>
        <div className='px-2 py-3 border-1 shadow-lg border-gray-300 flex items-center justify-end pr-12'>
          {(searchProps.page-1) * 20+1}-{searchProps.page * 20} of 100
          <IconButton
            disabled={searchProps.page === 1}
            onClick={handleFirstPage}
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            disabled={searchProps.page === 1}
            onClick={handlePrevPage}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNextPage}
          >
            <KeyboardArrowRight />
          </IconButton>
          <IconButton>
            <LastPageIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}
