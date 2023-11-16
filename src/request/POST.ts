export const POST = async<T,R>(url:string,payload:T):Promise<R> => {
  const response = await fetch(url,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return data;
}