"use strict";
const STORAGE_KEY = "natto-count";
const ADD_AMOUNT = 3;
function loadCount() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null)
        return 0;
    const parsed = parseInt(stored, 10);
    return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
}
function saveCount(count) {
    localStorage.setItem(STORAGE_KEY, String(count));
}
function updateDisplay(count) {
    const countEl = document.getElementById("count");
    countEl.textContent = String(count);
    countEl.className = count <= 2 ? "count count--warning" : "count";
}
function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
}
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
function init() {
    let count = loadCount();
    updateDisplay(count);
    const buyBtn = document.getElementById("btn-buy");
    const eatBtn = document.getElementById("btn-eat");
    buyBtn.addEventListener("click", () => {
        requestNotificationPermission();
        const prev = count;
        count += ADD_AMOUNT;
        saveCount(count);
        updateDisplay(count);
        if (prev !== 1 && count === 1) {
            notifyLowStock();
        }
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
