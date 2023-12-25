'use client'
import SideBar from "@/components/SideBar"
import { useState } from "react"
import { POST } from "@/request"
import { concurrentControl } from "@/utils/concurrentControl"

import { processFiles } from "./processFiles"

type uploadData = {
  ID: string,
  pam: boolean,
  chiral: string,
  data: {
    poscar: string,
    band: string,
    dos: string,
    nacdos: string,
    cif: string
  }
}

export default function Upload() {

  const [files, setFiles] = useState<FileList | null>(null)
  const [soc, setSoc] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const handleSubmit = async () => {
    if(files) {
     const uploadBody = await processFiles(files);
     console.log(uploadBody)

      const requests = uploadBody.map(item => () => POST<uploadData[],undefined>('upload',[item]))
      const res = await concurrentControl(requests,1);
    }
  }

  return (
    <div className="flex">
      <SideBar/>
      <div className="flex w-full flex-col p-6 items-start">
        Upload
        <input type="file" name="file" id="file" multiple onChange={handleFileChange}/>
        <button className="bg-black text-white w-32 rounded-lg mt-6 p-1 cursor-pointer hover:bg-slate-600" onClick={handleSubmit}>
          Upload
        </button>
        <div className="flex justify-center space-x-3">
          <input type="checkbox" onChange={() => setSoc(!soc)}/>
          <div>with soc</div>
        </div>
      </div>
    </div>
  )
}