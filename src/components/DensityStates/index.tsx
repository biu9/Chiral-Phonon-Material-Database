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
            <div className="text-xl">Density statees</div>
            <LineChart
                width={width}
                height={height}
                //todo: switch x and y axis
                series={
                    DOSData?.yData || []
                }
                xAxis={
                    [{
                        //todo: make this two be changed with BandStructure:yMin,yMax
                        min: Math.min(...DOSData?.xData || []),
                        max: Math.max(...DOSData?.xData || []),
                        data: DOSData?.xData
                    }]
                }
            />
        </div>
    )
}