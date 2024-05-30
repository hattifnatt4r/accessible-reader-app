
export function get() {

}

let getFetch = () => global.fetch;

export type PostDataType = {
  success: boolean,
  message: boolean,
  value?: {[key:string] : any}[],
};

export async function post(apiName : string, body : {[key:string] : any}, options? : { token?: string }) {
  const url = getURL(apiName);
  const fetch = getFetch();

  const token = window.app?.token || options?.token;

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  return result;
}

export async function upload(apiName : string, formData: FormData, filename: string) {
  const url = getURL(apiName);
  const fetch = getFetch();

  const token = window.app?.token;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Filename': filename,
    }
  });
  const result = await response.json();
  if (result.message === 'Invalid token' && window.app) {
    window.app.setSession(null, null);
  }

  return result;
}

function getURL(apiName : string) {
  const { apiUrl } = window.apiConfig || {};

  return apiUrl + apiName;
}