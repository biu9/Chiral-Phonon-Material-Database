import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import processData from "@/components/DensityStates/processData";
import {DOSdata} from "@/types";
import { useSearchParams } from "next/navigation"
import { SearchResult,materialResponse } from "@/types"
import { GET } from '@/request';
import { useSOC } from '../MaterialPropsContext';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/material';

export default function DensityStates({ width, height} : { width:number, height:number }) {

    const params = JSON.parse(useSearchParams().getAll('data')[0]) as SearchResult;
    const SOC = useSOC();

    const [DOSData, setDOSData] = React.useState<DOSdata>();

    const [elements, setElements] = React.useState<string[]>([]);

    React.useEffect(() => {
        (async() => {
            const res = await GET<materialResponse>(`material/nacdos?id=${params.uuid}&SOC=${SOC}`)
            const Dos = processData(res.data.String);
            setDOSData(Dos);
            setElements(Dos.yData.map((data) => data.label));

        })()
    }, [params.uuid, SOC]);

    const handleChange = (event: SelectChangeEvent<typeof elements>) => {
        const {
            target: { value },
        } = event;
        setElements(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    return (
        <div>
            <div className="flex space-x-3 items-center mb-6">
                <div className="text-xl">Density states</div>
                <div>
                    <FormControl sx={{m: 1, width: 300}}>
                        <InputLabel id="density-states-label">Selector</InputLabel>
                        <Select
                            labelId="density-states-label"
                            id="density-states-selector"
                            multiple
                            value={elements}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
                            renderValue={(selected) => (
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value}/>
                                    ))}
                                </Box>
                            )}
                        >
                            {DOSData?.yData?.map((data) => (
                                <MenuItem
                                    key={data.label}
                                    value={data.label}
                                >
                                    {data.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <LineChart
                width={width}
                height={height}
                series={
                    DOSData?.yData?.filter((data) => {
                        if (elements.includes(data.label)) {
                            return true
                        }
                    }) || []
                }
                xAxis={
                    [{
                        data: DOSData?.xData,
                    }]
                }
            />
        </div>
    );
}