const createWinboxBtn = document.getElementById("create-winbox-btn");
const mainContainer = document.getElementById("main");
const tabContainer = document.getElementById("tab-bar");

let globalZIndex = 10;
let winboxCount = 0;

function getWinBoxId(elementId) {
   const elementIdArray = elementId.split("-");
   const winboxNumber = elementIdArray.find((idSubstring) => parseInt(idSubstring));

   return `winbox-${winboxNumber}`;
}

function getWinboxPositionAndDimensions(winbox) {
   const currentXPos = Number(winbox.getBoundingClientRect().x);
   const currentYPos = Number(winbox.getBoundingClientRect().y);
   
   const currentWidth = Number(winbox.offsetWidth);
   const currentHeight = Number(winbox.offsetHeight);

   const maxX = window.innerWidth - currentWidth;
   const maxY = window.innerHeight - currentHeight;

   return {
      currentXPos, 
      currentYPos,
      currentWidth,
      currentHeight, 
      maxX,
      maxY
   }
}

function getWinboxElementsAndStates(event) {
   const elementId = event.currentTarget.getAttribute("id");

   const winboxId = getWinBoxId(elementId);
   const winbox = document.getElementById(winboxId);

   const winboxBody = winbox.querySelector(`div[id$="body"]`);
   const winboxHeader = winbox.querySelector(`div[id$="header"]`);
   const winboxHeaderTitle = winbox.querySelector(`p[id$="header-title"]`);

   const isDragging = winbox.getAttribute("is-dragging") === "true";
   const isMaximized = winbox.getAttribute("is-maximized") === "true";
   const isResizing = winbox.getAttribute("is-resizing") === "true";

   const xOffset = Number(winbox.getAttribute("x-offset"));
   const yOffset = Number(winbox.getAttribute("y-offset"));

   const xResizeStart = Number(winbox.getAttribute("x-resize-start"));
   const yResizeStart = Number(winbox.getAttribute("y-resize-start"));

   const previousX = Number(winbox.getAttribute("previous-x"));
   const previousY = Number(winbox.getAttribute("previous-y"));

   const previousWidth = Number(winbox.getAttribute("previous-width"));
   const previousHeight = Number(winbox.getAttribute("previous-height"));
   
   const {
      currentXPos, 
      currentYPos,
      currentWidth,
      currentHeight, 
      maxX,
      maxY
   } = getWinboxPositionAndDimensions(winbox);


   return {
      elementId,
      winboxHeaderTitle, 
      winboxId, 
      winbox,
      winboxBody,
      winboxHeader, 
      isMaximized, 
      currentXPos, 
      currentYPos,
      currentWidth,
      currentHeight, 
      isDragging, 
      isMaximized, 
      xOffset, 
      yOffset,
      xResizeStart,
      yResizeStart,
      maxX,
      maxY,
      previousX,
      previousY,
      previousWidth,
      previousHeight
   };
}

function initializeWinboxDragOrResize(e) {
   const {
      elementId,
      winbox, 
      isMaximized, 
      currentXPos, 
      currentYPos
   } = getWinboxElementsAndStates(e);

   if(isMaximized) return;

   setAsActiveWinbox(winbox);

   winbox.setAttribute("is-dragging", "true");

   winbox.setAttribute("x-resize-start", `${e.clientX}`);
   winbox.setAttribute("y-resize-start", `${e.clientY}`);

   const xOffset = e.clientX - currentXPos;
   const yOffset = e.clientY - currentYPos;

   winbox.setAttribute("x-offset", `${xOffset}`);
   winbox.setAttribute("y-offset", `${yOffset}`);

   e.currentTarget.setPointerCapture(e.pointerId);
}

function checkForOutbound(x, maxX, y, maxY, event) {
   const outBounds = [];
   
   if(x < 0) {
      outBounds.push("left");
   }
   else if (maxX >= 0 && x >= maxX) {
      outBounds.push("right");
   }

   if (maxX < 0) {
      outBounds.push("width");
   }

   if (y < 0) {
      outBounds.push("top");
   }
   else if (maxY >= 0 && y > maxY) {
      outBounds.push("bottom");
   }

   if(maxY < 0) {
      outBounds.push("height");
   }

   return outBounds;
}

function correctOutbounds(action, winbox, currentXPos, maxX, currentYPos, maxY, currentWidth = 0, currentHeight = 0, e = null) {

   const outbounds = checkForOutbound(currentXPos, maxX, currentYPos, maxY, e);
   if(!outbounds.length) return;

   winbox.style.transition = "all 0.5s ease-out";

   let correctedX = currentXPos;
   let correctedY = currentYPos;
   
   let correctedWidth = currentWidth;
   let correctedHeight = currentHeight;

   if(outbounds.indexOf("left") >= 0) {
      correctedX = 0;
      correctedWidth = currentWidth + currentXPos;
   }
   else if (outbounds.indexOf("right") >= 0) {
      correctedX = maxX;
   }

   if(e?.clientX >= window.innerWidth && action === "resize") {
      const xToSubtract = currentWidth - (e.clientX - currentXPos);
      correctedX = currentXPos;
      correctedWidth = currentWidth - xToSubtract;
   }

   if(outbounds.indexOf("top") >= 0) {
      correctedY = 0;
   }
   else if (outbounds.indexOf("bottom") >= 0) {
      correctedY = maxY;
   }

   if(outbounds.indexOf("width") >= 0) {
      correctedWidth = window.innerWidth;
   }

   if(outbounds.indexOf("height") >= 0) {
      correctedHeight = window.innerHeight;
   }

   dragWinbox(winbox, correctedX, correctedY);

   setTimeout(() => {
      winbox.style.transition = "";
   }, 500)

   if(action !== "resize") return;

   scaleWinbox(winbox, correctedWidth, correctedHeight);
}

