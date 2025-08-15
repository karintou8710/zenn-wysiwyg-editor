import LakeImage from "@/assets/sikotuko.jpeg";

export const INITIAL_CONTENT = `
<p>
    Zennの記事を<b>WYSIWYGエディタ</b>で執筆することができます。<br/>
    ショートカット記法を使うことで、Markdownのように簡単に記事を編集可能です。
</p><zenn-message data-type="alert">
    <p data-message-content>現在は<b>コンテンツの保存</b>に対応してません。<br/>再読み込みをすると作成途中の文書が破棄されます。</p>
</zenn-message>
<h2>段落</h2>
<p><code>Enter</code>で新たな段落を生成します。</p>
<p><code>Shift + Enter</code>は段落内での改行を挿入します。<br/>見た目は改行の方が余白が小さいです。</p>
<h2>見出し</h2>
<blockquote>
<p># 見出し1<br/>
## 見出し2<br/>
### 見出し3<br/>
#### 見出し4</p>
</blockquote>
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
<blockquote>
<p>![alt](src)</p>
</blockquote>
<p data-figure>
<img src="${LakeImage}" alt="支笏湖">
<em>支笏湖</em>
</p>
<h2>コードブロック</h2>
<p>
右上に選択中の言語が表示されます。ファイル名は後から編集可能です。<br/>
ファイル名は空であれば、マークダウンに出力されません。
</p>
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
<p>\`\`\`diff-lang</p>
</blockquote>
<div data-code-block>
<div data-code-file-name>example.ts</div>
<pre><code class="language-diff-typescript">+ let a = 1;
- let b = 2;</code></pre></div>
<h2>引用</h2>
<blockquote>
<p>> text</p>
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
