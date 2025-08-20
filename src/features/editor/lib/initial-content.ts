import LakeImage from "@/assets/sikotuko.jpeg";

export const INITIAL_CONTENT = `
<p>
    Zennの記事を<b>WYSIWYGエディタ</b>で執筆することができます。<br/>
    ショートカット記法を使うことで、Markdownのように簡単に記事を編集可能です。
</p>
<aside class="msg alert">
    <div class="msg-content">
        <p>現在は開発途中であり、<b>アップデートにより文書構造が変更される可能性がある</b>ため、大事な文書は書き終えた後にコピーを取ることをお勧めします。</p>
    </div>
</aside>

<h2>段落</h2>
<p><code>Enter</code>で新たな段落を生成します。</p>
<p><code>Shift + Enter</code>は段落内での改行を挿入します。<br/>見た目は改行の方が余白が小さいです。
<h2>見出し</h2>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
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
<p>
    <b>画像のアップロードは対応してません。</b><br/>他サイト(Zennなど)で一度アップロードしてから、「画像のコピー」または「画像のアドレスをコピー」を行い、貼り付けてください。
</p>
<p>キャプションは空であれば、マークダウンに出力されません。</p>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">![alt](src)
url(貼り付け)</code>
</pre>
</div>
<p data-figure>
<img src="${location.origin + LakeImage}" alt="支笏湖">
<em>支笏湖</em>
</p>

<h2>コードブロック</h2>
<p>
右上に選択中の言語が表示されます。ファイル名は後から編集可能です。<br/>
ファイル名は空であれば、マークダウンに出力されません。
</p>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">\`\`\`
\`\`\`lang
\`\`\`lang:filename</code>
</pre>
</div>
<div class="code-block-container">
<div class="code-block-filename-container">example.ts</div>
<pre><code class="language-typescript">const greeting = (name: string) => {
  return \`Hello, \${name}!\`;
};
console.log(greeting("World"));</code></pre></div>
<h3>diff対応</h3>
<p>言語名の先頭に<code>diff-</code>をつけてください。</p>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">\`\`\`diff-lang</code>
</pre>
</div>
<div class="code-block-container">
<div class="code-block-filename-container">example.ts</div>
<pre><code class="diff-highlight language-diff-c"><span>--- test.c.orig 2019-04-18 21:45:33.000000000 +0900</span>
<span>+++ test.c      2019-04-18 21:45:07.000000000 +0900</span>
<span>@@ -1,4 +1,5 @@</span>
<span> #include <stdio.h></span>
<span></span>
<span> int main(void) {</span>
<span>-  printf("Hello, World!\\n");</span>
<span>+  puts("Hello, World!");</span>
<span> }</span></code></pre></div>

<h2>引用</h2>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">> text</code>
</pre>
</div>

<blockquote>
<p>引用テキスト</p>
</blockquote>

<h2>テキストリンク</h2>
<p>範囲選択時にURLを貼り付けると自動的に変換されます。</p>
<a href="https://zenn.dev/karintou/articles/1ba996a5ca7df8">zennへのリンク</a>

<h2>水平線</h2>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">---</code>
</pre>
</div>
<hr />

<h2>メッセージ</h2>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">:::message</code>
</pre>
</div>
<aside class="msg">
    <div class="msg-content"><p>Message</p></div>
</aside>
<p></p>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">:::alert</code>
</pre>
</div>
<aside class="msg alert">
    <div class="msg-content"><p>Alert</p></div>
</aside>

<h2>アコーディオン</h2>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
<pre>
<code class="language-plaintext">:::details</code>
</pre>
</div>
<details>
<summary>アコーディオンのタイトル</summary>
<div class="details-content">アコーディオンの内容</div>
</details>

<h2>インラインスタイル</h2>
<div class="code-block-container">
<div class="code-block-filename-container"></div>
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
<span class="embed-block zenn-embedded zenn-embedded-card">
    <iframe data-content="https://zenn.dev/zenn/articles/markdown-guide"></iframe>
</span>

<h3>ツイート</h3>
<span class="embed-block zenn-embedded zenn-embedded-tweet">
    <iframe data-content="https://x.com/karintou74073/status/1956364047462654082"></iframe>
</span>

<h3>GitHub</h3>
<span class="embed-block zenn-embedded zenn-embedded-github">
    <iframe data-content="https://github.com/karintou8710/zenn-wysiwyg-editor/blob/main/src/features/editor/extensions/message/index.ts"></iframe>
</span>

<h3>Gist</h3>
<span class="embed-block zenn-embedded zenn-embedded-gist">
    <iframe data-content="https://gist.github.com/flatsato/4282769a4f181c6810aa"></iframe>
</span>

<h3>CodePen</h3>
<span class="embed-block embed-codepen">
    <iframe src="https://codepen.io/karintou8710/pen/yyYpRgB"></iframe>
</span>

<h3>JSFiddle</h3>
<span class="embed-block embed-jsfiddle">
    <iframe src="https://jsfiddle.net/zhj7crkn/6/"></iframe>
</span>

<h3>CodeSandbox</h3>
<span class="embed-block embed-codesandbox">
    <iframe src="https://codesandbox.io/embed/885dz3?view=editor+%2B+preview&module=%2Findex.html"></iframe>
</span>

<h3>StackBlitz</h3>
<span class="embed-block embed-stackblitz">
    <iframe src="https://stackblitz.com/edit/react-basic-example?file=index.js"></iframe>
</span>

<h3>Youtube</h3>
<span class="embed-block embed-youtube">
    <iframe src="https://www.youtube.com/watch?v=DTpGfpLybr0"></iframe>
</span>

<h2>対応状況・バグ報告</h2>
<p><a href="https://github.com/karintou8710/zenn-wysiwyg-editor">GitHubのレポジトリ</a>をご確認ください。</p>
`;
