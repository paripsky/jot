import waitPort from 'wait-port';

export const waitForPort = async (port: number) => {
  await waitPort({
    host: 'localhost',
    port,
  });
};
