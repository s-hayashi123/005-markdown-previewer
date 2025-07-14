# 【React & TypeScript & Tailwind CSS】リアルタイムMarkdownプレビューア開発チュートリアル (005)

このチュートリアルでは、`web-dev-100-challenge`の課題`005`に基づき、React, TypeScript, そしてTailwind CSSを使用してMarkdownリアルタイムプレビューアを作成する手順を、初学者の方にも分かりやすく解説します。

完成形をただ模写するのではなく、「なぜこのコードが必要か」「どう動いているのか」を理解しながら、実践的なスキルを身につけていきましょう。

## 🎯 課題の確認

最初に、`005-markdown-previewer.md`で定義されている要件と学習ポイントを再確認します。

- **主要機能**: Markdownの入力と、そのリアルタイムプレビュー表示
- **技術スタック**: React, TypeScript, Vite, Tailwind CSS, `react-markdown`
- **学習ポイント**: `useState`フック、外部ライブラリの導入、Tailwind CSSによるスタイリング

---

## 開発ステップ

### Step 0: 開発環境の準備

Viteを使って、React + TypeScriptのプロジェクトを素早く立ち上げます。

1.  ターミナルを開き、プロジェクトを作成したいディレクトリに移動して、以下のコマンドを実行します。

    ```bash
    npm create vite@latest 005-markdown-previewer -- --template react-ts
    ```

2.  作成されたプロジェクトフォルダに移動し、開発に必要なパッケージをインストールします。

    ```bash
    cd 005-markdown-previewer
    npm install
    ```

### Step 1: Tailwind CSSのセットアップ

次に、モダンなCSSフレームワークであるTailwind CSSをプロジェクトに導入します。

1.  Tailwind CSSとその関連パッケージをインストールします。

    ```bash
    npm install tailwindcss @tailwindcss/vite
    ```

3.  vite.config.jsを開き、Tailwindがどのファイルに適用されるべきかを設定します。

    ```javascript
 import { defineConfig } from 'vite'import tailwindcss from '@tailwindcss/vite'export default defineConfig({ plugins: [ tailwindcss(), ],})
    ```

5.  `src/App.css`は不要になるので削除してください。

### Step 2: 必要なライブラリのインストール

今回の主役である、MarkdownをHTMLに変換するためのライブラリと、Markdownの表示を美しくするためのTailwindプラグインをインストールします。

1.  ターミナルで以下のコマンドを実行します。

    ```bash
    npm install react-markdown remark-gfm
    npm install -D @tailwindcss/typography
    ```

    - **`react-markdown`**: Markdown文字列をReactコンポーネントに変換するメインライブラリ。
    - **`remark-gfm`**: テーブルや打ち消し線といったGitHub Flavored Markdown (GFM) をサポートするプラグイン。
    - **`@tailwindcss/typography`**: `prose`というクラスを適用するだけで、Markdownから生成されたHTMLを見やすくスタイリングしてくれる非常に便利なプラグインです。

2.  `tailwind.config.js`を再度開き、`typography`プラグインを有効にします。

    ```javascript
    /** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [
        require('@tailwindcss/typography'), // この行を追加
      ],
    }
    ```

### Step 3: アプリの骨格と状態管理

`App.tsx`を編集して、アプリケーションのレイアウトと、ユーザーが入力するMarkdownテキストを管理する「状態（state）」を準備します。

1.  `src/App.tsx` を開き、既存のコードをすべて削除して、以下の様に書き換えます。

    ```tsx
    // src/App.tsx
    import { useState } from 'react';
    import ReactMarkdown from 'react-markdown';
    import remarkGfm from 'remark-gfm';

    // 初期表示用のサンプルMarkdownテキスト（表示の不具合を修正）
    const sampleMarkdown = `# Welcome to my Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.
