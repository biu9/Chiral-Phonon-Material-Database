'use client'
import { useState } from 'react';
import { 
  useSearchResults,
  useSearchProps,
  useSearchPropsDispatch,
  useSearchResultsDispatch,
} from '@/components/searchPropsContext';
import { SearchResults,SearchProps,SearchResult } from "@/types";
import { POST } from '@/request';
import { useRouter } from 'next/navigation';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import IconButton from '@mui/material/IconButton';

const TableItem = ({ data }:{ data:SearchResult }) => {

  const router = useRouter();

  const compundTranslate = (compound:{ name:string,number:number }[]):string => {
    let res = '';
    for(let i=0;i<compound.length;i++) {
      res += compound[i].name;
      res += compound[i].number;
      res += ' ';
    }

    return res;
  }

  const handleCompoundClick = () => {
    const params = new URLSearchParams();
    params.set('data',JSON.stringify(data));
    router.push(`/result/${data.compound_name}?${params.toString()}`);
  }

  return (
    <div className="flex border-gray-300 hover:bg-slate-100 border-x-1 border-t-1 py-2 cursor-pointer" onClick={handleCompoundClick}>
      <div className="w-80 pl-2">{data.compound_name}</div>
      <div className="w-80">{data.symmetry}</div>
      <div className="flex-1"></div>
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

  const search = async (props:SearchProps) => {
    const res = await POST<SearchProps,SearchResults>('search/result',props);
    setSearchResults(res.data);
  }

  const handleNextPage = () => {
    const tmp = {
      ...searchProps,
      page: searchProps.page + 1 > Math.ceil(searchResults.total / 20) ? Math.ceil(searchResults.total / 20) : searchProps.page + 1
    }
    setSearchProps(tmp)
    search(tmp);
  }

  const handlePrevPage = () => {
    const tmp = {
      ...searchProps,
      page: searchProps.page - 1 < 1 ? 1 : searchProps.page - 1
    }
    setSearchProps(tmp)
    search(tmp);
  }

  const handleFirstPage = () => {
    const tmp = {
      ...searchProps,
      page: 1
    }
    setSearchProps(tmp)
    search(tmp);
  }

  return (
    <div className="px-6 py-12">
      <div>
        <strong> {searchResults.total ? searchResults.total : 0} </strong>
        Entries found
        <strong> 
          {
            searchProps.filter.elements.reduce((acc,cur) => acc+cur.name+cur.number+' ',' ')
          } 
        </strong>,showing:
      </div>
      <div className='shadow-lg'>
        <div className="flex">
          <div className="w-80 cursor-pointer" onClick={async () => {
            const tmp = {
              ...searchProps,
              asc: !compundAsc
            }
            setSearchProps(tmp)
            search(tmp);
            setCompoundAsc(!compundAsc);
          }}>
            {
              compundAsc ? '🔺 Compound' : '🔻 Compound'
            }
          </div>
          <div className="w-80">Symmetry Group</div>
          <div className="flex-1"></div>
          <div className="w-80">Type</div>
        </div>
        {
          searchResults.results && searchResults.results.map((item:SearchResult,index) => {
            return <TableItem key={index} data={item} />
          })
        }
        <div className="w-full border-t-1"></div>
        <div className='px-2 py-3 border-1 shadow-lg border-gray-300 flex items-center justify-end pr-12'>
          {(searchProps.page-1) * 20+1}-{searchProps.page * 20} of {searchResults.total}
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
            disabled={searchProps.page === Math.ceil(searchResults.total / 20)}
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
