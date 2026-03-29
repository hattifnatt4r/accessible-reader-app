
export function get() {

}

let getFetch = () => global.fetch;

export type PostDataType = {
  success: boolean,
  message: boolean,
  value?: {[key:string] : any}[],
};

export async function post(apiName : string, body : {[key:string] : any}) {
  const url = getURL(apiName);
  const fetch = getFetch();

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

export async function upload(apiName : string, formData: FormData, filename: string) {
  const url = getURL(apiName);
  const fetch = getFetch();

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: formData,
    headers: {
      'Filename': filename,
    }
  });
  const result = await response.json();
  if (response.status === 401 && window.app) {
    window.app.setSession(null);
  }

  return result;
}

function getURL(apiName : string) {
  const { apiUrl } = window.apiConfig || {};

  return apiUrl + apiName;
}
