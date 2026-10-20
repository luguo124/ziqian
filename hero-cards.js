export function clampCardDrag(dx,dy,rect,viewportWidth) {
  return { x:Math.max(16-rect.left,Math.min(dx,viewportWidth-16-rect.right)), y:Math.max(-65,Math.min(dy,65)) };
}

export function initHeroCards(container) {
  const cards = [...container.querySelectorAll('canvas')];
  let gesture = null;
  let suppressClickUntil = 0;
  function swap() {
    container.dataset.front = container.dataset.front === 'night' ? 'seal' : 'night';
    cards.forEach(card => card.setAttribute('aria-pressed',String(card.dataset.card === container.dataset.front)));
    container.querySelector('[role="status"]').textContent = container.dataset.front === 'night' ? '夜墨已移到前面' : '朱印已移到前面';
  }
  function finish(cancelled=false) {
    if (!gesture) return;
    const {card,id,moved} = gesture;
    gesture = null;
    card.classList.remove('is-dragging');
    card.style.removeProperty('--drag-x');
    card.style.removeProperty('--drag-y');
    if (card.hasPointerCapture(id)) card.releasePointerCapture(id);
    if (moved && !cancelled) { swap(); suppressClickUntil = performance.now()+350; }
  }
  cards.forEach(card => {
    card.addEventListener('pointerdown',event => {
      if (!event.isPrimary || event.button !== 0 || gesture) return;
      gesture = {card,id:event.pointerId,x:event.clientX,y:event.clientY,rect:card.getBoundingClientRect(),moved:false};
      card.setPointerCapture(event.pointerId);
    });
    card.addEventListener('pointermove',event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX-gesture.x, dy = event.clientY-gesture.y;
      if (!gesture.moved && (Math.hypot(dx,dy)<8 || (event.pointerType === 'touch' && Math.abs(dy)>Math.abs(dx)))) return;
      gesture.moved = true;
      const offset = clampCardDrag(dx,dy,gesture.rect,document.documentElement.clientWidth);
      card.classList.add('is-dragging');
      card.style.setProperty('--drag-x',`${offset.x}px`);
      card.style.setProperty('--drag-y',`${offset.y}px`);
    });
    card.addEventListener('pointerup',() => finish());
    card.addEventListener('pointercancel',() => finish(true));
    card.addEventListener('lostpointercapture',() => finish(true));
    card.addEventListener('click',() => { if (performance.now()>=suppressClickUntil) swap(); });
    card.addEventListener('keydown',event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); swap(); }
    });
  });
  container.querySelector('[data-swap-cards]').addEventListener('click',swap);
}
