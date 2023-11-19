const SERVER = process.env.NEXT_PUBLIC_SERVER;

export const GET = async<R>(url: string,text?:boolean):Promise<R | string> => {
  const response = await fetch(SERVER+url);
  if(text) {
    return await response.text();
  } else {
    return await response.json();
  }
}