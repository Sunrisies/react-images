#!/bin/bash

# 设置颜色变量
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 构建函数
build() {
    echo "开始构建项目..."
    if bun run build; then
        echo -e "${GREEN}✓ 构建成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 构建失败${NC}"
        exit 1
    fi
}

# 压缩函数
compress() {
    echo "开始压缩dist目录..."
    if zip  dist.zip dist; then
        echo -e "${GREEN}✓ 压缩成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 压缩失败${NC}"
        exit 1
    fi
}

# 清理远程目录函数
clean_remote() {
    echo "清理远程目录..."
    if ssh root@sunrise1024.top "cd /home/www/blog/admin/ && rm -rf *"; then
        echo -e "${GREEN}✓ 远程目录清理成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 远程目录清理失败${NC}"
        exit 1
    fi
}

# 上传文件函数
upload() {
    echo "上传文件到服务器..."
    if scp dist.zip root@sunrise1024.top:/home/www/blog/admin/; then
        echo -e "${GREEN}✓ 文件上传成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 文件上传失败${NC}"
        exit 1
    fi
}

# 解压文件函数
unzip_remote() {
    echo "解压远程文件..."
    if ssh root@sunrise1024.top "cd /home/www/blog/admin/ && unzip dist.zip"; then
        echo -e "${GREEN}✓ 远程解压成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 远程解压失败${NC}"
        exit 1
    fi
}

# 清理本地文件函数
clean_local() {
    echo "清理本地临时文件..."
    if rm dist.zip; then
        echo -e "${GREEN}✓ 本地清理成功${NC}"
        return 0
    else
        echo -e "${RED}✗ 本地清理失败${NC}"
        exit 1
    fi
}

# 主函数
main() {
    echo "=== 开始部署 ==="
    build && \
    compress && \
    clean_remote && \
    upload && \
    unzip_remote && \
    clean_local && \
    echo -e "${GREEN}=== 部署完成 ===${NC}" || \
    echo -e "${RED}=== 部署失败 ===${NC}"
}

# 执行主函数
main
