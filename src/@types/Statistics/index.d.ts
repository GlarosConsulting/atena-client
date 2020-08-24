export default interface Statistics {
  total: StatisticsItem;
  execution: StatisticsItem;
  pending: StatisticsItem;
  interrupted: StatisticsItem;
  procedures: StatisticsItem;
  completed: StatisticsItem;
  topTenOrgans: TopTenOrganItem[];
  counterpart: CounterpartItem;
}

export interface StatisticsItem {
  count: number;
  value: number;
}

export interface TopTenOrganItem {
  name: string;
  value: number;
  percentage: number;
}

export interface CounterpartItem {
  financial: number;
  assetsAndServices: number;
  empty: number;
}

export interface PendingAgreement {
  name: string;
  value: number;
  percentage: number;
}
