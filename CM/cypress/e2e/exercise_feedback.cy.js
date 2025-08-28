describe('练习反馈页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载练习反馈页', () => {
    cy.visit(`${baseUrl}/exercise-feedback`);
    //cy.contains('反馈');
  });
});
