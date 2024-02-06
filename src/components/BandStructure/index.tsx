"use client";
import React, { useState, useEffect, memo } from "react";
import { processData } from "./processData";
import { processAxis } from "./processAxis";
import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import {
  BandStructureProps,
  SearchResult,
  bandType,
  materialResponse,
} from "@/types";
import { band } from "./processData";
import { GET } from "@/request";
import { useSearchParams } from "next/navigation";
import { useSOC } from "../MaterialPropsContext";
import { Button, Menu, MenuItem } from "@mui/material";

interface BandMenuProps {
  onSelect: (band: bandType) => void;
  currBandType: bandType;
}

const BandMenu: React.FC<BandMenuProps> = ({ onSelect,currBandType }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (band: bandType) => {
    onSelect(band);
    handleClose();
  };

  const bandTypeMap = {
    2: "PAM",
    3: "SXY",
    4: "SYZ",
    5: "SZX",
  }

  return (
    <div>
      <Button
        id="band-menu-button"
        aria-controls="band-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {bandTypeMap[currBandType]}
      </Button>
      <Menu
        id="band-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick(bandType.pam)}>
          PAM
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(bandType.sxy)}>
          SXY
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(bandType.syz)}>
          SYZ
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(bandType.szx)}>
          SZX
        </MenuItem>
      </Menu>
    </div>
  );
};

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
}: BandStructureProps) {
  const [processedData, setProcessedData] = useState<band[]>([]);
  const [xs, setXs] = useState<number[]>([]);
  const [axis, setAxis] = useState<any>();
  const [layerScale, setLayerScale] = useState<number>(1);
  const [layerX, setLayerX] = useState<number>(0);
  const [layerY, setLayerY] = useState<number>(0);
  const [currBandType, setCurrBandType] = useState<bandType>(bandType);
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
        currBandType,
        width,
        height,
        0.9
      );
      setProcessedData(band);
      setXs(xs);
    })();
  }, [currBandType, width, height, params.uuid, SOC]);

  useEffect(() => {
    fetch("/mock/signals.txt")
      .then((res) => res.text())
      .then((res) => {
        setAxis(processAxis(xs, JSON.parse(res), width, height));
      });
  }, [xs, width, height]);

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
      <div className="flex space-x-3 items-center mb-6">
        <div className="text-xl">Band Structure</div>
        <BandMenu onSelect={setCurrBandType} currBandType={currBandType}/>
      </div>
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
