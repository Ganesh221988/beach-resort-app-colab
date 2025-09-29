export const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => resolve();
  script.onerror = () => reject();
  document.body.appendChild(script);
});
