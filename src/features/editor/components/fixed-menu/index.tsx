import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { markdownSerializer } from "../../lib/markdown";
import { Copy, Image } from "lucide-react";
import { cn } from "@/lib/utils";

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
      editor.chain().focus().insertFigure($from.pos, { src: url }).run();
    }
  };

  const handleTextCopy = () => {
    const text = markdownSerializer.serialize(editor.state.doc);
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });

    console.log(text);
  };

  return (
    <div className={cn("flex", className)}>
      <div>
        <Button size="icon" variant="outline" onClick={handleInputImage}>
          <Image />
        </Button>
      </div>
      <div className="grow" />
      <div>
        <Button size="icon" variant="outline" onClick={handleTextCopy}>
          <Copy />
        </Button>
      </div>
    </div>
  );
}
