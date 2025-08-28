describe('教师个人信息页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载教师个人信息页', () => {
    cy.visit(`${baseUrl}/teacherprofile`);
    ///cy.contains('个人信息');
  });
});
