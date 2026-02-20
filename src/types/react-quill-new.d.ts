declare module "react-quill-new" {
  import * as React from "react";

  export type QuillSource = "api" | "user" | "silent";

  export interface ReactQuillProps {
    theme?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    modules?: Record<string, unknown>;
    formats?: string[];
    className?: string;
    onChange?: (value: string, delta: unknown, source: QuillSource, editor: unknown) => void;
  }

  const ReactQuill: React.ComponentType<ReactQuillProps>;
  export default ReactQuill;
}

declare module "react-quill-new/dist/quill.snow.css";
