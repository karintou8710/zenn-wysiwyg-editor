import LakeImage from "@/assets/sikotuko.jpeg";

export const INITIAL_CONTENT = `
<p>
    Zennの記事をWYSIWYGエディタで執筆することができます。<br/>
    ショートカット記法を使うことで、Markdownのように簡単に記事を編集可能です。
</p><zenn-message>
    <p data-message-content>現在はコンテンツの保存に対応してません。<br/>再読み込みをすると作成途中の文書が破棄されます。</p>
</zenn-message>
<h2>見出し</h2>
<div data-code-block>
<div data-code-file-name>heading</div>
<pre># 見出し1
## 見出し2
### 見出し3
#### 見出し4</pre></div>
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
<p>画像のアップロードは対応してません。先にZennにアップロードしてからURLで指定してください。</p>
<p data-figure>
<img src="${LakeImage}" alt="支笏湖">
<em>支笏湖</em>
</p>
<h2>コードブロック</h2>
<p>右上に選択中の言語が表示されます。ファイル名は後から編集可能です。</p>
<blockquote>
<p>\`\`\`</p>
</blockquote>
<blockquote>
<p>\`\`\`lang</p>
</blockquote>
<blockquote>
<p>\`\`\`lang:filename</p>
</blockquote>
<div data-code-block>
<div data-code-file-name>example.ts</div>
<pre><code class="language-typescript">const greeting = (name: string) => {
  return \`Hello, \${name}!\`;
};
console.log(greeting("World"));</code></pre></div>
<h3>diff対応</h3>
<p>言語名の先頭に<code>diff-</code>をつけてください。</p>
<blockquote>
<p>\`\`\`diff-typescript</p>
</blockquote>
<div data-code-block>
<div data-code-file-name>example.ts</div>
<pre><code class="language-diff-typescript">+ let a = 1;
- let b = 2;</code></pre></div>
<h2>引用</h2>
<blockquote>
<p>引用文です。</p>
</blockquote>
<h2>メッセージ</h2>
<blockquote>
<p>:::message</p>
</blockquote>
<zenn-message>
    <p data-message-content>Message</p>
</zenn-message>
<p></p>
<blockquote>
<p>:::alert</p>
</blockquote>
<zenn-message data-type="alert">
    <p data-message-content>Alert</p>
</zenn-message>
`;
