export function postMessageToTop<T extends { name: string }>(
  iframeID: string,
  message: T
) {
  window.top?.postMessage(
    {
      from: iframeID,
      ...message,
    },
    // FIXME: change target origin
    '*'
  );
}

export default {
  postMessageToTop,
};
