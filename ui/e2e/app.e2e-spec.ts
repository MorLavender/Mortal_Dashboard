import { MortalPage } from './app.po';

describe('mortal App', () => {
  let page: MortalPage;

  beforeEach(() => {
    page = new MortalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
