window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    const content = document.getElementById('header');
  
    // Tampilkan loader saat halaman dimuat
    loader.style.display = 'block';
  
    // Sembunyikan loader setelah 1 detik dan tampilkan konten halaman
    setTimeout(function() {
      loader.style.display = 'none';
      content.style.display = 'block';
    }, 1000);
  });
  