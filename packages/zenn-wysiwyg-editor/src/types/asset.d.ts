declare module "zenn-content-css" {
  const content: any;
  export default content;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}