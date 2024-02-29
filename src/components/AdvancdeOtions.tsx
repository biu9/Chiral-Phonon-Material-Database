'use client'
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { useState } from 'react';
import { useSearchProps,useSearchPropsDispatch } from './searchPropsContext';
import AutoCompleteTextArea from './AutoCompleteTextArea';
import { Switch } from '@mui/material';

const MaterialsFilter = () => {
  const [elementValue, setElementValue] = useState<number[]>([0, 174]);
  const [atomValue, setAtomValue] = useState<number[]>([1, 7]);
  const searchProps = useSearchProps();
  const setSearchProps = useSearchPropsDispatch();
  const handleChange = (event: Event, newValue: number | number[]) => {
    if(newValue instanceof Array) {
      setElementValue(newValue);
      setSearchProps({
        ...searchProps,
        filter: {
          ...searchProps.filter,
          element_num_min: newValue[0],
          element_num_max: newValue[1]
        }
      })
    }
  }

  const setLeftValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setElementValue([parseInt(event.target.value), elementValue[1]]);
    setSearchProps({
      ...searchProps,
      filter: {
        ...searchProps.filter,
        element_num_min: parseInt(event.target.value)
      }
    })
  }

  const setRightValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setElementValue([elementValue[0], parseInt(event.target.value)])
    setSearchProps({
      ...searchProps,
      filter: {
        ...searchProps.filter,
        element_num_max: parseInt(event.target.value)
      }
    })
  }

  const setAtomLeftValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAtomValue([parseInt(event.target.value), atomValue[1]])
    setSearchProps({
      ...searchProps,
      filter: {
        ...searchProps.filter,
        atom_num_min: parseInt(event.target.value)
      }
    })
  }

  const setAtomRightValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAtomValue([atomValue[0], parseInt(event.target.value)])
    setSearchProps({
      ...searchProps,
      filter: {
        ...searchProps.filter,
        atom_num_max: parseInt(event.target.value)
      }
    })
  }

  const handleAtomChange = (event: Event, newValue: number | number[]) => {
    if(newValue instanceof Array) {
      setAtomValue(newValue);
      setSearchProps({
        ...searchProps,
        filter: {
          ...searchProps.filter,
          atom_num_min: newValue[0],
          atom_num_max: newValue[1]
        }
      })
    }
  }
  
  return (
    <div className='flex flex-col space-y-2'>
      <div className="text-xl">Materials Filters</div>
      <div className='flex flex-col space-y-2'>
        <div>Symmetry Group</div>
        <AutoCompleteTextArea/>
      </div>
      <div>
        <div>No. of Elements</div>
        <div style={{
          width: '30%'
        }} className='flex space-x-5'>
          <TextField onChange={setLeftValue} value={elementValue[0]} variant="outlined" size="small" style={{
            width:'70px',
          }}/>
          <Slider
            value={elementValue}
            onChange={handleChange}
            valueLabelDisplay="auto"
            min={0}
            max={174}
          />
          <TextField onChange={setRightValue} value={elementValue[1]} variant="outlined" size="small" style={{
            width:'70px'
          }}/>
        </div>
      </div>
      <div>
        <div>No. of Atoms</div>
        <div style={{
          width: '30%'
        }} className='flex space-x-5'>
          <TextField onChange={setAtomLeftValue} value={atomValue[0]} variant="outlined" size="small" style={{
            width:'70px',
          }}/>
          <Slider
            value={atomValue}
            onChange={handleAtomChange}
            valueLabelDisplay="auto"
            min={1}
            max={7}
          />
          <TextField onChange={setAtomRightValue} value={atomValue[1]} variant="outlined" size="small" style={{
            width:'70px'
          }}/>
        </div>
      </div>
      <div className="flex items-center">
        <Switch
          checked={searchProps.filter.type === 'chiral' ? true : false}
          inputProps={{ 'aria-label': 'controlled' }}
          onChange={(e) => {
            setSearchProps({
              ...searchProps,
              filter: {
                ...searchProps.filter,
                type: e.target.checked ? 'chiral' : 'achiral'
              }
            })
          
          }}
        />
        chiral
      </div>
      <div className="flex items-center">
        <Switch
          checked={searchProps.filter.pam}
          inputProps={{ 'aria-label': 'controlled' }}
          onChange={(e) => {
            setSearchProps({
              ...searchProps,
              filter: {
                ...searchProps.filter,
                pam: e.target.checked
              }
            })
          }}
        />
        pam
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