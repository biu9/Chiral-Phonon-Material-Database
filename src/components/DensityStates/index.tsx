import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import processData from "@/components/DensityStates/processData";
import {DOSdata} from "@/types";
import { useSearchParams } from "next/navigation"
import { SearchResult,materialResponse } from "@/types"
import { GET } from '@/request';
import { useSOC } from '../MaterialPropsContext';

export default function DensityStates({ width, height} : { width:number, height:number }) {

    const params = JSON.parse(useSearchParams().getAll('data')[0]) as SearchResult;
    const SOC = useSOC();

    const [DOSData, setDOSData] = React.useState<DOSdata>();
    React.useEffect(() => {
        (async() => {
            const res = await GET<materialResponse>(`material/nacdos?id=${params.uuid}&SOC=${SOC}`)
            setDOSData(processData(res.data.String));
        })()
    }, [params.uuid, SOC]);
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