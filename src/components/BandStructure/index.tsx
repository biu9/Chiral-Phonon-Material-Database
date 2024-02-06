"use client";
import React, { useState, useEffect, memo } from "react";
import { processData } from "./processData";
import { processAxis } from "./processAxis";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import { BandStructureProps, SearchResult, materialResponse } from "@/types";
import { band } from "./processData";
import { GET } from "@/request";
import { useSearchParams } from "next/navigation";
import { useSOC } from "../MaterialPropsContext";

const BandsRenderer = memo<{ data: band[] }>((props) => {
  return (
    <>
      {props.data.map((band: any) => {
        return band.render();
      })}
    </>
  );
});
BandsRenderer.displayName = "BandsRenderer";

export default function BandStructure({
  width,
  height,
  bandType,
  symmetry
}: BandStructureProps) {
  const [processedData, setProcessedData] = useState<band[]>([]);
  const [xs, setXs] = useState<number[]>([]);
  const [axis, setAxis] = useState<any>();
  const [layerScale, setLayerScale] = useState<number>(1);
  const [layerX, setLayerX] = useState<number>(0);
  const [layerY, setLayerY] = useState<number>(0);
  const SOC = useSOC();

  const params = JSON.parse(
    useSearchParams().getAll("data")[0]
  ) as SearchResult;

  useEffect(() => {
    (async () => {
      const res = await GET<materialResponse>(
        `material/band?id=${params.uuid}&SOC=${SOC}`
      );
      const [band, xs] = processData(
        res.data.String,
        bandType,
        width,
        height,
        0.9
      );
      setProcessedData(band);
      setXs(xs);
    })();
  }, [bandType, width, height, params.uuid, SOC]);

  useEffect(() => {
    setAxis(processAxis(xs, hsym[symmetry], width, height));
  }, [xs, width, height, symmetry]);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    if (stage === null) {
      return;
    }
    const layer = stage.children[0];

    const oldScale = layer.scaleX();

    const pointPosition = {
      x: stage.getPointerPosition()?.x || 0,
      y: stage.getPointerPosition()?.y || 0,
    };

    const mousePointTo = {
      x: pointPosition.x / oldScale - layer.x() / oldScale,
      y: pointPosition.y / oldScale - layer.y() / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const newX = -(mousePointTo.x - pointPosition.x / newScale) * newScale;
    const newY = -(mousePointTo.y - pointPosition.y / newScale) * newScale;
    axis?.updateXs(newX, newY, newScale, newScale);
    setLayerScale(newScale);
    setLayerX(newX);
    setLayerY(newY);
  };

  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    axis?.updateXs(newX, newY, layerScale, layerScale);
    setLayerX(newX);
    setLayerY(newY);
  };

  return (
    <div className="">
      <div className="text-xl">Band Structure</div>
      <Stage width={width} height={height} onWheel={handleWheel}>
        <Layer
          draggable
          onDragStart={handleDrag}
          onDragMove={handleDrag}
          onDragEnd={handleDrag}
          x={layerX}
          y={layerY}
          scaleX={layerScale}
          scaleY={layerScale}
        >
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
          <Rect
            x={0}
            y={0}
            width={width * 0.1}
            height={height}
            fill={"white"}
          />
        </Layer>
        <Layer>{axis?.render()}</Layer>
      </Stage>
    </div>
  );
}

