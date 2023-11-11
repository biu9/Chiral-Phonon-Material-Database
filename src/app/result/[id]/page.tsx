'use client'
import SideBar from "@/components/SideBar"
import { useRouter } from "next/navigation"
import Switch from '@mui/material/Switch'
import BandStructure from "@/components/BandStructure"
import { bandType } from "@/types"

const TopBar = () => {

    const router = useRouter();

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
                    <div className="font-bold">H2</div>
                </div>
                <div>
                    <div>Symmetry Group</div>
                    <div>194</div>
                </div>
                <div>
                    <div>Topological Status (Type):</div>
                    <div>trivial (LCEBR)</div>
                </div>
            </div>
        </div>
    )
}

const Container = () => {
    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between text-3xl">
                <div>Materials Data</div>
                <div>ICDS: 107510</div>
            </div>
            <div>
                <BandStructure width={500} height={500} bandType={bandType.pam}/>
            </div>
        </div>
    )
}

export default function Result({ params }:{ params: { id: string } }) {
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