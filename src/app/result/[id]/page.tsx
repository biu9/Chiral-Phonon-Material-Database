'use client'
import SideBar from "@/components/SideBar"
import { useRouter } from "next/navigation"
import Switch from '@mui/material/Switch'
import BandStructure from "@/components/BandStructure"
import { bandType } from "@/types"
import { SearchResult } from "@/types"
import { useSearchParams } from "next/navigation"

const TopBar = () => {

    const router = useRouter();

    const params = JSON.parse(useSearchParams().getAll('data')[0]) as SearchResult;

    const handleBack = () => {
        router.back();
    }

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-between">
                <div className="text-blue-600 hover:opacity-80 cursor-pointer" onClick={handleBack}>{'<'}back link</div>
                <div className="flex items-center">
                    <Switch />
                    with SOC
                </div>
            </div>
            <div className="flex justify-center space-x-6">
                <div>
                    <div>compound name</div>
                    <div className="font-bold">{
                        params.compound.map((item:{ name:string,number:number }) => {
                            return `${item.name}${item.number}`
                        }).join(' ')
                    }</div>
                </div>
                <div>
                    <div>Symmetry Group</div>
                    <div>{params.symmetry}</div>
                </div>
                <div>
                    <div>Topological Status (Type):</div>
                    <div>{params.type.chiral}</div>
                </div>
            </div>
        </div>
    )
}

const Container = () => {

    const params = JSON.parse(useSearchParams().getAll('data')[0]) as SearchResult;

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between text-3xl">
                <div>Materials Data</div>
                <div>mp-ID: {params['mp-ID']}</div>
            </div>
            <div>
                <BandStructure width={500} height={500} bandType={bandType.pam}/>
            </div>
        </div>
    )
}

export default function Result() {

    return (
        <div className="flex">
            <SideBar />
            <div className="flex w-full flex-col p-6">
                <TopBar />
                <Container />
            </div>
        </div>
    )
}