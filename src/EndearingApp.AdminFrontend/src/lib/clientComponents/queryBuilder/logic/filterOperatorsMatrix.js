/** @type {{ [key: string]: string[] }} */
export const FILTER_OPERATORS = {
  'Unlimited Text': ['eq', 'ne', 'contains', 'startswith', 'endswith', 'in'],
  'Limited Text': ['eq', 'ne', 'contains', 'startswith', 'endswith', 'in'],
  'Whole Number': ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'in'],
  'Whole Number (Small)': ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'in'],
  'Whole Number (Big)': ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'in'],
  'Decimal Number': ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'in'],
  'Date and Time': ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
  'Date': ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
  'Time': ['eq', 'ne', 'lt', 'le', 'gt', 'ge'],
  'Yes/No': ['eq', 'ne'],
  'Binary Data': [],
  'Unique Identifier': ['eq', 'ne', 'in'],
  'Option Set': ['eq', 'ne', 'in'],
  'Option Set MultiSelect': ['any_eq', 'any_in', 'all_in', 'allonly'],
};

/** @type {{ [key: string]: string }} */
export const OPERATOR_LABELS = {
  eq: 'Equals',
  ne: 'Not Equals',
  lt: 'Less Than',
  le: 'Less or Equal',
  gt: 'Greater Than',
  ge: 'Greater or Equal',
  contains: 'Contains',
  startswith: 'Starts With',
  endswith: 'Ends With',
  in: 'In',
  any_eq: 'Contains',
  any_in: 'Contains Any Of',
  all_in: 'Contains All',
  allonly: 'Contains Only',
};
