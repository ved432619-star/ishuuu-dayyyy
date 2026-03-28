/* ═══════════════════════════════════════════════
   for my bby 💗  ·  script.js  ·  v3
═══════════════════════════════════════════════ */
'use strict';

// ── AUDIO ──────────────────────────────────────
const audio = new (window.AudioContext || window.webkitAudioContext)();
function tone(freq, dur, type='sine', vol=0.26) {
    if (audio.state==='suspended') return;
    const o=audio.createOscillator(), g=audio.createGain();
    o.connect(g); g.connect(audio.destination);
    o.type=type; o.frequency.value=freq;
    const t=audio.currentTime;
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(vol,t+.05);
    g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.start(t); o.stop(t+dur);
}
const playChime  = () => [523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.5),i*100));
const playPop    = () => { tone(600,.12); setTimeout(()=>tone(300,.1),60); };
const playIntro  = () => [523,587,659,698,784].forEach((f,i)=>setTimeout(()=>tone(f,.4,'sine',.12),i*275));
const playLetter = () => [784,880,988,1047,1175].forEach((f,i)=>setTimeout(()=>tone(f,.65,'sine',.17),i*138));

let ambientOn=false;
function startAmbient(){
    if(ambientOn)return; ambientOn=true;
    const scale=[261,294,330,392,440,523,587,659], pat=[0,2,4,7,4,2,0,1,3,5,3,1,2,4,6,4];
    let i=0;
    setInterval(()=>{
        if(audio.state==='suspended')return;
        const o=audio.createOscillator(),g=audio.createGain();
        o.connect(g); g.connect(audio.destination);
        o.type='triangle'; o.frequency.value=scale[pat[i++%pat.length]];
        const t=audio.currentTime;
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.028,t+.22);
        g.gain.exponentialRampToValueAtTime(.001,t+1.5); o.start(t); o.stop(t+1.5);
    },750);
}

// ── INTRO ──────────────────────────────────────
function initIntro(){
    const intro=document.getElementById('introScreen');
    if(!intro)return;
    intro.addEventListener('click',()=>{
        if(audio.state==='suspended') audio.resume();
        playIntro(); startAmbient();
        intro.style.transition='opacity .9s ease';
        intro.style.opacity='0';
        setTimeout(()=>{
            intro.style.display='none';
            showPage('p1');
            animateTitle();
            spawnP1Photos();
            spawnP1Stickers();
            startRosePetals();
        },900);
    },{once:true});
}

// ── EYE BLINK ──────────────────────────────────
function eyeBlink(onMid){
    const blink=document.getElementById('eyeBlink');
    blink.classList.add('blinking');
    setTimeout(()=>{ if(onMid) onMid(); },260);
    setTimeout(()=>{ blink.classList.remove('blinking'); },540);
}

// ── PAGE SYSTEM ────────────────────────────────
function showPage(id){
    document.querySelectorAll('.page').forEach(p=>{
        p.classList.remove('show'); p.style.opacity=''; p.style.pointerEvents='';
    });
    document.getElementById(id).classList.add('show');
}
function goTo(fromId, toId, onDone){
    eyeBlink(()=>{
        const from=document.getElementById(fromId), to=document.getElementById(toId);
        from.classList.remove('show'); from.style.opacity='';
        to.classList.add('show','page-enter'); void to.offsetWidth;
        setTimeout(()=>{ to.classList.remove('page-enter'); if(onDone)onDone(); },550);
    });
}

// ── TITLE ANIMATION ────────────────────────────
function animateTitle(){
    const el=document.getElementById('mainTitle');
    if(!el)return; el.innerHTML='';
    [...'hey my bby 💗'].forEach((ch,i)=>{
        const s=document.createElement('span');
        s.className='title-letter';
        s.textContent=ch===' '?'\u00A0':ch;
        s.style.animationDelay=`${i*.065}s`;
        el.appendChild(s);
    });
}


/* ══════════════════════════════════════════════
   PAGE 1 · MIDNIGHT VELVET ROSE
══════════════════════════════════════════════ */

// Rose petal rain
function startRosePetals(){
    const rain=document.getElementById('roseRain');
    if(!rain||rain.dataset.on)return; rain.dataset.on='1';
    const roses=['🌹','🌸','🌺','✿','❀'];
    const spawn=()=>{
        const el=document.createElement('div'); el.className='rose-petal';
        el.textContent=roses[Math.floor(Math.random()*roses.length)];
        Object.assign(el.style,{
            left:Math.random()*100+'%',
            fontSize:(Math.random()*12+9)+'px',
            animationDuration:(Math.random()*6+8)+'s',
            animationDelay:(Math.random()*.5)+'s',
        });
        rain.appendChild(el); setTimeout(()=>el.remove(),15000);
    };
    spawn(); spawn(); setInterval(spawn,2200);
}

