import { Editor, EditorContent as TiptapEditorContent } from "@tiptap/react";
import DragHandle from "src/extensions/functionality/drag-handle";

type Props = {
    editor: Editor
}

export default function EditorContent({ editor }: Props) {
    return <>
    <DragHandle editor={editor} />
    <TiptapEditorContent editor={editor} className="znc" />
    </>
}