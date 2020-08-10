export default interface Statistics {
  total: StatisticsItem;
  execution: StatisticsItem;
  transfer: StatisticsItem;
  transferInExecution: StatisticsItem;
  completedBiddings: StatisticsItem;
  completedContracts: StatisticsItem;
  topTenOrgans: TopTenOrganItem[];
  counterpart: CounterpartItem;
  trimesters: Trimesters;
}

export interface StatisticsItem {
  count: number;
  value: number;
}

export interface TopTenOrganItem {
  name: string;
  count: number;
  percentage: number;
}

export interface CounterpartItem {
  financial: number;
  assetsAndServices: number;
  empty: number;
}

interface Trimesters {
  0: number;
  1: number;
  2: number;
  3: number;
}
