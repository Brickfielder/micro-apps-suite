
(function(){
    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));
    const log = (msg)=>{ try{ console.debug('[MiA]', msg); }catch(e){} };

    const scenarioSel=$('#scenarioSel'), speedSel=$('#speedSel'), voiceSel=$('#voiceSel'), distractorSel=$('#distractorSel');
    const vRate=$('#voiceRate'), vPitch=$('#voicePitch'), vVol=$('#voiceVol');
    const btnStart=$('#btnStart'), btnPause=$('#btnPause'), btnStopVoice=$('#btnStopVoice'), btnReset=$('#btnReset'), btnDownload=$('#btnDownload'), btnDemo=$('#btnDemo');
    const strategyCard=$('#strategyCard'), scenarioCard=$('#scenarioCard'), distractorCard=$('#distractorCard'), recallCard=$('#recallCard'), feedbackCard=$('#feedbackCard');
    const chat=$('#chat'), typing=$('#typing'), chatProgress=$('#chatProgress'), chatCounter=$('#chatCounter'), chatTitle=$('#chatTitle');
    const btnToDistractor=$('#btnToDistractor');
    // Puzzle
    const puzzleGrid=$('#puzzleGrid'), pStatus=$('#pStatus'), btnShuffle=$('#btnShuffle'), btnSkip=$('#btnSkip'), btnSize=$('#btnSize');
    // Stroop
    const stroopUI=$('#stroopUI'), stroopWord=$('#stroopWord'), stroopBtns=$('#stroopBtns'), stroopScore=$('#stroopScore');
    // Matching
    const matchUI=$('#matchUI'), matchGrid=$('#matchGrid'), matchStatus=$('#matchStatus');
    // Recall
    const recallInputs=$('#recallInputs'), btnCheck=$('#btnCheck'); const btnRestart=$('#btnRestart');

    let currentStrategy=null, lastStrategies=[];
    let playing=false, paused=false, msgIdx=0, currentThread=null;
    let sessionLog=[];

    const STRATEGY_DETAILS={
      Notepad:{title:"Notepad",desc:"Write quick bullet points while the chat unfolds to anchor details (names, places, numbers). Keep it minimal so you still listen actively.",
               examples:["Luca — text at 12:00","Meet: library entrance","Buy: beans + plant"]},
      Grouping:{title:"Grouping",desc:"Actively organise information into meaningful clusters (people, places, times, tasks). This reduces load and boosts recall.",
               examples:["People: Anna, Luca","Places: library, market, pharmacy","Times: 10:00 market, 12:00 text"]},
      Visualization:{title:"Visualization",desc:"Create a quick mental scene linking the items (method of loci or vivid imagery). Exaggerate colours, sizes, or actions.",
               examples:["Library doors with coffee-bean doormat","Umbrella + pharmacy cross in rain","Texting Luca at a giant 12:00 clock"]},
      Cued:{title:"Cued recognition",desc:"Plan to use progressive cues if free recall is hard: start with a semantic hint, then show options.",
               examples:["Reveal a general hint","Then multiple-choice options","Use cues after brief free recall"]},
      None:{title:"No strategy",desc:"Proceed without a compensatory strategy — useful as a baseline to compare performance.",examples:["—"]}
    };

    /* Threads (same as provided) */
    const THREADS=[
      { title:"Weekend plan",
        msgs:[
          {from:"Anna", text:"Hey! Free this Saturday?"},{from:"You", text:"Possibly. What's up?"},
          {from:"Anna", text:"Street market in town — starts at 10."},
          {from:"Anna", text:"I want to buy coffee beans and a small plant."},
          {from:"You", text:"Sounds nice. Where do we meet?"},
          {from:"Anna", text:"Let's meet at the library entrance."},
          {from:"Anna", text:"After the market I need the pharmacy."},
          {from:"You", text:"Ok. Do I need to bring anything?"},
          {from:"Anna", text:"If you can, bring an umbrella — forecast is light rain."},
          {from:"Anna", text:"Oh, and I promised to text Luca at noon."}
        ],
        qs:[
          {prompt:"What time does the street market start?", ans:["10","10am","ten","10 am"], hints:["Morning, on the hour.","Before noon, exactly ten o'clock."], cue:{ mc:["10am","9am","noon","8:30"]}},
          {prompt:"Where are you meeting?", ans:["library entrance","library"], hints:["It's a specific spot at a public building.","The entrance of the place with books."], cue:{ mc:["Library entrance","Hall A","Green Street","Platform 4"]}},
          {prompt:"Name one thing Anna wants to buy.", ans:["coffee","coffee beans","plant","a plant"], hints:["Two items: one you drink, one you water.","The drink ingredient and a small living thing."], cue:{ mc:["Coffee beans","Tickets","Headphones","Notebook"]}},
          {prompt:"What might the weather be like?", ans:["rain","light rain","raining"], hints:["A type of precipitation.","It's not heavy."], cue:{ mc:["Rain","Sunny","Snow","Wind"]}},
          {prompt:"Who needs to be texted at noon?", ans:["luca"], hints:["A short male first name.","Four letters, common in Italy."], cue:{ mc:["Luca","Marco","Sara","Amira"]}}
        ]
      },
      { title:"Travel update",
        msgs:[
          {from:"Marco", text:"Train strike ended — services normal tomorrow."},
          {from:"You", text:"Great. What time is our train?"},
          {from:"Marco", text:"9:40 from Platform 4."},
          {from:"Marco", text:"Bring ID — ticket is digital."},
          {from:"You", text:"Do we need seats reserved?"},
          {from:"Marco", text:"Yes, already done: Coach B, seats 12 and 13."},
          {from:"Marco", text:"I'll grab snacks at the station."},
          {from:"You", text:"I'll pack chargers tonight."},
          {from:"Marco", text:"Weather looks cool, take a light jacket."},
          {from:"You", text:"Perfect, see you at the barriers."}
        ],
        qs:[
          {prompt:"What time is the train?", ans:["9:40","940","9 40"], hints:["Morning, in the nine o'clock hour.","Not on the hour — twenty minutes to ten."], cue:{ mc:["9:40","10:10","8:55","12:15"]}},
          {prompt:"Which platform?", ans:["4","platform 4"], hints:["A single digit, even number.","It's less than 5."], cue:{ mc:["4","2","7","1"]}},
          {prompt:"Which coach are the reserved seats in?", ans:["b","coach b"], hints:["A letter near the start of the alphabet.","It's the second letter."], cue:{ mc:["Coach B","Coach A","Coach D","Coach F"]}},
          {prompt:"Name one item to bring.", ans:["id","chargers","charger","light jacket","jacket"], hints:["Required for digital tickets.","Two letters commonly used for identity."], cue:{ mc:["ID","Passport","Umbrella","Sunglasses"]}},
          {prompt:"Who is bringing snacks?", ans:["marco"], hints:["Not you.","The person messaging you."], cue:{ mc:["Marco","You","Anna","Tom"]}}
        ]
      },
      { title:"Clinic appointment",
        msgs:[
          {from:"Reception", text:"Reminder: Dr Patel appointment on Tuesday."},
          {from:"You", text:"What time again?"},
          {from:"Reception", text:"11:20. Please arrive 10 minutes early."},
          {from:"Reception", text:"Bring your insurance card and medication list."},
          {from:"You", text:"Location?"},
          {from:"Reception", text:"Riverside Clinic, second floor, Room 204."},
          {from:"You", text:"Parking?"},
          {from:"Reception", text:"Yes, use the south car park. First hour free."},
          {from:"Reception", text:"If you have a cough, wear a mask."},
          {from:"You", text:"Thanks, see you Tuesday."}
        ],
        qs:[
          {prompt:"What time is the appointment?", ans:["11:20","1120","11 20"], hints:["Late morning, after eleven.","Twenty past eleven."], cue:{ mc:["11:20","10:30","12:00","9:45"]}},
          {prompt:"Which floor?", ans:["second","2nd"], hints:["Not ground, not first.","One flight above the first floor."], cue:{ mc:["Second","First","Fourth","Ground"]}},
          {prompt:"Room number?", ans:["204"], hints:["Three digits.","Starts with 2 and ends with 4."], cue:{ mc:["204","402","104","210"]}},
          {prompt:"Name one thing to bring.", ans:["insurance","medication list","medication","insurance card"], hints:["Paperwork and health info.","Your health coverage card and list of medicines."], cue:{ mc:["Insurance card","Passport","Driving licence","Cash"]}},
          {prompt:"Which car park to use?", ans:["south","south car park"], hints:["Compass direction.","Opposite of north."], cue:{ mc:["South","North","East","Multi-storey"]}}
        ]
      },
      { title:"Conference day",
        msgs:[
          {from:"Organizer", text:"Registration opens at 8:30."},
          {from:"You", text:"Where do I go first?"},
          {from:"Organizer", text:"Keynote in Hall A at 9:00."},
          {from:"Organizer", text:"Your poster session is 14:00–15:30 in Gallery 2."},
          {from:"You", text:"Wi-Fi?"},
          {from:"Organizer", text:"Network: CONF2025, password: nexus."},
          {from:"You", text:"Lunch?"},
          {from:"Organizer", text:"Vouchers at the foyer, vegetarian options available."},
          {from:"Organizer", text:"Reception at 18:00 on the terrace."},
          {from:"You", text:"Perfect."}
        ],
        qs:[
          {prompt:"When does registration open?", ans:["8:30","830","8 30"], hints:["In the eight o'clock hour.","On the half hour."], cue:{ mc:["8:30","9:00","7:45","10:00"]}},
          {prompt:"Where is the keynote?", ans:["hall a","a"], hints:["A hall, not a gallery.","The primary hall with a single-letter label."], cue:{ mc:["Hall A","Gallery 2","Hall C","Auditorium B"]}},
          {prompt:"Poster session time?", ans:["14:00","1400","14 00","2pm","2:00"], hints:["Early afternoon.","Exactly two p.m."], cue:{ mc:["14:00","13:30","15:00","11:00"]}},
          {prompt:"Wi-Fi password?", ans:["nexus"], hints:["A five-letter tech word.","Means a connection or link."], cue:{ mc:["nexus","orion","vector","delta"]}},
          {prompt:"Reception location?", ans:["terrace","on the terrace"], hints:["An outdoor elevated area.","Open-air terrace."], cue:{ mc:["Terrace","Foyer","Hall A","Café"]}}
        ]
      }
    ];

    const show = el => el.classList.remove("hidden");
    const hide = el => el.classList.add("hidden");
    const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9\s]/g,"").trim();
    function el(tag, cls, txt){ const e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }

    function initPicker(){
      scenarioSel.innerHTML="";
      THREADS.forEach((t,i)=>{ const o=document.createElement("option"); o.value=String(i); o.textContent=t.title; scenarioSel.appendChild(o); });
      $("#statScenario").textContent="Scenario: "+THREADS[0].title;
    }
    initPicker();
    scenarioSel.addEventListener("change",()=> $("#statScenario").textContent="Scenario: "+THREADS[parseInt(scenarioSel.value,10)].title );

    function maybeNudge(choice){
      lastStrategies.push(choice);
      if(lastStrategies.length>3) lastStrategies.shift();
      if(lastStrategies.length===3 && lastStrategies.every(s=>s===choice)){
        log("Tip: try a different strategy this round (you chose "+choice+" three times).");
      }
      return choice;
    }

    function clearChat(){ chat.innerHTML=""; msgIdx=0; chatCounter.textContent="0/10"; chatProgress.style.width="0%"; btnToDistractor.disabled=true; }
    function appendMsg(m){
      const row=el("div","msg "+(m.from==="You"?"fromB":"fromA"));
      const bubble=el("div","bubble", m.text);
      row.appendChild(bubble); chat.appendChild(row);
      chat.scrollTop=chat.scrollHeight;
      chatCounter.textContent=msgIdx+"/"+currentThread.msgs.length;
      chatProgress.style.width=(msgIdx/currentThread.msgs.length*100)+"%";
    }
    let scheduleHandle=null; function schedule(fn,ms){ clearTimeout(scheduleHandle); scheduleHandle=setTimeout(fn,ms); }

