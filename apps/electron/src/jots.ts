import type { Jot, JotEntry } from '@jot/web/src/context/jots';
import generateID from '@jot/web/src/utils/id';
import { app, ipcMain } from 'electron';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import { logger } from './logger';

const directoryPath = path.join(app.getPath('userData'), 'jots');

const sanitizePath = (unsafeSuffix: string) =>
  path.normalize(unsafeSuffix).replace(/^(\.\.(\/|\\|$))+/, '');

const getJotFiles = async () => {
  try {
    const index = await readFile(path.join(directoryPath, 'index.json'), 'utf-8');

    return JSON.parse(index) as JotEntry[];
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const writeIndex = async (newIndex: JotEntry[]) => {
  await mkdir(directoryPath, { recursive: true });
  return writeFile(path.join(directoryPath, 'index.json'), JSON.stringify(newIndex), 'utf-8');
};

const getJot = async (fileName: string) => {
  try {
    const sanitizedFileName = sanitizePath(`${fileName}.json`);

    if (sanitizedFileName === 'index.json') {
      return null;
    }

    const file = await readFile(path.join(directoryPath, sanitizedFileName), 'utf-8');
    return JSON.parse(file);
  } catch (err) {
    logger.error(err);
    return null;
  }
};

const writeJot = async (jot: Jot) => {
  try {
    const index = await getJotFiles();
    const now = new Date().toISOString();
    jot.updatedAt = now;
    await writeFile(path.join(directoryPath, `${jot.id}.json`), JSON.stringify(jot), 'utf-8');
    const itemInIndex = index.find((item) => item.id === jot.id);

    if (!itemInIndex) {
      throw new Error(`The index file doesn't contain the jot ${jot.name} (${jot.id})`);
    }

    const newIndex = index.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { items: _, ...jotFields } = jot;
      return item.id === jot.id ? jotFields : item;
    });
    await writeIndex(newIndex);
  } catch (err) {
    logger.error(err);
  }
};

const createJot = async ({ name, icon }: { name: string, icon: string }) => {
  const index = await getJotFiles();
  const now = new Date().toISOString();
  const newJot: Jot = {
    id: generateID(),
    name,
    items: [],
    icon,
    createdAt: now,
    updatedAt: now,
  };

  await writeIndex([
    ...index,
    {
      id: newJot.id,
      name,
      icon: newJot.icon,
    },
  ]);
  await writeJot(newJot);

  return newJot;
};

const deleteJot = async (jotId: string) => {
  const index = await getJotFiles();

  // remove the jot from the index file but keep the jot itself so it can be recovered
  await writeIndex(index.filter((entry) => entry.id !== jotId));
};

ipcMain.on('getJotFiles', async (event) => {
  const fileNames = await getJotFiles();
  event.reply('getJotFiles', fileNames);
});

ipcMain.on('getJot', async (event, fileName: string) => {
  const jot = await getJot(fileName);
  event.reply('getJot', jot);
});

ipcMain.on('writeJot', async (event, jot: Jot) => {
  await writeJot(jot);
  event.reply('writeJot', true);
});

ipcMain.on('createJot', async (event, { name, icon }) => {
  const jot = await createJot({ name, icon });
  event.reply('createJot', jot);
});

ipcMain.on('deleteJot', async (event, jotId: string) => {
  const jot = await deleteJot(jotId);
  event.reply('deleteJot', jot);
});
