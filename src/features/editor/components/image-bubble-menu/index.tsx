import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { useEditorState, type Editor } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import AltPopover from "../alt-popover";

type Props = {
  editor: Editor;
};

export default function ImageBubbleMenu({ editor }: Props) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      let imagePos: number | undefined = undefined;
      let alt: string | undefined = undefined;
      const { selection } = editor.state;

      if (
        selection instanceof NodeSelection &&
        selection.node.type === editor.schema.nodes.figure
      ) {
        imagePos = selection.from + 1; // 選択は親のfigureノードなので、子のimageノードは+1
        alt = selection.node.firstChild!.attrs.alt;
      }

      return { imagePos, alt };
    },
  });

  const handleSetAlt = (alt: string) => {
    const { imagePos } = state;

    if (!imagePos) return;

    const { tr } = editor.state;

    tr.setNodeAttribute(imagePos, "alt", alt);
    editor.view.dispatch(tr);
  };

  return (
    <TiptapBubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 12 }}
      shouldShow={({ editor }) => {
        const { selection } = editor.state;

        if (!(selection instanceof NodeSelection)) {
          return false;
        }

        return selection.node.type === editor.schema.nodes.figure;
      }}
    >
      <div className="flex bg-white border-gray-200 border rounded p-1 gap-x-1 shadow">
        <AltPopover
          initialAlt={state.alt}
          setAlt={handleSetAlt}
          key={state.alt} // altが変更されたときにポップオーバーを再レンダリングして、initialAltが読み込まれるようにする
        />
      </div>
    </TiptapBubbleMenu>
  );
}
