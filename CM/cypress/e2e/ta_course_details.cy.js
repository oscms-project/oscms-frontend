describe('助教课程详情页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载助教课程详情页', () => {
    cy.visit(`${baseUrl}/ta-course-details`);
    ///cy.contains('课程');
  });
});
