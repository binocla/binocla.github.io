(() => {
    const $ = (id) => document.getElementById(id);
    const canvas = $("gameCanvas");
    const ctx = canvas?.getContext("2d");
    const overlay = $("overlay");
    const overlayEyebrow = $("overlayEyebrow");
    const overlayTitle = $("overlayTitle");
    const overlayMessage = $("overlayMessage");
    const overlayMeta = $("overlayMeta");
    const primaryAction = $("primaryAction");
    const statusText = $("statusText");
    const mobileStatusText = $("mobileStatusText");
    const progressList = $("progressList");
    const mobileProgressList = $("mobileProgressList");
    const livesStat = $("livesStat");
    const timerStat = $("timerStat");
    const mobileSheet = $("mobileSheet");
    const mobileSheetButton = $("mobileSheetButton");
    const mobileSheetClose = $("mobileSheetClose");
    const controlButtons = [...document.querySelectorAll("[data-dir]")];
    if (!canvas || !ctx || !overlay || !overlayEyebrow || !overlayTitle || !overlayMessage || !overlayMeta || !primaryAction || !statusText || !progressList || !livesStat || !timerStat || !mobileStatusText || !mobileProgressList || !mobileSheet || !mobileSheetButton || !mobileSheetClose) return;

    const world = {width: 960, height: 640};
    const keys = {up: false, down: false, left: false, right: false};
    const emojiFont = "28px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif";
    const emojiFontSmall = "20px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif";
    const labelFont = "700 16px 'IBM Plex Sans',sans-serif";
    const selfieImage = new Image();
    selfieImage.src = "../selfie.png";

    const pickupOrder = [
        {
            id: "coral",
            name: "Рыжая змея",
            subtitle: "Аффирмирую Дарью на миллиарды деняк",
            emoji: "🐍",
            hint: "Не моя вот я и бешусь..."
        },
        {
            id: "moon",
            name: "Безлактозная и безсахарная гадюка",
            subtitle: "Веганская",
            emoji: "🐍",
            hint: "Без ума от тебя АЛЛО!"
        },
        {id: "pocket", name: "Сережин питон", subtitle: "Главный талисман маршрута!", emoji: "🐍", hint: "Ты норм??"}
    ];

    const pickupDefs = [
        {id: "coral", x: 124, y: 118, radius: 18, tint: "#ffd166", glow: "rgba(255,209,102,0.55)", checkpoint: 1},
        {id: "moon", x: 786, y: 552, radius: 18, tint: "#87d6c6", glow: "rgba(135,214,198,0.55)", checkpoint: 3},
        {id: "pocket", x: 474, y: 204, radius: 18, tint: "#f6a6ff", glow: "rgba(246,166,255,0.55)", checkpoint: 2}
    ];

    const checkpoints = [
        {x: 82, y: 564, label: "Стартовый фонарь", unlocked: true},
        {x: 132, y: 120, label: "Оранжерея", unlocked: false},
        {x: 474, y: 386, label: "Площадь поклонения во имя Дарьи", unlocked: false},
        {x: 756, y: 530, label: "Аллея для йоги", unlocked: false}
    ];

    const blocks = [
        {x: 168, y: 112, w: 220, h: 80, color: "#28445e"},
        {x: 430, y: 86, w: 174, h: 80, color: "#2d4a63"},
        {x: 664, y: 142, w: 120, h: 176, color: "#2a465d"},
        {x: 114, y: 310, w: 144, h: 190, color: "#23455f"},
        {x: 354, y: 278, w: 248, h: 82, color: "#2f526d"},
        {x: 420, y: 436, w: 236, h: 80, color: "#294b62"},
        {x: 732, y: 382, w: 134, h: 158, color: "#274459"}
    ];

    const shrubs = [
        {x: 84, y: 72, r: 26}, {x: 884, y: 586, r: 22}, {x: 246, y: 586, r: 18}, {x: 854, y: 74, r: 20}, {
            x: 614,
            y: 572,
            r: 18
        }
    ];

    const hazards = [
        {kind: "rect", x: 294, y: 230, w: 78, h: 28, axis: "x", speed: 170, min: 270, max: 550, tone: "#97c85d"},
        {kind: "rect", x: 640, y: 336, w: 28, h: 86, axis: "y", speed: 150, min: 254, max: 490, tone: "#8ecb67"},
        {kind: "rect", x: 208, y: 540, w: 82, h: 24, axis: "x", speed: 200, min: 92, max: 390, tone: "#9bd064"},
        {kind: "orbiter", anchorX: 476, anchorY: 390, orbit: 56, angle: 0.8, speed: 1.4, radius: 18, tone: "#93cb60"},
        {kind: "orbiter", anchorX: 476, anchorY: 390, orbit: 56, angle: 3.4, speed: -1.2, radius: 18, tone: "#7fba4f"},
        {kind: "beam", x: 796, y: 162, w: 22, h: 128, axis: "y", speed: 180, min: 120, max: 330, tone: "#9fce6d"}
    ];

    const goal = {x: 842, y: 66, w: 54, h: 86};
    const player = {x: 82, y: 564, size: 28, speed: 212, vx: 0, vy: 0, invuln: 0, lastDir: {x: 1, y: 0}};
    const state = {
        mode: "intro",
        elapsed: 0,
        lives: 3,
        maxLives: 3,
        hits: 0,
        checkpointIndex: 0,
        collectedIds: [],
        sparkle: 0
    };

    let pickups = [];
    let trail = [];
    let particles = [];
    let confetti = [];
    let fireflies = [];
    let lastTime = 0;

    function makePickups() {
        pickups = pickupDefs.map((item, index) => ({...item, collected: false, bob: index * 0.8}));
    }

    function makeFireflies() {
        fireflies = Array.from({length: 16}, (_, i) => ({
            x: 80 + (i * 52) % 860,
            y: 60 + (i * 37) % 520,
            radius: 2 + (i % 3),
            speed: 0.35 + (i % 5) * 0.08,
            phase: i * 0.6
        }));
    }

    function setStatus(text) {
        statusText.textContent = text;
        mobileStatusText.textContent = text;
    }

    function formatTime(sec) {
        const total = Math.floor(sec);
        return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    }

    function updateHud() {
        livesStat.textContent = "❤".repeat(state.lives) || "0";
        timerStat.textContent = formatTime(state.elapsed);
    }

    function showOverlay(eyebrow, title, message, meta, buttonText) {
        overlay.hidden = false;
        overlayEyebrow.textContent = eyebrow;
        overlayTitle.textContent = title;
        overlayMessage.textContent = message;
        overlayMeta.textContent = meta;
        primaryAction.textContent = buttonText;
    }

    function renderProgress() {
        const html = pickupOrder.map((item) => {
            const done = state.collectedIds.includes(item.id);
            return `<div class="progress-item${done ? " done" : ""}"><div class="progress-icon">${item.emoji}</div><div class="progress-copy"><strong>${item.name}</strong><span>${done ? "Уже идет за Сережей" : item.subtitle}</span></div></div>`;
        }).join("");
        progressList.innerHTML = html;
        mobileProgressList.innerHTML = html;
    }

    function resetGame() {
        state.mode = "intro";
        state.elapsed = 0;
        state.lives = state.maxLives;
        state.hits = 0;
        state.checkpointIndex = 0;
        state.collectedIds = [];
        state.sparkle = 0;
        trail = [];
        particles = [];
        confetti = [];
        mobileSheet.hidden = true;
        checkpoints.forEach((point, index) => {
            point.unlocked = index === 0;
        });
        makePickups();
        makeFireflies();
        moveToCheckpoint();
        renderProgress();
        updateHud();
        setStatus("Нажми \"Начать путь\". Собираем змеек");
        showOverlay("Ура я сделал мини игру", "Серж уже ждет", "Собери трех змей для Дарьи, чтобы покорить её сердечко. Тут есть чекпоинты на всякий случай", "Стрелки или WASD для движения. От Авокадо уклоняемся!", "Серж (Амур), Дарья - Психея");
    }

    function startRun() {
        state.mode = "playing";
        overlay.hidden = true;
        mobileSheet.hidden = true;
        setStatus("Ты чудо 🐁🐁🐁");
    }

    function moveToCheckpoint() {
        const point = checkpoints[state.checkpointIndex];
        player.x = point.x;
        player.y = point.y;
        player.vx = 0;
        player.vy = 0;
        player.invuln = 1.2;
        trail = [];
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function rect(x, y, w, h) {
        return {x, y, w, h};
    }

    function intersects(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function circleHits(circle, target) {
        const cx = clamp(circle.x, target.x, target.x + target.w);
        const cy = clamp(circle.y, target.y, target.y + target.h);
        const dx = circle.x - cx;
        const dy = circle.y - cy;
        return dx * dx + dy * dy <= circle.r * circle.r;
    }

    function roundedRectPath(x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    function playerRect(nextX = player.x, nextY = player.y) {
        return rect(nextX, nextY, player.size, player.size);
    }

    function getCamera() {
        const isMobile = window.innerWidth <= 760;
        if (!isMobile) {
            return {scale: 1, offsetX: 0, offsetY: 0};
        }

        const scale = 2.35;
        const viewWidth = world.width / scale;
        const viewHeight = world.height / scale;
        const centerX = player.x + player.size / 2;
        const centerY = player.y + player.size / 2;
        const left = clamp(centerX - viewWidth / 2, 0, world.width - viewWidth);
        const top = clamp(centerY - viewHeight / 2, 0, world.height - viewHeight);

        return {
            scale,
            offsetX: -left,
            offsetY: -top
        };
    }

    function emitBurst(x, y, color, count, speed) {
        for (let i = 0; i < count; i += 1) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
                vy: Math.sin(angle) * speed * (0.6 + Math.random() * 0.8),
                life: 0.8 + Math.random() * 0.5,
                size: 2 + Math.random() * 2,
                color
            });
        }
    }

    function orbiterCircle(hazard) {
        return {
            x: hazard.anchorX + Math.cos(hazard.angle) * hazard.orbit,
            y: hazard.anchorY + Math.sin(hazard.angle) * hazard.orbit,
            r: hazard.radius
        };
    }

    function updateFireflies(dt) {
        for (const fly of fireflies) {
            fly.phase += dt * fly.speed;
            fly.x += Math.cos(fly.phase * 1.2) * dt * 16;
            fly.y += Math.sin(fly.phase) * dt * 14;
            if (fly.x < 32) fly.x = world.width - 32;
            if (fly.x > world.width - 32) fly.x = 32;
            if (fly.y < 32) fly.y = world.height - 32;
            if (fly.y > world.height - 32) fly.y = 32;
        }
    }

    function updateHazards(dt) {
        for (const hazard of hazards) {
            if (hazard.kind === "rect" || hazard.kind === "beam") {
                const axis = hazard.axis;
                const size = axis === "x" ? hazard.w : hazard.h;
                hazard[axis] += hazard.speed * dt;
                if (hazard[axis] < hazard.min || hazard[axis] + size > hazard.max) {
                    hazard.speed *= -1;
                    hazard[axis] = clamp(hazard[axis], hazard.min, hazard.max - size);
                }
            } else {
                hazard.angle += hazard.speed * dt;
            }
        }
    }

    function movePlayer(dt) {
        let moveX = 0;
        let moveY = 0;
        if (keys.left) moveX -= 1;
        if (keys.right) moveX += 1;
        if (keys.up) moveY -= 1;
        if (keys.down) moveY += 1;
        if (moveX || moveY) {
            const len = Math.hypot(moveX, moveY) || 1;
            moveX /= len;
            moveY /= len;
            player.lastDir = {x: moveX, y: moveY};
        }
        player.vx = moveX * player.speed;
        player.vy = moveY * player.speed;
        const nextX = clamp(player.x + player.vx * dt, 18, world.width - player.size - 18);
        if (!blocks.some((block) => intersects(playerRect(nextX, player.y), block))) player.x = nextX;
        const nextY = clamp(player.y + player.vy * dt, 18, world.height - player.size - 18);
        if (!blocks.some((block) => intersects(playerRect(player.x, nextY), block))) player.y = nextY;
        trail.unshift({x: player.x + player.size / 2, y: player.y + player.size / 2});
        trail = trail.slice(0, 220);
    }

    function collectPickups() {
        for (const pickup of pickups) {
            if (pickup.collected || !circleHits({x: pickup.x, y: pickup.y, r: pickup.radius}, playerRect())) continue;
            pickup.collected = true;
            state.collectedIds.push(pickup.id);
            state.checkpointIndex = pickup.checkpoint;
            checkpoints[pickup.checkpoint].unlocked = true;
            state.lives = Math.min(state.maxLives, state.lives + 1);
            emitBurst(pickup.x, pickup.y, pickup.glow, 18, 62);
            renderProgress();
            updateHud();
            const info = pickupOrder.find((item) => item.id === pickup.id);
            setStatus(info?.hint || "Еще одна змея нашлась!");
        }
    }

    function hitHazard() {
        if (player.invuln > 0 || state.mode !== "playing") return;
        for (const hazard of hazards) {
            const collision = hazard.kind === "orbiter"
                ? circleHits(orbiterCircle(hazard), playerRect())
                : intersects(playerRect(), rect(hazard.x, hazard.y, hazard.w, hazard.h));
            if (!collision) continue;
            state.hits += 1;
            state.lives -= 1;
            player.invuln = 1.4;
            emitBurst(player.x + player.size / 2, player.y + player.size / 2, "#ff8e9b", 14, 58);
            if (state.lives > 0) {
                moveToCheckpoint();
                setStatus(`Серега слопал авокадо... Осталось любви к Дарье: ${state.lives}. Вернул тебя на чекпоинт`);
            } else {
                state.mode = "retry";
                state.lives = state.maxLives;
                showOverlay("Го заново", "Авокадо победили. Серж стал веганом", "Продолжишь с последнего чекпоинта и полным запасом сердечек", `До этого момента ты собрала змей: ${state.collectedIds.length}/3. Время в пути: ${formatTime(state.elapsed)}.`, "Продолжить");
            }
            updateHud();
            return;
        }
    }

    function tryFinish() {
        if (state.mode !== "playing" || !intersects(playerRect(), goal)) return;
        if (state.collectedIds.length < pickupOrder.length) {
            setStatus("Дарья уже совсем рядом, но без всех змей подходить пока рано, до свадьбы ни-ни!🐁");
            return;
        }
        state.mode = "won";
        confetti = Array.from({length: 90}, (_, i) => ({
            x: world.width / 2 + ((i % 10) - 5) * 16,
            y: 150 + Math.random() * 24,
            vx: -100 + Math.random() * 200,
            vy: -40 - Math.random() * 110,
            life: 1.9 + Math.random() * 0.8,
            color: ["#ffd166", "#ff9c63", "#87d6c6", "#f6a6ff"][i % 4]
        }));
        setStatus("Победа! А вот и пару промокодов для рулетки: \"счастье\" и \"глубина\".");
        showOverlay("Финиш", "Дарья дождалась", "Ты довела Сережу... (до свидания), собрала всех змей и не дала авокадо испортить вечер ураа!", `Время: ${formatTime(state.elapsed)}. Столкновений: ${state.hits}. Змей: ${state.collectedIds.length}.`, "Сыграть еще");
    }

    function updateParticles(dt) {
        particles = particles.filter((particle) => particle.life > 0);
        for (const particle of particles) {
            particle.life -= dt;
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
        }
    }

    function updateConfetti(dt) {
        confetti = confetti.filter((piece) => piece.life > 0);
        for (const piece of confetti) {
            piece.life -= dt;
            piece.x += piece.vx * dt;
            piece.y += piece.vy * dt;
            piece.vy += 220 * dt;
        }
    }

    function update(dt) {
        updateFireflies(dt);
        updateParticles(dt);
        updateConfetti(dt);
        if (state.mode !== "playing") return;
        state.elapsed += dt;
        state.sparkle += dt;
        if (player.invuln > 0) player.invuln -= dt;
        updateHazards(dt);
        movePlayer(dt);
        collectPickups();
        hitHazard();
        tryFinish();
        updateHud();
    }

    function drawBackground() {
        const sky = ctx.createLinearGradient(0, 0, 0, world.height);
        sky.addColorStop(0, "#243a5a");
        sky.addColorStop(1, "#13253f");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, world.width, world.height);
        ctx.fillStyle = "rgba(255,214,143,0.05)";
        ctx.fillRect(56, 42, 848, 556);
        ctx.strokeStyle = "rgba(255,221,162,0.2)";
        ctx.lineWidth = 42;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(84, 566);
        ctx.lineTo(166, 566);
        ctx.lineTo(166, 232);
        ctx.lineTo(470, 232);
        ctx.lineTo(470, 390);
        ctx.lineTo(790, 390);
        ctx.lineTo(790, 118);
        ctx.lineTo(862, 118);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,247,240,0.08)";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 10]);
        ctx.beginPath();
        ctx.moveTo(84, 566);
        ctx.lineTo(166, 566);
        ctx.lineTo(166, 232);
        ctx.lineTo(470, 232);
        ctx.lineTo(470, 390);
        ctx.lineTo(790, 390);
        ctx.lineTo(790, 118);
        ctx.lineTo(862, 118);
        ctx.stroke();
        ctx.setLineDash([]);
        for (const shrub of shrubs) {
            ctx.fillStyle = "rgba(63,114,91,0.32)";
            ctx.beginPath();
            ctx.arc(shrub.x, shrub.y, shrub.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(83,153,122,0.18)";
            ctx.beginPath();
            ctx.arc(shrub.x + 8, shrub.y - 6, shrub.r * 0.54, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawFireflies() {
        for (const fly of fireflies) {
            const alpha = 0.42 + Math.sin(fly.phase * 2) * 0.22;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "#ffd166";
            ctx.beginPath();
            ctx.arc(fly.x, fly.y, fly.radius * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#fff0a8";
            ctx.beginPath();
            ctx.arc(fly.x, fly.y, fly.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawBlocks() {
        for (const block of blocks) {
            ctx.fillStyle = block.color;
            roundedRectPath(block.x, block.y, block.w, block.h, 22);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.fillRect(block.x + 16, block.y + 16, block.w - 32, 8);
            ctx.strokeStyle = "rgba(255,255,255,0.04)";
            ctx.strokeRect(block.x + 20, block.y + 30, block.w - 40, block.h - 50);
        }
    }

    function drawCheckpoints() {
        checkpoints.forEach((point, index) => {
            if (!point.unlocked) return;
            const active = index === state.checkpointIndex;
            ctx.fillStyle = active ? "rgba(255,209,102,0.24)" : "rgba(255,209,102,0.12)";
            ctx.beginPath();
            ctx.arc(point.x, point.y, active ? 34 : 26, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = active ? "#ffd166" : "#d9b86e";
            ctx.fillRect(point.x - 2, point.y - 22, 4, 30);
            ctx.beginPath();
            ctx.arc(point.x, point.y - 26, 9, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawPickups() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const pickup of pickups) {
            if (pickup.collected) continue;
            const bob = Math.sin(state.sparkle * 3 + pickup.bob) * 6;
            ctx.globalAlpha = 0.22;
            ctx.fillStyle = pickup.glow;
            ctx.beginPath();
            ctx.arc(pickup.x, pickup.y + bob, pickup.radius + 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = pickup.tint;
            ctx.beginPath();
            ctx.arc(pickup.x, pickup.y + bob, pickup.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = emojiFont;
            ctx.fillText("🐍", pickup.x, pickup.y + bob + 1);
            ctx.font = "700 12px 'IBM Plex Sans',sans-serif";
            ctx.fillStyle = "rgba(255,247,240,0.9)";
            ctx.fillText("змея", pickup.x, pickup.y + bob + 28);
        }
    }

    function drawHazards() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const hazard of hazards) {
            if (hazard.kind === "rect" || hazard.kind === "beam") {
                ctx.fillStyle = hazard.kind === "beam" ? "rgba(153,202,94,0.28)" : "rgba(145,199,90,0.24)";
                roundedRectPath(hazard.x - 10, hazard.y - 10, hazard.w + 20, hazard.h + 20, 20);
                ctx.fill();
                ctx.fillStyle = hazard.tone;
                roundedRectPath(hazard.x, hazard.y, hazard.w, hazard.h, 18);
                ctx.fill();
                ctx.fillStyle = "rgba(39,63,23,0.9)";
                ctx.font = emojiFontSmall;
                ctx.fillText("🥑", hazard.x + hazard.w / 2, hazard.y + hazard.h / 2 + 1);
            } else {
                const orb = orbiterCircle(hazard);
                ctx.globalAlpha = 0.22;
                ctx.fillStyle = hazard.tone;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r + 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.fillStyle = hazard.tone;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#254019";
                ctx.font = emojiFontSmall;
                ctx.fillText("🥑", orb.x, orb.y + 1);
            }
        }
        ctx.globalAlpha = 1;
    }

    function drawGoal() {
        ctx.fillStyle = "rgba(135,214,198,0.16)";
        ctx.beginPath();
        ctx.arc(goal.x + goal.w / 2, goal.y + goal.h / 2 + 4, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#87d6c6";
        ctx.beginPath();
        ctx.arc(goal.x + 27, goal.y + 20, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(goal.x + 14, goal.y + 38, 28, 34);
        ctx.font = emojiFontSmall;
        ctx.textAlign = "center";
        ctx.fillText("👑", goal.x + 27, goal.y - 2);
        ctx.fillStyle = "#ffd7d2";
        ctx.beginPath();
        ctx.arc(goal.x + 22, goal.y + 18, 3, 0, Math.PI * 2);
        ctx.arc(goal.x + 32, goal.y + 18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText("💚", goal.x + 27, goal.y + 89);
        ctx.font = labelFont;
        ctx.fillStyle = "#fff7f0";
        ctx.fillText("Дарья", goal.x + 27, goal.y + 108);
    }

    function drawSnakeTail() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = emojiFont;
        pickupOrder.filter((item) => state.collectedIds.includes(item.id)).forEach((item, index) => {
            const point = trail[Math.min(trail.length - 1, 18 + index * 18)];
            if (!point) return;
            const bob = Math.sin(state.sparkle * 4 + index) * 3;
            ctx.globalAlpha = 0.22;
            ctx.fillStyle = "#ffd166";
            ctx.beginPath();
            ctx.arc(point.x, point.y + bob, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillText(item.emoji, point.x, point.y + bob);
        });
    }

    function drawPlayer() {
        if (player.invuln > 0 && Math.floor(player.invuln * 12) % 2 === 0) return;
        ctx.fillStyle = "#ff9c63";
        ctx.beginPath();
        ctx.arc(player.x + 14, player.y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(player.x + 5, player.y + 16, 18, 18);
        ctx.strokeStyle = "#ffe1cb";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(player.x + 9, player.y + 34);
        ctx.lineTo(player.x + 5, player.y + 44);
        ctx.moveTo(player.x + 19, player.y + 34);
        ctx.lineTo(player.x + 23, player.y + 44);
        ctx.moveTo(player.x + 6, player.y + 22);
        ctx.lineTo(player.x - 2, player.y + 28);
        ctx.moveTo(player.x + 22, player.y + 22);
        ctx.lineTo(player.x + 30, player.y + 28);
        ctx.stroke();
        if (selfieImage.complete && selfieImage.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(player.x + 14, player.y + 8, 10, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(selfieImage, player.x + 3, player.y - 4, 22, 22);
            ctx.restore();
        } else {
            ctx.font = emojiFontSmall;
            ctx.textAlign = "center";
            ctx.fillText("🙂", player.x + 14, player.y + 8);
        }
    }

    function drawParticles() {
        for (const particle of particles) {
            ctx.globalAlpha = Math.max(0, particle.life);
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawConfetti() {
        for (const piece of confetti) {
            ctx.globalAlpha = Math.max(piece.life / 2.4, 0);
            ctx.fillStyle = piece.color;
            ctx.fillRect(piece.x, piece.y, 8, 12);
        }
        ctx.globalAlpha = 1;
    }

    function drawHint() {
        ctx.fillStyle = "rgba(9,16,28,0.42)";
        roundedRectPath(24, 18, 300, 42, 18);
        ctx.fill();
        ctx.fillStyle = "#fff7f0";
        ctx.font = "600 15px 'IBM Plex Sans',sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        let text = "Ищи первую змею у оранжереи";
        if (state.collectedIds.length === 1) text = "Фонарь обновлен. Теперь держи курс к центру";
        if (state.collectedIds.length === 2) text = "Осталась последняя змея и финиш у Дарьи";
        if (state.collectedIds.length === 3) text = "Все змеи собраны. Поднимайся к Дарье";
        ctx.fillText(text, 42, 40);
    }

    function draw() {
        ctx.clearRect(0, 0, world.width, world.height);
        const camera = getCamera();
        ctx.save();
        ctx.scale(camera.scale, camera.scale);
        ctx.translate(camera.offsetX, camera.offsetY);
        drawBackground();
        drawFireflies();
        drawBlocks();
        drawCheckpoints();
        drawPickups();
        drawHazards();
        drawGoal();
        drawSnakeTail();
        drawPlayer();
        drawParticles();
        drawConfetti();
        ctx.restore();
        drawHint();
    }

    function frame(timestamp) {
        const dt = Math.min((timestamp - lastTime) / 1000 || 0, 0.032);
        lastTime = timestamp;
        update(dt);
        draw();
        requestAnimationFrame(frame);
    }

    function keyChange(event, value) {
        const key = event.key.toLowerCase();
        if (["arrowup", "w", "ц"].includes(key)) keys.up = value;
        if (["arrowdown", "s", "ы"].includes(key)) keys.down = value;
        if (["arrowleft", "a", "ф"].includes(key)) keys.left = value;
        if (["arrowright", "d", "в"].includes(key)) keys.right = value;
    }

    document.addEventListener("keydown", (event) => keyChange(event, true));
    document.addEventListener("keyup", (event) => keyChange(event, false));
    window.addEventListener("blur", () => {
        keys.up = false;
        keys.down = false;
        keys.left = false;
        keys.right = false;
    });

    controlButtons.forEach((button) => {
        const dir = button.dataset.dir;
        const down = (event) => {
            event.preventDefault();
            keys[dir] = true;
        };
        const up = (event) => {
            event.preventDefault();
            keys[dir] = false;
        };
        button.addEventListener("pointerdown", down);
        button.addEventListener("pointerup", up);
        button.addEventListener("pointerleave", up);
        button.addEventListener("pointercancel", up);
    });

    mobileSheetButton.addEventListener("click", () => {
        mobileSheet.hidden = false;
    });

    mobileSheetClose.addEventListener("click", () => {
        mobileSheet.hidden = true;
    });

    mobileSheet.addEventListener("click", (event) => {
        if (event.target === mobileSheet) {
            mobileSheet.hidden = true;
        }
    });

    primaryAction.addEventListener("click", () => {
        if (state.mode === "intro") {
            startRun();
            return;
        }
        if (state.mode === "retry") {
            moveToCheckpoint();
            state.mode = "playing";
            overlay.hidden = true;
            setStatus("Продолжаем. Фонарь уже зажжен, можно снова штурмовать маршрут.");
            updateHud();
            return;
        }
        if (state.mode === "won") {
            resetGame();
            startRun();
        }
    });

    resetGame();
    draw();
    requestAnimationFrame((timestamp) => {
        lastTime = timestamp;
        requestAnimationFrame(frame);
    });
})();
