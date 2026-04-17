const fs = require('fs');

const CSS = `
:root{
  --g:#00ff88;--m:#ff00ff;--c:#00ffff;--gold:#f0b429;--red:#ff4444;
  --dark:#04080f;--darker:#02040a;
  --surf:rgba(6,10,30,0.75);--border:rgba(0,255,136,0.15);
  --text:#e8f0fe;--dim:#6a85b0;
  --fh:'Orbitron',sans-serif;--fm:'Space Mono',monospace;--fs:'Syne',sans-serif;
  --ease-out:cubic-bezier(0.22,1,0.36,1);--ease-move:cubic-bezier(0.25,1,0.5,1);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--fm);background:var(--darker);color:var(--text);overflow-x:hidden;min-height:100vh;cursor:none}
#cursor{position:fixed;width:12px;height:12px;border-radius:50%;background:var(--g);pointer-events:none;z-index:99999;transform:translate(-50%,-50%);box-shadow:0 0 16px var(--g),0 0 40px rgba(0,255,136,.4);transition:width .3s,height .3s,background .3s;mix-blend-mode:screen}
#cursor-ring{position:fixed;width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,255,136,.5);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width .4s,height .4s,border-color .3s}
body:has(button:hover) #cursor,body:has(a:hover) #cursor,body:has(.menu-item:hover) #cursor{width:6px;height:6px;background:var(--m);box-shadow:0 0 20px var(--m)}
body:has(button:hover) #cursor-ring,body:has(a:hover) #cursor-ring,body:has(.menu-item:hover) #cursor-ring{width:56px;height:56px;border-color:rgba(255,0,255,.6)}
#bg-canvas,#particle-canvas{position:fixed;inset:0;pointer-events:none}
#bg-canvas{z-index:0}#particle-canvas{z-index:1}
#grain{position:fixed;inset:0;z-index:3;pointer-events:none;opacity:.025}
body::after{content:'';position:fixed;inset:0;z-index:2;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)}
.nav-header{position:fixed;top:0;width:100%;z-index:1000;display:flex;justify-content:space-between;align-items:center;padding:0 2rem;height:64px;background:rgba(2,4,10,0.9);backdrop-filter:blur(28px) saturate(180%);border-bottom:1px solid rgba(0,255,136,0.18)}
.nav-header::after{content:'';position:absolute;bottom:-1px;left:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,255,136,.6) 30%,rgba(0,255,255,.4) 60%,transparent);animation:nav-sweep 4s linear infinite}
@keyframes nav-sweep{0%{opacity:.3;transform:scaleX(.3) translateX(-100%)}100%{opacity:1;transform:scaleX(1) translateX(0)}}
.nav-right{display:flex;align-items:center;gap:12px}
.brand{font-family:var(--fh);font-weight:900;font-size:1rem;letter-spacing:.14em;display:flex;align-items:center;gap:10px}
.brand-dot{width:8px;height:8px;border-radius:50%;background:var(--g);box-shadow:0 0 10px var(--g),0 0 24px rgba(0,255,136,.4);animation:bdot 2s ease-in-out infinite;flex-shrink:0}
@keyframes bdot{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}
.brand-text{position:relative;display:inline-block}
.brand-text::before,.brand-text::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%}
.brand-text::before{color:var(--m);clip-path:polygon(0 25%,100% 25%,100% 50%,0 50%);animation:glitch-a 5s infinite;transform:translateX(-2px)}
.brand-text::after{color:var(--c);clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%);animation:glitch-b 5s infinite;transform:translateX(2px)}
@keyframes glitch-a{0%,85%,100%{opacity:0}87%,93%{opacity:.8;transform:translateX(-3px) scaleY(1.1)}}
@keyframes glitch-b{0%,88%,100%{opacity:0}90%,96%{opacity:.7;transform:translateX(3px) scaleY(.9)}}
.brand span{color:var(--m);text-shadow:0 0 20px rgba(255,0,255,.6)}
.brand-v{font-size:.55rem;color:rgba(255,255,255,.3);font-family:var(--fm);letter-spacing:.06em}
.token-meter{display:flex;align-items:center;gap:8px;background:rgba(0,255,136,.04);border:1px solid rgba(0,255,136,.18);border-radius:30px;padding:6px 14px;position:relative;overflow:hidden}
.token-meter::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,255,136,.08),transparent);animation:tm-sweep 2.5s linear infinite}
@keyframes tm-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
.tm-bar-wrap{width:60px;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden}
.tm-bar{height:100%;border-radius:2px;transition:width .8s,background .5s}
.tm-label{font-family:var(--fh);font-size:.54rem;color:var(--g);letter-spacing:.08em;min-width:38px;text-align:right;transition:color .4s}
.tm-label.warn{color:var(--gold)}
.tm-label.crit{color:var(--red);animation:crit .7s ease-in-out infinite}
@keyframes crit{0%,100%{opacity:1}50%{opacity:.3}}
.tok-toast{position:fixed;top:72px;right:1.5rem;z-index:2000;font-family:var(--fh);font-size:.58rem;letter-spacing:.08em;padding:6px 16px;border-radius:20px;pointer-events:none;transition:all .35s;opacity:0;transform:translateY(-10px) scale(.95)}
.tok-toast.show{opacity:1;transform:translateY(0) scale(1)}
.tok-toast.spend{background:rgba(0,255,136,.1);border:1px solid rgba(0,255,136,.3);color:var(--g)}
.tok-toast.warn{background:rgba(240,180,41,.1);border:1px solid rgba(240,180,41,.3);color:var(--gold)}
.btn-assist{background:rgba(255,0,255,.08);border:1px solid rgba(255,0,255,.25);color:var(--m);padding:6px 14px;border-radius:20px;cursor:none;font-family:var(--fh);font-size:.58rem;font-weight:700;letter-spacing:.06em;transition:all .3s;text-transform:uppercase}
.btn-assist:hover{background:rgba(255,0,255,.18);border-color:var(--m);box-shadow:0 0 20px rgba(255,0,255,.2)}
.app-shell{max-width:1500px;margin:64px auto 0;padding:2rem;display:grid;grid-template-columns:255px 1fr;gap:2.5rem;position:relative;z-index:10}
@media(max-width:1024px){.app-shell{grid-template-columns:1fr;padding:1rem}.sidebar{display:none}}
.sidebar{position:sticky;top:80px;height:fit-content;display:flex;flex-direction:column;gap:6px}
.menu-item{padding:12px 18px;border-radius:12px;cursor:none;display:flex;align-items:center;gap:12px;font-weight:700;font-size:.8rem;color:var(--dim);background:rgba(6,10,30,.6);border:1px solid transparent;transition:all .3s;position:relative;overflow:hidden;letter-spacing:.04em}
.menu-item::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,255,136,.08),transparent);transition:left .6s}
.menu-item:hover::before,.menu-item.active::before{left:100%}
.menu-item::after{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:0;background:linear-gradient(to bottom,var(--g),var(--c));border-radius:0 2px 2px 0;transition:height .3s}
.menu-item.active::after{height:60%}
.menu-item:hover,.menu-item.active{color:var(--g);border-color:rgba(0,255,136,.25);background:rgba(0,255,136,.04)}
.menu-item.active{box-shadow:0 0 20px rgba(0,255,136,.06),inset 0 0 20px rgba(0,255,136,.03)}
.sidebar-sep{height:1px;background:rgba(0,255,136,.08);margin:4px 0}
.panel{display:none;opacity:0}.panel.active{display:block}
.card{background:var(--surf);border:1px solid var(--border);border-radius:20px;padding:2rem;margin-bottom:1.5rem;position:relative;overflow:hidden;backdrop-filter:blur(20px) saturate(140%);transform-style:preserve-3d;transform:perspective(1000px);transition:border-color .4s,box-shadow .4s;will-change:transform}
.card::before{content:'';position:absolute;top:-1px;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,255,136,.5) 40%,rgba(0,255,255,.3) 60%,transparent);opacity:.8}
.card::after{content:'';position:absolute;inset:0;background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%),rgba(0,255,136,.04),transparent 40%);pointer-events:none}
.card:hover{border-color:rgba(0,255,136,.35);box-shadow:0 0 0 1px rgba(0,255,136,.1),0 20px 60px rgba(0,0,0,.5),0 0 40px rgba(0,255,136,.08)}
.holo-shine{position:absolute;inset:0;pointer-events:none;border-radius:20px;opacity:0;transition:opacity .3s;background:linear-gradient(115deg,transparent 20%,rgba(255,255,255,.03) 40%,rgba(0,255,136,.06) 50%,rgba(0,255,255,.04) 60%,transparent 80%)}
.card:hover .holo-shine{opacity:1}
.badge{font-size:.62rem;padding:4px 14px;border-radius:100px;background:rgba(0,255,136,.07);border:1px solid rgba(0,255,136,.25);color:var(--g);text-transform:uppercase;font-weight:700;margin-bottom:1.1rem;display:inline-block;letter-spacing:.1em;position:relative;overflow:hidden}
.badge::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,255,136,.15),transparent);animation:badge-sweep 2s linear infinite}
@keyframes badge-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
.hero-title{font-family:var(--fs);font-size:clamp(2.8rem,5.5vw,4.8rem);font-weight:900;line-height:.92;letter-spacing:-.04em;margin-bottom:1.4rem}
.ht-sub{color:rgba(255,255,255,.4);display:block;font-size:.32em;margin-bottom:.5em;letter-spacing:.2em;font-family:var(--fh);text-transform:uppercase}
.ht-main{background:linear-gradient(135deg,#00ff88 0%,#00e8ff 35%,#aa44ff 65%,#ff00ff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:grad-shift 5s ease-in-out infinite;filter:drop-shadow(0 0 40px rgba(0,255,136,.25));display:inline-block}
@keyframes grad-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.8rem}
@media(max-width:600px){.stats-row{grid-template-columns:repeat(2,1fr)}}
.stat-box{background:rgba(0,255,136,.03);border:1px solid rgba(0,255,136,.12);border-radius:14px;padding:1.1rem .8rem;text-align:center;position:relative;overflow:hidden;transition:border-color .3s,transform .3s,box-shadow .3s}
.stat-box:hover{border-color:rgba(0,255,136,.3);transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,255,136,.1)}
.stat-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent);opacity:.5}
.stat-num{font-family:var(--fh);font-size:1.6rem;font-weight:900;color:var(--g);text-shadow:0 0 20px rgba(0,255,136,.4);display:block}
.stat-lbl{font-size:.57rem;color:var(--dim);margin-top:4px;text-transform:uppercase;letter-spacing:.1em;font-family:var(--fh)}
.field{margin-bottom:1.2rem}
.field label{display:block;font-size:.62rem;color:var(--g);text-transform:uppercase;margin-bottom:7px;font-weight:700;letter-spacing:.1em;font-family:var(--fh)}
textarea,input[type=text],input[type=range],select{width:100%;background:rgba(0,0,0,.6);border:1px solid rgba(0,255,136,.12);padding:12px 15px;border-radius:12px;color:var(--text);font-family:var(--fm);font-size:.85rem;transition:border-color .3s,box-shadow .3s,background .3s;outline:none}
textarea:focus,input[type=text]:focus,select:focus{border-color:rgba(255,0,255,.6);box-shadow:0 0 0 3px rgba(255,0,255,.08),0 0 24px rgba(255,0,255,.1);background:rgba(15,0,25,.9)}
input[type=range]{padding:4px 0;cursor:none;accent-color:var(--g);height:auto}
select option{background:#060a1e}
textarea{resize:vertical;min-height:80px;line-height:1.7}
.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.form-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
@media(max-width:640px){.form-2col,.form-3col{grid-template-columns:1fr}}
.bpm-row{display:flex;align-items:center;gap:12px}
.bpm-val{font-family:var(--fh);font-size:1rem;color:var(--g);font-weight:900;min-width:44px;text-align:right}
.inj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin:1.2rem 0}
@media(max-width:500px){.inj-grid{grid-template-columns:repeat(2,1fr)}}
.inj-btn{background:rgba(0,0,0,.4);border:1px solid rgba(0,255,136,.15);padding:11px 8px;border-radius:11px;cursor:none;transition:all .3s;font-size:.63rem;font-weight:700;text-transform:uppercase;color:rgba(0,255,136,.8);font-family:var(--fh);letter-spacing:.04em;position:relative;overflow:hidden}
.inj-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,255,136,0),rgba(0,255,136,.08));opacity:0;transition:opacity .3s}
.inj-btn:hover::before{opacity:1}
.inj-btn:hover{border-color:rgba(0,255,136,.5);color:var(--g);transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,255,136,.15)}
.inj-btn.active{background:rgba(0,255,136,.1);border-color:var(--g);color:#fff;box-shadow:0 0 20px rgba(0,255,136,.2)}
.btn-main{width:100%;padding:16px;border:none;border-radius:14px;font-family:var(--fh);font-weight:900;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;cursor:none;position:relative;overflow:hidden;background:linear-gradient(135deg,#00cc6e,#00aacc 40%,#8800cc 70%,#cc00cc);background-size:200% 200%;color:#000;transition:transform .3s,box-shadow .3s;animation:btn-grad 4s ease-in-out infinite}
@keyframes btn-grad{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.btn-main::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.12);opacity:0;transition:opacity .3s}
.btn-main:hover::after{opacity:1}
.btn-main:hover{transform:translateY(-2px) scale(1.01);box-shadow:0 8px 30px rgba(0,255,136,.3)}
.btn-main:active{transform:translateY(0) scale(.99)}
.btn-main > span{position:relative;z-index:1}
.btn-sec{padding:10px 20px;border-radius:10px;border:1px solid rgba(0,255,136,.25);background:rgba(0,255,136,.06);color:var(--g);font-family:var(--fh);font-size:.64rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:none;transition:all .3s}
.btn-sec:hover{background:rgba(0,255,136,.14);border-color:var(--g);transform:translateY(-1px)}
.quality-bar{margin:1rem 0;padding:1rem;background:rgba(0,0,0,.4);border:1px solid rgba(0,255,136,.1);border-radius:12px}
.q-label{font-family:var(--fh);font-size:.6rem;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;display:flex;justify-content:space-between}
.q-score{color:var(--g);font-size:.72rem}
.q-track{height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.q-fill{height:100%;border-radius:3px;transition:width .6s,background .6s;background:linear-gradient(90deg,var(--red),var(--gold),var(--g))}
.output-section{margin-top:1.5rem}
.out-tabs{display:flex;gap:8px;margin-bottom:1rem}
.out-tab{padding:6px 16px;border-radius:8px;border:1px solid rgba(0,255,136,.15);background:rgba(0,0,0,.4);color:var(--dim);font-family:var(--fh);font-size:.6rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:none;transition:all .3s}
.out-tab.active{background:rgba(0,255,136,.1);border-color:var(--g);color:var(--g)}
.output-box{background:rgba(0,0,0,.9);border:1px solid rgba(0,255,136,.2);padding:1.3rem;border-radius:14px;font-family:var(--fm);font-size:.8rem;color:var(--g);position:relative;margin-bottom:1rem;white-space:pre-wrap;word-break:break-word;line-height:1.8;min-height:60px}
.output-box::before{content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,var(--g) 40%,var(--c) 60%,transparent)}
.o-copy{position:absolute;top:10px;right:10px;font-size:.55rem;background:rgba(0,255,136,.15);border:1px solid rgba(0,255,136,.35);color:var(--g);padding:4px 10px;border-radius:6px;cursor:none;font-weight:900;font-family:var(--fh);letter-spacing:.06em;transition:all .2s}
.o-copy:hover{background:var(--g);color:#000}
.out-label{font-family:var(--fh);font-size:.58rem;color:var(--gold);text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px}
.comp-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;margin:1.4rem 0;align-items:center}
@media(max-width:640px){.comp-grid{grid-template-columns:1fr}.comp-arrow{display:none}}
.comp-card{background:rgba(0,0,0,.55);border:1px solid var(--border);border-radius:14px;padding:1.2rem;position:relative;overflow:hidden}
.comp-card::before{content:'';position:absolute;top:0;left:0;width:2px;height:100%;background:linear-gradient(to bottom,transparent,var(--g),transparent)}
.comp-card.out::before{background:linear-gradient(to bottom,transparent,var(--m),transparent)}
.comp-card h4{font-family:var(--fh);font-size:.62rem;color:var(--g);text-transform:uppercase;margin-bottom:.7rem;letter-spacing:.1em}
.comp-card.out h4{color:var(--m)}
.comp-text{font-size:.76rem;color:var(--text);line-height:1.9;font-family:var(--fm)}
.comp-arrow{font-size:2rem;color:var(--gold);text-align:center;text-shadow:0 0 20px rgba(240,180,41,.5);animation:arr-pulse 2s ease-in-out infinite}
@keyframes arr-pulse{0%,100%{opacity:.6;transform:translateX(0)}50%{opacity:1;transform:translateX(4px)}}
.history-item{padding:.8rem 1rem;background:rgba(0,0,0,.4);border:1px solid rgba(0,255,136,.1);border-radius:10px;margin-bottom:.6rem;cursor:none;transition:all .3s;display:flex;justify-content:space-between;align-items:center;gap:1rem}
.history-item:hover{border-color:rgba(0,255,136,.3);background:rgba(0,255,136,.04)}
.hist-preview{font-size:.72rem;color:var(--dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.hist-time{font-family:var(--fh);font-size:.52rem;color:rgba(255,255,255,.2);flex-shrink:0}
.hist-load{font-family:var(--fh);font-size:.52rem;color:var(--g);border:1px solid rgba(0,255,136,.2);padding:3px 8px;border-radius:4px;transition:all .2s;cursor:none;flex-shrink:0}
.hist-load:hover{background:rgba(0,255,136,.1)}
.vid-search{display:flex;gap:.8rem;margin-bottom:1.5rem;align-items:center}
.vid-search input{flex:1;padding:10px 15px;background:rgba(0,0,0,.5);border:1px solid rgba(0,255,136,.15);border-radius:10px;color:var(--text);font-family:var(--fm);font-size:.82rem;outline:none;transition:border-color .3s}
.vid-search input:focus{border-color:rgba(255,0,255,.5)}
.vid-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.2rem}
.vid-card{background:var(--surf);border:1px solid var(--border);border-radius:16px;overflow:hidden;position:relative;transition:border-color .35s,box-shadow .35s,transform .35s}
.vid-card:hover{border-color:rgba(255,0,255,.4);transform:translateY(-5px) scale(1.01);box-shadow:0 20px 50px rgba(0,0,0,.5),0 0 30px rgba(255,0,255,.12)}
.vid-card.hidden{display:none}
.vid-thumb{aspect-ratio:16/9;background:#000;overflow:hidden;position:relative}
.vid-thumb img{width:100%;height:100%;object-fit:cover;opacity:.6;transition:.4s;filter:saturate(.8)}
.vid-thumb::after{content:'▶';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2rem;color:rgba(255,255,255,.8);z-index:2;opacity:0;transition:.3s}
.vid-card:hover .vid-thumb img{opacity:.85;filter:saturate(1.2)}
.vid-card:hover .vid-thumb::after{opacity:1}
.vid-info{padding:.9rem}
.vid-info h4{font-family:var(--fh);font-size:.64rem;margin-bottom:8px;color:var(--g);letter-spacing:.04em;line-height:1.4}
.btn-watch{display:block;text-align:center;background:rgba(0,255,136,.06);color:var(--g);border:1px solid rgba(0,255,136,.2);padding:7px;border-radius:8px;text-decoration:none;font-size:.58rem;font-weight:700;text-transform:uppercase;transition:all .3s;font-family:var(--fh);letter-spacing:.08em}
.btn-watch:hover{background:var(--g);color:#000;box-shadow:0 0 20px rgba(0,255,136,.3)}
.playbook-card{background:rgba(0,0,0,.5);border:1px solid rgba(0,255,136,.15);border-radius:16px;padding:1.4rem;position:relative;overflow:hidden;transition:border-color .3s,box-shadow .3s}
.playbook-card:hover{border-color:rgba(0,255,136,.35);box-shadow:0 0 30px rgba(0,255,136,.08)}
.playbook-card::before{content:'';position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,transparent,var(--g),var(--c),transparent)}
.pb-title{font-family:var(--fh);font-size:.78rem;color:var(--g);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem}
.pb-desc{font-size:.76rem;color:var(--dim);line-height:1.8;margin-bottom:1rem}
.pb-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}
.pb-tag{font-size:.58rem;padding:3px 10px;border-radius:20px;background:rgba(0,255,136,.07);border:1px solid rgba(0,255,136,.2);color:var(--g);font-family:var(--fh);letter-spacing:.04em}
.pb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem}
.inj-card{background:rgba(0,0,0,.5);border:1px solid rgba(0,255,136,.12);border-radius:16px;padding:1.3rem;position:relative;overflow:hidden;transition:border-color .3s,box-shadow .3s}
.inj-card:hover{border-color:rgba(0,255,136,.28);box-shadow:0 0 24px rgba(0,255,136,.07)}
.inj-card::before{content:'';position:absolute;top:0;left:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,255,136,.3),transparent)}
.inj-card h4{font-family:var(--fh);font-size:.68rem;color:var(--gold);text-transform:uppercase;margin-bottom:.8rem;letter-spacing:.08em}
.inj-2col{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
@media(max-width:640px){.inj-2col{grid-template-columns:1fr}}
.checklist-item{display:flex;align-items:flex-start;gap:12px;padding:1rem;background:rgba(0,0,0,.35);border:1px solid rgba(0,255,136,.1);border-radius:12px;margin-bottom:.7rem;transition:all .3s;cursor:none}
.checklist-item.done{background:rgba(0,255,136,.04);border-color:rgba(0,255,136,.25)}
.checklist-item.done .ci-text{text-decoration:line-through;color:var(--dim)}
.ci-check{width:22px;height:22px;border-radius:6px;border:2px solid rgba(0,255,136,.35);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .3s;cursor:none}
.checklist-item.done .ci-check{background:var(--g);border-color:var(--g);box-shadow:0 0 12px rgba(0,255,136,.4)}
.ci-num{font-family:var(--fh);font-size:.6rem;color:var(--g);min-width:22px;padding-top:2px;flex-shrink:0}
.ci-text{font-size:.82rem;line-height:1.65;color:var(--text)}
.ci-sub{font-size:.7rem;color:var(--dim);display:block;margin-top:3px}
.check-progress{margin-bottom:1.5rem;padding:1.2rem;background:rgba(0,0,0,.4);border:1px solid rgba(0,255,136,.1);border-radius:14px}
.cp-label{font-family:var(--fh);font-size:.6rem;color:var(--dim);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;display:flex;justify-content:space-between}
.cp-pct{color:var(--g)}
.cp-track{height:8px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden}
.cp-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--g),var(--c));transition:width .5s}
.assist-overlay{position:fixed;inset:0;z-index:5000;pointer-events:none;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;padding:1.5rem;gap:1rem}
.assist-panel{width:360px;max-height:520px;background:rgba(6,10,30,.97);border:1px solid rgba(255,0,255,.25);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;pointer-events:all;transform:scale(.9) translateY(20px);opacity:0;transition:transform .35s,opacity .35s;transform-origin:bottom right}
.assist-panel.open{transform:scale(1) translateY(0);opacity:1}
.assist-header{padding:1rem 1.2rem;border-bottom:1px solid rgba(255,0,255,.15);display:flex;justify-content:space-between;align-items:center;background:rgba(255,0,255,.05)}
.assist-header h4{font-family:var(--fh);font-size:.72rem;color:var(--m);letter-spacing:.08em;text-transform:uppercase}
.assist-close{background:none;border:none;color:var(--dim);font-size:1.1rem;cursor:none;transition:color .2s;padding:0 4px}
.assist-close:hover{color:var(--m)}
.assist-body{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.7rem}
.assist-msg{padding:.7rem .9rem;border-radius:12px;font-size:.75rem;line-height:1.7}
.assist-msg.bot{background:rgba(255,0,255,.08);border:1px solid rgba(255,0,255,.15);color:var(--text)}
.assist-msg.user{background:rgba(0,255,136,.08);border:1px solid rgba(0,255,136,.15);color:var(--g);text-align:right}
.assist-input-row{padding:.8rem;border-top:1px solid rgba(255,0,255,.1);display:flex;gap:.5rem}
.assist-input{flex:1;background:rgba(0,0,0,.6);border:1px solid rgba(255,0,255,.2);border-radius:8px;color:var(--text);font-family:var(--fm);font-size:.75rem;padding:8px 12px;outline:none;transition:border-color .3s}
.assist-input:focus{border-color:rgba(255,0,255,.5)}
.assist-send{background:rgba(255,0,255,.15);border:1px solid rgba(255,0,255,.3);color:var(--m);padding:8px 14px;border-radius:8px;cursor:none;font-size:.75rem;transition:all .2s}
.assist-send:hover{background:rgba(255,0,255,.3)}
.tips-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:.8rem;margin-top:1.3rem}
.tip{background:rgba(0,255,136,.02);border:1px solid rgba(0,255,136,.1);padding:.9rem;border-radius:11px;transition:border-color .3s,transform .3s}
.tip:hover{border-color:rgba(0,255,136,.25);transform:translateY(-2px)}
.tip h5{font-family:var(--fh);font-size:.58rem;color:var(--gold);text-transform:uppercase;margin-bottom:5px;letter-spacing:.08em}
.tip p{font-size:.7rem;color:var(--dim);line-height:1.65}
.notify{position:fixed;bottom:2rem;right:2rem;z-index:9999;background:rgba(0,255,136,.15);border:1px solid rgba(0,255,136,.4);backdrop-filter:blur(12px);color:var(--g);padding:10px 20px;border-radius:12px;font-weight:700;font-size:.72rem;font-family:var(--fh);animation:notIn .4s;pointer-events:none;letter-spacing:.06em}
@keyframes notIn{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
.ripple{position:absolute;border-radius:50%;background:rgba(0,255,136,.25);transform:scale(0);animation:ripple-anim .6s forwards;pointer-events:none}
@keyframes ripple-anim{to{transform:scale(4);opacity:0}}
.btn-copy{display:inline-block;background:rgba(0,255,136,.06);border:1px solid rgba(0,255,136,.25);color:var(--g);padding:8px 18px;border-radius:10px;cursor:none;font-size:.66rem;font-weight:700;text-transform:uppercase;transition:all .3s;font-family:var(--fh);letter-spacing:.06em;margin-top:12px}
.btn-copy:hover{background:rgba(0,255,136,.14);border-color:var(--g);transform:translateY(-1px)}
.mb0{margin-bottom:0}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,255,136,.25);border-radius:2px}
::-webkit-scrollbar-thumb:hover{background:rgba(0,255,136,.5)}
`;

