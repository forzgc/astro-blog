---
title: 章鱼星球安装Archlinux
tags: [章鱼星球, Archlinux]
date: 2023-04-19
poster: 000001.jpg
---

# 章鱼星球安装 Archlinux

## u 盘系统准备

1. 下载 ophub 维护的 armbain(s912) [下载](https://github.com/ophub/amlogic-s9xxx-armbian)

2. 使用 rufus 将系统镜像刷入 u 盘

## 安装系统

1. armbian 换源 [教程](https://mirrors.ustc.edu.cn/help/debian.html)

2. 更新系统并安装需要的工具

```
apt update
apt upgrade
```

3. 安装 bsdtar 和 mkimage

```
# armbian
apt install libarchive-tools
apt install u-boot-tools

# archlinux
pacman -S libarchive uboot-tools dosfstools
```

4. 下载 archlinux arm 系统

```
wget https://mirrors.ustc.edu.cn/archlinuxarm/os/ArchLinuxARM-aarch64-latest.tar.gz
```

5. 安装 armbian 到 emmc，让这个安装脚本帮我们分区

```
armbian-install
```

6. 格式化分区

```
mkfs.fat -F 32 -n EMMC_BOOT /dev/mmcblk2p1
mkfs.ext4 -L EMMC_ROOT /dev/mmcblk2p2
```

7. 挂载分区

```
mount /dev/mmcblk2p2 /mnt
mkdir /mnt/boot
mount /dev/mmcblk2p1 /mnt/boot
```

8. 解压系统到 emmc

```
bsdtar -xpf ArchLinuxARM-aarch64-latest.tar.gz -C /mnt
```

9. 复制 u-boot 文件到 /mnt/boot

```
cd /boot
cp boot.bmp /mnt/boot/boot.bmp
cp boot-emmc.cmd /mnt/boot/boot.cmd
cp boot-emmc.ini /mnt/boot/boot.ini
cp boot-emmc.scr /mnt/boot/boot.scr
cp dtb/amlogic/meson-gxm-octopus-planet.dtb  /mnt/boot/dtb
cp emmc_autoscript /mnt/boot/emmc_autoscript
cp u-boot-zyxq.bin /mnt/boot/u-boot.emmc
cp uEnv.txt /mnt/boot/uEnv.txt
```

10. 使用 archlinux arm 自带的内核

```
cd /mnt/boot
cp Image zImage
mkimage -A arm64 -O linux -T ramdisk -C gzip -n uInitrd -d initramfs-linux.img uInitrd
```

11. 获取分区 UUID

```
lsblk -f
```

12. 编辑/mnt/boot/uEnv.txt，把[xxx]换成上一步获得的 UUID

```
nano /mnt/boot/uEnv.txt
# 修改以下内容
LINUX=/zImage
INITRD=/uInitrd
FDT=/dtb
APPEND=root=UUID=[/dev/mmcblk2p2的UUID] rootflags=data=writeback rw rootfstype=ext4 console=ttyAML0,115200n8 console=tty0 no_console_suspend consoleblank=0 fsck.fix=yes fsck.repair=yes net.ifnames=0 cgroup_enable=cpuset cgroup_memory=1 cgroup_enable=memory swapaccount=1
```

13. 编辑/mnt/etc/fstab

```
nano /mnt/etc/fstab
# 新增以下内容
UUID=[/dev/mmcblk2p2的UUID] / ext4 defaults,noatime,errors=remount-ro 0 1
UUID=[/dev/mmcblk2p1的UUID] /boot vfat defaults 0 2

touch -m --date="2020-01-20" /mnt/etc/fstab
```

14. 修复开机太快，开启网卡错误的问题

```
nano /mnt/lib/systemd/system/systemd-networkd.service
# 在 ExecStart=!!/usr/lib/systemd/systemd-networkd 上一行添加
ExecStartPre=/usr/bin/sleep 10s
```

15. 拔掉 u 盘，卸载分区并重启

```
cd ~
umount -R /mnt
reboot
```

## 设置 Archlinux

1. 登录系统

```
ssh alarm@192.168.x.x
# 密码：alarm

su - root
# 密码：root
```

2. 修改密码

```
passwd
```

3. 换源 [教程](https://mirrors.ustc.edu.cn/help/archlinuxarm.html)

```
nano /etc/pacman.d/mirrorlist
# Server = https://mirrors.ustc.edu.cn/archlinuxarm/$arch/$repo
```

4. 更新系统

```
pacman-key --init
pacman-key --populate archlinuxarm
pacman -Syu
```

5. 设置时区

```
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

5. 本地化

```
nano /etc/locale.gen
# 去掉 zh_CN.UTF-8 UTF-8 前的 # 号

locale-gen

nano /etc/locale.conf
# LANG=zh_CN.UTF-8
```

6. 修改主机名

```
nano /etc/hostname
```

7. 新增用户

```
useradd -m xxx
passwd xxx
```

8. 重启

```
reboot
```

9. 删除 alarm 用户

```
ssh xxx@192.168.x.x
su - root

userdel -r alarm
```

10. 重启

```
reboot
```

## 更新内核后的操作

```
cd /boot
cp Image zImage
mkimage -A arm64 -O linux -T ramdisk -C gzip -n uInitrd -d initramfs-linux.img uInitrd

# 检查 systemd-networkd.service 的修改是否被覆盖
nano /lib/systemd/system/systemd-networkd.service
```
