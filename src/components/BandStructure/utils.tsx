import {Line} from "react-konva";

export class line {
    x1:number;
    y1:number;
    x2:number;
    y2:number;
    width:number;
    color:string;
    constructor(x1:number, y1:number, x2:number, y2:number, width:number, color:string) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.width = width;
        this.color = color;
    }
    render() {
        return (
            <Line
                points={[this.x1, this.y1, this.x2, this.y2]}
                stroke={this.color}
                strokeWidth={this.width}
                lineCap={"round"}
                key={this.x1.toString() + this.y1.toString() + this.x2.toString() + this.y2.toString()}
            />
        );
    }
}