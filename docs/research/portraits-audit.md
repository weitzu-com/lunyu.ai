# 孔子与77位弟子肖像核对

核对日期：2026-09-06。范围：本站78个人物页面。

## 结论与边界

78人均找到可一一对应的后世画像，来自国立故宫博物院藏《至圣先贤半身像》。这里只确认画册所指人物，不确认春秋人物的真实相貌，更不称为生前照片。馆方说明，传世孔子像多系后人根据文献揣摩；本册依题签封号定在1330年以后。[馆方展览说明](https://theme.npm.edu.tw/exh106/Confucius/ch/page-2.html)

## 证据与图像来源

1. 以[故宫全册目录](https://digitalarchive.npm.gov.tw/Collection/Detail/1891?dep=P)的120幅编号、题名和单幅馆藏链接建立映射。全册作品号中画00032900000。
2. 从[Wikimedia Commons原始图像分类](https://commons.wikimedia.org/wiki/Category:Half_Portraits_of_the_Great_Sage_and_Virtuous_Men_of_Old_(Yuan_dynasty_artwork))读取完整120幅中文文件，而非仅使用14幅英文命名图。通过MediaWiki API逐文件获取原图、缩略图、尺寸、许可和文件说明。
3. 异名用馆方题签及[《史记三家注》卷67](https://zh.wikisource.org/zh-hant/史記三家註/卷067)交叉核对。图像元数据的人物自动关联不作身份依据。
4. 将 API 实际返回的 960px 公版缩略图保存为本站静态素材，避免外部图库超时影响页面。JSON 保留逐图 Commons 条目、原图、官方目录、许可证据和身份说明，并记录本站路径、实际尺寸与 SHA-256 校验值；文件名包含内容摘要，由 Next.js 生成适配屏幕的图片。

## 作者、年代与许可

全部所选图像作者均为佚名，画册属元代，馆方以封号考定绘制于1330年以后。Commons的78个所选文件均明确标注Public domain及PD-Art（PD-old-100-expired），图像为二维公版作品的忠实数字复制；[许可标识](https://creativecommons.org/publicdomain/mark/1.0/)。每个人物的图注应链接自己的文件条目和许可。

故宫自身也在[馆藏记录](https://digitalarchive.npm.gov.tw/Collection/Detail/18011?dep=P)声明低阶图像CC0、中阶图像CC BY 4.0。本次选用Commons文件并如实引用其PD-Art标识，不将Commons原图误称为馆方CC0下载。建议保留“佚名作，国立故宫博物院藏，Wikimedia Commons”署名及“后世画像，非生前写真”提示。

## 必须保留的辨误

- 原宪使用第019幅原憲（题签子思），不使用第004幅孔伋。
- 公孙龙使用第039幅（题签子石）。Commons该图曾关联战国名家公孙龙，不能据自动关联判断身份；馆方题签能直接确认本页孔门弟子。馆方爵号录松江侯，清代图像考有枝江侯异文，不将图签爵号写入春秋生平。
- 申党使用第058幅（馆方题名申黨周），不使用第083幅申枨；不因画册或字名相似便合并古籍有争议的人物。
- 廉絜对应廉潔，画签字子曹与《史记》字庸不同；仅用于说明后世描绘对象，不反改早期档案。
- 原亢籍→原亢、鄡单→鄔单、邦巽→邽选、颜幸→颜辛等均有古代异文与题签依据，逐项写在JSON的identityNote中。

## 逐人审计

| 页面人物 | 画册编号 | 画册题名／原图条目 | 官方记录 | 结论 |
| --- | --- | --- | --- | --- |
| 孔子（confucius） | 001 | [001-孔子](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-001-%E5%AD%94%E5%AD%90.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18011?dep=P) | 后世描绘对象已核对 |
| 颜回（yan-hui） | 002 | [002-顏回](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-002-%E9%A1%8F%E5%9B%9E.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18012?dep=P) | 后世描绘对象已核对 |
| 闵损（min-sun） | 006 | [006-閔子騫](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-006-%E9%96%94%E5%AD%90%E9%A8%AB.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18016?dep=P) | 后世描绘对象已核对 |
| 冉耕（ran-geng） | 007 | [007-冉伯牛](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-007-%E5%86%89%E4%BC%AF%E7%89%9B.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18017?dep=P) | 后世描绘对象已核对 |
| 冉雍（ran-yong） | 008 | [008-冉雍](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-008-%E5%86%89%E9%9B%8D.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18085?dep=P) | 后世描绘对象已核对 |
| 冉求（ran-qiu） | 011 | [011-冉求](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-011-%E5%86%89%E6%B1%82.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18088?dep=P) | 后世描绘对象已核对 |
| 仲由（zhong-you） | 012 | [012-仲由](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-012-%E4%BB%B2%E7%94%B1.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18089?dep=P) | 后世描绘对象已核对 |
| 宰予（zai-yu） | 009 | [009-宰予](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-009-%E5%AE%B0%E4%BA%88.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18086?dep=P) | 后世描绘对象已核对 |
| 端木赐（duanmu-ci） | 010 | [010-端木賜](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-010-%E7%AB%AF%E6%9C%A8%E8%B3%9C.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18087?dep=P) | 后世描绘对象已核对 |
| 言偃（yan-yan） | 013 | [013-言偃](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-013-%E8%A8%80%E5%81%83.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18090?dep=P) | 后世描绘对象已核对 |
| 卜商（bu-shang） | 014 | [014-卜商](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-014-%E5%8D%9C%E5%95%86.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18091?dep=P) | 后世描绘对象已核对 |
| 颛孙师（zhuansun-shi） | 015 | [015-顓孫師](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-015-%E9%A1%93%E5%AD%AB%E5%B8%AB.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18092?dep=P) | 后世描绘对象已核对 |
| 曾参（zeng-shen） | 003 | [003-曾參](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-003-%E6%9B%BE%E5%8F%83.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18013?dep=P) | 后世描绘对象已核对 |
| 澹台灭明（tantai-mieming） | 017 | [017-澹臺滅明](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-017-%E6%BE%B9%E8%87%BA%E6%BB%85%E6%98%8E.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18094?dep=P) | 后世描绘对象已核对 |
| 宓不齐（mi-buqi） | 016 | [016-宓不齊](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-016-%E5%AE%93%E4%B8%8D%E9%BD%8A.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18093?dep=P) | 后世描绘对象已核对 |
| 原宪（yuan-xian） | 019 | [019-原憲](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-019-%E5%8E%9F%E6%86%B2.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18096?dep=P) | 后世描绘对象已核对 |
| 公冶长（gongye-chang） | 018 | [018-公冶長](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-018-%E5%85%AC%E5%86%B6%E9%95%B7.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18095?dep=P) | 后世描绘对象已核对 |
| 南宫括（nangong-kuo） | 021 | [021-南宮适](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-021-%E5%8D%97%E5%AE%AE%E9%80%82.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18098?dep=P) | 后世描绘对象已核对 |
| 公皙哀（gongxi-ai） | 020 | [020-公皙哀](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-020-%E5%85%AC%E7%9A%99%E5%93%80.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18097?dep=P) | 后世描绘对象已核对 |
| 曾蒧（zeng-dian） | 023 | [023-曾點](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-023-%E6%9B%BE%E9%BB%9E.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18100?dep=P) | 后世描绘对象已核对 |
| 颜无繇（yan-wuyao） | 022 | [022-顏無繇](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-022-%E9%A1%8F%E7%84%A1%E7%B9%87.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18099?dep=P) | 后世描绘对象已核对 |
| 商瞿（shang-qu） | 025 | [025-商瞿](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-025-%E5%95%86%E7%9E%BF.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18102?dep=P) | 后世描绘对象已核对 |
| 高柴（gao-chai） | 024 | [024-高柴](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-024-%E9%AB%98%E6%9F%B4.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18101?dep=P) | 后世描绘对象已核对 |
| 漆雕开（qidiao-kai） | 027 | [027-漆雕開](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-027-%E6%BC%86%E9%9B%95%E9%96%8B.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18104?dep=P) | 后世描绘对象已核对 |
| 公伯缭（gongbo-liao） | 026 | [026-公伯寮](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-026-%E5%85%AC%E4%BC%AF%E5%AF%AE.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18103?dep=P) | 后世描绘对象已核对 |
| 司马耕（sima-geng） | 029 | [029-司馬耕](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-029-%E5%8F%B8%E9%A6%AC%E8%80%95.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18106?dep=P) | 后世描绘对象已核对 |
| 樊须（fan-xu） | 030 | [030-樊須](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-030-%E6%A8%8A%E9%A0%88.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18107?dep=P) | 后世描绘对象已核对 |
| 有若（you-ruo） | 031 | [031-有若](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-031-%E6%9C%89%E8%8B%A5.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18108?dep=P) | 后世描绘对象已核对 |
| 公西赤（gongxi-chi） | 028 | [028-公西赤](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-028-%E5%85%AC%E8%A5%BF%E8%B5%A4.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18105?dep=P) | 后世描绘对象已核对 |
| 巫马施（wuma-shi） | 033 | [033-巫馬施](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-033-%E5%B7%AB%E9%A6%AC%E6%96%BD.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18110?dep=P) | 后世描绘对象已核对 |
| 梁鳣（liang-zhan） | 032 | [032-梁鱣](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-032-%E6%A2%81%E9%B1%A3.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18109?dep=P) | 后世描绘对象已核对 |
| 颜幸（yan-xing） | 035 | [035-顏辛](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-035-%E9%A1%8F%E8%BE%9B.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18112?dep=P) | 后世描绘对象已核对 |
| 冉孺（ran-ru） | 036 | [036-冉孺](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-036-%E5%86%89%E5%AD%BA.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18113?dep=P) | 后世描绘对象已核对 |
| 曹恤（cao-xu） | 037 | [037-曹卹](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-037-%E6%9B%B9%E5%8D%B9.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18114?dep=P) | 后世描绘对象已核对 |
| 伯虔（bo-qian） | 034 | [034-伯虔](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-034-%E4%BC%AF%E8%99%94.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18111?dep=P) | 后世描绘对象已核对 |
| 公孙龙（gongsun-long） | 039 | [039-公孫龍](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-039-%E5%85%AC%E5%AD%AB%E9%BE%8D.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18116?dep=P) | 后世描绘对象已核对 |
| 冉季（ran-ji） | 046 | [046-冉季](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-046-%E5%86%89%E5%AD%A3.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18123?dep=P) | 后世描绘对象已核对 |
| 公祖句兹（gongzu-gouzi） | 061 | [061-公祖句茲](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-061-%E5%85%AC%E7%A5%96%E5%8F%A5%E8%8C%B2.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18138?dep=P) | 后世描绘对象已核对 |
| 秦祖（qin-zu） | 059 | [059-秦祖](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-059-%E7%A7%A6%E7%A5%96.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18136?dep=P) | 后世描绘对象已核对 |
| 漆雕哆（qidiao-duo） | 044 | [044-漆雕哆](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-044-%E6%BC%86%E9%9B%95%E5%93%86.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18121?dep=P) | 后世描绘对象已核对 |
| 颜高（yan-gao） | 043 | [043-顏高](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-043-%E9%A1%8F%E9%AB%98.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18120?dep=P) | 后世描绘对象已核对 |
| 漆雕徒父（qidiao-tufu） | 040 | [040-漆雕徒父](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-040-%E6%BC%86%E9%9B%95%E5%BE%92%E7%88%B6.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18117?dep=P) | 后世描绘对象已核对 |
| 壤驷赤（rangsi-chi） | 045 | [045-壤駟赤](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-045-%E5%A3%A4%E9%A7%9F%E8%B5%A4.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18122?dep=P) | 后世描绘对象已核对 |
| 商泽（shang-ze） | 042 | [042-商澤](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-042-%E5%95%86%E6%BE%A4.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18119?dep=P) | 后世描绘对象已核对 |
| 石作蜀（shizuo-shu） | 047 | [047-石作蜀](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-047-%E7%9F%B3%E4%BD%9C%E8%9C%80.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18124?dep=P) | 后世描绘对象已核对 |
| 任不齐（ren-buqi） | 038 | [038-任不齊](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-038-%E4%BB%BB%E4%B8%8D%E9%BD%8A.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18115?dep=P) | 后世描绘对象已核对 |
| 公良孺（gongliang-ru） | 048 | [048-公良孺](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-048-%E5%85%AC%E8%89%AF%E5%AD%BA.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18125?dep=P) | 后世描绘对象已核对 |
| 后处（hou-chu） | 051 | [051-后處](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-051-%E5%90%8E%E8%99%95.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18128?dep=P) | 后世描绘对象已核对 |
| 秦冉（qin-ran） | 052 | [052-秦冉](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-052-%E7%A7%A6%E5%86%89.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18129?dep=P) | 后世描绘对象已核对 |
| 公夏首（gongxia-shou） | 049 | [049-公夏首](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-049-%E5%85%AC%E5%A4%8F%E9%A6%96.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18126?dep=P) | 后世描绘对象已核对 |
| 奚容箴（xirong-zhen） | 057 | [057-奚容蒧](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-057-%E5%A5%9A%E5%AE%B9%E8%92%A7.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18134?dep=P) | 后世描绘对象已核对 |
| 公肩定（gongjian-ding） | 050 | [050-公肩定](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-050-%E5%85%AC%E8%82%A9%E5%AE%9A.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18127?dep=P) | 后世描绘对象已核对 |
| 颜祖（yan-zu） | 055 | [055-顏祖](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-055-%E9%A1%8F%E7%A5%96.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18132?dep=P) | 后世描绘对象已核对 |
| 鄡单（qiao-dan） | 054 | [054-鄔單](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-054-%E9%84%94%E5%96%AE.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18131?dep=P) | 后世描绘对象已核对 |
| 句井疆（goujing-jiang） | 053 | [053-勾井疆](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-053-%E5%8B%BE%E4%BA%95%E7%96%86.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18130?dep=P) | 后世描绘对象已核对 |
| 罕父黑（hanfu-hei） | 056 | [056-罕父黑](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-056-%E7%BD%95%E7%88%B6%E9%BB%91.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18133?dep=P) | 后世描绘对象已核对 |
| 秦商（qin-shang） | 041 | [041-秦商](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-041-%E7%A7%A6%E5%95%86.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18118?dep=P) | 后世描绘对象已核对 |
| 申党（shen-dang） | 058 | [058-申黨](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-058-%E7%94%B3%E9%BB%A8.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18135?dep=P) | 后世描绘对象已核对 |
| 颜之仆（yan-zhipu） | 067 | [067-顏之僕](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-067-%E9%A1%8F%E4%B9%8B%E5%83%95.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17897?dep=P) | 后世描绘对象已核对 |
| 荣旂（rong-qi） | 060 | [060-榮旂](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-060-%E6%A6%AE%E6%97%82.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18137?dep=P) | 后世描绘对象已核对 |
| 县成（xian-cheng） | 065 | [065-縣成](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-065-%E7%B8%A3%E6%88%90.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17895?dep=P) | 后世描绘对象已核对 |
| 左人郢（zuoren-ying） | 062 | [062-左人郢](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-062-%E5%B7%A6%E4%BA%BA%E9%83%A2.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/18139?dep=P) | 后世描绘对象已核对 |
| 燕伋（yan-ji） | 063 | [063-燕伋](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-063-%E7%87%95%E4%BC%8B.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17893?dep=P) | 后世描绘对象已核对 |
| 郑国（zheng-guo） | 066 | [066-鄭國](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-066-%E9%84%AD%E5%9C%8B.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17896?dep=P) | 后世描绘对象已核对 |
| 秦非（qin-fei） | 081 | [081-秦非](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-081-%E7%A7%A6%E9%9D%9E.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17911?dep=P) | 后世描绘对象已核对 |
| 施之常（shi-zhichang） | 079 | [079-施之常](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-079-%E6%96%BD%E4%B9%8B%E5%B8%B8.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17909?dep=P) | 后世描绘对象已核对 |
| 颜哙（yan-kuai） | 085 | [085-顏噲](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-085-%E9%A1%8F%E5%99%B2.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17915?dep=P) | 后世描绘对象已核对 |
| 步叔乘（bushu-cheng） | 084 | [084-步叔乘](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-084-%E6%AD%A5%E5%8F%94%E4%B9%98.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17914?dep=P) | 后世描绘对象已核对 |
| 原亢籍（yuan-kangji） | 064 | [064-原亢](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-064-%E5%8E%9F%E4%BA%A2.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17894?dep=P) | 后世描绘对象已核对 |
| 乐欬（yue-ke） | 069 | [069-樂欬](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-069-%E6%A8%82%E6%AC%AC.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17899?dep=P) | 后世描绘对象已核对 |
| 廉絜（lian-jie） | 068 | [068-廉潔](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-068-%E5%BB%89%E6%BD%94.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17898?dep=P) | 后世描绘对象已核对 |
| 叔仲会（shuzhong-hui） | 070 | [070-叔仲會](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-070-%E5%8F%94%E4%BB%B2%E6%9C%83.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17900?dep=P) | 后世描绘对象已核对 |
| 颜何（yan-he） | 071 | [071-顏何](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-071-%E9%A1%8F%E4%BD%95.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17901?dep=P) | 后世描绘对象已核对 |
| 狄黑（di-hei） | 073 | [073-狄黑](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-073-%E7%8B%84%E9%BB%91.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17903?dep=P) | 后世描绘对象已核对 |
| 邦巽（bang-xun） | 072 | [072-邽選](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-072-%E9%82%BD%E9%81%B8.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17902?dep=P) | 后世描绘对象已核对 |
| 孔忠（kong-zhong） | 075 | [075-孔忠](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-075-%E5%AD%94%E5%BF%A0.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17905?dep=P) | 后世描绘对象已核对 |
| 公西舆如（gongxi-yuru） | 074 | [074-公西輿如](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-074-%E5%85%AC%E8%A5%BF%E8%BC%BF%E5%A6%82.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17904?dep=P) | 后世描绘对象已核对 |
| 公西葴（gongxi-zhen） | 077 | [077-公西葴](https://commons.wikimedia.org/wiki/File:%E8%87%B3%E8%81%96%E5%85%88%E8%B3%A2%E5%8D%8A%E8%BA%AB%E5%83%8F_%E5%86%8A-077-%E5%85%AC%E8%A5%BF%E8%91%B4.jpg) | [馆藏](https://digitalarchive.npm.gov.tw/Collection/Detail/17907?dep=P) | 后世描绘对象已核对 |

## 机器可读结果

[biography-portrait-research.json](../../src/data/biography-portrait-research.json)包含78个唯一slug、78个唯一画册编号与图像URL、逐图许可、官方身份来源。sources中的kind采用本站现有类别；Commons来源标为机构资料，仅作图像托管及许可记录，历史身份优先采用故宫题签和古籍。

## 网络检查

2026-09-06：78张缩略图逐一HEAD核查，全部返回HTTP 200及image/jpeg；最大433,640字节。JSON记录各图响应状态、内容类型与字节数。尺寸字段采用实际960px缩略图规格，按原图比例计算高度。

## 本站素材验证

78 张 JPEG 均为 960 像素宽，总计 29,404,978 字节。逐张检查文件格式和实际尺寸，文件名含 SHA-256 前 12 位，完整校验值保存在数据文件中。全部来源链接与身份对应关系随图片保留。
