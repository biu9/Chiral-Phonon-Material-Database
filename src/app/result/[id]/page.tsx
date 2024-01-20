'use client'
import SideBar from "@/components/SideBar"
import { useRouter } from "next/navigation"
import Switch from '@mui/material/Switch'
import BandStructure from "@/components/BandStructure"
import { bandType,SearchResult } from "@/types"
import { useSearchParams } from "next/navigation"
import { Crystallographic } from "@/components/Crystallpgraphic"
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
            <div className="flex justify-center space-x-6 lg:text-lg text-sm">
                <div>
                    <div>compound name</div>
                    <div className="font-bold">
                        {
                           params.compound_name
                        }
                    </div>
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
        <div className="flex flex-col space-y-6 lg:px-20">
            <div className="flex lg:justify-between justify-between lg:text-3xl text-xl">
                <div>Materials Data</div>
                <div>mp-ID: {params['mp-ID']}</div>
            </div>
            <div className="flex-col space-y-10 hidden lg:flex">
                <div className="flex justify-between">
                    <Crystallographic />
                    <LatticeStructure width={600} height={400} />
                </div>
                <div className="flex justify-between">
                    <BandStructure width={600} height={400} bandType={bandType.pam}/>
                    <DensityStates width={600} height={400} />
                </div>
            </div>
            <div className="lg:hidden flex flex-col space-y-6">
                <Crystallographic />
                <LatticeStructure width={400} height={400} />
                <BandStructure width={300} height={400} bandType={bandType.pam}/>
                <DensityStates width={400} height={400} />
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