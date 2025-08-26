Docker 运行后构建镜像：docker build -t course-management-frontend .

运行容器：docker run -d -p 3000:80 --name frontend-test course-management-frontend

检查容器状态：docker ps

测试网站访问：curl http://localhost:3000



# 停止容器
docker stop frontend-test

# 删除容器
docker rm frontend-test

# 删除镜像（可选）
docker rmi course-management-frontend