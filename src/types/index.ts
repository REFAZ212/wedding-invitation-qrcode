export interface Person {
  fullName: string;
  nickname: string;
  parents: string;
  instagram?: string;
  photo: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  story: string;
  photo: string;
}

export interface EventSchedule {
  id: string;
  name: string;
  date: string; // ISO date
  timeStart: string;
  timeEnd: string;
  location: string;
  address: string;
  mapsUrl: string;
  dressCode?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  span?: "tall" | "wide" | "normal";
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logo: string;
}

export interface QrisAccount {
  id: string;
  label: string;
  image: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  attendance: "attending" | "not_attending" | "pending";
  createdAt: string;
}

export interface RSVPFormValues {
  name: string;
  phone: string;
  guests: number;
  attendance: "attending" | "not_attending";
  message: string;
}

export interface WeddingConfig {
  meta: {
    siteTitle: string;
    hashtag: string;
    instagramUrl: string;
    ogImage: string;
  };
  bride: Person;
  groom: Person;
  cover: {
    backgroundImage: string;
    greeting: string;
    coupleImage: string;
  };
  quote: {
    text: string;
    source: string;
  };
  weddingDateISO: string;
  music: {
    src: string;
    title: string;
  };
  timeline: TimelineItem[];
  events: EventSchedule[];
  gallery: GalleryImage[];
  video?: {
    youtubeId: string;
    title: string;
  };
  bankAccounts: BankAccount[];
  qris: QrisAccount[];
  envelope: {
    recipientName: string;
    address: string;
  };
  notes: string[];
}
