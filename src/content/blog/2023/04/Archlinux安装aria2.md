---
title: Archlinux安装aria2
tags: [章鱼星球, Archlinux]
date: 2023-04-19
poster: 000001.jpg
---

# Archlinux 安装 aria2

## 安装

```
pacman -S aria2
```

## 配置

1. 守护进程配置

```
mkdir -p ~/.config/systemd/user

nano ~/.config/systemd/user/aria2cd.service
# 输入以下内容
[Unit]
Description=aria2 Daemon

[Service]
Type=forking
ExecStart=/usr/bin/aria2c --conf-path=/home/xxx/.config/aria2/aria2.conf

[Install]
WantedBy=default.target
```

2. aria2 配置

```
mkdir -p ~/.config/aria2

nano ~/.config/aria2/aria2.conf
# 输入以下内容
continue
daemon=true
dir=[下载目录]
file-allocation=falloc
log-level=warn
max-connection-per-server=4
max-concurrent-downloads=5
max-overall-download-limit=0
min-split-size=5M
enable-http-pipelining=true

seed-time=10
bt-save-metadata=true
bt-load-saved-metadata=true
bt-force-encryption=true
bt-require-crypto=true
bt-min-crypto-level=arc4
bt-detach-seed-only=true

user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.47

input-file=/home/xxx/.config/aria2/aria2.session
save-session=/home/xxx/.config/aria2/aria2.session
save-session-interval=60
auto-save-interval=60

enable-rpc=true
rpc-allow-origin-all=true
rpc-listen-all=true
rpc-listen-port=6800
rpc-secret=[secret]
```

3. 启动

```
systemctl --user enable aria2cd.service
systemctl --user start aria2cd.service
```

4. 设置用户服务自启

```
su - root

loginctl enable-linger xxx
```
