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
  programs: {
    programId: number;
    name: string;
    value: number;
  }[];
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
