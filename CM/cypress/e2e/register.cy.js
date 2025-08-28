describe('注册页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载注册页', () => {
    cy.visit(`${baseUrl}/register`);
    //cy.contains('注册');
  });
});
