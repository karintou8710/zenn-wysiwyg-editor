import LakeImage from "@/assets/sikotuko.jpeg";

export const INITIAL_CONTENT = `
<p>
    Zennの記事を<b>WYSIWYGエディタ</b>で執筆することができます。<br/>
    ショートカット記法を使うことで、Markdownのように簡単に記事を編集可能です。
</p>
<aside data-message data-type="alert">
    <p data-message-content>
        現在は開発途中であり、<b>アップデートにより文書構造が変更される可能性がある</b>ため、大事な文書は書き終えた後にコピーを取ることをお勧めします。
    </p>
</aside>

<h2>段落</h2>
<p><code>Enter</code>で新たな段落を生成します。</p>
<p><code>Shift + Enter</code>は段落内での改行を挿入します。<br/>見た目は改行の方が余白小さいです。</p>
<h2>見出し</h2>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext"># 見出し1
## 見出し2
### 見出し3
#### 見出し4</code>
</pre>
</div>

<h2>リスト</h2>
<p>マークダウン記法でリストを作成できます。</p>
<h3>順序なしリスト</h3>
<ul>
<li><p>リスト1</p></li>
<li><p>リスト2</p></li>
<li><p>リスト3</p></li>
</ul>
<h3>順序ありリスト</h3>
<ol>
<li><p>リスト1</p></li>
<li><p>リスト2</p></li>
<li><p>リスト3</p></li>
</ol>

<h2>画像</h2>
<p>画像のアップロードは対応してません。別サイトにアップロードしてからURLで指定してください。<br/>
キャプションは空であれば、マークダウンに出力されません。</p>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">![alt](src)</code>
</pre>
</div>
<p data-figure>
<img src="${LakeImage}" alt="支笏湖">
<em>支笏湖</em>
</p>

<h2>コードブロック</h2>
<p>
右上に選択中の言語が表示されます。ファイル名は後から編集可能です。<br/>
ファイル名は空であれば、マークダウンに出力されません。
</p>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">\`\`\`
\`\`\`lang
\`\`\`lang:filename</code>
</pre>
</div>
<div data-code-block>
<div data-code-file-name>example.ts</div>
<pre><code class="language-typescript">const greeting = (name: string) => {
  return \`Hello, \${name}!\`;
};
console.log(greeting("World"));</code></pre></div>
<h3>diff対応</h3>
<p>スタイルが完全に適用されないバグが残っています。</p>
<p>言語名の先頭に<code>diff-</code>をつけてください。</p>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">\`\`\`diff-lang</code>
</pre>
</div>
<div data-code-block>
<div data-code-file-name>example.ts</div>
<pre><code class="language-diff-typescript">console.log("Hello, World!");
- let a = 1;
+ let b = 2;</code></pre></div>

<h2>引用</h2>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">> text</code>
</pre>
</div>

<blockquote>
<p>引用テキスト</p>
</blockquote>

<h2>水平線</h2>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">---</code>
</pre>
</div>
<hr />

<h2>メッセージ</h2>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">:::message</code>
</pre>
</div>
<aside data-message>
    <p data-message-content>Message</p>
</aside>
<p></p>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">:::alert</code>
</pre>
</div>
<aside data-message data-type="alert">
    <p data-message-content>Alert</p>
</aside>

<h2>インラインスタイル</h2>
<div data-code-block>
<div data-code-file-name></div>
<pre>
<code class="language-plaintext">**bold**
*斜体*
~~取り消し線~~
\`コード\`</code>
</pre>
</div>
<p><b>太字</b></p>
<p><i>斜体</i></p>
<p><s>取り消し線</s></p>
<p><code>コード</code></p>

<h2>埋め込み</h2>

<p>埋め込み要素はURLを貼り付けると自動的に変換されます</p>

<h3>リンクカード</h3>
<p data-embed-link-card data-url="https://zenn.dev/zenn/articles/markdown-guide"></p>

<h3>ツイート</h3>
<p data-embed-tweet data-url="https://x.com/karintou74073/status/1956364047462654082"></p>

<h3>GitHub</h3>
<p data-embed-github data-url="https://github.com/karintou8710/zenn-wysiwyg-editor/blob/main/src/features/editor/extensions/message/index.ts"></p>

<h3>Gist</h3>
<p data-embed-gist data-url="https://gist.github.com/flatsato/4282769a4f181c6810aa"></p>

<h3>CodePen</h3>
<p data-embed-codepen data-url="https://codepen.io/rcyou/pen/QEObEZ"></p>

<h3>JSFiddle</h3>
<p data-embed-jsfiddle data-url="https://jsfiddle.net/macloo/bvwvd0ao/"></p>

<h3>CodeSandbox</h3>
<p data-embed-codesandbox data-url="https://codesandbox.io/embed/885dz3?view=editor+%2B+preview&module=%2Findex.html"></p>

<h3>StarBlitz</h3>
<p data-embed-stackblitz data-url="https://stackblitz.com/edit/react-basic-example?file=index.js"></p>

<h3>Youtube</h3>
<p data-embed-youtube data-url="https://www.youtube.com/watch?v=DTpGfpLybr0"></p>

<h2>対応状況・バグ報告</h2>
<p><a href="https://github.com/karintou8710/zenn-wysiwyg-editor">GitHubのレポジトリ</a>をご確認ください。</p>
`;
