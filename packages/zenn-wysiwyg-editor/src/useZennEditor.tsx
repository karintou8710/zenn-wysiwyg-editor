import { useEditor } from "@tiptap/react";
import { extensions } from "./extensions";

type Props = {
  content?: string;
  onChange?: (html: string) => void;
};

function useZennEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return editor;
}

export default useZennEditor;
