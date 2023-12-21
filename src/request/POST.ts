const SERVER = process.env.NEXT_PUBLIC_SERVER;

export const POST = async<T,R>(url:string,payload:T):Promise<R | string> => {
  // 判断是否是mock url
  const concatUrl = url[0] === '/' ? url : SERVER+url;
  
  try {
    const response = await fetch(concatUrl,{
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data;
  } catch(error) {
    console.log(error);
    return JSON.stringify(error);
  }
}