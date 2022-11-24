import { Menu, nativeImage, Tray } from 'electron';

let tray: Tray;

export type CreateTrayIconOptions = {
  showWindow: () => void;
  icon: string;
};

const createTrayMenu = ({ showWindow, icon }: CreateTrayIconOptions) => {
  tray = new Tray(nativeImage.createFromPath(icon).resize({ width: 16, height: 16 }));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Jot', click: showWindow },
    { label: 'Exit', role: 'quit' },
  ]);
  tray.setToolTip('Jot');
  tray.setContextMenu(contextMenu);
  tray.on('click', showWindow);
};

export default createTrayMenu;
