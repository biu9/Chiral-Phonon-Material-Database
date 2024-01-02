'use client'
import SideBar from "@/components/SideBar";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import ElementTable from "@/components/ElementTable/index";
import AdvancedOtions from "@/components/AdvancdeOtions";
import { useRouter } from 'next/navigation';
import { useState,useEffect } from 'react';
import { IElement } from '@/types';
import { SearchPropsProvider,useSearchProps,useSearchPropsDispatch,useSearchResultsDispatch } from "../components/searchPropsContext";
import { SearchResultTable } from "@/components/SearchResultTable";
import { SearchResults,SearchProps } from "@/types";
import { POST } from "@/request";

/**
 * @description 将IElement[]形式的数组转化为'name1+number1 name2+number2'形式的字符串
 */
function translate(containElements:IElement[]):string {
    let res = '';

    for(let i=0;i<containElements.length;i++) {
        res += containElements[i].name;
        if(containElements[i].number !== 1) {
            res += containElements[i].number;
        }
        if(i !== containElements.length - 1)
            res += ' ';
    }

    return res;
}

const SearchBar = () => {
    
    const [containValue, setContainValue] = useState<string>('');
    const router = useRouter();

    const searchProps = useSearchProps();
    const setSearchProps = useSearchPropsDispatch();

    const setSearchResults = useSearchResultsDispatch();

    useEffect(() => {
        setContainValue(translate(searchProps.filter.elements));
    },[searchProps.filter.elements])

    const handleContainInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContainValue(event.target.value);
    }

    const handleContainBlur = () => {
        const tmp = containValue.split(' ');
        const tmpArr:IElement[] = [];
        for(let i=0;i<tmp.length;i++) {
            const name = tmp[i].match(/[a-zA-Z]+/g)?.join('');
            const number = tmp[i].match(/[0-9]+/g)?.join('');
            if(name) {
                tmpArr.push({
                    name: name,
                    number: number ? parseInt(number) : 1
                });
            }
        }
        setSearchProps({
            ...searchProps,
            filter: {
                ...searchProps.filter,
                elements: tmpArr
            }
        })
    }

    const handleSearch = async () => {
        const res = await POST<SearchProps,SearchResults>('search/result',searchProps);
        setSearchResults(res.data);
    }

    return (
        <div className="p-6 w-full flex justify-between space-x-12 items-end flex-col lg:flex-row space-y-3">
            <div className="lg:grow-3 w-full">
                <div className="flex justify-between items-center">
                    <div>Compound Contains</div>
                    <div className="flex items-center">
                        <div>Only these elements</div>
                        <Checkbox />
                    </div>
                </div>
                <TextField variant="outlined" size="small" fullWidth value={containValue} onChange={handleContainInput} onBlur={handleContainBlur}/>
            </div>
            <div className="lg:grow-2 w-full">
                <div className="flex justify-between">
                    Exclude
                </div>
                <TextField variant="outlined" size="small" fullWidth />
            </div>
            <div className="lg:grow-2 w-full">
                <div className="flex justify-between">
                    mp-ID
                </div>
                <TextField variant="outlined" size="small" fullWidth onChange={(e) => {
                    const tmp = {...searchProps};
                    tmp.filter['mp-ID'] = e.target.value;
                }}/>
            </div>
            <div className="lg:grow-2 w-full bg-blue-600 text-white rounded-md">
                <Button variant="contained" fullWidth onClick={handleSearch}>Search</Button> 
            </div>
        </div>
    )
}

export default function Result() {

    const [isShowAdvanced, setIsShowAdvanced] = useState(false)

    return (
        <SearchPropsProvider >
            <div className="flex">
                <SideBar />
                <div className="flex w-full flex-col">
                    <SearchBar />
                    <div className="px-6 pb-3 cursor-pointer" onClick={() => {
                        setIsShowAdvanced(!isShowAdvanced)
                    }}>
                        {
                            isShowAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'
                        }
                    </div>
                    {
                        isShowAdvanced ? <AdvancedOtions /> :<ElementTable/>
                    }
                    <SearchResultTable />
                </div>
            </div>
        </SearchPropsProvider>
    )
}