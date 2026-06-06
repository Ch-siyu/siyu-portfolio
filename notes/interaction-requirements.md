# 网站规则与交互说明

## 目录结构

最终目标目录：

```txt
D:\webpage-personal
  assets
  content
  notes
  inspiration
  website code
```

当前实现先在本工作区完成，最后同步到 `D:\webpage-personal`。

## 页面结构

- Hero：满屏封面，大标题 `Hi, i'm Siyu / Hi, i'm 陈思语`，中央磁吸头像卡，底部介绍与按钮。
- About：浅蓝背景，左侧翻转工牌，右侧文字区，逐字滚动显现。
- Internship：白底大标题，三段实习经历纵向列表。
- Projects：米色背景，三张 sticky stacking 项目卡，滚动时产生堆叠缩放。
- Marquee：横向作品图带，根据页面滚动位移。
- Contact：左侧叠放头像卡，右侧联系信息、邮箱复制、电话与简历入口。

## 已实现交互

- 中英文切换，不刷新页面。
- GSAP 入场动画与滚动触发。
- Hero 图片磁吸跟随鼠标。
- 工牌 hover 3D 翻转。
- About 段落逐字透明度变化。
- Project 卡片 sticky 堆叠。
- Marquee 横向滚动。
- 邮箱复制反馈 toast。

## 后续替换说明

- 个人照片：替换 `website code/public/assets/01-hero-card-01.svg`，也同步替换根目录 `assets/01-hero-card-01.svg`。
- 联系页照片：替换 `website code/public/assets/contact-portrait.svg`。
- 项目截图：替换 `04-projects-*` 对应文件。
- 横向作品图：替换 `05-marquee-image-*` 对应文件。
