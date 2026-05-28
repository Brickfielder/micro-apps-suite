const EN_STRINGS = {
  "screen": {
    "title": "Emotion Chats"
  },
  "hero": {
    "title": "Emotion Chats",
    "description": "Recognise emotions and intentions in short chat-style vignettes."
  },
  "toolbar": {
    "aria": "Controls",
    "scenario": {
      "label": "Scenario"
    },
    "distractors": {
      "label": "Distractors per person"
    },
    "play": "Play chat",
    "skip": "Skip chat",
    "reset": "Reset",
    "download": {
      "label": "Download CSV",
      "title": "Download CSV of your results"
    },
    "status": {
      "ready": "Ready",
      "playing": "Playing…",
      "complete": "Chat complete — do Step 1",
      "progress": "{current} / {total}",
      "timer": "Time: {seconds}s"
    }
  },
  "sections": {
    "chat": {
      "title": "Chat",
      "title_with_names": "Chat — {name_a} & {name_b}",
      "aria": "Chat transcript"
    },
    "responses": {
      "title": "Your responses"
    },
    "step1": {
      "title": "Step 1 — Free choice",
      "label": "What emotions was {name} feeling?",
      "placeholder": "Type one or more emotions…",
      "hint": {
        "ready": "Ready.",
        "fill": "Fill both boxes to proceed.",
        "wait": "Finish the chat, then fill both boxes to proceed."
      },
      "continue": "Continue to Step 2"
    },
    "step2": {
      "title": "Step 2 — Select emotions (choose all that apply)",
      "legend": "Select all that apply for {name}",
      "submit": "Show feedback"
    },
    "step3": {
      "title": "Step 3 — Feedback",
      "correct": "Correct:",
      "selected": "You selected:",
      "hits": "Hits",
      "missed": "Missed",
      "extra": "Extra",
      "none": "—",
      "summary": "{name} — {metric} {value}%",
      "metrics": {
        "recall": "Recall",
        "precision": "Precision"
      }
    }
  },
  "csv": {
    "fileName": "emotion_chat_results.csv"
  },
  "emotions": {
    "master": [
      "happy",
      "excited",
      "frustrated",
      "irritated",
      "calm",
      "disappointed",
      "guilty",
      "sad",
      "defensive",
      "anxious",
      "embarrassed",
      "angry",
      "relieved",
      "neutral",
      "confused",
      "optimistic",
      "proud",
      "distant",
      "supportive",
      "jealous",
      "envious",
      "hurt",
      "curious",
      "content",
      "resentful",
      "surprised",
      "hopeful",
      "grateful",
      "appreciative",
      "concerned",
      "bored",
      "regretful",
      "apathetic",
      "withdrawn"
    ],
    "labels": {
      "happy": "Happy",
      "excited": "Excited",
      "frustrated": "Frustrated",
      "irritated": "Irritated",
      "calm": "Calm",
      "disappointed": "Disappointed",
      "guilty": "Guilty",
      "sad": "Sad",
      "defensive": "Defensive",
      "anxious": "Anxious",
      "embarrassed": "Embarrassed",
      "angry": "Angry",
      "relieved": "Relieved",
      "neutral": "Neutral",
      "confused": "Confused",
      "optimistic": "Optimistic",
      "proud": "Proud",
      "distant": "Distant",
      "supportive": "Supportive",
      "jealous": "Jealous",
      "envious": "Envious",
      "hurt": "Hurt",
      "curious": "Curious",
      "content": "Content",
      "resentful": "Resentful",
      "surprised": "Surprised",
      "hopeful": "Hopeful",
      "grateful": "Grateful",
      "appreciative": "Appreciative",
      "concerned": "Concerned",
      "bored": "Bored",
      "regretful": "Regretful",
      "apathetic": "Apathetic",
      "withdrawn": "Withdrawn"
    }
  },
  "scenarios": {
    "order": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J"
    ],
    "A": {
      "title": "Group Project",
      "people": {
        "A": "Alex",
        "B": "Sam"
      },
      "messages": [
        {
          "from": "A",
          "text": "Hey, have you added your part to the doc yet?"
        },
        {
          "from": "B",
          "text": "Not yet, had a busy day. Will do later."
        },
        {
          "from": "A",
          "text": "Okay, it’s just due tomorrow 😬"
        },
        {
          "from": "B",
          "text": "I know, relax. I’ll get it done."
        },
        {
          "from": "A",
          "text": "We still need to check references and format everything."
        },
        {
          "from": "B",
          "text": "You always stress too much. It’ll be fine."
        },
        {
          "from": "A",
          "text": "I’m not stressing, just making sure we don’t lose marks."
        },
        {
          "from": "B",
          "text": "Well I said I’ll do it later. Can you chill?"
        },
        {
          "from": "A",
          "text": "…"
        },
        {
          "from": "B",
          "text": "Why the dots? 🙄"
        },
        {
          "from": "A",
          "text": "Nothing. I’ll just finish it myself."
        },
        {
          "from": "B",
          "text": "Suit yourself then."
        }
      ],
      "correct": {
        "A": [
          "frustrated",
          "disappointed",
          "sad",
          "withdrawn"
        ],
        "B": [
          "irritated",
          "defensive"
        ]
      },
      "cues": {
        "A": "Frustration (“due tomorrow 😬”), disappointment (“I’ll finish it myself”), withdrawal (“…”).",
        "B": "Defensiveness (“You always stress too much”), irritation (🙄)."
      }
    },
    "B": {
      "title": "Missed Call",
      "people": {
        "A": "Maya",
        "B": "Leo"
      },
      "messages": [
        {
          "from": "A",
          "text": "Tried calling you 3 times last night, where were you? 😕"
        },
        {
          "from": "B",
          "text": "Sorry, phone was on silent."
        },
        {
          "from": "A",
          "text": "I was worried. Thought something happened."
        },
        {
          "from": "B",
          "text": "Nah, just needed some quiet time."
        },
        {
          "from": "A",
          "text": "Without telling me? We were supposed to chat."
        },
        {
          "from": "B",
          "text": "Didn’t think it was a big deal."
        },
        {
          "from": "A",
          "text": "Well it kind of was… I waited."
        },
        {
          "from": "B",
          "text": "You always overthink these things."
        },
        {
          "from": "A",
          "text": "Maybe. But it hurt a little."
        },
        {
          "from": "B",
          "text": "I didn’t mean to. Just tired."
        },
        {
          "from": "A",
          "text": "So… are we still talking tonight?"
        },
        {
          "from": "B",
          "text": "Might be busy again. Don’t wait up."
        },
        {
          "from": "A",
          "text": "Oh. Okay then."
        }
      ],
      "correct": {
        "A": [
          "anxious",
          "hurt",
          "disappointed"
        ],
        "B": [
          "distant",
          "defensive",
          "irritated"
        ]
      },
      "cues": {
        "A": "Anxiety (“worried”), hurt/disappointment (“I waited”, “hurt a little”).",
        "B": "Avoidance, defensiveness (“overthink”), distance (“Don’t wait up”)."
      }
    },
    "C": {
      "title": "Forgotten Favour",
      "people": {
        "A": "Liam",
        "B": "Noah"
      },
      "messages": [
        {
          "from": "A",
          "text": "Hey, did you manage to pick up my parcel?"
        },
        {
          "from": "B",
          "text": "Ah, totally slipped my mind 😬 sorry."
        },
        {
          "from": "A",
          "text": "That’s the third time you’ve forgotten…"
        },
        {
          "from": "B",
          "text": "I’ve been super busy, cut me some slack."
        },
        {
          "from": "A",
          "text": "I waited at home all afternoon."
        },
        {
          "from": "B",
          "text": "I said I was sorry. Do you want me to drive there now?"
        },
        {
          "from": "A",
          "text": "It closes in 10 minutes. Forget it."
        },
        {
          "from": "B",
          "text": "Come on, don’t be dramatic."
        },
        {
          "from": "A",
          "text": "Right."
        },
        {
          "from": "B",
          "text": "Seriously, what do you want me to do?"
        },
        {
          "from": "A",
          "text": "Nothing. I’ll figure it out."
        },
        {
          "from": "B",
          "text": "Fine then."
        }
      ],
      "correct": {
        "A": [
          "frustrated",
          "resentful",
          "disappointed"
        ],
        "B": [
          "guilty",
          "defensive"
        ]
      },
      "cues": {
        "A": "“Third time…” = resentment; “Forget it” = disappointment.",
        "B": "“😬 sorry” = guilt; “cut me some slack” = defensive."
      }
    },
    "D": {
      "title": "Concert Ticket",
      "people": {
        "A": "Ella",
        "B": "Sophie"
      },
      "messages": [
        {
          "from": "A",
          "text": "Guess what, I got tickets to the concert!! 🎶🔥"
        },
        {
          "from": "B",
          "text": "No way, lucky you."
        },
        {
          "from": "A",
          "text": "Front row seats too 😍 can’t wait."
        },
        {
          "from": "B",
          "text": "Wow. Must’ve cost a fortune."
        },
        {
          "from": "A",
          "text": "Worth every penny."
        },
        {
          "from": "B",
          "text": "I tried but they were sold out…"
        },
        {
          "from": "A",
          "text": "I was online right when they went live."
        },
        {
          "from": "B",
          "text": "Not all of us can sit refreshing a page all day 🙄."
        },
        {
          "from": "A",
          "text": "Hey, sorry. Didn’t mean to rub it in."
        },
        {
          "from": "B",
          "text": "No, it’s fine. Have fun."
        },
        {
          "from": "A",
          "text": "Want me to record some clips for you?"
        },
        {
          "from": "B",
          "text": "Don’t bother."
        },
        {
          "from": "A",
          "text": "…"
        }
      ],
      "correct": {
        "A": [
          "excited",
          "guilty"
        ],
        "B": [
          "jealous",
          "irritated",
          "hurt",
          "envious"
        ]
      },
      "cues": {
        "A": "“Front row seats 😍” = excitement; apology hints guilt.",
        "B": "Dismissive lines + 🙄 + “Don’t bother” = envy, irritation, hurt."
      }
    },
    "E": {
      "title": "Lost Wallet",
      "people": {
        "A": "Nina",
        "B": "Omar"
      },
      "messages": [
        {
          "from": "A",
          "text": "I just found your wallet by the café!"
        },
        {
          "from": "B",
          "text": "No way—are you serious??"
        },
        {
          "from": "A",
          "text": "Yep. Everything’s inside. I can drop it off now."
        },
        {
          "from": "B",
          "text": "I’ve been searching for an hour. I thought it was gone forever."
        },
        {
          "from": "A",
          "text": "I’m outside your building in 5."
        },
        {
          "from": "B",
          "text": "You’re a lifesaver. I was panicking."
        },
        {
          "from": "A",
          "text": "All good. See you in a bit."
        },
        {
          "from": "B",
          "text": "Thank you, really. I owe you one."
        },
        {
          "from": "A",
          "text": "Don’t worry about it 😊"
        },
        {
          "from": "B",
          "text": "I can finally breathe."
        }
      ],
      "correct": {
        "A": [
          "supportive",
          "calm",
          "content"
        ],
        "B": [
          "relieved",
          "grateful",
          "appreciative"
        ]
      },
      "cues": {
        "A": "Practical reassurance + calm tone.",
        "B": "Relief (“finally breathe”), gratitude (“owe you one”)."
      }
    },
    "F": {
      "title": "Presentation Praise",
      "people": {
        "A": "Ava",
        "B": "Ben"
      },
      "messages": [
        {
          "from": "A",
          "text": "Your presentation was fantastic today!"
        },
        {
          "from": "B",
          "text": "Oh—thanks! I’m glad it landed."
        },
        {
          "from": "A",
          "text": "The Q&A was tough but you handled it."
        },
        {
          "from": "B",
          "text": "I did prepare for those."
        },
        {
          "from": "A",
          "text": "You should be proud."
        },
        {
          "from": "B",
          "text": "I am, actually. It took weeks."
        },
        {
          "from": "A",
          "text": "It showed."
        },
        {
          "from": "B",
          "text": "Thanks for saying that."
        },
        {
          "from": "A",
          "text": "We should submit it to the conference."
        },
        {
          "from": "B",
          "text": "Great idea!"
        }
      ],
      "correct": {
        "A": [
          "supportive",
          "happy"
        ],
        "B": [
          "proud",
          "relieved",
          "happy"
        ]
      },
      "cues": {
        "A": "Warm encouragement and affirmation.",
        "B": "Acknowledges effort → pride; post-event easing → relief."
      }
    },
    "G": {
      "title": "Awkward Joke",
      "people": {
        "A": "Chloe",
        "B": "Dan"
      },
      "messages": [
        {
          "from": "A",
          "text": "About earlier… my joke wasn’t great."
        },
        {
          "from": "B",
          "text": "It caught people off guard."
        },
        {
          "from": "A",
          "text": "I didn’t mean to upset anyone."
        },
        {
          "from": "B",
          "text": "Maybe just bad timing."
        },
        {
          "from": "A",
          "text": "I feel silly now."
        },
        {
          "from": "B",
          "text": "Happens to everyone."
        },
        {
          "from": "A",
          "text": "Should I apologise to Mira?"
        },
        {
          "from": "B",
          "text": "A quick message would help."
        },
        {
          "from": "A",
          "text": "I’ll do that now."
        },
        {
          "from": "B",
          "text": "Good call."
        }
      ],
      "correct": {
        "A": [
          "embarrassed",
          "regretful",
          "anxious"
        ],
        "B": [
          "supportive",
          "concerned",
          "calm"
        ]
      },
      "cues": {
        "A": "Admits mistake → embarrassment/regret.",
        "B": "Gentle guidance; steady tone."
      }
    },
    "H": {
      "title": "Flat Tyre",
      "people": {
        "A": "Priya",
        "B": "Tom"
      },
      "messages": [
        {
          "from": "A",
          "text": "Stuck with a flat tyre on the A2."
        },
        {
          "from": "B",
          "text": "Are you safe? Hazards on?"
        },
        {
          "from": "A",
          "text": "Yeah, pulled over."
        },
        {
          "from": "B",
          "text": "I can come out with the pump."
        },
        {
          "from": "A",
          "text": "That’d be amazing."
        },
        {
          "from": "B",
          "text": "Send me your location."
        },
        {
          "from": "A",
          "text": "Done."
        },
        {
          "from": "B",
          "text": "On my way. 15 mins."
        },
        {
          "from": "A",
          "text": "Thanks. I was a bit shaken."
        },
        {
          "from": "B",
          "text": "You’ll be fine. We’ve got this."
        }
      ],
      "correct": {
        "A": [
          "anxious",
          "relieved"
        ],
        "B": [
          "concerned",
          "supportive",
          "calm"
        ]
      },
      "cues": {
        "A": "Stress then relief when help is coming.",
        "B": "Checks safety, offers concrete help."
      }
    },
    "I": {
      "title": "Party Invite",
      "people": {
        "A": "Zoe",
        "B": "Mark"
      },
      "messages": [
        {
          "from": "A",
          "text": "You coming to Jess’s party tonight?"
        },
        {
          "from": "B",
          "text": "Maybe. Long week."
        },
        {
          "from": "A",
          "text": "It’ll be fun—lots of people."
        },
        {
          "from": "B",
          "text": "Hmm."
        },
        {
          "from": "A",
          "text": "We could go for just an hour."
        },
        {
          "from": "B",
          "text": "I might skip this one."
        },
        {
          "from": "A",
          "text": "Ah, okay."
        },
        {
          "from": "B",
          "text": "Tell her happy birthday from me."
        },
        {
          "from": "A",
          "text": "Will do."
        },
        {
          "from": "B",
          "text": "Catch up another time?"
        }
      ],
      "correct": {
        "A": [
          "disappointed",
          "hurt"
        ],
        "B": [
          "bored",
          "apathetic",
          "distant"
        ]
      },
      "cues": {
        "A": "Deflation after efforts to persuade.",
        "B": "Low-energy, non-committal; opts out."
      }
    },
    "J": {
      "title": "Unexpected Gift",
      "people": {
        "A": "Hana",
        "B": "Luca"
      },
      "messages": [
        {
          "from": "A",
          "text": "Left something at your door 😊"
        },
        {
          "from": "B",
          "text": "What? I just saw a box!"
        },
        {
          "from": "A",
          "text": "Open it!"
        },
        {
          "from": "B",
          "text": "Whoa—my favourite tea."
        },
        {
          "from": "A",
          "text": "Figured you needed a pick-me-up."
        },
        {
          "from": "B",
          "text": "This made my day."
        },
        {
          "from": "A",
          "text": "Glad it helped."
        },
        {
          "from": "B",
          "text": "I didn’t expect this at all."
        },
        {
          "from": "A",
          "text": "You’ve been working so hard."
        },
        {
          "from": "B",
          "text": "Thank you—really."
        }
      ],
      "correct": {
        "A": [
          "supportive",
          "happy"
        ],
        "B": [
          "surprised",
          "grateful",
          "appreciative"
        ]
      },
      "cues": {
        "A": "Attuned generosity; upbeat tone.",
        "B": "“Didn’t expect this” + thanks → surprise + gratitude."
      }
    }
  }
};

