const photoEl = document.getElementById("latestPhoto");
const emptyState = document.getElementById("emptyState");
const downloadLink = document.getElementById("downloadLink");
const recentGallery = document.getElementById("recentGallery");

function disableDownload() {
  downloadLink.classList.add("is-disabled");
  downloadLink.setAttribute("aria-disabled", "true");
  downloadLink.setAttribute("tabindex", "-1");
}

function showEmptyState() {
  if (photoEl) {
    photoEl.remove();
  }
  emptyState.hidden = false;
  disableDownload();
}

let latestPhoto = "";
let recentPhotos = [];

try {
  latestPhoto = localStorage.getItem("latestPhoto") || "";
  const raw = localStorage.getItem("latestPhotos");
  recentPhotos = raw ? JSON.parse(raw) : [];
} catch (error) {
  latestPhoto = "";
  recentPhotos = [];
}

if (!latestPhoto) {
  showEmptyState();
} else {
  photoEl.src = latestPhoto;
  downloadLink.href = latestPhoto;
}

if (recentGallery && Array.isArray(recentPhotos)) {
  recentGallery.innerHTML = "";
  recentPhotos.slice(0, 10).forEach((dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.alt = "Ảnh gần nhất";
    recentGallery.append(img);
  });
}
