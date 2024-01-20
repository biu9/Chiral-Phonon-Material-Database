'use client'

import {useEffect, useRef} from "react";
import { ChemDoodle } from './ChemDoodleWeb.js'
import { useSearchParams } from "next/navigation"
import { useSOC } from "../MaterialPropsContext";

const SERVER = process.env.NEXT_PUBLIC_SERVER;

export default function LatticeStructure({width, height}) {
  let ref = useRef();

  const params = JSON.parse(useSearchParams().getAll('data')[0])
  const SOC = useSOC()

  useEffect(() => {
      (async() => {
        const res = await fetch(SERVER+`material/cif?id=${params.uuid}&SOC=${SOC}`)
        const data = await res.json()

        let canvas = ref.current;
        let canvas_id = canvas.id;
        let transformBallAndStick = new ChemDoodle.TransformCanvas3D(canvas_id, width, height);
        transformBallAndStick.styles.set3DRepresentation('Ball and Stick');
        transformBallAndStick.styles.backgroundColor = 'white';
        let molecule = ChemDoodle.readCIF(data.String,1 ,1,1);
        //transformBallAndStick.loadMolecule(molecule.molecule);无边框模式
        transformBallAndStick.loadContent([molecule.molecule],[molecule.unitCell])
        transformBallAndStick.repaint();
      })()
  },[SOC, height, params.uuid, width])
  return (
    <div className="flex flex-col">
        <div>Latitude Strucrute</div>
        <div className="border-grat-200 border-2">
            <canvas
              ref={ref}
              id={"transformBallAndStick"+width} // id相同时会导致多次调用只有第一处调用处显示
              style={{width: width, height: height}}
            />
        </div>
    </div>
  );
}