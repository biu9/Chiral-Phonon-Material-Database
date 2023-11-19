const SERVER = process.env.NEXT_PUBLIC_SERVER;

export const POST = async<T,R>(url:string,payload:T):Promise<R> => {
  const response = await fetch(SERVER+url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return data;
}