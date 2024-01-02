import { generalResponse } from "@/types";

const SERVER = process.env.NEXT_PUBLIC_SERVER;

export const GET = async<R>(url: string):Promise<generalResponse<R>> => {
  // 判断是否是mock url
  const concatUrl = url[0] === '/' ? url : SERVER+url;
  const res = await fetch(concatUrl);

  const response:generalResponse = {
    data: {},
    errMsg: ''
  }

  response.data = await res.json();
  return response;
}