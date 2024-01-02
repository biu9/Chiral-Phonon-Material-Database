import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import processData from "@/components/DensityStates/processData";
import {DOSdata} from "@/types";
import { useSearchParams } from "next/navigation"
import { SearchResult,materialResponse } from "@/types"
import { GET } from '@/request';

export default function DensityStates({ width, height} : { width:number, height:number }) {

    const params = JSON.parse(useSearchParams().getAll('data')[0]) as SearchResult;

    const [DOSData, setDOSData] = React.useState<DOSdata>();
    React.useEffect(() => {
        (async() => {
            const res = await GET<materialResponse>(`material/nacdos?id=${params.uuid}&SOC=0`)
            setDOSData(processData(res.data.String));
        })()
    }, [params.uuid]);
    return (
        <div>
            <div className="text-xl">Density states</div>
            <LineChart
                width={width}
                height={height}
                series={
                    DOSData?.yData || []
                }
                xAxis={
                    [{
                        data: DOSData?.xData
                    }]
                }
            />
        </div>
    )
}