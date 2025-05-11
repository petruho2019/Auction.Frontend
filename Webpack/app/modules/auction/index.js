

export async function test(){
  const response = await fetch('https://localhost:7076/api/authorize/hello', {
    method: "GET",
    credentials: 'include',
  });

  if (response.ok)
    console.log(await response.text());
  else{
    console.log(response.status);
  }

  
}