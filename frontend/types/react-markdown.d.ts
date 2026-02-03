declare module "react-markdown" {
  import { ComponentType } from "react";
  export interface Components {
    [key: string]: ComponentType<any>;
  }
  export interface ReactMarkdownProps {
    children?: string;
    components?: Components;
    remarkPlugins?: unknown[];
    rehypePlugins?: unknown[];
  }
  const ReactMarkdown: ComponentType<ReactMarkdownProps>;
  export default ReactMarkdown;
}
