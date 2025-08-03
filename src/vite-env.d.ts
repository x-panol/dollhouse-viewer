/// <reference types="vite/client" />

declare module "*.obj" {
    const content: string;
    export default content;
}

declare module "*.obj?url" {
    const content: string;
    export default content;
}

declare module "*.mtl" {
    const content: string;
    export default content;
}

declare module "*.mtl?url" {
    const content: string;
    export default content;
}
