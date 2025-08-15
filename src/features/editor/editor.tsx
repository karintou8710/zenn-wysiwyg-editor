// @ts-ignore
import "zenn-content-css";
import "./editor.css";

import { useEditor, EditorContent } from "@tiptap/react";
import FixedMenu from "./components/fixed-menu";
import { CONTENT_KEY, useLocalStorage } from "@/hooks/useLocalStorage";

import { extensions } from "./extensions";
import { INITIAL_CONTENT } from "./lib/initial-content";
import BubbleMenu from "./components/bubble-menu";
import ImageBubbleMenu from "./components/image-bubble-menu";

function Editor() {
  const [_, setContent] = useLocalStorage(CONTENT_KEY, "");

  const editor = useEditor({
    extensions,
    content: INITIAL_CONTENT,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <>
      <FixedMenu editor={editor} className="mb-2" />
      <BubbleMenu editor={editor} />
      <ImageBubbleMenu editor={editor} />
      <EditorContent editor={editor} className="znc" />
    </>
  );
}

export default Editor;
