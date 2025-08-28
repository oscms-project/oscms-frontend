describe('教师首页集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载教师首页', () => {
    cy.visit(`${baseUrl}/teacherhome`);
    ///cy.contains('教师');
  });
});
