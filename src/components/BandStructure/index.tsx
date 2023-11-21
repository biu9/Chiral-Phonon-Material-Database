'use client'
import {useState, useEffect, memo} from "react"
import { processData } from "./processData";
import { processAxis } from "./processAxis";
import {Stage, Layer, Rect} from "react-konva";
import Konva from 'konva';
import { BandStructureProps } from "@/types";

// @ts-ignore
// eslint-disable-next-line react/display-name
const BandsRenderer = memo(({ data }) => {
    return (
        <>
            {
                data.map((band:any) => {
                    return band.render();
                })
            }
        </>
    );
});

export default function BandStructure({ width, height, bandType }: BandStructureProps) {
    
    const [processedData,setProcessedData] = useState<any>([]);
    const [xs, setXs] = useState<number[]>([]);
    const [axis,setAxis] = useState<any>();
    const [layerScale,setLayerScale] = useState<number>(1);
    const [layerX,setLayerX] = useState<number>(0);
    const [layerY,setLayerY] = useState<number>(0);

    useEffect(() => {
        fetch('/mock/data.txt')
            .then(res => res.text())
            .then(res => {
                const [band, xs] = processData(res,bandType,width,height, 0.9);
                setProcessedData(band);
                setXs(xs);
            })
    },[bandType,width,height]);

    useEffect(() => {
        fetch('/mock/signals.txt')
            .then(res => res.text())
            .then(res => {
                setAxis(processAxis(xs, JSON.parse(res), width, height));
            })
    }, [xs, width, height]);


    const handleWheel = (e:Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        if(stage === null) {
            return;
        }
        const layer = stage.children[0];

        const oldScale = layer.scaleX();

        const pointPosition = {
            x: stage.getPointerPosition()?.x || 0,
            y: stage.getPointerPosition()?.y || 0
        };

        const mousePointTo = {
            x: pointPosition.x / oldScale - layer.x() / oldScale,
            y: pointPosition.y / oldScale - layer.y() / oldScale,
        };
        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const newX = -(mousePointTo.x - pointPosition.x / newScale) * newScale;
        const newY = -(mousePointTo.y - pointPosition.y / newScale) * newScale;
        setLayerScale(newScale);
        setLayerX(newX);
        setLayerY(newY);
        if (axis === undefined) {
            return;
        }
        axis.updateXs(newX, newY, newScale, newScale)
    }

    const handleDrag = (e:Konva.KonvaEventObject<DragEvent>) => {
        const newX = e.target.x();
        const newY = e.target.y();
        axis.updateXs(newX, newY, layerScale, layerScale);
        setLayerX(newX);
    }


    return (
        <div>
            <div className="text-xl">Band Structure</div>
            <div>
                <Stage
                    width={width}
                    height={height}
                    onWheel={handleWheel}
                >
                    <Layer
                        draggable
                        onDragMove={handleDrag}
                        onDragEnd={handleDrag}
                        x={layerX}
                        y={layerY}
                        scaleX={layerScale}
                        scaleY={layerScale}>
                        {/*@ts-ignore*/}
                        <BandsRenderer data={processedData} />
                        <Rect
                            x={0}
                            y={0}
                            width={width}
                            height={height}
                            fill={"transparent"}
                        />
                    </Layer>
                    <Layer>
                        <Rect
                            x={0}
                            y={height * 0.9}
                            width={width}
                            height={height * 0.1}
                            fill={"white"}
                        />
                    </Layer>
                    <Layer>
                        {
                            axis?.render()
                        }
                    </Layer>
                    <Layer>
                        <Rect
                            x={0}
                            y={0}
                            width={width * 0.1}
                            height={height}
                            fill={"white"}
                        />
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}
