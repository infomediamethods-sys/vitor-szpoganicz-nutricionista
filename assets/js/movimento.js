/* movimento.js — movimento do site do Vitor Szpoganicz, reproduzido da referência (wholeandbalanced.life;
   Kit de Design, seção "Movimento"; specs/design.md §10). Só transform/opacity/altura de acordeão.
   main.js e base.css não se editam. prefers-reduced-motion: entradas e animações desligadas. */
(function () {
  'use strict';
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var celular = window.matchMedia('(max-width: 899px)');
  var ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  /* Entrada de seção (.r): sobe 20px e aparece, 0,9s, uma vez; irmãos escalonados em 0,1s.
     O atraso é limpo no fim da transição (não fica para sempre em nada que tenha hover). */
  var itens = document.querySelectorAll('.r');
  if (reduzir || !('IntersectionObserver' in window)) {
    itens.forEach(function (el) { el.classList.add('r--visivel'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var grupo = el.closest('ul, ol, .duvidas__grade, .sobre__grade, .acompanhamento__cabeca');
        var i = 0;
        if (grupo) {
          var irmaos = Array.prototype.filter.call(grupo.querySelectorAll('.r'), function (c) { return c.closest('ul, ol, .duvidas__grade, .sobre__grade, .acompanhamento__cabeca') === grupo; });
          i = Math.min(Math.max(irmaos.indexOf(el), 0), 5);
        }
        el.style.transitionDelay = (i * 0.1) + 's';
        el.classList.add('r--visivel');
        el.addEventListener('transitionend', function limpar() { el.style.transitionDelay = ''; el.removeEventListener('transitionend', limpar); });
        obs.unobserve(el);
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    itens.forEach(function (el) { obs.observe(el); });
  }

  /* Cards de serviço: no celular abrem ao toque no "+" (Kit, recurso 14); no computador ficam abertos. */
  var cards = document.querySelectorAll('[data-servico]');
  function prepararCards() {
    cards.forEach(function (card) {
      var botao = card.querySelector('.servico__abrir');
      if (celular.matches) {
        if (!card.hasAttribute('data-aberto')) { card.setAttribute('data-fechado', ''); botao.setAttribute('aria-expanded', 'false'); }
      } else {
        card.removeAttribute('data-fechado'); card.removeAttribute('data-aberto'); botao.setAttribute('aria-expanded', 'false');
      }
    });
  }
  cards.forEach(function (card) {
    var botao = card.querySelector('.servico__abrir');
    var corpo = card.querySelector('.servico__corpo');
    botao.addEventListener('click', function () {
      var abrir = card.hasAttribute('data-fechado');
      if (abrir) {
        card.removeAttribute('data-fechado'); card.setAttribute('data-aberto', '');
        if (!reduzir) corpo.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: ease });
      } else {
        card.setAttribute('data-fechado', ''); card.removeAttribute('data-aberto');
      }
      botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    });
  });
  prepararCards();
  if (celular.addEventListener) celular.addEventListener('change', prepararCards);

  /* Acordeão das dúvidas: a resposta abre pela altura em 0,4s; o "+" gira 45° (CSS). */
  document.querySelectorAll('.faq details').forEach(function (det) {
    var sumario = det.querySelector('summary');
    var resposta = det.querySelector('.faq__resposta');
    sumario.addEventListener('click', function (e) {
      if (reduzir || !resposta.animate) return;
      e.preventDefault();
      if (det.open) {
        var a = resposta.animate([{ height: resposta.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 400, easing: ease });
        det.classList.add('fechando');
        a.onfinish = function () { det.open = false; det.classList.remove('fechando'); };
      } else {
        det.open = true;
        var h = resposta.offsetHeight;
        resposta.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 400, easing: ease });
      }
    });
  });
})();
