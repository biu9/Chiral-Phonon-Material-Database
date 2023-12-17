'use client'
import {DOSdata} from "@/types";

export default function processData(dos: string):DOSdata {
    let lines = dos.split('\n');
    lines.shift();
    lines = lines.filter((line) => line !== '');
    const firstLine = lines[0].split(/\s+/);
    const yLabels = firstLine.filter((item) => item !== '' && item !== '#')
    let dosData:DOSdata = {
        xData: [],
        yData: yLabels.map((label) => {
            return {
                label,
                data: [],
                showMark: false,
            }
        }),
    }
    for(let i=1;i<lines.length;i++) {
        const line = lines[i].split(/\s+/).filter((item) => item !== '');
        const x = parseFloat(line[0]);
        dosData.xData.push(x);
        for(let j=0;j<yLabels.length;j++) {
            const y = parseFloat(line[j+1]);
            dosData.yData[j].data.push(y);
        }
    }
    return dosData;
}