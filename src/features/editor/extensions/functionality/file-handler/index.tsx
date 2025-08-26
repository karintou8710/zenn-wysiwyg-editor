import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";
import { showToast } from "@/lib/toast";

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

            showToast("ファイル貼り付けは現在サポートされていません", "error");
            return true;
          },
        },
      }),
    ];
  },
});
