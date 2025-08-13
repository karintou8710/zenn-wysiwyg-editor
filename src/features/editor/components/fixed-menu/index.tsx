import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";

type Props = {
  editor: Editor;
  className?: string;
};

export default function FixedMenu({ editor, className }: Props) {
  if (!editor) return null;

  const handleTextCopy = () => {
    const text = editor.getText();
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });

    console.log(text);
  };

  return (
    <div className={className}>
      <Button onClick={handleTextCopy}>Copy</Button>
    </div>
  );
}
