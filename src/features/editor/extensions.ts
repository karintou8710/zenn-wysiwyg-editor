import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import HorizentalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import { Dropcursor, TrailingNode, UndoRedo } from "@tiptap/extensions";
import type { Extensions } from "@tiptap/react";
import { CodeBlockContainer } from "./extensions/code-block-container";
import { CodeBlock } from "./extensions/code-block-container/code-block";
import { CodeBlockFileName } from "./extensions/code-block-container/code-block-file-name";
import { Embed } from "./extensions/embed";
import { EmbedPasteHandler } from "./extensions/embed/embedPasteHandler";
import Figure from "./extensions/figure";
import { Caption } from "./extensions/figure/caption";
import { Image } from "./extensions/figure/image";
import Heading from "./extensions/heading";
import { Link } from "./extensions/link";
import { Message } from "./extensions/message";
import { MessageContent } from "./extensions/message/message-content";
import { Placeholder } from "./extensions/placeholder";

export const extensions: Extensions = [
  // === Core ===
  Document,
  Paragraph,
  Text,

  // === Nodes ===
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  HorizentalRule,
  HardBreak,
  Message,
  MessageContent,
  CodeBlockContainer,
  CodeBlock,
  CodeBlockFileName,
  Figure,
  Image,
  Caption,
  Embed,

  // === Marks ===
  Bold,
  Italic,
  Strike,
  Code,
  Link.configure({
    autolink: false,
  }),

  // === Features ===
  UndoRedo,
  TrailingNode,
  Placeholder.configure({
    placeholder: ({ editor, node }) => {
      // codeFileNameのプレースホルダはハードコーディング
      if (node.type === editor.schema.nodes.caption) {
        return "キャプションを入力";
      }

      return "ここに入力";
    },
  }),
  EmbedPasteHandler,
  Dropcursor,
];
