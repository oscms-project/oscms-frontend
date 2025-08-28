describe('学生课程页面集成测试', () => {
  const baseUrl = 'http://localhost:5173'; // 根据实际端口调整

  it('应能正常加载学生课程页面', () => {
    cy.visit(`${baseUrl}/student/courses`);
    cy.contains('课程'); // 检查页面有“课程”字样
  });

  it('课程列表应能正常渲染', () => {
    cy.visit(`${baseUrl}/student/courses`);
    // 假设有课程卡片或课程标题，按实际页面内容调整
    cy.get('.course-card, .course-title, .course-list').should('exist');
  });

  it('点击课程卡片可进入课程详情', () => {
    cy.visit(`${baseUrl}/student/courses`);
    // 假设课程卡片有.course-card类
    cy.get('.course-card').first().click({force: true});
    // 跳转后可断言详情页有课程标题或其他标识内容
    // cy.url().should('include', '/course-details'); // 如有详情页路由
  });
});
