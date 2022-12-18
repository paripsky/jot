export const readFile = (file: Blob): Promise<string | ArrayBuffer | null> => {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.addEventListener(
      'load',
      () => {
        resolve(reader.result);
      },
      false,
    );

    reader.readAsDataURL(file);
  });
};
