'use client'
import {Group, Layer, Rect, Text} from "react-konva";

import {line} from "./utils";
import React from "react";

class signal {
    x:number;
    y:number;
    text:string;
    constructor(x:number, y:number, text:string) {
        this.x = x;
        this.y = y;
        if (text == "Gamma") {
            text = "Γ";
        }
        this.text = text;
    }
    render() {
        return (
            <Text
                text={this.text}
                x={this.x}
                y={this.y}
                fontSize={10}
                fontFamily={"Calibri"}
                fill={"black"}
                align={"center"}
                offsetX={this.text.length * 2.5}
            />
        );
    }
}

class axis {
    xs_inner:number[];
    sigs:string[];
    width:number;
    height:number;
    lines:line[];
    signals:signal[];
    yMin:number;
    yMax:number;
    constructor(xs:number[], signals:string[], width:number, height:number) {
        this.lines = [];
        this.signals = [];
        this.xs_inner = xs.slice(0, xs.length - 2);
        this.sigs = signals;
        this.width = width;
        this.height = height;
        this.yMin = 1;
        this.yMax = 2;
        if (xs.length === 0) {
            return;
        }
        this.yMin = xs[xs.length - 2];
        this.yMax = xs[xs.length - 1];
        this.process(xs.slice(0, xs.length - 2), this.yMin, this.yMax);
    }

    calculateYAxisInterval(yMin: number, yMax: number): number {
        // yMin *= 100000;
        // yMax *= 100000;
        const targetTickCount = 10;
        const possibleIntervals = [1, 2, 5];

        const range = yMax - yMin;
        const roughInterval = range / targetTickCount;

        const orderOfMagnitude = Math.floor(Math.log10(roughInterval));
        const magnitudeFactor = Math.pow(10, orderOfMagnitude);

        let bestInterval = possibleIntervals[0];
        let minDifference = Math.abs(roughInterval - bestInterval * magnitudeFactor);

        for (const interval of possibleIntervals) {
            const difference = Math.abs(roughInterval - interval * magnitudeFactor);
            if (difference < minDifference) {
                bestInterval = interval;
                minDifference = difference;
            }
        }

        return bestInterval * magnitudeFactor;
    }


    process(xs:number[], yMin:number, yMax:number) {
        this.lines = [];
        this.signals = [];
        if (xs.length === 0) {
            return;
        }
        for(let i=0;i<this.sigs.length;i++) {
            const x = xs[i];
            this.lines.push(new line(x, 0, x, this.height * 0.9, 0.2, 'gray'));
            this.signals.push(new signal(x, this.height * (0.95 + 0.02 * Math.pow(-1, i)), this.sigs[i]));
        }
        const yRange = yMax - yMin;
        const yAxisInterval = this.calculateYAxisInterval(yMin, yMax);
        const yMinRounded = Math.ceil(yMin / yAxisInterval) * yAxisInterval;
        const yMaxRounded = Math.floor(yMax / yAxisInterval) * yAxisInterval;
        const yIntervalCount = (yMaxRounded - yMinRounded) / yAxisInterval;
        for (let i = 0; i <= yIntervalCount; i++) {
            const y = yMinRounded + i * yAxisInterval;
            const yScaled = (yMax - y) / yRange * this.height * 0.9;
            this.lines.push(new line(this.width * 0.1, yScaled, this.width, yScaled, 0.2, 'gray'));
            this.signals.push(new signal(this.width * 0.05, yScaled, y.toFixed(2)));
        }
        // add x axis
        this.lines.push(new line(this.width * 0.1, this.height * 0.9, this.width, this.height * 0.9, 1.5, 'green'));
        // add y axis
        this.lines.push(new line(this.width * 0.1, 0, this.width * 0.1, this.height * 0.9, 1.5, 'green'));
    }

    updateXs(px:number, py:number, xScale:number, yScale:number) {
        let xs = this.xs_inner.map(x => (x * xScale + px));
        const tmp = this.height * 0.9 / (this.yMax - this.yMin);
        const yMax = this.yMax - ((0 - py) / yScale) / tmp;
        const yMin = this.yMax - (this.height * 0.9 - py) / yScale / tmp;
        this.process(xs, yMin, yMax);
    }

    render() {
        if (this.lines.length === 0) {
            return null;
        }
        return (
            <Group key={"Group of bsAxis"}>
                {
                    this.lines.map((line) => line.render())
                }
                <Rect
                    x={0}
                    y={this.height * 0.9}
                    width={this.width}
                    height={this.height * 0.1}
                    fill={"white"}
                />
                <Rect
                    x={0}
                    y={0}
                    width={this.width * 0.1}
                    height={this.height}
                    fill={"white"}
                />
                {
                    this.signals.map((signal) => signal.render())
                }
            </Group>
        );
    }
}

export function processAxis(xs:number[], signals:string[] ,width:number,height:number) {
    return new axis(xs, signals, width, height);
}