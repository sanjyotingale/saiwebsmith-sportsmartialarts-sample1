
export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
  showOnHome: boolean;
  attachmentUrl?: string;
  attachmentType?: 'pdf' | 'image' | 'link';
}

export interface GalleryEvent {
  id: string;
  name: string;
  date: string;
  description: string;
  folderId: string;
  images: string[];
  videos: string[];
  showOnHome: boolean;
  isPinned: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  designation: string;
  photo: string;
  contactDetails?: string;
  achievements?: string[];
  journey?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  image: string;
  googleMapsLink: string;
}

export interface AdmissionFormData {
  studentFullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  permanentAddress: string;
  pinCode: string;
  aadhaarNumber: string;
  photoFile: File | null;
  aadhaarFile: File | null;
  fatherFirstName: string;
  fatherContact: string;
  fatherEmail: string;
  motherFirstName: string;
  motherContact: string;
  motherEmail: string;
  personalContact: string;
  personalEmail: string;
  spouseName: string;
  spouseContact: string;
  spouseEmail: string;
  guardianFullName: string;
  alternateContact: string;
  medicalConcerns: string;
  previousSportsExp: string;
  previousMartialArtsExp: string;
  nationalParticipation: string;
  meritDetails: string;
  medicalInsurance: string;
  additionalCertificates: File | null;
  declarationChecked: boolean;
  rulesChecked: boolean;
  utrNumber?: string;
}
