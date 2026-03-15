# LINEスタンプ プロンプト工房

AI画像生成（DALL-E 3, Midjourney等）で使えるLINEスタンプ用プロンプトを簡単に生成するWebツールです。

## 機能

- **セリフ・キャラクター設定**: 10種類のキャラクタータイプから選択（標準、丁寧、関西弁、博多弁、推し活、ギャル、筋肉、シュール、昭和、恋人）
- **デザインテイスト**: 70種類以上のスタイルから複数選択・組み合わせ可能
- **カスタム入力**: セリフとデザインスタイルの自由入力に対応
- **ワンクリックコピー**: 生成されたプロンプトをそのままAIツールに貼り付け可能

## 技術スタック

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react

## ローカル開発

```bash
npm install
npm run dev
```

## デプロイ

Vercelに接続してデプロイ:

1. GitHubにpush
2. [Vercel](https://vercel.com) でリポジトリをインポート
3. Framework Preset: **Vite** を選択
4. デプロイ実行

## ライセンス

MIT