function winboxDragEnd(e) {
   const {
      winboxHeaderTitle, 
      winbox, 
      currentXPos, 
      currentYPos,
      maxX,
      maxY
   } = getWinboxElementsAndStates(e);

   winbox.setAttribute("is-dragging", "false");
   winboxHeaderTitle.releasePointerCapture(e.pointerId);

   correctOutbounds("drag", winbox, currentXPos, maxX, currentYPos, maxY, 0, 0, e);
}

function dragWinbox(winbox, newX, newY) {
   winbox.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
}

function winboxDrag(e) {
   const {
      isDragging,
      xOffset,
      yOffset,
      winbox
   } = getWinboxElementsAndStates(e);

   if(!isDragging) return;

   const newX = e.clientX - xOffset;
   const newY = e.clientY - yOffset;

   dragWinbox(winbox, newX, newY);
}

function addEventListenerToHeaderTitle(winbox) {
   const winboxHeaderTitle = winbox.querySelector('p[id$="header-title"]');

   winboxHeaderTitle.addEventListener("pointerdown", initializeWinboxDragOrResize);
   winboxHeaderTitle.addEventListener("pointerup", winboxDragEnd);
   winboxHeaderTitle.addEventListener("pointermove", winboxDrag);
}

function addEventListenerToCloseBtn(winbox) {
   const closeBtn = winbox.querySelector('button[id$="close-btn"]');

   closeBtn.addEventListener("click", () => {
      winbox.remove();

      const winboxes = Array.from(document.querySelectorAll(".winbox"));
   
      let winboxIndex = 0;
      let greatestZIndex = 0;
   
      winboxes.forEach((winbox, index) => {
         if(winbox.style.zIndex > greatestZIndex) {
            greatestZIndex = winbox.style.zIndex;
            winboxIndex = index;
         }
      })
   
      winboxes[winboxIndex]?.querySelector('div[id$="body-shade"]').classList.add("inactive-body-shade");
   })

}

function addEventListenerToFullScreenBtn(winbox) {
   const fullScreenBtn = winbox.querySelector('button[id$="full-screen-btn"]');

   const winboxBody = winbox.querySelector('div[id$=body]');

   fullScreenBtn.addEventListener("click", () => {
      setAsActiveWinbox(winbox);
      winboxBody.requestFullscreen();
   })
}

function winboxResizeEnd(e) {
   const {
      winbox, 
      currentXPos, 
      currentYPos,
      maxX,
      maxY,
      currentWidth,
      currentHeight
   } = getWinboxElementsAndStates(e);

   winbox.setAttribute("is-dragging", "false");

   const resizer = e.currentTarget;
   resizer.releasePointerCapture(e.pointerId);

   correctOutbounds("resize", winbox, currentXPos, maxX, currentYPos, maxY, currentWidth, currentHeight, e);
}

function getResizeDirection(elementId) {
   const indexOfWordResize = elementId.indexOf("resize-");
   const directionStartingIndex = indexOfWordResize + 7;

   return `${elementId.substring(directionStartingIndex)}`
}

function scaleWinbox(winbox, newWidth, newHeight) {
   winbox.style.width = `${newWidth}px`;
   winbox.style.height = `${newHeight}px`;
}

function winboxResize(e) {
   const {
      elementId,
      winbox,
      isDragging,
      currentXPos,
      currentYPos,
      xResizeStart,
      yResizeStart,
      currentWidth,
      currentHeight,
      xOffset,
      yOffset
   } = getWinboxElementsAndStates(e);

   if(!isDragging) return;

   const resizeDirection = getResizeDirection(elementId);

   let xToAdd = 0;
   let yToAdd = 0;

   let newX = currentXPos;
   let newY = currentYPos;

   const pointerX = e.clientX;
   const pointerY = e.clientY;

   if(resizeDirection.includes("right")) {
      xToAdd = pointerX - xResizeStart;
   }
   else if(resizeDirection.includes("left")) {
      xToAdd = xResizeStart - pointerX;
      newX = pointerX - xOffset;
   }

   if(resizeDirection.includes("top")) {
      yToAdd = yResizeStart - pointerY;
      newY = pointerY - yOffset;
   }
   else if(resizeDirection.includes("bottom")) {
      yToAdd = pointerY - yResizeStart;
   }

   const newWidth = currentWidth + xToAdd;
   const newHeight = currentHeight + yToAdd;

   dragWinbox(winbox, newX, newY);
   scaleWinbox(winbox, newWidth, newHeight);

   winbox.setAttribute("x-resize-start", `${pointerX}`);
   winbox.setAttribute("y-resize-start", `${pointerY}`);
}

