export type ProjectId = 'FARMER' | 'ENTERPRISE' | 'YOUTH';

export type FieldMeta = { name: string; label: string };

export interface ProjectDictionary {
  projectId: ProjectId;
  sheetName: string;
  fields: FieldMeta[];
}

export type SubmissionStatus = 'approved' | 'flagged' | 'pending';

export interface Submission {
  id: string;
  project: ProjectId;
  submissionDate: string;
  startTime: string;
  endTime: string;
  caseId: string;
  enumerator: string;
  durationMinutes: number;
  status: SubmissionStatus;
  // farmer-specific
  db5Age?: number;
  db6AgeCategory?: string;
  db7Gender?: string;
  d10Gender?: string;
  db10District?: string;
  db11Region?: string;
  db14Village?: string;
  // enterprise-specific
  b2MaleOwnerAge?: number;
  b3FemaleOwnerAge?: number;
  a10RespondentGender?: string;
  b1OwnerGender?: string;
  b14District?: string;
  validationStatus?: string;
  // youth-specific
  d4Sex?: string;
  d9LocationType?: string;
  d8Latitude?: number;
  d8Longitude?: number;
  engagementType?: string;
}
