import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { markdownSerializer } from "../../lib/markdown";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

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

    console.log(text);
  };

  return (
    <div className={cn("flex", className)}>
      <div className="grow" />
      <div>
        <Button size="icon" variant="outline" onClick={handleTextCopy}>
          <Copy />
        </Button>
      </div>
    </div>
  );
}
