import { SbadminNg2Page } from './app.po';

describe('sbadmin-ng2 App', function() {
  let page: SbadminNg2Page;

  beforeEach(() => {
    page = new SbadminNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('QUEST');
  });
});
