import type { WeddingConfig } from "@/types";

/**
 * ============================================================
 *  PUSAT KONFIGURASI UNDANGAN
 *  Semua konten yang tampil di website diambil dari file ini.
 *  Ganti data di bawah untuk mempersonalisasi undangan tanpa
 *  perlu menyentuh kode komponen sama sekali.
 * ============================================================
 */
export const weddingConfig: WeddingConfig = {
  meta: {
    siteTitle: "Aisha & Bagas — Undangan Pernikahan",
    hashtag: "#AisyahBagasBersatu",
    instagramUrl: "https://instagram.com/explore/tags/aisyahbagasbersatu",
    ogImage: "/og-cover.jpg",
  },

  bride: {
    fullName: "Aisha Putri Ramadhani",
    nickname: "Aisha",
    parents: "Putri pertama dari Bapak Handoko & Ibu Ratna",
    instagram: "@aisha.ramadhani",
    photo: "/images/bride.jpg",
  },

  groom: {
    fullName: "Bagas Adi Nugraha",
    nickname: "Bagas",
    parents: "Putra kedua dari Bapak Sutrisno & Ibu Wulandari",
    instagram: "@bagas.nugraha",
    photo: "/images/groom.jpg",
  },

  cover: {
    backgroundImage: "/images/cover-bg.jpg",
    coupleImage: "/images/cover-couple.jpg",
    greeting: "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.",
  },

  quote: {
    text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum: 21",
  },

  weddingDateISO: "2026-11-14T08:00:00+07:00",

  music: {
    src: "/audio/wedding-song.mp3",
    title: "A Thousand Years — Christina Perri (Cover)",
  },

  timeline: [
    {
      id: "meet",
      date: "Maret 2019",
      title: "Pertama Bertemu",
      story: "Dipertemukan pada sebuah acara kampus, obrolan singkat itu ternyata menjadi awal dari kisah panjang kami.",
      photo: "/images/timeline-1.jpg",
    },
    {
      id: "relationship",
      date: "Agustus 2019",
      title: "Menjalin Hubungan",
      story: "Setelah beberapa bulan saling mengenal lebih dekat, kami memutuskan untuk melangkah bersama.",
      photo: "/images/timeline-2.jpg",
    },
    {
      id: "engagement",
      date: "Februari 2025",
      title: "Hari Pertunangan",
      story: "Dengan restu kedua keluarga, janji itu resmi kami ikat dalam sebuah lamaran sederhana penuh haru.",
      photo: "/images/timeline-3.jpg",
    },
    {
      id: "wedding",
      date: "14 November 2026",
      title: "Hari Pernikahan",
      story: "Hari yang telah lama dinanti akhirnya tiba — awal babak baru kehidupan kami berdua.",
      photo: "/images/timeline-4.jpg",
    },
  ],

  events: [
    {
      id: "akad",
      name: "Akad Nikah",
      date: "2026-11-14",
      timeStart: "08:00",
      timeEnd: "10:00",
      location: "Masjid Al-Ikhlas",
      address: "Jl. Merpati No. 12, Bandung, Jawa Barat",
      mapsUrl: "https://maps.google.com/?q=Masjid+Al+Ikhlas+Bandung",
      dressCode: "Putih & Gold",
    },
    {
      id: "resepsi",
      name: "Resepsi Pernikahan",
      date: "2026-11-14",
      timeStart: "11:00",
      timeEnd: "14:00",
      location: "Gedung Serbaguna Graha Kencana",
      address: "Jl. Anggrek Raya No. 88, Bandung, Jawa Barat",
      mapsUrl: "https://maps.google.com/?q=Graha+Kencana+Bandung",
      dressCode: "Sage Green & Ivory",
    },
  ],

  gallery: [
    { id: "g1", src: "/images/gallery-1.jpg", alt: "Sesi pemotretan pre-wedding di taman", span: "tall" },
    { id: "g2", src: "/images/gallery-2.jpg", alt: "Aisha dan Bagas berjalan bersama", span: "normal" },
    { id: "g3", src: "/images/gallery-3.jpg", alt: "Momen candid pasangan", span: "wide" },
    { id: "g4", src: "/images/gallery-4.jpg", alt: "Potret berdua saat senja", span: "normal" },
    { id: "g5", src: "/images/gallery-5.jpg", alt: "Detail cincin pertunangan", span: "normal" },
    { id: "g6", src: "/images/gallery-6.jpg", alt: "Aisha tersenyum", span: "tall" },
    { id: "g7", src: "/images/gallery-7.jpg", alt: "Bagas dan Aisha tertawa bersama", span: "normal" },
    { id: "g8", src: "/images/gallery-8.jpg", alt: "Pemandangan lokasi pemotretan", span: "wide" },
  ],

  video: {
    youtubeId: "dQw4w9WgXcQ",
    title: "Pre-Wedding Cinematic — Aisha & Bagas",
  },

  bankAccounts: [
    {
      id: "bca",
      bankName: "Bank BCA",
      accountNumber: "1234567890",
      accountHolder: "Aisha Putri Ramadhani",
      logo: "/images/bank-bca.svg",
    },
    {
      id: "mandiri",
      bankName: "Bank Mandiri",
      accountNumber: "0987654321",
      accountHolder: "Bagas Adi Nugraha",
      logo: "/images/bank-mandiri.svg",
    },
  ],

  qris: [
    { id: "qris-groom", label: "QRIS — Bagas", image: "/images/qris-groom.png" },
    { id: "qris-bride", label: "QRIS — Aisha", image: "/images/qris-bride.png" },
  ],

  envelope: {
    recipientName: "Aisha & Bagas",
    address: "Jl. Kenanga No. 5, Kel. Sukamaju, Kec. Cibeunying, Bandung, Jawa Barat 40123",
  },

  notes: [
    "Dimohon untuk hadir tepat waktu sesuai jadwal yang tertera.",
    "Bagi tamu diharapkan menjaga kesehatan dan kenyamanan bersama selama acara berlangsung.",
    "Area parkir tersedia di halaman gedung, dibantu oleh petugas kami.",
    "Mohon maaf, undangan ini berlaku untuk 2 orang dan anak-anak (tanpa mengurangi rasa hormat).",
    "Dress code disarankan namun tidak wajib — kenyamanan Anda adalah prioritas kami.",
  ],
};

export const contactPersons = [
  { name: "Rina (Keluarga Mempelai Wanita)", phone: "+62 812-3456-7890" },
  { name: "Dimas (Keluarga Mempelai Pria)", phone: "+62 813-9876-5432" },
];
