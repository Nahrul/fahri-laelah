  // Set tanggal pernikahan
  const weddingDate = new Date('2025-06-18T00:00:00');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // copy
function copyRekening(btn) {
  const rekening = btn.parentElement.querySelector('.rekening-number').textContent.trim();
  navigator.clipboard.writeText(rekening);
  btn.querySelector('img').style.opacity = '1';
  setTimeout(() => btn.querySelector('img').style.opacity = '0.7', 800);
  alert('Nomor rekening telah disalin: ' + rekening);
}

async function add() {
	const nama = document.getElementById('name');
  const hadir = document.querySelector('input[name="attendance"]:checked').value;
	const nama1 = nama.value; // Mendapatkan nilai dari input
	const pesan = document.getElementById('message');
	const pesan1 = pesan.value;
	try {
		const data = {
            nama: nama1,
            wish: pesan1,
            hadir: hadir
        };
        const dataStr = encodeURIComponent(JSON.stringify(data));
        const url = `https://script.google.com/macros/s/AKfycbxc2LFR6TrIubY5CC-F5Yfhi8PkF5XHmwv5gLi6BBWCiSD1gblpNp97BkQ-xhgfld6D/exec?action=add&table=fahriwish&data=${dataStr}`;

        const response = await fetch(url, {
            method: 'GET',
        });
        console.log(response);
        alert("pesan anda sudah terkirim!");
        nama.value = "";
        pesan.value = "";

        // Refresh data guestbook setelah submit
        fetchData();
    } catch (error) {
        console.log('Terjadi kesalahan:', error);
    }
}
// menjalankan fungsi fetch data ketika halaman di refresh

document.addEventListener('DOMContentLoaded', () => {
	fetchData();
});
// Fungsi untuk menampilkan data ke dalam elemen
function displayGuestbook(data) {
    const guestbookContainer = document.getElementById('guestbook-list');
    if (!guestbookContainer) return;

    let html = '';
    data.forEach(item => {
        // Tentukan class dan label badge kehadiran
        let attendClass = '';
        let attendLabel = '';
        if (item.hadir === 'Attend' || item.hadir === 'Yes') {
            attendClass = 'attend-yes';
            attendLabel = 'Attend';
        } else if (item.hadir === 'Maybe') {
            attendClass = 'attend-maybe';
            attendLabel = 'Maybe';
        } else if (item.hadir === 'No') {
            attendClass = 'attend-no';
            attendLabel = 'No';
        } else {
            attendClass = '';
            attendLabel = item.hadir || '';
        }

        html += `
            <div class="guestbook-item">
                <div class="guestbook-header">
                    <span class="guestbook-name">${item.nama || ''}</span>
                    <span class="guestbook-attend ${attendClass}">${attendLabel}</span>
                </div>
                <div class="guestbook-message">${item.wish || ''}</div>
            </div>
        `;
    });
    guestbookContainer.innerHTML = html;
}
// ambil data semua wish
async function fetchData() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxc2LFR6TrIubY5CC-F5Yfhi8PkF5XHmwv5gLi6BBWCiSD1gblpNp97BkQ-xhgfld6D/exec?table=fahriwish&action=getAll');
        const data = await response.json();
        console.log(data);
        if (data && Array.isArray(data)) { // Memastikan bahwa data adalah array sebelum menjalankan forEach
            displayGuestbook(data);
        } else {
            console.log('Data yang diterima bukan array atau undefined');
        }
    } catch (error) {
        console.log('Terjadi kesalahan:', error);
    }
}
// --- Opening Overlay Logic ---
document.addEventListener('DOMContentLoaded', function () {
  // Ambil nama tamu dari parameter URL
  function getGuestName() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (!to) return "Guest";
    // Format nama: ganti - atau %20 dengan spasi, kapitalisasi awal kata
    return decodeURIComponent(to)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // Set nama tamu di overlay
  const guestNameSpan = document.getElementById('guest-name');
  if (guestNameSpan) guestNameSpan.textContent = getGuestName();

  // Musik
  const music = document.getElementById('wedding-music');
  const musicBtn = document.getElementById('music-control-btn');
  const musicIcon = document.getElementById('music-icon');
  let isPlaying = false;

  function playMusic() {
    music.play();
    isPlaying = true;
    musicBtn.classList.remove('music-off');
    musicBtn.classList.add('music-on');
    musicIcon.src = './img/music.svg';
  }
  function pauseMusic() {
    music.pause();
    isPlaying = false;
    musicBtn.classList.remove('music-on');
    musicBtn.classList.add('music-off');
    musicIcon.src = './img/music.svg';
  }

  // Kontrol tombol musik
  if (musicBtn) {
    musicBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // Buka undangan
  const openBtn = document.getElementById('open-invitation-btn');
  const overlay = document.getElementById('opening-overlay');
  if (openBtn && overlay) {
    openBtn.addEventListener('click', function () {
      overlay.style.opacity = 0;
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
      playMusic();
    });
  }

  // Optional: Cegah scroll saat overlay tampil
  if (overlay) {
    document.body.style.overflow = 'hidden';
    openBtn.addEventListener('click', function () {
      document.body.style.overflow = '';
    });
  }
});