function pickVoice(){
  if(!("speechSynthesis" in window)) return null;
  const voices = speechSynthesis.getVoices() || [];
  // 1st choice: any Libby (name contains “Libby” and likely “Online/Natural/Neural”)
  const libby = voices.find(v => /libby/i.test(v.name) && /(online|natural|neural)/i.test(v.name));
  // 2nd choice: any Libby variant
  const anyLibby = libby || voices.find(v => /libby/i.test(v.name));
  // Fallbacks: en-GB → any en → first
  return anyLibby
      || voices.find(v => /^en-GB/.test(v.lang))
      || voices.find(v => /^en/.test(v.lang))
      || voices[0]
      || null;
}
    function stopSpeak(){ if("speechSynthesis" in window){ speechSynthesis.cancel(); } }
    function speak(text){
      if(!("speechSynthesis" in window)) return { onend:cb=>cb&&cb() };
      const u=new SpeechSynthesisUtterance(text);
      const v=pickVoice(); if(v) u.voice=v;
      u.rate=parseFloat(vRate.value); u.pitch=parseFloat(vPitch.value); u.volume=parseFloat(vVol.value);
      u.lang=(v && v.lang) || "en-GB";
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      return u;
    }

    function playNext(){
      if(!playing || paused) return;
      if(msgIdx>=currentThread.msgs.length){
        playing=false; typing.classList.add("hidden"); btnToDistractor.disabled=false; return;
      }
      const m=currentThread.msgs[msgIdx++];
      typing.classList.remove("hidden");
      schedule(()=>{
        typing.classList.add("hidden");
        appendMsg(m);
        btnStopVoice.disabled=false;
        const started=performance.now();
        const u=speak((m.from==="You"?"You say: ":"") + (m.from!=="You" ? (m.from+" says: ") : "") + m.text);
        const minGap=parseInt(speedSel.value,10);
        const go=()=>{ const elapsed=performance.now()-started; const wait=Math.max(minGap-elapsed,0); schedule(playNext,wait); };
        if(u && "onend" in u){ u.onend=go; } else { schedule(playNext,minGap); }
      }, 350 + Math.random()*200);
    }
    function startThread(sc){ clearChat(); playing=true; paused=false; currentThread = sc; msgIdx=0; chatTitle.textContent=sc.title; playNext(); }

    // DISTRACTORS
    // Sliding puzzle
    let puzzleSize=3, emptyPos, moves=0, skipUnlockTimer=null;
    function coords(i){ return {r:Math.floor(i/puzzleSize), c:i%puzzleSize}; }
    function indexFrom(rc){ return rc.r*puzzleSize+rc.c; }
    function neighbors(idx){ const {r,c}=coords(idx); const ns=[]; if(r>0) ns.push(indexFrom({r:r-1,c})); if(r<puzzleSize-1) ns.push(indexFrom({r:r+1,c})); if(c>0) ns.push(indexFrom({r, c:c-1})); if(c<puzzleSize-1) ns.push(indexFrom({r, c:c+1})); return ns; }
    function renderPuzzle(arr){
      const grid=$("#puzzleGrid"); grid.innerHTML=""; grid.style.gridTemplateColumns="repeat("+puzzleSize+",72px)";
      arr.forEach((n,i)=>{ const d=document.createElement("div"); d.className="tile"+(n===0?" empty":""); d.textContent = n===0? "" : n;
        d.addEventListener("click",()=>{ if(n===0) return; const nb=neighbors(i);
          if(nb.includes(emptyPos)){ [arr[i],arr[emptyPos]]=[arr[emptyPos],arr[i]]; emptyPos=i; moves++; pStatus.textContent="Moves: "+moves; renderPuzzle(arr); if(isSolved(arr)){ log("Puzzle solved. Proceed to recall."); showRecall(); } }
        });
        grid.appendChild(d);
      });
    }
    function goalArray(){ const arr=[]; for(let i=1;i<puzzleSize*puzzleSize;i++) arr.push(i); arr.push(0); return arr; }
    function isSolved(arr){ const g=goalArray(); for(let i=0;i<arr.length;i++){ if(arr[i]!==g[i]) return false; } return true; }
    function shufflePuzzle(){
      const arr=goalArray().slice(); emptyPos=arr.length-1; moves=0; pStatus.textContent="Moves: 0";
      for(let k=0;k<200;k++){ const ns=neighbors(emptyPos); const pick=ns[Math.floor(Math.random()*ns.length)]; [arr[emptyPos],arr[pick]]=[arr[pick],arr[emptyPos]]; emptyPos=pick; }
      renderPuzzle(arr); btnSkip.disabled=true; clearTimeout(skipUnlockTimer); skipUnlockTimer=setTimeout(()=>{ btnSkip.disabled=false; }, 20000);
    }

    // Stroop
    const COLORS=[{name:"RED", css:"red"},{name:"GREEN", css:"green"},{name:"BLUE", css:"blue"},{name:"YELLOW", css:"goldenrod"}];
    let stroopTrials=12, stroopIdx=0, stroopCorrect=0;
    function stroopNext(){
      if(stroopIdx>=stroopTrials){ log("Stroop finished. Proceed to recall."); showRecall(); return; }
      stroopIdx++; const word=COLORS[Math.floor(Math.random()*COLORS.length)]; const ink=COLORS[Math.floor(Math.random()*COLORS.length)];
      stroopWord.textContent=word.name; stroopWord.style.color=ink.css;
      stroopBtns.innerHTML=""; COLORS.forEach(c=>{ const b=document.createElement("button"); b.className="mia-btn ghost"; b.textContent=c.name; b.onclick=()=>{ if(c.name===ink.name){ stroopCorrect++; } stroopScore.textContent=stroopCorrect+"/"+stroopTrials; stroopNext(); }; stroopBtns.appendChild(b); });
    }
    function startStroop(){ stroopIdx=0; stroopCorrect=0; stroopScore.textContent="0/"+stroopTrials; stroopNext(); }

    // Matching
    let firstPick=null, lock=false, pairsFound=0, mismatches=0;
    function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
    function startMatching(){ firstPick=null; lock=false; pairsFound=0; mismatches=0; matchStatus.textContent="Pairs found: 0/6";
      const syms=["🍎","🚗","🐶","🎵","🌟","📚"]; const deck=shuffle([...syms,...syms]);
      matchGrid.innerHTML=""; deck.forEach((sym,idx)=>{
        const card=document.createElement("div"); card.className="match-card"; card.dataset.sym=sym; card.dataset.idx=idx; card.textContent="?";
        card.onclick=()=>{ if(lock || card.classList.contains("revealed")) return;
          card.classList.add("revealed"); card.textContent=sym;
          if(!firstPick){ firstPick=card; return; }
          if(firstPick.dataset.sym===card.dataset.sym){ pairsFound++; firstPick=null; matchStatus.textContent="Pairs found: "+pairsFound+"/6"; if(pairsFound===6){ log("Matching complete. Proceed to recall."); showRecall(); } }
          else{
            mismatches++;
            if(mismatches%2===0){ lock=true; setTimeout(()=>{ [firstPick,card].forEach(c=>{ c.classList.remove("revealed"); c.textContent="?"; }); lock=false; firstPick=null; }, 1000); }
            else { setTimeout(()=>{ [firstPick,card].forEach(c=>{ c.classList.remove("revealed"); c.textContent="?"; }); firstPick=null; }, 350); }
          }
        };
        matchGrid.appendChild(card);
      });
    }

    function showDistractor(){
      hide(scenarioCard); show(distractorCard);
      $("#puzzleUI").classList.add("hidden");
      $("#stroopUI").classList.add("hidden");
      $("#matchUI").classList.add("hidden");
      const choice=distractorSel.value;
      if(choice==="puzzle"){ $("#puzzleUI").classList.remove("hidden"); shufflePuzzle(); }
      else if(choice==="stroop"){ $("#stroopUI").classList.remove("hidden"); startStroop(); }
      else { $("#matchUI").classList.remove("hidden"); startMatching(); }
    }

    function renderRecall(sc){
      recallInputs.innerHTML="";
      sc.qs.forEach((q,i)=>{
        const wrap=document.createElement("div");
        wrap.innerHTML='<label class="mia-label">'+(i+1)+". "+q.prompt+'</label><input type="text" data-qi="'+i+'" />'
          +'<div class="mia-row" style="margin-top:6px"><button class="mia-btn ghost showCue" data-qi="'+i+'">Show hint</button></div>'
          +'<div class="cue hidden" id="cue-'+i+'"></div>';
        recallInputs.appendChild(wrap);
        const cueEl=wrap.querySelector("#cue-"+i);
        const h1=document.createElement("div"); h1.className="helper"; h1.id="h1-"+i; h1.textContent=(q.hints && q.hints[0]) ? q.hints[0] : "Hint available.";
        const h2=document.createElement("div"); h2.className="helper hidden"; h2.id="h2-"+i; h2.style.marginTop="4px"; h2.textContent=(q.hints && q.hints[1]) ? q.hints[1] : "More detail available.";
        const mc=document.createElement("div"); mc.className="mc hidden"; mc.id="mc-"+i;
        (q.cue.mc||[]).forEach(opt=>{ const b=document.createElement("button"); b.className="mia-btn ghost"; b.textContent=opt; b.onclick=()=>{ wrap.querySelector("input").value=opt; }; mc.appendChild(b); });
        cueEl.appendChild(h1); cueEl.appendChild(h2); cueEl.appendChild(mc);
      });
      $$(".showCue").forEach(btn=> btn.addEventListener("click",()=>{
        const i=btn.getAttribute("data-qi");
        const cue=document.getElementById("cue-"+i);
        const h2=document.getElementById("h2-"+i);
        const mc=document.getElementById("mc-"+i);
        if(cue.classList.contains("hidden")){ cue.classList.remove("hidden"); btn.textContent="More"; }
        else if(h2.classList.contains("hidden")){ h2.classList.remove("hidden"); btn.textContent="Options"; }
        else if(mc.classList.contains("hidden")){ mc.classList.remove("hidden"); btn.textContent="Hide cues"; }
        else { cue.classList.add("hidden"); h2.classList.add("hidden"); mc.classList.add("hidden"); btn.textContent="Show hint"; }
      }));
      if(currentStrategy==="Cued"){ $$(".showCue").forEach(b=>b.click()); }
    }

    function showRecall(){ hide(distractorCard); show(recallCard); const sc = THREADS[parseInt(scenarioSel.value,10)]; renderRecall(sc); }

    function grade(sc){
      let correct=0,total=sc.qs.length,details=[];
      Array.from(recallInputs.querySelectorAll("input")).forEach((inp,i)=>{
        const val=norm(inp.value);
        const ok=sc.qs[i].ans.some(a=> val.includes(norm(a)));
        if(ok) correct++;
        details.push({prompt:sc.qs[i].prompt, text:inp.value || "(blank)", ok});
      });
      return {correct,total,details};
    }

    // Controls
    btnStart.onclick=()=>{ hide(strategyCard); show(scenarioCard); const idx=parseInt(scenarioSel.value,10) || 0; const sc=THREADS[idx]; startThread(sc); log("Session started."); btnPause.disabled=false; };
    $("#strategyCard").addEventListener("click",(e)=>{ const b=e.target.closest("button[data-strategy]"); if(!b) return; currentStrategy=maybeNudge(b.getAttribute("data-strategy")); const info=STRATEGY_DETAILS[currentStrategy]; if(info){ const ex=info.examples.map(x=>"• "+x).join("<br>"); $("#strategyInfo").innerHTML='<div class="mia-pill">'+info.title+": "+info.desc+'</div><div class="helper" style="margin-top:6px"><strong>Examples</strong><br>'+ex+"</div>"; } log("Strategy: "+currentStrategy); });
    btnPause.onclick=()=>{ paused=!paused; btnPause.textContent=paused?"Resume":"Pause"; if(!paused) playNext(); };
    btnStopVoice.onclick=()=>stopSpeak();
    btnReset.onclick=()=>{ stopSpeak(); location.reload(); };
    btnDemo.onclick=()=>{ scenarioSel.value="0"; $("#statScenario").textContent="Scenario: "+THREADS[0].title; };
    btnToDistractor.onclick=()=> showDistractor();

    // Puzzle
    btnShuffle && (btnShuffle.onclick=()=> shufflePuzzle());
    btnSize && (btnSize.onclick=()=>{ puzzleSize = puzzleSize===3 ? 4 : 3; btnSize.textContent = "Size: "+puzzleSize+"×"+puzzleSize; shufflePuzzle(); });
    btnSkip && (btnSkip.onclick=()=>{ if(btnSkip.disabled) return; log("Puzzle skipped."); showRecall(); });

    // Check & Feedback
    btnCheck.onclick=()=>{
      const sc=THREADS[parseInt(scenarioSel.value,10)];
      const g=grade(sc);
      hide(recallCard); show(feedbackCard);
      const pct=Math.round((g.correct/g.total)*100);
      let html='<div class="mia-pill">Accuracy: '+g.correct+'/'+g.total+' ('+pct+'%) — Strategy: '+(currentStrategy||"—")+'</div>';
      g.details.forEach((d, i)=>{
        const corr = (sc.qs[i].ans || []).join(" / ");
        html+='<div style="margin-top:6px">'+(d.ok?'✅':'❌')+' <em>'+d.prompt+'</em> — <strong>'+d.text+'</strong>'+(d.ok?"":'<div class="helper" style="margin-top:2px">Correct: '+corr+"</div>")+"</div>";
      });
      document.getElementById("feedbackZone").innerHTML=html;
      sessionLog.push({timestamp:new Date().toISOString(), scenario:sc.title, strategy:currentStrategy, correct:g.correct, total:g.total, percent:pct});
      log("Recall checked — "+g.correct+"/"+g.total+".");
    };
    btnRestart.onclick=()=>{ location.reload(); };

    // CSV download (+ optional augmentation by clinician_feedback.js)
    btnDownload.onclick=()=>{
      if(sessionLog.length===0){ log("Nothing to download yet."); return; }
      const escape=v=>('"' + String(v).replace(/"/g,'""') + '"');
      const header=Object.keys(sessionLog[0]).join(",");
      const lines=sessionLog.map(r=>Object.values(r).map(escape).join(","));
      let csv = [header, ...lines].join("\n");
      if (typeof window.__augmentCSV === "function") {
        try { csv = window.__augmentCSV(csv) || csv; } catch(e){ /* ignore */ }
      }
      const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url; a.download="memory_in_action_sessions.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    };

    // ===== Robust voice loading =====
function populateVoices(){
  if(!("speechSynthesis" in window)) { 
    voiceSel.innerHTML='<option>Speech not supported</option>'; 
    return true; 
  }
  const voices = speechSynthesis.getVoices();
  if(!voices || voices.length===0) return false;

  // filter for Libby Online Natural
  const libbyList = voices.filter(v => /libby/i.test(v.name) && /(online|natural|neural)/i.test(v.name));

  voiceSel.innerHTML = "";

  if (libbyList.length) {
    libbyList.forEach(v => {
      const o = document.createElement("option");
      o.value = v.name;
      o.textContent = v.name + " — " + v.lang;
      voiceSel.appendChild(o);
    });
    voiceSel.value = libbyList[0].name; // preselect Libby
    return true;
  }

  // fallback if Libby not found
  const fallback = voices.find(v => /^en-GB/.test(v.lang)) || voices[0];
  if (fallback) {
    const o = document.createElement("option");
    o.value = fallback.name;
    o.textContent = fallback.name + " — " + fallback.lang;
    voiceSel.appendChild(o);
    voiceSel.value = fallback.name;
  }
  return true;
}
    function initVoices(){
      if(populateVoices()) return;
      if("speechSynthesis" in window){
        speechSynthesis.onvoiceschanged = ()=>populateVoices();
        // Fallback polling (Edge sometimes needs this)
        let tries=0; const int=setInterval(()=>{
          tries++; if(populateVoices() || tries>20){ clearInterval(int); }
        }, 100);
      }
    }
    initVoices();

    // Init stat line
    $("#statScenario").textContent="Scenario: "+THREADS[parseInt(scenarioSel.value||"0",10)].title;

    log("Ready. Pick a strategy and press Start session.");
  })();
