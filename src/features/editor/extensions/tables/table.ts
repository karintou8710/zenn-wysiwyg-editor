import { Table as TiptapTable } from "@tiptap/extension-table";
import { InputRule } from "@tiptap/react";

export const Table = TiptapTable.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^:::table(\d{1,2})-(\d{1,2})\s$/,
        handler: ({ match, range, chain }) => {
          const rows = parseInt(match[1], 10);
          const columns = parseInt(match[2], 10);

          if (rows === 0 || columns === 0 || rows > 20 || columns > 20) {
            return;
          }

          chain()
            .deleteRange({ from: range.from, to: range.to })
            .insertTable({
              rows,
              cols: columns,
              withHeaderRow: true,
            })
            .run();
        },
      }),
    ];
  },
});
