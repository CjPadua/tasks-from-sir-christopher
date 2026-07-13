const openWindowBtn = document.getElementById("open-window-btn");
const mainContainer = document.getElementById("main");

let globalZIndex = 10;

openWindowBtn.addEventListener("click", openWindow)

function openWindow (e) {
   const newWindow = document.createElement("div");
   newWindow.classList.add("custom-window");
   newWindow.style.zIndex = ++globalZIndex;
   newWindow.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`

   const header = document.createElement("div");
   header.classList.add("window-header");

   const headerTitle = document.createElement("p");
   headerTitle.classList.add("window-header-title");
   headerTitle.textContent = e.currentTarget.value;
   header.appendChild(headerTitle);

   const hideButton = document.createElement("button");
   hideButton.innerHTML = `__
   `;
   header.appendChild(hideButton);
   
   const maxMinButton = document.createElement("button");
   maxMinButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
</svg>
   `;
   header.appendChild(maxMinButton);

   const fullScreenButton = document.createElement("button");
   fullScreenButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
  <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
</svg>
   `;
   header.appendChild(fullScreenButton);

   const closeScreenButton = document.createElement("button");
   closeScreenButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
   `;
   header.appendChild(closeScreenButton);

   newWindow.appendChild(header);

   const windowBody = document.createElement("div");
   windowBody.classList.add("window-body");
   newWindow.appendChild(windowBody);

   const rightSideResize = document.createElement("div");
   rightSideResize.classList.add("resizer", "right-resize");
   newWindow.appendChild(rightSideResize);

   const leftSideResize = document.createElement("div");
   leftSideResize.classList.add("resizer", "left-resize");
   newWindow.appendChild(leftSideResize);

   const bottomSideResize = document.createElement("div");
   bottomSideResize.classList.add("resizer", "bottom-resize");
   newWindow.appendChild(bottomSideResize);

   const topSideResize = document.createElement("div");
   topSideResize.classList.add("resizer", "top-resize");
   newWindow.appendChild(topSideResize);

   const topRightResize = document.createElement("div");
   topRightResize.classList.add("resizer", "top-right-resize");
   newWindow.appendChild(topRightResize);

   const bottomRightResize = document.createElement("div");
   bottomRightResize.classList.add("resizer", "bottom-right-resize");
   newWindow.appendChild(bottomRightResize);

   const topLeftResize = document.createElement("div");
   topLeftResize.classList.add("resizer", "top-left-resize");
   newWindow.appendChild(topLeftResize);

   const bottomLeftResize = document.createElement("div");
   bottomLeftResize.classList.add("resizer", "bottom-left-resize");
   newWindow.appendChild(bottomLeftResize);

   main.appendChild(newWindow);

   let currentX = Math.random() * 100 + 50;
   let currentY = Math.random() * 100 + 50;

   console.log(currentX);
   console.log(currentY);

   // using left and top properties
   // newWindow.style.left = `${currentX}px`;
   // newWindow.style.top = `${currentY}px`;

   newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

   function bringBackToViewport(lastValidX, lastValidY) {
      newWindow.style.transition = "transform 0.5s ease-out";
      newWindow.style.transform = `translate3d(${lastValidX}px, ${lastValidY}px, 0)`;
      currentX = lastValidX;
      currentY = lastValidY;

      setTimeout(() => {
         newWindow.style.transition = "";
      }, 500)
   }

   let isDragging = false;
   let xOffset, yOffset, lastValidX, lastValidY;

   headerTitle.addEventListener("pointerdown", (e) => {
      if(isMaximized) return;
      newWindow.style.zIndex = ++globalZIndex;
      isDragging = true;

      xOffset = e.clientX - currentX;
      yOffset = e.clientY - currentY;

      // lock the cursor event to the window
      // prevents loss of control of the window
      headerTitle.setPointerCapture(e.pointerId);
   })

   headerTitle.addEventListener("pointerup", (e) => {
      isDragging = false;

      // check if either x or y coordinates are out of bounds
      //  and bring them back in
      if(currentX < 0 || 
         currentX > window.innerWidth-newWindow.getBoundingClientRect().width ||
         currentY < 0 ||
         currentY > window.innerHeight-newWindow.getBoundingClientRect().height
      ) {
         bringBackToViewport(lastValidX, lastValidY);
      }

      // releases the cursor event since the dragging
      // is now done
      headerTitle.releasePointerCapture(e.pointerId);
   })

   headerTitle.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let newX = e.clientX - xOffset;
      let newY = e.clientY - yOffset;

      // using left and top properties
      // newWindow.style.left = `${newX}px`;
      // newWindow.style.top = `${newY}px`;

      newWindow.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;

      // update the reference for next initiation
      // of dragging
      currentX = newX;
      currentY = newY;

      // horizontal bounding logic
      if(newX > 0 && 
         newX < window.innerWidth-newWindow.getBoundingClientRect().width) {
         lastValidX = currentX;
      }

      // vertical bounding logic
      if(newY > 0 && 
         newY < window.innerHeight-newWindow.getBoundingClientRect().height) {
         lastValidY = currentY;
      }
   })

   let xResizeStart, yResizeStart;

   rightSideResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      xResizeStart = e.clientX;
      rightSideResize.setPointerCapture(e.pointerId);
   })

   rightSideResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      rightSideResize.releasePointerCapture(e.pointerId);
   })

   rightSideResize.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let xOffset = e.clientX - xResizeStart;
      xResizeStart = e.clientX;

      newWindow.style.width = `${newWindow.offsetWidth + xOffset}px`;
   })

   leftSideResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      xResizeStart = e.clientX;
      xOffset = e.clientX - currentX;
      
      leftSideResize.setPointerCapture(e.pointerId);
   })

   leftSideResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      leftSideResize.releasePointerCapture(e.pointerId);
   })

   leftSideResize.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let xToAdd = e.clientX - xResizeStart;
      xResizeStart = e.clientX;
      currentX = e.clientX - xOffset;

      newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      newWindow.style.width = `${newWindow.offsetWidth - xToAdd}px`;
   })

   topLeftResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      xResizeStart = e.clientX;
      yResizeStart = e.clientY;
      
      xOffset = e.clientX - currentX;
      yOffset = e.clientY - currentY;
      
      topLeftResize.setPointerCapture(e.pointerId);
   })

   topLeftResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      topLeftResize.releasePointerCapture(e.pointerId);
   })

   topLeftResize.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let xToAdd = e.clientX - xResizeStart;
      xResizeStart = e.clientX;
      let yToAdd = e.clientY - yResizeStart;
      yResizeStart = e.clientY;

      currentX = e.clientX - xOffset;
      currentY = e.clientY - yOffset;

      newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      newWindow.style.width = `${newWindow.offsetWidth - xToAdd}px`;
      newWindow.style.height = `${newWindow.offsetHeight - yToAdd}px`;
   })

   bottomLeftResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      xResizeStart = e.clientX;
      xOffset = e.clientX - currentX;

      yResizeStart = e.clientY;
      
      bottomLeftResize.setPointerCapture(e.pointerId);
   })

   bottomLeftResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      bottomLeftResize.releasePointerCapture(e.pointerId);
   })

   bottomLeftResize.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let xToAdd = e.clientX - xResizeStart;
      xResizeStart = e.clientX;
      let yToAdd = e.clientY - yResizeStart;
      yResizeStart = e.clientY;

      currentX = e.clientX - xOffset;

      newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      newWindow.style.width = `${newWindow.offsetWidth - xToAdd}px`;
      newWindow.style.height = `${newWindow.offsetHeight + yToAdd}px`;
   })

   bottomSideResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      yResizeStart = e.clientY;
      bottomSideResize.setPointerCapture(e.pointerId);
   })

   bottomSideResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      bottomSideResize.releasePointerCapture(e.pointerId);
   })

   bottomSideResize.addEventListener("mousemove", (e) => {
      if(!isDragging) return;

      let yOffset = e.clientY - yResizeStart;
      yResizeStart = e.clientY;

      newWindow.style.height = `${newWindow.offsetHeight + yOffset}px`;
   })

   topSideResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      yResizeStart = e.clientY;
      yOffset = e.clientY - currentY;

      topSideResize.setPointerCapture(e.pointerId);
   })

   topSideResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      topSideResize.releasePointerCapture(e.pointerId);
   })

   topSideResize.addEventListener("mousemove", (e) => {
      if(!isDragging) return;

      let yToAdd = e.clientY - yResizeStart;
      yResizeStart = e.clientY;
      currentY = e.clientY - yOffset;

      newWindow.style.height = `${newWindow.offsetHeight - yToAdd}px`;
      newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
   })

   topRightResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      xResizeStart = e.clientX;
      yResizeStart = e.clientY;

      yOffset = e.clientY - currentY;

      topRightResize.setPointerCapture(e.pointerId);
   })

   topRightResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      topRightResize.releasePointerCapture(e.pointerId);
   })

   topRightResize.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let xToAdd = e.clientX - xResizeStart;
      xResizeStart = e.clientX;

      let yToAdd = e.clientY - yResizeStart;
      yResizeStart = e.clientY;

      currentY = e.clientY - yOffset;

      newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      newWindow.style.width = `${newWindow.offsetWidth + xToAdd}px`;
      newWindow.style.height = `${newWindow.offsetHeight - yToAdd}px`;
   })

   bottomRightResize.addEventListener("pointerdown", (e) => {
      isDragging = true;
      xResizeStart = e.clientX;
      yResizeStart = e.clientY;
      bottomRightResize.setPointerCapture(e.pointerId);
   })

   bottomRightResize.addEventListener("pointerup", (e) => {
      isDragging = false;
      bottomRightResize.releasePointerCapture(e.pointerId);
   })

   bottomRightResize.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let xOffset = e.clientX - xResizeStart;
      xResizeStart = e.clientX;

      let yOffset = e.clientY - yResizeStart;
      yResizeStart = e.clientY;

      newWindow.style.width = `${newWindow.offsetWidth + xOffset}px`;
      newWindow.style.height = `${newWindow.offsetHeight + yOffset}px`;
   })

   let currentWidth, currentHeight;
   let isMaximized = false;

   function toggleMaxMinWindow() {
      if(isMaximized) {
         newWindow.style.position = "absolute";
         newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
         newWindow.style.width = `${currentWidth}px`;
         newWindow.style.height = `${currentHeight}px`;
         newWindow.style.borderRadius = "1em";

         isMaximized = false;
         return;
      }

      currentHeight = newWindow.offsetHeight;
      currentWidth = newWindow.offsetWidth;

      newWindow.style.position = "relative";
      newWindow.style.transform = `translate3d(0px, 0px, 0)`;
      newWindow.style.width = "100%";
      // newWindow.style.height = "100%";
      newWindow.style.borderRadius = "0px";
      mainContainer.scrollIntoView();

      isMaximized = true;
   }

   maxMinButton.addEventListener("click", toggleMaxMinWindow)

   fullScreenButton.addEventListener("click", () => {
      windowBody.requestFullscreen();
   })
   
   closeScreenButton.addEventListener("click", () => {
      newWindow.remove();
   })

}