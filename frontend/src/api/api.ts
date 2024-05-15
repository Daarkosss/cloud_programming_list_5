const backendHost = import.meta.env.VITE_BACKEND_HOST || window.location.hostname;
const backendPort = import.meta.env.VITE_BACKEND_PORT || '8080';
export const PATH_PREFIX = `http://${backendHost}:${backendPort}/`;

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface AppFile {
  fileId: number;
  fileName: string;
}

class API {

    async fetch<T>(
        method: Method,
        path: string,
        body?: FormData | { [key: string]: unknown },
        headers: HeadersInit = {},
        isFormData: boolean = false
    ): Promise<T> {
        const options = {
            method,
            headers: isFormData ? {} : {
                'Content-Type': 'application/json',
                ...headers
            },
            body: isFormData ? body : JSON.stringify(body)
        } as RequestInit;

        const response = await fetch(`${PATH_PREFIX}${path}`, options);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.errorMessage || 'Wrong server response!');
        }
        return data;
    }

    async uploadFile(file: File, fileName: string): Promise<AppFile> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        return this.fetch<AppFile>('POST', 'files/upload', formData, {}, true);
      }
    
      async deleteFile(fileId: number): Promise<void> {
        return this.fetch<void>('DELETE', `files/${fileId}`);
      }
    
      async updateFileName(fileId: number, fileName: string): Promise<AppFile> {
        return this.fetch<AppFile>('PUT', `files/update/${fileId}`, { fileName });
      }
    
      async downloadFile(fileId: number): Promise<void> {
        window.location.href = `${PATH_PREFIX}files/download?fileId=${fileId}`;
      }
    
      async fetchFiles(): Promise<AppFile[]> {
        return this.fetch<AppFile[]>('GET', 'files/all');
      }
}

export const api = new API();
