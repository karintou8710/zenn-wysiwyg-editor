import type { EditorState } from "@tiptap/pm/state";
import {
  type ChainedCommands,
  type ExtendedRegExpMatchArray,
  InputRule,
  Node,
  type Range,
} from "@tiptap/react";

export const backtickInputRegex = /^```([a-z-]+(?::[a-zA-Z0-9._-]+)?)?[\s\n]$/;
export const tildeInputRegex = /^~~~([a-z-]+(?::[a-zA-Z0-9._-]+)?)?[\s\n]$/;

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
  let language: string, filename: string | null;

  // match[1]が存在し、コロンを含む場合
  if (match[1]?.includes(":")) {
    [language, filename] = match[1].split(":");
  } else {
    // match[1]が言語のみ、または存在しない場合
    language = match[1] || "plaintext";
    filename = null;
  }

  const isDiff = language.startsWith("diff-");
  const codeFileName = state.schema.nodes.codeBlockFileName.create(
    null,
    filename ? [state.schema.text(filename)] : []
  );
  const codeContent = isDiff
    ? state.schema.nodes.diffCodeBlock.create({ language }, [
        state.schema.nodes.diffCodeLine.create(null, []),
      ])
    : state.schema.nodes.codeBlock.create({ language });
  const codeBlock = state.schema.nodes.codeBlockContainer.create(null, [
    codeFileName,
    codeContent,
  ]);

  chain()
    .command(({ tr }) => {
      tr.replaceRangeWith(range.from - 1, range.to + 1, codeBlock);

      return true;
    })
    .setTextSelection(range.from + codeFileName.nodeSize + (isDiff ? 2 : 1)) //コンテンツの開始位置にカーソルを移動
    .run();
};

export const CodeBlockContainer = Node.create({
  name: "codeBlockContainer",
  group: "block",
  content: "codeBlockFileName (codeBlock | diffCodeBlock)",

  parseHTML() {
    return [
      {
        tag: "div.code-block-container",
        priority: 100,
      },
    ];
  },

  renderHTML() {
    return ["div", { class: "code-block-container" }, 0];
  },

  addKeyboardShortcuts() {
    return {
      "Mod-a": () => {
        const { state, commands } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        // カーソルがコードブロック内にあるかチェック
        let codeBlockNode = null;
        let codeBlockPos: { from: number; to: number } | null = null;

        // 親ノードを遡ってコードブロックを探す
        for (let depth = $from.depth; depth >= 0; depth--) {
          const node = $from.node(depth);
          if (node.type === state.schema.nodes.codeBlock) {
            codeBlockNode = node;
            codeBlockPos = {
              from: $from.start(depth),
              to: $from.end(depth),
            };
            break;
          } else if (node.type === state.schema.nodes.diffCodeBlock) {
            codeBlockNode = node;
            codeBlockPos = {
              from: $from.start(depth) + 1,
              to: $from.end(depth) - 1,
            };
            break;
          }
        }

        if (!codeBlockNode || !codeBlockPos) return false;

        commands.setTextSelection(codeBlockPos);
        return true;
      },
    };
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
