"use strict";
/** localStorage に保存する際のキー */
const STORAGE_KEY = "natto-count";
/** 「買ったよ」ボタン押下時に加算する個数 */
const ADD_AMOUNT = 3;
/**
 * localStorage から納豆の残数を読み込む。
 * 値が存在しない・不正な場合や、ストレージにアクセスできない場合は 0 を返す。
 * @returns 現在の納豆残数
 */
function loadCount() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null)
            return 0;
        const parsed = parseInt(stored, 10);
        return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    }
    catch {
        return 0;
    }
}
/**
 * 納豆の残数を localStorage に保存する。
 * Safari プライベートモード等でストレージが使えない場合は何もしない。
 * @param count - 保存する残数
 */
function saveCount(count) {
    try {
        localStorage.setItem(STORAGE_KEY, String(count));
    }
    catch {
        // Safari private mode etc. — silently ignore
    }
}
/**
 * 画面上のカウント表示を更新する。
 * 残数が 2 以下の場合は警告スタイル（赤色）を適用する。
 * @param count - 表示する残数
 */
function updateDisplay(count) {
    const countEl = document.getElementById("count");
    countEl.textContent = String(count);
    countEl.className = count <= 2 ? "count count--warning" : "count";
}
/**
 * ブラウザ通知の許可をリクエストする。
 * まだ許可/拒否が決まっていない場合のみダイアログを表示する。
 */
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
}
/**
 * 納豆の在庫が残り 1 つになったことをブラウザ通知で知らせる。
 * 通知が許可されていない場合は何もしない。
 */
function notifyLowStock() {
    if (!("Notification" in window))
        return;
    if (Notification.permission !== "granted")
        return;
    new Notification("my-natto", {
        body: "納豆が残り1つです。そろそろ買いましょう",
        icon: "./icons/icon-192.png",
    });
}
/**
 * アプリケーションの初期化処理。
 * カウント復元・ボタンイベント登録・Service Worker 登録を行う。
 */
function init() {
    let count = loadCount();
    updateDisplay(count);
    const buyBtn = document.getElementById("btn-buy");
    const eatBtn = document.getElementById("btn-eat");
    buyBtn.addEventListener("click", () => {
        requestNotificationPermission();
        count += ADD_AMOUNT;
        saveCount(count);
        updateDisplay(count);
    });
    eatBtn.addEventListener("click", () => {
        requestNotificationPermission();
        if (count <= 0)
            return;
        const prev = count;
        count -= 1;
        saveCount(count);
        updateDisplay(count);
        if (prev !== 1 && count === 1) {
            notifyLowStock();
        }
    });
    // Service Worker 登録
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(() => {
            // SW registration failed silently
        });
    }
}
document.addEventListener("DOMContentLoaded", init);
