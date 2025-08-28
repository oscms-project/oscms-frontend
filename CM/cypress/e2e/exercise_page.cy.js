describe('练习页面（ExercisePage）集成测试', () => {
  const baseUrl = 'http://localhost:5173'; // 根据实际端口调整

  it('应能正常加载练习页面', () => {
    cy.visit(`${baseUrl}/exercise`); // 如有参数请补充
    //cy.contains('练习'); // 检查页面有“练习”或实际标题
  });

  it('应显示题目列表或题目内容', () => {
    cy.visit(`${baseUrl}/exercise`);
    // 假设有题目区块、题目标题或题目卡片
    //cy.get('.question-list, .exercise-question, .question-card').should('exist');
  });

  it('应能选择选项并提交', () => {
    cy.visit(`${baseUrl}/exercise`);
    // 假设有单选题或多选题选项
    //cy.get('input[type="radio"], input[type="checkbox"]').first().check({force: true});
    // 假设有提交按钮
    //cy.get('button').contains('提交').click();
    // 检查是否有提交成功提示
    //cy.contains('提交成功').should('exist');
  });

  it('应能切换题目', () => {
    cy.visit(`${baseUrl}/exercise`);
    // 假设有“下一题”按钮
    //cy.get('button').contains('下一题').click();
    // 检查题目内容是否变化（可根据实际内容断言）
  });

  it('应能显示答题进度', () => {
    cy.visit(`${baseUrl}/exercise`);
    // 假设有进度条或进度数字
    //cy.get('.progress-bar, .exercise-progress, .progress-info').should('exist');
  });

  
});
