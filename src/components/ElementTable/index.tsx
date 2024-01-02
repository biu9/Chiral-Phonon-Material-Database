import { Dispatch, SetStateAction } from 'react'
import { position } from './elementPostion'
import { IElement } from '@/types';
import { useSearchProps,useSearchPropsDispatch } from '@/components/searchPropsContext';

const Element = ({ name,row,col,order,choosed,handleClick }:{ name: string,row: number,col: number,order: number,choosed:boolean,handleClick:(name:string)=>void }) => {

  const style = choosed ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'

  return (
    <div
      onClick={() => handleClick(name)}
      className={" flex relative justify-center items-center m-3 xl:w-12 xl:h-12 w-8 h-10 cursor-pointer rounded flex-col hover:shadow-lg transform transition-all duration-500 hover:scale-110 " + style}
      style={{
        gridColumnStart: col,
        gridColumnEnd: col + 1,
        gridRowStart: row,
        gridRowEnd: row + 1,
      }}
    >
      <div className={"absolute top-0 left-0 text-gray-400 text-xs bg-white"+style}>
        {order}
      </div>
      <div className="font-bold">{name}</div>
    </div>
  )
}

export default function ElementTable() {

  const searchProps = useSearchProps();
  const containElements = searchProps.filter.elements;
  const setSearchProps = useSearchPropsDispatch();

  if(!setSearchProps) {
    throw new Error('useSearchPropsDispatch must be used within a SearchPropsProvider');
  }

  const handleClick = (name:string) => {
    const index = containElements.findIndex(element => element.name === name);
    if(index === -1) {
      setSearchProps({
        ...searchProps,
        filter: {
          ...searchProps.filter,
          elements: [...containElements,{ name: name,number: 1 }]
        }
      })
    } else {
      const tmpArr = [...containElements];
      tmpArr.splice(index,1);
      setSearchProps({
        ...searchProps,
        filter: {
          ...searchProps.filter,
          elements: tmpArr
        }
      })
    }
  }

  return (
    <div className=" lg:justify-center bg-gray-100 lg:items-center hidden lg:flex">
      <div className="py-6 px-6 bg-gray-100 grid grid-cols-18 grid-rows-9">
        {position.map((item, index) => (
          <Element
            key={index}
            name={item.name}
            row={item.row}
            col={item.col}
            order={index + 1}
            choosed={containElements.some((element) => element.name === item.name)}
            handleClick={handleClick}
          />
        ))}
      </div>
    </div>
  )
}
