describe('学生首页集成测试', () => {
  const baseUrl = 'http://localhost:5173'; // 根据实际端口调整

  it('应能正常加载学生首页', () => {
    cy.visit(`${baseUrl}/student-home`);
    cy.contains('我的课程资源');
    cy.contains('我的学习进度');
    cy.contains('通知公告');
  });

  it('课程资源区应有加入课程按钮', () => {
    cy.visit(`${baseUrl}/student-home`);
    cy.contains('加入课程').should('exist');
  });

  it('点击加入课程弹窗应出现', () => {
    cy.visit(`${baseUrl}/student-home`);
    cy.contains('加入课程').click();
    cy.contains('请输入课程代码').should('be.visible');
  });

  it('通知公告区应有测试公告', () => {
    cy.visit(`${baseUrl}/student-home`);
    cy.contains('关于2025年春季学期期末考试安排的通知');
    cy.contains('关于举办第十届大学生创新创业大赛的通知');
    cy.contains('2025年暑期社会实践活动报名通知');
  });
});
