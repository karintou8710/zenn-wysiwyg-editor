export function setSelection(dom: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(dom);
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

// NOTE: 選択範囲がfnの前と後で変わる必要あり
export async function waitSelectionChange(fn: () => void | Promise<void>) {
  const maxWait = 2000;
  const interval = 10;
  let t = 0;

  const beforeRange = window.getSelection()?.getRangeAt(0);

  await fn();

  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (t > maxWait) {
        clearInterval(timer);
        reject(new Error("Selection change wait timeout"));
      }

      const selection = window.getSelection();
      const currentRange = selection?.getRangeAt(0);

      // レンジが変更されたかチェック
      if (
        beforeRange &&
        currentRange &&
        !rangesEqual(beforeRange, currentRange)
      ) {
        clearInterval(timer);
        resolve(true);
      }
      t += interval;
    }, interval);
  });
}

// 2つのRangeが同じかどうかを比較する関数
function rangesEqual(range1: Range, range2: Range): boolean {
  return (
    range1.startContainer === range2.startContainer &&
    range1.startOffset === range2.startOffset &&
    range1.endContainer === range2.endContainer &&
    range1.endOffset === range2.endOffset
  );
}