const HTML_TOP = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover"/>
<title>SONIC ARCHITECT v9.0 — Suno AI Neural Studio</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&family=Syne:wght@700;800;900&display=swap" rel="stylesheet"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<style>${CSS}</style>
</head>
<body>
<div id="cursor"></div>
<div id="cursor-ring"></div>
<canvas id="bg-canvas"></canvas>
<canvas id="particle-canvas"></canvas>
<canvas id="grain"></canvas>
<div class="tok-toast" id="tok-toast"></div>

<header class="nav-header">
  <div class="brand">
    <div class="brand-dot"></div>
    <span class="brand-text" data-text="SONIC ARCHITECT">SONIC <span>ARCHITECT</span></span>
    <span class="brand-v">v9.0 · GGLabs</span>
  </div>
  <div class="nav-right">
    <button class="btn-assist" onclick="toggleAssist()">⬡ Asistente</button>
    <div class="token-meter" id="tok-meter">
      <span style="font-size:10px;color:var(--g)">◈</span>
      <div class="tm-bar-wrap"><div class="tm-bar" id="tm-bar"></div></div>
      <span class="tm-label" id="tm-label">10.0K</span>
    </div>
  </div>
</header>

<div class="app-shell">
  <aside class="sidebar" id="sidebar">
    <div class="menu-item active" onclick="switchTab('home',this)"><span>⬡</span> Home</div>
    <div class="menu-item" onclick="switchTab('studio',this)"><span>🎛</span> Neural Studio</div>
    <div class="menu-item" onclick="switchTab('academy',this)"><span>◈</span> Academy</div>
    <div class="menu-item" onclick="switchTab('playbooks',this)"><span>⚡</span> Playbooks</div>
    <div class="sidebar-sep"></div>
    <div class="menu-item" onclick="switchTab('max',this)"><span>🔥</span> Max Injectors</div>
    <div class="menu-item" onclick="switchTab('checklist',this)"><span>✦</span> Checklist</div>
  </aside>
  <main id="main-content">
