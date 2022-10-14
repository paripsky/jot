import { getSearchParam } from './getSearchParam';

describe('getSearchParam', () => {
  it('should be able to get a search param', () => {
    expect(getSearchParam('myParam', '?myParam=5')).toEqual('5');
  });
});