// Gilded oval constellation frames
function spawnP1Photos(){
    const page=document.getElementById('p1');
    if(page.dataset.photos)return; page.dataset.photos='1';

    // gold string SVG
    const stringSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    stringSvg.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;z-index:4;pointer-events:none;overflow:visible;';
    const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML=`<filter id="gGlow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    stringSvg.appendChild(defs);
    page.appendChild(stringSvg);

    // 6 frames hanging at varied heights across the full width
    const frames=[
        {n:4,  cap:'ethereal',  pct:4,   strLen:110, w:82, h:100, tilt:-4,  del:'0s',   dur:'4.5s'},
        {n:43, cap:'glowing',   pct:18,  strLen:75,  w:70, h:88,  tilt:3,   del:'0.3s', dur:'5.2s'},
        {n:9,  cap:'stunning',  pct:33,  strLen:130, w:78, h:96,  tilt:-2,  del:'0.7s', dur:'4.8s'},
        {n:27, cap:'so pretty', pct:62,  strLen:90,  w:80, h:98,  tilt:4,   del:'1.0s', dur:'4.2s'},
        {n:55, cap:'gorgeous',  pct:77,  strLen:115, w:72, h:90,  tilt:-3,  del:'0.4s', dur:'5.0s'},
        {n:44, cap:'my world',  pct:91,  strLen:80,  w:84, h:104, tilt:2,   del:'0.8s', dur:'4.6s'},
    ];

    frames.forEach(fd=>{
        // string line
        const line=document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1',fd.pct+'%'); line.setAttribute('y1','0%');
        line.setAttribute('x2',fd.pct+'%'); line.setAttribute('y2',fd.strLen+'px');
        line.setAttribute('stroke','rgba(212,160,86,.4)'); line.setAttribute('stroke-width','0.8');
        line.setAttribute('filter','url(#gGlow)');
        stringSvg.appendChild(line);

        const wrap=document.createElement('div');
        wrap.className='p1-photo';
        wrap.style.cssText=`left:calc(${fd.pct}% - ${fd.w/2}px);top:${fd.strLen}px;width:${fd.w}px;--tilt:${fd.tilt}deg;animation-delay:${fd.del};animation-duration:${fd.dur};`;

        const frame=document.createElement('div');
        frame.className='portrait-frame';
        frame.style.cssText=`width:${fd.w}px;height:${fd.h}px;`;

        const img=document.createElement('img');
        img.src=`photo%20%28${fd.n}%29.jpeg`; img.alt=''; img.loading='lazy';
        img.style.cssText=`width:${fd.w-8}px;height:${fd.h-8}px;object-fit:cover;display:block;`;
        img.onerror=()=>{ wrap.style.display='none'; };

        const cap=document.createElement('div'); cap.className='pcap'; cap.textContent=fd.cap;
        frame.appendChild(img); wrap.append(frame,cap);
        page.appendChild(wrap);
    });
}

// Gold dust stickers
function spawnP1Stickers(){
    const page=document.getElementById('p1');
    if(page.dataset.stickers)return; page.dataset.stickers='1';
    [
        ['✨','24%','4%', '-12deg','24px','0s',   '3.2s'],
        ['🌟','70%','4%', '10deg', '20px','0.4s', '3.8s'],
        ['💫','4%', '35%','-8deg', '22px','0.8s', '4.1s'],
        ['✦', '90%','35%','12deg', '18px','0.2s', '3.6s'],
        ['🌹','46%','93%','-6deg', '18px','1.4s', '4.8s'],
        ['🌸','16%','90%','-10deg','18px','0.9s', '3.9s'],
        ['✿', '76%','90%','14deg', '20px','0.3s', '4.2s'],
        ['💎','93%','22%','-14deg','16px','1.5s', '3.3s'],
        ['🌺','5%', '20%','11deg', '16px','0.5s', '4.0s'],
    ].forEach(([e,l,t,r,sz,del,dur])=>{
        const el=document.createElement('div'); el.className='p1-sticker';
        el.textContent=e;
        el.style.cssText=`left:${l};top:${t};font-size:${sz};--rot:${r};animation-delay:${del};animation-duration:${dur};`;
        page.appendChild(el);
    });
}


/* ══════════════════════════════════════════════
   PAGE 2 · SAKURA NIGHT
══════════════════════════════════════════════ */
function spawnP2Decor(){
    const page=document.getElementById('p2');
    if(page.dataset.built)return; page.dataset.built='1';

    // sakura petal rain
    const layer=document.getElementById('sakuraLayer');
    if(layer){
        const spawnPetal=()=>{
            const el=document.createElement('div'); el.className='sakura-petal';
            const sz=Math.random()*10+8;
            Object.assign(el.style,{
                left:Math.random()*110-5+'%', top:'-20px',
                '--sz':sz+'px', '--drift':((Math.random()-.5)*80)+'px',
                width:sz+'px', height:sz+'px',
                animationDuration:(Math.random()*5+8)+'s',
                animationDelay:(Math.random()*.6)+'s',
                transform:`rotate(${Math.random()*180}deg)`,
            });
            layer.appendChild(el); setTimeout(()=>el.remove(),14000);
        };
        spawnPetal(); spawnPetal(); spawnPetal();
        setInterval(spawnPetal,900);
    }

    // INSTAX photos — scattered at wild angles, different sizes, across the whole page
    const instax=[
        {n:3,  cap:'pretty 🌸',  left:'1%',  top:'6%',   w:80,  rot:-18, del:'0s',   dur:'4.8s'},
        {n:6,  cap:'stunning ✨', left:'6%',  top:'54%',  w:70,  rot:12,  del:'0.5s', dur:'4.2s'},
        {n:15, cap:'wow 💕',      left:'2%',  top:'78%',  w:75,  rot:-8,  del:'1.0s', dur:'5.0s'},
        {n:25, cap:'glowing 🌺',  left:'85%', top:'4%',   w:80,  rot:15,  del:'0.3s', dur:'4.5s'},
        {n:42, cap:'ethereal 🌙', left:'88%', top:'52%',  w:72,  rot:-14, del:'0.9s', dur:'4.0s'},
        {n:48, cap:'magic 💜',    left:'84%', top:'80%',  w:76,  rot:9,   del:'0.6s', dur:'4.7s'},
        {n:51, cap:'radiant ✨',  left:'14%', top:'2%',   w:65,  rot:22,  del:'1.2s', dur:'5.2s'},
        {n:66, cap:'softness 🩷', left:'78%', top:'24%',  w:62,  rot:-20, del:'0.2s', dur:'4.4s'},
    ];

    instax.forEach(pd=>{
        const wrap=document.createElement('div'); wrap.className='p2-photo';
        wrap.style.cssText=`left:${pd.left};top:${pd.top};width:${pd.w}px;--rot:${pd.rot}deg;animation-delay:${pd.del};animation-duration:${pd.dur};`;
        const card=document.createElement('div'); card.className='instax';
        card.style.cssText=`width:${pd.w}px;`;
        const img=document.createElement('img');
        img.src=`photo%20%28${pd.n}%29.jpeg`; img.alt=''; img.loading='lazy';
        img.onerror=()=>{ wrap.style.display='none'; };
        const cap=document.createElement('div'); cap.className='scap'; cap.textContent=pd.cap;
        card.append(img,cap); wrap.appendChild(card); page.appendChild(wrap);
    });

    // sakura stickers
    [
        ['🌸','24%','4%', '-15deg','22px','0s',   '3.2s'],
        ['🌷','72%','4%', '10deg', '20px','0.4s', '3.8s'],
        ['✿', '4%', '35%','-8deg', '20px','0.8s', '4.1s'],
        ['🌺','90%','35%','12deg', '18px','0.2s', '3.6s'],
        ['💮','46%','3%', '5deg',  '18px','1.1s', '4.4s'],
        ['🩷','46%','93%','-6deg', '16px','1.4s', '4.8s'],
        ['🌸','16%','90%','-10deg','18px','0.9s', '3.9s'],
        ['✨','76%','90%','14deg', '18px','0.3s', '4.2s'],
    ].forEach(([e,l,t,r,sz,del,dur])=>{
        const el=document.createElement('div'); el.className='p2-sticker';
        el.textContent=e;
        el.style.cssText=`left:${l};top:${t};font-size:${sz};--rot:${r};animation-delay:${del};animation-duration:${dur};`;
        page.appendChild(el);
    });
}


/* ══════════════════════════════════════════════
   PAGE 3 · ROSE GOLD COSMOS
══════════════════════════════════════════════ */
function buildStarfield(){
    const sf=document.getElementById('starfield');
    if(!sf||sf.dataset.built)return; sf.dataset.built='1';
    for(let i=0;i<55;i++){
        const s=document.createElement('div'); s.className='star';
        const sz=Math.random()*2.2+.4;
        Object.assign(s.style,{width:sz+'px',height:sz+'px',left:Math.random()*100+'%',top:Math.random()*100+'%',animationDuration:(Math.random()*3+2.5)+'s',animationDelay:(Math.random()*5)+'s'});
        sf.appendChild(s);
    }
}

function buildCdPhotos(){
    const page=document.getElementById('p3');
    if(page.dataset.photos)return; page.dataset.photos='1';

    // film reel photos — top strip and bottom strip scrolling opposite directions
    const topPhotos=[{n:8},{n:20},{n:37},{n:62},{n:71},{n:24},{n:11},{n:17}];
    const botPhotos=[{n:38},{n:45},{n:50},{n:56},{n:60},{n:66},{n:72},{n:13}];
    const captions=['ethereal','stunning','gorgeous','glowing','radiant','dreamy','iconic','magic'];

    [
        {strip:document.getElementById('reelTopStrip'), photos:topPhotos, h:82},
        {strip:document.getElementById('reelBotStrip'), photos:botPhotos, h:82},
    ].forEach(({strip,photos,h})=>{
        if(!strip)return;
        // duplicate for seamless loop
        [...photos,...photos].forEach((pd,i)=>{
            const frame=document.createElement('div');
            frame.className='cd-film-frame';
            const img=document.createElement('img');
            img.src=`photo%20%28${pd.n}%29.jpeg`; img.alt=''; img.loading='lazy';
            img.style.cssText=`width:${h}px;height:${h}px;`;
            img.onerror=()=>{ frame.style.display='none'; };
            frame.appendChild(img); strip.appendChild(frame);
        });
    });
}


/* ══════════════════════════════════════════════
   GLOBAL AMBIENT
══════════════════════════════════════════════ */
function spawnParticles(){
    const wrap=document.getElementById('particleLayer');
    if(!wrap)return;
    const chars=['✨','⭐','💫','✦','°','·'];
    document.head.insertAdjacentHTML('beforeend',
        `<style>@keyframes pFlt{0%{opacity:0;transform:scale(.5) translateY(0)}18%{opacity:.5}82%{opacity:.22}100%{opacity:0;transform:scale(1.1) translateY(-55px)}}</style>`);
    setInterval(()=>{
        const el=document.createElement('div');
        el.textContent=chars[Math.floor(Math.random()*chars.length)];
        Object.assign(el.style,{position:'absolute',left:Math.random()*100+'%',top:Math.random()*100+'%',fontSize:(Math.random()*10+5)+'px',opacity:'0',pointerEvents:'none',willChange:'transform,opacity',animation:`pFlt ${Math.random()*2+2.2}s ease-in-out forwards`});
        wrap.appendChild(el); setTimeout(()=>el.remove(),4400);
    },2500);
}

function spawnHearts(){
    const g=['💗','💕','💖','🩷','❤️','🌸'];
    setInterval(()=>{
        const el=document.createElement('div'); el.className='float-heart';
        el.textContent=g[Math.floor(Math.random()*g.length)];
        Object.assign(el.style,{left:Math.random()*100+'%',bottom:'-40px',fontSize:(Math.random()*14+10)+'px',animationDuration:(Math.random()*2+4)+'s',willChange:'transform,opacity'});
        document.body.appendChild(el); setTimeout(()=>el.remove(),6200);
    },3000);
}

function spawnSparkles(){
    const layer=document.getElementById('sparkleLayer');
    if(!layer)return;
    const c=['✨','⭐','💫','✦','★'];
    setInterval(()=>{
        const el=document.createElement('div'); el.className='sparkle';
        el.textContent=c[Math.floor(Math.random()*c.length)];
        Object.assign(el.style,{left:Math.random()*100+'%',top:Math.random()*90+'%',fontSize:(Math.random()*10+5)+'px',animationDuration:(Math.random()*1.2+2)+'s',willChange:'transform,opacity'});
        layer.appendChild(el); setTimeout(()=>el.remove(),3200);
    },2000);
}


/* ══════════════════════════════════════════════
   TYPING (loading page)
══════════════════════════════════════════════ */
function startTyping(){
    const msgs=[
        'good things take time… and this is very good ✨',
        'loading all the love i have for you…',
        'vedu is preparing something just for you 💗',
        'almost there, hold on tight 🥺',
        'this is made with every piece of my heart…',
    ];
    const el=document.getElementById('typeText');
    if(!el)return;
    let mI=0,cI=0,del=false;
    function tick(){
        const m=msgs[mI];
        if(!del){ el.textContent=m.slice(0,++cI); if(cI===m.length){del=true;setTimeout(tick,1850);return;} }
        else     { el.textContent=m.slice(0,--cI); if(cI===0){del=false;mI=(mI+1)%msgs.length;} }
        setTimeout(tick,del?28:44);
    }
    tick();
}


/* ══════════════════════════════════════════════
   COUNTDOWN
══════════════════════════════════════════════ */
function startCountdown(){
    const target=new Date('April 3, 2026 00:00:00').getTime();
    const pad=n=>String(n).padStart(2,'0');
    function flip(id,val){
        const el=document.getElementById(id);
        if(!el||el.textContent===val)return;
        el.classList.remove('cd-flip'); void el.offsetWidth;
        el.classList.add('cd-flip'); el.textContent=val;
        setTimeout(()=>el.classList.remove('cd-flip'),320);
    }
    const update=()=>{
        const d=target-Date.now();
        if(d<=0){['cd-d','cd-h','cd-m','cd-s'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent='00';});confettiBurst();return;}
        flip('cd-d',pad(Math.floor(d/86400000)));
        flip('cd-h',pad(Math.floor(d/3600000%24)));
        flip('cd-m',pad(Math.floor(d/60000%60)));
        flip('cd-s',pad(Math.floor(d/1000%60)));
    };
    update(); setInterval(update,1000);
}


/* ══════════════════════════════════════════════
   NO BUTTON
══════════════════════════════════════════════ */
const noPhrases=['bby pleaseee say yes 😭💗','NOOO come back!! 😤💕','i made this with love... 🥺','okayy fiineee... jk PLEASE 😂❤️','one more try!! 👉👈✨','you know you want to 😏💗','i stayed up for this 😭🌙','please please please 🙏💗'];
let noCount=0;
document.getElementById('noBtn').addEventListener('click',()=>{
    playPop();
    const msg=document.getElementById('noMsg');
    msg.textContent=noPhrases[noCount++%noPhrases.length]; msg.style.opacity='1';
    const btn=document.getElementById('noBtn');
    const mX=window.innerWidth*.36, mY=window.innerHeight*.3;
    btn.style.transition='transform .38s cubic-bezier(.34,1.56,.64,1)';
    btn.style.transform=`translate(${(Math.random()-.5)*mX}px,${(Math.random()-.5)*mY}px)`;
});


/* ══════════════════════════════════════════════
   PAGE 4 · CORKBOARD (unchanged)
══════════════════════════════════════════════ */
function startPetals(){
    const layer=document.getElementById('petalLayer');
    if(!layer)return;
    const pts=['🌸','🌺','🌷','🌹','💮'];
    const spawn=()=>{
        const el=document.createElement('div'); el.className='petal';
        el.textContent=pts[Math.floor(Math.random()*pts.length)];
        Object.assign(el.style,{left:Math.random()*100+'%',fontSize:(Math.random()*11+9)+'px',animationDuration:(Math.random()*5+8)+'s',animationDelay:(Math.random()*.8)+'s'});
        layer.appendChild(el); setTimeout(()=>el.remove(),14000);
    };
    spawn(); setInterval(spawn,3500);
}

const BULB_COLORS=['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff9eb5','#ffb347','#c678dd'];
function buildLights(){
    const row=document.getElementById('lightsRow');
    if(!row||row.dataset.built)return; row.dataset.built='1';
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('class','lights-wire'); svg.setAttribute('viewBox','0 0 1400 40'); svg.setAttribute('preserveAspectRatio','none');
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d','M0,10 Q175,30 350,10 Q525,30 700,10 Q875,30 1050,10 Q1225,30 1400,10');
    path.setAttribute('stroke','#777'); path.setAttribute('stroke-width','1.5'); path.setAttribute('fill','none');
    svg.appendChild(path); row.appendChild(svg);
    [5,12,20,28,36,44,52,60,68,76,84,92].forEach((pct,i)=>{
        const b=document.createElement('div'); b.className='bulb'; b.style.left=pct+'%';
        const inner=document.createElement('div'); inner.className='bulb-body';
        const clr=BULB_COLORS[i%BULB_COLORS.length];
        inner.style.background=clr; inner.style.animationDelay=(i*.22)+'s';
        document.head.insertAdjacentHTML('beforeend',
            `<style>.bulb:nth-child(${i+2}) .bulb-body::after{box-shadow:0 0 10px 6px ${clr}cc;animation-delay:${i*.22}s}</style>`);
        b.appendChild(inner); row.appendChild(b);
    });
}

function buildBunting(){
    const wrap=document.getElementById('bunting');
    if(!wrap||wrap.dataset.built)return; wrap.dataset.built='1';
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('class','b-wire'); svg.setAttribute('viewBox','0 0 1400 55'); svg.setAttribute('preserveAspectRatio','none');
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d','M0,5 Q100,40 200,5 Q300,40 400,5 Q500,40 600,5 Q700,40 800,5 Q900,40 1000,5 Q1100,40 1200,5 Q1300,40 1400,5');
    path.setAttribute('stroke','#d4698a'); path.setAttribute('stroke-width','1.5'); path.setAttribute('fill','none'); path.setAttribute('opacity','.6');
    svg.appendChild(path); wrap.appendChild(svg);
    const letters=[...'admiring💗the💗admirable✨'];
    const colors=['#ff9eb5','#ffd93d','#6bcb77','#4d96ff','#ff6b6b','#ffb347','#c678dd','#ff8fab'];
    const step=Math.min(5.2,88/letters.length);
    let pct=2;
    letters.forEach((ch,i)=>{
        const f=document.createElement('div');
        const isEmoji=/\p{Emoji_Presentation}/u.test(ch);
        f.className='b-flag'+(isEmoji?' b-emoji':'');
        f.style.left=pct+'%'; f.style.background=colors[i%colors.length];
        f.style.animationDelay=(i*.08)+'s'; f.textContent=ch;
        wrap.appendChild(f); pct+=step;
    });
}

const PHOTO_DATA=[
    {n:1, cap:'my princess 💗'},{n:5, cap:'so pretty 🌸'},{n:7, cap:'stunning ✨'},
    {n:10,cap:'gorgeous 💫'},{n:23,cap:'angel 🧿'},{n:14,cap:'beautiful 🌷'},
    {n:19,cap:'obsessed 😍'},{n:33,cap:'the vibe ⭐'},{n:49,cap:'glowing 💫'},
    {n:52,cap:'perfection 💖'},{n:76,cap:'my world 🌸'},{n:58,cap:'breathtaking 🩷'},
    {n:65,cap:'forever 💗'},{n:35,cap:'iconic 🌟'},{n:30,cap:'ethereal ✨'},
];
const PHOTO_LAYOUT=[
    {left:'0%', top:'18%',rot:-9, w:112},{left:'14%',top:'13%',rot:5,  w:106},{left:'26%',top:'19%',rot:-4,w:110},
    {left:'61%',top:'14%',rot:6,  w:108},{left:'75%',top:'12%',rot:-7,w:112},{left:'85%',top:'17%',rot:4, w:108},
    {left:'0%', top:'48%',rot:6,  w:110},{left:'14%',top:'52%',rot:-5,w:105},{left:'24%',top:'45%',rot:3, w:108},
    {left:'63%',top:'50%',rot:5,  w:106},{left:'75%',top:'46%',rot:-6,w:110},{left:'85%',top:'52%',rot:4, w:107},
    {left:'0%', top:'76%',rot:-7, w:110},{left:'14%',top:'80%',rot:6,  w:105},{left:'77%',top:'75%',rot:-6,w:108},
];
const PIN_COLORS=['#d36b8f','#f9a825','#2980b9','#00b894','#c0392b','#c678dd','#e67e22'];
const HEARTS=['💗','💕','💖','💓','🩷','💝','✨','🌸','⭐'];
const WASHI=['rgba(255,182,193,.72)','rgba(173,216,230,.72)','rgba(200,230,201,.72)','rgba(255,218,185,.72)'];

function buildBoard(){
    const scene=document.getElementById('boardScene');
    if(!scene||scene.dataset.built)return; scene.dataset.built='1';
    const svgStr=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgStr.setAttribute('class','board-string'); svgStr.setAttribute('viewBox','0 0 1400 800'); svgStr.setAttribute('preserveAspectRatio','none');
    ['M90,220 Q260,300 440,220 Q580,300 740,400 Q900,300 1060,220 Q1200,300 1360,220',
     'M90,660 Q300,590 440,660 Q580,590 740,400 Q900,590 1060,660 Q1260,590 1360,660'].forEach(d=>{
        const p=document.createElementNS('http://www.w3.org/2000/svg','path');
        p.setAttribute('d',d); p.setAttribute('stroke','#e74c3c'); p.setAttribute('stroke-width','1.2');
        p.setAttribute('fill','none'); p.setAttribute('stroke-dasharray','4,3'); p.setAttribute('opacity','.38');
        svgStr.appendChild(p);
    });
    scene.appendChild(svgStr);
    PHOTO_DATA.forEach((pd,idx)=>{
        const pos=PHOTO_LAYOUT[idx], pinClr=PIN_COLORS[idx%PIN_COLORS.length];
        const wrap=document.createElement('div');
        wrap.className='pol-wrap'; wrap.style.left=pos.left; wrap.style.top=pos.top; wrap.style.zIndex=5+idx;
        const pol=document.createElement('div');
        pol.className='polaroid'; pol.style.transform=`rotate(${pos.rot}deg)`; pol.style.width=pos.w+'px';
        const pin=document.createElement('div'); pin.className='pol-pin';
        pin.style.background=`radial-gradient(circle at 32% 28%,${pinClr}cc,${pinClr})`;
        if(idx%3===0){
            const w=document.createElement('div'); w.className='washi';
            w.style.background=WASHI[idx%WASHI.length];
            w.style.transform=`rotate(${idx%2===0?'-38deg':'38deg'})`;
            w.style.top='6px'; w.style[idx%2===0?'left':'right']='-14px';
            pol.appendChild(w);
        }
        const img=document.createElement('img');
        img.src=`photo%20%28${pd.n}%29.jpeg`; img.alt=''; img.loading='lazy';
        img.style.cssText='display:block;width:100%;aspect-ratio:1/1;object-fit:cover;';
        img.onerror=()=>{ img.style.minHeight='80px'; img.style.background='#f0d0da'; };
        const cap=document.createElement('p'); cap.className='pol-cap'; cap.textContent=pd.cap;
        const hrt=document.createElement('div'); hrt.className='pol-heart'; hrt.textContent=HEARTS[idx%HEARTS.length];
        pol.append(pin,img,cap,hrt); wrap.appendChild(pol); scene.appendChild(wrap);
    });
    [{bg:'#fff9c4',rot:-3,left:'37%',top:'36%',text:'seeing you feels like heaven must have dropped its best... 🌸'},
     {bg:'#ffd6e8',rot:2, left:'53%',top:'36%',text:'calling you my bestfriend feels like showing off in front of the whole universe 💗'},
     {bg:'#c8f7c5',rot:-2,left:'37%',top:'68%',text:'your chubby cheeks make you the sweetest kuchu-puchu bacha 😭🔥'},
     {bg:'#d6eaff',rot:3, left:'53%',top:'68%',text:'elegance in every curve — the universe shaped pure desire and called it you ✨'},
    ].forEach((nd,i)=>{
        const note=document.createElement('div'); note.className='sticky';
        note.style.cssText=`background:${nd.bg};transform:rotate(${nd.rot}deg);left:${nd.left};top:${nd.top};z-index:10;`;
        const pin=document.createElement('div'); pin.className='sticky-pin'; pin.style.background=PIN_COLORS[(i+2)%PIN_COLORS.length];
        const lines=document.createElement('div'); lines.className='sticky-lines';
        const p=document.createElement('p'); p.textContent=nd.text;
        note.append(pin,lines,p); scene.appendChild(note);
    });
    const envWrap=document.createElement('div'); envWrap.className='env-wrap';
    envWrap.style.cssText='left:50%;top:50%;transform:translate(-50%,-50%);z-index:12;';
    const env=document.createElement('div'); env.className='envelope'; env.id='envelope'; env.onclick=openEnvelope;
    const flap=document.createElement('div'); flap.className='env-flap'; flap.id='envFlap';
    const body=document.createElement('div'); body.className='env-body';
    const seal=document.createElement('div'); seal.className='env-seal'; seal.id='envSeal'; seal.textContent='💌';
    const hint=document.createElement('p'); hint.className='env-hint'; hint.textContent='tap to open';
    body.append(seal,hint); env.append(flap,body);
    const lbl=document.createElement('p'); lbl.className='env-label'; lbl.textContent='pure facts 💗';
    envWrap.append(env,lbl); scene.appendChild(envWrap);
    [{e:'🎀',l:'40%',t:'13%',d:'0s',  s:'26px'},{e:'🌸',l:'91%',t:'14%',d:'.6s',s:'22px'},
     {e:'✨',l:'24%',t:'33%',d:'1.1s',s:'19px'},{e:'🌷',l:'75%',t:'33%',d:'1.7s',s:'21px'},
     {e:'💫',l:'8%', t:'13%',d:'1.4s',s:'20px'},{e:'🧿',l:'91%',t:'72%',d:'.9s', s:'24px'},
     {e:'⭐',l:'8%', t:'72%',d:'.35s',s:'20px'},{e:'🌺',l:'27%',t:'82%',d:'.7s', s:'22px'},
     {e:'💮',l:'74%',t:'82%',d:'1.5s',s:'20px'},
    ].forEach((d,i)=>{
        const el=document.createElement('div'); el.className='deco'; el.textContent=d.e;
        el.style.cssText=`left:${d.l};top:${d.t};font-size:${d.s};animation-delay:${d.d};animation-duration:${4+i*.3}s;`;
        scene.appendChild(el);
    });
}


/* ══════════════════════════════════════════════
   ENVELOPE / LETTER
══════════════════════════════════════════════ */
let envOpened=false;
window.openEnvelope=function(){
    if(envOpened)return; envOpened=true;
    playLetter();
    document.getElementById('envFlap').classList.add('open');
    const seal=document.getElementById('envSeal'); seal.style.transform='scale(0)'; seal.style.opacity='0';
    setTimeout(()=>{ confettiBurst(); document.getElementById('modal').classList.add('open'); },700);
};
window.closeLetter=function(){ document.getElementById('modal').classList.remove('open'); };


/* ══════════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════════ */
function confettiBurst(){
    const canvas=document.getElementById('confetti'); if(!canvas)return;
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    const colors=['#f093b0','#d36b8f','#fce8f0','#ffb3cb','#fff0a0','#d4a056','#f9c74f','#e8c4ff','#ff9eb5','#c8f7c5','#ffd93d'];
    const pieces=Array.from({length:130},()=>({
        x:canvas.width*(.28+Math.random()*.44),y:canvas.height*.42,
        vx:(Math.random()-.5)*17,vy:(Math.random()-1.3)*13,
        color:colors[Math.floor(Math.random()*colors.length)],
        w:Math.random()*10+4,h:Math.random()*6+3,
        angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.36,
        grav:.44,alpha:1,circle:Math.random()>.65,
    }));
    (function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height); let alive=false;
        for(const p of pieces){
            p.vy+=p.grav;p.x+=p.vx;p.y+=p.vy;p.angle+=p.spin;p.alpha-=.011;
            if(p.alpha>0){
                alive=true; ctx.save(); ctx.globalAlpha=Math.max(0,p.alpha);
                ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.fillStyle=p.color;
                if(p.circle){ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill();}
                else{ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
                ctx.restore();
            }
        }
        if(alive)requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height);
    })();
}
window.addEventListener('resize',()=>{const c=document.getElementById('confetti');if(c){c.width=window.innerWidth;c.height=window.innerHeight;}});


/* ══════════════════════════════════════════════
   BUTTON WIRING
══════════════════════════════════════════════ */
document.getElementById('yesBtn').addEventListener('click',()=>{
    playChime(); confettiBurst();
    spawnP2Decor();
    goTo('p1','p2',startTyping);
    setTimeout(()=>{
        goTo('p2','p3',()=>{ buildStarfield(); buildCdPhotos(); startCountdown(); confettiBurst(); });
    },6500);
});

document.getElementById('toBoard').addEventListener('click',()=>{
    playChime(); confettiBurst();
    goTo('p3','p4',()=>{ buildLights(); buildBunting(); buildBoard(); startPetals(); confettiBurst(); });
});


/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
window.addEventListener('load',()=>{
    initIntro();
    spawnParticles();
    spawnSparkles();
    spawnHearts();
});


/* ══════════════════════════════════════════════
   ✏️  DAILY NOTE — EDIT THIS EVERY DAY
   Just change the text between the backticks!
══════════════════════════════════════════════ */
const DAILY_NOTE = `today i just wanted to remind you that you are the most beautiful thing that has ever happened to me.

not just in the way you look — though that alone could make the whole world stop — but in the way you exist. the way you laugh at things only you find funny. the way your eyes carry something soft that i have never seen anywhere else.

i think about you more than you know. more than i say. more than i probably should. and i wouldn't change a single second of it.

you deserve every good thing. every quiet moment. every big love. every beautiful day.

and on the days you forget that — come back here. read this. because this will always be true.

i love you. more than poems can hold. 💗`;


/* ══════════════════════════════════════════════
   GRATITUDE MUSEUM DATA · P7 / P8 / P9 / P10
══════════════════════════════════════════════ */
const HALLWAY_PHOTOS = [7, 14, 22, 31, 47, 52, 68, 74];

const GRATITUDE_EXHIBITS = [
    {
        tag: 'EXHIBIT I',
        title: 'For the peace',
        photo: 11,
        text: `There are people who brighten a room,
and then there are people who quiet the noise inside a heart.
You became that kind of presence for me —
the kind that did not need to do anything dramatic
to make life feel softer, safer, kinder.
Somehow, simply having you near
made heaviness loosen its grip.
That peace was never small.
I still carry it.`
    },
    {
        tag: 'EXHIBIT II',
        title: 'For the little things you never noticed',
        photo: 27,
        text: `Maybe you never knew how much stayed.
The passing words, the ordinary jokes,
the tiny habits, the smallest gestures,
the way a moment could become unforgettable
just because your presence had touched it.
So much of what mattered most
arrived quietly, almost invisibly —
and maybe that is why it lives so deeply in me.
You left more than you ever meant to.`
    },
    {
        tag: 'EXHIBIT III',
        title: 'For the happiness attached to your name',
        photo: 34,
        text: `There are names people hear,
and then there are names people feel.
Yours became warmth in my life.
It began to sound like comfort,
like lightness, like something my heart trusted.
Even on ordinary days,
your name carried a kind of brightness with it.
That is not a small thing.
That is the kind of thing people remember for years.`
    },
    {
        tag: 'EXHIBIT IV',
        title: 'For the version of me that existed around you',
        photo: 49,
        text: `Because of you,
there were versions of me that felt lighter,
gentler, more awake to joy.
Around your presence,
something in me softened without fear.
I laughed more honestly.
I noticed beauty more carefully.
I held moments closer.
And maybe that is one of the quietest miracles of all —
that someone can enter your life
and change the atmosphere inside you.`
    },
    {
        tag: 'EXHIBIT V',
        title: 'For being more than words can hold',
        photo: 58,
        text: `Even after all these rooms,
language still feels smaller than what I owe your presence.
Some people are remembered.
Some people are missed.
But some people become woven into
the meaning of beautiful days themselves.
That is what you became.
And gratitude is still too little a word,
yet it is the one my heart keeps returning to,
because it still needs some name
for all that it carries when it thinks of you.`
    }
];


function playDoorOpen(){
    tone(148,.20,'triangle',.05);
    setTimeout(()=>tone(196,.32,'sine',.038),110);
    setTimeout(()=>tone(247,.52,'sine',.032),250);
    setTimeout(()=>tone(330,.74,'triangle',.024),360);
}

function playDoorFile(){
    const el = document.getElementById('doorOpenAudio');
    if(!el) return;
    try {
        el.currentTime = 0;
        const p = el.play();
        if(p && typeof p.catch === 'function') p.catch(()=>{});
    } catch(_err){}
}

const MUSEUM_TRANSITION_MS = 5900;
const DOOR_OPEN_MS = 1320;
const HALLWAY_TRAVEL_MS = 6200;

let hallAmbience = null;

function stopHallAmbience(fadeMs = 600){
    if(!hallAmbience) return;
    const state = hallAmbience;
    hallAmbience = null;
    try {
        const t = audio.currentTime;
        state.master.gain.cancelScheduledValues(t);
        state.master.gain.setValueAtTime(state.master.gain.value || 0.03, t);
        state.master.gain.linearRampToValueAtTime(0.0001, t + fadeMs / 1000);
    } catch(_err){}
    clearInterval(state.stepTimer);
    state.extraStops.forEach(fn=>{
        try { fn(); } catch(_err){}
    });
    setTimeout(()=>{
        try { state.master.disconnect(); } catch(_err){}
    }, fadeMs + 120);
}

function startHallAmbience(){
    stopHallAmbience(260);
    if(audio.state === 'suspended') return;

    const master = audio.createGain();
    master.gain.value = 0.0001;
    master.connect(audio.destination);

    const now = audio.currentTime;
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.026, now + 0.7);

    const noiseBuffer = audio.createBuffer(1, audio.sampleRate * 2, audio.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for(let i=0;i<data.length;i++){
        data[i] = (Math.random() * 2 - 1) * 0.26;
    }

    const airy = audio.createBufferSource();
    airy.buffer = noiseBuffer;
    airy.loop = true;
    const airyFilter = audio.createBiquadFilter();
    airyFilter.type = 'bandpass';
    airyFilter.frequency.value = 880;
    airyFilter.Q.value = 0.8;
    const airyGain = audio.createGain();
    airyGain.gain.value = 0.010;
    airy.connect(airyFilter);
    airyFilter.connect(airyGain);
    airyGain.connect(master);
    airy.start();

    const hush = audio.createOscillator();
    hush.type = 'sine';
    hush.frequency.value = 132;
    const hushGain = audio.createGain();
    hushGain.gain.value = 0.0032;
    hush.connect(hushGain);
    hushGain.connect(master);
    hush.start();

    let stepIndex = 0;
    const stepTimer = setInterval(()=>{
        if(audio.state === 'suspended') return;
        const t = audio.currentTime;
        const pan = (stepIndex % 2 === 0) ? -0.08 : 0.08;
        const stepNoise = audio.createBufferSource();
        stepNoise.buffer = noiseBuffer;
        const stepFilter = audio.createBiquadFilter();
        stepFilter.type = 'lowpass';
        stepFilter.frequency.value = 240;
        const stepGain = audio.createGain();
        stepGain.gain.setValueAtTime(0.0001, t);
        stepGain.gain.linearRampToValueAtTime(0.017, t + 0.045);
        stepGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        let stepPan;
        if(audio.createStereoPanner){
            stepPan = audio.createStereoPanner();
            stepPan.pan.value = pan;
        }
        stepNoise.connect(stepFilter);
        stepFilter.connect(stepGain);
        if(stepPan){
            stepGain.connect(stepPan);
            stepPan.connect(master);
        } else {
            stepGain.connect(master);
        }
        stepNoise.start(t);
        stepNoise.stop(t + 0.3);

        const footTone = audio.createOscillator();
        footTone.type = 'triangle';
        footTone.frequency.setValueAtTime(stepIndex % 2 === 0 ? 104 : 96, t);
        const footGain = audio.createGain();
        footGain.gain.setValueAtTime(0.0001, t);
        footGain.gain.linearRampToValueAtTime(0.010, t + 0.035);
        footGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
        if(stepPan){
            footTone.connect(footGain);
            footGain.connect(stepPan);
        } else {
            footTone.connect(footGain);
            footGain.connect(master);
        }
        footTone.start(t);
        footTone.stop(t + 0.25);
        stepIndex += 1;
    }, 620);

    hallAmbience = {
        master,
        stepTimer,
        extraStops: [
            ()=>{ try { airy.stop(); } catch(_err){} },
            ()=>{ try { hush.stop(); } catch(_err){} }
        ]
    };
}

function buildHallway(){
    const page=document.getElementById('p9');
    const wrap=document.getElementById('hallFrames');
    if(!page || !wrap || wrap.dataset.built) return;

    wrap.dataset.built='1';
    wrap.innerHTML='';

    const sequence=[
        { photo:HALLWAY_PHOTOS[0], side:'left',  y:'-24vh', x:'31vw', rot:'-8deg', zStart:'-1540px', zEnd:'480px', dur:5.9, delay:.10, cls:'' },
        { photo:HALLWAY_PHOTOS[1], side:'right', y:'-22vh', x:'31vw', rot:'8deg',  zStart:'-1480px', zEnd:'500px', dur:5.9, delay:.36, cls:'' },
        { photo:HALLWAY_PHOTOS[2], side:'left',  y:'-7vh',  x:'35vw', rot:'-6deg', zStart:'-1240px', zEnd:'540px', dur:5.55, delay:1.00, cls:'' },
        { photo:HALLWAY_PHOTOS[3], side:'right', y:'-4vh',  x:'35vw', rot:'7deg',  zStart:'-1180px', zEnd:'560px', dur:5.55, delay:1.28, cls:'' },
        { photo:HALLWAY_PHOTOS[4], side:'left',  y:'9vh',   x:'28vw', rot:'-5deg', zStart:'-980px',  zEnd:'620px', dur:5.10, delay:2.15, cls:'foreground' },
        { photo:HALLWAY_PHOTOS[5], side:'right', y:'11vh',  x:'28vw', rot:'5deg',  zStart:'-920px',  zEnd:'620px', dur:5.10, delay:2.42, cls:'foreground' },
        { photo:HALLWAY_PHOTOS[6], side:'left',  y:'22vh',  x:'33vw', rot:'-4deg', zStart:'-780px',  zEnd:'660px', dur:4.70, delay:3.22, cls:'foreground' },
        { photo:HALLWAY_PHOTOS[7], side:'right', y:'24vh',  x:'33vw', rot:'4deg',  zStart:'-740px',  zEnd:'660px', dur:4.70, delay:3.48, cls:'foreground' }
    ];

    sequence.forEach((cfg,i)=>{
        const frame=document.createElement('div');
        frame.className=`hall-frame ${cfg.side} ${cfg.cls || ''}`.trim();
        frame.style.setProperty('--x', cfg.x);
        frame.style.setProperty('--y', cfg.y);
        frame.style.setProperty('--rot', cfg.rot);
        frame.style.setProperty('--z-start', cfg.zStart);
        frame.style.setProperty('--z-end', cfg.zEnd);
        frame.style.setProperty('--dur', `${cfg.dur}s`);
        frame.style.animationDelay=`${cfg.delay}s`;
        frame.style.zIndex=String(12 + i);

        const img=document.createElement('img');
        img.src=`photo%20%28${cfg.photo}%29.jpeg`;
        img.alt='';
        img.loading='lazy';
        img.decoding='async';
        img.onerror=()=>{ frame.style.display='none'; };

        frame.appendChild(img);
        wrap.appendChild(frame);
    });
}

function buildMuseumPage(){
    const page=document.getElementById('p10');
    const holder=document.getElementById('museumExhibits');
    if(!page || !holder || page.dataset.built) return;

    page.dataset.built='1';
    holder.innerHTML='';

    GRATITUDE_EXHIBITS.forEach((ex, i)=>{
        const card=document.createElement('article');
        card.className='museum-exhibit';
        card.style.setProperty('--reveal-delay', `${i * 0.08}s`);
        card.innerHTML=`
            <div class="museum-exhibit-copy">
                <p class="museum-exhibit-tag">${ex.tag}</p>
                <h3 class="museum-exhibit-title">${ex.title}</h3>
                <div class="museum-exhibit-text">${ex.text}</div>
            </div>
            <div class="museum-exhibit-photo">
                <img src="photo%20%28${ex.photo}%29.jpeg" alt="" loading="lazy" decoding="async">
            </div>
        `;
        const img=card.querySelector('img');
        if(img){
            img.onerror=()=>{
                const box = img.closest('.museum-exhibit-photo');
                if(box) box.style.display='none';
            };
        }
        holder.appendChild(card);
    });

    const reveal=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add('show');
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold:.16, rootMargin:'0px 0px -6% 0px' });

    holder.querySelectorAll('.museum-exhibit').forEach(card=>reveal.observe(card));
}


/* ══════════════════════════════════════════════
   PAGE 5 · POEM SETUP
══════════════════════════════════════════════ */
function buildPoemPage(){
    const page=document.getElementById('p5');
    if(!page||page.dataset.built)return; page.dataset.built='1';

    startCandleSparks();

    // blurred bg photo — fills entire screen behind everything
    const bg=document.createElement('div');
    bg.className='poem-bg-photo';
    bg.style.backgroundImage=`url('photo%20%2817%29.jpeg')`;
    page.appendChild(bg);

    // large portraits tucked behind the card, peeking from sides
    // positioned so they overlap the card edges — feels like memories tucked in
    const portraits=[
        // big one peeking from bottom-left behind card
        {n:38, w:160, h:200, left:'12%', top:'55%', rot:-12, del:'0s',  dur:'5s'},
        // peeking from top-right
        {n:59, w:140, h:175, left:'72%', top:'8%',  rot:10,  del:'0.6s',dur:'4.5s'},
        // small one bottom-right corner
        {n:11, w:120, h:150, left:'78%', top:'62%', rot:6,   del:'1.1s',dur:'5.5s'},
        // small peeking top-left
        {n:21, w:110, h:138, left:'5%',  top:'5%',  rot:-8,  del:'0.3s',dur:'4.8s'},
    ];

    portraits.forEach(pd=>{
        const wrap=document.createElement('div');
        wrap.className='poem-portrait';
        wrap.style.cssText=`left:${pd.left};top:${pd.top};width:${pd.w}px;--rot:${pd.rot}deg;animation-delay:${pd.del};animation-duration:${pd.dur};`;
        const img=document.createElement('img');
        img.src=`photo%20%28${pd.n}%29.jpeg`; img.alt='';
        img.style.cssText=`width:${pd.w}px;height:${pd.h}px;object-fit:cover;`;
        img.loading='lazy'; img.onerror=()=>{ wrap.style.display='none'; };
        wrap.appendChild(img); page.appendChild(wrap);
    });
}

function startCandleSparks(){
    const layer=document.getElementById('candleLayer');
    if(!layer)return;
    setInterval(()=>{
        const el=document.createElement('div'); el.className='candle-spark';
        const sz=Math.random()*5+3;
        Object.assign(el.style,{
            left:(Math.random()*80+10)+'%',
            bottom:(Math.random()*20+5)+'%',
            width:sz+'px', height:sz+'px',
            animationDuration:(Math.random()*.8+.6)+'s',
            animationDelay:'0s',
        });
        layer.appendChild(el); setTimeout(()=>el.remove(),1500);
    },800);
}


/* ══════════════════════════════════════════════
   PAGE 6 · DAILY NOTE SETUP
══════════════════════════════════════════════ */
function buildNotePage(){
    const page=document.getElementById('p6');
    if(!page||page.dataset.built)return; page.dataset.built='1';

    // date
    const dateEl=document.getElementById('noteDate');
    if(dateEl){
        const now=new Date();
        const opts={weekday:'long',year:'numeric',month:'long',day:'numeric'};
        dateEl.textContent=now.toLocaleDateString('en-IN',opts);
    }

    // typewriter reveal
    const body=document.getElementById('noteBody');
    if(body){
        body.innerHTML='';
        let i=0;
        const chars=[...DAILY_NOTE];
        function nextChar(){
            if(i>=chars.length)return;
            const ch=chars[i++];
            if(ch==='\n'){
                body.appendChild(document.createElement('br'));
            } else {
                const span=document.createElement('span');
                span.className='note-char';
                span.textContent=ch;
                span.style.animationDelay='0s';
                body.appendChild(span);
            }
            // faster for spaces/common chars, slight pause on punctuation
            const delay='.?!,'.includes(ch)?120:ch==='\n'?80:22;
            setTimeout(nextChar,delay);
        }
        // small delay before starting so page is visible
        setTimeout(nextChar,400);
    }
}


/* ══════════════════════════════════════════════
   WIRE UP NEW PAGE NAVIGATION
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{
    const toPoem=document.getElementById('toPoem');
    if(toPoem){
        toPoem.addEventListener('click',()=>{
            playChime(); confettiBurst();
            goTo('p4','p5',()=>{ buildPoemPage(); });
        });
    }

    const toNote=document.getElementById('toNote');
    if(toNote){
        toNote.addEventListener('click',()=>{
            playChime();
            goTo('p5','p6',()=>{ buildNotePage(); });
        });
    }

    const toMuseumIntro=document.getElementById('toMuseumIntro');
    if(toMuseumIntro){
        toMuseumIntro.addEventListener('click',()=>{
            if(audio.state==='suspended') audio.resume().catch(()=>{});
            playChime();
            goTo('p6','p7');
            setTimeout(()=>{
                goTo('p7','p8');
            },MUSEUM_TRANSITION_MS);
        });
    }

    const museumDoor=document.getElementById('museumDoor');
    if(museumDoor){
        museumDoor.addEventListener('click',()=>{
            if(museumDoor.dataset.busy) return;
            museumDoor.dataset.busy='1';
            if(audio.state==='suspended') audio.resume().catch(()=>{});

            playDoorOpen();
            playDoorFile();
            museumDoor.classList.add('opening');

            setTimeout(()=>{
                goTo('p8','p9',()=>{
                    buildHallway();
                    startHallAmbience();

                    setTimeout(()=>{
                        stopHallAmbience(950);
                        goTo('p9','p10',()=>{
                            buildMuseumPage();
                        });
                    },HALLWAY_TRAVEL_MS);
                });
            },DOOR_OPEN_MS);
        });
    }
});
