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
    ],
    content: "<p>Hello World!</p>",
  });

  return (
    <>
      <FixedMenu editor={editor} className="mb-4" />
      <EditorContent editor={editor} className="znc" />
    </>
  );
}

export default Editor;
