'use client'
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { useSearchProps,useSearchPropsDispatch } from './searchPropsContext';

const MaterialsFilter = () => {
  const [value, setValue] = useState<number[]>([0, 100]);
  const searchProps = useSearchProps();
  const setSearchProps = useSearchPropsDispatch();
  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  }

  const setLeftValue = (event: any) => {
    setValue([event.target.value, value[1]])
  }

  const setRightValue = (event: any) => {
    setValue([value[0], event.target.value])
  }
  
  return (
    <div className='flex flex-col space-y-2'>
      <div className="text-xl">Materials Filters</div>
      <div className='flex flex-col space-y-2'>
        <div>Symmetry Group</div>
        <TextField variant="outlined" size="small" style={{
          width: '30%'
        }}/>
      </div>
      <div>
        <div>No. of Elements</div>
        <div style={{
          width: '30%'
        }} className='flex space-x-5'>
          <TextField onChange={setLeftValue} value={value[0]} variant="outlined" size="small" style={{
            width:'70px',
          }}/>
          <Slider
            getAriaLabel={() => 'Temperature range'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            
          />
          <TextField onChange={setRightValue} value={value[1]} variant="outlined" size="small" style={{
            width:'70px'
          }}/>
        </div>
      </div>
    </div>
  )
}

export default function AdvancedOtions() {
  return (
    <div className="p-6">
        <div className="font-bold text-2xl">Advanced Search</div>
        <div>
          <MaterialsFilter />
        </div>
    </div>
  )
}