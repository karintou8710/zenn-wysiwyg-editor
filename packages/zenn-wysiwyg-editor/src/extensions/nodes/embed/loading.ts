export function createLoadingCard() {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.justifyContent = "center";
  div.style.alignItems = "center";
  div.style.height = "10rem";
  div.style.borderWidth = "2px";
  div.style.borderRadius = "0.375rem";

  const dot1 = document.createElement("div");
  dot1.style.animation = "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite";
  dot1.style.height = "0.5rem";
  dot1.style.width = "0.5rem";
  dot1.style.backgroundColor = "#2563eb";
  dot1.style.borderRadius = "9999px";

  const dot2 = dot1.cloneNode() as HTMLElement;
  dot2.style.marginLeft = "1rem";
  dot2.style.marginRight = "1rem";

  const dot3 = dot1.cloneNode() as HTMLElement;

  div.appendChild(dot1);
  div.appendChild(dot2);
  div.appendChild(dot3);

  return div;
}
