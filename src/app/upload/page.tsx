'use client'
import SideBar from "@/components/SideBar"
import { useState } from "react"
import { POST } from "@/request"

const processFile = (files:FileList) => {
  return new Promise((resolve,reject) => {
    const uploadBody:any = {};
    let running = 0;
    for(let i=0;i<files.length;i++) {
      running++;
      const reader = new FileReader()
      reader.onload = function(event) {
        const fileContent = event.target?.result || '';
        let fileType = files[i].name.split('.')[1];
        if(fileType.includes('proj')) {
          fileType = fileType.split('proj')[0];
        }
        uploadBody[fileType] = fileContent

        running--;
        if(running === 0) {
          resolve(uploadBody);
        }
      };
      reader.readAsText(files[i])
    }    
  })
}

export default function Upload() {

  const [files, setFiles] = useState<FileList | null>(null)
  const [soc, setSoc] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const handleSubmit = async () => {
    if(files) {
      const uploadBody = await processFile(files);
      const tmp = files[0].name.split('.')[0].split('_')
      const ID = tmp[0];
      const pam = tmp[1].includes('a') ? false : true;
      const chiral = tmp[2];
      const postBody = {
        data:uploadBody,
        ID: ID,
        pam: pam,
        chiral: chiral,
        soc: soc+''
      }

      const res = await POST('upload',postBody);
      console.log(res)
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