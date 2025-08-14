// @ts-ignore
import "zenn-content-css";
import "./editor.css";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "./extensions/heading";
import { UndoRedo, TrailingNode, Placeholder } from "@tiptap/extensions";
import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
import FixedMenu from "./components/fixed-menu";
import { Link } from "./extensions/link";
import Blockquote from "@tiptap/extension-blockquote";
import HorizentalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import { Message } from "./extensions/message";
import HardBreak from "@tiptap/extension-hard-break";
import { MessageContent } from "./extensions/message/message-content";
import { PrismCodeBlock } from "./extensions/prism-code-block";
import Image from "./extensions/image";
import { Caption } from "./extensions/caption";
import Figure from "./extensions/figure";
import SikoTuKoImage from "@/assets/sikotuko.jpeg";
import { TableKit } from "@tiptap/extension-table";

function Editor() {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      UndoRedo,
      TrailingNode,
      Placeholder.configure({
        placeholder: "ここに入力",
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        autolink: false,
      }),
      Blockquote,
      HorizentalRule,
      Bold,
      Italic,
      Strike,
      Code,
      Message,
      MessageContent,
      HardBreak,
      PrismCodeBlock,
      Figure,
      Image.configure({
        HTMLAttributes: {
          class: "md-img",
        },
      }),
      Caption,
      TableKit,
    ],
    content: `
      <p>Hello World!</p>
      <zenn-message data-type="message"><p data-message-content>Message</p></zenn-message>
      <zenn-message data-type="alert"><p data-message-content>Alert</p></zenn-message>
      <pre><code class="language-python">print("Hello, Python!")</code></pre>
      <pre><code class="language-ts">const great = () => {
  console.log("Awesome");
};</code></pre>
      <p data-figure>
        <img src=${SikoTuKoImage} alt="Example Image" />
        <em data-caption>Example Image Caption</em>
      </p>
      <table>
        <tbody>
          <tr>
            <th>Head</th>
            <th>Head</th>
          </tr>
          <tr>
            <td>Cell</td>
            <td>Cell</td>
          </tr>
        </tbody>
      </table>
    `,
  });

  return (
    <>
      <FixedMenu editor={editor} className="mb-4" />
      <EditorContent editor={editor} className="znc" />
    </>
  );
}

export default Editor;
