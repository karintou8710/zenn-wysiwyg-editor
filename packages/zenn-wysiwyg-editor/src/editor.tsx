import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";

type Props = {
  content?: string;
  onChange?: (html: string) => void;
};

function Editor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} className="znc" />;
}

export default Editor;
