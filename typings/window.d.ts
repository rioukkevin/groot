/// <reference types="next-lqip-images" />

declare interface Window {}

declare module "*.png?lqip&blur" {
  const value: string;
  export default value;
}

declare module "@analytics/mixpanel" {
  const value: ({ token: string }) => any;
  export default value;
}
