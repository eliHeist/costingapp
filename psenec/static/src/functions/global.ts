import { JSONObject } from "../classes/classes";

// =================Global GET ========================
export async function getMethod(url: string): Promise<object> {
   url = `${url}?format=json`
   const response = await fetch(url)
   return await response.json();
}
// ================= CSRF ========================
export function csrf(): string {
   const field = document.getElementById('token')?.firstElementChild as HTMLInputElement
   return field.value;
}
// =============== close loader ===============
export function closeLoader() {
   const loader = document.getElementById('loader') as HTMLElement
   loader.classList.add('hidden')
}



export async function GET(url: string): Promise<JSONObject> {
   const response = await fetch(url);
   return await response.json();
}
export async function POST(url: string, obj: object): Promise<JSONObject> {
   const response = await fetch(url, {
      method: 'POST',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'X-CSRFToken': csrf(),
      },
      body: JSON.stringify(obj)
   });
   return await response.json();
}
export async function PUT(url: string, obj: object): Promise<JSONObject> {
   const response = await fetch(url, {
      method: 'PUT',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'X-CSRFToken': csrf(),
      },
      body: JSON.stringify(obj)
   });
   return await response.json();
}
export async function DELETE(url: string, obj: any=null): Promise<JSONObject> {
    let body = ''
    if (obj){
        body = JSON.stringify(obj)
    }
   const response = await fetch(url, {
      method: 'DELETE',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'X-CSRFToken': csrf(),
      },
      body: body
   });
   return await response.json();
}

export async function apiURLS() {
   return await GET("/api/")
}

