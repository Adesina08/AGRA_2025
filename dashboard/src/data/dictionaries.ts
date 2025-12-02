import { ProjectDictionary } from '../types';

export const farmerDictionary: ProjectDictionary = {
  projectId: 'FARMER',
  sheetName: 'AGRA FARMER',
  fields: [
    { name: 'db5', label: 'DB5. Age' },
    { name: 'db6', label: 'DB6. Age Category' },
    { name: 'db7', label: 'DB7. Gender' },
    { name: 'd10', label: 'D10. What is your gender?' },
    { name: 'db10', label: 'DB10. District' },
    { name: 'db11', label: 'DB11. Region/Province' },
    { name: 'db14', label: 'DB14. Village' },
    { name: 'SubmissionDate', label: 'Submission Date' },
    { name: 'duration', label: 'Duration' },
    { name: 'username', label: 'Enumerator' },
  ],
};

export const enterpriseDictionary: ProjectDictionary = {
  projectId: 'ENTERPRISE',
  sheetName: 'AGRA ENTERPRISE',
  fields: [
    { name: 'B2_Q', label: 'B2. Male owner age' },
    { name: 'B3_Q', label: 'B3. Female owner age' },
    { name: 'A10_Q', label: 'A10. Gender of respondent' },
    { name: 'B1_Q', label: 'B1. Gender of owner(s)' },
    { name: 'B14_Q', label: 'B14. Business district' },
    { name: 'SubmissionDate', label: 'Submission Date' },
    { name: 'duration', label: 'Duration' },
    { name: 'username', label: 'Enumerator' },
  ],
};

export const youthDictionary: ProjectDictionary = {
  projectId: 'YOUTH',
  sheetName: 'AGRA YOUTH',
  fields: [
    { name: 'D4', label: 'D4. Sex of respondent' },
    { name: 'D8_Latitude', label: 'D8-Latitude' },
    { name: 'D8_Longitude', label: 'D8-Longitude' },
    { name: 'D8_Accuracy', label: 'D8-Accuracy' },
    { name: 'D9', label: 'D9. Location type' },
    { name: 'RS2', label: 'RS2. Youth engagement type' },
    { name: 'SubmissionDate', label: 'Submission Date' },
    { name: 'duration', label: 'Duration' },
    { name: 'username', label: 'Enumerator' },
  ],
};

export const dictionaries: ProjectDictionary[] = [farmerDictionary, enterpriseDictionary, youthDictionary];