`;

const HOME_PANEL = `
    <!-- HOME -->
    <div id="tab-home" class="panel active">
      <h1 class="hero-title">
        <span class="ht-sub">GGLabs · Neural Engine · Bolivia</span>
        <span class="ht-main">SONIC<br>ARCHITECT</span>
      </h1>
      <div class="stats-row" id="stats-row">
        <div class="stat-box"><span class="stat-num" data-target="17">0</span><span class="stat-lbl">Masterclasses</span></div>
        <div class="stat-box"><span class="stat-num" data-target="6">0</span><span class="stat-lbl">Inyectores</span></div>
        <div class="stat-box"><span class="stat-num" data-target="4">0</span><span class="stat-lbl">Playbooks</span></div>
        <div class="stat-box"><span class="stat-num" data-target="50">0</span><span class="stat-lbl">Géneros</span></div>
      </div>
      <div class="card" id="card-intro">
        <div class="holo-shine"></div>
        <div class="badge">◈ Arquitectura Sonora IA</div>
        <h3 style="font-family:var(--fh);font-size:.92rem;margin-bottom:1rem;color:var(--g);letter-spacing:.04em;line-height:1.5">Tu Copiloto para Suno AI — v9.0 Elite</h3>
        <p style="color:var(--dim);line-height:2.1;font-size:.84rem">
          SONIC ARCHITECT transforma visiones en arquitecturas sonoras de precisión quirúrgica. El generador más avanzado de prompts para Suno AI.<br><br>
          <span style="color:rgba(0,255,136,.6)">✦</span> <strong style="color:var(--text)">Neural Studio:</strong> Genera Style Field + Lyrics Field separados con formato nativo Suno.<br>
          <span style="color:rgba(0,255,136,.6)">✦</span> <strong style="color:var(--text)">Score de Calidad:</strong> Indicador en tiempo real del potencial de tu prompt.<br>
          <span style="color:rgba(0,255,136,.6)">✦</span> <strong style="color:var(--text)">Historial:</strong> Accede a tus últimos 10 prompts generados.<br>
          <span style="color:rgba(0,255,136,.6)">✦</span> <strong style="color:var(--text)">Playbooks:</strong> Configuraciones probadas para géneros específicos.<br>
          <span style="color:rgba(0,255,136,.6)">✦</span> <strong style="color:var(--text)">17 Masterclasses:</strong> Videos con timestamps directos a YouTube.
        </p>
      </div>
      <div class="card">
        <div class="holo-shine"></div>
        <h4 style="font-family:var(--fh);color:var(--gold);margin-bottom:1.1rem;font-size:.78rem;letter-spacing:.08em">Workflow Experto v9</h4>
        <div style="display:flex;flex-direction:column;gap:.7rem">
          <div style="display:flex;align-items:center;gap:14px;font-size:.82rem;color:var(--dim)"><span style="font-family:var(--fh);font-size:.58rem;color:var(--g);border:1px solid rgba(0,255,136,.3);border-radius:4px;padding:2px 7px;flex-shrink:0">01</span><span><strong style="color:var(--text)">Selecciona un Playbook</strong> · O empieza desde cero en Neural Studio</span></div>
          <div style="display:flex;align-items:center;gap:14px;font-size:.82rem;color:var(--dim)"><span style="font-family:var(--fh);font-size:.58rem;color:var(--g);border:1px solid rgba(0,255,136,.3);border-radius:4px;padding:2px 7px;flex-shrink:0">02</span><span><strong style="color:var(--text)">Configura parámetros</strong> · Género, BPM, voz, estructura, instrumentos</span></div>
          <div style="display:flex;align-items:center;gap:14px;font-size:.82rem;color:var(--dim)"><span style="font-family:var(--fh);font-size:.58rem;color:var(--g);border:1px solid rgba(0,255,136,.3);border-radius:4px;padding:2px 7px;flex-shrink:0">03</span><span><strong style="color:var(--text)">Activa Inyectores</strong> · Fidelidad, bajos, reverb, estéreo ancho</span></div>
          <div style="display:flex;align-items:center;gap:14px;font-size:.82rem;color:var(--dim)"><span style="font-family:var(--fh);font-size:.58rem;color:var(--g);border:1px solid rgba(0,255,136,.3);border-radius:4px;padding:2px 7px;flex-shrink:0">04</span><span><strong style="color:var(--text)">Genera el Prompt</strong> · Style Field y Lyrics Field listos para Suno</span></div>
          <div style="display:flex;align-items:center;gap:14px;font-size:.82rem;color:var(--dim)"><span style="font-family:var(--fh);font-size:.58rem;color:var(--c);border:1px solid rgba(0,255,255,.3);border-radius:4px;padding:2px 7px;flex-shrink:0">05</span><span><strong style="color:var(--text)">Copia y pega</strong> · Directo en Suno AI, genera 4-6 variaciones</span></div>
        </div>
      </div>
    </div>
