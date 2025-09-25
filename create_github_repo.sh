#!/bin/bash

# GitHub仓库创建脚本
# 这个脚本会指导你手动创建GitHub仓库并推送代码

echo "=== AI English Exercise Generator - GitHub仓库创建指南 ==="
echo ""
echo "步骤 1: 在GitHub上创建新仓库"
echo "请访问: https://github.com/new"
echo ""
echo "步骤 2: 填写仓库信息"
echo "- Repository name: ai-english-exercise-generator"
echo "- Description: AI-powered English exercise generator using Google Gemini API"
echo "- Public/Private: 选择你的偏好"
echo "- Initialize repository: 不要勾选任何选项（不要添加README, .gitignore, 或license）"
echo ""
echo "步骤 3: 创建仓库后，复制仓库的HTTPS URL"
echo "格式应该是: https://github.com/YOUR_USERNAME/ai-english-exercise-generator.git"
echo ""
echo "步骤 4: 在终端中运行以下命令:"
echo ""
echo "# 添加远程仓库地址（将YOUR_USERNAME替换为你的GitHub用户名）"
echo "git remote add origin https://github.com/YOUR_USERNAME/ai-english-exercise-generator.git"
echo ""
echo "# 推送到GitHub"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "或者你可以直接运行这个脚本中的命令:"
echo ""

# 检查用户是否提供了GitHub用户名
if [ -z "$1" ]; then
    echo "使用方法: $0 <your-github-username>"
    echo "示例: $0 yourusername"
    exit 1
fi

USERNAME=$1
REPO_URL="https://github.com/${USERNAME}/ai-english-exercise-generator.git"

echo "正在为你配置GitHub仓库..."
echo "GitHub用户名: $USERNAME"
echo "仓库URL: $REPO_URL"
echo ""

# 添加远程仓库
git remote add origin $REPO_URL

# 重命名分支为main
git branch -M main

echo "配置完成！下一步是推送代码到GitHub。"
echo "请确保你已经在GitHub上创建了仓库，然后运行:"
echo "git push -u origin main"
echo ""
echo "如果推送失败，请检查:"
echo "1. 是否已经在GitHub上创建了仓库"
echo "2. 是否使用了正确的用户名"
echo "3. 是否已经登录GitHub"