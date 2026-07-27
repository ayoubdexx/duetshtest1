import {
  LayoutDashboard,
  Target,
  GraduationCap,
  BookOpen,
  BookA,
  Newspaper,
  Headphones,
  Mic,
  PenLine,
  AudioLines,
  BookText,
  Repeat,
  Layers,
  Dumbbell,
  StickyNote,
  Bookmark,
  ClipboardCheck,
  Award,
  Medal,
  Briefcase,
  FileText,
  Download,
  CalendarDays,
  TrendingUp,
  Trophy,
  Users,
  MessagesSquare,
  LifeBuoy,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Daily Lesson", href: "/daily", icon: Target },
      { title: "Courses", href: "/courses", icon: GraduationCap },
    ],
  },
  {
    label: "Skills",
    items: [
      { title: "Grammar", href: "/grammar", icon: BookOpen },
      { title: "Vocabulary", href: "/vocabulary", icon: BookA },
      { title: "Reading", href: "/reading", icon: Newspaper },
      { title: "Listening", href: "/listening", icon: Headphones },
      { title: "Speaking", href: "/speaking", icon: Mic },
      { title: "Writing", href: "/writing", icon: PenLine },
      { title: "Pronunciation", href: "/pronunciation", icon: AudioLines },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "Dictionary", href: "/dictionary", icon: BookText },
      { title: "Verb Conjugation", href: "/verbs", icon: Repeat },
      { title: "Flashcards", href: "/flashcards", icon: Layers },
      { title: "Exercises", href: "/exercises", icon: Dumbbell },
      { title: "Notes", href: "/notes", icon: StickyNote },
      { title: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    ],
  },
  {
    label: "Exam Prep",
    items: [
      { title: "Mock Exams", href: "/exams", icon: ClipboardCheck },
      { title: "Goethe", href: "/goethe", icon: Award },
      { title: "TELC", href: "/telc", icon: Medal },
      { title: "Ausbildung", href: "/ausbildung", icon: Briefcase },
    ],
  },
  {
    label: "Library",
    items: [
      { title: "PDF Library", href: "/library", icon: FileText },
      { title: "Downloads", href: "/downloads", icon: Download },
    ],
  },
  {
    label: "Plan & Progress",
    items: [
      { title: "Study Planner", href: "/planner", icon: CalendarDays },
      { title: "Statistics", href: "/statistics", icon: TrendingUp },
      { title: "Achievements", href: "/achievements", icon: Trophy },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Study Groups", href: "/community", icon: Users },
      { title: "Discussion", href: "/discussion", icon: MessagesSquare },
    ],
  },
  {
    label: "Support",
    items: [
      { title: "Help Center", href: "/help", icon: LifeBuoy },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const ADMIN_GROUP: NavGroup = {
  label: "Manage",
  items: [{ title: "Admin Panel", href: "/admin", icon: ShieldCheck }],
};

/** Flat list of static pages for the command palette quick navigation */
export const QUICK_NAV: NavItem[] = [...NAV_GROUPS.flatMap((g) => g.items)];
