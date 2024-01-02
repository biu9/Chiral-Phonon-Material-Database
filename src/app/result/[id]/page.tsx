'use client'
import SideBar from "@/components/SideBar"
import { useRouter } from "next/navigation"
import Switch from '@mui/material/Switch'
import BandStructure from "@/components/BandStructure"
import { bandType } from "@/types"
import { SearchResult } from "@/types"
import { useSearchParams } from "next/navigation"
import Crystallographic from "@/components/Crystallographic"
import LatticeStructure from "@/components/LatticeStructure/index.jsx"
import BrillouinZone from "@/components/BrillouinZone"
import DensityStates from "@/components/DensityStates"

import { MaterialProvider } from "@/components/MaterialPropsContext"
import { useSOCDispatch,useSOC } from "@/components/MaterialPropsContext"

const TopBar = () => {

    const router = useRouter();
    const params = JSON.parse(useSearchParams().getAll('data')[0]) as SearchResult;
    const setSOC = useSOCDispatch();
    const SOC = useSOC();

    const handleBack = () => {
        router.back();
    }

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-between">
                <div className="text-blue-600 hover:opacity-80 cursor-pointer" onClick={handleBack}>{'<'}back link</div>
                <div className="flex items-center">
                    <Switch
                        checked={SOC === 1}
                        onChange={(e) => setSOC(SOC === 1 ? 0 : 1)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
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
        <div className="flex flex-col space-y-6 px-20">
            <div className="flex justify-between text-3xl">
                <div>Materials Data</div>
                <div>mp-ID: {params['mp-ID']}</div>
            </div>
            <div className="flex flex-col space-y-10">
                <div className="flex justify-between">
                    <Crystallographic />
                    <LatticeStructure width={800} height={800} />
                    <BrillouinZone />
                </div>
                <div className="flex justify-between">
                    <BandStructure width={800} height={800} bandType={bandType.pam}/>
                    <DensityStates width={800} height={800} />
                </div>
            </div>
        </div>
    )
}

export default function Result() {

    return (
        <MaterialProvider>
            <div className="flex">
                <SideBar />
                <div className="flex w-full flex-col p-6">
                    <TopBar />
                    <Container />
                </div>
            </div>
        </MaterialProvider>
    )
}