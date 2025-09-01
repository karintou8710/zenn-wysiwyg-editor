import { useEditor } from "@tiptap/react";
import { extensions } from "./extensions";

type Props = {
  initialContent?: string;
  onChange?: (html: string) => void;
};

export function useZennEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    content: initialContent || "",
    extensions,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return editor;
}
