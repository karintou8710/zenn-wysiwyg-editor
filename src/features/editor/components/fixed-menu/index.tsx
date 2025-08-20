import type { Editor } from "@tiptap/react";
import { Copy, Image, Info, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INITIAL_CONTENT } from "../../lib/initial-content";
import { markdownSerializer } from "../../lib/to_markdown";
import MarkdownPasteDialog from "../markdown-paste-dialog";

type Props = {
  editor: Editor;
  className?: string;
};

export default function FixedMenu({ editor, className }: Props) {
  if (!editor) return null;

  const handleInputImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      const { $from } = editor.state.selection;
      editor.chain().focus().insertFigureAt($from.pos, { src: url }).run();
    }
  };

  const handleTextCopy = () => {
    const text = markdownSerializer.serialize(editor.state.doc);
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });

    toast("マークダウンをクリップボードにコピーしました", {
      icon: <Info size={16} />,
      position: "bottom-center",
    });
  };

  const handleReplaceIntialContent = () => {
    const confirmed = window.confirm("初期コンテンツに戻しますか？");
    if (!confirmed) return;
    editor.commands.setContent(INITIAL_CONTENT);
  };

  return (
    <div className={cn("flex", className)}>
      <div className="flex gap-x-1">
        <Button size="icon" variant="outline" onClick={handleInputImage}>
          <Image />
        </Button>
        <MarkdownPasteDialog editor={editor} />
      </div>
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
