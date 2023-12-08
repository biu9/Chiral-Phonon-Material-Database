import {ChemDoodle} from "./ChemDoodleWeb";
import {useEffect, useRef} from "react";


export default function LatticeStructure({width, height}) {
    let ref = useRef();
    useEffect(() => {
            fetch('/mock/N2.cif')
                .then(res => res.text())
                .then(cifFile => {
                    let canvas = ref.current;
                    let canvas_id = canvas.id;
                    let transformBallAndStick = new ChemDoodle.TransformCanvas3D(canvas_id, width, height);
                    transformBallAndStick.styles.set3DRepresentation('Ball and Stick');
                    transformBallAndStick.styles.backgroundColor = 'white';
                    let molecule = ChemDoodle.readCIF(cifFile);
                    transformBallAndStick.loadMolecule(molecule);
                    transformBallAndStick.repaint();
                })
        }
    )
    return (
        <canvas
            ref={ref}
            id="transformBallAndStick" style={{width: width, height: height}}></canvas>
    );
}
