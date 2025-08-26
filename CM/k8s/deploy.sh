#!/bin/bash

# Kubernetes 部署脚本
# 用于一键部署课程管理系统前端到K8S集群

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 配置变量
NAMESPACE="default"
APP_NAME="course-management-frontend"
IMAGE_NAME="course-management-frontend"
IMAGE_TAG="${1:-latest}"
DOMAIN="${2:-your-domain.com}"

echo "🚀 开始部署课程管理系统前端到Kubernetes"
echo "=============================================="
echo "📋 部署配置："
echo "   - 命名空间: $NAMESPACE"
echo "   - 应用名称: $APP_NAME"
echo "   - 镜像版本: $IMAGE_NAME:$IMAGE_TAG"
echo "   - 域名: $DOMAIN"
echo ""

# 检查kubectl是否可用
if ! command -v kubectl &> /dev/null; then
    log_error "kubectl 未安装或不在PATH中"
    exit 1
fi

# 检查集群连接
log_info "检查Kubernetes集群连接..."
if ! kubectl cluster-info &> /dev/null; then
    log_error "无法连接到Kubernetes集群"
    exit 1
fi
log_success "集群连接正常"

# 创建命名空间（如果不存在）
log_info "检查命名空间..."
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    log_info "创建命名空间: $NAMESPACE"
    kubectl create namespace $NAMESPACE
fi
log_success "命名空间准备完成"

# 更新镜像标签
log_info "更新部署配置中的镜像标签..."
sed -i.bak "s|image: $IMAGE_NAME:.*|image: $IMAGE_NAME:$IMAGE_TAG|g" deployment.yaml
sed -i.bak "s|your-domain.com|$DOMAIN|g" ingress.yaml configmap.yaml

# 应用ConfigMap和Secret
log_info "部署ConfigMap和Secret..."
kubectl apply -f configmap.yaml -n $NAMESPACE
kubectl apply -f secret.yaml -n $NAMESPACE
log_success "配置文件部署完成"

# 部署应用
log_info "部署应用..."
kubectl apply -f deployment.yaml -n $NAMESPACE
kubectl apply -f service.yaml -n $NAMESPACE
log_success "应用部署完成"

# 部署Ingress
log_info "部署Ingress..."
kubectl apply -f ingress.yaml -n $NAMESPACE
log_success "Ingress部署完成"

# 部署HPA
log_info "部署水平Pod自动扩缩容..."
kubectl apply -f hpa.yaml -n $NAMESPACE
log_success "HPA部署完成"

# 等待部署完成
log_info "等待Pod启动..."
kubectl wait --for=condition=available --timeout=300s deployment/$APP_NAME -n $NAMESPACE

# 检查部署状态
log_info "检查部署状态..."
kubectl get pods -l app=$APP_NAME -n $NAMESPACE
kubectl get services -l app=$APP_NAME -n $NAMESPACE
kubectl get ingress -l app=$APP_NAME -n $NAMESPACE

# 获取访问地址
log_success "🎉 部署完成！"
echo ""
log_info "📊 部署信息："

# 获取Pod状态
PODS=$(kubectl get pods -l app=$APP_NAME -n $NAMESPACE --no-headers | wc -l)
READY_PODS=$(kubectl get pods -l app=$APP_NAME -n $NAMESPACE --no-headers | grep "1/1" | wc -l)
echo "   - Pod状态: $READY_PODS/$PODS Ready"

# 获取Service信息
SERVICE_IP=$(kubectl get service ${APP_NAME}-service -n $NAMESPACE -o jsonpath='{.spec.clusterIP}' 2>/dev/null || echo "N/A")
echo "   - Service IP: $SERVICE_IP"

# 获取Ingress信息
INGRESS_IP=$(kubectl get ingress ${APP_NAME}-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "Pending")
echo "   - Ingress IP: $INGRESS_IP"

echo ""
log_info "🌐 访问地址："
echo "   - 内部访问: http://$SERVICE_IP"
echo "   - 外部访问: https://$DOMAIN"
if [ "$INGRESS_IP" != "Pending" ] && [ "$INGRESS_IP" != "" ]; then
    echo "   - 直接IP访问: http://$INGRESS_IP"
fi

echo ""
log_info "🔧 常用命令："
echo "   查看Pod: kubectl get pods -l app=$APP_NAME -n $NAMESPACE"
echo "   查看日志: kubectl logs -l app=$APP_NAME -n $NAMESPACE -f"
echo "   查看服务: kubectl get svc -l app=$APP_NAME -n $NAMESPACE"
echo "   扩缩容: kubectl scale deployment $APP_NAME --replicas=5 -n $NAMESPACE"
echo "   删除部署: kubectl delete -f . -n $NAMESPACE"

echo ""
log_warning "📝 注意事项："
echo "   1. 确保DNS已配置指向Ingress IP"
echo "   2. 如使用HTTPS，需要配置TLS证书"
echo "   3. 监控Pod资源使用情况"
echo "   4. 定期检查HPA扩缩容状态"

# 清理临时文件
rm -f *.bak

log_success "部署脚本执行完成！"
