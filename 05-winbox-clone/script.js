const openWindowBtn = document.getElementById("open-window-btn");

openWindowBtn.addEventListener("click", openWindow)

function openWindow (e) {
   const newWindow = document.createElement("div");
   newWindow.classList.add("custom-window");

   document.body.appendChild(newWindow)
}