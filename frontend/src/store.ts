import { makeAutoObservable } from "mobx";
import { api, AppFile } from "./api/api";


class Store {
  files: AppFile[] = [];

  constructor() {
    makeAutoObservable(this);
    this.fetchFiles();
  }

  async fetchFiles() {
    try {
      const fetchedFiles = await api.fetchFiles();
      this.files = fetchedFiles;
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  }

  async uploadFile(file: File, fileName: string) {
    try {
      await api.uploadFile(file, fileName);
      await this.fetchFiles(); // Refresh the list
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  }

  async deleteFile(fileId: number) {
    try {
      await api.deleteFile(fileId);
      this.files = this.files.filter(file => file.id !== fileId);
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  }

  async updateFileName(fileId: number, fileName: string) {
    try {
      await api.updateFileName(fileId, fileName);
      await this.fetchFiles(); // Refresh the list
    } catch (error) {
      console.error("Failed to update file name:", error);
    }
  }

  async downloadFile(fileId: number) {
    api.downloadFile(fileId);
  }
}

export const store = new Store();
