document.addEventListener("DOMContentLoaded", () => {

    /* ================= ENVELOPE ================= */
    const envelope = document.getElementById("envelope");
    const openBtn = document.getElementById("openBtn");
    const slider = document.getElementById("slider");
    const music = document.getElementById("bgMusic");

    if (openBtn) {
        openBtn.addEventListener("click", () => {
            envelope.classList.add("open");
            setTimeout(() => {
                envelope.style.display = "none";
                slider.classList.remove("hidden");
                music?.play();
            }, 1500);
        });
    }

    /* ================= MUSIC ================= */
    const musicBtn = document.getElementById("musicBtn");
    let isPlaying = true;

    musicBtn?.addEventListener("click", () => {
        if (!music) return;
        isPlaying ? music.pause() : music.play();
        musicBtn.textContent = isPlaying ? "🔇" : "🔊";
        isPlaying = !isPlaying;
    });

    /* ================= SLIDER ================= */
    const slides = document.querySelectorAll(".slide");
    let slideIndex = 0;

    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    function updateSlideButtons() {
        if (prevBtn) prevBtn.style.opacity = slideIndex === 0 ? 0.3 : 1;
        if (nextBtn) nextBtn.style.opacity = slideIndex === slides.length - 1 ? 0.3 : 1;
    }

    function showSlide(i) {
        slides[slideIndex]?.classList.remove("active");

        if (i < 0) slideIndex = 0;
        else if (i >= slides.length) slideIndex = slides.length - 1;
        else slideIndex = i;

        slides[slideIndex]?.classList.add("active");
        updateSlideButtons();
    }

    nextBtn?.addEventListener("click", () => showSlide(slideIndex + 1));
    prevBtn?.addEventListener("click", () => showSlide(slideIndex - 1));

    updateSlideButtons();

    /* ================= SHARE ================= */
    const shareBtn = document.getElementById("shareBtn");
    shareBtn?.addEventListener("click", () => {
        navigator.share?.({
            title: "Thiệp cưới Anh Tuấn & Mai Anh",
            url: location.href
        });
    });

    /* ================= CANVAS ENGINE ================= */
    const canvas = document.getElementById("flowerCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* ===== STAR FIELD ===== */
    const stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.5
    }));

    function drawStars() {
        stars.forEach(s => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${s.z})`;
            ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
            ctx.fill();

            s.x -= 0.1 * s.z;
            if (s.x < 0) {
                s.x = canvas.width;
                s.y = Math.random() * canvas.height;
            }
        });
    }

    /* ===== METEOR ===== */
    let meteors = [];

    function createMeteor() {
        const z = Math.random() * 0.7 + 0.3;
        meteors.push({
            x: canvas.width + 200,
            y: Math.random() * canvas.height * 0.6,
            len: (200 + Math.random() * 200) * z,
            speed: (8 + Math.random() * 6) * z,
            angle: Math.PI * 0.85,
            z,
            alpha: 1
        });
    }

    function drawMeteor(m, hue) {
        const dx = Math.cos(m.angle) * m.len;
        const dy = Math.sin(m.angle) * m.len;

        const grad = ctx.createLinearGradient(m.x, m.y, m.x - dx, m.y - dy);
        grad.addColorStop(0, `hsla(${hue},100%,85%,${m.alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5 * m.z;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - dx, m.y - dy);
        ctx.stroke();
    }

    function drawHeart(x, y, size, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size, size);
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.bezierCurveTo(-15, -25, -40, -5, 0, 25);
        ctx.bezierCurveTo(40, -5, 15, -25, 0, -10);
        ctx.fillStyle = `rgba(255,120,160,${alpha})`;
        ctx.fill();
        ctx.restore();
    }

    /* ===== FLOWERS ===== */
    const flowers = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 2,
        s: Math.random() * 1 + 0.5
    }));

    /* ===== MUSIC SYNC ===== */
    let hue = 0;
    if (music) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = audioCtx.createMediaElementSource(music);
        const analyser = audioCtx.createAnalyser();
        src.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        const data = new Uint8Array(analyser.frequencyBinCount);

        setInterval(() => {
            analyser.getByteFrequencyData(data);
            hue = data[5] * 2;
        }, 120);
    }

    /* ===== MAIN LOOP ===== */
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawStars();

        meteors.forEach((m, i) => {
            drawMeteor(m, hue);
            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            m.z -= 0.002;
            m.alpha = m.z;

            if (m.alpha <= 0.15) drawHeart(m.x, m.y, m.z * 0.6, m.alpha * 2);
            if (m.alpha <= 0) meteors.splice(i, 1);
        });

        if (Math.random() < 0.04) createMeteor();

        flowers.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,150,180,.7)";
            ctx.fill();
            f.y += f.s;
            if (f.y > canvas.height) f.y = 0;
        });

        requestAnimationFrame(animate);
    }

    animate();

    /* ================= COUNTDOWN ================= */
    const weddingDate = new Date("2026-02-26T16:00:00").getTime();
    setInterval(() => {
        const d = weddingDate - Date.now();
        if (d <= 0) return;

        document.getElementById("days").innerText = Math.floor(d / 86400000);
        document.getElementById("hours").innerText = Math.floor(d % 86400000 / 3600000);
        document.getElementById("minutes").innerText = Math.floor(d % 3600000 / 60000);
        document.getElementById("seconds").innerText = Math.floor(d % 60000 / 1000);
    }, 1000);
    /* ================= WISH FORM ================= */
    const form = document.getElementById("wishForm");
    const list = document.getElementById("wishList");

    let wishes = JSON.parse(localStorage.getItem("wishes"));
    if (!Array.isArray(wishes)) {
         wishes = [];
    }

    /* ===== ADMIN MODE ===== */
    const ADMIN_PASSWORD = "ANHYEUEM"; // 🔐 đổi mật khẩu tại đây
    let isAdmin = localStorage.getItem("admin") === "true";
    /*THOÁT ADMIN*/
    const logoutBtn = document.getElementById("logoutAdmin");

