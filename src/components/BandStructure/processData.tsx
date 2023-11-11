'use client'
import { Group,Line } from "react-konva";
import { Point,bandType } from "@/types";

class line {
    x1:number;
    y1:number;
    x2:number;
    y2:number;
    color:string;
    constructor(x1:number, y1:number, x2:number, y2:number, color:string) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
    }
    render() {
        return (
            <Line
                points={[this.x1, this.y1, this.x2, this.y2]}
                stroke={this.color}
                strokeWidth={1}
                key={this.x1.toString() + this.y1.toString() + this.x2.toString() + this.y2.toString()}
            />
        );
    }
}

export class band {
    lines:line[];
    constructor(points:Point[]) {
        this.lines = [];
        for (let i = 1; i < points.length; i++) {
            let x1 = points[i-1][0];
            let y1 = points[i-1][1];
            let x2 = points[i][0];
            let y2 = points[i][1];
            this.lines.push(new line(x1, y1, x2, y2, points[i][2]));
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

export function processData(data:string,bandType:bandType,width:number,height:number) {
    const lines = data.split('\n');
    lines.shift();
    let lineGroups:Point[][] = [];
    let points:Point[] = [];

    for(let i=0;i<lines.length;i++) {
        let line = lines[i].split(/\s+/);
        line = line.filter((item) => item !== '');
        if(line.length < 2)
            continue;
        
        const { x,y } = { x: parseFloat(line[0]), y: parseFloat(line[1]) };
        const colotDepending = parseFloat(line[bandType]);

        if(colotDepending > 1e-5) {
            points.push([x,y,'red']);
        } else if(colotDepending < -1e-5) {
            points.push([x,y,'blue']);
        } else {
            points.push([x,y,'black']);
        }
    }

    const xSlice = points.map(point => point[0]);
    const ySlice = points.map(point => point[1]);

    const xMax = Math.max(...xSlice);
    const xMin = Math.min(...xSlice);
    const yMax = Math.max(...ySlice);
    const yMin = Math.min(...ySlice);

    const xScale = width/(xMax-xMin);
    const yScale = height/(yMax-yMin);
    const x0 = -xMin*xScale;
    const y0 = yMax*yScale;

    points = points.map(point =>  [point[0] * xScale + x0, - point[1] * yScale + y0, point[2]]);
    
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

    return bands;
}