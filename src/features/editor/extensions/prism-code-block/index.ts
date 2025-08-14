import {
  InputRule,
  Node,
  type ChainedCommands,
  type ExtendedRegExpMatchArray,
  type Range,
} from "@tiptap/react";
import { type EditorState } from "@tiptap/pm/state";

export const backtickInputRegex = /^```([a-z]+(?::[a-zA-Z0-9._-]+)?)?[\s\n]$/;
export const tildeInputRegex = /^~~~([a-z]+(?::[a-zA-Z0-9._-]+)?)?[\s\n]$/;

const inputHandler = ({
  state,
  range,
  match,
  chain,
}: {
  state: EditorState;
  range: Range;
  match: ExtendedRegExpMatchArray;
  chain: () => ChainedCommands;
}) => {
  let language, filename;

  // match[1]が存在し、コロンを含む場合
  if (match[1] && match[1].includes(":")) {
    [language, filename] = match[1].split(":");
  } else {
    // match[1]が言語のみ、または存在しない場合
    language = match[1] || "";
    filename = null;
  }

  const codeFileName = state.schema.nodes.codeFileName.create(
    null,
    filename ? [state.schema.text(filename)] : []
  );
  const codeContent = state.schema.nodes.codeContent.create({ language });
  const codeBlock = state.schema.nodes.codeBlock.create(null, [
    codeFileName,
    codeContent,
  ]);

  chain()
    .command(({ tr }) => {
      tr.replaceRangeWith(range.from - 1, range.to + 1, codeBlock);

      return true;
    })
    .setTextSelection(range.from + codeFileName.nodeSize + 1) //コンテンツの開始位置にカーソルを移動
    .run();
};

export const PrismCodeBlock = Node.create({
  name: "codeBlock",
  group: "block",
  content: "codeFileName codeContent",

  parseHTML() {
    return [
      {
        tag: "div[data-code-block]",
        priority: 100,
      },
    ];
  },

  renderHTML() {
    return ["div", { "data-code-block": "", class: "code-block-container" }, 0];
  },

  addInputRules() {
    return [
      new InputRule({
        find: backtickInputRegex,
        handler: inputHandler,
      }),
      new InputRule({
        find: tildeInputRegex,
        handler: inputHandler,
      }),
    ];
  },
});
