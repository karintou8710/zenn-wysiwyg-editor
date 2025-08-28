import { AlertCircleIcon } from "lucide-react";
import { Toaster } from "sonner";
import { Alert, AlertDescription } from "./components/ui/alert";
import Editor from "./features/editor/editor";
import usePageTracking from "./hooks/use-page-tracking";

function App() {
  usePageTracking();

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
      <Editor />
      <Toaster />
    </div>
  );
}

export default App;
