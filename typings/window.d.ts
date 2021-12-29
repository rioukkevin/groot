declare interface Window {}

declare module "*.png" {
  const value: string;
  export default value;
}
