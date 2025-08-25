import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import HardBreak from "@tiptap/extension-hard-break";
import HorizentalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import Text from "@tiptap/extension-text";
import { Dropcursor, TrailingNode, UndoRedo } from "@tiptap/extensions";
import type { Extensions } from "@tiptap/react";
import { CodeBlockContainer } from "./extensions/code-block-container";
import { CodeBlock } from "./extensions/code-block-container/code-block";
import { CodeBlockFileName } from "./extensions/code-block-container/code-block-file-name";
import { DiffCodeBlock } from "./extensions/code-block-container/diff-code-block";
import { DiffCodeLine } from "./extensions/code-block-container/diff-code-block/diff-code-line";
import { Details } from "./extensions/details";
import { DetailsContent } from "./extensions/details/content";
import { DetailsSummary } from "./extensions/details/summary";
import Document from "./extensions/document";
import { Embed } from "./extensions/embed";
import { EmbedPasteHandler } from "./extensions/embed/embed-paste-handler";
import { SpeakerDeckEmbed } from "./extensions/embed/speaker-deck-embed";
import Figure from "./extensions/figure";
import { Caption } from "./extensions/figure/caption";
import { Image } from "./extensions/figure/image";
import { FileHandler } from "./extensions/file-handler";
import FootnoteItem from "./extensions/footnotes/footnote-item";
import FootnoteReference from "./extensions/footnotes/footnote-reference";
import Footnotes from "./extensions/footnotes/footnotes";
import { FootnotesList } from "./extensions/footnotes/footnotes-list";
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
  DiffCodeLine,
  DiffCodeBlock,
  Figure,
  Image,
  Caption,
  Embed,
  Details,
  DetailsSummary,
  DetailsContent,
  SpeakerDeckEmbed,
  FootnoteReference,
  Footnotes,
  FootnoteItem,
  FootnotesList,
  Table,
  TableCell,
  TableHeader,
  TableRow,

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
  FileHandler,
];
