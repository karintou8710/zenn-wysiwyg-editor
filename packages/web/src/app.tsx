import "zenn-wysiwyg-editor/dist/style.css";

import { AlertCircleIcon } from "lucide-react";
import { Toaster } from "sonner";
import { EditorContent, useZennEditor } from "zenn-wysiwyg-editor";
import FixedMenu from "./components/editor/fixed-menu";
import { Alert, AlertDescription } from "./components/ui/alert";
import { CONTENT_KEY, useLocalStorage } from "./hooks/use-local-storage";
import usePageTracking from "./hooks/use-page-tracking";

function App() {
  usePageTracking();

  const [content, setContent] = useLocalStorage(CONTENT_KEY, "");
  const editor = useZennEditor({
    initialContent: content,
    onChange: (content) => {
      setContent(content);
    },
  });

  return (
    <div className="mt-10 max-w-[800px] mx-auto">
      <div className="mb-6">
        <Alert variant="default">
          <AlertCircleIcon />
          <AlertDescription>
            情報共有コミュニティ Zenn の WYSIWYG エディターです。
            <br />
            <a
              href="https://zenn.dev/karintou/articles/eabe0354fcc947"
              className="underline text-blue-500"
              target="_blank"
              rel="noreferrer"
            >
              使い方はこちら
            </a>
          </AlertDescription>
        </Alert>
      </div>
      <div>
        <FixedMenu editor={editor} className="mb-2" />
        <EditorContent editor={editor} />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
