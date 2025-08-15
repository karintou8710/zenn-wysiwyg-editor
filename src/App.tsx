import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import Editor from "./features/editor/editor";

function App() {
  return (
    <div className="mt-10 max-w-[800px] mx-auto">
      <div className="mb-6">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>
            現在は開発途中なため、アップデートにより内部構造が崩れてしまう可能性があります。
            <br />
            大事な文書は書き終えた後にコピーを取ることをお勧めします。
          </AlertDescription>
        </Alert>
      </div>
      <Editor />
    </div>
  );
}

export default App;
