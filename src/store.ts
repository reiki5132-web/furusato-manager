import type { AppData, Donation, UserId, UserProfile } from './types';

const STORAGE_KEY = 'furusato-manager-data';

const defaultData: AppData = {
  users: {
    rino: { id: 'rino', name: 'りの', limitAmount: 0 },
    haha: { id: 'haha', name: '母', limitAmount: 0 },
  },
  donations: [],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    // users が空なら default を採用
    if (!parsed.users || Object.keys(parsed.users).length === 0) {
      return { ...defaultData, ...parsed, users: defaultData.users };
    }
    return { ...defaultData, ...parsed };
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addDonation(data: AppData, donation: Omit<Donation, 'id'>): AppData {
  const newDonation: Donation = { ...donation, id: crypto.randomUUID() };
  return { ...data, donations: [...data.donations, newDonation] };
}

export function updateDonation(data: AppData, updated: Donation): AppData {
  return {
    ...data,
    donations: data.donations.map(d => d.id === updated.id ? updated : d),
  };
}

export function deleteDonation(data: AppData, id: string): AppData {
  return { ...data, donations: data.donations.filter(d => d.id !== id) };
}

export function updateUserProfile(data: AppData, profile: UserProfile): AppData {
  return { ...data, users: { ...data.users, [profile.id]: profile } };
}

export function addUser(data: AppData, name: string): AppData {
  const id = crypto.randomUUID();
  return {
    ...data,
    users: { ...data.users, [id]: { id, name, limitAmount: 0 } },
  };
}

export function deleteUser(data: AppData, userId: UserId): AppData {
  const nextUsers = { ...data.users };
  delete nextUsers[userId];
  return {
    ...data,
    users: nextUsers,
    donations: data.donations.filter(d => d.userId !== userId),
  };
}

export function getUserList(data: AppData): UserProfile[] {
  return Object.values(data.users);
}

export function getDonationsByUser(data: AppData, userId: UserId, year: number): Donation[] {
  return data.donations.filter(d => d.userId === userId && d.year === year);
}

export function getTotalDonated(data: AppData, userId: UserId, year: number): number {
  return getDonationsByUser(data, userId, year).reduce((sum, d) => sum + d.amount, 0);
}
