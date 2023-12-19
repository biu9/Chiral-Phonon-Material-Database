'use client'
import { Group,Line,Text} from "react-konva";
import {BandAxis} from "@/types";

function signal(x:number, y:number, text:string) {
    return (
        <Text
            text={text}
            x={x}
            y={y}
            fontSize={10}
            fontFamily={"Calibri"}
            fill={"black"}
            align={"center"}
            offsetX={text.length * 5}
        />
    );
}

function xAxis(width:number, height:number) {
    return (
        <Line
            points={[width * 0.1, height * 0.9, width, height * 0.9]}
            stroke={"green"}
            strokeWidth={1.5}
        />
    );
}

function yAxis(width:number, height:number) {
    return (
        <Line
            points={[width * 0.1, 0, width * 0.1, height * 0.9]}
            stroke={"green"}
            strokeWidth={1.5}
        />
    );
}

function xSignals(xs:number[], signals: string[], width:number, height:number) {
    let res = [];
    for(let i=0;i<signals.length;i++) {
        const x = xs[i];
        res.push(signal(x, height * (0.95 + 0.02 * Math.pow(-1, i)), signals[i]));
    }
    return (
        <Group key={"Group-of-x-signals"}>
            {
                res
            }
        </Group>
    );
}

function ySignals(width:number, height:number, yMin:number, yMax:number) {
    const yScale = height / (yMax - yMin);
    const yStep = (yMax - yMin) / 10;
    let res = [];
    for(let i=0;i<10;i++) {
        const y = height * 0.9 - yScale * yStep * i;
        res.push(signal(width * 0.1 - 10, y, (yMin + yStep * i).toFixed(2)));
    }
    return (
        <Group key={"Group-of-y-signals"}>
            {
                res
            }
        </Group>
    );
}

function signals(width:number, height:number, xs:number[], signals:string[], yMin:number, yMax:number) {
    return (
        <Group key={"Group-of-signals"}>
            {
                xSignals(xs, signals, width, height)
            }
            {
                ySignals(width, height, yMin, yMax)
            }
        </Group>
    );
}

function grayLines(width:number, height:number, xs:number[]) {
    let res = [];
    for(let i=0;i<xs.length;i++) {
        const x = xs[i];
        res.push(
            <Line
                points={[x, 0, x, height * 0.9]}
                stroke={"gray"}
                strokeWidth={0.2}
                key={"gray-line-" + i.toString()}
            />
        );
    }
    console.log(res);
    return (
        <Group key={"Group-of-gray-lines"}>
            {
                res
            }
        </Group>
    );
}

export function AxisWithSignals(axis: BandAxis) {
    const realX = (axis.xData?.map(x => x * axis.xScale + axis.px).filter((x, index, self) => self.indexOf(x) === index) || []);
    //  filter same one
    const yMin = (axis.yMin||1) * axis.yScale + axis.py;
    const yMax = (axis.yMax||1) * axis.yScale + axis.py;
    return (
        <Group key={"Group-of-axis-with-signals"}>
            {
                xAxis(axis.width, axis.height)
            }
            {
                yAxis(axis.width, axis.height)
            }
            {
                signals(axis.width, axis.height, realX, axis.signals, yMin, yMax)
            }
        </Group>
    );
}

export function GrayLines(axis: BandAxis) {
    const realX = (axis.xData?.map(x => x * axis.xScale + axis.px).filter((x, index, self) => self.indexOf(x) === index) || []);
    return (
        <Group key={"Group-of-gray-line"}>
            {
                grayLines(axis.width, axis.height, realX)
            }
        </Group>
    );
}