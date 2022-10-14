import { contextBridge, ipcRenderer } from 'electron';
import type { Jot, JotEntry } from '../renderer/context/jots';
import logger from './logger';

const api = {
  async getJotFiles() {
    const fileNames = await new Promise((resolve) => {
      ipcRenderer.once('getJotFiles', (_, data) => resolve(data));
      ipcRenderer.send('getJotFiles');
    });

    return fileNames as JotEntry[];
  },
  async getJot(id: string) {
    const jot = await new Promise((resolve) => {
      ipcRenderer.once('getJot', (_, data) => resolve(data));
      ipcRenderer.send('getJot', id);
    });

    return jot as Jot | null;
  },
  async deleteJot(id: string) {
    const jot = await new Promise((resolve) => {
      ipcRenderer.once('deleteJot', (_, data) => resolve(data));
      ipcRenderer.send('deleteJot', id);
    });

    return jot as Jot | null;
  },
  async writeJot(jot: Jot) {
    const result = await new Promise((resolve) => {
      ipcRenderer.once('writeJot', (_, data) => resolve(data));
      ipcRenderer.send('writeJot', jot);
    });

    return result;
  },
  async createJot(name: string) {
    const jot = await new Promise((resolve) => {
      ipcRenderer.once('createJot', (_, data) => resolve(data));
      ipcRenderer.send('createJot', name);
    });

    return jot as Jot;
  },
  logger: logger.functions,
};

export type API = typeof api;

contextBridge.exposeInMainWorld('api', api);
