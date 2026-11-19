@echo off
chcp 65001 >nul
cd /d "%~dp0"
title MarkNote Docs

if not exist node_modules (
  echo [1/2] 安装依赖...
  call npm install
)

echo [2/2] 启动本地开发服务器 http://localhost:5173
call npm run dev
pause
