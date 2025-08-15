import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "./extensions/heading";
import { UndoRedo, TrailingNode } from "@tiptap/extensions";
import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
import { Link } from "./extensions/link";
import Blockquote from "@tiptap/extension-blockquote";
import HorizentalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import { Message } from "./extensions/message";
import HardBreak from "@tiptap/extension-hard-break";
import { MessageContent } from "./extensions/message/message-content";
import Image from "./extensions/figure/image";
import { Caption } from "./extensions/figure/caption";
import Figure from "./extensions/figure";
import { TableKit } from "@tiptap/extension-table";
import type { Extensions } from "@tiptap/react";
import { PrismCodeBlock } from "./extensions/prism-code-block";
import { PrismCodeContent } from "./extensions/prism-code-block/prism-code-content";
import { PrismCodeFileName } from "./extensions/prism-code-block/prism-code-file-name";
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
  PrismCodeBlock,
  PrismCodeContent,
  PrismCodeFileName,
  Figure,
  Image.configure({
    HTMLAttributes: {
      class: "md-img",
    },
  }),
  Caption,
  TableKit,

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
      if (node.type === editor.schema.nodes.caption) {
        return "キャプションを入力";
      }

      return "ここに入力";
    },
  }),
];