`;

const STUDIO_PANEL = `
    <!-- STUDIO -->
    <div id="tab-studio" class="panel">
      <div class="card">
        <div class="holo-shine"></div>
        <div class="badge">🎛 Neural Studio Pro v9.0</div>
        <h2 style="font-family:var(--fh);font-size:.92rem;margin-bottom:.4rem;letter-spacing:.05em">Generador de Prompts Avanzado</h2>
        <p style="color:var(--dim);margin-bottom:1.5rem;font-size:.78rem;line-height:1.8">Arquitectura sonora en dos pasos: Style Field + Lyrics Field nativos de Suno AI.</p>

        <div class="field">
          <label>◈ Tu Visión Musical</label>
          <textarea id="vision" placeholder="Describe tu canción: atmósfera, emoción, historia, influencias..." oninput="updateQuality()"></textarea>
        </div>

        <div class="form-2col">
          <div class="field">
            <label>♫ Género Principal</label>
            <select id="genre" onchange="updateQuality()">
              <option value="">— Seleccionar —</option>
              <option>Synthwave</option><option>Lo-Fi Hip Hop</option><option>Dark Ambient</option>
              <option>Trap</option><option>Indie Pop</option><option>House</option>
              <option>Techno</option><option>Drum &amp; Bass</option><option>Chillout</option>
              <option>Cinematic Orchestral</option><option>Reggaeton</option><option>Latin Pop</option>
              <option>R&amp;B Soul</option><option>Neo Soul</option><option>Jazz Fusion</option>
              <option>Blues Rock</option><option>Alternative Rock</option><option>Metal</option>
              <option>Death Metal</option><option>Folk Acoustic</option><option>Country</option>
              <option>Reggae</option><option>Afrobeats</option><option>Bossa Nova</option>
              <option>Flamenco</option><option>K-Pop</option><option>J-Pop</option>
              <option>Phonk</option><option>Hyperpop</option><option>Shoegaze</option>
              <option>Post-Rock</option><option>Prog Rock</option><option>Psychedelic</option>
              <option>Funk</option><option>Disco</option><option>Gospel</option>
              <option>Bollywood</option><option>Celtic</option><option>Opera</option>
              <option>Ambient Electronic</option><option>Vaporwave</option><option>Nu Metal</option>
              <option>Emo</option><option>Punk</option><option>Ska</option>
              <option>Cumbia</option><option>Tango</option><option>Merengue</option>
              <option>Bachata</option><option>Salsa</option>
            </select>
          </div>
          <div class="field">
            <label>◎ Subgénero / Estilo Extra</label>
            <input type="text" id="subgenre" placeholder="ej: cyberpunk, dreamy, raw..." oninput="updateQuality()"/>
          </div>
        </div>

        <div class="field">
          <label>⚡ BPM — <span id="bpm-display">120</span> bpm</label>
          <div class="bpm-row">
            <input type="range" id="bpm" min="60" max="200" value="120" oninput="document.getElementById('bpm-display').textContent=this.value;updateQuality()"/>
            <span class="bpm-val" id="bpm-val-label">Moderado</span>
          </div>
        </div>

        <div class="form-3col">
          <div class="field">
            <label>◈ Mood / Emoción</label>
            <select id="mood" onchange="updateQuality()">
              <option value="">— Mood —</option>
              <option>melancholic</option><option>euphoric</option><option>aggressive</option>
              <option>dreamy</option><option>dark</option><option>uplifting</option>
              <option>romantic</option><option>nostalgic</option><option>mysterious</option>
              <option>energetic</option><option>peaceful</option><option>haunting</option>
            </select>
          </div>
          <div class="field">
            <label>🎤 Tipo de Voz</label>
            <select id="vocal" onchange="updateQuality()">
              <option value="ethereal female, breathy, intimate">Femenina Etérea</option>
              <option value="intimate male, raw, emotional">Masculina Íntima</option>
              <option value="powerful female, belting, soulful">Femenina Poderosa</option>
              <option value="deep male, gravelly, authoritative">Masculina Grave</option>
              <option value="processed neural, vocoder, robotic">Neural Procesado</option>
              <option value="duet, male and female, harmonized">Dueto Armónico</option>
              <option value="choir, layered harmonies, epic">Coro Épico</option>
              <option value="instrumental only, no vocals">Solo Instrumental</option>
            </select>
          </div>
          <div class="field">
            <label>🌐 Idioma</label>
            <select id="lang" onchange="updateQuality()">
              <option value="Spanish">Español</option>
              <option value="English">Inglés</option>
              <option value="Spanglish">Spanglish</option>
              <option value="Portuguese">Portugués</option>
              <option value="French">Francés</option>
              <option value="Italian">Italiano</option>
              <option value="Instrumental">Instrumental</option>
            </select>
          </div>
        </div>

        <div class="form-2col">
          <div class="field">
            <label>⬡ Estructura</label>
            <select id="struct" onchange="updateQuality()">
              <option value="Verse, Chorus, Verse, Chorus, Bridge, Chorus">Estándar (V-C-V-C-B-C)</option>
              <option value="Intro, Verse, Pre-Chorus, Chorus, Verse, Chorus, Outro">Completa</option>
              <option value="Chorus, Verse, Chorus, Bridge, Chorus">Hook-First</option>
              <option value="Intro, Build, Drop, Break, Drop, Outro">EDM Structure</option>
              <option value="Verse, Verse, Chorus, Verse, Outro">Minimalista</option>
              <option value="Through-composed, no repeating sections">Through-Composed</option>
            </select>
          </div>
          <div class="field">
            <label>🎚 Producción</label>
            <select id="prod" onchange="updateQuality()">
              <option value="studio quality, high fidelity, professional mastering">Calidad Estudio</option>
              <option value="demo, rough mix, lo-fi, tape warmth">Demo Lo-Fi</option>
              <option value="viral hit, radio ready, hook-first, punchy mix">Viral Hit</option>
              <option value="cinematic, orchestral, atmospheric, epic">Cinemático</option>
              <option value="underground, raw, gritty, independent">Underground Raw</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label>🎸 Instrumentos Clave</label>
          <input type="text" id="instr" placeholder="ej: electric guitar, 808 bass, moog synth, live drums..." oninput="updateQuality()"/>
        </div>

        <div class="field">
          <label>✦ Tema / Letra (opcional)</label>
          <textarea id="theme" placeholder="El tema de la letra: amor perdido, ciudad nocturna, rebelión, soledad..." style="min-height:60px" oninput="updateQuality()"></textarea>
        </div>

        <div class="field">
          <label>⚡ Inyectores de Estilo</label>
          <div class="inj-grid">
            <button class="inj-btn" onclick="toggleInj(this,'fidelity')">🎚 Fidelidad Max</button>
            <button class="inj-btn" onclick="toggleInj(this,'vocals')">🎤 Voces Claras</button>
            <button class="inj-btn" onclick="toggleInj(this,'bass')">🔊 Bajos Profundos</button>
            <button class="inj-btn" onclick="toggleInj(this,'reverb')">✨ Reverb Studio</button>
            <button class="inj-btn" onclick="toggleInj(this,'dynamics')">⚡ Dinámicas Vivas</button>
            <button class="inj-btn" onclick="toggleInj(this,'stereo')">🌊 Estéreo Ancho</button>
          </div>
        </div>

        <div class="quality-bar">
          <div class="q-label">
            <span>◈ Quality Score</span>
            <span class="q-score" id="q-score-text">0%</span>
          </div>
          <div class="q-track"><div class="q-fill" id="q-fill" style="width:0%"></div></div>
        </div>

        <button class="btn-main" onclick="generatePrompt()"><span>✦ Arquitecturar Prompt Optimizado</span></button>

        <div id="output-section" class="output-section" style="display:none">
          <div class="comp-grid">
            <div class="comp-card"><h4>📝 Tu Visión</h4><div class="comp-text" id="input-display"></div></div>
            <div class="comp-arrow">→</div>
            <div class="comp-card out"><h4>✦ Arquitecturado</h4><div class="comp-text" id="output-preview"></div></div>
          </div>

          <div class="out-tabs">
            <button class="out-tab active" onclick="showOutTab('style',this)">Style Field</button>
            <button class="out-tab" onclick="showOutTab('lyrics',this)">Lyrics Field</button>
            <button class="out-tab" onclick="showOutTab('full',this)">Completo</button>
          </div>

          <div id="out-style">
            <div class="out-label">📋 STYLE FIELD — Pegar en "Style of Music" en Suno</div>
            <div class="output-box" id="style-field-box">
              <button class="o-copy" onclick="copyField('style')">COPIAR</button>
              <span id="style-field-text"></span>
            </div>
          </div>
          <div id="out-lyrics" style="display:none">
            <div class="out-label">📋 LYRICS FIELD — Pegar en el campo de letra en Suno</div>
            <div class="output-box" id="lyrics-field-box">
              <button class="o-copy" onclick="copyField('lyrics')">COPIAR</button>
              <span id="lyrics-field-text"></span>
            </div>
          </div>
          <div id="out-full" style="display:none">
            <div class="out-label">📋 PROMPT COMPLETO</div>
            <div class="output-box" id="full-field-box">
              <button class="o-copy" onclick="copyField('full')">COPIAR</button>
              <span id="full-field-text"></span>
            </div>
          </div>

          <div class="tips-grid">
            <div class="tip"><h5>◈ Style Field</h5><p>Máx 200 chars. Géneros, mood, instrumentos, producción separados por comas.</p></div>
            <div class="tip"><h5>⬡ Max Mode</h5><p>Añade los códigos Max al final del Lyrics Field para calidad de estudio.</p></div>
            <div class="tip"><h5>⚡ Variaciones</h5><p>Genera 4–6 variaciones del mismo prompt. La calidad emerge estadísticamente.</p></div>
            <div class="tip"><h5>✦ BPM</h5><p>Suno respeta el BPM cuando va en el Style Field de forma explícita.</p></div>
          </div>
        </div>
      </div>

      <!-- HISTORY -->
      <div class="card">
        <div class="holo-shine"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem">
          <div class="badge" style="margin-bottom:0">◈ Historial</div>
          <button class="btn-sec" onclick="clearHistory()">Limpiar</button>
        </div>
        <div id="history-list"><p style="color:var(--dim);font-size:.78rem">Aún no has generado prompts. Usa el Neural Studio arriba.</p></div>
      </div>
    </div>
