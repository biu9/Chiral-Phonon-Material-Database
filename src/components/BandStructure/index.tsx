'use client'
import { useState,useEffect } from "react"
import { processData } from "./processData";
import { Stage,Layer } from "react-konva";
import Konva from 'konva';
import { BandStructureProps } from "@/types";
import { band } from "./processData";
import { GET } from "@/request";

export default function BandStructure({ width, height, bandType }: BandStructureProps) {
    
    const [processedData,setProcessedData] = useState<band[]>([]);
    const [stageScale,setStageScale] = useState<number>(1);
    const [stageX,setStageX] = useState<number>(0);
    const [stageY,setStageY] = useState<number>(0);

    useEffect(() => {
       (async() => {
        const res = await GET<string>('/mock/data.txt',true);
        setProcessedData(processData(res,bandType,width,height));
       })()
    },[bandType,width,height]);

    const handleWheel = (e:Konva.KonvaEventObject<WheelEvent>) => {
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        if(stage === null) 
            return;

        const oldScale = stage.scaleX();

        const pointPosition = {
            x: stage.getPointerPosition()?.x || 0,
            y: stage.getPointerPosition()?.y || 0
        };

        const mousePointTo = {
            x: pointPosition.x / oldScale - stage.x() / oldScale,
            y: pointPosition.y / oldScale - stage.y() / oldScale,
        };
        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        setStageScale(newScale);
        setStageX(-(mousePointTo.x - pointPosition.x / newScale) * newScale);
        setStageY(-(mousePointTo.y - pointPosition.y / newScale) * newScale);
    }

    return (
        <div>
            <div className="text-xl">Band Structure</div>
            <div>
                <Stage
                    width={width}
                    height={height}
                    scaleX={stageScale}
                    scaleY={stageScale}
                    x={stageX}
                    y={stageY}
                    onWheel={handleWheel}
                >
                    <Layer>
                        {
                            processedData.map((band:band) => {
                                return band.render();
                            })
                        }
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}