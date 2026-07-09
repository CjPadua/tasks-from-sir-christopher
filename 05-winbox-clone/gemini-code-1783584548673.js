// Keep track of active window layers
let globalZIndex = 10;

function createWindow(titleText, contentHtml) {
  // 1. Create Window Elements
  const win = document.createElement('div');
  win.className = 'custom-window';
  win.style.zIndex = ++globalZIndex;

  win.innerHTML = `
    <div class="window-header">
      <span class="window-title">${titleText}</span>
      <button class="window-close">X</button>
    </div>
    <div class="window-body">${contentHtml}</div>
  `;

  document.body.appendChild(win);

  // 2. Initial Setup Positions
  let currentX = Math.random() * 100 + 50; 
  let currentY = Math.random() * 100 + 50;
  
  // Apply initial GPU accelerated translation
  win.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

  // 3. Dragging Logic Variables
  const header = win.querySelector('.window-header');
  let isDragging = false;
  let startX, startY;

  // Focus Window on Click
  win.addEventListener('pointerdown', () => {
    win.style.zIndex = ++globalZIndex;
  });

  // Start Dragging
  header.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    header.setPointerCapture(e.pointerId); // Keeps capturing mouse movements smoothly
  });

  // Mouse/Pointer Moving
  header.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    // Utilize translate3d for GPU rendering performance
    win.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  });

  // Stop Dragging
  header.addEventListener('pointerup', (e) => {
    isDragging = false;
    header.releasePointerCapture(e.pointerId);
  });

  // Close Window Action
  win.querySelector('.window-close').addEventListener('click', () => {
    win.remove();
  });
}