`;

const ACADEMY_PANEL = `
    <!-- ACADEMY -->
    <div id="tab-academy" class="panel">
      <div class="badge mb0" style="margin-bottom:1rem">◈ Masterclasses · @pilotpulse9</div>
      <h2 style="margin-bottom:1.5rem;font-family:var(--fh);font-size:.88rem;letter-spacing:.06em;color:var(--text)">Sonic Academy — 17 Módulos</h2>
      <div class="vid-search">
        <input type="text" id="vid-search" placeholder="Buscar masterclass..." oninput="filterVideos(this.value)"/>
        <span style="color:var(--dim);font-family:var(--fh);font-size:.6rem;white-space:nowrap" id="vid-count">17 módulos</span>
      </div>
      <div class="vid-grid" id="video-grid"></div>
    </div>
`;

const PLAYBOOKS_PANEL = `
    <!-- PLAYBOOKS -->
    <div id="tab-playbooks" class="panel">
      <div class="badge" style="margin-bottom:1.5rem">⚡ Playbooks — Configuraciones Probadas</div>
      <p style="color:var(--dim);font-size:.8rem;line-height:1.8;margin-bottom:1.8rem">Playbooks pre-configurados con géneros, BPM, mood e inyectores optimizados. Haz clic en "Aplicar" para cargar la configuración en el Neural Studio.</p>
      <div class="pb-grid" id="playbooks-grid"></div>
    </div>
`;

const MAX_PANEL = `
    <!-- MAX INJECTORS -->
    <div id="tab-max" class="panel">
      <div class="card" style="border-color:rgba(255,0,255,.18)">
        <div class="holo-shine"></div>
        <div class="badge" style="background:rgba(255,0,255,.07);border-color:rgba(255,0,255,.25);color:var(--m)">⚡ Max Precision Injectors</div>
        <h2 style="font-family:var(--fh);font-size:.9rem;margin-bottom:.5rem;letter-spacing:.05em">Inyectores de Metadatos</h2>
        <p style="color:var(--dim);margin-bottom:1.6rem;font-size:.78rem;line-height:1.8">Códigos de alto nivel para forzar fidelidad de estudio profesional en Suno AI. Añadir al final del Lyrics Field.</p>
        <div class="inj-2col">
          <div class="inj-card">
            <h4>🎚 Fidelidad Máxima</h4>
            <div class="output-box mb0" style="font-size:.74rem">is mode max\nquality max max\nrealins max max\nreal instrument max max</div>
            <button class="btn-copy" onclick="copyAndSpend('is mode max\\nquality max max\\nrealins max max\\nreal instrument max max',80)">Copiar</button>
          </div>
          <div class="inj-card">
            <h4>🎤 Vocal Max Mode</h4>
            <div class="output-box mb0" style="font-size:.74rem">///\n*****\n///\nstart on through "[primera frase]"</div>
            <button class="btn-copy" onclick="copyAndSpend('///\\n*****\\n///\\nstart on through \\"[primera frase]\\"',60)">Copiar</button>
          </div>
        </div>
        <div class="inj-2col">
          <div class="inj-card">
            <h4>👥 Duet Mode</h4>
            <div class="output-box mb0" style="font-size:.74rem">duet start on through\nmale start on "[frase hombre]"\nfemale start on "[frase mujer]"</div>
            <button class="btn-copy" onclick="copyAndSpend('duet start on through\\nmale start on \\"[frase hombre]\\"\\nfemale start on \\"[frase mujer]\\"',70)">Copiar</button>
          </div>
          <div class="inj-card">
            <h4>🔊 Bajos Profundos</h4>
            <div class="output-box mb0" style="font-size:.74rem">bass depth max\nsub-bass presence\nlow-end power</div>
            <button class="btn-copy" onclick="copyAndSpend('bass depth max | sub-bass presence | low-end power',40)">Copiar</button>
          </div>
        </div>
        <div class="inj-2col">
          <div class="inj-card">
            <h4>✨ Reverb Studio</h4>
            <div class="output-box mb0" style="font-size:.74rem">reverb space max\nstudio ambience\ndepth control</div>
            <button class="btn-copy" onclick="copyAndSpend('reverb space max | studio ambience | depth control',40)">Copiar</button>
          </div>
          <div class="inj-card">
            <h4>🌊 Estéreo Ancho</h4>
            <div class="output-box mb0" style="font-size:.74rem">wide stereo field\nspatial audio\nimmersive mix</div>
            <button class="btn-copy" onclick="copyAndSpend('wide stereo field | spatial audio | immersive mix',40)">Copiar</button>
          </div>
        </div>
      </div>
    </div>
`;

const CHECKLIST_PANEL = `
    <!-- CHECKLIST -->
    <div id="tab-checklist" class="panel">
      <div class="badge" style="margin-bottom:1.5rem">✦ Checklist Profesional Suno</div>
      <div class="check-progress">
        <div class="cp-label"><span>Progreso de sesión</span><span class="cp-pct" id="cp-pct">0 / 10</span></div>
        <div class="cp-track"><div class="cp-fill" id="cp-fill" style="width:0%"></div></div>
      </div>
      <div id="checklist-container"></div>
      <button class="btn-sec" onclick="resetChecklist()" style="margin-top:1rem">↺ Reiniciar Checklist</button>
    </div>
`;

const ASSIST_HTML = `
  <!-- FLOATING ASSISTANT -->
  <div class="assist-overlay" id="assist-overlay" style="pointer-events:none">
    <div class="assist-panel" id="assist-panel">
      <div class="assist-header">
        <h4>⬡ Asistente Neural</h4>
        <button class="assist-close" onclick="toggleAssist()">✕</button>
      </div>
      <div class="assist-body" id="assist-body">
        <div class="assist-msg bot">¡Hola! Soy tu copiloto para Suno AI. Pregúntame sobre géneros, BPM, estructuras, inyectores Max, o cualquier duda de producción.</div>
      </div>
      <div class="assist-input-row">
        <input class="assist-input" id="assist-input" placeholder="Pregunta algo..." onkeydown="if(event.key==='Enter')sendAssist()"/>
        <button class="assist-send" onclick="sendAssist()">→</button>
      </div>
    </div>
  </div>
`;

const JS = `
gsap.registerPlugin(ScrollTrigger);

// ── CURSOR ──
const cur=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;gsap.to(cur,{x:mx,y:my,duration:.08,ease:'none'});});
(function rl(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;gsap.set(ring,{x:rx,y:ry});requestAnimationFrame(rl);})();

// ── TOKENS ──
const MAX_TK=10000;
let tokens=parseInt(localStorage.getItem('sa-tk')||MAX_TK);
let toastTmr;
function fmtTok(n){return n>=1000?(n/1000).toFixed(1)+'K':String(n);}
function updateTokenUI(spent){
  const bar=document.getElementById('tm-bar'),lbl=document.getElementById('tm-label'),toast=document.getElementById('tok-toast');
  const pct=Math.max(0,tokens/MAX_TK*100);
  gsap.to(bar,{width:pct+'%',duration:.8,ease:'power2.out'});
  lbl.textContent=fmtTok(tokens);
  lbl.className='tm-label'+(tokens<1000?' crit':tokens<3000?' warn':'');
  const c=pct<=30?['#ff4444','#f0b429']:pct<=60?['#f0b429','#00ff88']:['#00ff88','#00ffff'];
  gsap.to(bar,{background:'linear-gradient(90deg,'+c[0]+','+c[1]+')',duration:.5});
  if(spent>0){
    const isW=tokens<2000;
    toast.className='tok-toast show '+(isW?'warn':'spend');
    toast.textContent=isW?'⚠ '+fmtTok(tokens)+' tokens restantes':'-'+spent+' · '+fmtTok(tokens)+' restantes';
    clearTimeout(toastTmr);
    toastTmr=setTimeout(()=>{gsap.to(toast,{opacity:0,y:-8,scale:.95,duration:.3,onComplete:()=>toast.classList.remove('show')});},2400);
  }
  localStorage.setItem('sa-tk',tokens);
}
function spendTokens(n){tokens=Math.max(0,tokens-n);updateTokenUI(n);}

