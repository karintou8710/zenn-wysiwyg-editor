import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { fromMarkdown } from "../../lib/from-markdown";

type Props = {
  editor: Editor;
};

export default function MarkdownPasteDialog({ editor }: Props) {
  const [text, setText] = useState("");

  const handleApplyMarkdown = () => {
    const html = fromMarkdown(text);
    editor.commands.setContent(html);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          M
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[780px] w-full">
        <DialogHeader>
          <DialogTitle>マークダウン適用</DialogTitle>
          <DialogDescription>
            Zenn記法のマークダウンをWYSIWYGエディタに対応するHTMLに変換して貼り付けます。
          </DialogDescription>
        </DialogHeader>
        <div className="w-full min-w-0">
          <Textarea
            className="h-60 w-full min-w-0"
            placeholder="ここにマークダウンを貼り付けてください"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleApplyMarkdown}>適用</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
