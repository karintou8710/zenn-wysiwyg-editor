import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { EditorContent, useZennEditor } from "zenn-wysiwyg-editor";
import { Alert, AlertDescription } from "./components/ui/alert";
import usePageTracking from "./hooks/use-page-tracking";


import "zenn-wysiwyg-editor/style.css";

function App() {
  usePageTracking();

  const [content, setContent] = useState("<p>Hello, Zenn!</p>");
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
      <EditorContent editor={editor} />
    </div>
  );
}

export default App;
