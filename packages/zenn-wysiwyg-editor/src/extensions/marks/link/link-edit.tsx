import { Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useId, useState } from "react";

type Props = {
  href: string;
  handleDelete?: () => void;
  handleSave?: (href: string) => void;
  handleMouseLeave?: (e: MouseEvent) => void;
};

export default ({
  href,
  handleDelete,
  handleSave,
  handleMouseLeave,
}: Props) => {
  const inputId = useId();
  const [link, setLink] = useState(href);

  return (
    <div
      role="dialog"
      aria-label="リンクの編集"
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
    >
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-500 mb-1"
        >
          リンク
        </label>
        <input
          id={inputId}
          type="text"
          name="href"
          placeholder="https://example.com"
          className="w-[300px] text-xs"
          defaultValue={href}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div className="flex justify-between mt-4">
        <button type="button" onClick={() => handleDelete?.()}>
          <Trash2 className="text-red-500" />
        </button>

        <button type="button" onClick={() => handleSave?.(link)}>
          保存
        </button>
      </div>
    </div>
  );
};
