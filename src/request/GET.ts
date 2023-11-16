export const GET = async<R>(url: string,text?:boolean):Promise<R | string> => {
  const response = await fetch(url);
  if(text) {
    return await response.text();
  } else {
    return await response.json();
  }
}