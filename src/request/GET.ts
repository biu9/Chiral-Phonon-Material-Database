const SERVER = process.env.NEXT_PUBLIC_SERVER;

export const GET = async<R>(url: string,text?:boolean):Promise<R | string> => {
  // 判断是否是mock url
  const concatUrl = url[0] === '/' ? url : SERVER+url;
  const response = await fetch(concatUrl);

  if(text) {
    return await response.text();
  } else {
    return await response.json();
  }
}