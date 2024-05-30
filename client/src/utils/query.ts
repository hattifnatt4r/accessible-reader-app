
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
  console.log('post:', result);

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
      'Authorization': `Bearer ${window.app.token}`,
      'Filename': filename,
    }
  });
  const result = await response.json();
  console.log('upload:', result);

  return result;
}

function getURL(apiName : string) {
  // console.log('url:', apiName, root.app);
  const { apiUrl } = window.apiConfig;

  return apiUrl + apiName;
}


// const res = await post('login', { login_name: '', login_password: '' });
