(function(){
  'use strict';
  var rok=document.querySelectorAll('[data-rok]');
  rok.forEach(function(e){e.textContent=new Date().getFullYear();});

  /* menu mobilne */
  var burger=document.querySelector('.burger'), menu=document.getElementById('menu');
  if(burger&&menu){
    burger.addEventListener('click',function(){
      var o=menu.classList.toggle('otwarte');
      burger.setAttribute('aria-expanded',o?'true':'false');
      burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
    });
    menu.addEventListener('click',function(e){
      if(e.target.tagName==='A'){menu.classList.remove('otwarte');burger.setAttribute('aria-expanded','false');}
    });
  }

  /* aktywna pozycja menu */
  var linki=[].slice.call(document.querySelectorAll('.menu a'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wpisy){
      wpisy.forEach(function(w){
        if(w.isIntersecting){
          linki.forEach(function(a){a.classList.toggle('aktywny',a.getAttribute('href')==='#'+w.target.id);});
        }
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    sekcje.forEach(function(s){io.observe(s);});
    var hero=document.querySelector('.hero');
    if(hero){
      new IntersectionObserver(function(w){
        if(w[0].isIntersecting){linki.forEach(function(a){a.classList.remove('aktywny');});}
      },{threshold:.5}).observe(hero);
    }

    /* pasek mobilny dopiero po przewinięciu za przycisk w hero */
    var pasek=document.getElementById('mobPasek'), cta=document.querySelector('.hero-cta'), kontakt=document.getElementById('kontakt');
    if(pasek&&cta){
      var zaCta=false, wKontakcie=false;
      var odswiez=function(){
        var w=zaCta&&!wKontakcie;
        pasek.classList.toggle('widac',w);
        pasek.setAttribute('aria-hidden',w?'false':'true');
        pasek.querySelectorAll('a').forEach(function(a){a.tabIndex=w?0:-1;});
      };
      new IntersectionObserver(function(w){zaCta=!w[0].isIntersecting&&w[0].boundingClientRect.top<0;odswiez();}).observe(cta);
      if(kontakt){new IntersectionObserver(function(w){wKontakcie=w[0].isIntersecting;odswiez();},{threshold:.15}).observe(kontakt);}
    }
  }

  /* karty przesuwane palcem i myszą */
  document.querySelectorAll('[data-przewijane]').forEach(function(el){
    var x0=0,s0=0,ciagnie=false,ruszyl=false;
    el.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||el.scrollWidth<=el.clientWidth)return;
      ciagnie=true;ruszyl=false;x0=e.clientX;s0=el.scrollLeft;el.style.scrollSnapType='none';el.style.cursor='grabbing';
    });
    window.addEventListener('pointermove',function(e){
      if(!ciagnie)return;var d=e.clientX-x0;if(Math.abs(d)>4)ruszyl=true;el.scrollLeft=s0-d;
    });
    window.addEventListener('pointerup',function(){
      if(!ciagnie)return;ciagnie=false;el.style.cursor='';el.style.scrollSnapType='';
    });
    el.addEventListener('click',function(e){if(ruszyl){e.preventDefault();e.stopPropagation();ruszyl=false;}},true);
    el.addEventListener('dragstart',function(e){e.preventDefault();});
  });

  /* formularz pokazowy */
  var f=document.getElementById('formularz');
  if(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var info=f.querySelector('.info-demo');
      if(!f.checkValidity()){f.reportValidity();return;}
      if(info){info.hidden=false;}
    });
  }

  /* baner cookies */
  var KLUCZ='kn_cookies_v1', ck=document.getElementById('cookies');
  var czytaj=function(){try{return JSON.parse(localStorage.getItem(KLUCZ)||'null');}catch(e){return null;}};
  var zapisz=function(v){v.data=Date.now();try{localStorage.setItem(KLUCZ,JSON.stringify(v));}catch(e){}if(ck)ck.hidden=true;};
  var zgoda=czytaj();
  if(ck){
    if(!zgoda||Date.now()-zgoda.data>365*864e5){ck.hidden=false;}
    ck.addEventListener('click',function(e){
      var a=e.target.getAttribute('data-ck-akcja');if(!a)return;
      if(a==='wszystkie'){zapisz({zewn:true,stat:true});}
      else if(a==='niezbedne'){
        var opcje=ck.querySelector('.ck-opcje');
        if(opcje&&!opcje.hidden){zapisz({zewn:!!ck.querySelector('[data-ck=zewn]').checked,stat:!!ck.querySelector('[data-ck=stat]').checked});}
        else{zapisz({zewn:false,stat:false});}
      }
      else if(a==='ustawienia'){
        var o=ck.querySelector('.ck-opcje');o.hidden=false;
        e.target.hidden=true;
        ck.querySelector('[data-ck-akcja=niezbedne]').textContent='Zapisz wybór';
      }
    });
    document.querySelectorAll('[data-cookies-ustawienia]').forEach(function(b){
      b.addEventListener('click',function(){ck.hidden=false;});
    });
  }
})();
