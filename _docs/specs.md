要件定義
以下が要件定義です。

1. アプリ概要
項目	内容
アプリ名	my-natto
目的	冷蔵庫の納豆残数を管理し、外出先から確認・買い忘れ防止
形態	PWA（フロントエンドのみで完結）
ターゲット	個人利用（単一端末）
2. 機能要件
2.1 カウント管理
残数は0以上の整数
初期値: 0
「買ったよ」ボタン → +3
「食べたよ」ボタン → -1（0未満にはならない）
localStorage キー natto-count で永続化
2.2 通知
残数が 1になった瞬間 にNotification APIで通知
条件: 変更前の値が2以上 → 変更後の値が1
文言: 「納豆が残り1つです。そろそろ買いましょう」
初回操作時にNotification許可をリクエスト
2.3 UI仕様
レイアウト: 画面中央に納豆イラスト＋残数オーバーレイ、下部に2ボタン
納豆イラスト: SVGインライン、彩度低め単色系
数字: イラスト中央に大きく表示
残数3以上 → 黒 (#333)
残数2以下 → 赤 (#E53935)
トンマナ: 大人向けPOPかわいい、ミニマル、余白多め
フォント: システムフォント（丸ゴシック系優先）
3. 非機能要件
項目	内容
PWA	manifest.json + Service Worker でホーム画面追加・オフライン動作
言語	TypeScript（ビルドツールなし、tsc のみ）
データ永続化	localStorage
対応ブラウザ	モダンブラウザ（Chrome / Safari / Firefox）
ビルド	tsc でコンパイル → 静的ファイル配信
4. ファイル構成
/
├── src/
│   └── app.ts          # メインロジック
├── index.html          # エントリポイント
├── style.css           # スタイル
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── icons/
│   ├── icon-192.png    # PWA用アイコン
│   └── icon-512.png    # PWA用アイコン
├── tsconfig.json
├── package.json
└── README.md

5. 今回スコープ外
食べた履歴
Apple Watch連携
バックエンド / DB
ユーザー認証