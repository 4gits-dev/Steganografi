const originalInput = document.getElementById("original-image");
const secretInput = document.getElementById("secret-image");
const embedPreview = document.getElementById("embed-preview");
const embedStego = document.getElementById("embed-stego");
const extractPreview = document.getElementById("extract-preview");
const extractedMessage = document.getElementById("extracted-message");
const downloadStego = document.getElementById("download-stego");
const imageSize = document.getElementById("image-size");
const messageTextarea = document.getElementById("message");

const embedSection = document.getElementById("embed-section");
const extractSection = document.getElementById("extract-section");

function resetEmbedForm() {
  originalInput.value = "";
  messageTextarea.value = "";
  embedPreview.src = "";
  embedStego.src = "";
  downloadStego.style.display = "none";
  imageSize.textContent = "-";
}

function resetExtractForm() {
  secretInput.value = "";
  extractPreview.src = "";
  extractedMessage.innerText = "";
}

function showEmbed() {
  localStorage.setItem("currentMode", "embed");
  
  // Animation when switching to embed mode
  extractSection.style.opacity = "0";
  extractSection.style.transform = "translateX(20px)";
  extractSection.classList.add("hidden");
  
  embedSection.classList.remove("hidden");
  embedSection.style.opacity = "0";
  embedSection.style.transform = "translateX(-20px)";
  
  setTimeout(() => {
    embedSection.style.transition = "all 0.3s ease-out";
    embedSection.style.opacity = "1";
    embedSection.style.transform = "translateX(0)";
  }, 50);
  
  resetExtractForm();
}

function showExtract() {
  localStorage.setItem("currentMode", "extract");
  
  // Animation when switching to extract mode
  embedSection.style.opacity = "0";
  embedSection.style.transform = "translateX(-20px)";
  embedSection.classList.add("hidden");
  
  extractSection.classList.remove("hidden");
  extractSection.style.opacity = "0";
  extractSection.style.transform = "translateX(20px)";
  
  setTimeout(() => {
    extractSection.style.transition = "all 0.3s ease-out";
    extractSection.style.opacity = "1";
    extractSection.style.transform = "translateX(0)";
  }, 50);
  
  resetEmbedForm();
}

window.addEventListener("DOMContentLoaded", () => {
  const currentMode = localStorage.getItem("currentMode") || "embed";
  if (currentMode === "embed") {
    showEmbed();
  } else {
    showExtract();
  }
});

originalInput.addEventListener("change", () => {
  const file = originalInput.files[0];
  if (file) {
    embedPreview.src = URL.createObjectURL(file);
    embedStego.src = "";
    downloadStego.style.display = "none";

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    imageSize.textContent = `${sizeMB} MB`;
  } else {
    imageSize.textContent = "-";
  }
});

secretInput.addEventListener("change", () => {
  const file = secretInput.files[0];
  if (file) {
    extractPreview.src = URL.createObjectURL(file);
    extractedMessage.innerText = "";
  }
});

function embedMessage() {
  const file = originalInput.files[0];
  const message = messageTextarea.value;

  if (!file || !message) {
    Swal.fire({
      title: "Peringatan!",
      text: "Harap upload gambar dan isi pesan terlebih dahulu.",
      icon: "warning",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Mengerti"
    });
    return;
  }

  Swal.fire({
    title: "Memproses...",
    text: "Sedang menyisipkan pesan ke dalam gambar",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  const formData = new FormData();
  formData.append("image", file);
  formData.append("message", message);

  fetch("/embed", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal menyisipkan pesan");
      }
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      embedStego.src = url;
      downloadStego.href = url;
      downloadStego.style.display = "inline-block";
      Swal.fire({
        title: "Berhasil!",
        text: "Pesan berhasil disisipkan ke dalam gambar!",
        icon: "success",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Baik"
      });
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat proses embed.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Mengerti"
      });
    });
}

function extractMessage() {
  const file = secretInput.files[0];

  if (!file) {
    Swal.fire({
      title: "Peringatan!",
      text: "Harap upload gambar terlebih dahulu.",
      icon: "warning",
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Mengerti"
    });
    return;
  }

  Swal.fire({
    title: "Memproses...",
    text: "Sedang mengekstrak pesan dari gambar",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  const formData = new FormData();
  formData.append("image", file);

  fetch("/extract", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Gagal mengekstrak pesan");
      }
      return res.json();
    })
    .then((data) => {
      if (data.message) {
        extractedMessage.innerText = data.message;
        Swal.fire({
          title: "Berhasil!",
          text: "Pesan berhasil diekstrak dari gambar!",
          icon: "success",
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Baik"
        });
      } else {
        extractedMessage.innerText = "";
        Swal.fire({
          title: "Peringatan",
          text: "Tidak ditemukan pesan dalam gambar.",
          icon: "warning",
          confirmButtonColor: "#4f46e5",
          confirmButtonText: "Mengerti"
        });
      }
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengekstrak pesan.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Mengerti"
      });
    });
}