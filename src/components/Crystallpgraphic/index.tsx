'use client'
import { useSearchParams } from "next/navigation"
import { SearchResult } from "@/types"
import { useEffect,useState } from "react";
import { useSOC } from "../MaterialPropsContext";
import { GET } from "@/request";
import { materialResponse } from "@/types";

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const defaultData = [
  {
    text: 'Cell Length a',
    value: '0'
  }, {
    text: 'Cell Length b',
    value: '0'
  }, {
    text: 'Cell Length c',
    value: '0'
  }, {
    text: 'Cell Angle α',
    value: '0'
  }, {
    text: 'Cell Angle β',
    value: '0'
  }, {
    text: 'Cell Angle γ',
    value: '0'
  }, {
    text: 'Cell Volume',
    value: '0'
  }
]

const initKeys = [
  '_cell_length_a',
  '_cell_length_b',
  '_cell_length_c',
  '_cell_angle_alpha',
  '_cell_angle_beta',
  '_cell_angle_gamma',
  '_cell_volume'
]

export function Crystallographic() {

  const params = JSON.parse(useSearchParams().getAll('data')[0]) as SearchResult;
  const SOC = useSOC();
  const [data,setData] = useState(defaultData);

  useEffect(() => {
    (async() => {
      const res = await GET<materialResponse>(`material/cif?id=${params.uuid}&SOC=${SOC}`)
      const data = res.data.String.split('\n')
        .map(line => {
          const tmp = line.split('   ');
          if(initKeys.includes(tmp[0])) {
            return tmp[1]
          }
        })
        .filter(item => item !== undefined)
        .map((item,index) => {
          return {
            text: defaultData[index].text,
            value: item || 'undefined'
          }
        })
      setData(data);
    })()
  },[SOC, params.uuid])

  const TableItem = ({ text,value }:{ text:string,value:string }) => {
    return (
      <div className="flex border-t-2 border-solid border-gray-400 lg:text-md text-xs">
        <div className="p-3 w-48 border-r-2 border-solid border-gray-400">
          {text}
        </div>
        <div className="p-3 w-48 flex items-center">
          {value}
          <InlineMath math={"\\text{\\AA}"} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="my-3">Crystallographic data</div>
      <div className="border-2 border-solid border-gray-400">
      {
        data.map((item) => {
          return (<TableItem text={item.text} value={item.value} key={item.text+item.value}/>)
        })
      }
      </div>
      <div>Download K-path, Download POSCAR...</div>
    </div>
  )
}