function lookupI18n(path) {
  return String(path || '').split('.').reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) return value[key];
    return undefined;
  }, EN_STRINGS);
}

function interpolateI18n(template, vars = {}) {
  return String(template ?? '').replace(/\{([\w-]+)\}/g, (_, key) => vars[key] ?? '');
}

function translateI18n(key, vars = {}) {
  const value = lookupI18n(key);
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  return interpolateI18n(value ?? key, vars);
}

function applyI18n(root = document) {
  const scope = root || document;
  const nodes = scope.matches?.('[data-i18n]') ? [scope] : [];
  nodes.push(...scope.querySelectorAll?.('[data-i18n]') ?? []);
  nodes.forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const vars = {};
    for (const attr of Array.from(node.attributes)) {
      if (attr.name.startsWith('data-i18n-') && attr.name !== 'data-i18n' && attr.name !== 'data-i18n-attr') {
        vars[attr.name.slice('data-i18n-'.length)] = attr.value;
      }
    }
    const value = translateI18n(key, vars);
    const attrName = node.getAttribute('data-i18n-attr');
    if (attrName) {
      node.setAttribute(attrName, value);
    } else {
      node.textContent = value;
    }
  });
}

window.I18N = {
  lang: 'en',
  dict: EN_STRINGS,
  t: translateI18n,
  apply: applyI18n,
  ready: new Promise((resolve) => {
    const finish = () => {
      applyI18n(document);
      resolve();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', finish, { once: true });
    } else {
      finish();
    }
  }),
};

