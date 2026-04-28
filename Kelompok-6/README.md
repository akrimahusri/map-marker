# Map Marker - Kelompok 6

Anggota:

- Adinda Muarriva (2308107010001)
- Akrimah Usri (2308107010009)
- Dian Nazira (2308107010011)

## Ringkasan

Project ini adalah aplikasi peta sederhana berbasis JavaScript untuk menambah, melihat, dan menghapus marker di peta.

Marker tidak disimpan ke backend. Data koordinat dikelola manual lewat file `data/markers.json`.

Setiap marker memiliki kategori `wisata`, `kuliner`, `sejarah`, atau `ibadah` sehingga bisa difilter dari UI.

## Cara Menjalankan

1. Jalankan lewat local server, misalnya VS Code Live Server.
2. Buka file `data/markers.json` untuk menambah atau mengubah koordinat marker.
3. Refresh halaman setelah file JSON diubah.
4. Gunakan tombol kategori di atas peta untuk memfilter marker.

## Struktur

- `index.html` - tampilan utama aplikasi
- `style.css` - styling aplikasi
- `js/app.js` - logika peta dan marker
- `data/markers.json` - data marker yang diisi manual