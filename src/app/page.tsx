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
import { SearchPropsProvider,useSearchProps,useSearchPropsDispatch,useSearchResultsDispatch,useAdvancedSymmetryDispatch } from "../components/searchPropsContext";
import { SearchResultTable } from "@/components/SearchResultTable";
import { SearchResults,SearchProps,BriefSearchResult } from "@/types";
import { POST,GET } from "@/request";

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
    const [excludeValue, setExcludeValue] = useState<string>('');
    const [only, setOnly] = useState<boolean>(false); // 是否只包含containValue中的元素
    const router = useRouter();

    const searchProps = useSearchProps();
    const setSearchProps = useSearchPropsDispatch();

    const setSearchResults = useSearchResultsDispatch();

    const setAdvancedSymmetry = useAdvancedSymmetryDispatch();

    useEffect(() => {
        setContainValue(translate(searchProps.filter.elements));
        setExcludeValue(translate(searchProps.filter.elementsExclude));

        (async() => {
            const res = await POST<SearchProps,BriefSearchResult>('search/brief',searchProps)
            setAdvancedSymmetry(res.data.symmetry);
        })();
    },[searchProps, searchProps.filter.elements, searchProps.filter.elementsExclude])

    const handleContainInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContainValue(event.target.value);
    }

    const handleExculdeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExcludeValue(event.target.value);
    }

    const handleOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOnly(event.target.checked);
        if(event.target.checked) {
            setSearchProps({
                ...searchProps,
                filter: {
                    ...searchProps.filter,
                    precisely: event.target.checked
                }
            })
        }
    }

    const handlempID = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProps({
            ...searchProps,
            filter: {
                ...searchProps.filter,
                'mp-ID': event.target.value
            }
        })
    }

    const handleContainBlur = (isContain:boolean) => {
        const tmp = isContain ? containValue.split(' ') : excludeValue.split(' ');
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
        if(isContain) {
            setSearchProps({
                ...searchProps,
                filter: {
                    ...searchProps.filter,
                    elements: tmpArr
                }
            })            
        } else {
            setSearchProps({
                ...searchProps,
                filter: {
                    ...searchProps.filter,
                    elementsExclude: tmpArr
                }
            })   
        }
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
                        <Checkbox value={only} onChange={handleOnly}/>
                    </div>
                </div>
                <TextField variant="outlined" size="small" fullWidth value={containValue} onChange={handleContainInput} onBlur={() => handleContainBlur(true)}/>
            </div>
            <div className="lg:grow-2 w-full">
                <div className="flex justify-between">
                    Exclude
                </div>
                <TextField variant="outlined" size="small" fullWidth value={excludeValue} onChange={handleExculdeInput} onBlur={() => handleContainBlur(false)} />
            </div>
            <div className="lg:grow-2 w-full">
                <div className="flex justify-between">
                    mp-ID
                </div>
                <TextField variant="outlined" size="small" fullWidth onChange={handlempID}/>
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