if (isAdmin && logoutBtn) {
  logoutBtn.style.display = "block";
}

logoutBtn?.addEventListener("click", () => {
  if (!isAdmin) return;

  if (!confirm("Bạn muốn thoát chế độ ADMIN?")) return;

  localStorage.removeItem("admin");
  alert("🚪 Đã thoát ADMIN");
  location.reload();
});
   /* ===== CTRL + CLICK VÀO TIÊU ĐỀ ===== */
document.getElementById("adminTrigger").addEventListener("click", e => {
  if (!e.ctrlKey) return;

  const pass = prompt("🔐 Nhập mật khẩu admin:");
  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("admin", "true");
    alert("👑 Đã vào chế độ ADMIN");
    location.reload();
  } else {
    alert("❌ Sai mật khẩu");
  }
});
 /* ===== RENDER ===== */
  function renderWishes() {
  list.innerHTML = "";

  wishes.slice().reverse().forEach(w => {
    const div = document.createElement("div");
    div.className = "wish";

    div.dataset.id = String(w.id);   // ✅ SỬA Ở ĐÂY
    div.dataset.time = w.time;

    const canEdit = isAdmin || (Date.now() - w.time <= 2 * 60 * 1000);
    div.innerHTML = `
      <strong class="wish-name">${w.name}</strong>

     <p class="wish-text">${w.msg}</p>

    ${w.edited ? `
        <div class="wish-edited-container">
            <div class="wish-edited ${w.editedBy}">
             ${w.editedBy === "admin" ? "👑 Admin" : "✏️đã chỉnh sửa"}
            · ${new Date(w.editedAt).toLocaleString("vi-VN")}
            </div>
         </div>
        ` : ""}

      <div class="wish-actions">
        ${canEdit ? `<button class="edit-btn">Sửa</button>` : ""}
        <button class="save-btn" style="display:none">Lưu</button>
        <button class="cancel-btn" style="display:none">Huỷ</button>

        ${isAdmin ? `<button class="delete-btn">🗑 Xoá</button>` : ""}
      </div>
    `;

    list.appendChild(div);
        });
    }
        renderWishes();
        setInterval(renderWishes, 60000); // mỗi 30s check lại
 /* ===== GỬI LỜI CHÚC ===== */
    form.addEventListener("submit", e => {
        e.preventDefault();

        const name = form.name.value.trim();
        const msg = form.message.value.trim();

        if (name.length < 2 || msg.length < 5){
        alert("💌chúc dài lên nào bạn yêu 😘 !")
        return;}

        const newWish = {
            id: Date.now(),
            time: Date.now(),
            name,
             msg,
             edited: false,
             editedBy: null,
            editedAt: null
    };
        if (!wishes.find(w => w.id === newWish.id)) {
        wishes.push(newWish);
        localStorage.setItem("wishes", JSON.stringify(wishes));
        }
        form.reset();
        renderWishes();
    });

    /* ===== SỬA / LƯU / HUỶ ===== */
    list.addEventListener("click", e => {
        const wishDiv = e.target.closest(".wish");
        if (!wishDiv) return;

        const id = Number(wishDiv.dataset.id);
        const time = Number(wishDiv.dataset.time);

        const textEl = wishDiv.querySelector(".wish-text");
        const editBtn = wishDiv.querySelector(".edit-btn");
        const saveBtn = wishDiv.querySelector(".save-btn");
        const cancelBtn = wishDiv.querySelector(".cancel-btn");

        /* SỬA */
        if (e.target.classList.contains("edit-btn")) {

            if (!isAdmin && Date.now() - time > 2 * 60 * 1000) {
            alert("Lời chúc của bạn đã được gửi ✉... ");
             return;
             }
             if (wishDiv.querySelector(".wish-edit")) return;

            const textarea = document.createElement("textarea");
            textarea.className = "wish-edit";
            textarea.value = textEl.textContent;

            wishDiv.insertBefore(textarea, textEl);
            textEl.style.display = "none";

            editBtn.style.display = "none";
            saveBtn.style.display = "inline";
            cancelBtn.style.display = "inline";
              return;
        }

        /* LƯU */
         if (e.target.classList.contains("save-btn")) {
         const textarea = wishDiv.querySelector(".wish-edit");
         if (!textarea) return;

        const newText = textarea.value.trim();
        if (!newText) return;

        const index = wishes.findIndex(w => w.id === id);
         if (index === -1) {
         alert("❌ Không tìm thấy lời chúc");
         return;
         }

        wishes[index].msg = newText;
        wishes[index].edited = true;
        wishes[index].editedAt = Date.now();
        wishes[index].editedBy = isAdmin ? "admin" : "owner"; // ⭐ PHÂN BIỆT AI SỬA

  localStorage.setItem("wishes", JSON.stringify(wishes));

  renderWishes(); // 🔥 render lại là đủ
}

        /* HUỶ */
        if (e.target.classList.contains("cancel-btn")) {
            wishDiv.querySelector(".wish-edit").remove();
            textEl.style.display = "block";

            editBtn.style.display = "inline";
            saveBtn.style.display = "none";
            cancelBtn.style.display = "none";
        }
        /* ===== XOÁ (CHỈ ADMIN) ===== */
if (e.target.classList.contains("delete-btn")) {
  if (!isAdmin) return;

  if (!confirm("Bạn chắc chắn muốn xoá lời chúc này?")) return;

  wishes = wishes.filter(w => w.id !== id);
  localStorage.setItem("wishes", JSON.stringify(wishes));
  renderWishes();
  return; // ⛔ THÊM ĐÚNG NGAY DÒNG NÀY
}
    });
});