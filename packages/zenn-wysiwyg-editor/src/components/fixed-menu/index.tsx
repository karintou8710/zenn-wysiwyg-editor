import type { Editor } from "@tiptap/react";
import { Copy, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { INITIAL_CONTENT } from "../../lib/initial-content";
import { markdownSerializer } from "../../lib/to-markdown";

type Props = {
  editor: Editor;
  className?: string;
};

export default function FixedMenu({ editor, className }: Props) {
  if (!editor) return null;

  const handleTextCopy = () => {
    const text = markdownSerializer.serialize(editor.state.doc);
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });

    showToast("マークダウンをクリップボードにコピーしました");
  };

  const handleReplaceIntialContent = () => {
    const confirmed = window.confirm("初期コンテンツに戻しますか？");
    if (!confirmed) return;
    editor.commands.setContent(INITIAL_CONTENT);
  };

  return (
    <div className={cn("flex", className)}>
      <div className="grow" />
      <div className="flex gap-x-1">
        <Button
          size="icon"
          variant="outline"
          onClick={handleReplaceIntialContent}
        >
          <TimerReset />
        </Button>
        <Button size="icon" variant="outline" onClick={handleTextCopy}>
          <Copy />
        </Button>
      </div>
    </div>
  );
}
