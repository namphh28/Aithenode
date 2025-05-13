import { EducatorProfile, Category } from "./types";

export const sampleCategories: Category[] = [
  {
    id: 1,
    name: "Mathematics",
    description: "Mathematics and Statistics",
    educatorCount: 5,
    subjects: [
      { id: 1, categoryId: 1, name: "Calculus" },
      { id: 2, categoryId: 1, name: "Statistics" },
      { id: 3, categoryId: 1, name: "Linear Algebra" }
    ]
  },
  {
    id: 2,
    name: "Programming",
    description: "Computer Science and Programming",
    educatorCount: 4,
    subjects: [
      { id: 4, categoryId: 2, name: "Python" },
      { id: 5, categoryId: 2, name: "JavaScript" },
      { id: 6, categoryId: 2, name: "Java" }
    ]
  },
  {
    id: 3,
    name: "Languages",
    description: "Foreign Languages",
    educatorCount: 3,
    subjects: [
      { id: 7, categoryId: 3, name: "Spanish" },
      { id: 8, categoryId: 3, name: "French" },
      { id: 9, categoryId: 3, name: "Mandarin" }
    ]
  }
];

export const sampleEducators: EducatorProfile[] = [
  {
    id: 1,
    userId: 1,
    title: "Mathematics Expert & Programming Tutor",
    hourlyRate: 75,
    experience: "10+ years teaching experience",
    education: "Ph.D. in Mathematics, Stanford University",
    specialties: ["Mathematics", "Computer Science", "English", "Spanish"],
    availability: {
      Monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Wednesday: ["13:00", "14:00", "15:00", "16:00"],
      Friday: ["09:00", "10:00", "11:00", "14:00", "15:00"]
    },
    user: {
      id: 1,
      username: "mathprof",
      email: "mathprof@example.com",
      firstName: "John",
      lastName: "Smith",
      bio: "Passionate about making mathematics accessible to everyone",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      userType: "educator",
      isVerified: true
    },
    subjects: [
      { id: 1, categoryId: 1, name: "Calculus", category: sampleCategories[0] },
      { id: 2, categoryId: 1, name: "Statistics", category: sampleCategories[0] },
      { id: 4, categoryId: 2, name: "Python", category: sampleCategories[1] }
    ],
    reviewCount: 45,
    averageRating: 4.8
  },
  {
    id: 2,
    userId: 2,
    title: "Full Stack Developer & Programming Instructor",
    hourlyRate: 90,
    experience: "8 years in software development",
    education: "M.S. in Computer Science, MIT",
    specialties: ["Web Development", "JavaScript", "Python", "English", "Korean"],
    availability: {
      Tuesday: ["18:00", "19:00", "20:00"],
      Thursday: ["18:00", "19:00", "20:00"],
      Saturday: ["10:00", "11:00", "12:00", "13:00"]
    },
    user: {
      id: 2,
      username: "techguru",
      email: "techguru@example.com",
      firstName: "Sarah",
      lastName: "Kim",
      bio: "Teaching the next generation of developers",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      userType: "educator",
      isVerified: true
    },
    subjects: [
      { id: 4, categoryId: 2, name: "Python", category: sampleCategories[1] },
      { id: 5, categoryId: 2, name: "JavaScript", category: sampleCategories[1] }
    ],
    reviewCount: 38,
    averageRating: 4.9
  },
  {
    id: 3,
    userId: 3,
    title: "Language Teacher & Cultural Expert",
    hourlyRate: 45,
    experience: "12 years teaching languages",
    education: "B.A. in Linguistics, Paris-Sorbonne University",
    specialties: ["French", "Spanish", "English"],
    availability: {
      Monday: ["14:00", "15:00", "16:00"],
      Wednesday: ["14:00", "15:00", "16:00"],
      Friday: ["14:00", "15:00", "16:00"]
    },
    user: {
      id: 3,
      username: "linguist",
      email: "linguist@example.com",
      firstName: "Marie",
      lastName: "Dubois",
      bio: "Making language learning fun and effective",
      profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
      userType: "educator",
      isVerified: true
    },
    subjects: [
      { id: 7, categoryId: 3, name: "Spanish", category: sampleCategories[2] },
      { id: 8, categoryId: 3, name: "French", category: sampleCategories[2] }
    ],
    reviewCount: 52,
    averageRating: 4.7
  },
  {
    id: 4,
    userId: 4,
    title: "Data Science & Machine Learning Expert",
    hourlyRate: 120,
    experience: "15 years in data science",
    education: "Ph.D. in Computer Science, Berkeley",
    specialties: ["Python", "Statistics", "Machine Learning", "English", "Mandarin"],
    availability: {
      Tuesday: ["08:00", "09:00", "10:00"],
      Thursday: ["08:00", "09:00", "10:00"],
      Saturday: ["15:00", "16:00", "17:00"]
    },
    user: {
      id: 4,
      username: "datascientist",
      email: "datascientist@example.com",
      firstName: "Michael",
      lastName: "Chen",
      bio: "Helping students master data science and AI",
      profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
      userType: "educator",
      isVerified: true
    },
    subjects: [
      { id: 2, categoryId: 1, name: "Statistics", category: sampleCategories[0] },
      { id: 4, categoryId: 2, name: "Python", category: sampleCategories[1] }
    ],
    reviewCount: 29,
    averageRating: 4.9
  },
  {
    id: 5,
    userId: 5,
    title: "Mathematics & Physics Tutor",
    hourlyRate: 60,
    experience: "7 years teaching experience",
    education: "M.S. in Physics, CalTech",
    specialties: ["Mathematics", "Physics", "English", "German"],
    availability: {
      Monday: ["16:00", "17:00", "18:00"],
      Wednesday: ["16:00", "17:00", "18:00"],
      Saturday: ["09:00", "10:00", "11:00", "12:00"]
    },
    user: {
      id: 5,
      username: "physicstutor",
      email: "physicstutor@example.com",
      firstName: "Anna",
      lastName: "Schmidt",
      bio: "Making physics and math understandable for everyone",
      profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
      userType: "educator",
      isVerified: true
    },
    subjects: [
      { id: 1, categoryId: 1, name: "Calculus", category: sampleCategories[0] },
      { id: 3, categoryId: 1, name: "Linear Algebra", category: sampleCategories[0] }
    ],
    reviewCount: 18,
    averageRating: 4.6
  }
]; 