describe('错题重做页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载错题重做页', () => {
    cy.visit(`${baseUrl}/incorrect-questions-retry`);
    //cy.contains('错题');
  });
});
