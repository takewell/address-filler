describe('html', () => {
  beforeAll(async () => {
    const fpath = `file://${process.cwd()}/src/index.html`
    await page.goto(fpath);
  });

  it('Place Searches', async () => {
    await expect(page.title()).resolves.toMatch('Place Searches');
  });
});
