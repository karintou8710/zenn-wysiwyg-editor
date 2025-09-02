import type { Editor } from "@tiptap/react";
import { Copy } from "lucide-react";
import { renderMarkdown } from "zenn-wysiwyg-editor";
import { showToast } from "../../lib/toast";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

type Props = {
  editor: Editor;
  className?: string;
};

export default function FixedMenu({ editor, className }: Props) {
  if (!editor) return null;

  const handleTextCopy = () => {
    const markdown = renderMarkdown(editor.state.doc);
    navigator.clipboard.writeText(markdown).catch((err) => {
      console.error("Failed to copy text: ", err);
    });

    showToast("マークダウンをクリップボードにコピーしました");
  };

  return (
    <div className={cn("flex", className)}>
      <div className="grow" />
      <div className="flex gap-x-1">
        <Button size="icon" variant="outline" onClick={handleTextCopy}>
          <Copy />
        </Button>
      </div>
    </div>
  );
}
