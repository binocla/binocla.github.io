(() => {
  // ===== Telegram init =====
  const tg = window.Telegram?.WebApp;
  try {
    tg?.ready();
    tg?.expand();
  } catch (_) {
  }

  // ===== Config =====
  // Можешь менять label/icon/note как хочешь
  const ITEMS = [
    {
      key: "clay",
      label: "Гончарная\nмастерская",
      icon: "https://img.icons8.com/?size=100&id=ZzjyQCsGr8jy&format=png&color=000000",
      note: "Творим вместе с Дарьей!"
    },
    {
      key: "tea",
      label: "Чайная",
      icon: "https://img.icons8.com/?size=100&id=cxV5gzMcQjdM&format=png&color=000000",
      note: "Чайная церемония. +вайб"
    },
    {
      key: "pub",
      label: "Ресторан",
      icon: "https://img.icons8.com/?size=100&id=115346&format=png&color=000000",
      note: "Наконец-то можно поесть..."
    },
    // новые "для разнообразия"
    {
      key: "f1",
      label: "Кино",
      icon: "https://img.icons8.com/?size=100&id=Zv_fpGUAPwFq&format=png&color=000000",
      note: "Фильмы 18+ для извращенцев)"
    },
    {
      key: "f2",
      label: "Каток",
      icon: "https://img.icons8.com/?size=100&id=isG23UlrlNt9&format=png&color=000000",
      note: "Я не умею, если честно"
    },
    {
      key: "f3",
      label: "Боулинг",
      icon: "https://img.icons8.com/?size=100&id=9qdlHo32Ue91&format=png&color=000000",
      note: "Погонять шары..."
    },
    {
      key: "f4",
      label: "Кофе",
      icon: "https://img.icons8.com/?size=100&id=115630&format=png&color=000000",
      note: "Только без сливок!"
    },
    {
      key: "f5",
      label: "Панорама",
      icon: "https://img.icons8.com/?size=100&id=113846&format=png&color=000000",
      note: "Посмотреть на город"
    },
    {
      key: "f6",
      label: "Настолки",
      icon: "https://img.icons8.com/?size=100&id=4JilNTvGn5ie&format=png&color=000000",
      note: "Дурак на раздевание"
    },
    {
      key: "f7",
      label: "Караоке",
      icon: "https://img.icons8.com/?size=100&id=124070&format=png&color=000000",
      note: "Навалить рэпа"
    },
    {
      key: "f8",
      label: "Музей",
      icon: "https://img.icons8.com/?size=100&id=WRBheC5k5NpV&format=png&color=000000",
      note: "Не Лувр, но что имеем"
    },
    {
      key: "f9",
      label: "Квест",
      icon: "https://img.icons8.com/?size=100&id=124068&format=png&color=000000",
      note: "Только не Сайлент Хилл"
    },
    {
      key: "f10",
      label: "Чилл",
      icon: "https://img.icons8.com/?size=100&id=QTfkMOYni8l8&format=png&color=000000",
      note: "Идем спать (не вместе!!!)"
    },
  ];

  // пароль -> ключ результата (порядок НЕ обязателен)
  const PASSWORD_TO_KEY = new Map([
    ["дарья", "clay"],
    ["змея", "tea"],
    ["психея", "pub"],
  ]);

  // каждый пароль можно 1 раз
  const usedPasswords = new Set();
  let spinning = false;

  // ===== DOM =====
  const reelEl = document.getElementById("reel");
  const viewportEl = document.getElementById("viewport");
  const btnSpin = document.getElementById("spin");
  const inpPwd = document.getElementById("password");
  const statusEl = document.getElementById("status");

  const resultCard = document.getElementById("resultCard");
  const resultTitle = document.getElementById("resultTitle");
  const resultSub = document.getElementById("resultSub");
  const btnOk = document.getElementById("ok");

  if (!reelEl || !viewportEl || !btnSpin || !inpPwd || !statusEl || !resultCard || !resultTitle || !resultSub) {
    console.error("Missing required DOM elements");
    return;
  }

  const gsap = window.gsap;
  if (!gsap) {
    statusEl.textContent = "GSAP не загрузился. Проверь подключение CDN.";
    statusEl.classList.add("err");
    return;
  }

  // ===== Helpers =====
  function norm(s) {
    return (s || "").trim().toLowerCase();
  }

  function setStatus(text, type) {
    statusEl.textContent = text || "";
    statusEl.classList.remove("ok", "err");
    if (type) statusEl.classList.add(type);
  }

  function hideResult() {
    resultCard.hidden = true;
  }

  function showResult(item) {
    const isUrlIcon = typeof item.icon === "string" && item.icon.startsWith("http");

    resultTitle.innerHTML = `
    <span class="result-icon">
      ${
      isUrlIcon
        ? `<img src="${escapeHtml(item.icon)}" alt="" />`
        : escapeHtml(item.icon)
    }
    </span>
    <span class="result-text">${escapeHtml(item.label.replace("\n", " "))}</span>
  `;

    resultSub.textContent = item.note || "";
    resultCard.hidden = false;
  }


  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function mkItemNode(item) {
    const el = document.createElement("div");
    el.className = "item";
    el.dataset.key = item.key;

    const isUrlIcon = typeof item.icon === "string" && item.icon.startsWith("http");

    el.innerHTML = `
    <div class="icon">
      ${
      isUrlIcon
        ? `<img src="${escapeHtml(item.icon)}" alt="" loading="lazy" />`
        : escapeHtml(item.icon)
    }
    </div>
    <div class="label">${escapeHtml(item.label).replaceAll("\n", "<br/>")}</div>
    <div class="sub">${escapeHtml(item.note || "")}</div>
  `;

    return el;
  }


  // ===== Pool =====
  let pool = [];

  function renderPool() {
    reelEl.innerHTML = "";
    for (const it of pool) reelEl.appendChild(mkItemNode(it));
  }

  // Важно: gap лучше держать константой (в Telegram WebView computed gap иногда странный)
  const GAP = 12;

  function measure() {
    const first = reelEl.querySelector(".item");
    const itemW = first ? first.getBoundingClientRect().width : 132;
    return {itemW, step: itemW + GAP};
  }

  function getCenteredItem() {
    const viewportRect = viewportEl.getBoundingClientRect();
    const cx = viewportRect.left + viewportRect.width / 2;

    const items = Array.from(reelEl.querySelectorAll(".item"));
    let best = null;
    let bestDist = Infinity;

    for (const it of items) {
      const r = it.getBoundingClientRect();
      const ic = r.left + r.width / 2;
      const d = Math.abs(ic - cx);
      if (d < bestDist) {
        bestDist = d;
        best = it;
      }
    }
    return best;
  }

  function buildPreviewPool() {
    pool = [];
    let prevKey = null;
    for (let i = 0; i < 28; i++) {
      const it = pickRandomNoAdjacent(prevKey, ITEMS);
      pool.push(it);
      prevKey = it.key;
    }
    renderPool();
    gsap.set(reelEl, {x: 0});
  }

  function pickRandomNoAdjacent(prevKey, items) {
    if (!items.length) return null;
    let cand;
    let guard = 0;
    do {
      cand = items[Math.floor(Math.random() * items.length)];
      guard++;
    } while (cand.key === prevKey && guard < 50);
    return cand;
  }

  // Делаем ОЧЕНЬ длинную ленту + "полосу" цели, чтобы 100% попасть
  function buildPoolWithTarget(targetKey) {
    pool = [];
    const base = ITEMS.slice();

    const POOL_SIZE = 260;
    let prevKey = null;

    for (let i = 0; i < POOL_SIZE; i++) {
      const it = pickRandomNoAdjacent(prevKey, base);
      pool.push(it);
      prevKey = it.key;
    }

    const stopIndex = 160 + Math.floor(Math.random() * 25); // 160..184
    const targetItem = base.find(x => x.key === targetKey) ?? pool[stopIndex];

    // "коридор" цели: без повторов по соседям делаем через чередование с filler
    for (let k = 0; k < 10; k++) {
      if (k % 2 === 0) {
        pool[stopIndex + k] = targetItem;
        prevKey = targetItem.key;
      } else {
        // filler — любой, но не равный targetItem и не равный предыдущему
        let filler;
        let guard = 0;
        do {
          filler = base[Math.floor(Math.random() * base.length)];
          guard++;
        } while ((filler.key === targetItem.key || filler.key === pool[stopIndex + k - 1].key) && guard < 100);
        pool[stopIndex + k] = filler;
        prevKey = filler.key;
      }
    }

    // дополнительно: если случайно получился повтор на стыках (до/после коридора) — поправим
    const fixAdj = (idxA, idxB) => {
      if (idxA < 0 || idxB >= pool.length) return;
      if (pool[idxA].key !== pool[idxB].key) return;
      let rep, guard = 0;
      do {
        rep = base[Math.floor(Math.random() * base.length)];
        guard++;
      } while ((rep.key === pool[idxA].key || (idxB + 1 < pool.length && rep.key === pool[idxB + 1].key)) && guard < 100);
      pool[idxB] = rep;
    };
    fixAdj(stopIndex - 1, stopIndex);
    fixAdj(stopIndex + 9, stopIndex + 10);

    renderPool();
    gsap.set(reelEl, {x: 0});

    return stopIndex + 4; // целимся ближе к центру коридора
  }

  async function spinToIndex(index) {
    spinning = true;
    btnSpin.disabled = true;

    // снять прошлую подсветку
    reelEl.querySelectorAll(".item.win").forEach(el => el.classList.remove("win"));

    const viewportW = viewportEl.getBoundingClientRect().width;
    const centerX = viewportW / 2;

    const children = Array.from(reelEl.children);
    const target = children[index];
    if (!target) {
      spinning = false;
      btnSpin.disabled = false;
      return null;
    }

    // Стабильно: offsetLeft/offsetWidth, не зависит от текущего transform
    const targetCenter = target.offsetLeft + (target.offsetWidth / 2);

    // finalX — ставим target по центру маркера
    let finalX = centerX - targetCenter;

    // Ограничим, чтобы лента не заканчивалась
    const reelWidth = reelEl.scrollWidth;
    const minX = viewportW - reelWidth; // максимально влево
    const maxX = 0;                    // максимально вправо
    finalX = Math.max(minX, Math.min(maxX, finalX));

    // overshoot — для драмы, но не уезжаем дальше minX
    const desiredOvershoot = viewportW * 2.5; // меняй 2.0..4.0 под вкус
    let fastX = finalX - desiredOvershoot;
    if (fastX < minX) fastX = minX;

    await new Promise((resolve) => {
      gsap.timeline({onComplete: resolve})
        // плавный разгон
        .to(reelEl, {
          x: finalX,
          duration: 6.0,
          ease: "expo.out"
        });
    });

    // Реальный элемент под маркером (то, что человек видит)
    const centered = getCenteredItem();
    if (centered) {
      centered.classList.add("win");
      gsap.fromTo(centered, {scale: 1}, {scale: 1.04, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out"});
    }

    try {
      tg?.HapticFeedback?.impactOccurred?.("medium");
    } catch (_) {
    }

    if (window.confetti) {
      window.confetti({
        particleCount: 60,
        spread: 55,
        startVelocity: 26,
        origin: {x: 0.5, y: 0.20}
      });
    }

    spinning = false;
    btnSpin.disabled = false;

    return centered?.dataset?.key || null;
  }

  // ===== Events =====
  btnSpin.addEventListener("click", async () => {
    if (spinning) return;
    hideResult();
    setStatus("");

    const pwd = norm(inpPwd.value);
    if (!pwd) return setStatus("Введи пароль 🙂", "err");
    if (usedPasswords.has(pwd)) return setStatus("Этот пароль уже использовали. Нужен другой 😉", "err");

    const targetKey = PASSWORD_TO_KEY.get(pwd);
    if (!targetKey) return setStatus("Пароль не подходит. Попробуй ещё 🙂", "err");

    usedPasswords.add(pwd);
    inpPwd.value = "";

    const stopIndex = buildPoolWithTarget(targetKey);
    const realKey = await spinToIndex(stopIndex);

    // Показываем то, что реально встало по центру (и под win-рамкой)
    const item = ITEMS.find(x => x.key === realKey) || ITEMS.find(x => x.key === targetKey);
    if (item) showResult(item);

    setStatus("Открыто ✨", "ok");
    try {
      tg?.HapticFeedback?.notificationOccurred?.("success");
    } catch (_) {
    }
  });

  inpPwd.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnSpin.click();
  });

  btnOk?.addEventListener("click", () => hideResult());

  // ===== INIT =====
  hideResult();
  buildPreviewPool();
  setStatus("Пароль узнавай у Сережи", null);
})();
