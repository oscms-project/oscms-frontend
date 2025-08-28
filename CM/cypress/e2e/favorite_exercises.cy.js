describe('收藏练习页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载收藏练习页', () => {
    cy.visit(`${baseUrl}/favorite-exercises`);
    //cy.contains('收藏');
  });
});
