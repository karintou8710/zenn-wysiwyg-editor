# zenn-wysiwyg-editor

Zenn の記事を WYSIWYG で編集可能なエディタです（非公式）  
編集後はコピーボタンで対応するマークダウンのエクスポートが可能となります。

## 利用方法

サービスの利用方法は以下の記事で紹介しています。

https://zenn.dev/karintou/articles/eabe0354fcc947

## 機能

ノード

- [x] 見出し
- [x] リスト
- [x] 引用
- [x] 区切り線
- [x] コードブロック(コード対応)
  - [x] Prism のハイライト
  - [x] ファイル名
  - [x] 言語の表示
  - [x] diff
- [x] 画像
  - [x] alt
  - [x] キャプション
  - [ ] 横幅設定
  - [ ] リンク画像
- [x] テキストリンク
- [ ] テーブル
- [ ] 脚注
- [ ] 数式

マーク

- [x] イタリック
- [x] 太字
- [x] 打ち消し線
- [x] インラインコード

Zenn 独自ノード

- [x] メッセージ
- [x] アコーディオン

埋め込み

- [x] リンクカード
- [x] X（Twitter）のポスト
- [x] GitHub
- [x] GitHub Gist
- [x] YouTube
- [x] CodePen
- [x] JSFiddle
- [x] CodeSandbox
- [x] StackBlitz
- [x] SpeakerDeck
- [x] Figma
- [x] Docswell
- [ ] SlideShare

機能

- [x] DragHandle の実装
- [x] マークダウン出力
- [x] マークダウンのペースト対応

## 参考

- https://zenn.dev/zenn/articles/markdown-guide
- https://github.com/zenn-dev/zenn-editor
