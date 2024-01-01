import { generalResponse } from "@/types";

const SERVER = process.env.NEXT_PUBLIC_SERVER;

export const POST = async<T,R>(url:string,payload:T):Promise<generalResponse<R>> => {
  // 判断是否是mock url
  const concatUrl = url[0] === '/' ? url : SERVER+url;
  const response:generalResponse = {
    data:{},
    errMsg:""
  }
  
  try {
    const res = await fetch(concatUrl,{
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    response.data = data
  } catch(error) {
    console.log(error);
    response.errMsg = JSON.stringify(error)
  }

  return response;
}