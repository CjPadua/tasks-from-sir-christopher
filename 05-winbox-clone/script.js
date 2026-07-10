const openWindowBtn = document.getElementById("open-window-btn");
let globalZIndex = 10;

openWindowBtn.addEventListener("click", openWindow)

function openWindow (e) {
   const newWindow = document.createElement("div");
   newWindow.classList.add("custom-window");
   newWindow.style.zIndex = ++globalZIndex;
   newWindow.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`

   document.body.appendChild(newWindow)

   let currentX = Math.random() * 100 + 50;
   let currentY = Math.random() * 100 + 50;

   console.log(currentX);
   console.log(currentY);

   // using left and top properties
   // newWindow.style.left = `${currentX}px`;
   // newWindow.style.top = `${currentY}px`;

   newWindow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

   let isDragging = false;
   let xOffset, yOffset;

   newWindow.addEventListener("pointerdown", (e) => {
      newWindow.style.zIndex = ++globalZIndex;
      isDragging = true;

      xOffset = e.clientX - currentX;
      yOffset = e.clientY - currentY;

      // lock the cursor event to the window
      // prevents loss of control of the window
      newWindow.setPointerCapture(e.pointerId);
   })

   newWindow.addEventListener("pointerup", (e) => {
      isDragging = false;

      // releases the cursor event since the dragging
      // is now done
      newWindow.releasePointerCapture(e.pointerId);
   })

   newWindow.addEventListener("pointermove", (e) => {
      if(!isDragging) return;

      let newX = e.clientX - xOffset;
      let newY = e.clientY - yOffset;

      // horizontal bounding logic
      if(newX < 0) {
         newX = 0;
      }
      else if (newX > window.innerWidth-newWindow.getBoundingClientRect().width) {
         newX = window.innerWidth-newWindow.getBoundingClientRect().width;
      }

      // vertical bounding logic
      if(newY < 0) {
         newY = 0;
      }
      else if (newY > window.innerHeight-newWindow.getBoundingClientRect().height) {
         newY = window.innerHeight-newWindow.getBoundingClientRect().height;
      }

      // using left and top properties
      // newWindow.style.left = `${newX}px`;
      // newWindow.style.top = `${newY}px`;

      newWindow.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;

      // update the reference for next initiation
      // of dragging
      currentX = newX;
      currentY = newY;
   })
}