// ── BACKGROUND: 3D GRID ──
const gc=document.getElementById('bg-canvas'),gx=gc.getContext('2d');
let GW,GH;
function resizeG(){GW=gc.width=window.innerWidth||screen.width||1920;GH=gc.height=window.innerHeight||screen.height||1080;}
window.addEventListener('resize',resizeG);resizeG();
const ORBS=[{x:.2,y:.7,r:.6,c:'rgba(0,255,136,',a:.06,spd:.0003,off:0},{x:.8,y:.3,r:.5,c:'rgba(255,0,255,',a:.05,spd:.0004,off:2},{x:.5,y:.9,r:.4,c:'rgba(0,255,255,',a:.04,spd:.0005,off:4}];
function drawBG(){
  if(!GW||!GH){requestAnimationFrame(drawBG);return;}
  gx.clearRect(0,0,GW,GH);
  const bg=gx.createRadialGradient(GW/2,GH*.55,0,GW/2,GH*.55,GH*.9);
  bg.addColorStop(0,'rgba(0,22,10,1)');bg.addColorStop(.45,'rgba(6,0,18,1)');bg.addColorStop(1,'rgba(2,3,8,1)');
  gx.fillStyle=bg;gx.fillRect(0,0,GW,GH);
  const T=Date.now()/1000;
  ORBS.forEach(o=>{
    const ox=GW*(o.x+Math.sin(T*o.spd*1000+o.off)*.08),oy=GH*(o.y+Math.cos(T*o.spd*800+o.off)*.06);
    const ag=gx.createRadialGradient(ox,oy,0,ox,oy,GH*o.r);
    ag.addColorStop(0,o.c+o.a+')');ag.addColorStop(1,'transparent');
    gx.fillStyle=ag;gx.fillRect(0,0,GW,GH);
  });
  const hg=gx.createLinearGradient(0,GH*.44,0,GH*.62);
  hg.addColorStop(0,'rgba(0,255,136,0)');hg.addColorStop(.5,'rgba(0,255,136,.045)');hg.addColorStop(1,'rgba(0,255,136,0)');
  gx.fillStyle=hg;gx.fillRect(0,GH*.44,GW,GH*.18);
  const VP={x:GW/2,y:GH*.5},COLS=24,ROWS=22,SPR=GW*1.3,BOT=GH*1.1,TOP=GH*.5;
  const scroll=(T*.14)%1;
  for(let i=0;i<=COLS;i++){
    const r=i/COLS,bx=VP.x+(r-.5)*SPR,tx=VP.x+(r-.5)*2.5,d=Math.abs(r-.5),a=.035+d*.04;
    const gr2=gx.createLinearGradient(tx,TOP,bx,BOT);
    gr2.addColorStop(0,'rgba(0,255,136,0)');gr2.addColorStop(.25,'rgba(0,255,136,'+(a*.4)+')');gr2.addColorStop(1,'rgba(0,255,136,'+a+')');
    gx.beginPath();gx.moveTo(tx,TOP);gx.lineTo(bx,BOT);gx.strokeStyle=gr2;gx.lineWidth=r===.5?1.5:.5;gx.stroke();
  }
  for(let j=0;j<=ROWS;j++){
    const r=((j/ROWS)+scroll)%1,ease=Math.pow(r,2.2),y=TOP+(BOT-TOP)*ease;
    if(y<TOP||y>BOT)continue;
    const lx=VP.x-(VP.x+SPR*.58)*r*1.05,rx2=VP.x+(SPR*.58)*r*1.05,a=ease*.15;
    gx.beginPath();gx.moveTo(lx,y);gx.lineTo(rx2,y);gx.strokeStyle='rgba(0,255,136,'+a+')';gx.lineWidth=.4+ease*.6;gx.stroke();
  }
  [[0,GH*.25,GW*.18,GH*.52,'rgba(255,0,255,.03)'],[GW,GH*.2,GW*.82,GH*.48,'rgba(0,255,255,.025)']].forEach(([x,y,ex,ey,c])=>{
    const sg=gx.createLinearGradient(x,y,ex,ey);sg.addColorStop(0,c);sg.addColorStop(1,'transparent');
    gx.strokeStyle=sg;gx.lineWidth=120;gx.beginPath();gx.moveTo(x,y);gx.lineTo(ex,ey);gx.stroke();
  });
  requestAnimationFrame(drawBG);
}
drawBG();

// ── PARTICLES ──
const pc=document.getElementById('particle-canvas'),px=pc.getContext('2d');
let PW,PH;
function resizeP(){PW=pc.width=window.innerWidth||screen.width||1920;PH=pc.height=window.innerHeight||screen.height||1080;}
window.addEventListener('resize',resizeP);resizeP();
const CHARS='01アイウカキクケ◈⬡✦◎⊕⊗';
const PARTS=Array.from({length:55},()=>({x:Math.random()*PW,y:Math.random()*PH,r:Math.random()*1.5+.3,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.15-.03,a:Math.random()*.3+.04,hue:Math.random()<.6?150:Math.random()<.5?300:180,pulse:Math.random()*Math.PI*2,pspd:Math.random()*.02+.005}));
const STREAMS=Array.from({length:10},()=>({x:Math.random()*PW,y:Math.random()*PH,sp:Math.random()*1.4+.5,len:Math.floor(Math.random()*10+4),trail:[],a:Math.random()*.1+.03,hue:Math.random()<.65?150:300}));
function drawConnections(){
  for(let i=0;i<PARTS.length;i++) for(let j=i+1;j<PARTS.length;j++){
    const dx=PARTS[i].x-PARTS[j].x,dy=PARTS[i].y-PARTS[j].y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<110){px.beginPath();px.moveTo(PARTS[i].x,PARTS[i].y);px.lineTo(PARTS[j].x,PARTS[j].y);px.strokeStyle='rgba(0,255,136,'+(1-d/110)*.04+')';px.lineWidth=.4;px.stroke();}
  }
}
function animParts(){
  if(!PW||!PH){requestAnimationFrame(animParts);return;}
  px.clearRect(0,0,PW,PH);
  STREAMS.forEach(s=>{
    s.y+=s.sp;if(s.y>PH+100){s.y=-80;s.x=Math.random()*PW;}
    s.trail.push({y:s.y,ch:CHARS[Math.floor(Math.random()*CHARS.length)]});
    if(s.trail.length>s.len)s.trail.shift();
    s.trail.forEach((tr,i)=>{px.fillStyle='hsla('+s.hue+',100%,62%,'+(i/s.trail.length*s.a)+')';px.font=(8+i)+'px Space Mono';px.fillText(tr.ch,s.x,tr.y);});
  });
  drawConnections();
  PARTS.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.pulse+=p.pspd;
    if(p.x<-10)p.x=PW+10;if(p.x>PW+10)p.x=-10;
    if(p.y<-10){p.y=PH+10;p.x=Math.random()*PW;}if(p.y>PH+10){p.y=-10;p.x=Math.random()*PW;}
    const pa=p.a*(0.6+Math.sin(p.pulse)*0.4),g2=px.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
    g2.addColorStop(0,'hsla('+p.hue+',100%,70%,'+pa+')');g2.addColorStop(1,'transparent');
    px.fillStyle=g2;px.beginPath();px.arc(p.x,p.y,p.r*5,0,Math.PI*2);px.fill();
  });
  requestAnimationFrame(animParts);
}
animParts();

// ── GRAIN ──
const gr=document.getElementById('grain'),grx=gr.getContext('2d');
function resizeGr(){gr.width=window.innerWidth||screen.width||1920;gr.height=window.innerHeight||screen.height||1080;}
window.addEventListener('resize',resizeGr);resizeGr();
function drawGrain(){
  if(!gr.width||!gr.height){setTimeout(drawGrain,50);return;}
  try{const id=grx.createImageData(gr.width,gr.height),d=id.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=18;}grx.putImageData(id,0,0);}catch(e){}
  setTimeout(drawGrain,50);
}
drawGrain();

// ── CARD HOLO ──
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect(),mx2=(e.clientX-r.left)/r.width,my2=(e.clientY-r.top)/r.height;
    gsap.to(card,{rotateX:(my2-.5)*10,rotateY:(mx2-.5)*-10,duration:.4,ease:'power2.out',transformPerspective:800});
    card.style.setProperty('--mx',mx2*100+'%');card.style.setProperty('--my',my2*100+'%');
  });
  card.addEventListener('mouseleave',()=>{gsap.to(card,{rotateX:0,rotateY:0,duration:.6,ease:'elastic.out(1,.4)'});});
});

// ── RIPPLE ──
document.addEventListener('click',e=>{
  const btn=e.target.closest('button,.inj-btn,.btn-copy,.btn-main,.menu-item,.history-item,.checklist-item');
  if(!btn)return;
  const r=btn.getBoundingClientRect(),rp=document.createElement('span');
  rp.className='ripple';const size=Math.max(r.width,r.height);
  rp.style.cssText='width:'+size+'px;height:'+size+'px;left:'+(e.clientX-r.left-size/2)+'px;top:'+(e.clientY-r.top-size/2)+'px';
  btn.appendChild(rp);setTimeout(()=>rp.remove(),600);
});

// ── ANIMATIONS ──
function animateIn(){
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.from('.nav-header',{y:-64,opacity:0,duration:.6})
    .from('.brand-dot',{scale:0,opacity:0,duration:.4},'-=.2')
    .from('.sidebar .menu-item',{opacity:0,x:-20,stagger:.06,duration:.4},'-=.2')
    .from('.hero-title',{opacity:0,y:30,duration:.7},'-=.3')
    .from('.stats-row .stat-box',{opacity:0,y:20,stagger:.08,duration:.4},'-=.4')
    .from('.card',{opacity:0,y:24,stagger:.1,duration:.5},'-=.3');
  document.querySelector('#tab-home').style.opacity=1;
}
function switchTab(id,el){
  const current=document.querySelector('.panel.active');
  if(current){
    gsap.to(current,{opacity:0,y:8,duration:.2,ease:'power2.in',onComplete:()=>{
      current.classList.remove('active');current.style.display='none';
      const next=document.getElementById('tab-'+id);
      next.style.display='block';next.classList.add('active');
      gsap.fromTo(next,{opacity:0,y:16},{opacity:1,y:0,duration:.4,ease:'power3.out'});
      gsap.from(next.querySelectorAll('.card,.playbook-card,.vid-card,.checklist-item'),{opacity:0,y:18,stagger:.05,duration:.35,ease:'power3.out'});
    }});
  }
  document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('active'));
  if(el)el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function countUp(){
  document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
    const target=parseInt(el.dataset.target);
    gsap.from({val:0},{val:target,duration:1.5,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(this.targets()[0].val);},delay:.5});
  });
}

// ── INJECTORS ──
let activeInj=[];
function toggleInj(btn,name){
  btn.classList.toggle('active');
  if(activeInj.includes(name)){activeInj=activeInj.filter(i=>i!==name);gsap.to(btn,{scale:1,duration:.2});}
  else{activeInj.push(name);gsap.fromTo(btn,{scale:.92},{scale:1,duration:.4,ease:'elastic.out(1.2,.5)'});}
  updateQuality();
}
function resetInjectors(){
  activeInj=[];document.querySelectorAll('.inj-btn').forEach(b=>b.classList.remove('active'));
}

// ── QUALITY SCORE ──
function updateQuality(){
  const bpm=parseInt(document.getElementById('bpm').value);
  const bpmLabel=document.getElementById('bpm-val-label');
  if(bpm<80)bpmLabel.textContent='Lento';
  else if(bpm<100)bpmLabel.textContent='Tranquilo';
  else if(bpm<120)bpmLabel.textContent='Moderado';
  else if(bpm<140)bpmLabel.textContent='Dinámico';
  else if(bpm<160)bpmLabel.textContent='Rápido';
  else bpmLabel.textContent='Muy Rápido';

  let score=0;
  if(document.getElementById('vision').value.trim().length>10)score+=20;
  if(document.getElementById('genre').value)score+=15;
  if(document.getElementById('subgenre').value.trim())score+=10;
  if(document.getElementById('mood').value)score+=10;
  if(document.getElementById('instr').value.trim())score+=15;
  if(document.getElementById('theme').value.trim())score+=10;
  score+=activeInj.length*5;
  score=Math.min(100,score);
  document.getElementById('q-score-text').textContent=score+'%';
  const fill=document.getElementById('q-fill');
  fill.style.width=score+'%';
  const bg=score<40?'linear-gradient(90deg,#ff4444,#f0b429)':score<70?'linear-gradient(90deg,#f0b429,#00ff88)':'linear-gradient(90deg,#00ff88,#00ffff)';
  fill.style.background=bg;
}

// ── GENERATE PROMPT ──
let promptHistory=JSON.parse(localStorage.getItem('sa-hist')||'[]');