window.addEventListener('DOMContentLoaded', () => {
    const whenI18N = window.I18N?.ready || Promise.resolve();
    whenI18N.then(() => {
      const { I18N } = window;
      const t = (key, vars = {}) => I18N.t(key, vars);

      const heroTitleEl = document.querySelector('.hero-title');
      const heroLeadEl = document.querySelector('.hero-lead');
      const defaultHeroTitle = heroTitleEl ? heroTitleEl.textContent : '';
      const defaultHeroDesc = heroLeadEl ? heroLeadEl.textContent : '';

      const renderHero = () => {
        if (!window.I18N) return;
        const titleEl = document.querySelector('.hero-title');
        if (titleEl) {
          const heroTitleText = I18N.t('hero.title');
          const fallbackTitle = I18N.t('screen.title');
          const resolvedTitle = heroTitleText !== 'hero.title'
            ? heroTitleText
            : (fallbackTitle !== 'screen.title' ? fallbackTitle : defaultHeroTitle);
          if (resolvedTitle) titleEl.textContent = resolvedTitle;
        }
        const descEl = document.querySelector('.hero-lead');
        if (descEl) {
          const heroDesc = I18N.t('hero.description');
          const resolvedDesc = heroDesc !== 'hero.description' ? heroDesc : defaultHeroDesc;
          if (resolvedDesc) descEl.textContent = resolvedDesc;
        }
      };

      renderHero();
      window.addEventListener('i18n:applied', renderHero);

      const $ = (id) => document.getElementById(id);

      const chatEl = $("chat");
      const scenarioSel = $("scenario");
      const playBtn = $("play");
      const skipBtn = $("skip");
      const resetBtn = $("reset");
      const downloadBtn = $("download");
      const statusEl = $("status");
      const progressEl = $("progress");
      const chatTitle = $("chatTitle");
      const timerText = $("timerText");
      const proceedBtn = $("proceed");
      const step1Hint = $("step1Hint");
      const step2 = $("step2");
      const submitBtn = $("submit");
      const step3 = $("step3");
      const freeA = $("freeA");
      const freeB = $("freeB");
      const labelA = $("labelA");
      const labelB = $("labelB");
      const pillTitleA = $("pillTitleA");
      const pillTitleB = $("pillTitleB");
      const pillsA = $("pillsA");
      const pillsB = $("pillsB");
      const fbA = $("fbA");
      const fbB = $("fbB");
      const kpi = $("kpi");
      const distractorsSel = $("distractors");

      const RESULTS = [];
      const DEFAULT_EMOTION_IDS = [
        "happy","excited","frustrated","irritated","calm","disappointed","guilty","sad","defensive","anxious",
        "embarrassed","angry","relieved","neutral","confused","optimistic","proud","distant","supportive",
        "jealous","envious","hurt","curious","content","resentful","surprised","hopeful","grateful",
        "appreciative","concerned","bored","regretful","apathetic","withdrawn"
      ];

      let masterEmotionIds = DEFAULT_EMOTION_IDS.slice();
      let scenarios = [];
      let current = null;
      let idx = 0;
      let revealed = false;
      let startTime = 0;
      let endTime = 0;
      let timer = null;
      let tickInt = null;
      let listFormatter = new Intl.ListFormat(I18N.lang, { style: 'long', type: 'conjunction' });

      const setDisabled = (el, value) => el.toggleAttribute('disabled', !!value);

      function hydrateData() {
        const dict = I18N.dict || {};
        const emotions = dict.emotions || {};
        if (Array.isArray(emotions.master) && emotions.master.length) {
          masterEmotionIds = emotions.master.slice();
        } else {
          masterEmotionIds = DEFAULT_EMOTION_IDS.slice();
        }
        listFormatter = new Intl.ListFormat(I18N.lang, { style: 'long', type: 'conjunction' });

        const scenarioDict = dict.scenarios || {};
        const order = Array.isArray(scenarioDict.order)
          ? scenarioDict.order
          : Object.keys(scenarioDict).filter(key => key !== 'order');
        scenarios = order.map((id) => {
          const entry = scenarioDict[id];
          if (!entry) return null;
          const messages = Array.isArray(entry.messages)
            ? entry.messages.map((m) => ({ from: m.from, text: m.text }))
            : [];
          return {
            id,
            title: entry.title || id,
            people: entry.people || {},
            messages,
            correct: entry.correct || {},
            cues: entry.cues || {}
          };
        }).filter(Boolean);
      }

      function formatEmotion(id) {
        const key = `emotions.labels.${id}`;
        const label = t(key);
        return label === key ? id : label;
      }

      function formatList(ids) {
        if (!ids || !ids.length) return t('sections.step3.none');
        return listFormatter.format(ids.map(formatEmotion));
      }

      function clearChat() {
        chatEl.innerHTML = '';
      }

      function addBubble(message) {
        const wrap = document.createElement('div');
        const bubble = document.createElement('div');
        const who = document.createElement('span');
        const from = message.from;
        const name = current?.people?.[from] || from;
        who.className = 'name';
        who.textContent = name;
        bubble.className = 'bubble ' + (from === 'A' ? 'fromA' : 'fromB');
        bubble.textContent = message.text;
        wrap.appendChild(who);
        wrap.appendChild(bubble);
        wrap.style.textAlign = from === 'A' ? 'left' : 'right';
        chatEl.appendChild(wrap);
        chatEl.scrollTop = chatEl.scrollHeight;
      }

      function shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
      }

      function clearI18nVars(el) {
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name.startsWith('data-i18n-') && attr.name !== 'data-i18n' && attr.name !== 'data-i18n-attr') {
            el.removeAttribute(attr.name);
          }
        });
      }

      function setI18n(el, key, vars = {}) {
        if (!el) return;
        clearI18nVars(el);
        if (key) {
          el.setAttribute('data-i18n', key);
          Object.entries(vars).forEach(([name, value]) => {
            el.setAttribute(`data-i18n-${name}`, value);
          });
          I18N.apply(el);
        } else {
          el.removeAttribute('data-i18n');
          el.textContent = '';
        }
      }

      function setProgress(currentValue, totalValue) {
        setI18n(progressEl, 'toolbar.status.progress', { current: currentValue, total: totalValue });
      }

      function setTimerValue(seconds) {
        if (seconds == null) {
          clearI18nVars(timerText);
          timerText.removeAttribute('data-i18n');
          timerText.textContent = '';
          return;
        }
        setI18n(timerText, 'toolbar.status.timer', { seconds });
      }

      function setStatus(key, vars = {}) {
        setI18n(statusEl, key, vars);
      }

      function secondsSince(t0) {
        return Math.max(0, Math.round((Date.now() - t0) / 1000));
      }

      function stopTicking() {
        if (tickInt) {
          clearInterval(tickInt);
          tickInt = null;
        }
      }

      function startTicking() {
        stopTicking();
        tickInt = setInterval(() => {
          if (startTime) {
            setTimerValue(secondsSince(startTime));
          }
        }, 1000);
      }

      function stopPlaybackTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function populateScenarioList(selectedId) {
        scenarioSel.innerHTML = '';
        scenarios.forEach((s) => {
          const opt = document.createElement('option');
          opt.value = s.id;
          opt.textContent = s.title || s.id;
          scenarioSel.appendChild(opt);
        });
        if (selectedId) {
          scenarioSel.value = selectedId;
        }
      }

      function loadScenario(id) {
        if (!scenarios.length) return;
        current = scenarios.find((s) => s.id === id) || scenarios[0];
        scenarioSel.value = current.id;
        idx = 0;
        revealed = false;
        startTime = 0;
        endTime = 0;
        stopPlaybackTimer();
        stopTicking();
        clearChat();
        step3.hidden = true;
        setProgress(0, current.messages.length || 0);
        setTimerValue(null);
        setStatus('toolbar.status.ready');
        setDisabled(playBtn, false);
        setDisabled(skipBtn, true);
        setDisabled(resetBtn, true);
        setDisabled(downloadBtn, RESULTS.length === 0);

        freeA.value = '';
        freeB.value = '';
        setI18n(chatTitle, 'sections.chat.title_with_names', {
          name_a: current.people?.A || 'A',
          name_b: current.people?.B || 'B'
        });
        setI18n(labelA, 'sections.step1.label', { name: current.people?.A || 'A' });
        setI18n(labelB, 'sections.step1.label', { name: current.people?.B || 'B' });

        step2.hidden = true;
        submitBtn.disabled = true;
        setI18n(pillTitleA, 'sections.step2.legend', { name: current.people?.A || 'A' });
        setI18n(pillTitleB, 'sections.step2.legend', { name: current.people?.B || 'B' });

        buildPills();
        updateProceedState();
      }

      function buildPills() {
        const N = parseInt(distractorsSel.value, 10) || 8;
        const correctA = Array.isArray(current?.correct?.A) ? current.correct.A : [];
        const correctB = Array.isArray(current?.correct?.B) ? current.correct.B : [];

        const makeGrid = (arr) => {
          const set = new Set(arr);
          const pool = masterEmotionIds.filter((id) => !set.has(id));
          const distractors = shuffle(pool).slice(0, Math.max(0, N));
          return shuffle([...new Set([...arr, ...distractors])]);
        };

        const listA = makeGrid(correctA);
        const listB = makeGrid(correctB);

        pillsA.innerHTML = '';
        pillsB.innerHTML = '';

        listA.forEach((id) => {
          const btn = document.createElement('button');
          btn.className = 'pill-btn';
          btn.type = 'button';
          btn.dataset.emotionId = id;
          btn.textContent = formatEmotion(id);
          btn.setAttribute('aria-pressed', 'false');
          btn.addEventListener('click', () => {
            togglePill(btn);
            updateSubmitState();
          });
          pillsA.appendChild(btn);
        });

        listB.forEach((id) => {
          const btn = document.createElement('button');
          btn.className = 'pill-btn';
          btn.type = 'button';
          btn.dataset.emotionId = id;
          btn.textContent = formatEmotion(id);
          btn.setAttribute('aria-pressed', 'false');
          btn.addEventListener('click', () => {
            togglePill(btn);
            updateSubmitState();
          });
          pillsB.appendChild(btn);
        });
      }

      function togglePill(el) {
        const pressed = el.getAttribute('aria-pressed') === 'true';
        el.setAttribute('aria-pressed', String(!pressed));
      }

      function updateProceedState() {
        const filled = freeA.value.trim().length > 0 && freeB.value.trim().length > 0;
        setDisabled(proceedBtn, !(filled && revealed));
        if (!revealed) {
          setI18n(step1Hint, 'sections.step1.hint.wait');
        } else if (filled) {
          setI18n(step1Hint, 'sections.step1.hint.ready');
        } else {
          setI18n(step1Hint, 'sections.step1.hint.fill');
        }
      }

      function updateSubmitState() {
        const aChosen = !!pillsA.querySelector('.pill-btn[aria-pressed="true"]');
        const bChosen = !!pillsB.querySelector('.pill-btn[aria-pressed="true"]');
        setDisabled(submitBtn, !(aChosen && bChosen));
      }

      function playChat() {
        if (!current) return;
        setDisabled(playBtn, true);
        setDisabled(skipBtn, false);
        setDisabled(resetBtn, false);
        setStatus('toolbar.status.playing');
        startTime = Date.now();
        setTimerValue(0);
        startTicking();
        stopPlaybackTimer();
        timer = setInterval(() => {
          if (idx >= current.messages.length) {
            finishChat();
            return;
          }
          const message = current.messages[idx++];
          addBubble(message);
          setProgress(idx, current.messages.length);
          if (idx >= current.messages.length) {
            finishChat();
          }
        }, 3500);
      }

      function finishChat() {
        stopPlaybackTimer();
        setDisabled(skipBtn, true);
        endTime = Date.now();
        stopTicking();
        if (startTime) {
          setTimerValue(secondsSince(startTime));
        }
        setStatus('toolbar.status.complete');
        revealed = true;
        updateProceedState();
      }

      function skipChat() {
        if (!current) return;
        if (!startTime) {
          startTime = Date.now();
          setTimerValue(0);
          startTicking();
        }
        stopPlaybackTimer();
        while (idx < current.messages.length) {
          const message = current.messages[idx++];
          addBubble(message);
        }
        setProgress(current.messages.length, current.messages.length);
        finishChat();
      }

      function resetAll() {
        loadScenario(scenarioSel.value);
      }

      function computeFeedback() {
        const selectedA = [...pillsA.querySelectorAll('.pill-btn[aria-pressed="true"]')]
          .map((btn) => btn.dataset.emotionId);
        const selectedB = [...pillsB.querySelectorAll('.pill-btn[aria-pressed="true"]')]
          .map((btn) => btn.dataset.emotionId);

        const corrA = Array.isArray(current?.correct?.A) ? current.correct.A : [];
        const corrB = Array.isArray(current?.correct?.B) ? current.correct.B : [];

        const setFrom = (arr) => new Set(arr);
        const aSet = setFrom(selectedA);
        const bSet = setFrom(selectedB);
        const cA = setFrom(corrA);
        const cB = setFrom(corrB);

        const aHits = selectedA.filter((id) => cA.has(id));
        const aMiss = corrA.filter((id) => !aSet.has(id));
        const aExtra = selectedA.filter((id) => !cA.has(id));

        const bHits = selectedB.filter((id) => cB.has(id));
        const bMiss = corrB.filter((id) => !bSet.has(id));
        const bExtra = selectedB.filter((id) => !cB.has(id));

        const precision = (hits, picks) => (picks === 0 ? 0 : Math.round((hits / picks) * 100));
        const recall = (hits, total) => (total === 0 ? 0 : Math.round((hits / total) * 100));

        const aPrec = precision(aHits.length, selectedA.length);
        const aRec = recall(aHits.length, corrA.length);
        const bPrec = precision(bHits.length, selectedB.length);
        const bRec = recall(bHits.length, corrB.length);

        fbA.innerHTML = `
          <strong>${current.people?.A || 'A'}</strong><br/>
          <span class="small">${t('sections.step3.correct')}</span> ${formatList(corrA)}<br/>
          <span class="small">${t('sections.step3.selected')}</span> ${formatList(selectedA)}<br/>
          <div class="small" style="margin-top:6px">${current.cues?.A || ''}</div>
          <div class="small" style="margin-top:6px;color:${aExtra.length ? '#7f1d1d' : '#065f46'}">
            ${t('sections.step3.hits')}: ${formatList(aHits)} | ${t('sections.step3.missed')}: ${formatList(aMiss)} | ${t('sections.step3.extra')}: ${formatList(aExtra)}
          </div>
        `;

        fbB.innerHTML = `
          <strong>${current.people?.B || 'B'}</strong><br/>
          <span class="small">${t('sections.step3.correct')}</span> ${formatList(corrB)}<br/>
          <span class="small">${t('sections.step3.selected')}</span> ${formatList(selectedB)}<br/>
          <div class="small" style="margin-top:6px">${current.cues?.B || ''}</div>
          <div class="small" style="margin-top:6px;color:${bExtra.length ? '#7f1d1d' : '#065f46'}">
            ${t('sections.step3.hits')}: ${formatList(bHits)} | ${t('sections.step3.missed')}: ${formatList(bMiss)} | ${t('sections.step3.extra')}: ${formatList(bExtra)}
          </div>
        `;

        kpi.innerHTML = `
          <span class="tag ${aRec >= 75 ? 'good' : 'bad'}">${t('sections.step3.summary', { name: current.people?.A || 'A', metric: t('sections.step3.metrics.recall'), value: aRec })}</span>
          <span class="tag ${aPrec >= 75 ? 'good' : 'bad'}">${t('sections.step3.summary', { name: current.people?.A || 'A', metric: t('sections.step3.metrics.precision'), value: aPrec })}</span>
          <span class="tag ${bRec >= 75 ? 'good' : 'bad'}">${t('sections.step3.summary', { name: current.people?.B || 'B', metric: t('sections.step3.metrics.recall'), value: bRec })}</span>
          <span class="tag ${bPrec >= 75 ? 'good' : 'bad'}">${t('sections.step3.summary', { name: current.people?.B || 'B', metric: t('sections.step3.metrics.precision'), value: bPrec })}</span>
        `;

        step3.hidden = false;

        const durationSec = Math.max(0, Math.round(((endTime || Date.now()) - (startTime || Date.now())) / 1000));
        RESULTS.push({
          scenario_id: current.id,
          scenario_title: current.title,
          personA: current.people?.A || 'A',
          personB: current.people?.B || 'B',
          freeA: freeA.value.replace(/\s+/g, ' ').trim(),
          freeB: freeB.value.replace(/\s+/g, ' ').trim(),
          selectedA: formatList(selectedA),
          selectedB: formatList(selectedB),
          hitsA: formatList(aHits),
          hitsB: formatList(bHits),
          missedA: formatList(aMiss),
          missedB: formatList(bMiss),
          extraA: formatList(aExtra),
          extraB: formatList(bExtra),
          precisionA: aPrec,
          recallA: aRec,
          precisionB: bPrec,
          recallB: bRec,
          distractors_per_person: parseInt(distractorsSel.value, 10),
          duration_s: durationSec,
          timestamp: new Date().toISOString()
        });
        setDisabled(downloadBtn, RESULTS.length === 0);
      }

      function toCSV(rows) {
        const headers = Object.keys(rows[0]);
        const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
        const lines = [headers.join(',')].concat(rows.map((row) => headers.map((h) => escape(row[h])).join(',')));
        return lines.join('\n');
      }

      function downloadCSV() {
        if (!RESULTS.length) return;
        const csv = toCSV(RESULTS);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = t('csv.fileName');
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      scenarioSel.addEventListener('change', (e) => loadScenario(e.target.value));
      distractorsSel.addEventListener('change', () => buildPills());
      playBtn.addEventListener('click', playChat);
      skipBtn.addEventListener('click', skipChat);
      resetBtn.addEventListener('click', resetAll);
      downloadBtn.addEventListener('click', downloadCSV);
      proceedBtn.addEventListener('click', () => {
        step2.hidden = false;
        const first = pillsA.querySelector('.pill-btn');
        if (first) first.focus();
      });
      submitBtn.addEventListener('click', computeFeedback);
      freeA.addEventListener('input', updateProceedState);
      freeB.addEventListener('input', updateProceedState);

      hydrateData();
      populateScenarioList(scenarios[0]?.id || '');
      if (scenarios.length) {
        loadScenario(scenarios[0].id);
      }

      const originalApply = I18N.apply.bind(I18N);
      let rerendering = false;
      I18N.apply = (root = document) => {
        originalApply(root);
        if (!rerendering && (!root || root === document)) {
          rerendering = true;
          try {
            const currentId = current?.id;
            hydrateData();
            const fallbackId = currentId && scenarios.some((s) => s.id === currentId)
              ? currentId
              : (scenarios[0]?.id || '');
            populateScenarioList(fallbackId);
            if (fallbackId) {
              loadScenario(fallbackId);
            }
          } finally {
            rerendering = false;
          }
        }
      };
    });
  });