`;

    function App() {
      const [markdownText, setMarkdownText] = useState<string>(sampleMarkdown);

      return (
        <div className="flex h-screen bg-gray-100">
          <textarea
            className="w-1/2 h-full p-4 text-base font-mono bg-white border-r border-gray-300 focus:outline-none"
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
          />
          <div className="w-1/2 h-full p-4 overflow-y-auto">
            <article className="prose lg:prose-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownText}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      );
    }

    export default App;
    ```
    **コード解説:**
    - **レイアウト**: `flex h-screen`で全画面のFlexboxコンテナを作成し、`w-1/2`で左右のエリアを50%幅に分割しています。
    - **`useState`**: `markdownText`という状態でユーザーの入力を管理します。この値が変わると、Reactが画面を自動で再描画します。
    - **`<ReactMarkdown>`**: `markdownText`を解釈し、HTML要素に変換します。`remarkPlugins={[remarkGfm]}`でGFMを有効化しています。
    - **`<article className="prose lg:prose-xl">`**: ここがポイントです。`@tailwindcss/typography`プラグインを有効にしたことで、`prose`クラスをつけた要素内のHTMLタグ（h1, p, ul, codeなど）が自動的に美しくスタイリングされます。

2.  開発サーバーを起動（または再起動）します。

    ```bash
    npm run dev
    ```

これで、Tailwind CSSでスタイリングされた、Markdownリアルタイムプレビューアが完成しているはずです！

---

### 📚 深掘りコラム: なぜ `react-markdown` を使うのか？

MarkdownをHTMLに変換するライブラリには、`marked`のようなものもあります。しかし、React開発では`react-markdown`が推奨されます。なぜでしょうか？

- **`marked`の場合:**
  `marked`はMarkdown文字列を**HTML文字列**に変換します。ReactでこのHTML文字列を表示するには、`dangerouslySetInnerHTML`というプロパティを使う必要があります。
  ```jsx
  <div dangerouslySetInnerHTML={{ __html: generatedHtmlString }} />
  ```
  名前が示す通り、この方法は「危険」を伴います。ユーザーが入力した内容に悪意のあるスクリプト（XSS攻撃）が含まれていた場合、それがそのまま実行されてしまう可能性があるからです。これを使う場合は、`DOMPurify`のようなサニタイズ（無害化）ライブラリが別途必須になります。

- **`react-markdown`の場合:**
  `react-markdown`は、MarkdownをHTML文字列ではなく、**Reactコンポーネント**に変換します。これにより、`dangerouslySetInnerHTML`を使わずに安全にコンテンツを描画できます。Reactの仮想DOM内で処理が完結するため、本質的にXSS攻撃のリスクが低減されます。

**結論:** 安全性とReactとの親和性の高さから、`react-markdown`を選択するのがベストプラクティスです。

## 🏆 完成！

お疲れ様でした！これでモダンな技術スタックを使ったMarkdownリアルタイムプレビューアが完成しました。この課題を通して、以下のことを学びました。

- `useState`を使ったインタラクティブな状態管理
- 外部ライブラリ (`react-markdown`) のインストールと基本的な使い方
- Tailwind CSSのセットアップとユーティリティクラスによるスタイリング
- `@tailwindcss/typography`プラグインによるMarkdownコンテンツの簡単なスタイリング
- XSS攻撃に関する基本的なセキュリティ意識

## 🚀 挑戦課題

さらにスキルアップするために、以下の機能追加に挑戦してみましょう！

- **Easy:** テキストエリアの入力内容を`localStorage`に保存し、リロードしても内容が消えないようにする。
- **Medium:** `react-syntax-highlighter`ライブラリを組み合わせて、コードブロックにシンタックスハイライトを適用する。（`prose`クラスのスタイルと競合する可能性があるので、少し工夫が必要です）
- **Hard:** ヘッダー部分にボタンを追加し、エディタのみ、プレビューのみ、分割表示、の3つのレイアウトモードを切り替えられるようにする。