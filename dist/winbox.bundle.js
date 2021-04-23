/**
 * WinBox.js v0.1.4 (Bundle)
 * Copyright 2021 Nextapps GmbH
 * Author: Thomas Wilkerling
 * Licence: Apache-2.0
 * https://github.com/nextapps-de/winbox
 */
(function(){'use strict';var e,g=document.createElement("style");g.innerHTML="@keyframes fade-in{0%{opacity:0}to{opacity:.85}}.wb-body,.wb-n{right:0;left:0}.winbox{position:fixed;left:0;top:0;background:#0050ff;box-shadow:0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22);transition:width .3s,height .3s,transform .3s;transition-timing-function:cubic-bezier(.3,1,.3,1);will-change:transform,width,height;contain:strict;text-align:left;touch-action:none}.wb-header{position:absolute;left:0;top:0;width:100%;height:35px;color:#fff;overflow:hidden}.wb-e,.wb-nw,.wb-w{width:10px}.wb-n,.wb-nw,.wb-s,.winbox iframe{position:absolute;height:10px}.wb-body{position:absolute;top:35px;bottom:0;overflow:auto;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;will-change:scroll-position;background:#fff;margin-top:0!important}.wb-title{font-family:Arial,sans-serif;font-size:14px;padding-left:10px;cursor:move;line-height:35px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wb-n{top:-5px;cursor:n-resize}.wb-e{position:absolute;top:0;right:-5px;bottom:0;cursor:w-resize}.wb-s,.wb-se,.wb-sw{bottom:-5px}.wb-s{left:0;right:0;cursor:n-resize}.wb-w,.winbox.modal:before{position:absolute;top:0;bottom:0}.wb-nw,.wb-w{left:-5px;cursor:w-resize}.wb-nw{top:-5px;cursor:nw-resize}.wb-ne,.wb-sw{cursor:ne-resize;width:10px;height:10px;position:absolute}.wb-ne{top:-5px;right:-5px}.wb-sw{left:-5px}.wb-se{position:absolute;right:-5px;width:10px;height:10px;cursor:nw-resize}.wb-icon{float:right;height:35px;max-width:110%;padding:0 1px;text-align:center}.wb-icon *{display:inline-block;width:30px;height:100%;background-position:center;background-repeat:no-repeat;cursor:pointer}.no-close .wb-close,.no-full .wb-full,.no-header .wb-header,.no-max .wb-max,.no-min .wb-min,.no-resize .wb-body~div,.winbox.min .wb-full,.winbox.min .wb-min,.winbox.modal .wb-full,.winbox.modal .wb-max,.winbox.modal .wb-min{display:none}.wb-min{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNOCAwaDdhMSAxIDAgMCAxIDAgMkgxYTEgMSAwIDAgMSAwLTJoN3oiLz48L3N2Zz4=);background-size:14px auto;background-position:center bottom 11px}.wb-max{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNmZmYiIHZpZXdCb3g9IjAgMCA5NiA5NiI+PHBhdGggZD0iTTIwIDcxLjMxMUMxNS4zNCA2OS42NyAxMiA2NS4yMyAxMiA2MFYyMGMwLTYuNjMgNS4zNy0xMiAxMi0xMmg0MGM1LjIzIDAgOS42NyAzLjM0IDExLjMxMSA4SDI0Yy0yLjIxIDAtNCAxLjc5LTQgNHY1MS4zMTF6Ii8+PHBhdGggZD0iTTkyIDc2VjM2YzAtNi42My01LjM3LTEyLTEyLTEySDQwYy02LjYzIDAtMTIgNS4zNy0xMiAxMnY0MGMwIDYuNjMgNS4zNyAxMiAxMiAxMmg0MGM2LjYzIDAgMTItNS4zNyAxMi0xMnptLTUyIDRjLTIuMjEgMC00LTEuNzktNC00VjM2YzAtMi4yMSAxLjc5LTQgNC00aDQwYzIuMjEgMCA0IDEuNzkgNCA0djQwYzAgMi4yMS0xLjc5IDQtNCA0SDQweiIvPjwvc3ZnPg==);background-size:17px auto}.wb-close{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xIC0xIDE4IDE4Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJtMS42MTMuMjEuMDk0LjA4M0w4IDYuNTg1IDE0LjI5My4yOTNsLjA5NC0uMDgzYTEgMSAwIDAgMSAxLjQwMyAxLjQwM2wtLjA4My4wOTRMOS40MTUgOGw2LjI5MiA2LjI5M2ExIDEgMCAwIDEtMS4zMiAxLjQ5N2wtLjA5NC0uMDgzTDggOS40MTVsLTYuMjkzIDYuMjkyLS4wOTQuMDgzQTEgMSAwIDAgMSAuMjEgMTQuMzg3bC4wODMtLjA5NEw2LjU4NSA4IC4yOTMgMS43MDdBMSAxIDAgMCAxIDEuNjEzLjIxeiIvPjwvc3ZnPg==);background-size:15px auto}.wb-full{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIuNSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOCAzSDVhMiAyIDAgMCAwLTIgMnYzbTE4IDBWNWEyIDIgMCAwIDAtMi0yaC0zbTAgMThoM2EyIDIgMCAwIDAgMi0ydi0zTTMgMTZ2M2EyIDIgMCAwIDAgMiAyaDMiLz48L3N2Zz4=);background-size:16px auto}.winbox.max .wb-body~div,.winbox.max .wb-title,.winbox.min .wb-body~div,.winbox.modal .wb-body~div,.winbox.modal .wb-title{pointer-events:none}.winbox.min .wb-title{cursor:default}.winbox iframe{width:100%;height:100%;border:0}.winbox.modal{contain:layout size}.winbox.modal:before{content:'';left:0;right:0;background:inherit;border-radius:inherit}.winbox.modal:after{content:'';position:absolute;top:-100vh;left:-100vw;right:-100vw;bottom:-100vh;background:#0d1117;animation:fade-in .2s ease-out forwards;z-index:-1}.no-animation{transition:none}.no-shadow{box-shadow:none}.no-header .wb-body{top:0}.no-move:not(.min) .wb-title{pointer-events:none}";
var p=document.getElementsByTagName("head")[0];p.firstChild?p.insertBefore(g,p.firstChild):p.appendChild(g);var r=document.createElement("div");r.innerHTML="<div class=wb-header><div class=wb-icon><span class=wb-min></span><span class=wb-max></span><span class=wb-full></span><span class=wb-close></span></div><div class=wb-title> </div></div><div class=wb-body></div><div class=wb-n></div><div class=wb-s></div><div class=wb-w></div><div class=wb-e></div><div class=wb-nw></div><div class=wb-ne></div><div class=wb-se></div><div class=wb-sw></div>";function t(a,b,c){a.addEventListener(b,c,void 0)}function u(a,b){window.removeEventListener(a,b,void 0)}function v(a,b,c){a["_s_"+b]!==c&&(a.style.setProperty(b,c),a["_s_"+b]=c)}function w(a,b){a.stopPropagation();b&&a.preventDefault()};var x=document.documentElement,z=[],A=0,B,C,D,K,L,M,N;
function P(a,b){if(!(this instanceof P))return new P(a);B||R();this.g=r.cloneNode(!0);this.body=this.g.getElementsByClassName("wb-body")[0];var c,h;if(a){if(b){var f=a;a=b}if("string"===typeof a)f=a;else{if(h=a.modal)var q=c="center";var E=a.id;var F=a.root;f=f||a.title;var d=a.mount;var G=a.html;var y=a.url;var k=a.width;var l=a.height;q=a.x||q;c=a.y||c;var H=a.max;var m=a.top;var n=a.left;var I=a.bottom;var J=a.right;B=a.index||B;var Y=a.onclose;var Z=a.onfocus;var aa=a.onblur;var ba=a.onmove;var ca=
a.onresize;b=a.background;var Q=a.border;var O=a["class"];b&&this.setBackground(b);Q&&v(this.body,"margin",Q+(isNaN(Q)?"":"px"))}}this.setTitle(f||"");a=M;f=N;m=m?S(m,f):0;I=I?S(I,f):0;n=n?S(n,a):0;J=J?S(J,a):0;a-=n+J;f-=m+I;k=k?S(k,a):a/2|0;l=l?S(l,f):f/2|0;q=q?S(q,a,k):n;c=c?S(c,f,l):m;B=B||10;this.g.id=this.id=E||"winbox-"+ ++A;this.g.className="winbox"+(O?" "+("string"===typeof O?O:O.join(" ")):"")+(h?" modal":"");this.x=q;this.y=c;this.width=k;this.height=l;this.top=m;this.right=J;this.bottom=
I;this.left=n;this.max=this.min=!1;this.j=Y;this.l=Z;this.i=aa;this.o=ba;this.m=ca;H?this.maximize():this.move().resize();this.focus();d?this.mount(d):G?this.body.innerHTML=G:y&&this.setUrl(y);da(this);(F||document.body).appendChild(this.g)}P["new"]=function(a){return new P(a)};function S(a,b,c){"string"===typeof a&&("center"===a?a=(b-c)/2|0:"right"===a||"bottom"===a?a=b-c:(c=parseFloat(a),a="%"===(""+c!==a&&a.substring((""+c).length))?b/100*c|0:c));return a}
function R(){var a=document.body;a[K="requestFullscreen"]||a[K="msRequestFullscreen"]||a[K="webkitRequestFullscreen"]||a[K="mozRequestFullscreen"]||(K="");L=K&&K.replace("request","exit").replace("mozRequest","mozCancel").replace("Request","Exit");t(window,"resize",function(){T();U()});T()}
function da(a){V(a,"title");V(a,"n");V(a,"s");V(a,"w");V(a,"e");V(a,"nw");V(a,"ne");V(a,"se");V(a,"sw");t(a.g.getElementsByClassName("wb-min")[0],"click",function(b){w(b);T();a.minimize()});t(a.g.getElementsByClassName("wb-max")[0],"click",function(b){w(b);T();a.maximize()});K?t(a.g.getElementsByClassName("wb-full")[0],"click",function(b){w(b);a.fullscreen()}):a.addClass("no-full");t(a.g.getElementsByClassName("wb-close")[0],"click",function(b){w(b);a.close();a=null});t(a.g,"mousedown",function(b){w(b);
a.focus()})}function W(a){z.splice(z.indexOf(a),1);U();a.removeClass("min");a.min=!1;a.g.title=""}function U(){for(var a=z.length,b=0,c,h;b<a;b++)c=z[b],h=Math.min((M-2*c.left)/a,250),c.resize(h+1|0,35,!0).move(c.left+b*h|0,N-c.bottom-35,!0)}var ea={passive:!1};
function V(a,b){function c(d){w(d,!0);a.min?(W(a),a.resize().move().focus()):(v(a.g,"transition","none"),window.addEventListener("mousemove",h,void 0),window.addEventListener("mouseup",f,void 0),window.addEventListener("touchmove",h,void 0),window.addEventListener("touchend",f,void 0),d.touches&&(d=d.touches[0]||d),E=d.pageX,F=d.pageY,T(),a.focus())}function h(d){w(d);d.touches&&(d=d.touches[0]||d);var G=d.pageX;d=d.pageY;var y=G-E,k=d-F,l;if("title"===b){a.x+=y;a.y+=k;var H=l=1}else{if("e"===b||
"se"===b||"ne"===b){a.width+=y;var m=1}else if("w"===b||"sw"===b||"nw"===b)a.x+=y,a.width-=y,H=m=1;if("s"===b||"se"===b||"sw"===b){a.height+=k;var n=1}else if("n"===b||"ne"===b||"nw"===b)a.y+=k,a.height-=k,l=n=1}if(m||n)m&&(a.width=Math.max(Math.min(a.width,M-a.x-a.right),250)),n&&(a.height=Math.max(Math.min(a.height,N-a.y-a.bottom-1),35)),a.resize();if(H||l)H&&(a.x=Math.max(Math.min(a.x,M-a.width-a.right),a.left)),l&&(a.y=Math.max(Math.min(a.y,N-a.height-a.bottom-1),a.top)),a.move();E=G;F=d}function f(d){w(d);
v(a.g,"transition","");u("mousemove",h);u("mouseup",f);u("touchmove",h);u("touchend",f)}var q=a.g.getElementsByClassName("wb-"+b)[0],E,F;q.addEventListener("mousedown",c,void 0);q.addEventListener("touchstart",c,ea)}function T(){M=x.clientWidth;N=x.clientHeight}e=P.prototype;e.mount=function(a){this.unmount();a.h||(a.h=a.parentNode);this.body.textContent="";this.body.appendChild(a);return this};e.unmount=function(a){var b=this.body.firstChild;if(b){var c=a||b.h;c&&c.appendChild(b);b.h=a}return this};
e.setTitle=function(a){a=this.title=a;this.g.getElementsByClassName("wb-title")[0].firstChild.nodeValue=a;return this};e.setBackground=function(a){v(this.g,"background",a);return this};e.setUrl=function(a){this.body.innerHTML='<iframe src="'+a+'"></iframe>';return this};e.focus=function(){D!==this&&(v(this.g,"z-index",B++),this.addClass("focus"),D&&(D.removeClass("focus"),D.i&&D.i()),D=this,this.l&&this.l());return this};e.hide=function(){return this.addClass("hide")};e.show=function(){return this.removeClass("hide")};
e.minimize=function(a){C&&X();!a&&this.min?(W(this),this.resize().move()):!1===a||this.min||(z.push(this),U(),this.g.title=this.title,this.addClass("min"),this.min=!0);this.max&&(this.removeClass("max"),this.max=!1);return this};e.maximize=function(a){if("undefined"===typeof a||a!==this.max)this.min&&W(this),(this.max=!this.max)?this.addClass("max").resize(M-this.left-this.right,N-this.top-this.bottom-1,!0).move(this.left,this.top,!0):this.resize().move().removeClass("max");return this};
e.fullscreen=function(a){if("undefined"===typeof a||a!==C)this.min&&(this.resize().move(),W(this)),C&&X()||(this.body[K](),C=!0);return this};function X(){C=!1;if(document.fullscreen||document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement)return document[L](),!0}e.close=function(){this.min&&W(this);this.j&&this.j();this.unmount();this.g.parentNode.removeChild(this.g);D===this&&(D=null)};
e.move=function(a,b,c){"undefined"===typeof a?(a=this.x,b=this.y):c||(this.x=a?a=S(a,M-this.left-this.right,this.width):0,this.y=b?b=S(b,N-this.top-this.bottom,this.height):0);v(this.g,"transform","translate("+a+"px,"+b+"px)");this.o&&this.o(a,b);return this};
e.resize=function(a,b,c){"undefined"===typeof a?(a=this.width,b=this.height):c||(this.width=a?a=S(a,M-this.left-this.right):0,this.height=b?b=S(b,N-this.top-this.bottom):0);v(this.g,"width",a+"px");v(this.g,"height",b+"px");this.m&&this.m(a,b);return this};e.addClass=function(a){this.g.classList.add(a);return this};e.removeClass=function(a){this.g.classList.remove(a);return this};window.WinBox=P;}).call(this);
