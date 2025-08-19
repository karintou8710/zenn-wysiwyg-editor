import { Heading as TiptapHeading } from "@tiptap/extension-heading";
import { splitBlockAs } from "@tiptap/pm/commands";

const Heading = TiptapHeading.extend({
  addKeyboardShortcuts() {
    return {
      // @ts-expect-error: https://github.com/ueberdosis/tiptap/issues/6670
      ...this.parent?.(),

      Backspace: () => {
        const { selection } = this.editor.state;
        const { $from } = selection;
        if ($from.node().type.name !== this.name) return false;

        if (!selection.empty || $from.start() !== $from.pos) return false;

        return this.editor.commands.setParagraph();
      },
      Enter: () => {
        const { selection } = this.editor.state;
        const { $from } = selection;
        if ($from.node().type.name !== this.name) return false;
        if ($from.start() === $from.pos) return false;

        return splitBlockAs(() => {
          return {
            type: this.editor.schema.nodes.paragraph,
          };
        })(this.editor.state, this.editor.view.dispatch);
      },
    };
  },
});

export default Heading;
