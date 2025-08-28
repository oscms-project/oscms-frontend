describe('登录页面集成测试', () => {
  const baseUrl = 'http://localhost:5173';

  it('应能正常加载登录页', () => {
    cy.visit(`${baseUrl}/`);
    //cy.contains('账号登录');
  });

  it('登录正向用例', () => {
    cy.visit(`${baseUrl}/`);
   cy.get('input[placeholder="请输入学工号"]').type('testuser');
cy.get('input[placeholder="请输入密码"]').type('123456');
   cy.get('button.login-button').click();
   //cy.url().should('include', '/student-home');
    // cy.contains('欢迎'); // 登录成功后页面
  });

  it('登录反向用例', () => {
    cy.visit(`${baseUrl}/`);
    cy.get('input[placeholder="请输入学工号"]').type('wronguser');
    cy.get('input[placeholder="请输入密码"]').type('wrongpass');
    cy.get('button.login-button').click();
    //cy.contains('登录失败');
  });
});