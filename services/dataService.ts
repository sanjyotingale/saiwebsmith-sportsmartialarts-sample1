import { Announcement, GalleryEvent, Instructor, Branch, AdmissionFormData } from '../types';

const STORAGE_KEYS = {
  ANNOUNCEMENTS: 'sf_announcements',
  GALLERY: 'sf_gallery',
  INSTRUCTORS: 'sf_instructors'
};

const getLocal = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const INITIAL_ANNOUNCEMENTS: Announcement[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `ann-${i + 1}`,
  title: `Sample Announcement ${i + 1}`,
  description: `This is sample announcement ${i + 1} for demonstration. It contains placeholder text to simulate a real-world update for the academy portal.`,
  date: `2025-01-${10 + i}`,
  showOnHome: i < 3,
  attachmentUrl: [1, 3, 4].includes(i) ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : undefined,
  attachmentType: [1, 3, 4].includes(i) ? 'pdf' : undefined
}));

const INITIAL_INSTRUCTORS: Instructor[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `ins-${i + 1}`,
  name: `Instructor ${i + 1}`,
  designation: i === 0 ? 'Founder / Head Master' : 'Senior Instructor',
  photo: `https://images.unsplash.com/photo-${[
    '1552072092-7f9b8d63efcb',
    '1599566150163-29194dcaad36',
    '1555597673-b21d5c935865',
    '1509059852496-f3822ae057bf',
    '1544005313-94ddf0286df2',
    '1500648767791-00dcc994a43e'
  ][i]}?auto=format&fit=crop&q=80&w=400`,
  achievements: [`Champion Title ${i + 1}`, `Black Belt 5th Dan`],
  journey: `Sample instructor bio describing experience, achievements, and teaching style. This instructor has dedicated over ${10 + i} years to the mastery of martial arts and physical discipline.`
}));

const photoIds = [
  '1552072092-7f9b8d63efcb', '1599566150163-29194dcaad36', '1555597673-b21d5c935865',
  '1509059852496-f3822ae057bf', '1544005313-94ddf0286df2', '1500648767791-00dcc994a43e',
  '1594911772125-07fc7a2d8d9f', '1583275484600-34152e61a81d', '1517836357463-d25dfeac3438',
  '1534438327276-14e5300c3a48', '1519704943960-da9750f76449', '1552072877-244bb0471550',
  '1544367567-0f2fcb009e0b', '1526506118085-60ce8714f8c5', '1518611012818-696af81a9c73',
  '1571019613454-1cb2f99b2d8b', '1517838276537-c225197195b9', '1533107862482-0e6974b06ec4',
  '1524594152303-9fd13543fe6e', '1495001258031-d1b407bc1776', '1541534741688-6078c64b5cd9',
  '1554068865-24bccd4e3d77', '1591117207239-7ad392038ff3', '1574680096145-d05b474e2155',
  '1517130038641-a774d04afb3c'
];

const videoSources = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/horse.mp4',
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://v-cdn.paimon.moe/video/01.mp4'
];

const INITIAL_GALLERY: GalleryEvent[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `event-${i + 1}`,
  name: `Academy Event ${i + 1}`,
  date: `2024-${12 - i}-15`,
  description: `A comprehensive display of martial discipline and technical excellence. This event featured intense sparring, kata demonstrations, and foundational drills performed by students and instructors alike.`,
  folderId: `folder-${i + 1}`,
  images: Array.from({ length: 28 }).map((__, j) => 
    `https://images.unsplash.com/photo-${photoIds[(j + i) % photoIds.length]}?auto=format&fit=crop&q=80&w=1200`
  ),
  videos: Array.from({ length: 5 }).map((__, j) => videoSources[j % videoSources.length]),
  showOnHome: i < 3,
  isPinned: i === 0
}));

const INITIAL_BRANCHES: Branch[] = Array.from({ length: 7 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `Branch Location ${i + 1}`,
  address: `Academy Street Block ${i + 1}, Maharashtra, India`,
  contactNumber: `+91 93713 01228`,
  image: `https://images.unsplash.com/photo-${photoIds[i % photoIds.length]}?auto=format&fit=crop&q=80&w=800`,
  googleMapsLink: '#'
}));

export const fetchAnnouncements = async (): Promise<Announcement[]> => getLocal(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
export const fetchGalleryEvents = async (): Promise<GalleryEvent[]> => getLocal(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
export const fetchInstructors = async (): Promise<Instructor[]> => getLocal(STORAGE_KEYS.INSTRUCTORS, INITIAL_INSTRUCTORS);
export const fetchBranches = async (): Promise<Branch[]> => INITIAL_BRANCHES;

export const submitAdmissionForm = async (formData: any): Promise<boolean> => {
  console.log('Form Submitted with Data:', formData);
  return new Promise(resolve => setTimeout(() => resolve(true), 2500));
};