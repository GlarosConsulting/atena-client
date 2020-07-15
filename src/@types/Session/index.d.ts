export default interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  group: Group;
}

export interface Group {
  id: string;
  name: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  uf: string;
  ibge: string;
}

export type Role = 'ADMIN' | 'MANAGER' | 'MODERATOR' | 'NORMAL';
