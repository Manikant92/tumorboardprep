import case01 from '@docs/case_01_nsclc.json';
import case02 from '@docs/case_02_breast.json';
import case03 from '@docs/case_03_crc.json';

export const exampleCases = {
  case_01_nsclc: {
    label: 'Case 1: EGFR-mutant NSCLC',
    data: case01
  },
  case_02_breast: {
    label: 'Case 2: HR+/HER2- breast cancer',
    data: case02
  },
  case_03_crc: {
    label: 'Case 3: Stage IV colorectal cancer',
    data: case03
  }
};

// Made with Bob
