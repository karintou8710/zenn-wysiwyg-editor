import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "./extensions/heading";
import { UndoRedo, TrailingNode, Dropcursor } from "@tiptap/extensions";
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
import { Image } from "./extensions/figure/image";
import { Caption } from "./extensions/figure/caption";
import Figure from "./extensions/figure";
import { TableKit } from "@tiptap/extension-table";
import type { Extensions } from "@tiptap/react";
import { CodeBlockContainer } from "./extensions/code-block-container";
import { CodeBlock } from "./extensions/code-block-container/code-block";
import { CodeBlockFileName } from "./extensions/code-block-container/code-block-file-name";
import { Placeholder } from "./extensions/placeholder";
import { EmbedLinkCard } from "./extensions/embed/embed-link-card";
import { EmbedTweet } from "./extensions/embed/embed-tweet";
import { EmbedGithub } from "./extensions/embed/embed-github";
import { EmbedPasteHandler } from "./extensions/embed/embedPasteHandler";
import { EmbedGist } from "./extensions/embed/embed-gist";
import { EmbedCodepen } from "./extensions/embed/embed-codepen";
import { EmbedJsfiddle } from "./extensions/embed/embed-jsfiddle";
import { EmbedCodesandbox } from "./extensions/embed/embed-codesandbox";
import { EmbedStackblitz } from "./extensions/embed/embed-stackblitz";
import { EmbedYoutube } from "./extensions/embed/embed-youtube";
import { MarkdownPasteHandler } from "./extensions/markdown-paste-handler";

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
  TableKit,
  EmbedLinkCard,
  EmbedTweet,
  EmbedGithub,
  EmbedGist,
  EmbedCodepen,
  EmbedJsfiddle,
  EmbedCodesandbox,
  EmbedStackblitz,
  EmbedYoutube,

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
  MarkdownPasteHandler,
];
