'use client'
import { Group,Line,Text} from "react-konva";
import internal from "stream";

import {line} from "./utils";

class signal {
    x:number;
    y:number;
    text:string;
    constructor(x:number, y:number, text:string) {
        this.x = x;
        this.y = y;
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
    constructor(xs:number[], signals:string[], width:number, height:number) {
        this.lines = [];
        this.signals = [];
        this.xs_inner = xs;
        this.sigs = signals;
        this.width = width;
        this.height = height;
        if (xs.length === 0) {
            return;
        }
        this.process(xs);
    }

    process(xs:number[]) {
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
        // add x axis
        this.lines.push(new line(this.width * 0.1, this.height * 0.9, this.width, this.height * 0.9, 1.5, 'green'));
        // add y axis
        this.lines.push(new line(this.width * 0.1, 0, this.width * 0.1, this.height * 0.9, 1.5, 'green'));
    }

    updateXs(px:number, py:number, xScale:number, yScale:number) {
        let xs = this.xs_inner.map(x => (x * xScale + px));
        this.process(xs);
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