import { position } from './elementPostion'

const Element = ({
  name,
  row,
  col,
  order,
}: {
  name: string
  row: number
  col: number
  order: number
}) => {
  return (
    <div
      className="bg-white flex relative justify-center items-center m-3 w-16 h-16 rounded flex-col hover:shadow-lg transform transition-all duration-500 hover:scale-110"
      style={{
        gridColumnStart: col,
        gridColumnEnd: col + 1,
        gridRowStart: row,
        gridRowEnd: row + 1,
      }}
    >
      <div className="absolute top-0 left-0 text-gray-400  text-xs">
        {order}
      </div>
      <div className="font-bold">{name}</div>
    </div>
  )
}

export default function ElementTable() {
  return (
    <div className="py-6 px-6 bg-gray-100 grid grid-cols-18 grid-rows-9">
      {position.map((item, index) => (
        <Element
          key={index}
          name={item.name}
          row={item.row}
          col={item.col}
          order={index + 1}
        />
      ))}
    </div>
  )
}
