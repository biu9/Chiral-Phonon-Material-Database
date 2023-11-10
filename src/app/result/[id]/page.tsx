'use client'
import SideBar from "@/components/SideBar"
import { useRouter } from "next/navigation"
import Switch from '@mui/material/Switch'

const TopBar = () => {

    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    return (
        <div className="p-6 w-full flex flex-col">
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

export default function Result({ params }:{ params: { id: string } }) {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex w-full flex-col">
                <TopBar />
            </div>
        </div>
    )
}