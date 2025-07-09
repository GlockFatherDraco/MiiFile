// ┌─────────────┐
// │ DOM Utils   │
// └─────────────┘
export const $ = (sel, ctx=document) => ctx.querySelector(sel);
export const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
export const on = (el, evt, fn, opts) => el.addEventListener(evt, fn, opts);
export const ready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); 