function addEventListenerToResizers(winbox) {
   const resizers = winbox.querySelectorAll('div[id*="resize"]');

   resizers.forEach((resizer) => {
      resizer.addEventListener("pointerdown", initializeWinboxDragOrResize);
      resizer.addEventListener("pointerup", winboxResizeEnd);
      resizer.addEventListener("pointermove", winboxResize);
   })
}

function setAsActiveWinbox(winbox) {
   winbox.style.zIndex = ++globalZIndex;

   document.querySelector(".inactive-body-shade")?.classList.remove("inactive-body-shade");
   winbox.querySelector('div[id$="body-shade"]').classList.add("inactive-body-shade");
}

function minimizeWinbox(
   winbox, 
   winboxBody, 
   winboxHeader,
   previousX,
   previousY,
   previousWidth,
   previousHeight
) {
   mainContainer.removeChild(winbox);
   document.body.appendChild(winbox);

   winbox.setAttribute("is-maximized", "false");

   winbox.style.transform = `translate3d(${previousX}px, ${previousY}px, 0)`;
   winbox.classList.toggle("maximized-window");
   winboxBody.classList.toggle("maximized-body");
   winboxHeader.classList.toggle("maximized-header");
}

function maximizeWinbox(
   winbox, 
   winboxBody, 
   winboxHeader,
   currentXPos,
   currentYPos,
   currentWidth, 
   currentHeight,
) {
   document.body.removeChild(winbox);

   if(mainContainer.childElementCount) {
      mainContainer.insertBefore(winbox, mainContainer.firstChild)
   }
   else {
      mainContainer.appendChild(winbox);
   }

   winbox.setAttribute("previous-x", currentXPos);
   winbox.setAttribute("previous-y", currentYPos);
   winbox.setAttribute("previous-width", currentWidth);
   winbox.setAttribute("previous-height", currentHeight);

   winbox.setAttribute("is-maximized", "true");

   winbox.style.transform = `translate3d(0px, 0px, 0)`;
   winbox.classList.toggle("maximized-window");
   winboxBody.classList.toggle("maximized-body");
   winboxHeader.classList.toggle("maximized-header");
}

function toggleMinMaxWinbox(event) {
   const {
      winbox,
      winboxBody,
      winboxHeader,
      winboxHeaderTitle,
      isMaximized,
      previousX,
      previousY,
      previousWidth,
      previousHeight,
      currentWidth,
      currentHeight,
      currentXPos,
      currentYPos
   } = getWinboxElementsAndStates(event);

   setAsActiveWinbox(winbox);

   if(isMaximized) {
      minimizeWinbox(winbox, winboxBody, winboxHeader, previousX, previousY, previousWidth, previousHeight);
      return;
   }

   maximizeWinbox(winbox, winboxBody, winboxHeader, currentXPos,currentYPos, currentWidth, currentHeight);
}

function addEventListenerToMinMaxBtn(winbox) {
   const minMaxBtn = winbox.querySelector('button[id$="min-max-btn"]');
   minMaxBtn.addEventListener("click", toggleMinMaxWinbox);
}

function createWinbox() {
   const winboxNumber = ++winboxCount;

   const winbox = document.createElement("div");
   winbox.setAttribute("id", `winbox-${winboxCount}`);
   
   winbox.classList.add("winbox");

   const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

   winbox.style.backgroundColor = randomColor;
   winbox.style.color = `contrast-color(${randomColor})`;

   winbox.innerHTML = `
      <div id="winbox-${winboxNumber}-header" class="winbox-header">
         <p 
            id="winbox-${winboxNumber}-header-title" 
            class="winbox-header-title" 
            winbox-id="winbox-${winboxNumber}" 
            is-dragging="false" 
            is-maximized="false" 
            x-offset="0" 
            y-offset="0" 
            x-resize-start="0" 
            y-resize-start="0"
            previous-x="0"
            previous-y="0"
            previous-width="0"
            previous-height="0"
         >Winbox ${winboxNumber}</p>
         <button id="winbox-${winboxNumber}-hide-button">__</button>
         <button id="winbox-${winboxNumber}-min-max-btn" class="min-max-btn">
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
         <div id="winbox-${winboxNumber}-body-shade" class="active-body-shade"></div>
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

   setAsActiveWinbox(winbox);

   addEventListenerToHeaderTitle(winbox);
   addEventListenerToResizers(winbox);

   addEventListenerToCloseBtn(winbox);
   addEventListenerToFullScreenBtn(winbox);
   addEventListenerToMinMaxBtn(winbox);
}

createWinboxBtn.addEventListener("click", createWinbox);

window.addEventListener("resize", () => {
   const winboxes = document.querySelectorAll(".winbox");

   winboxes.forEach((winbox) => {

      const {
         currentXPos, 
         currentYPos,
         maxX,
         maxY
      } = getWinboxPositionAndDimensions(winbox);

      correctOutbounds("drag", winbox, currentXPos, maxX, currentYPos, maxY);
   })
})