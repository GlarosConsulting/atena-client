export default interface Session {
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  group?: Group;
}

export interface Group {
  id: string;
  name: string;
  access: AccessType;
  cities: City[];
}

export type AccessType = 'ANY' | 'MUNICIPAL_SPHERE' | 'STATE_SPHERE' | 'CITIES';

export interface City {
  id: string;
  name: string;
  uf: string;
  ibge: string;
}
