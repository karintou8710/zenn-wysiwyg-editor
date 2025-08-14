import CodeBlock, { type CodeBlockOptions } from "@tiptap/extension-code-block";

import { PrismPlugin } from "./prism-plugin.ts";

export interface PrismCodeBlockOptions extends CodeBlockOptions {
  defaultLanguage: string;
}

export const PrismCodeBlock = CodeBlock.extend<PrismCodeBlockOptions>({
  addOptions() {
    const parentOptions = this.parent?.() || ({} as CodeBlockOptions);
    return {
      ...parentOptions,
      defaultLanguage: "typescript",
    };
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      PrismPlugin({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
      }),
    ];
  },
});
