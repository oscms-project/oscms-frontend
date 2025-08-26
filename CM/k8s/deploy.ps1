# Kubernetes 部署脚本 (PowerShell版本)
# 用于一键部署课程管理系统前端到K8S集群

param(
    [string]$ImageTag = "latest",
    [string]$Domain = "your-domain.com",
    [string]$Namespace = "default"
)

# 设置PowerShell执行策略和编码
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 颜色函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-InfoMessage {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Blue"
}

function Write-SuccessMessage {
    param([string]$Message)
    Write-ColorOutput "[SUCCESS] $Message" "Green"
}

function Write-WarningMessage {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

# 配置变量
$APP_NAME = "course-management-frontend"
$IMAGE_NAME = "course-management-frontend"

Write-ColorOutput "🚀 开始部署课程管理系统前端到Kubernetes" "Green"
Write-ColorOutput "==============================================" "Green"
Write-Host ""
Write-ColorOutput "📋 部署配置：" "Cyan"
Write-Host "   - 命名空间: $Namespace"
Write-Host "   - 应用名称: $APP_NAME"
Write-Host "   - 镜像版本: ${IMAGE_NAME}:${ImageTag}"
Write-Host "   - 域名: $Domain"
Write-Host ""

try {
    # 检查kubectl是否可用
    Write-InfoMessage "检查kubectl是否安装..."
    $null = kubectl version --client 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMessage "kubectl 未安装或不在PATH中"
        exit 1
    }
    Write-SuccessMessage "kubectl 可用"

    # 检查集群连接
    Write-InfoMessage "检查Kubernetes集群连接..."
    $null = kubectl cluster-info 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMessage "无法连接到Kubernetes集群"
        exit 1
    }
    Write-SuccessMessage "集群连接正常"

    # 检查命名空间
    Write-InfoMessage "检查命名空间..."
    $null = kubectl get namespace $Namespace 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-InfoMessage "创建命名空间: $Namespace"
        kubectl create namespace $Namespace
        if ($LASTEXITCODE -ne 0) {
            Write-ErrorMessage "创建命名空间失败"
            exit 1
        }
    }
    Write-SuccessMessage "命名空间准备完成"

    # 切换到k8s目录
    Set-Location -Path "k8s"

    # 更新配置文件
    Write-InfoMessage "更新部署配置..."
    
    # 读取并更新deployment.yaml
    $deploymentContent = Get-Content "deployment.yaml" -Raw
    $imagePattern = "image: ${IMAGE_NAME}:.*"
    $imageReplacement = "image: ${IMAGE_NAME}:${ImageTag}"
    $deploymentContent = $deploymentContent -replace $imagePattern, $imageReplacement
    $deploymentContent | Set-Content "deployment.yaml" -Encoding UTF8

    # 读取并更新ingress.yaml和configmap.yaml中的域名
    $ingressContent = Get-Content "ingress.yaml" -Raw
    $ingressContent = $ingressContent -replace "your-domain\.com", $Domain
    $ingressContent | Set-Content "ingress.yaml" -Encoding UTF8

    $configmapContent = Get-Content "configmap.yaml" -Raw
    $configmapContent = $configmapContent -replace "your-domain\.com", $Domain
    $configmapContent | Set-Content "configmap.yaml" -Encoding UTF8

    Write-SuccessMessage "配置文件更新完成"

    # 应用ConfigMap和Secret
    Write-InfoMessage "部署ConfigMap和Secret..."
    kubectl apply -f configmap.yaml -n $Namespace
    kubectl apply -f secret.yaml -n $Namespace
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMessage "ConfigMap/Secret部署失败"
        exit 1
    }
    Write-SuccessMessage "配置文件部署完成"

    # 部署应用
    Write-InfoMessage "部署应用..."
    kubectl apply -f deployment.yaml -n $Namespace
    kubectl apply -f service.yaml -n $Namespace
    if ($LASTEXITCODE -ne 0) {
        Write-ErrorMessage "应用部署失败"
        exit 1
    }
    Write-SuccessMessage "应用部署完成"

    # 部署Ingress
    Write-InfoMessage "部署Ingress..."
    kubectl apply -f ingress.yaml -n $Namespace
    if ($LASTEXITCODE -ne 0) {
        Write-WarningMessage "Ingress部署失败，可能需要先安装Ingress Controller"
    } else {
        Write-SuccessMessage "Ingress部署完成"
    }

    # 部署HPA
    Write-InfoMessage "部署水平Pod自动扩缩容..."
    kubectl apply -f hpa.yaml -n $Namespace
    if ($LASTEXITCODE -ne 0) {
        Write-WarningMessage "HPA部署失败，可能需要先安装Metrics Server"
    } else {
        Write-SuccessMessage "HPA部署完成"
    }

    # 等待部署完成
    Write-InfoMessage "等待Pod启动..."
    kubectl wait --for=condition=available --timeout=300s deployment/$APP_NAME -n $Namespace
    if ($LASTEXITCODE -ne 0) {
        Write-WarningMessage "Pod启动超时，请检查部署状态"
    }

    # 检查部署状态
    Write-InfoMessage "检查部署状态..."
    Write-Host ""
    Write-ColorOutput "📊 Pod状态：" "Cyan"
    kubectl get pods -l app=$APP_NAME -n $Namespace

    Write-Host ""
    Write-ColorOutput "📊 Service状态：" "Cyan"
    kubectl get services -l app=$APP_NAME -n $Namespace

    Write-Host ""
    Write-ColorOutput "📊 Ingress状态：" "Cyan"
    kubectl get ingress -l app=$APP_NAME -n $Namespace

    # 获取访问信息
    Write-Host ""
    Write-SuccessMessage "🎉 部署完成！"
    Write-Host ""

    # 获取Pod状态
    $pods = kubectl get pods -l app=$APP_NAME -n $Namespace --no-headers 2>$null
    if ($pods) {
        $totalPods = ($pods | Measure-Object).Count
        $readyPods = ($pods | Where-Object { $_ -match "1/1.*Running" } | Measure-Object).Count
        Write-Host "   - Pod状态: $readyPods/$totalPods Ready"
    }

    # 获取Service信息
    $serviceIP = kubectl get service "${APP_NAME}-service" -n $Namespace -o jsonpath='{.spec.clusterIP}' 2>$null
    if ($serviceIP) {
        Write-Host "   - Service IP: $serviceIP"
    }

    # 获取Ingress信息
    $ingressIP = kubectl get ingress "${APP_NAME}-ingress" -n $Namespace -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ($ingressIP) {
        Write-Host "   - Ingress IP: $ingressIP"
    } else {
        Write-Host "   - Ingress IP: Pending"
    }

    Write-Host ""
    Write-ColorOutput "🌐 访问地址：" "Cyan"
    if ($serviceIP) {
        Write-Host "   - 内部访问: http://$serviceIP"
    }
    Write-Host "   - 外部访问: https://$Domain"
    if ($ingressIP) {
        Write-Host "   - 直接IP访问: http://$ingressIP"
    }

    Write-Host ""
    Write-ColorOutput "🔧 常用命令：" "Yellow"
    Write-Host "   查看Pod: kubectl get pods -l app=$APP_NAME -n $Namespace"
    Write-Host "   查看日志: kubectl logs -l app=$APP_NAME -n $Namespace -f"
    Write-Host "   查看服务: kubectl get svc -l app=$APP_NAME -n $Namespace"
    Write-Host "   扩缩容: kubectl scale deployment $APP_NAME --replicas=5 -n $Namespace"
    Write-Host "   删除部署: kubectl delete -f . -n $Namespace"

    Write-Host ""
    Write-ColorOutput "📝 注意事项：" "Yellow"
    Write-Host "   1. 确保DNS已配置指向Ingress IP"
    Write-Host "   2. 如使用HTTPS，需要配置TLS证书"
    Write-Host "   3. 监控Pod资源使用情况"
    Write-Host "   4. 定期检查HPA扩缩容状态"

    Write-SuccessMessage "部署脚本执行完成！"

} catch {
    Write-ErrorMessage "部署过程中发生错误: $($_.Exception.Message)"
    exit 1
} finally {
    # 返回原目录
    Set-Location -Path ".."
}
