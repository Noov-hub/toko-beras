import React from 'react';

// Data hardcode untuk promo/event
const promos = [
  {
    id: 1,
    title: 'Promo Merdeka!',
    description: 'Diskon 17% untuk semua jenis beras premium. Berlaku 1-20 Agustus.',
    image: '/images/masak.jpg', // Ganti dengan path gambar Anda
  },
  {
    id: 2,
    title: 'Beli 2 Gratis 1',
    description: 'Setiap pembelian 2 karung beras 5kg, gratis 1kg beras pecah.',
    image: '/images/masak.jpg', // Ganti dengan path gambar Anda
  },
  {
    id: 3,
    title: 'Event Masak Bersama',
    description: 'Ikuti demo masak nasi liwet terenak pada hari Sabtu ini di toko kami!',
    image: '/images/masak.jpg', // Ganti dengan path gambar Anda
  },
];

function HomePage() {
  return (
    
    <main>
      {/* 1. Hero Section dengan Latar Belakang */}
      <section 
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        // Ganti '/images/background-sawah.jpg' dengan path gambar latar Anda
        style={{ backgroundImage: "url('/images/sawah.jpg')" }}
      >
        {/* Overlay untuk membuat teks lebih mudah dibaca */}
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
        
        <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-black text-center drop-shadow-lg bg-white/20 backdrop-blur-sm px-8 py-4 rounded-lg">
          Selamat Datang di Toko Beras Kami!
        </h1>
      </section>

      {/* 2. Section Info Toko */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
            {/* Gambar Fisik Toko */}
            <div className="md:w-1/2">
              <img 
                // Ganti dengan path gambar toko Anda
                src="/images/toko.jpg" 
                alt="Tampilan Fisik Toko Beras" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>

            {/* Alamat dan Deskripsi */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Kunjungi Kami Langsung!</h2>
              <p className="text-lg text-gray-600 mb-2">
                Jl. Padi Sejahtera No. 123, Desa Makmur, 
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Kecamatan Subur, Kabupaten Lumbung, 54321
              </p>
              <p className="text-gray-500">
                Buka Setiap Hari: 08:00 - 20:00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section Event & Promo */}
      <section className="bg-white py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Event & Promo Terbaru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promos.map((promo) => (
              <div 
                key={promo.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img src={promo.image} alt={promo.title} className="w-full h-48 object-cover"/>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{promo.title}</h3>
                  <p className="text-gray-600">{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;