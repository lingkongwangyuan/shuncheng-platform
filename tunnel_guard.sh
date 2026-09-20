#!/bin/bash
# 顺诚AI工作平台 - 隧道守护脚本
# 每分钟检测隧道是否存活，断了自动重启

PORT=8080
LOG="/root/.coze/agents/7687509536105775423/workspace/platform/tunnel.log"

check_and_restart() {
    # 检查 HTTP 服务器是否在运行
    if ! curl -s -o /dev/null http://localhost:$PORT; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') HTTP server down, restarting..." >> "$LOG"
        cd /root/.coze/agents/7687509536105775423/workspace/platform
        python3 -m http.server $PORT &>/dev/null &
        sleep 1
    fi

    # 检查隧道是否在运行
    if ! ps aux | grep -v grep | grep -q "serveo.net"; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') Tunnel down, restarting..." >> "$LOG"
        ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=10 -R 80:localhost:$PORT serveo.net 2>> "$LOG" &
        sleep 5
        # 提取新 URL
        NEW_URL=$(grep -oP 'https://[a-f0-9]+-[\d-]+\.serveousercontent\.com' "$LOG" | tail -1)
        if [ -n "$NEW_URL" ]; then
            echo "$(date '+%Y-%m-%d %H:%M:%S') New URL: $NEW_URL" >> "$LOG"
        fi
    fi
}

while true; do
    check_and_restart
    sleep 60
done
