import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";

export const FileHandler = Extension.create({
  name: "fileHandler",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("fileHandler"),
        props: {
          handlePaste(_, event) {
            if (!event.clipboardData?.files.length) {
              return false;
            }

            event.preventDefault();
            event.stopPropagation();

            toast.error("ファイル貼り付けは現在サポートされていません", {
              icon: <CircleAlert size={16} className="text-destructive" />,
            });
            return true;
          },
        },
      }),
    ];
  },
});
