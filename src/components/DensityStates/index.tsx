import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import processData from "@/components/DensityStates/processData";
import {DOSdata} from "@/types";
export default function DensityStates({ width, height} : { width:number, height:number }) {
    const [DOSData, setDOSData] = React.useState<DOSdata>();
    React.useEffect(() => {
        fetch('/mock/DOSPROJ.dat')
            .then(res => res.text())
            .then(res => {
                return setDOSData(processData(res));
            })
    }, []);
    return (
        <div>
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