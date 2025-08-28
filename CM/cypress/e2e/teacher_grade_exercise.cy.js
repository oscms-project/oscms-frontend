describe('教师批改练习页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载教师批改练习页', () => {
    cy.visit(`${baseUrl}/teacher-grade-exercise`);
    ///cy.contains('批改');
  });
});
