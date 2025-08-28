describe('助教首页集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载助教首页', () => {
    cy.visit(`${baseUrl}/ta-home`);
    ///cy.contains('助教');
  });
});
