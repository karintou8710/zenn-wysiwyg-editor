// @ts-expect-error
import "zenn-content-css";
import "./editor.css";

import { EditorContent, useEditor } from "@tiptap/react";
import { CONTENT_KEY, useLocalStorage } from "@/hooks/useLocalStorage";
import BubbleMenu from "./components/bubble-menu";
import FixedMenu from "./components/fixed-menu";
import ImageBubbleMenu from "./components/image-bubble-menu";
import { extensions } from "./extensions";
import DragHandle from "./extensions/drag-handle";
import { INITIAL_CONTENT } from "./lib/initial-content";

function Editor() {
  const [content, setContent] = useLocalStorage(CONTENT_KEY, "");

  const editor = useEditor({
    extensions,
    content: content || INITIAL_CONTENT,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    onTransaction: ({ editor }) => {
      console.log(editor.state.selection.from);
    },
  });

  return (
    <>
      <FixedMenu editor={editor} className="mb-2" />
      <BubbleMenu editor={editor} />
      <ImageBubbleMenu editor={editor} />
      <EditorContent editor={editor} className="znc" />
      <DragHandle editor={editor} />
    </>
  );
}

export default Editor;
