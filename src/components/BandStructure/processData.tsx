'use client'
import { Group } from "react-konva";
import { Point,bandType } from "@/types";
import internal from "stream";
import {line} from "./utils";

class band {
    lines:line[];
    constructor(points:Point[]) {
        this.lines = [];
        for (let i = 1; i < points.length; i++) {
            const x1 = points[i-1][0];
            const y1 = points[i-1][1];
            const x2 = points[i][0];
            const y2 = points[i][1];
            const width = points[i][2];
            this.lines.push(new line(x1, y1, x2, y2, width, points[i][3]));
        }
    }
    render() {
        // FIXME
        // random a key
        let key = Math.random().toString();
        return (
                <Group key={"Group of " + key}>
                    {
                        this.lines.map((line) => {
                            return line.render();
                        })
                    }
                </Group>
        );
    }
}

export function processData(data:string,bandType:bandType,width:number,height:number, percentage:number): [band[], number[]] {
    const lines = data.split('\n');
    lines.shift();
    let lineGroups:Point[][] = [];
    let points:Point[] = [];
    let xs:number[] = [0];
    let cnt = 0;
    for(let i=0;i<lines.length;i++) {
        let line = lines[i].split(/\s+/);
        line = line.filter((item) => item !== '');
        if(line.length < 2)
        {
            cnt = 0;
            continue;
        }
        ++cnt;
        const { x,y } = { x: parseFloat(line[0]), y: parseFloat(line[1]) };
        let chirality = parseFloat(line[bandType]);
        if (cnt % 40 === 0) {
            xs.push(x);
        }
        let color = 'black';
        if(chirality > 1e-5) {
            color = 'red';
        } else if(chirality < -1e-5) {
            color = 'blue';
        } else {
            chirality = 0.2;
        }
        points.push([x, y, Math.min(Math.max(chirality * 5, 0.5), 2), color]);
    }

    const xSlice = points.map(point => point[0]);
    const ySlice = points.map(point => point[1]);

    const xMax = Math.max(...xSlice);
    const xMin = Math.min(...xSlice);
    const yMax = Math.max(...ySlice);
    const yMin = Math.min(...ySlice);

    let xScale = width/(xMax-xMin);
    let yScale = height/(yMax-yMin);
    let xn = xMax * xScale;
    yScale *= percentage;
    let y0 = yMax * yScale;
    xScale *= percentage;

    points = points.map(point =>  [ (point[0] - xMax) * xScale + xn, -point[1] * yScale + y0, point[2], point[3]]);
    xs = xs.map(x => (x - xMax) * xScale + xn);

    let group:Point[] = [];
    let k = 0;
    for(let i=0;i<lines.length;i++) {
        let line = lines[i].split(/\s+/);
        line = line.filter((item) => item !== '');
        if(line.length < 2) {
            lineGroups.push(group);
            group = [];
        } else {
            group.push(points[k]);
            k++;
        }
    }
    if(group.length > 0)
        lineGroups.push(group);

        
    lineGroups = lineGroups.filter((group) => group.length > 0);
    const bands = lineGroups.map((group) => new band(group));

    return [bands, xs]
}
// function test(data:string,bandType:bandType,width:number,height:number, percentage:number) {
//     let [bands, signals] = processData(data,bandType,width,height, 0.9);
// }