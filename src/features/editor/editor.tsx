// @ts-ignore
import "zenn-content-css";
import "./editor.css";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "./extensions/heading";
import { UndoRedo, TrailingNode, Placeholder } from "@tiptap/extensions";
import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
import FixedMenu from "./components/fixed-menu";
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

function Editor() {
  const editor = useEditor({
    extensions: [
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
    ],
    content: `
    <p>Hello World!</p>
    <zenn-message data-type="message"><p data-message-content>Message</p></zenn-message>
    <zenn-message data-type="alert"><p data-message-content>Alert</p></zenn-message>
    `,
  });

  return (
    <>
      <FixedMenu editor={editor} className="mb-4" />
      <EditorContent editor={editor} className="znc" />
    </>
  );
}

export default Editor;
