/* =========================
   HIỆU ỨNG HIỂN THỊ SLIDE
========================= */
const slides = document.querySelectorAll(".slide");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.3 }
);

slides.forEach(slide => observer.observe(slide));


/* =========================
   NHẠC NỀN + NÚT BẬT TẮT
========================= */
const bgMusic = new Audio("https://www.nhaccuatui.com/song/rjZWdi7eJ6cf"); // đổi tên file nếu cần
bgMusic.loop = true;
bgMusic.volume = 0.5;

let musicStarted = false;

// Tạo nút nhạc
const musicBtn = document.createElement("button");
musicBtn.innerHTML = "🔈";
musicBtn.id = "music-toggle";
document.body.appendChild(musicBtn);

// CSS cho nút (inject nhanh)
Object.assign(musicBtn.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: "999",
  fontSize: "22px",
  padding: "12px",
  borderRadius: "50%",
  border: "none",
  background: "#d4af37",
  color: "#fff",
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
});

// Click bật / tắt
musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.innerHTML = "🔊";
  } else {
    bgMusic.pause();
    musicBtn.innerHTML = "🔈";
  }
});

// Tự phát khi user tương tác lần đầu
document.addEventListener("click", () => {
  if (!musicStarted) {
    bgMusic.play().catch(() => {});
    musicStarted = true;
    musicBtn.innerHTML = "🔊";
  }
}, { once: true });


/* =========================
   HIỆU ỨNG HOA RƠI
========================= */
const flowerContainer = document.createElement("div");
flowerContainer.id = "flower-container";
document.body.appendChild(flowerContainer);

Object.assign(flowerContainer.style, {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: "10"
});

function createFlower() {
  const flower = document.createElement("span");
  flower.innerHTML = "🌸";flower.innerHTML = '💖';

  const size = Math.random() * 20 + 15;
  const left = Math.random() * window.innerWidth;
  const duration = Math.random() * 5 + 5;

  Object.assign(flower.style, {
    position: "absolute",
    top: "-30px",
    left: `${left}px`,
    fontSize: `${size}px`,
    opacity: Math.random(),
    animation: `fall ${duration}s linear`
  });

  flowerContainer.appendChild(flower);

  setTimeout(() => flower.remove(), duration * 1000);
}

// Tạo hoa liên tục
setInterval(createFlower, 500);


/* =========================
   CSS KEYFRAMES (inject)
========================= */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
  }
}
`;
document.head.appendChild(style);
