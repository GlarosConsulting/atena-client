export default interface Agreement {
  id: string;
  agreementId: string;
  name: string;
  start: Date;
  end: Date;
  program: string;
  proposalData: ProposalData;
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
