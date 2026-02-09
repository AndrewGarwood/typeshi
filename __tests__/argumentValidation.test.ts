jest.mock('../src/config', () => ({}));
jest.mock('../src/config/setupLog', () => ({}));
jest.mock('../src/utils/regex', () => ({}));
jest.mock('../src/utils/typeValidation', () => ({
    isNullLike: jest.fn((value: any) => value === null || value === undefined),
    isNonEmptyString: jest.fn((value: any) => typeof value === 'string' && value.length > 0),
    isNonEmptyArray: jest.fn((value: any) => value && Array.isArray(value) && value.length > 0),
    isObject: jest.fn((value: any) => typeof value === 'object' && value !== null),
    isFunction: jest.fn((value: any) => typeof value === 'function'),
}));
jest.mock('open', () => () => Promise.resolve());
