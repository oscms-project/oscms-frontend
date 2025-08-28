describe('练习报告页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载练习报告页', () => {
    cy.visit(`${baseUrl}/exercise-report`);
    //cy.contains('报告');
  });
});
