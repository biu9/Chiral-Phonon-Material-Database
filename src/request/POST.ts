const SERVER = process.env.NEXT_PUBLIC_SERVER;

export const POST = async<T,R>(url:string,payload:T):Promise<R> => {
  // 判断是否是mock url
  const concatUrl = url[0] === '/' ? url : SERVER+url;
  
  const response = await fetch(concatUrl,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return data;
}