const hsym = JSON.parse('{"1": ["X", "Gamma", "Y|L", "Gamma", "Z|N", "Gamma", "M|R", "Gamma"], "2": ["X", "Gamma", "Y|L", "Gamma", "Z|N", "Gamma", "M|R", "Gamma"], "3": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "4": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "5": ["V", "Y", "Gamma", "Y_1", "M_1", "A", "M", "L|Gamma", "A"], "6": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "7": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "8": ["V", "Y", "Gamma", "Y_1", "M_1", "A", "M", "L|Gamma", "A"], "9": ["V", "Y", "Gamma", "Y_1", "M_1", "A", "M", "L|Gamma", "A"], "10": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "11": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "12": ["V", "Y", "Gamma", "Y_1", "M_1", "A", "M", "L|Gamma", "A"], "13": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "14": ["E", "A", "Gamma", "B", "D", "C", "Z", "Gamma", "Y", "C", "E"], "15": ["V", "Y", "Gamma", "Y_1", "M_1", "A", "M", "L|Gamma", "A"], "16": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "17": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "18": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "19": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "20": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "21": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "22": ["Gamma", "Y", "T", "Z", "Gamma", "X", "A_1", "Y|T", "X_1|X", "A", "Z|L", "Gamma"], "23": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "24": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "25": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "26": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "27": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "28": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "29": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "30": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "31": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "32": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "33": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "34": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "35": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "36": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "37": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "38": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "39": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "40": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "41": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "42": ["Gamma", "Y", "T", "Z", "Gamma", "X", "A_1", "Y|T", "X_1|X", "A", "Z|L", "Gamma"], "43": ["Gamma", "Y", "T", "Z", "Gamma", "X", "A_1", "Y|T", "X_1|X", "A", "Z|L", "Gamma"], "44": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "45": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "46": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "47": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "48": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "49": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "50": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "51": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "52": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "53": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "54": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "55": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "56": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "57": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "58": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "59": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "60": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "61": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "62": ["Gamma", "X", "S", "Y", "Gamma", "Z", "U", "R", "T", "Z|Y", "T|U", "X|S", "R"], "63": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "64": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "65": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "66": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "67": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "68": ["Gamma", "X", "S", "R", "A", "Z", "Gamma", "Y", "X_1", "A_1", "T", "Y|Z", "T"], "69": ["Gamma", "Y", "T", "Z", "Gamma", "X", "A_1", "Y|T", "X_1|X", "A", "Z|L", "Gamma"], "70": ["Gamma", "Y", "T", "Z", "Gamma", "X", "A_1", "Y|T", "X_1|X", "A", "Z|L", "Gamma"], "71": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "72": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "73": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "74": ["W", "T", "Gamma", "X_1|X_2", "Gamma", "S", "W", "R", "Gamma", "X_3"], "75": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "76": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "77": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "78": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "79": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "80": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "81": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "82": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "83": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "84": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "85": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "86": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "87": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "88": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "89": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "90": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "91": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "92": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "93": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "94": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "95": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "96": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "97": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "98": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "99": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "100": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "101": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "102": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "103": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "104": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "105": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "106": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "107": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "108": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "109": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "110": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "111": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "112": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "113": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "114": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "115": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "116": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "117": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "118": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "119": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "120": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "121": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "122": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "123": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "124": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "125": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "126": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "127": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "128": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "129": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "130": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "131": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "132": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "133": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "134": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "135": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "136": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "137": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "138": ["Gamma", "X", "M", "Gamma", "Z", "R", "A", "Z|X", "R|M", "A"], "139": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "140": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "141": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "142": ["P", "N", "Gamma", "M_1|M_2", "Gamma", "X", "P|M", "X_1"], "143": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "144": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "145": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "146": ["F_1", "Gamma", "L", "T_1|T", "Gamma", "F_2"], "147": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "148": ["F_1", "Gamma", "L", "T_1|T", "Gamma", "F_2"], "149": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "150": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "151": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "152": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "153": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "154": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "155": ["F_1", "Gamma", "L", "T_1|T", "Gamma", "F_2"], "156": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "157": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "158": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "159": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "160": ["F_1", "Gamma", "L", "T_1|T", "Gamma", "F_2"], "161": ["F_1", "Gamma", "L", "T_1|T", "Gamma", "F_2"], "162": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "163": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "164": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "165": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "166": ["F_1", "Gamma", "L", "T_1|T", "Gamma", "F_2"], "167": ["F_1", "Gamma", "L", "T_1|T", "Gamma", "F_2"], "168": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "169": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "170": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "171": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "172": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "173": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "174": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "175": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "176": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "177": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "178": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "179": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "180": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "181": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "182": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "183": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "184": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "185": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "186": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "187": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "188": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "189": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "190": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "191": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "192": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "193": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "194": ["Gamma", "M", "K", "Gamma", "A", "L", "H", "A|L", "M|K", "H"], "195": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "196": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "197": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "198": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "199": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "200": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "201": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "202": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "203": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "204": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "205": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "206": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "207": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "208": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "209": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "210": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "211": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "212": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "213": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "214": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "215": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "216": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "217": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "218": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "219": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "220": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "221": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "222": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "223": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "224": ["Gamma", "X", "M", "Gamma", "R", "X|M", "R"], "225": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "226": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "227": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "228": ["X", "W", "L", "Gamma", "X|X_1", "K", "U", "Gamma"], "229": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"], "230": ["Gamma", "H", "N", "Gamma", "P", "H|P", "N"]}');