'use client'
import React, {useState, useEffect, memo, useRef} from "react"
import { processData } from "./processData";
import { GrayLines, AxisWithSignals } from "./processAxis";
import {Stage, Layer, Rect} from "react-konva";
import Konva from 'konva';
import {BandStructureProps, bandType, BindData} from "@/types";
import { band } from "./processData";
import { GET } from "@/request";

const BandsRenderer = memo<{data?:band[]}>(props => {
    return (
        <>
            {
                props.data?.map((band:any) => {
                    return band.render();
                })
            }
        </>
    );
});
BandsRenderer.displayName = 'BandsRenderer';

export default function BandStructure({width, height, bandType}: BandStructureProps) {
    const [processedData,setProcessedData] = useState<BindData>();
    const [signals,setSignals] = useState<string[]>([]);
    const stageRef = React.useRef<Konva.Stage>(null);
    const [layerScale,setLayerScale] = useState<number>(1);
    const [layerX,setLayerX] = useState<number>(0);
    const [layerY,setLayerY] = useState<number>(0);
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
        if(newScale < 0.9) {
            return;
        }
        const newX = -(mousePointTo.x - pointPosition.x / newScale) * newScale;
        const newY = -(mousePointTo.y - pointPosition.y / newScale) * newScale;
        setLayerScale(newScale);
        setLayerX(newX);
        setLayerY(newY);
    }

    const handleDrag = (e:Konva.KonvaEventObject<DragEvent>) => {
        const newX = e.target.x();
        const newY = e.target.y();
        setLayerX(newX);
        setLayerY(newY);
    }

    // useEffect(() => {
    //     const stage = stageRef.current;
    //     if(stage === null) {
    //         return;
    //     }
    //     stage.setAbsolutePosition({
    //         x: left,
    //         y: top
    //     })
    // }, [left, top]);

    useEffect(() => {
        (async() => {
            const res = await GET<string>('/mock/data.txt',true);
            const bandData = processData(res,bandType,width,height, 0.9);
            setProcessedData(bandData);
        })()
    },[bandType,width,height]);

    useEffect(() => {
        fetch('/mock/signals.txt')
            .then(res => res.text())
            .then(res => {
                setSignals(JSON.parse(res));
                // setAxis(processAxis(xs, JSON.parse(res), width, height));
            })
    }, []);

    return (
        <div>
            <div className="text-xl">Band Structure</div>
            <div>

                <Stage
                    width={width}
                    height={height}
                    onWheel={handleWheel}
                    ref={stageRef}
                >
                    <Layer
                        draggable
                        onDragStart={handleDrag}
                        onDragMove={handleDrag}
                        onDragEnd={handleDrag}
                        x={layerX}
                        y={layerY}
                        scaleX={layerScale}
                        scaleY={layerScale}>
                        <BandsRenderer data={processedData?.data} />
                        <Rect
                            x={0}
                            y={0}
                            width={width}
                            height={height}
                            fill={"transparent"}
                        />
                    </Layer>
                    <Layer>
                        <GrayLines {...processedData} signals={signals} width={width} height={height} xScale={layerScale} yScale={layerScale} px={layerX} py={layerY} />
                    </Layer>
                    <Layer>
                        <Rect
                            x={0}
                            y={0}
                            width={width*0.1}
                            height={height}
                            fill={"white"}
                        />
                        <Rect
                            x={0}
                            y={height*0.9}
                            width={width}
                            height={height*0.1}
                            fill={"white"}
                        />
                    </Layer>
                    <Layer>
                        <AxisWithSignals {...processedData} signals={signals} width={width} height={height} xScale={layerScale} yScale={layerScale} px={layerX} py={layerY} />
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}
