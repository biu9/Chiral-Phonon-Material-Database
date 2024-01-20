import SideBar from "@/components/SideBar";

export default function About() {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex w-full flex-col p-6 items-start">
        <div className="text-3xl mb-6">Acknowledgements</div>
        <div className="flex space-x-32">
          <div>
            <div className="mb-6 text-xl">Website Development:</div>
            <ul>
              {
                ['developer 1','developer 2','pm'].map(text => {
                  return <li key={text}>{text}</li>
                })
              }
            </ul>
          </div>
          <div>
            <div className="mb-6 text-xl">Administration:</div>
            <ul>
              {
                ['xlab','research lab'].map(text => {
                  return <li key={text}>{text}</li>
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}