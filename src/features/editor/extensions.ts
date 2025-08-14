import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "./extensions/heading";
import { UndoRedo, TrailingNode, Placeholder } from "@tiptap/extensions";
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
import { PrismCodeBlock } from "./extensions/prism-code-block";
import Image from "./extensions/image";
import { Caption } from "./extensions/caption";
import Figure from "./extensions/figure";
import { TableKit } from "@tiptap/extension-table";
import type { Extensions } from "@tiptap/react";

export const extensions: Extensions = [
  Document,
  Paragraph,
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4],
  }),
  UndoRedo,
  TrailingNode,
  Placeholder.configure({
    placeholder: "ここに入力",
  }),
  BulletList,
  OrderedList,
  ListItem,
  Link.configure({
    autolink: false,
  }),
  Blockquote,
  HorizentalRule,
  Bold,
  Italic,
  Strike,
  Code,
  Message,
  MessageContent,
  HardBreak,
  PrismCodeBlock,
  Figure,
  Image.configure({
    HTMLAttributes: {
      class: "md-img",
    },
  }),
  Caption,
  TableKit,
];
