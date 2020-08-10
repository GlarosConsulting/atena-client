export default interface Agreement {
  id: string;
  agreementId: string;
  name: string;
  start: Date;
  end: Date;
  program: string;
  proposalData: ProposalData;
  convenientExecution: ConvenientExecution;
  accountability: Accountability;
}

export interface ProposalData {
  data: {
    modality: string;
    contractingStatus: string;
    proposalId: string;
    organId: string;
    proccessId: string;
    proponent: string;
    legalFoundation: string;
    organ: string;
    linkedOrgan: string;
    description: string;
    justification: string;
    targetAudience: string;
    problem: string;
    result: string;
    proposalAndObjectivesRelation: string;
    categories: string;
    object: string;
    information: string;
    proposalDate: Date;
    biddingDate: Date;
    homologationDate: Date;
    status: {
      value: string;
      committed: string;
      publication: string;
    };
  };
  programs: Program[];
}

export interface Program {
  programId: number;
  name: string;
  value: number;
  details: {
    cps: string;
    items: string;
    couterpartRule: string;
    totalValue: number;
    couterpartValues: {
      total: number;
      financial: number;
      assetsAndServices: number;
    } | null;
    transferValues: {
      total: number;
      amendment: string;
    } | null;
  };
}

export interface ConvenientExecution {
  executionProcesses: ExecutionProcess[];
  contracts: Contract[];
}

export interface ExecutionProcess {
  executionId: string;
  type: string;
  date: Date;
  processId: string;
  status: string;
  systemStatus: string;
  system: string;
  accepted: string;
  details: {
    executionProcess: string;
    buyType: string;
    status: string;
    origin: string;
    financialResource: string;
    modality: string;
    biddingType: string;
    processId: string;
    biddingId: string;
    object: string;
    legalFoundation: string;
    justification: string;
    publishDate: Date;
    beginDate: Date;
    endDate: Date;
    biddingValue: number;
    homologationDate: Date;
    city: string;
    analysisDate: Date;
    accepted: string;
  };
}

interface Contract {
  id: string;
  convenientExecutionId: string;
  contractId: string;
  biddingId: string;
  date: Date;
  details: {
    id: string;
    contractId: string;
    hiredDocument: string;
    hirerDocument: string;
    type: string;
    object: string;
    totalValue: number;
    publishDate: Date;
    beginDate: Date;
    endDate: Date;
    signDate: Date;
    executionProcessId: string;
    biddingModality: string;
    processId: string;
  };
}

export interface Accountability {
  data: {
    organ: string;
    convenient: string;
    documentNumber: string;
    modality: string;
    status: string;
    number: string;
    validity: string;
    limitDate: Date;
    totalValue: number;
    transferValue: number;
    counterpartValue: number;
    yieldValue: number;
  };
}
