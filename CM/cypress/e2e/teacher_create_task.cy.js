describe('教师创建任务页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';
  it('应能正常加载教师创建任务页', () => {
    cy.visit(`${baseUrl}/teacher-create-task`);
    ///cy.contains('创建任务');
  });
});
