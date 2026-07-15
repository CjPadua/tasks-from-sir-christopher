const createWinboxBtn = document.getElementById("create-winbox-btn");
const mainContainer = document.getElementById("main");
const tabContainer = document.getElementById("tab-bar");

let globalZIndex = 10;
let winboxCount = 0;

function getWinboxInfoFromEvent(event) {
   const winboxHeaderTitle = event.currentTarget;

   const winboxId = winboxHeaderTitle.getAttribute("winbox-id");
   const winbox = document.getElementById(winboxId);

   const isDragging = winbox.getAttribute("is-dragging");
   const isMaximized = winbox.getAttribute("is-maximized");
   const xOffset = winbox.getAttribute("x-offset");
   const yOffset = winbox.getAttribute("y-offset");

   const currentX = winbox.getBoundingClientRect().x;
   const currentY = winbox.getBoundingClientRect().y;

   return {
      winboxHeaderTitle, 
      winboxId, 
      winbox, 
      isMaximized, 
      currentX, 
      currentY, 
      isDragging, 
      isMaximized, 
      xOffset, 
      yOffset
   };
}

function handleWinboxPointerUp(e) {
   const {
      winboxHeaderTitle, 
      winbox, 
      currentX, 
      currentY
   } = getWinboxInfoFromEvent(e);

   // TODO Implement animated bounds checking

   winbox.setAttribute("is-dragging", "false");
   winboxHeaderTitle.releasePointerCapture(e.pointerId);
}

function handleWinboxPointerDown(e) {
   const {
      winboxHeaderTitle, 
      winbox, 
      isMaximized, 
      currentX, 
      currentY
   } = getWinboxInfoFromEvent(e);

   if(isMaximized === "true") return;

   winbox.style.zIndex = ++globalZIndex;
   winbox.setAttribute("is-dragging", "true");

   const xOffset = e.clientX - currentX;
   const yOffset = e.clientY - currentY;

   winbox.setAttribute("x-offset", `${xOffset}`);
   winbox.setAttribute("y-offset", `${yOffset}`);

   winboxHeaderTitle.setPointerCapture(e.pointerId);
}

function createWinbox() {
   const winboxNumber = ++winboxCount;

   const winbox = document.createElement("div");
   winbox.setAttribute("id", `winbox-${winboxCount}`);
   
   winbox.classList.add("winbox");
   winbox.style.zIndex = ++globalZIndex;
   winbox.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`

   winbox.innerHTML = `
      <div id="winbox-${winboxNumber}-header" class="winbox-header">
         <p id="winbox-${winboxNumber}-header-title" class="winbox-header-title" winbox-id="winbox-${winboxNumber}" is-dragging="false" is-maximized="false" x-offset="0" y-offset="0">Winbox ${winboxNumber}</p>
         <button id="winbox-${winboxNumber}-hide-button">__</button>
         <button id="winbox-${winboxNumber}-min-max-btn" class="min-man-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            </svg>
         </button>
         <button id="winbox-${winboxNumber}-full-screen-btn" class="full-screen-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
            </svg>
         </button>
         <button id="winbox-${winboxNumber}-close-btn" class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>            
         </button>
      </div>
      <div id="winbox-${winboxNumber}-body" class="winbox-body">
         <iframe src="" frameborder="0" id="winbox-${winboxNumber}-iframe" class="winbox-iframe"></iframe>
      </div>
      <div id="winbox-${winboxNumber}-resize-top" class="winbox-resize-top"></div>
      <div id="winbox-${winboxNumber}-resize-top-right" class="winbox-resize-top-right"></div>
      <div id="winbox-${winboxNumber}-resize-right" class="winbox-resize-right"></div>
      <div id="winbox-${winboxNumber}-resize-bottom-right" class="winbox-resize-bottom-right"></div>
      <div id="winbox-${winboxNumber}-resize-bottom" class="winbox-resize-bottom"></div>
      <div id="winbox-${winboxNumber}-resize-bottom-left" class="winbox-resize-bottom-left"></div>
      <div id="winbox-${winboxNumber}-resize-left" class="winbox-resize-left"></div>
      <div id="winbox-${winboxNumber}-resize-top-left" class="winbox-resize-top-left"></div>
   `;

   document.body.appendChild(winbox);

   let randomX = Math.random() * 100 + 50;
   let randomY = Math.random() * 100 + 50;

   winbox.style.transform = `translate3d(${randomX}px, ${randomY}px, 0)`;

   const headerTitle = winbox.querySelector(`#winbox-${winboxNumber}-header-title`);

   let isDragging = false;
   let xOffset, yOffset, lastValidX, lastValidY;

   headerTitle.addEventListener("pointerdown", handleWinboxPointerDown);

   headerTitle.addEventListener("pointerup", handleWinboxPointerUp);

}

createWinboxBtn.addEventListener("click", createWinbox);