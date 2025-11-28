// src/types/htmldocs.d.ts
declare module "htmldocs" {
  const renderAsync: (element: any) => Promise<string>;
  export default {
    renderAsync,
  };
}