function generatePrompt(){
  const vision=document.getElementById('vision').value.trim()||'Sonic Architecture';
  const genre=document.getElementById('genre').value||'Electronic';
  const subgenre=document.getElementById('subgenre').value.trim();
  const bpm=document.getElementById('bpm').value;
  const mood=document.getElementById('mood').value;
  const vocal=document.getElementById('vocal').value;
  const lang=document.getElementById('lang').value;
  const struct=document.getElementById('struct').value;
  const prod=document.getElementById('prod').value;
  const instr=document.getElementById('instr').value.trim();
  const theme=document.getElementById('theme').value.trim();

  // ── BUILD STYLE FIELD ──
  let styleParts=[genre];
  if(subgenre)styleParts.push(subgenre);
  if(mood)styleParts.push(mood);
  styleParts.push(bpm+'bpm');
  styleParts.push(vocal);
  if(instr)styleParts.push(instr);
  styleParts.push(prod);
  if(activeInj.includes('fidelity'))styleParts.push('is mode max, quality max max');
  if(activeInj.includes('vocals'))styleParts.push('vocal clarity max');
  if(activeInj.includes('bass'))styleParts.push('bass depth max, sub-bass presence');
  if(activeInj.includes('reverb'))styleParts.push('reverb space max, studio ambience');
  if(activeInj.includes('dynamics'))styleParts.push('dynamics live, responsive, punchy');
  if(activeInj.includes('stereo'))styleParts.push('wide stereo field, spatial audio');
  const styleField=styleParts.join(', ');

  // ── BUILD LYRICS FIELD ──
  let lyricsField='[Intro]\\n';
  lyricsField+=struct.split(', ').map(s=>'['+s+']').join('\\n')+'\\n\\n';
  if(lang!=='Instrumental')lyricsField+='Language: '+lang+'\\n';
  if(theme)lyricsField+='Theme: '+theme+'\\n';
  if(vision)lyricsField+='Vision: '+vision+'\\n';
  if(activeInj.includes('fidelity')){
    lyricsField+='\\nis mode max\\nquality max max\\nrealins max max\\nreal instrument max max\\n';
  }

  // ── OUTPUT PREVIEW ──
  const outPreview=genre+(subgenre?' / '+subgenre:'')+(mood?', '+mood:'')+', '+bpm+'bpm\\n'+vocal+(instr?'\\nInstr: '+instr:'');

  document.getElementById('input-display').textContent=vision;
  document.getElementById('output-preview').textContent=outPreview;
  document.getElementById('style-field-text').textContent=styleField;
  document.getElementById('lyrics-field-text').textContent=lyricsField;
  document.getElementById('full-field-text').textContent='--- STYLE FIELD ---\\n'+styleField+'\\n\\n--- LYRICS FIELD ---\\n'+lyricsField;

  const sec=document.getElementById('output-section');
  if(sec.style.display==='none'){
    sec.style.display='block';
    gsap.fromTo(sec,{opacity:0,y:20},{opacity:1,y:0,duration:.5,ease:'power3.out'});
  } else {
    gsap.fromTo(sec,{opacity:.6},{opacity:1,duration:.3});
  }
  sec.scrollIntoView({behavior:'smooth',block:'nearest'});
  spendTokens(50);

  // ── SAVE HISTORY ──
  const entry={style:styleField,lyrics:lyricsField,genre,mood,bpm,time:new Date().toLocaleTimeString(),ts:Date.now()};
  promptHistory.unshift(entry);
  if(promptHistory.length>10)promptHistory.pop();
  localStorage.setItem('sa-hist',JSON.stringify(promptHistory));
  renderHistory();
}

function showOutTab(name,el){
  ['style','lyrics','full'].forEach(t=>{
    document.getElementById('out-'+t).style.display=t===name?'block':'none';
  });
  document.querySelectorAll('.out-tab').forEach(t=>t.classList.remove('active'));
  if(el)el.classList.add('active');
}

function copyField(name){
  let text='';
  if(name==='style')text=document.getElementById('style-field-text').textContent;
  else if(name==='lyrics')text=document.getElementById('lyrics-field-text').textContent;
  else text=document.getElementById('full-field-text').textContent;
  copyAndSpend(text,20);
}

// ── HISTORY ──
function renderHistory(){
  const el=document.getElementById('history-list');
  if(!promptHistory.length){el.innerHTML='<p style="color:var(--dim);font-size:.78rem">Aún no has generado prompts.</p>';return;}
  el.innerHTML=promptHistory.map((h,i)=>'<div class="history-item" onclick="loadHistory('+i+')"><div class="hist-preview">'+h.genre+(h.mood?', '+h.mood:'')+' · '+h.bpm+'bpm</div><span class="hist-time">'+h.time+'</span><button class="hist-load" onclick="event.stopPropagation();loadHistory('+i+')">Cargar</button></div>').join('');
}
function loadHistory(i){
  const h=promptHistory[i];
  document.getElementById('style-field-text').textContent=h.style;
  document.getElementById('lyrics-field-text').textContent=h.lyrics;
  document.getElementById('output-section').style.display='block';
  gsap.fromTo(document.getElementById('output-section'),{opacity:.5},{opacity:1,duration:.3});
  showNotify('✓ Prompt cargado desde historial');
}
function clearHistory(){promptHistory=[];localStorage.removeItem('sa-hist');renderHistory();}

// ── COPY ──
function copyAndSpend(text,cost){
  navigator.clipboard.writeText(text).then(()=>{spendTokens(cost);showNotify('✓ Copiado al portapapeles');})
  .catch(()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();spendTokens(cost);showNotify('✓ Copiado');});
}
function showNotify(msg){
  const n=document.createElement('div');n.className='notify';n.textContent=msg;document.body.appendChild(n);
  gsap.to(n,{opacity:0,y:10,duration:.4,delay:1.8,ease:'power2.in',onComplete:()=>n.remove()});
}

// ── VIDEOS ──
const VIDEOS=[
  {title:'Estructura Real de Prompts',id:'zVzsVOoIfLY',t:'10s',tag:'fundamentos'},
  {title:'Workflow Profesional',id:'lZQ9gF-f9E0',t:'14s',tag:'workflow'},
  {title:'Ingeniería de Estilo',id:'3nL2aWNXJQw',t:'823s',tag:'estilo'},
  {title:'Secretos Max Mode',id:'XjmaO4ixy5Y',t:'5s',tag:'max mode'},
  {title:'Consistencia Vocal',id:'R3yMFYua2wg',t:'0s',tag:'voces'},
  {title:'Mezcla IA Pro',id:'-MMYt8zi9e0',t:'7s',tag:'mezcla'},
  {title:'Diseño de Instrumentos',id:'f2msbSVOO1U',t:'8s',tag:'instrumentos'},
  {title:'Arquitectura de Letras',id:'DIToC1PVXJE',t:'6s',tag:'letras'},
  {title:'Neural Copilot Guía',id:'icQDqvlIj-A',t:'12s',tag:'copilot'},
  {title:'Estrategias Viral Hit',id:'r60dTNcZntE',t:'6s',tag:'viral'},
  {title:'Masterclass Futuro',id:'iytq802OFLo',t:'0s',tag:'avanzado'},
  {title:'Suno Sonic Lab v4.5',id:'j6vYBqwDiuE',t:'516s',tag:'lab'},
  {title:'Técnicas Expertas',id:'duUTZlGrdds',t:'0s',tag:'avanzado'},
  {title:'Beats Dinámicos',id:'FwyTrsER0dw',t:'0s',tag:'beats'},
  {title:'Síntesis Neural',id:'cLLXH1IfvwE',t:'1s',tag:'síntesis'},
  {title:'Optimización Micro',id:'CW-nUwyj6Ow',t:'0s',tag:'optimización'},
  {title:'Workflow Pipeline',id:'IN_m5KAoSy4',t:'0s',tag:'workflow'}
];
function initVideos(){
  const g=document.getElementById('video-grid');
  VIDEOS.forEach(v=>{
    const d=document.createElement('div');d.className='vid-card';d.dataset.title=v.title.toLowerCase()+' '+v.tag;
    d.innerHTML='<div class="vid-thumb"><img src="https://img.youtube.com/vi/'+v.id+'/mqdefault.jpg" alt="'+v.title+'" loading="lazy"/></div><div class="vid-info"><h4>'+v.title+'</h4><span style="font-size:.56rem;font-family:var(--fh);color:var(--dim);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;display:block">'+v.tag+'</span><a href="https://www.youtube.com/watch?v='+v.id+'&t='+v.t+'" target="_blank" rel="noopener" class="btn-watch">▶ Ver ahora</a></div>';
    g.appendChild(d);
  });
}
function filterVideos(q){
  const cards=document.querySelectorAll('#video-grid .vid-card');
  let count=0;
  cards.forEach(c=>{
    const match=c.dataset.title.includes(q.toLowerCase());
    c.classList.toggle('hidden',!match);
    if(match)count++;
  });
  document.getElementById('vid-count').textContent=count+' módulo'+(count!==1?'s':'');
}

