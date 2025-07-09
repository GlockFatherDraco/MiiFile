// ┌─────────────┐
// │ BGM Audio  │
// └─────────────┘
(function() {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const a = $('audio');
  window.addEventListener('click', () => { a && a.play(); }, { once: true });
})(); 