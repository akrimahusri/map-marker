# Map Marker - Kelompok 6

Anggota:

- Adinda Muarriva (2308107010001)
- Akrimah Usri (2308107010009)
- Dian Nazira (2308107010011)

## Ringkasan

Project ini adalah aplikasi peta sederhana berbasis JavaScript untuk menampilkan lokasi marker pada peta interaktif.

Data koordinat tidak disimpan ke backend. Semua marker dikelola secara manual melalui file `data/markers.json`.

Setiap marker memiliki kategori `wisata`, `kuliner`, `sejarah`, atau `ibadah`. Kategori ini digunakan untuk filter, legenda, dan warna ikon marker.

## Fitur

- Menampilkan marker dari file JSON lokal.
- Memfilter marker berdasarkan kategori.
- Menampilkan legenda warna untuk setiap kategori.
- Menggunakan ikon marker berbeda sesuai kategori.
- Memudahkan penambahan atau perubahan data marker langsung di `data/markers.json`.

## Cara Menjalankan

1. Jalankan project melalui local server, misalnya VS Code Live Server.
2. Buka file `data/markers.json` untuk menambah atau mengubah koordinat marker.
3. Refresh halaman setelah file JSON diperbarui.
4. Gunakan tombol kategori untuk memfilter marker.
5. Perhatikan legenda warna untuk mengetahui arti tiap kategori.

## Kategori Marker

- `wisata` - tempat wisata, ruang publik, dan area rekreasi.
- `kuliner` - tempat makan dan minuman.
- `sejarah` - lokasi bersejarah atau monumen.
- `ibadah` - tempat ibadah.

## Struktur

- `index.html` - tampilan utama aplikasi
- `style.css` - styling aplikasi
- `js/app.js` - logika peta dan marker
- `data/markers.json` - data marker yang diisi manual