// ── PLAYBOOKS ──
const PLAYBOOKS=[
  {
    emoji:'🔥',title:'Trap Oscuro',desc:'Producción trap con 808s pesados, hi-hats rolantes y atmósfera oscura. Perfecto para letras introspectivas y agresivas.',
    tags:['Trap','Dark','808s','90-140bpm'],
    config:{genre:'Trap',subgenre:'dark trap, phonk',bpm:140,mood:'dark',vocal:'intimate male, raw, emotional',lang:'Spanish',struct:'Hook-First',prod:'underground, raw, gritty, independent',instr:'808 bass, hi-hats rolling, distorted synth, trap drums',theme:'Poder, oscuridad, soledad urbana',inj:['bass','dynamics']}
  },
  {
    emoji:'🌌',title:'Synthwave Cinemático',desc:'Synthwave evocador con sintetizadores analógicos, arpegios retro y producción cinematográfica años 80.',
    tags:['Synthwave','Retro','Cinematic','100-120bpm'],
    config:{genre:'Synthwave',subgenre:'darksynth, outrun',bpm:110,mood:'nostalgic',vocal:'ethereal female, breathy, intimate',lang:'English',struct:'Estándar (V-C-V-C-B-C)',prod:'cinematic, orchestral, atmospheric, epic',instr:'moog synth, arpeggiator, drum machine, electric bass',theme:'Nostalgia, noche de ciudad, viaje en el tiempo',inj:['reverb','stereo','fidelity']}
  },
  {
    emoji:'⚡',title:'House Eufórico',desc:'House progresivo con énfasis en el drop, sintetizadores flotantes y voces procesadas para pista de baile.',
    tags:['House','EDM','Drop','124-130bpm'],
    config:{genre:'House',subgenre:'progressive house, melodic',bpm:128,mood:'euphoric',vocal:'processed neural, vocoder, robotic',lang:'English',struct:'EDM Structure',prod:'studio quality, high fidelity, professional mastering',instr:'lead synth, chord pads, kick drum, bass line, claps',theme:'Energía, baile, liberación',inj:['bass','stereo','dynamics','fidelity']}
  },
  {
    emoji:'💔',title:'Balada Emocional',desc:'Balada contemporánea con piano como ancla melódica, cuerdas sutiles y voz femenina poderosa.',
    tags:['Ballad','Pop','Piano','70-80bpm'],
    config:{genre:'Indie Pop',subgenre:'emotional ballad, singer-songwriter',bpm:72,mood:'melancholic',vocal:'powerful female, belting, soulful',lang:'Spanish',struct:'Completa',prod:'studio quality, high fidelity, professional mastering',instr:'piano, strings, acoustic guitar, soft drums',theme:'Amor perdido, recuerdos, sanación emocional',inj:['reverb','vocals']}
  }
];
function initPlaybooks(){
  const g=document.getElementById('playbooks-grid');
  PLAYBOOKS.forEach((pb,i)=>{
    const d=document.createElement('div');d.className='playbook-card';
    d.innerHTML='<div class="pb-title">'+pb.emoji+' '+pb.title+'</div><div class="pb-desc">'+pb.desc+'</div><div class="pb-tags">'+pb.tags.map(t=>'<span class="pb-tag">'+t+'</span>').join('')+'</div><button class="btn-main" onclick="applyPlaybook('+i+')"><span>✦ Aplicar en Neural Studio</span></button>';
    g.appendChild(d);
  });
}
function applyPlaybook(i){
  const pb=PLAYBOOKS[i].config;
  document.getElementById('genre').value=pb.genre;
  document.getElementById('subgenre').value=pb.subgenre;
  document.getElementById('bpm').value=pb.bpm;
  document.getElementById('bpm-display').textContent=pb.bpm;
  document.getElementById('mood').value=pb.mood;
  document.getElementById('vocal').value=pb.vocal;
  document.getElementById('lang').value=pb.lang;
  document.getElementById('struct').value=pb.struct;
  document.getElementById('prod').value=pb.prod;
  document.getElementById('instr').value=pb.instr;
  document.getElementById('theme').value=pb.theme;
  resetInjectors();
  pb.inj.forEach(name=>{
    const btn=document.querySelector('.inj-btn[onclick*="'+name+'"]');
    if(btn){btn.classList.add('active');activeInj.push(name);}
  });
  updateQuality();
  switchTab('studio',document.querySelector('.menu-item[onclick*="studio"]'));
  setTimeout(()=>showNotify('✓ Playbook "'+PLAYBOOKS[i].title+'" aplicado'),400);
}

// ── CHECKLIST ──
const CHECKS=[
  {text:'Definir género y subgénero principal',sub:'Específico es mejor: "Dark Trap Phonk" vs solo "Trap"'},
  {text:'Fijar BPM apropiado para el género',sub:'Trap: 130-150, House: 120-135, Ballad: 65-85, Techno: 130-145'},
  {text:'Elegir mood y atmósfera emocional',sub:'El mood debe concordar con el tema de la letra'},
  {text:'Seleccionar tipo de voz correcto',sub:'Prueba 2-3 variantes de voz para el mismo estilo'},
  {text:'Listar instrumentos clave (3-5 max)',sub:'Menos es más: los más importantes definen el sonido'},
  {text:'Activar inyectores de estilo relevantes',sub:'Fidelity Max para calidad de estudio, Bass para peso'},
  {text:'Escribir tema/contexto de la letra',sub:'Suno AI usa el contexto para elegir vocabulario y emoción'},
  {text:'Generar 4-6 variaciones del prompt',sub:'La calidad emerge estadísticamente entre variaciones'},
  {text:'Revisar Style Field (máx 200 chars)',sub:'Si excede el límite, priorizar género, BPM y mood'},
  {text:'Aplicar Max Mode codes si necesario',sub:'is mode max, quality max max para calidad de estudio'}
];
let checkState=JSON.parse(localStorage.getItem('sa-check')||'[]').concat(Array(10).fill(false)).slice(0,10);
function initChecklist(){
  const c=document.getElementById('checklist-container');
  CHECKS.forEach((ch,i)=>{
    const d=document.createElement('div');d.className='checklist-item'+(checkState[i]?' done':'');d.onclick=()=>toggleCheck(i,d);
    d.innerHTML='<span class="ci-num">'+String(i+1).padStart(2,'0')+'</span><div class="ci-check">'+(checkState[i]?'✓':'')+'</div><div><div class="ci-text">'+ch.text+'<span class="ci-sub">'+ch.sub+'</span></div></div>';
    c.appendChild(d);
  });
  updateCheckProgress();
}
function toggleCheck(i,el){
  checkState[i]=!checkState[i];
  el.classList.toggle('done',checkState[i]);
  el.querySelector('.ci-check').textContent=checkState[i]?'✓':'';
  localStorage.setItem('sa-check',JSON.stringify(checkState));
  updateCheckProgress();
  if(checkState[i])gsap.fromTo(el,{scale:.98},{scale:1,duration:.3,ease:'elastic.out(1.2,.5)'});
}
function updateCheckProgress(){
  const done=checkState.filter(Boolean).length;
  document.getElementById('cp-pct').textContent=done+' / 10';
  const pct=done*10;
  document.getElementById('cp-fill').style.width=pct+'%';
}
function resetChecklist(){
  checkState=Array(10).fill(false);
  localStorage.setItem('sa-check',JSON.stringify(checkState));
  document.querySelectorAll('.checklist-item').forEach(el=>{el.classList.remove('done');el.querySelector('.ci-check').textContent='';});
  updateCheckProgress();
  showNotify('✓ Checklist reiniciado');
}

// ── ASSISTANT ──
const KB=[
  {q:['bpm','tempo','velocidad'],a:'El BPM óptimo depende del género: Trap 130-150, House 120-135, Techno 130-145, Ballad 65-85, Lo-Fi 75-90, Drum & Bass 160-180.'},
  {q:['max mode','is mode max','fidelidad','calidad'],a:'Max Mode = calidad de estudio. Añade al Lyrics Field: "is mode max / quality max max / realins max max / real instrument max max". Funciona mejor con géneros acústicos y cinematic.'},
  {q:['style field','campo de estilo','200'],a:'El Style Field tiene límite de ~200 caracteres. Prioriza: Género, Subgénero, Mood, BPM, Tipo de Voz. Usa comas para separar. Suno lo lee como metadatos de producción.'},
  {q:['voz','vocal','femenina','masculina'],a:'Las voces más versátiles: "ethereal female, breathy" para indie/pop, "intimate male, raw" para trap/rock, "processed neural, vocoder" para EDM/cyberpunk. Prueba variaciones.'},
  {q:['estructura','verse','chorus','bridge'],a:'Hook-First es ideal para hits virales (empieza en el coro). Estándar V-C-V-C-B-C para pop clásico. EDM Structure con Intro-Build-Drop para música electrónica.'},
  {q:['trap','808'],a:'Para Trap usa: "808 bass, sub-heavy, hi-hats rolling, trap drums" + inyector Bajos Profundos. BPM: 130-150. Mood: dark, aggressive, melancholic.'},
  {q:['synthwave','retrowave','80s'],a:'Synthwave: Usa "moog synth, arpeggiator, drum machine, analog bass" + Reverb Studio + Estéreo Ancho. BPM: 100-120. Mood: nostalgic, dreamy, retrofuturistic.'},
  {q:['letra','lyrics','tema','idioma'],a:'El Lyrics Field acepta estructura con etiquetas: [Verse], [Chorus], [Bridge]. Añade Language: Spanish/English y Theme: tu tema. Suno usará esto como guía temática.'},
  {q:['variaciones','variantes','múltiple'],a:'Genera siempre 4-6 variaciones del mismo prompt. Suno tiene aleatoriedad incorporada — la calidad emerge entre intentos. No edites el prompt entre variaciones para comparación justa.'},
  {q:['duet','dúo','dos voces'],a:'Para duetos: activa vocal "Dueto Armónico" y añade al Lyrics Field: "duet start on through / male start on [frase] / female start on [frase]". Funciona mejor en baladas y pop.'},
  {q:['house','edm','electrónica','drop'],a:'House/EDM: Usa EDM Structure con Build-Drop. Inyectores: Fidelidad Max + Bajos + Estéreo. BPM: 124-130. Voces procesadas con vocoder funcionan bien.'},
  {q:['piano','cuerdas','orquestal','cinematic'],a:'Para cinematico: "orchestral strings, piano, brass section, epic drums" + prod "cinematic, orchestral, atmospheric". Inyector Reverb Studio esencial. Sin Max Mode (puede saturar el sonido orgánico).'},
  {q:['tokens','créditos'],a:'Los tokens son un sistema de gamificación local. Cada generación cuesta 50 tokens, cada copia 20. Se almacenan en tu navegador y se pueden resetear limpiando localStorage.'},
];
let assistOpen=false;
function toggleAssist(){
  assistOpen=!assistOpen;
  const panel=document.getElementById('assist-panel');
  const overlay=document.getElementById('assist-overlay');
  panel.classList.toggle('open',assistOpen);
  overlay.style.pointerEvents=assistOpen?'all':'none';
  if(assistOpen)setTimeout(()=>document.getElementById('assist-input').focus(),350);
}
function sendAssist(){
  const input=document.getElementById('assist-input');
  const q=input.value.trim();if(!q)return;
  const body=document.getElementById('assist-body');
  body.innerHTML+='<div class="assist-msg user">'+q+'</div>';
  input.value='';
  const ql=q.toLowerCase();
  let answer='No tengo información específica sobre eso, pero puedes explorar los recursos del Academy o los Playbooks para más contexto sobre producción en Suno AI.';
  for(const k of KB){if(k.q.some(w=>ql.includes(w))){answer=k.a;break;}}
  setTimeout(()=>{
    body.innerHTML+='<div class="assist-msg bot">'+answer+'</div>';
    body.scrollTop=body.scrollHeight;
  },350);
  body.scrollTop=body.scrollHeight;
  spendTokens(10);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded',()=>{
  updateTokenUI(0);
  initVideos();
  initPlaybooks();
  initChecklist();
  renderHistory();
  animateIn();
  setTimeout(countUp,600);
});
`;

const HTML = HTML_TOP + HOME_PANEL + STUDIO_PANEL + ACADEMY_PANEL + PLAYBOOKS_PANEL + MAX_PANEL + CHECKLIST_PANEL + `
  </main>
</div>
` + ASSIST_HTML + `
<script>
${JS}
</script>
</body>
</html>`;

const path = require('path');
const outPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outPath, HTML, 'utf8');
console.log('Built ' + outPath + ' — ' + HTML.length + ' bytes');
