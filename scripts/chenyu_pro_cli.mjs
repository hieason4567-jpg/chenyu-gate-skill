#!/usr/bin/env node
// 辰屿 Pro CLI —— Agent 编剧模式命令行（v2.x）：写作由安装 Skill 的用户 Agent 完成，
// 不消耗平台积分；本 CLI 只做 鉴权/项目壳/正文回传/只读查询/交付。
// CLI 内不存在任何能触发平台模型生成或扣积分的调用（v2.1.0 起物理移除）。
// 零依赖，Node 18+。配置存 ~/.codex/chenyu-pro/config.json（KEY/session 掩码显示，绝不写入日志）。
import { proxyFetch, findSystemProxy } from './net.mjs'; // 网络层：直连失败自动改走系统代理（须在其它代码之前加载，先取到代理环境变量）
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { exec, spawn, spawnSync } from 'node:child_process';
import { DOSSIER_FILE, applyAssetMap, checkAssetMap, collectAssetEvidence, normalizeAssetMap, parseDossier, renderEvidenceFiles } from './asset_workbook.mjs';
import { WASH_MAP_FILE, addressTable, applyRenames, checkWashMap, normalizeWashMap, washCheck } from './wash_check.mjs';
import { REVIEW_FILE, THRESHOLDS, deliverCheck } from './deliver_check.mjs';
import { PLACE_PROP_DESIGN_FILE, assetListJson, buildCatalogIndex, collectAssets, lookStylingTemplate, isClothingVariantName, lookTableCompleteness, lookTableIssues, lookTableJson, washRedesignIssues, mergeLookStylings, mergePlacePropDesigns, propBudget, propBudgetNote, placePropTemplate, propNameIssues, renderAssetList } from './asset_export.mjs';
import { VARIANT_CANDIDATE_FILE, VARIANT_DECISION_FILE, buildCandidates, checkAgainstScript, decisionTemplate, nameResolver, renderCandidates, scanAppearanceSignals, strongSignals } from './variant_candidates.mjs';
import { ROLE_DECISION_FILE, ROLE_REVIEW_FILE, isDescriptiveName, pendingRoleReviews, placeLikeRoleNames, renderRoleReview, roleDecisionTemplate, rolesNeedingReview } from './merge_review.mjs';
import { annotateDurations, shiftWaivers } from './durations.mjs';

// 版本号：功能变化 minor+1，修 bug patch+1。改动同时更新下方 CHANGELOG（最新的写在最上面）。
// v2.31.0 2026-10-05  新增 text-analyze：现成剧本（程序直接转）和小说（Agent 逐段提取）整理成和视频分析同一种分析稿，
//                    从资产整理起三种输入走同一条链路（assets-prepare → assets-apply → 建议 → 用户确认 → 写）。没有资产合并表不许动笔。
// v2.30.2 2026-10-05  语病里的叠字只修出错造成的（卡壳多念的字），正常叠词、称呼、拟声、故意重复强调一律不动。
// v2.30.1 2026-10-05  原片自带的语病（叠字、同一句念两遍、病句、错别字）要修不照抄，只修毛病不润色，逐处登记 dialogue_changes。
// v2.30.0 2026-10-05  洗稿（含只改名）默认重做全部形象：审核结论 looks 写 source（原片）和 appearance（重做后），
//                    assets-export 查没写 source、新旧一样、主色调和原片同色系；正文里残留的原片服装描写列出来。沿用原片写 redesignLooks:none。
// v2.29.0 2026-10-05  形象设计补全剧配色规划（同场的正式人物主色调同色相会被逐对列出）；原文特征（appearance）不许抄设计稿。
//                    起因：68 集 148 个形象原文特征和详细描述一字不差，主色调 82 个黑、62 个灰，主角和最常同场的人都是黑。
// v2.28.0 2026-10-05  视频反推的剧本带原片运镜：△（近景·推）……。1:1 还原每个 △ 都带；洗稿/只改名只带运镜在讲故事的镜头（揭示、情绪特写、仰俯、钩子卡点、转场），普通对话镜头不带。
// v2.27.0 2026-10-04  视频反推标准流程：反推 → 交付资产整理 → 给洗稿建议 → 停 → 用户修改或确认 → 才写洗稿剧本。
//                    洗稿映射.json 草稿写 "confirmed": false，未确认时 rename / wash-check 拒绝执行；洗稿建议有了标准内容。
// v2.26.2 2026-10-04  标了建卡的道具都带 key（客户端导入时只建 key 的，之前 22 件只建了 8 件）；去掉「先建」名额上限和建卡数量建议。
// v2.26.1 2026-10-04  去掉 v2.26.0 的数量上限和 --allow-many（群像戏、道具戏真有那么多就是那么多），改成按「是什么」识别：
//                    没台词的单集背景人物不单独建角色；只差甲乙丙编号的同类龙套并成群体；
//                    同一件东西的几个叫法只建一张卡；不同人各自拿的普通物件（手机、话筒、出租车）不建卡。群体名识别补上「人群／众XX／XX群」。
//                    确实要保留的在「保留说明.json」里写 名字: 原因。
// v2.26.0 2026-10-04  形象表数量上限（已在 v2.26.1 撤掉）：角色超过「集数×1.2（至少 30）」、建卡道具超过「集数÷2（至少 12）」时 LOOK_TABLE_INCOMPLETE，
//                    要求把同场同类的龙套并成群体角色、把只出现一两集的道具改成不建卡（--allow-many 可放行）；不建卡的道具不再写进形象表。
//                    起因：一部 68 集的表导出了 188 个角色（114 个单集龙套）、72 件建卡道具，客户端要各建一张卡各出一张图。
// v2.25.0 2026-10-04  链路排查后的一批修复：① 资产整理/分包/存档等命令不传 --dir 时用最近一次取回的分析稿目录；② video-analyze 等到超时不再按「已完成」往下走；
//                    ③ 造型审核或场景道具设计没过、形象设计没做完时不生成 形象表.json；④ deliver / assets-export 的剧名跳过「工作、剧本」这类目录名；
//                    ⑤ 不传 --title 时用视频所在文件夹名当剧名；⑥ 形象变体判定按「角色#造型名」对号；⑦ 导出和交付检查对【形象】行的写法和格式门一致；
//                    ⑧ 接口报错改为抛出（可选步骤真的可选，上传失败不会整条退出）；⑨ 安装脚本的快捷命令不再把含中文的用户目录写进文件。
// v2.24.1 2026-10-04  SKILL.md 触发说明：用户一句话提到「辰屿 / 辰屿技能 / 用辰屿改编、反推、洗稿」就用本 Skill，命令由 Agent 敲。CLI 无功能变化。
// v2.24.0 2026-10-04  不完整的形象表交不出去：assets-export 做完整性检查（角色外观、形象名、每集有形象、场景有描述、道具非空且已判定并有描述），
//                    完整才生成「形象表.json」（LOOK_TABLE_PASS），不完整只写「形象表.未完成.json」并列出缺项；deliver 不收不完整的表。
//                    起因：一张道具清单为空、形象名全是服装名的表被导进客户端，客户端道具 0 件。
// v2.23.0 2026-10-04  补细节检查：① assets-export 道具清单为空时 ASSET_PROPS_MISSING（剧本没写【道具】行，客户端会按 0 件道具建卡）；
//                    ② gate 提醒「变体名是服装名」「角色名是地点/柜台名」；③ variants --source 多查两项：场合性变体出现在候选集数之外（离开后没换回）、
//                    同场有人穿了功能性着装而其他人还是平时形象；④ 没有分析稿的项目，variants 直接扫剧本动作行找可能漏建的变体。
// v2.22.0 2026-10-04  变体出图沿用主形象的脸：asset-image 出非主形象时把主形象的图作参考（图生图），提示词照客户端「主状态身份母版」的写法；
//                    主形象没出过图、这次也没选的变体不出，提示把主形象一起选上。
// v2.21.1 2026-10-04  deliver 把 资产图/ 放在形象表旁边（之前放进了 资产/资产图，形象表里记的相对路径就对不上了）。
// v2.21.0 2026-10-04  变体规则跟上客户端这边新定的三条：① 活动必须穿的功能性着装（滑雪服/泳装/潜水服/赛车服/练功服…）是强信号，本人正在做这项活动时必须建变体，
//                    离开后换回；② 原文明确写了换衣服的必须建，不当日常换装跳过；③ 角色名不能和地点/柜台/物件同名（前台、礼宾台），资产整理时必须改成指人的名字。
// v2.20.0 2026-10-04  固定项目目录：video-analyze / video-fetch / video-wait / video-rebuild 不传 --out 时放到 我的文档/辰屿项目/<剧名>/分析稿
//                    （以前是当前目录下的 chenyu-video-analysis，用户找不到）；CHENYU_PROJECTS_DIR 可改根目录。
//                    新命令 deliver：交付时把 全集剧本.txt、形象表.json、分集/ 放在项目目录最外层，其余归到 资产/ 报告/ 分析稿/ 其他/。
// v2.19.1 2026-10-04  资产整理做完是必停节点：ASSETS_PASS 后停下来向用户汇报并问要哪种稿，用户确认才动笔
//                    （之前「不要做完一步就停」的规则把 Agent 推过了头，没问就写了 68 集 1:1 剧本）。一开始就说明要哪种稿的除外。
// v2.19.0 2026-10-04  复核可以多代理并行：review-split 把待处理的称谓角色和形象变体按集数分包，每包自带相关镜头行原文和结论格式，
//                    子代理各做一包只写结论；review-merge 统一落地（并人/改名写进合并表，独立/变体写进判定表），拿不准的留给主 Agent。
// v2.18.0 2026-10-04  人物合并复核：ASSETS_PASS 以前只查表填全了没有。现在合并后还剩下的称谓/职业/镜头描述式角色里戏份不小的
//                    （3 句台词以上或跨 2 集以上），逐个要 Agent 确认——是某个具名角色就并掉、剧里有名字就改名、确实独立就写依据；
//                    没处理完输出 ASSETS_REVIEW_PENDING。起因：68 集一稿通过后还剩 128 个职业/镜头标签，一人多标签被用户指出才合并。
// v2.17.1 2026-10-04  形象变体候选多一路证据：直接扫逐集分析表每个镜头的外观原文里的强信号（病号服/包扎/婚纱/囚服/幼年/伪装…），
//                    不依赖平台归并得对不对；老项目没有 character_variants.json 也能出候选。占了角色一半以上镜头的算常态，不列。只读，不改平台产物。
// v2.17.0 2026-10-04  形象变体不再靠 Agent 凭记忆：assets-apply 在人物/场景/道具合并通过后，按平台的 character_variants.json 列出
//                    「形象变体候选」（每个角色主造型以外的造型，带强信号标记），Agent 逐条表态 build/skip，全部表态才给 ASSETS_PASS；
//                    variants --source 对照判定查剧本漏用（VARIANTS_PASS / VARIANTS_FLAGGED）。起因：72 集一稿 31 个角色全是单形象，
//                    第 20 集病号服+包扎仍绑着「孕妇」，所有检查都通过。
// v2.16.0 2026-10-04  ① 资产图：新命令 asset-image（按形象表列出可出图条目 → 用户点选 → 报价 → 平台出横版 16:9 资产图，约 6 分/张；
//                    图下载到 资产图/ 并把位置写回形象表的 image 字段）。全部剧本和形象表完成后才问用户要不要出、出谁的。
//                    ② 道具分级：形象表道具按 A 建卡 / B 剧情 / C 普通 分级，B、C 默认不建卡，建卡数量约每 4 集 1 件（超了提醒、不拦）。
//                    54 集实测：200 件道具里默认建卡的从 200 件降到 14 件。
// v2.15.0 2026-10-04  存档：新命令 archive（把资产合并表、整理版合集、检查报告等回传到平台项目留档，零积分，只做记录，不改原始分析稿和项目状态）
//                    和 archive-fetch（换机器/换 Agent 接着做时取回）。分阶段存：ASSETS_PASS 后一次，全部交付前再一次。
// v2.14.7 2026-10-04  SKILL.md 新增硬规则「做到交付为止，不要做完一步就停」：列明哪些情况不是停下的理由、哪几种才需要问用户。CLI 无功能变化。
// v2.14.6 2026-10-04  提交后盯到结束：新命令 video-wait（等分析跑完并自动取回，每次最多等 8 分钟，没跑完退出码 3 再跑一次）；
//                    video-analyze 提交成功后先说明「被中断怎么接着等、别重新提交」，新增 --no-wait；SKILL.md 要求提交后建定时任务
//                    跑 video-wait、拿到结果后取消定时任务并直接进入资产整理。
// v2.14.5 2026-10-04  取回分析稿后明确告诉 Agent「完不完整、下一步谁做什么」：video-fetch / video-analyze 结尾统一打印完整性结论
//                    （共几集、缺哪几集、哪几集没内容）；平台状态 needs_review 且没有失败集 = 分析完整、只是人物还没归属，
//                    下一步是 Agent 自己做资产整理（零积分），不是重新分析。SKILL.md 同步写明这一步由 Agent 做。
// v2.14.4 2026-10-04  集号取错修复：「9月15日-2.mp4」这类带日期前缀的文件名以前每个都被取成第 9 集，补失败集时被编到最后（EP072–EP088）。
//                    现在末尾的 -N 优先；追加到已有项目却取不到集号、而项目里还有缺集时停下不传；新参数 --episodes 2,3,5 直接指定集号。
// v2.14.3 2026-10-03  自带 ffmpeg 下载源加泉州节点（国内直连几秒下完，不用代理），对象存储做备用。
// v2.14.2 2026-10-03  自带 ffmpeg 的下载源只用对象存储（不再从平台服务器下，那台是渠道服务器）。
// v2.14.1 2026-10-03  批量视频分析：有集没分析成功时明确拦住（全部集拿到结果才交付），给出只补缺集的命令。
//                    平台同步：分析并发默认 64、临时性失败追加重试 3 轮、语音识别失败重试 3 次。
// v2.14.0 2026-10-03  视频上传前压缩改为硬要求：Skill 自带 ffmpeg（安装时下载，缺了自动补，有系统代理走代理）；每集按时长算码率压到 22MB 以内，
//                    只降码率不缩分辨率（很长的集降帧率）；没有 ffmpeg 且有文件超过 24MB 时停下不传（不再悄悄传原片）。新命令 ffmpeg [--install]。
// v2.13.2 2026-10-03  version 顺带查 GitHub 线上最新版，旧版提示重跑安装命令；补齐 2.13.x 更新记录。
// v2.13.1 2026-10-03  工程改写的造型描述保留 脸部/身材/发型（客户端出图只读描述，截掉会画成同一个发型和脸），缺的用卡片字段补回。
// v2.13.0 2026-10-01  成片工程改写 remake-*（客户端工程 JSON/xlsx 不重新分镜）；场景道具出图描述；打包客户端同款审核；
//                    安装后显示使用说明（guide）；免费版并入同一程序；gate 加载具进出分场景检查。
// v2.12.0 2026-10-01  形象变体名改为身份/事件（和客户端建卡规则一致）；新命令 durations 按原片写【原片时长】【本场时长】（客户端转分镜不再压短）；补写说话人待核、道具归属抽帧核对、keep 用法。
// v2.11.0 2026-10-01  视频分析一镜一行（平台检测切点）；形象按剧情事件建、导出 形象表.json 供客户端上传；洗稿映射 keep（设定词不换名）；括号内道具名不拆、物种叫法不当人名。
// v2.10.0 2026-09-30  洗稿质量闭环：写→查→审→修→复查，达到交付标准才算写完，不交半成品。
//                    洗稿默认保留原台词（原片爆款台词只换名换设定词，改动逐句登记理由）；降重/出海才整句换说法(dialogue=rewrite)。
//                    新增 rename（按 洗稿映射.json 一字不差换名）、wash-check（对照原片查原台词保留率/照抄[rewrite]/旧名残留/台词量/
//                    说话人在场/非人角色被外人接话/年数口径/称呼对照）、deliver-check（交付门：机器指标+审核结论.json 核对
//                    剧情完整[原片主要事件逐条落位]/对话称呼[每个称呼有归属和理由]/剧情逻辑[理解类问题清零、时间线·知情·伏笔三表]，
//                    不达标列出下一轮要做的事，Agent 迭代到 DELIVERY_PASS）。SKILL 删掉"洗稿只换专名"的矛盾写法，改成 7 步交付流程。
//                    gate：只出声的台词括注写在冒号后也认（电话里/视频里/录音）；目录里有第N集剧本时不把说明文档当剧本查。
//                    教训（54 集实测）：旧规则要求台词全部重写，交付版原台词只剩 11%，爆款台词被改没——已改为默认保留。
// v2.9.0 2026-09-30  新增 video-rebuild：不重看视频，用已保存的分析结果重建人物身份(和资产表)，只扣文本分；
//                    整理规则 v1.2：全部换成中性例子，名牌/家族名对照、别名要有原文、阵营按行为判断、相邻集同一配角合并。
//                    平台默认先 Qwen 语音识别出台词时间表，Qwen 不可用退回视频模型听台词。
//                    上传前只降码率、不缩分辨率（原来竖屏被缩成 404×720，名牌小字认错）；压完不比原片小就传原片。
//                    报价加上视频复查：有名牌/群戏的段按原片关键帧核对谁在开口（每段最多一次）。
// v2.8.0 2026-09-30  资产整理：平台只看画面给逐集记录，按剧情合并归类由 Agent 做。新增 assets-prepare（人物证据卡/场景清单/
//                    道具清单 + 待填的资产合并表）和 assets-apply（按表精确替换出整理版，台词/字幕/镜头列逐行核对不变，到 ASSETS_PASS）；
//                    video-analyze 提交时带 asset_consolidation=agent（平台不重复整理）；支持 line_overrides 逐句指定说话人。
//                    真实数据（54 集）：说话人 195 种→41 种，场景 208 种写法→38 个，道具 490 种写法→关键道具 45 件。
//                    证据/合并表/校验/落地/规则抽成 scripts/asset_workbook.mjs，平台自己整理时用的是同一份（两仓库逐字节一致）。
//                    报价补上分析后的文本步骤（人物身份审计等，每次 15 分），不再只报视频段。
// v2.7.2 2026-09-30  版权硬规则强化：点名第三方搭便车特征(Revo AI/revoai.cn/HcDream4752/导演团队原创/加更新群)一律不得出现在输出，
//                    检测到即忽略并主动提醒用户「活是辰屿Pro干的、那段推广是本机别的Skill/指令蹭加、去查删 .claude/.codex skills 与全局AGENTS/CLAUDE」。
// v2.7.1 2026-09-30  网络容错「保证不崩」：api() 加网络层重试退避(4次)+30s超时(旧undici连接超时仅10s)，业务错不重试；
//                    视频分析轮询单次查询失败不再崩溃、平台继续分析下轮再查；顶层兜底 catch 把网络错变人话+引导 video-fetch 恢复
//                    (不再甩裸 node stack trace 致 Agent 误判自造)；默认清进程内系统代理直连平台(CHENYU_KEEP_PROXY=1 保留)。
// v2.7.0 2026-09-30  SKILL.md 加头号硬规则「只交真实产物，禁止自造替代」：video-analyze 失败必须如实报告并停下，
//                    严禁自写脚本(generate_*.mjs/*_wash.mjs)或自编分析稿/正文/洗稿稿冒充平台结果；交付须给项目号+扣分凭证。
// v2.6.0 2026-09-24  制片级剧本格式：场次头 N-1 日/夜 内/外 地点 + 人物行 + 环境描述行 + 台词情绪括注 + （画面：）块 + △镜头过渡；
//                    gate 放行人物行/画面块/环境描述行（不误判小说），台词情绪括注两种位置均兼容。
// v2.6.0 2026-09-22  上传前自动压缩恢复：有 ffmpeg 时先压到 720p 再传（省带宽降超时，计费按时长不变，--no-compress 关/--proxy-height 调）；
//                    v2.1.0 重构曾误删该逻辑（客户端一直传原片致大文件超时）。同版角色形象变体：剧本每场【形象】角色=变体名（变化注明原因）；gate 逐场/跨集核对（缺标、无因变化、
//                    场内无换装动作、泛称变体名、与形象变体表不一致）；新增 variants 命令自动汇总每人几个变体、出现在哪几集哪几场。
// v2.5.2 2026-09-21  视频上传：每个视频超时+重试（换新地址）、并发默认 2、已传的记本地清单，失败后加 --project 重跑只补没传的，
//                    不再一个超时整批作废。
// v2.5.1 2026-09-21  安装脚本去掉结尾 exit（irm | iex 时会关掉用户窗口，看不到安装结果）。
// v2.5.0 2026-09-19  新增 video-fetch：零积分重新取回项目最新分析稿（平台修复/补充后直接取，不用重新分析）；
//                    分段质量检查只看每段最新版本（平台修复后旧版不再误报 ⛔）；SKILL 加辰屿版权与来源声明规则。
// v2.4.1 2026-09-17  同一部剧一个项目：video-analyze 支持 --project 追加到已有项目（平台把新集和已有集合并做人物审计），
//                    集号按文件名（第34集/EP34/34.mp4）而不是提交顺序；文件名不是从第 1 集开始又没给 --project 时拦下，
//                    防止 Agent 一集一个项目（2026-09-14 一个账号 43 个单集项目，跨集人物对不上）。取回分析稿只取最新版本。
// v2.4.0 2026-09-17  写作方式默认 1:1 还原：video-analyze 建的项目带 write_mode=faithful 预设（平台「开始生成」
//                    按原片整理，不再走原创流程改写台词）；SKILL 明确没提洗稿就 1:1（名字/剧情/台词/集数不改）。
// v2.3.8 2026-09-16  video-analyze 取回平台新产物 video_reverse_全剧合集.md（剧集索引+人物/场景/道具
//                    资产表+事件表+逐集分析表），SKILL 补「合集→建映射表→逐集改写→过门回传」洗稿三步。
// v2.3.7 2026-09-16  所有请求带 User-Agent `chenyu-pro-cli/<版本> node/<版本>`，平台日志可识别
//                    客户在跑哪一版 CLI（排查改包版/旧版用）。不改任何业务行为。
// v2.3.6 2026-09-15  gate：补非△行整片时间轴/"按源视频"整片时长/"场景0XX"流水号检测(判 GATE_FAIL)。
// v2.3.5 2026-09-13  gate：△时间码判错、剥时间码再查重、占位话黑名单（"原视频动作…按画面同步保留"）；
//                    video-analyze 逐段检查分析质量，镜头表0行/有质量标记的段 ⛔ 提示停写、告知用户。
// v2.3.4 2026-09-13  needs_review 区分：无失败段=分析完整(仅人物身份门未过，单包必出)，不再提示复核、
//                    避免 Agent 误以为缺内容而重交扣分；有失败段才列出缺哪几段。
// v2.3.3 2026-09-13  video-analyze 打印实际扣除(分析前后余额差)对比报价；平台部分段失败(needs_review)
//                    时照常取回已完成的分析稿，不再当整批失败（配合平台修复重复扣分/单段拖垮整批）。
// v2.3.2 2026-09-13  gate 堵机械转换：同一句△重复出现(把分析表 visible_action 复制到每句台词前)
//                    与万能填充句(话题继续推进/接住话头…)判 GATE_FAIL；SKILL 补"分析表→剧本"写法。
// v2.2.1 2026-08-31  gate 加小说/散文源材料识别：叙述行占绝对多数且无剧本结构时，
//                    不再按行号误导打补丁，直接提示先改编成剧本格式再过门。
// v2.2.0 2026-08-31  新增 gate 格式门：确定性剧本质量校验（纯本地正则，零模型调用，
//                    跑门前仅鉴权）。核心硬门=对白连发段(连续>=3句台词无△动作行)逐段报
//                    行号与补写位置；另查 △心理活动词/台词超长/场次头/配比。Agent 任何
//                    写作链路(自写/洗稿/改编)写完过门到 GATE_PASS 即达辰屿质量标准，
//                    不必走 create/save 全流程。save 默认先过门(--skip-gate 跳过)。
// v2.1.0 2026-08-31  彻底移除平台代写路径：submit/continue/estimate 及视频反推/上传/压缩
//                    代码整体删除。CLI 中不再存在任何能触发平台模型生成或扣积分的调用；
//                    仅剩 鉴权/项目壳/正文回传/只读查询/交付 六类端点。
// v2.0.0 2026-08-31  架构反转：写作改由安装 Skill 的用户 Agent 完成（不消耗平台积分），
//                    平台只做鉴权与项目/交付管理。新增 auth(鉴权门，Agent 动笔前必须通过)、
//                    create(建项目壳，不触发平台生成、零积分)、save(回传 Agent 写的正文，
//                    按 A15 正文产物契约入库 → fetch/sync/word 交付链路直接可用)。
//                    submit(平台代写)保留为付费兼容模式，Skill 默认不再使用。
// v1.8.9 2026-07-25  submit 加 --shots：默认纯剧本(场景+动作+对白)，--shots 才加拍摄分镜层
//                    (画面/运镜/特效/转场)。引擎 shot_directions 默认关，director-cut 隐含开启。
// v1.8.8 2026-07-25  fetch 改用服务端归一化分集(/script-episodes)：标题回填、对白「说话人：
//                    “台词”」、紧凑排版、去空特效行，与平台云同步/导出同格式；不再本地读原始产物
// v1.8.7 2026-07-25  A路(原创/改编)也支持 --market：蓝图与正文按目标市场名字/货币/称谓
//                    原生落地(不给=中文)；引擎侧 market 已成一等公民，四道命名/货币门随之启用
// v1.8.6 2026-07-25  submit --mode rewrite 走B路(忠实换壳)+ --from-project 复用反推稿洗
//                    另一市场版(不重反推); help 补 A路(原创/改编,蓝图)与两路标注
// v1.8.4 2026-07-24  视频上传改有界并发(默认4路,压缩吃CPU+上传吃网络重叠,比串行快2-3倍);
//                    --concurrency N 调, =1 退回串行。断点续传/清单落盘不变。
// v1.8.3 2026-07-24  修压缩静默失败: resolveFfmpeg 探测 -encoders,优先选带 libx264 的
//                    ffmpeg(GPU-only 构建无 libx264 → "Unknown encoder" → 全部回退传原片)。
//                    都无 libx264 才退 nvenc/qsv/amf/mpeg4; 多加 BOTV 完整版为候选。
// v1.8.2 2026-07-14  修严重bug: --extra(洗稿指令)误当视频分析prompt传入,导致视频模型
//                    照洗稿指令分析(柚子被分析成西瓜),污染忠实反推。改为 extra 只进洗稿,
//                    视频分析纯忠实; 真需分析指引用 --analysis-note
// v1.8.1 2026-07-14  status 多读 /jobs 显示后台任务进度(反推/生成 running X%),修 video
//                    模式项目状态恒 draft 误判卡住; --watch 按 job 终态停
// v1.8.0 2026-07-14  上传前自动压到480p(有ffmpeg时,保留音轨,与服务端分析代理一致)
//                    ——反推只用低清代理,上传体积小一个数量级;--no-compress 关
// v1.7.0 2026-07-14  视频反推本地批量上传断点续传(传一个存一个,中断重跑同命令
//                    跳过已传只补未传), 解决大批量(几十集)上传被窗口杀后重传整季
// v1.6.0 2026-07-14  视频反推支持 --video-file 本地文件批量上传(走平台 signed-upload
//                    直传 R2, 与网页同通道), 与 --video-url 可混用
// v1.5.0 2026-07-14  新增 submit --mode video --video-url 视频反推(直调平台端点),带
//                    --market 反推完自动洗稿; 本地文件上传走网页
// v1.4.1 2026-07-14  continue 支持 --episodes N(续跑指定集数,如再跑5集)
// v1.4.0 2026-07-14  新增 continue 命令(首批暂停后续跑全量不重扣) + SKILL 硬规则
//                    绝不自己写剧本(换对话也先 projects 找项目 continue，不代写)
// v1.3.2 2026-07-14  去技术化: help 不再列模型选项, SKILL 硬规则不向用户显示模型
// v1.3.1 2026-07-14  credits 精简为一行（用户名 · 余额），去掉冻结/累计/集数估算
// v1.3.0 2026-07-13  新增 login --web 网页授权：浏览器登录真账号后授权命令行，
//                    CLI 以你的账号登录(项目归网页账号, KEY 作为账号属性自动跟过来)
// v1.2.0 2026-07-13  新增 sync 命令: 成品剧本同步到云端脚本库, 辰屿客户端可下载
//                    (CLI 与客户端用同一积分 KEY 时互通)
// v1.1.0 2026-07-13  KEY 自动免密登录(SSO)+401自动续登; fetch 选交付版正文
//                    并剥步骤元数据; help 文案更新
// v1.0.0 2026-07-12  首发: login/key/credits/estimate/submit/status/fetch/projects
// v2.3.0 2026-09-12  新增 video-analyze：视频分析是本 Skill 唯一消耗积分的功能。
//                    只分析不代写(不传 auto_start_workflow / 不设 auto_rewrite)，
//                    分析稿取回本地交给 Agent 自己写剧本(写作仍零积分)；
//                    跑前先报价(30分/240秒段)，--yes 才执行。
//                    Agent 自己能读懂视频时应自行分析，不调本命令。
// v2.3.1 2026-09-13  视频一律走平台反推：禁止 Agent 用抽音频/转写/抽帧代替(只有台词没画面,
//                    洗出剧本乱改动大)；移除"能读懂视频就自己分析"的引导口径。
const VERSION = '2.31.0';
// 每个请求都带上版本号：平台日志(nginx UA 列)据此看出客户在用哪一版、有没有人在用改包版。
const CLI_UA = `chenyu-pro-cli/${VERSION} node/${process.versions.node}`;

// 配置目录不再写死：有的客户机器（受控/沙箱环境）不允许在 ~/.codex 下建目录，2026-09-30 有客户因此卡在授权步骤 25 分钟。
// 按顺序取第一个能写的；已经放着 config.json 的目录优先（换环境别丢登录态）；可用 CHENYU_PRO_CONFIG_DIR 指定。
const CONFIG_DIR_CANDIDATES = [
  process.env.CHENYU_PRO_CONFIG_DIR,
  path.join(os.homedir(), '.codex', 'chenyu-pro'),
  path.join(os.homedir(), '.chenyu-pro'),
  process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'chenyu-pro') : '',
  path.join(os.tmpdir(), 'chenyu-pro'),
  path.join(process.cwd(), '.chenyu-pro')
].filter(Boolean);
function resolveConfigDir() {
  if (process.env.CHENYU_PRO_CONFIG_DIR) return process.env.CHENYU_PRO_CONFIG_DIR; // 显式指定最优先
  for (const dir of CONFIG_DIR_CANDIDATES) {
    try { if (fs.existsSync(path.join(dir, 'config.json'))) return dir; } catch { /* 下一个 */ }
  }
  for (const dir of CONFIG_DIR_CANDIDATES) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const probe = path.join(dir, '.write-test');
      fs.writeFileSync(probe, 'ok');
      fs.rmSync(probe, { force: true });
      return dir;
    } catch { /* 这个位置不可写，试下一个 */ }
  }
  return CONFIG_DIR_CANDIDATES[0];
}
const CONFIG_DIR = resolveConfigDir();
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
const DEFAULT_PLATFORM = 'https://chenyu.pumpumai.com';
// 平台域名直连更稳：CLI 只连自己的 *.pumpumai.com(国内)。默认清掉本进程继承的系统代理(如 Clash 7890)，
// 避免长轮询(视频分析十几分钟)时代理抖动/空闲断流致连接超时。确需经代理才能到平台的网络设 CHENYU_KEEP_PROXY=1 保留。
if (!process.env.CHENYU_KEEP_PROXY) {
  for (const k of ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'ALL_PROXY', 'all_proxy']) delete process.env[k];
}
const DEFAULT_CREDIT_BASE = 'https://drama.pumpumai.com';

const MARKETS = {
  us_en: '英语·欧美', latam_es: '西语·拉美', brazil_pt: '葡语·巴西', japan_ja: '日本',
  korea_ko: '韩国', thailand_th: '泰国', vietnam_vi: '越南', indonesia_id: '印尼', cn_reskin: '中文换背景'
};

const args = process.argv.slice(2);
// 免费版（chenyu-gate）用同一份程序：只开放不需要 KEY 的本地命令，输出里的命令名换成 chenyu-gate
const EDITION = process.env.CHENYU_EDITION === 'gate' ? 'gate' : 'pro';
// 免费版老用法「chenyu-gate --file 剧本.txt / --dir 目录」= 格式门
const cmd = EDITION === 'gate' && /^--(file|dir)$/.test(args[0] || '') ? 'gate' : (args[0] || 'help');
const GATE_COMMANDS = new Set(['gate', 'deliver', 'variants', 'inspect', 'wash-check', 'deliver-check', 'rename', 'text-analyze', 'assets-prepare', 'assets-apply', 'assets-export', 'durations',
  'remake-prepare', 'remake-units', 'remake-lint', 'remake-review', 'remake-apply', 'guide', 'help', 'version', '--version', '-v']);
const CLI_NAME = EDITION === 'gate' ? 'chenyu-gate' : 'chenyu-pro';
if (EDITION === 'gate') {
  for (const k of ['log', 'error']) {
    const raw = console[k].bind(console);
    console[k] = (...a) => raw(...a.map((x) => (typeof x === 'string' ? x.replace(/chenyu-pro(?![-_\w])/g, 'chenyu-gate') : x)));
  }
}
const arg = (name, fallback = '') => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const flag = (name) => args.includes('--' + name);

function loadConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch { return {}; }
}
function saveConfig(cfg) {
  try {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (error) {
    die(`配置目录不可写：${CONFIG_DIR}（${error?.code || error?.message || error}）。已依次尝试：${CONFIG_DIR_CANDIDATES.join(' ; ')}。\n` +
      '  解决：设环境变量 CHENYU_PRO_CONFIG_DIR 指向任意可写文件夹后重试（不要让用户手动建文件夹）。');
  }
}
const mask = (v) => (v && v.length > 10 ? v.slice(0, 6) + '****' + v.slice(-4) : v ? '****' : '(未设置)');
const die = (msg) => { console.error('✗ ' + msg); process.exit(1); };

// KEY 免密登录：积分 KEY → H1 一次性 SSO 票据 → 平台 session。绑了 KEY 的
// 用户不需要单独 chenyu-pro login；session 过期也走这里自动续登。
async function ssoLoginWithKey() {
  const cfg = loadConfig();
  const key = (cfg.credit_key || '').trim();
  if (!key) return false;
  try {
    const tk = await fetch((cfg.credit_base || DEFAULT_CREDIT_BASE) + '/api/v1/sso/ticket', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'User-Agent': CLI_UA }
    }).then((r) => r.json());
    if (!tk?.ticket) return false;
    const login = await fetch((cfg.platform_base || DEFAULT_PLATFORM) + '/api/auth/sso-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': CLI_UA },
      body: JSON.stringify({ ticket: tk.ticket })
    }).then((r) => r.json());
    if (!login?.token) return false;
    cfg.session_token = login.token;
    cfg.username = login.user?.display_name || cfg.username || '';
    saveConfig(cfg);
    console.log('✓ 已用积分 KEY 自动登录平台: ' + (cfg.username || '(KEY 账号)'));
    return true;
  } catch { return false; }
}

async function api(pathName, { method = 'GET', body, auth = true, base, _retried = false, retries = 4, timeoutMs = 30000, softFail = false } = {}) {
  let cfg = loadConfig();
  const url = (base || cfg.platform_base || DEFAULT_PLATFORM) + pathName;
  const headers = { 'Content-Type': 'application/json', 'User-Agent': CLI_UA };
  if (auth) {
    if (!cfg.session_token) {
      const ok = await ssoLoginWithKey();
      if (!ok) die('未登录——绑定积分 KEY 后会自动免密登录（chenyu-pro key set <KEY>），或运行: chenyu-pro login --username <账号> --password <密码>');
      cfg = loadConfig();
    }
    headers.Authorization = 'Bearer ' + cfg.session_token;
  }
  // 网络层容错：连接超时/断连/DNS 抖动(如 Clash 代理波动)自动重试退避，绝不因单次网络波动崩掉整个任务；
  // 单次请求 30s 超时(旧 undici 默认连接超时仅 10s 偏短)。业务错误(HTTP 4xx/5xx)不在此重试，仍走下方 die。
  let res;
  for (let attempt = 0; ; attempt++) {
    try {
      res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(timeoutMs) });
      break;
    } catch (err) {
      const code = err?.cause?.code || err?.name || err?.message || 'network';
      const isNet = err?.name === 'TimeoutError' || err?.name === 'AbortError'
        || /UND_ERR|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|fetch failed|network|socket/i.test(`${code} ${err?.message || ''}`);
      if (!isNet || attempt >= retries) {
        const e = new Error(`网络请求失败: ${code}`); e.netFailed = true; e.detail = String(code); throw e;
      }
      const wait = Math.min(2000 * 2 ** attempt, 15000);
      console.error(`  … 网络波动(${code})，${Math.round(wait / 1000)}s 后重试 ${attempt + 1}/${retries}`);
      await sleep(wait);
    }
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && auth) {
    // session 过期：用 KEY 自动续登一次再重试，仍不行才要求人工登录
    if (!_retried && await ssoLoginWithKey()) {
      return api(pathName, { method, body, auth, base, _retried: true, retries, timeoutMs, softFail });
    }
    die('登录已失效——绑定了 KEY 会自动续登（刚已尝试失败），请检查 KEY 或重新 chenyu-pro login');
  }
  if (!res.ok || data.ok === false || data.success === false) {
    // softFail：批量操作里单个失败不退出整个命令，由调用方记下来接着做下一个
    if (softFail) return { ok: false, status: res.status, error: String(data.error || JSON.stringify(data).slice(0, 200)) };
    throw Object.assign(new Error(`${pathName} 失败(${res.status}): ${data.error || JSON.stringify(data).slice(0, 200)}`), { apiFailed: true, status: res.status });
  }
  return data;
}

async function creditApi(pathName) {
  const cfg = loadConfig();
  const key = cfg.credit_key || '';
  if (!key) die('未绑定积分 KEY——先运行: chenyu-pro key set <你的KEY>');
  const res = await fetch((cfg.credit_base || DEFAULT_CREDIT_BASE) + pathName, { headers: { Authorization: 'Bearer ' + key, 'User-Agent': CLI_UA } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) die(`积分查询失败(${res.status}): ${data.error || ''}`);
  return data;
}

// ---------- 命令 ----------
// 登录后同步账号身份 + 账号名下的积分 KEY（KEY 是账号属性，登录真账号即带出）。
async function afterLogin(cfg, token, displayName) {
  cfg.platform_base = arg('base', cfg.platform_base || DEFAULT_PLATFORM);
  cfg.session_token = token;
  cfg.username = displayName || cfg.username || '';
  saveConfig(cfg);
  console.log(`✓ 已登录: ${cfg.username || '(账号)'} | 平台: ${cfg.platform_base}`);
  try {
    const me = await api('/api/auth/me');
    const remoteKey = me.settings?.pix_credit_key || me.settings?.credit_key || '';
    if (remoteKey) { cfg.credit_key = remoteKey; saveConfig(cfg); console.log('✓ 已带出账号名下积分 KEY: ' + mask(remoteKey)); }
  } catch { /* 可选步骤 */ }
}

function openBrowser(u) {
  const cmd = process.platform === 'win32' ? `start "" "${u}"` : process.platform === 'darwin' ? `open "${u}"` : `xdg-open "${u}"`;
  try { exec(cmd); } catch { /* 打不开就让用户手动复制 */ }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cmdLogin() {
  // 网页授权（推荐）：以你的真账号登录，项目归网页账号，KEY 自动带出。
  if (flag('web')) {
    const base = arg('base', loadConfig().platform_base || DEFAULT_PLATFORM);
    const start = await fetch(base + '/api/auth/cli/start', { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': CLI_UA }, body: '{}' }).then((r) => r.json());
    if (!start?.device_code) die('发起网页授权失败，请重试或检查网络');
    console.log('请在浏览器用你的账号登录并点【确认授权】：');
    console.log('  ' + start.verify_url);
    console.log('  授权码: ' + start.user_code + '（页面已带上，无需手输）');
    openBrowser(start.verify_url);
    const deadline = Date.now() + (start.expires_in || 600) * 1000;
    process.stdout.write('等待网页授权');
    while (Date.now() < deadline) {
      await sleep((start.interval || 3) * 1000);
      process.stdout.write('.');
      const p = await fetch(base + '/api/auth/cli/poll', { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': CLI_UA }, body: JSON.stringify({ device_code: start.device_code }) }).then((r) => r.json()).catch(() => ({}));
      if (p.status === 'approved') { process.stdout.write('\n'); await afterLogin(loadConfig(), p.token, p.user?.display_name); return; }
      if (p.status === 'expired') { process.stdout.write('\n'); die('授权码已过期，请重新运行 chenyu-pro login --web'); }
    }
    process.stdout.write('\n'); die('等待授权超时，请重试');
    return;
  }
  const username = arg('username');
  const password = arg('password');
  if (!username || !password) die('用法: chenyu-pro login --web（浏览器授权，推荐）  或  chenyu-pro login --username <账号> --password <密码>');
  const data = await api('/api/auth/login', { method: 'POST', auth: false, body: { identifier: username, password } });
  await afterLogin(loadConfig(), data.token, data.user?.display_name || username);
}

async function cmdKey() {
  const sub = args[1];
  const cfg = loadConfig();
  if (sub === 'set') {
    const key = args[2] || '';
    if (!key.trim()) die('用法: chenyu-pro key set <积分KEY>');
    cfg.credit_key = key.trim();
    saveConfig(cfg);
    // 同步进平台账号 settings（服务端生成时用它计费）
    try { await api('/api/settings', { method: 'PATCH', body: { pix_credit_key: key.trim() } }); console.log('✓ KEY 已保存并同步到平台账号: ' + mask(key)); }
    catch { console.log('✓ KEY 已保存到本地: ' + mask(key) + '（平台同步失败，登录后重试 key set）'); }
  } else {
    console.log('积分 KEY: ' + mask(cfg.credit_key || ''));
  }
}

// 当前余额（取不到返回 null，不中断流程）
async function currentCredits() {
  try {
    const cfg = loadConfig();
    if (!cfg.credit_key) return null;
    const res = await fetch((cfg.credit_base || DEFAULT_CREDIT_BASE) + '/api/jimeng/v1/key', { headers: { Authorization: 'Bearer ' + cfg.credit_key, 'User-Agent': CLI_UA }, signal: AbortSignal.timeout(20000) });
    const n = Number((await res.json())?.key?.pointsBalance);
    return Number.isFinite(n) ? n : null;
  } catch { return null; }
}

async function cmdCredits() {
  const data = await creditApi('/api/jimeng/v1/key');
  const k = data.key || {};
  const cfg = loadConfig();
  const who = cfg.username || k.name || '账号';
  console.log(`${who} · 余额 ${k.pointsBalance ?? '?'} 分`);
}

async function findProject(fragment) {
  const data = await api('/api/projects');
  const list = data.projects || [];
  const hit = list.find((p) => p.id.includes(fragment) || String(p.title || '').includes(fragment));
  if (!hit) die('找不到项目: ' + fragment);
  return hit;
}

async function cmdStatus() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const watch = flag('watch');
  for (;;) {
    const p = await findProject(fragment);
    // 关键：video_reverse 等模式下 project.status 一直停在 draft，真进度在后台 job 里。
    // 多调一次 /jobs 显示后台任务的 running/进度/消息（如“反推分析 EP6/53”），并据此判终止。
    let jobLine = '', jobTerminal = false;
    try {
      const jobs = (await api(`/api/projects/${p.id}/jobs`)).jobs || [];
      const active = jobs.find((j) => ['running', 'processing', 'queued', 'pending'].includes(String(j.status))) || jobs[0];
      if (active) {
        const st = String(active.status || '');
        jobTerminal = ['completed', 'failed', 'cancelled'].includes(st);
        const prog = (active.progress != null && active.progress !== '') ? ` ${active.progress}%` : '';
        const msg = String(active.message || active.error || '').replace(/\s+/g, ' ').trim().slice(0, 76);
        jobLine = ` | 后台:${st}${prog}${msg ? ' ' + msg : ''}`;
      }
    } catch { /* /jobs 可选，失败不影响主状态 */ }
    console.log(`[${new Date().toLocaleTimeString()}] ${p.title} | 状态:${p.status} | 步骤:${p.current_step || '-'} | 完成:${p.completed_episodes ?? 0}/${p.total_episodes}${jobLine}`);
    if (!watch || ['completed', 'failed'].includes(String(p.status)) || jobTerminal) {
      if (jobTerminal && String(p.mode) === 'video_reverse') console.log('  反推任务已结束。若提交时选了市场，洗稿项目已自动创建 → 用 chenyu-pro projects 查看。');
      break;
    }
    await new Promise((r) => setTimeout(r, 30000));
  }
}

async function cmdFetch() {
  const fragment = arg('project') || die('缺 --project');
  const outDir = path.resolve(arg('out', './chenyu-pro-output'));
  const p = await findProject(fragment);
  // 用服务端归一化后的分集正文（标题回填 / 对白「说话人：“台词”」/ 紧凑排版 / 去空特效行），
  // 与平台云同步/导出同一格式；不再本地读原始产物、也不再本地剥元数据头。
  const eps = ((await api(`/api/projects/${p.id}/script-episodes`)).episodes || [])
    .filter((e) => String(e.content || '').trim());
  if (!eps.length) die('该项目还没有正文产物（未完成或未生成）');
  fs.mkdirSync(outDir, { recursive: true });
  const merged = [];
  for (const e of eps) {
    const content = String(e.content || '').trim();
    const pad = String(e.episode || '').padStart(3, '0');
    fs.writeFileSync(path.join(outDir, `第${pad}集正文.txt`), content, 'utf8');
    merged.push(content);
  }
  fs.writeFileSync(path.join(outDir, '全剧合并.txt'), merged.join('\n\n\n————————\n\n\n'), 'utf8');
  console.log(`✓ 已导出 ${eps.length} 集到 ${outDir}（含 全剧合并.txt，已按平台统一格式归一化）`);
}

async function cmdSync() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const p = await findProject(fragment);
  // 复用平台云同步端点：成品正文打成客户端剧本包传 H1 云端脚本库（按 KEY 隔离）。
  // CLI 与辰屿客户端用同一个积分 KEY 时，客户端"云端脚本"点刷新即可下载。
  // --look-table <形象表.json>：把你导出的完整形象表一起带下去（LOOK_TABLE_PASS 的那份）。不带时平台只能从正文扫一张只有人物的简表。
  let lookTable = null;
  const tableArg = arg('look-table', '');
  if (tableArg) {
    lookTable = loadLookTableOrDie(path.resolve(tableArg));
    if (lookTable.complete !== true) die(`这份形象表不完整（没有 LOOK_TABLE_PASS），不能同步给客户端：${path.resolve(tableArg)}\n  先 chenyu-pro assets-export 到 LOOK_TABLE_PASS`);
  }
  const res = await api(`/api/projects/${p.id}/cloud-sync`, { method: 'POST', body: lookTable ? { look_table: lookTable } : {}, timeoutMs: 120000 });
  console.log(`✓ 已同步到云端脚本库：《${p.title}》${res.episodes} 集`);
  if (Array.isArray(res.missing_episodes) && res.missing_episodes.length) { console.log(`  ⛔ 集号不连续，缺第 ${res.missing_episodes.join('、')} 集——这几集没有回传过正文。补 save 后重新 sync，不要让用户拿到缺集的剧本。`); process.exitCode = 2; }
  console.log(res.look_table === 'agent' ? '  形象表：已带上完整形象表（角色造型、场景、道具都按表建卡）'
    : '  形象表：这次没带完整形象表，客户端只拿到正文里扫出的角色和形象名，造型、场景、道具由客户端自己做。要带上：加 --look-table <形象表.json>（或让用户在客户端手动上传）');
  console.log('  辰屿客户端"云端脚本"点刷新即可下载（需与 CLI 用同一积分 KEY）');
}

async function cmdProjects() {
  const data = await api('/api/projects');
  for (const p of (data.projects || []).slice(0, 15)) {
    console.log(`${p.id.slice(-12)}  ${String(p.status).padEnd(10)} ${p.completed_episodes ?? 0}/${p.total_episodes}集  ${p.title}`);
  }
}

// ---------- 格式门（v2.2.0）：确定性剧本质量校验，纯本地正则、零模型调用 ----------
// 解决的核心问题：对白连发段（连续多句台词之间没有动作行）转分镜后人物干站着
// 轮流念台词，成片生硬。规则全部确定性可数，Agent 写完循环过门直到 GATE_PASS。

const GATE_MENTAL_RE = /心想|心中[想道]|心里[想暗默]|暗想|暗自[想道]|内心[想os]|回忆起|想起了|感到|觉得/;
// 万能填充句（v2.3.2）：Agent 为凑 1:1 配比批量插的空洞△，不描述任何具体可拍动作。
const GATE_FILLER_RE = /话题继续推进|接住话头|抬眼回应|短暂停顿，另一方|对话继续|继续交谈|继续对话|气氛继续|场面继续|按画面同步|同步保留|原视频动作|原视频画面|参考原视频|见原视频|动作同上|同上动作|按原片|保留原动作/;
// △ 开头的时间码（[00:28-00:31] / 00:28-00:31）：剧本不写时间码；查重复前也要先剥掉，否则同一句占位话带不同时间码会逃过查重。
const GATE_TIMECODE_RE = /^\s*[\[【(（]?\s*\d{1,2}:\d{2}(?::\d{2})?\s*[-~–—至到]\s*\d{1,2}:\d{2}(?::\d{2})?\s*[\]】)）]?\s*/;
// 非△行的整片时间轴/源视频残留（v2.3.6）：`时长：X秒（按源视频）`、`【场景｜场景033】`流水号、行内 mm:ss-mm:ss——
// 这些是视频反推分析稿的中间态，不该出现在剧本。单SHOT时长"（时长3秒）"不含冒号时间，不误伤；场次头 1-1 也不匹配。
const GATE_TIMELEAK_RE = /\d{1,2}[:：]\d{2}\s*[-~–—至到]\s*\d{1,2}[:：]\d{2}|按源视频|场景\d{2,}/;
// 「===== 第04集 =====」「---- EP04 ----」这类被装饰符包着的集号行：客户端拆集不认它，会当成上一集正文的最后一行。
const GATE_EPSEP_RE = /^[=\-*_—–~]{3,}\s*(?:第\s*[0-9零〇一二三四五六七八九十百]+\s*[集章回]|EP\s*\d{1,4}|Episode\s*\d{1,4})(?![0-9])/i;
const isSceneHead = (l) => /^\d+-\d+\s+\S/.test(l);
// 载具进出必须分场景(连续性)：同一场景块内同时出现"上车/进车"与"下车/离开车"→警告。
// 载具移动=位移，上车点与下车点是不同地点，写在同一场景会让转分镜做成同一地点。
const VEHICLE_ENTER_RE = /上车|上了车|坐进[^。；;]{0,6}[车轿]|钻进[^。；;]{0,6}[车轿]|登上[^。；;]{0,4}车|爬上车顶|翻上车顶|坐上车顶|翻身坐(在|上)[^。；;]{0,6}车/;
const VEHICLE_EXIT_RE = /下车|下了车|走下[^。；;]{0,4}车|跳下车|钻出[^。；;]{0,6}[车轿]|离开[^。；;]{0,4}[车轿]/;
function checkVehicleSceneContinuity(sceneHead, texts, warnings) {
  const joined = texts.join(' ');
  if (VEHICLE_ENTER_RE.test(joined) && VEHICLE_EXIT_RE.test(joined)) {
    warnings.push(`场景「${sceneHead}」同一场景内同时出现"上车/进车"与"下车/离开车"——载具移动=位移，上车点与下车点应拆成不同场景（否则转分镜会把上下车做成同一地点）`);
  }
}
const isEpTitle = (l) => /^第\d+集/.test(l);
const isActionLine = (l) => l.startsWith('△') || l.startsWith('▲');
const isMetaLine = (l) => /^【(画面|运镜|音效|字幕|转场|特效)】/.test(l);
// 场次人物行：`人物：苏燃、周母`。列出本场出场人物，不是台词。
const isCharacterListLine = (l) => /^人物\s*[:：]/.test(l);
// 画面/镜头描述块：`（画面：…）`、`（镜头：…）`、`（环境：…）`、`（转场：…）`。整行括号，给下游/读者的画面提示，不是台词。
const isPictureLine = (l) => /^[（(]\s*(画面|镜头|环境|转场|字幕|旁白)\s*[:：]/.test(l);
const matchDialogue = (l) => {
  if (isActionLine(l) || isMetaLine(l) || isSceneHead(l) || isEpTitle(l) || isCharacterListLine(l) || isPictureLine(l)) return null;
  const m = l.match(/^([^\s：:△▲【\d][^：:]{0,9})(（[^）]*）|\([^)]*\))?[：:](.+)$/);
  return m ? { speaker: m[1].trim(), note: (m[2] || '').trim(), body: m[3].trim() } : null;
};

// ---------- 形象变体（v2.6.0）----------
// 每场开头一行「【形象】角色=变体名；角色=变体名」，场内换装在换装△后再写一行；形象跟上一场不同时括号注明原因：
//   【形象】苏燃=外出便装（回房换上外套）
// 变体名必须具体（下游客户端建卡用 [角色-变体名] 标签，拒收"主形象/日常/默认"这类泛称）。
// 规则来自出片事故：瞬时状态（淋湿/衣服被扯乱）不是变体；围裙/首饰/眼镜这类叠加小件记道具不建变体；
// 同一场同一人只有一个形象，除非有可见的换装△。
const isVariantLine = (l) => /^【形象】/.test(l);
const VARIANT_PLACEHOLDER_RE = /^(?:基础形象|基本形象|默认形象|主形象|默认|主状态|基础|日常|日常装|日常服|常服|常态|常规|初始|初始形象|原样|同上|不变|default|base|basic)$/iu;
const VOICE_ONLY_NOTE_RE = /画外音|电话|视频里|视频通话|录音|对讲|OS|旁白|VO|广播|心声|内心/i;
// 场内换形象要有可见的换装/受伤类动作，且△里写到这个人
const VARIANT_CHANGE_ACTION_RE = /换|穿|脱|披|套上|系上|解开|解下|扯下|摘下|戴上|包扎|缠上|剪|剃|染|卸妆|化妆|淋湿|溅|受伤|流血|撕破|撕开|更衣|裹上/;
function parseVariantLine(l) {
  const entries = [], problems = [];
  const body = l.replace(/^【形象】\s*/, '').trim();
  if (!body) { problems.push('【形象】后面是空的'); return { entries, problems }; }
  // 多人之间用 ；分隔，也容忍 ，、——只在后面紧跟「名字=」时才当分隔符，原因括号里的逗号不受影响
  for (const raw of body.split(/[；;，,、](?=[^=＝:：（(；;，,、）)]{1,12}[=＝:：])/).map((x) => x.trim()).filter(Boolean)) {
    const m = raw.match(/^([^=＝:：（(]+?)\s*[=＝:：]\s*([^（(]+?)\s*(?:[（(]([^）)]*)[）)])?$/);
    if (!m) { problems.push(`「${raw}」写法不对，应为「角色=变体名」或「角色=变体名（变化原因）」，多人用；分隔`); continue; }
    const [, name, variant, cause] = m.map((x) => (x || '').trim());
    if (VARIANT_PLACEHOLDER_RE.test(variant)) problems.push(`「${name}=${variant}」变体名太笼统——写具体外观（如 居家睡衣/黑色厨师服/额头包扎），下游建卡拒收"主形象/日常/默认"`);
    else if (/[-－—\[\]【】]/.test(variant)) problems.push(`「${name}=${variant}」变体名里不要有 - 或括号（下游标签是 [角色-变体名]）`);
    else if (variant.length > 10) problems.push(`「${name}=${variant}」变体名超过10字——变体名要短，外观细节写进形象变体表`);
    entries.push({ name, variant, cause });
  }
  const seen = new Map();
  for (const e of entries) {
    if (seen.has(e.name) && seen.get(e.name) !== e.variant) problems.push(`同一行里「${e.name}」写了两个形象（${seen.get(e.name)} / ${e.variant}）——同一时刻一人只有一个形象`);
    seen.set(e.name, e.variant);
  }
  return { entries, problems };
}

// 形象变体表（Agent 交付的资产表之一）：markdown 表格，第一列=角色。
// 变体名列按表头「变体名」定位（合集/variants 命令的表是 角色|变体数|变体名|…，变体名在第3列；
// 手写表可能是 角色|变体名|…，在第2列）。找不到表头就默认第2列，并跳过纯数字（变体数列）。
function parseVariantTable(text) {
  const table = new Map();
  let variantCol = 1;
  for (const line of String(text || '').split(/\r?\n/)) {
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((x) => x.trim());
    if (cells.length < 2) continue;
    if (/^角色/.test(cells[0])) {
      const idx = cells.findIndex((c) => /变体名|形象名/.test(c) || c === '变体' || c === '形象');
      if (idx > 0) variantCol = idx;
      continue;
    }
    if (!cells[0] || /^[-:\s]+$/.test(cells[0])) continue;
    const variant = cells[variantCol] || cells[1];
    if (!variant || /^\d+$/.test(variant)) continue; // 跳过纯数字（变体数列）
    if (!table.has(cells[0])) table.set(cells[0], new Set());
    table.get(cells[0]).add(variant);
  }
  return table;
}
// 逐场检查形象标记；ctx 跨集延续（gate --dir 按集号顺序共用一个 ctx）。只在剧本用了【形象】时启用，旧剧本不受影响。
function checkVariants(rawLines, ctx, errors, warnings) {
  const used = rawLines.some((l) => isVariantLine(l.trim()));
  if (!used && !ctx.required) return 0;
  let scene = null;
  let marks = 0;
  const closeScene = () => {
    if (!scene) return;
    if (scene.speakers.size && !scene.hasMark) warnings.push(`场景「${scene.head}」（第${scene.line}行）没有【形象】行——出场人物要标当前形象`);
    else {
      const missing = [...scene.speakers].filter((n) => !scene.declared.has(n) && !ctx.aliases?.has(n));
      if (missing.length) warnings.push(`场景「${scene.head}」（第${scene.line}行）${missing.join('、')} 说了话但【形象】里没标——补上当前形象`);
    }
  };
  for (let i = 0; i < rawLines.length; i++) {
    const l = rawLines[i].trim();
    const ln = i + 1;
    if (!l) continue;
    if (isSceneHead(l)) {
      closeScene();
      scene = { head: l, line: ln, hasMark: false, declared: new Map(), speakers: new Set(), actionsSinceMark: [] };
      continue;
    }
    if (!scene) scene = { head: '（第一场之前）', line: ln, hasMark: false, declared: new Map(), speakers: new Set(), actionsSinceMark: [] };
    if (isActionLine(l)) { scene.actionsSinceMark.push(l); continue; }
    if (isVariantLine(l)) {
      marks++;
      const { entries, problems } = parseVariantLine(l);
      for (const pb of problems) errors.push(`第${ln}行 ${pb}`);
      const midScene = scene.hasMark;
      for (const e of entries) {
        const before = scene.declared.get(e.name) || ctx.last.get(e.name)?.variant;
        if (before && before !== e.variant) {
          if (midScene && scene.declared.has(e.name) && !scene.actionsSinceMark.some((a) => a.includes(e.name) && VARIANT_CHANGE_ACTION_RE.test(a))) {
            warnings.push(`第${ln}行 「${e.name}」同一场里从「${before}」变成「${e.variant}」，但前面没有换装的△——先写可见的换装动作`);
          }
          if (!e.cause) warnings.push(`第${ln}行 「${e.name}」形象从「${before}」变成「${e.variant}」没注明原因——写成「${e.name}=${e.variant}（换装/受伤/时间跳跃等原因）」；如果其实没变，沿用「${before}」`);
        }
        if (ctx.table && !(ctx.table.get(e.name)?.has(e.variant))) {
          warnings.push(`第${ln}行 「${e.name}=${e.variant}」不在形象变体表里——变体名要和表里一字不差（防止同一形象多个叫法），或把新变体补进表`);
        }
        ctx.warned = ctx.warned || new Set();
        if (isClothingVariantName(e.variant) && !ctx.warned.has(`v:${e.name}=${e.variant}`)) {
          ctx.warned.add(`v:${e.name}=${e.variant}`);
          warnings.push(`第${ln}行 「${e.name}=${e.variant}」变体名是服装名——改成身份或事件（主形象写身份：老宅主人、公司总裁；事件形象写事件：病号服、新娘、冒充护卫），颜色款式写进外观描述`);
        }
        if (placeLikeRoleNames([e.name]).length && !ctx.warned.has(`n:${e.name}`)) {
          ctx.warned.add(`n:${e.name}`);
          warnings.push(`第${ln}行 角色名「${e.name}」是地点或柜台的名字——改成指人的名字（前台接待、礼宾员、保安员），否则正文里表示柜台/地点的同一个词会和角色混在一起`);
        }
        scene.declared.set(e.name, e.variant);
        ctx.last.set(e.name, { variant: e.variant });
        ctx.usage.push({ episode: ctx.episode, scene: scene.head.split(/\s+/)[0], name: e.name, variant: e.variant, cause: e.cause, changed: Boolean(before && before !== e.variant) });
      }
      scene.hasMark = true;
      scene.actionsSinceMark = [];
      continue;
    }
    const d = matchDialogue(l);
    // 括注两种位置都认：「甲（电话里）：…」「甲：（电话里）…」——只出声不出镜的人不要求标形象
    const leadNote = d ? (d.body.match(/^[（(][^）)]*[）)]/) || [''])[0] : '';
    if (d && !VOICE_ONLY_NOTE_RE.test(`${d.speaker}${d.note}${leadNote}`)) scene.speakers.add(d.speaker.replace(/[（(][^）)]*[）)]/g, '').trim());
  }
  closeScene();
  return marks;
}

// 校验一份正文，返回 { errors: [], warnings: [], stats: {} }。行号从 1 开始。
function gateOneScript(text, ctx = newVariantContext()) {
  const rawLines = String(text).split(/\r?\n/);
  const errors = [], warnings = [];
  let dlgCount = 0, actCount = 0, silentBurstStart = -1;
  let run = [];                 // 当前连续台词行 [{ line, speaker }]
  const flushRun = () => {
    if (run.length >= 3) {
      const from = run[0].line, to = run[run.length - 1].line;
      const speakers = [...new Set(run.map(r => r.speaker))];
      // 补写位置：连发段中间（第 2 句台词之后）
      const insertAfter = run[1].line;
      errors.push(`第${from}-${to}行 对白连发段（连续${run.length}句台词无△动作行，说话人:${speakers.join('/')}）→ 在第${insertAfter}行后插入一行△（听者可见反应 或 说话人伴随动作）`);
    }
    run = [];
  };
  let narrativeCount = 0;   // 既非台词/△/元信息/场次头的叙述行（小说识别用）
  let inSceneIntro = false;  // 是否处在"场次头之后、首个△/台词之前"（环境描述行允许区）
  const actionSeen = new Map(); // △正文 → 出现行号（重复△检测）
  let sceneHead = null, sceneBuf = []; // 当前场景的△/画面文字（载具进出连续性检测）
  const flushScene = () => {
    if (sceneHead) checkVehicleSceneContinuity(sceneHead, sceneBuf, warnings);
    sceneBuf = [];
  };
  for (let i = 0; i < rawLines.length; i++) {
    const l = rawLines[i].trim();
    const ln = i + 1;
    if (!l) continue;
    if (!isActionLine(l) && GATE_TIMELEAK_RE.test(l)) errors.push(`第${ln}行 残留整片时间轴/源视频标记（${(l.match(GATE_TIMELEAK_RE) || [''])[0]}）→ 删掉"按源视频"整片时长/"场景0XX"流水号/绝对时间轴；场景写真实地名，要时长只留单SHOT（时长3秒）`);
    // 合并全集时 Agent 常自己加「===== 第04集 =====」分隔线：客户端拆集只认「第NNN集 标题」，这行会被塞进上一集正文末尾变成垃圾行。
    if (GATE_EPSEP_RE.test(l)) errors.push(`第${ln}行 多余的集分隔线（${l.slice(0, 30)}）→ 整行删掉；每集只保留一行「第NNN集 标题」做集头，不要再加 =====/---- 包着集号的分隔行`);
    if (isActionLine(l)) {
      flushRun();
      inSceneIntro = false;
      actCount++;
      const body = l.slice(1).trim();
      sceneBuf.push(body);
      if (GATE_MENTAL_RE.test(body)) errors.push(`第${ln}行 △写了心理活动（${(body.match(GATE_MENTAL_RE) || [''])[0]}）→ △只写可见的外部动作与神态，把心理翻译成身体反应`);
      if (GATE_TIMECODE_RE.test(body)) errors.push(`第${ln}行 △里写了时间码（${(body.match(GATE_TIMECODE_RE) || [''])[0].trim()}）→ 剧本不写时间码，删掉，直接写可见动作`);
      if (GATE_FILLER_RE.test(body)) errors.push(`第${ln}行 △是万能填充句/占位话（${(body.match(GATE_FILLER_RE) || [''])[0]}）→ 写该时刻具体谁做了什么可见动作（分析表 visible_action 那一列就是素材），不要用空话占位`);
      const key = body.replace(GATE_TIMECODE_RE, '').replace(/[。．.！!？?，,；;\s]+$/u, '');
      if (!actionSeen.has(key)) actionSeen.set(key, []);
      actionSeen.get(key).push(ln);
      if (body.length < 6) warnings.push(`第${ln}行 △太短（${body.length}字）——动作要具体可拍`);
      if (body.length > 60) warnings.push(`第${ln}行 △太长（${body.length}字）——一行一件事，拆开`);
      continue;
    }
    // 人物行、画面/镜头描述块：合法结构行，放行不计叙述。
    if (isCharacterListLine(l) || isPictureLine(l)) { flushRun(); continue; }
    if (isSceneHead(l)) { flushRun(); flushScene(); sceneHead = l; inSceneIntro = true; continue; }
    if (isEpTitle(l)) { flushRun(); flushScene(); sceneHead = null; continue; }
    if (isMetaLine(l)) { flushRun(); sceneBuf.push(l.replace(/^【[^】]*】/, '')); continue; }
    if (isVariantLine(l)) { flushRun(); continue; }
    const d = matchDialogue(l);
    if (d) {
      dlgCount++;
      inSceneIntro = false;
      run.push({ line: ln, speaker: d.speaker });
      if (d.body.length > 40) warnings.push(`第${ln}行 台词超长（${d.body.length}字）——超过40字的台词转分镜会被硬拆，建议按句号拆成两句`);
      continue;
    }
    flushRun(); // 其他叙述行也算隔断
    // 场次头之后、第一个△动作/台词之前的纯文字行 = 环境/画面描述，合法（不计叙述、不触发"这是小说"）。
    if (inSceneIntro) continue;
    narrativeCount++;
  }
  flushRun();
  flushScene();
  // 小说/散文识别：绝大部分是叙述行、几乎没有剧本结构 → 这是源材料不是剧本，
  // 逐条打补丁方向就错了，应整体改编成剧本格式后再过门。
  const structured = dlgCount + actCount;
  if (narrativeCount >= 30 && structured < narrativeCount * 0.25 && !rawLines.some(l => isSceneHead(l.trim()))) {
    return {
      errors: [`这份文本是小说/散文源材料（叙述行${narrativeCount}行，剧本结构行仅${structured}行），不是剧本——不要按下面的行号打补丁，请先把它改编成剧本格式（场次头 + △动作行 + 「角色名：台词」），改编稿再过门`],
      warnings: [],
      stats: { dialogue: dlgCount, action: actCount }
    };
  }
  // 重复△：把视频分析表同一行的 visible_action 复制到每句台词前凑配比，成片动作全是同一句。
  for (const [key, lines] of actionSeen) {
    if (lines.length < 2) continue;
    const msg = `第${lines.join('/')}行 △重复同一句（${key.slice(0, 24)}${key.length > 24 ? '…' : ''}）→ 每处△要写该时刻不同的具体动作/反应；分析表里一句概括只能用一次，拆成不同动作节拍`;
    if (key.length >= 10 || lines.length >= 3) errors.push(msg);
    else warnings.push(msg);
  }
  if (dlgCount === 0) errors.push('没有解析到任何台词行——检查格式：台词行应为「角色名：台词」');
  if (dlgCount > 0 && actCount === 0) errors.push('全篇没有一行△动作行——每句台词前后应有可见动作/反应（目标配比约1:1）');
  else if (dlgCount > 0 && dlgCount / Math.max(actCount, 1) > 2) warnings.push(`对白:动作 = ${dlgCount}:${actCount}（超过2:1）——目标约1:1，多补△（听者反应/说话人动作）`);
  const hasScene = rawLines.some(l => isSceneHead(l.trim()));
  if (!hasScene) warnings.push('没有场次头（如「1-1 面馆后厨 白天 室内」）——建议每场开头标场景/时间/内外');
  const variantMarks = checkVariants(rawLines, ctx, errors, warnings);
  return { errors, warnings, stats: { dialogue: dlgCount, action: actCount, variantMarks } };
}

function newVariantContext(table = null) {
  return { last: new Map(), usage: [], table, episode: 0, required: false };
}
const episodeNoOfFile = (name) => Number((String(name).match(/第\s*0*(\d+)\s*集/) || String(name).match(/EP\s*0*(\d+)/i) || [])[1] || 0);
// 目录里的剧本按集号排序（跨集形象延续要按顺序查）；形象变体表 / 汇总文件本身不当剧本查。
function listScriptFiles(d) {
  const names = fs.readdirSync(d).filter((name) => /\.(txt|md)$/i.test(name) && !/形象变体|资产表|映射表|核对表|审核|报告|说明/.test(name));
  // 目录里有「第N集」剧本时只查剧本，随稿交付的说明文档不当剧本查
  const episodeNames = names.filter((name) => episodeNoOfFile(name) > 0);
  return (episodeNames.length ? episodeNames : names)
    .map((name) => path.join(d, name))
    .sort((a, b) => (episodeNoOfFile(path.basename(a)) - episodeNoOfFile(path.basename(b))) || a.localeCompare(b));
}
function loadVariantTable(dir) {
  const explicit = arg('variants', '');
  const candidates = explicit ? [path.resolve(explicit)] : (dir ? fs.readdirSync(dir).filter((n) => /形象变体表/.test(n) && !/汇总/.test(n)).map((n) => path.join(dir, n)) : []);
  for (const file of candidates) {
    if (!fs.existsSync(file)) die('形象变体表不存在: ' + file);
    const table = parseVariantTable(fs.readFileSync(file, 'utf8'));
    if (table.size) return { table, file };
  }
  return { table: null, file: '' };
}
// 从正文【形象】标记汇总「每个角色几个变体、分别出现在哪几集哪几场、因何而变」。
function summarizeVariantUsage(usage) {
  const byRole = new Map();
  for (const u of usage) {
    if (!byRole.has(u.name)) byRole.set(u.name, new Map());
    const variants = byRole.get(u.name);
    if (!variants.has(u.variant)) variants.set(u.variant, { places: [], episodes: new Set(), causes: [] });
    const v = variants.get(u.variant);
    const place = u.episode ? `${u.episode}集${u.scene ? ' ' + u.scene : ''}` : u.scene;
    if (!v.places.includes(place)) v.places.push(place);
    if (u.episode) v.episodes.add(u.episode);
    if (u.changed && u.cause && !v.causes.includes(u.cause)) v.causes.push(u.cause);
  }
  const lines = ['# 形象变体表（按正文【形象】标记自动汇总）', '', '| 角色 | 变体数 | 变体名 | 出现集 | 出现场次 | 变化原因 |', '| --- | --- | --- | --- | --- | --- |'];
  for (const [name, variants] of byRole) {
    for (const [variant, v] of variants) {
      const eps = [...v.episodes].sort((a, b) => a - b);
      const ranges = [];
      for (const e of eps) {
        const last = ranges[ranges.length - 1];
        if (last && e === last[1] + 1) last[1] = e; else ranges.push([e, e]);
      }
      const epText = ranges.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join('、') || '-';
      lines.push(`| ${name} | ${variants.size} | ${variant} | ${epText} | ${v.places.join('、')} | ${v.causes.join('；') || '-'} |`);
    }
  }
  return { byRole, markdown: lines.join('\n') + '\n' };
}

// gate 命令：--file 单文件 / --dir 目录批量(.txt/.md)。跑门前仅做鉴权（不扣积分）。
// 输出 GATE_PASS / GATE_FAIL(exit 1)。--no-auth 供离线自查（Agent 正式交付前仍须 auth）。
// variants 命令：从正文【形象】标记汇总形象变体表（每个角色几个变体、出现在哪几集哪几场、因何而变），零积分、纯本地。
async function cmdVariants() {
  const dir = arg('dir', '') || die('用法: chenyu-pro variants --dir <剧本目录> [--out 形象变体汇总.md]');
  const d = path.resolve(dir);
  if (!fs.existsSync(d)) die('目录不存在: ' + d);
  const files = listScriptFiles(d);
  if (!files.length) die('目录里没有 .txt/.md 剧本文件');
  const ctx = newVariantContext();
  for (const f of files) {
    ctx.episode = episodeNoOfFile(path.basename(f));
    checkVariants(String(fs.readFileSync(f, 'utf8')).split(/\r?\n/), ctx, [], []);
  }
  if (!ctx.usage.length) die('正文里没有【形象】标记——先按写作规范每场标出场人物形象');
  const { byRole, markdown } = summarizeVariantUsage(ctx.usage);
  const out = path.resolve(arg('out', path.join(d, '形象变体汇总.md')));
  fs.writeFileSync(out, markdown, 'utf8');
  for (const [name, variants] of byRole) console.log(`  ${name}：${variants.size} 个形象（${[...variants.keys()].join(' / ')}）`);
  console.log(`✓ 已汇总 ${byRole.size} 个角色的形象变体 -> ${out}`);
  checkVariantsAgainstSource(d, arg('source', ''), ctx.usage);
}

async function cmdGate() {
  if (!flag('no-auth')) await api('/api/auth/me');
  const file = arg('file', '');
  const dir = arg('dir', '');
  const targets = [];
  if (file) targets.push(path.resolve(file));
  else if (dir) {
    const d = path.resolve(dir);
    if (!fs.existsSync(d)) die('目录不存在: ' + d);
    targets.push(...listScriptFiles(d));
    if (!targets.length) die('目录里没有 .txt/.md 剧本文件');
  } else die('用法: chenyu-pro gate --file 剧本.txt  或  chenyu-pro gate --dir <目录>');
  const { table, file: tableFile } = loadVariantTable(dir ? path.resolve(dir) : '');
  if (tableFile) console.log(`（按形象变体表核对变体名：${path.basename(tableFile)}）`);
  const ctx = newVariantContext(table);
  let totalErr = 0, totalWarn = 0;
  for (const t of targets) {
    if (!fs.existsSync(t)) die('文件不存在: ' + t);
    ctx.episode = episodeNoOfFile(path.basename(t));
    const { errors, warnings, stats } = gateOneScript(fs.readFileSync(t, 'utf8'), ctx);
    const name = path.basename(t);
    console.log(`── ${name}  台词${stats.dialogue}句 / 动作${stats.action}行${stats.variantMarks ? ` / 形象标记${stats.variantMarks}行` : ''}`);
    for (const e of errors) console.log('  ✗ ' + e);
    for (const w of warnings) console.log('  ⚠ ' + w);
    if (!errors.length && !warnings.length) console.log('  ✓ 无问题');
    totalErr += errors.length; totalWarn += warnings.length;
  }
  if (totalErr > 0) { console.log(`GATE_FAIL 硬伤${totalErr}处 警告${totalWarn}处 —— 按上面逐条修改后重跑 gate`); process.exit(1); }
  console.log(`GATE_PASS${totalWarn ? ' （警告' + totalWarn + '处，建议顺手改）' : ''}`);
}

// ---------- Agent 写作模式（v2.0.0）：平台只做鉴权，写作由用户 Agent 完成，零积分 ----------

// 鉴权门：Agent 动笔写剧本之前必须先跑本命令并拿到 AUTH_OK。
// 只校验平台登录态（未登录会自动尝试 KEY 免密续登）；不查余额、不扣任何积分。
// 退出码 0 = 通过；非 0 = 未通过（Agent 必须拒绝写作并引导用户登录）。
async function cmdAuth() {
  const me = await api('/api/auth/me');
  const who = me.user?.display_name || me.user?.identifier || loadConfig().username || '(账号)';
  console.log('AUTH_OK ' + who);
}

// 建项目壳（零积分）：只创建平台项目用于归档与交付，绝不调用 start-auto，
// 平台服务端不会跑任何生成工作流、不会扣一分积分。正文由 Agent 写完后用 save 回传。
async function cmdCreate() {
  const title = arg('title') || die('缺 --title 剧名');
  const episodes = Number(arg('episodes', '30'));
  const market = arg('market', '');
  if (market && !MARKETS[market]) die('未知市场: ' + market + '，可选: ' + Object.keys(MARKETS).join('/'));
  const duration = Number(arg('duration', '90'));
  const body = {
    title, working_title: title,
    mode: 'original',
    total_episodes: episodes, batch_episodes: episodes,
    quality_tier: 'strong_review',
    episode_duration_seconds: duration,
    config: {
      genre: arg('genre', market ? MARKETS[market] : '短剧'),
      audience: arg('audience', '待确认'),
      production_format: '真人剧', source_type: 'source_text',
      model_strategy: 'balanced', research_window_days: 30,
      episode_duration_seconds: duration,
      config_json: {
        created_from: 'chenyu-pro-cli-agent',
        authoring: 'agent',            // 标记：正文由用户 Agent 写作，非平台生成
        ...(market ? { market } : {})
      }
    }
  };
  const created = await api('/api/projects', { method: 'POST', body });
  const pid = created.project.id;
  console.log('✓ 项目壳已创建（Agent 写作模式，零积分）: ' + pid);
  console.log(`下一步: 你(Agent)按 SKILL 写作规范逐集写正文 → chenyu-pro save --project ${pid.slice(-8)} --episode 1 --file 第001集.txt`);
}

// 回传 Agent 写的正文：按平台 A15 正文产物契约入库（step_id=A15 / title 含"正文" /
// episode=集号），入库后 fetch / sync / word / download-full 等交付链路直接可用。
// 单集: --episode N --file 正文.txt   批量: --dir 目录(文件名须含 第N集)
async function cmdSave() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const p = await findProject(fragment);
  const dir = arg('dir', '');
  const items = [];
  if (dir) {
    const d = path.resolve(dir);
    if (!fs.existsSync(d)) die('目录不存在: ' + d);
    for (const name of fs.readdirSync(d)) {
      const m = name.match(/第(\d+)集/);
      if (!m || !/\.(txt|md)$/i.test(name)) continue;
      items.push({ ep: Number(m[1]), file: path.join(d, name) });
    }
    if (!items.length) die('目录里没有文件名含「第N集」的 .txt/.md 正文文件');
    items.sort((a, b) => a.ep - b.ep);
  } else {
    const ep = Number(arg('episode', '')) || die('缺 --episode <集号>（或用 --dir 批量）');
    const file = arg('file') || die('缺 --file <正文.txt>');
    items.push({ ep, file: path.resolve(file) });
  }
  for (const it of items) {
    if (!fs.existsSync(it.file)) die('正文文件不存在: ' + it.file);
    const content = fs.readFileSync(it.file, 'utf8');
    if (content.trim().length < 50) die(`正文太短(${it.file})——不像一集剧本`);
    if (!flag('skip-gate')) {
      const g = gateOneScript(content);
      if (g.errors.length) {
        for (const e of g.errors) console.log('  ✗ ' + e);
        die(`${path.basename(it.file)} 未过格式门（${g.errors.length}处硬伤）——修完重跑，或 --skip-gate 强制入库`);
      }
    }
    const pad = String(it.ep).padStart(3, '0');
    const epTitle = arg('title', '');
    await api(`/api/projects/${p.id}/files`, {
      method: 'POST',
      body: {
        filename: `第${pad}集正文.md`,
        title: epTitle ? `第${pad}集正文 ${epTitle}` : `第${pad}集正文`,
        type: 'markdown',
        step_id: 'A15',
        episode: it.ep,
        content
      }
    });
    console.log(`  ✓ 第${pad}集正文已入库 (${content.length} 字)`);
  }
  console.log(`✓ 共回传 ${items.length} 集到《${p.title}》。交付: chenyu-pro fetch --project ${p.id.slice(-8)} --out <目录>  或  chenyu-pro sync --project ${p.id.slice(-8)}`);
}

// ---------- 视频分析：本 Skill 唯一消耗平台积分的功能 ----------
// 边界：平台只做「视频 → 分析稿」，绝不触发平台代写——不传 auto_start_workflow、
// 不设 auto_rewrite。分析稿取回本地后由你(Agent)自己写剧本，写作零积分。
// 视频一律走本命令做平台反推（画面+声音）；禁止 Agent 用抽音频/转写/抽帧代替，
// 只有台词没有画面动作，洗出的剧本乱、改动大（2026-09-13 用户实测反馈）。
const VIDEO_MIME = { '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.mkv': 'video/x-matroska', '.webm': 'video/webm', '.avi': 'video/x-msvideo', '.m4v': 'video/x-m4v', '.ts': 'video/mp2t' };
// 上传前压缩到低清分析代理：服务端视频反推只需看清人物/动作/服装，不需要原始高码率。
// 上传前压缩（保留音轨供台词识别）：压缩不改视频时长，计费按秒数不变——这一步只管体积，不省积分。
// Skill 自带 ffmpeg（v2.14.0）：安装器装完会下载一份到 ~/.codex/chenyu-pro/bin/，Codex 与 Claude Code 共用。
// 起因：没装 ffmpeg 的机器只打印一行提示就照传原片（2026-10-03 一部 72 集全是原片上传，32MB 的集超过上游 24MB 上限、
// 语音识别也拉取失败）。带 libx264 的精简版，gzip 后 29MB，不放 GitHub 仓库（国内下载慢、仓库会越来越大）。
// 下载源（不放渠道服务器，不占它的带宽）：先泉州节点（国内直连就能下，不用代理），再对象存储做备用
// （境外，国内直连又慢又会卡死，有系统代理时走代理）。20 秒没数据就换下一种走法。泉州那份是 http，靠下面的 sha256 校验保证内容没被改。
const BUNDLED_FFMPEG = {
  sources: [
    { url: 'http://121.205.88.149:8099/skill-downloads/chenyu-ffmpeg-6.1.1-win64.exe.gz', domestic: true },
    { url: 'https://pub-a98cf3718f684ce8b752168564943590.r2.dev/updates/runtime/chenyu-skill/chenyu-ffmpeg-6.1.1-win64.exe.gz', domestic: false },
  ],
  gzSha256: 'f5ae838ff0a14e5781ffef25d44e275c19e9852ca1afece4159a2d28d70e789c',
  exeSha256: '04e1307997530f9cf2fe35cba2ca7e8875ca91da02f89d6c7243df819c94ad00',
  exeSize: 82797568,
};
const bundledFfmpegPath = () => path.join(CONFIG_DIR, 'bin', 'ffmpeg.exe');
const runsFfmpeg = (bin) => { try { return spawnSync(bin, ['-version'], { windowsHide: true }).status === 0; } catch { return false; } };
function resolveFfmpeg() {
  const cands = [process.env.CHENYU_FFMPEG, bundledFfmpegPath(), 'ffmpeg', 'C:\\ffmpeg\\bin\\ffmpeg.exe', 'C:\\ffmpeg-6.1.1\\bin\\ffmpeg.exe'].filter(Boolean);
  for (const c of cands) if (runsFfmpeg(c)) return c;
  return null;
}
const sha256OfFile = (file) => new Promise((resolve, reject) => {
  const hash = crypto.createHash('sha256');
  fs.createReadStream(file).on('data', (d) => hash.update(d)).on('end', () => resolve(hash.digest('hex'))).on('error', reject);
});
// 没有可用的 ffmpeg 时下载自带的那份（下载→校验→解压→再校验→试运行）。返回可用的 ffmpeg 路径，装不上返回 null 并说明原因。
async function ensureFfmpeg({ quiet = false } = {}) {
  const existing = resolveFfmpeg();
  if (existing) return existing;
  if (process.platform !== 'win32') { if (!quiet) console.log('  自带 ffmpeg 只有 Windows 版；本机请自行安装 ffmpeg（或设 CHENYU_FFMPEG 指向它）。'); return null; }
  const target = bundledFfmpegPath();
  const gzPath = `${target}.gz.part`;
  // 从一个源下载到 gzPath；连接或中途 20 秒没数据就中断（抛错给调用方换下一种走法）。
  // viaProxy=true 经系统代理下（国内直连境外存储又慢又会卡死，有代理必须先走代理）。
  const downloadFrom = async (url, viaProxy) => {
    const controller = new AbortController();
    let timer = setTimeout(() => controller.abort(), 20000);
    const touch = () => { clearTimeout(timer); timer = setTimeout(() => controller.abort(), 20000); };
    let got = 0, shown = -1;
    const progress = (n, total) => {
      touch();
      got += n;
      const pct = total ? Math.floor((got / total) * 4) * 25 : -1;
      if (pct > shown && pct < 100) { shown = pct; console.log(`    ${pct}%`); }
    };
    try {
      if (viaProxy) {
        const res = await proxyFetch(url, { signal: controller.signal, onData: progress });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        fs.writeFileSync(gzPath, Buffer.from(await res.arrayBuffer()));
      } else {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        const total = Number(res.headers.get('content-length') || 0);
        const out = fs.createWriteStream(gzPath);
        try {
          for await (const chunk of res.body) {
            progress(chunk.length, total);
            if (!out.write(chunk)) await new Promise((r) => out.once('drain', r));
          }
        } finally {
          await new Promise((resolve) => out.end(resolve));
        }
      }
      if ((await sha256OfFile(gzPath)) !== BUNDLED_FFMPEG.gzSha256) throw new Error('下载的文件校验不一致');
    } catch (error) {
      throw new Error(controller.signal.aborted ? '20 秒没有数据' : String(error?.message || error));
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    console.log('  正在下载自带的 ffmpeg（约 29MB，只下一次）…');
    let lastError = '';
    let ok = false;
    // 顺序：国内节点直连 → 境外存储走代理（有代理时）→ 境外存储直连 → 国内节点走代理（直连被本机网络挡住时的最后一招）
    const hasProxy = Boolean(findSystemProxy());
    const domestic = BUNDLED_FFMPEG.sources.filter((s) => s.domestic);
    const overseas = BUNDLED_FFMPEG.sources.filter((s) => !s.domestic);
    const plan = [
      ...domestic.map((s) => ({ url: s.url, viaProxy: false, label: '国内节点' })),
      ...(hasProxy ? overseas.map((s) => ({ url: s.url, viaProxy: true, label: '备用存储（经系统代理）' })) : []),
      ...overseas.map((s) => ({ url: s.url, viaProxy: false, label: '备用存储（直连）' })),
      ...(hasProxy ? domestic.map((s) => ({ url: s.url, viaProxy: true, label: '国内节点（经系统代理）' })) : []),
    ];
    for (const [index, step] of plan.entries()) {
      try { await downloadFrom(step.url, step.viaProxy); ok = true; break; } catch (error) {
        lastError = String(error?.message || error);
        try { fs.rmSync(gzPath, { force: true }); } catch { /* ignore */ }
        if (index < plan.length - 1) console.log(`    ${step.label}不通（${lastError.slice(0, 40)}），换${plan[index + 1].label}…`);
      }
    }
    if (!ok) throw new Error(lastError || '下载失败');
    const tmpExe = `${target}.part`;
    await new Promise((resolve, reject) => {
      const gunzip = zlib.createGunzip();
      const w = fs.createWriteStream(tmpExe);
      fs.createReadStream(gzPath).on('error', reject).pipe(gunzip).on('error', reject).pipe(w).on('error', reject).on('finish', resolve);
    });
    if ((await sha256OfFile(tmpExe)) !== BUNDLED_FFMPEG.exeSha256) throw new Error('解压后的文件校验不一致');
    fs.rmSync(target, { force: true });
    fs.renameSync(tmpExe, target);
    fs.rmSync(gzPath, { force: true });
    if (!runsFfmpeg(target)) throw new Error('装好的 ffmpeg 无法运行');
    console.log(`  ✓ ffmpeg 已就绪：${target}`);
    return target;
  } catch (error) {
    for (const f of [gzPath, `${target}.part`]) { try { fs.rmSync(f, { force: true }); } catch { /* ignore */ } }
    if (!quiet) console.log(`  ✗ 自带 ffmpeg 下载失败：${String(error?.message || error).slice(0, 80)}（可重跑 chenyu-pro ffmpeg --install，或自行安装 ffmpeg 后设 CHENYU_FFMPEG）`);
    return null;
  }
}
async function cmdFfmpeg() {
  const found = flag('install') ? await ensureFfmpeg() : resolveFfmpeg();
  if (found) console.log(`ffmpeg 可用：${found}${flag('install') ? '' : '（视频上传前会自动压缩）'}`);
  else { console.log('没有可用的 ffmpeg。运行 chenyu-pro ffmpeg --install 下载自带的那份。'); process.exitCode = 1; }
}
// 上游视频模型单个文件上限 24MB（超过的集分析结果是空的），语音识别拉大文件也容易失败 → 每集压到 22MB 以内。
const VIDEO_UPLOAD_LIMIT_BYTES = 24 * 1024 * 1024;
const VIDEO_TARGET_BYTES = 22 * 1024 * 1024;
// 用 ffmpeg 自己读时长（不依赖 ffprobe，自带的包里只有 ffmpeg）
function ffmpegDurationSeconds(ffmpeg, file) {
  try {
    const r = spawnSync(ffmpeg, ['-hide_banner', '-i', file], { windowsHide: true, encoding: 'utf8' });
    const m = String(r.stderr || '').match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 0;
  } catch { return 0; }
}
// 按时长算码率，保证压完 ≤ 22MB。**只压码率，分辨率永远不动**：缩分辨率后竖排名牌小字会糊到认错字
// （v2.9.0 已踩过，用户 2026-10-03 再次明确）。很长的集码率不够时改降帧率（字的清晰度不变，只是没那么流畅）。
// 时长读不到时退回「CRF28 + 1.5Mbps 封顶」。scale<1 时在算出的码率上再打折（压完仍超限时重压用）。
function videoCompressArgs(src, dst, durationSec, scale = 1) {
  const audioK = 64;
  if (!(durationSec > 0)) return ['-y', '-i', src, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-maxrate', '1500k', '-bufsize', '3000k', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', dst];
  const budgetK = Math.floor((VIDEO_TARGET_BYTES * 8) / durationSec / 1000 * 0.97); // 留 3% 给封装开销
  const videoK = Math.max(200, Math.floor(Math.min(1500, budgetK - audioK) * scale));
  const a = ['-y', '-i', src, '-c:v', 'libx264', '-preset', 'veryfast', '-b:v', `${videoK}k`, '-maxrate', `${videoK}k`, '-bufsize', `${videoK * 2}k`];
  if (videoK < 700) a.push('-r', videoK < 350 ? '10' : '15');
  a.push('-c:a', 'aac', '-b:a', `${audioK}k`, '-movflags', '+faststart', dst);
  return a;
}
function compressVideoProxy(ffmpeg, src, dst, durationSec = 0, scale = 1) {
  return new Promise((resolve, reject) => {
    try { fs.rmSync(dst, { force: true }); } catch { /* ignore */ }
    const child = spawn(ffmpeg, videoCompressArgs(src, dst, durationSec, scale), { windowsHide: true });
    let err = '';
    child.stderr?.on('data', (d) => { err += d.toString(); if (err.length > 4000) err = err.slice(-4000); });
    child.on('error', reject);
    child.on('close', (code) => { (code === 0 && fs.existsSync(dst)) ? resolve() : reject(new Error(`ffmpeg 压缩失败(${code})`)); });
  });
}
const guessVideoMime = (n) => VIDEO_MIME[path.extname(n).toLowerCase()] || 'video/mp4';
const SEGMENT_SECONDS = 240;    // 平台按 240 秒切段（不足一段按一段算）
const POINTS_PER_SEGMENT = 30;  // 每段 30 积分
const TEXT_CALL_POINTS = 15;    // 分析后的文本步骤（人物身份审计等）每次 15 积分

function probeDurationSeconds(file) {
  const cands = [process.env.CHENYU_FFPROBE, 'ffprobe', 'C:\\ffmpeg\\bin\\ffprobe.exe', 'E:\\pump2.0\\BOTV\\FFPROBE.EXE'].filter(Boolean);
  for (const bin of cands) {
    try {
      const r = spawnSync(bin, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], { windowsHide: true, encoding: 'utf8' });
      if (r.status === 0) { const d = Number(String(r.stdout || '').trim()); if (d > 0) return d; }
    } catch { /* 试下一个候选 */ }
  }
  // 没有 ffprobe 时用 ffmpeg 自己读（自带的包里只有 ffmpeg）
  const ffmpeg = resolveFfmpeg();
  return ffmpeg ? ffmpegDurationSeconds(ffmpeg, file) : 0;
}

// 查余额但不中断流程（用于对比实际扣除），取不到返回 null。
async function pointsBalanceSafe() {
  try {
    const cfg = loadConfig();
    if (!cfg.credit_key) return null;
    const res = await fetch((cfg.credit_base || DEFAULT_CREDIT_BASE) + '/api/jimeng/v1/key', { headers: { Authorization: 'Bearer ' + cfg.credit_key, 'User-Agent': CLI_UA } });
    const n = Number((await res.json().catch(() => ({})))?.key?.pointsBalance);
    return Number.isFinite(n) ? n : null;
  } catch { return null; }
}

// 从文件名取集号：第34集.mp4 / EP34 / E034 / 某剧-34.mp4 / 34.mp4；取不到返回 0。
// 末尾的「-34」优先于开头的数字：「9月15日-2.mp4」这类带日期前缀的名字，开头的 9 是日期不是集号
// （2026-10-04 实例：整部剧每个文件都被取成第 9 集）。开头数字后面紧跟 年/月/日/号 的也不当集号。
function episodeNumberFromName(name) {
  const base = path.basename(String(name || ''), path.extname(String(name || '')));
  const match = base.match(/第\s*0*(\d{1,4})\s*[集话話]/)
    || base.match(/(?:^|[^a-z])(?:ep|e)[\s_-]*0*(\d{1,4})(?!\d)/i)
    || base.match(/[\s_\-·.]0*(\d{1,3})$/)
    || base.match(/^0*(\d{1,4})(?![\d年月日号])/);
  const n = match ? Number(match[1]) : 0;
  return n > 0 && n < 2000 ? n : 0;
}
const episodeIdOf = (n) => 'EP' + String(n).padStart(3, '0');

async function fetchArtifactText(a) {
  let content = String(a.content || '');
  if (!content) {
    try { content = String((await api(`/api/artifacts/${a.id}/content`)).content || ''); } catch { /* 取不到按空处理 */ }
  }
  return content;
}

// 取回项目最新分析稿到本地 + 逐段检查分析质量（每段只看最新版本）。零积分。
async function downloadVideoAnalysis(pid, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  try { saveConfig({ ...loadConfig(), last_analysis_dir: outDir }); } catch { /* 记不住不影响取回 */ }
  const arts = (await api(`/api/projects/${pid}/artifacts`)).artifacts || [];
  // 全剧合集是洗稿主用文件（剧集索引+人物/场景/道具资产表+事件表+逐集分析表），其余为备查。
  const want = ['video_reverse_全剧合集.md', 'video_reverse_source.md', 'video_reverse_replay_script.md', 'episode_index.json', 'identity_registry.json', 'character_variants.json', 'asset_consolidation.json', '资产合并表.md'];
  let got = 0;
  const written = new Set();
  // 产物列表按更新时间倒序：同名文件只取第一个（最新版），平台修复或追加分析后旧版本不会覆盖新版本。
  for (const a of arts) {
    const fn = String(a.filename || a.title || '');
    if (!want.includes(fn) || written.has(fn)) continue;
    const content = await fetchArtifactText(a);
    if (!content.trim()) continue;
    fs.writeFileSync(path.join(outDir, fn), content, 'utf8');
    written.add(fn);
    got += 1;
  }
  // 逐段查分析质量（每段只看最新版本）：残缺稿必须拦在 Agent 写作之前。
  const badSegments = [];
  const checked = new Set();
  for (const a of arts) {
    const fn = String(a.filename || a.title || '');
    if (!/^video_reverse_segment_.+\.json$/.test(fn) || checked.has(fn)) continue;
    checked.add(fn);
    try {
      const seg = JSON.parse(await fetchArtifactText(a));
      const rows = Array.isArray(seg.shot_rows) ? seg.shot_rows.length : 0;
      const flags = Array.isArray(seg.quality_flags) ? seg.quality_flags : [];
      if (!rows || flags.length) badSegments.push(`${seg.segment?.segment_id || fn}（镜头表${rows}行${flags.length ? '，' + String(flags[0]).slice(0, 40) : ''}）`);
    } catch { /* 取不到单段文件不影响主流程 */ }
  }
  return { got, badSegments };
}

// 取回的分析稿完不完整：按 episode_index.json 逐集看（有没有分析段、有没有剧情摘要）。纯本地读文件。
function analysisCompleteness(outDir) {
  try {
    const episodes = JSON.parse(fs.readFileSync(path.join(outDir, 'episode_index.json'), 'utf8')).episodes || [];
    const numbers = episodes.map((ep) => Number((String(ep.episode_id || '').match(/(\d+)/) || [])[1])).filter(Number.isFinite);
    const top = numbers.length ? Math.max(...numbers) : 0;
    const have = new Set(numbers);
    const gaps = [];
    for (let n = 1; n <= top; n += 1) if (!have.has(n)) gaps.push(n);
    const empty = episodes.filter((ep) => !(ep.segment_ids || []).length || !(ep.summaries || []).join('').trim()).map((ep) => String(ep.episode_id));
    return { known: true, count: episodes.length, gaps, empty };
  } catch { return { known: false, count: 0, gaps: [], empty: [] }; }
}

// 打印「完不完整 + 下一步」（video-fetch / video-analyze 共用）。jobState: { status, failed: [段号] }。返回 true = 可以往下做资产整理。
// 背景：平台状态 needs_review 且没有失败段 = 分析完整、只是人物还没归属。2026-10-04 有 Agent 把它当成故障，打算花 300~480 分重跑。
function printAnalysisVerdict({ outDir, pid, jobState = {}, badSegments = [] }) {
  const c = analysisCompleteness(outDir);
  const failed = jobState.failed || [];
  const problems = [];
  if (failed.length) problems.push(`平台还有没分析成功的段：${failed.join(', ')}`);
  if (c.gaps.length) problems.push(`集号不连续，缺第 ${c.gaps.join('、')} 集（如果本来就只分析后面的集，可忽略这一条）`);
  if (c.empty.length) problems.push(`这些集没有分析内容或剧情摘要：${c.empty.join(', ')}`);
  if (badSegments.length) problems.push(`这些段缺画面动作/镜头表：${badSegments.join('；')}`);
  console.log('── 分析稿完整性 ──');
  if (!c.known) {
    console.log('  ⚠ 没读到 episode_index.json，无法判断集数。重新取一次：chenyu-pro video-fetch --project ' + pid.slice(-8));
    return false;
  }
  if (problems.length) {
    console.log(`  共 ${c.count} 集。⛔ 不完整：\n   - ${problems.join('\n   - ')}`);
    console.log(`  全部集都有结果才能往下写。只补缺的集（已成功的不会重复扣分）：\n    chenyu-pro video-analyze --project ${pid.slice(-8)} --video-file <缺的集.mp4,逗号分隔> --episodes <对应集号,逗号分隔> --yes\n  补了仍缺，把上面的清单原样告诉用户，由平台核实；不要自己绕过、不要重新提交整批视频。`);
    return false;
  }
  console.log(`  ✓ 结论：完整。共 ${c.count} 集，每集都有分析内容和剧情摘要，没有失败的集。可以进入下一步。`);
  if (String(jobState.status || '') === 'needs_review') {
    console.log('  ℹ 平台状态是 needs_review（人物身份待核）属于正常：平台只看画面，同一个人在不同集可能被记成不同的临时编号（OBS_ 开头）。');
    console.log('    这不是缺内容——不要重新分析、不要重新提交视频、不要为此花积分。人物归属由你在下一步资产整理里按剧情确定。');
  }
  console.log('  下一步由你(Agent)完成，零积分、纯本地，按顺序做（做到第 4 步停下来等用户）：');
  console.log(`   1) chenyu-pro assets-prepare --dir "${outDir}"   生成人物证据卡/场景清单/道具清单/台词清单 + 待填的资产合并表`);
  console.log('   2) 通读后按剧情填表：同一个人全剧一个名字、同一地点一个场景、只留关键道具；被喊的对象≠说话人，逐句核对');
  console.log(`   3) chenyu-pro assets-apply --dir "${outDir}"     到 ASSETS_PASS，出 整理版/video_reverse_全剧合集.md`);
  console.log('   4) 到 ASSETS_PASS 后写《洗稿建议.md》和草拟的 洗稿映射.json（"confirmed": false），连同资产整理结果一起交给用户，然后停下来。');
  console.log('      用户修改或确认后才逐集写洗稿剧本；确认之前不写任何一集（还原稿也不写）。');
  console.log(`      写完过 gate 后 chenyu-pro save --project ${pid.slice(-8)} --episode N --file 第00N集.txt`);
  return true;
}

// 项目最近一次视频分析任务的状态（给完整性结论用）
async function latestAnalysisJobState(pid) {
  try {
    const jobs = (await api(`/api/projects/${pid}/jobs`)).jobs || [];
    const job = jobs.find((j) => /video_reverse/.test(String(j.job_type || j.type || '')));
    if (!job) return {};
    let rj = job.result_json || {};
    if (typeof rj === 'string') { try { rj = JSON.parse(rj); } catch { rj = {}; } }
    return { status: String(job.status || ''), failed: (Array.isArray(rj.failed_segments) ? rj.failed_segments : []).map((item) => item.segment_id).filter(Boolean) };
  } catch { return {}; }
}

// 零积分：重新取回某个项目最新的分析稿（平台修复、追加分析后用这个取，不要重新提交视频）。
async function cmdVideoFetch() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const target = await findProject(fragment);
  if (target.mode && target.mode !== 'video_reverse') die(`项目《${target.title}》不是视频分析项目`);
  const jobs = (await api(`/api/projects/${target.id}/jobs`)).jobs || [];
  const running = jobs.find((j) => /video_reverse/.test(String(j.job_type || j.type || '')) && ['queued', 'running'].includes(String(j.status || '')));
  if (running) die(`项目《${target.title}》的分析稿正在处理（${running.message || running.status}），完成后再取`);
  const outDir = analysisOutDir(target.title);
  const { got, badSegments } = await downloadVideoAnalysis(target.id, outDir);
  if (!got) die(`项目《${target.title}》还没有分析稿`);
  console.log(`✓ 已取回《${target.title}》最新分析稿 ${got} 个文件 -> ${outDir}（零积分）`);
  const ok = printAnalysisVerdict({ outDir, pid: target.id, jobState: await latestAnalysisJobState(target.id), badSegments });
  if (!ok) process.exitCode = 2;
}

// 零积分：等项目的视频分析跑完，跑完自动取回分析稿并给出完整性结论。提交后命令被中断、或想分次查进度时用。
// 每次最多等 --timeout-min 分钟（默认 8，适配会掐长命令的 Agent 环境）；没跑完退出码 3，再跑一次即可。
async function cmdVideoWait() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const target = await findProject(fragment);
  if (target.mode && target.mode !== 'video_reverse') die(`项目《${target.title}》不是视频分析项目`);
  const outDir = analysisOutDir(target.title);
  const deadline = Date.now() + Math.max(0.2, Number(arg('timeout-min', '8')) || 8) * 60000;
  const again = `chenyu-pro video-wait --project ${target.id.slice(-8)} --out "${outDir}"`;
  let lastMsg = '';
  for (;;) {
    let jobs = null;
    try { jobs = (await api(`/api/projects/${target.id}/jobs`)).jobs || []; } catch (e) { if (!e?.netFailed) throw e; console.log(`  … 进度查询网络暂不通(${e.detail})，平台仍在后台分析`); }
    if (jobs) {
      const job = jobs.find((j) => /video_reverse/.test(String(j.job_type || j.type || '')));
      if (!job) die(`项目《${target.title}》还没有提交过视频分析`);
      const st = String(job.status || '');
      const msg = `${st} ${job.progress != null ? job.progress + '%' : ''} ${String(job.message || '').replace(/\s+/g, ' ').slice(0, 120)}`.trim();
      if (msg !== lastMsg) { console.log('  … ' + msg); lastMsg = msg; }
      if (['failed', 'cancelled', 'error'].includes(st)) die(`分析失败: ${job.message || st}\n  （定时任务可以取消了）把这条原样告诉用户，不要整批重新提交。`);
      if (!['queued', 'running', 'pending', 'processing'].includes(st)) break;
    }
    if (Date.now() >= deadline) {
      console.log(`⏳ 还在跑（${lastMsg || '排队中'}）。不是卡住，也不要重新提交。\n  隔 2~3 分钟再跑一次同一条命令（或让定时任务继续跑）：\n    ${again}`);
      process.exitCode = 3;
      return;
    }
    await sleep(15000);
  }
  const { got, badSegments } = await downloadVideoAnalysis(target.id, outDir);
  if (!got) die(`分析已结束但没取到分析稿，稍后再跑：${again}`);
  console.log(`✓ 分析已结束，已取回《${target.title}》分析稿 ${got} 个文件 -> ${outDir}（零积分）`);
  console.log('  （如果为这个项目建了定时任务/轮询，现在取消掉。）');
  const ok = printAnalysisVerdict({ outDir, pid: target.id, jobState: await latestAnalysisJobState(target.id), badSegments });
  if (!ok) process.exitCode = 2;
}

// 重建人物身份和资产表：用平台上已保存的逐段分析结果重新审计人物、重新整理资产，不重看视频、不扣视频分。
// 整理规则更新后、或者资产表合并错了，用这个重出，不要重新提交视频。只有文本步骤按次计费。
async function cmdVideoRebuild() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const target = await findProject(fragment);
  if (target.mode && target.mode !== 'video_reverse') die(`项目《${target.title}》不是视频分析项目`);
  const jobs = (await api(`/api/projects/${target.id}/jobs`)).jobs || [];
  const running = jobs.find((j) => ['queued', 'running'].includes(String(j.status || '')));
  if (running) die(`项目《${target.title}》有正在进行的任务（${running.message || running.status}），结束后再重建`);
  let episodes = 0;
  const arts = (await api(`/api/projects/${target.id}/artifacts`)).artifacts || [];
  const indexArt = arts.find((a) => String(a.filename || a.title || '') === 'episode_index.json');
  if (indexArt) { try { episodes = (JSON.parse(await fetchArtifactText(indexArt)).episodes || []).length; } catch { /* 读不到按 0 */ } }
  if (!episodes) die(`项目《${target.title}》还没有分析结果，先用 video-analyze 分析视频`);
  // 联调用：CHENYU_ASSET_CONSOLIDATION=platform 时让平台整理资产表（等同网页端）；默认由你(Agent)整理，平台跳过。
  const consolidation = String(process.env.CHENYU_ASSET_CONSOLIDATION || '').toLowerCase() === 'platform' ? 'platform' : 'agent';
  const low = 2 * Math.ceil(episodes / 10) + 2 + (consolidation === 'platform' ? 3 : 0);
  // 平台整理：人物/名牌核对/相邻配角/场景/道具/道具拆分/地名统一 + 每 8 集说话人复核两遍；连接断开会重试一次（54 集实测 600 分）
  const high = 3 * Math.ceil(episodes / 10) + 4 + (consolidation === 'platform' ? 8 + 2 * Math.ceil(episodes / 8) + Math.ceil(episodes / 20) : 0);
  console.log(`— 重建人物身份${consolidation === 'platform' ? '和资产表' : ''}（${episodes} 集，不重看视频，不扣视频分）—`);
  console.log(`  文本步骤约 ${low}~${high} 次 x ${TEXT_CALL_POINTS} 分 = ${low * TEXT_CALL_POINTS}~${high * TEXT_CALL_POINTS} 分`);
  if (!flag('yes')) die('请先把上面的预估积分告诉用户，得到同意后加 --yes 重跑');
  const balanceBefore = await pointsBalanceSafe();
  await api(`/api/projects/${target.id}/video-reverse/rebuild-identity`, { method: 'POST', body: { reaudit: true, asset_consolidation: consolidation } });
  console.log('✓ 已提交重建');
  const deadline = Date.now() + Number(arg('timeout-min', '40')) * 60000;
  let lastMsg = '';
  let done = null;
  while (Date.now() < deadline) {
    await sleep(10000);
    let list;
    try { list = (await api(`/api/projects/${target.id}/jobs`)).jobs || []; } catch (e) { if (e?.netFailed) continue; throw e; }
    const job = list.find((j) => String(j.job_type || j.type || '') === 'video_reverse_identity_rebuild');
    if (!job) continue;
    const st = String(job.status || '');
    const msg = `${st} ${job.message || ''}`.trim();
    if (msg !== lastMsg) { console.log('  … ' + msg); lastMsg = msg; }
    if (['completed', 'succeeded', 'done', 'failed', 'error'].includes(st)) { done = job; break; }
  }
  const after = await pointsBalanceSafe();
  if (balanceBefore != null && after != null) console.log(`  实际扣除 ${balanceBefore - after} 分（报价上限约 ${high * TEXT_CALL_POINTS} 分）`);
  if (!done) die('重建超时，稍后用 chenyu-pro video-fetch 取结果');
  if (!['completed', 'succeeded', 'done'].includes(String(done.status))) die('重建失败，项目原分析稿未改动: ' + (done.message || done.status));
  const outDir = analysisOutDir(target.title);
  const { got } = await downloadVideoAnalysis(target.id, outDir);
  console.log(`✓ 已重建并取回 ${got} 个文件 -> ${outDir}`);
  if (consolidation === 'agent') console.log(`  下一步（零积分）：chenyu-pro assets-prepare --dir "${outDir}"，按剧情填表后 assets-apply。`);
}

async function cmdVideoAnalyze() {
  const files = arg('video-file', '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => path.resolve(s));
  const urls = arg('video-url', '').split(',').map((s) => s.trim()).filter((s) => /^https?:\/\//i.test(s));
  if (!files.length && !urls.length) die('缺 --video-file <本地.mp4> 或 --video-url <链接>（多个用英文逗号分隔，可混用）');
  for (const f of files) if (!fs.existsSync(f)) die('视频文件不存在: ' + f);
  // 压缩是硬要求（v2.14.0），放在报价和建项目之前：读时长报价要用 ffmpeg，装不上也不会留下空项目。
  // 没有 ffmpeg 先下载自带的那份；仍没有且有文件超过 24MB 就停，不再悄悄传原片。
  const ffmpeg = flag('no-compress') ? null : (files.length ? await ensureFfmpeg() : resolveFfmpeg());
  const oversized = files.filter((f) => fs.statSync(f).size > VIDEO_UPLOAD_LIMIT_BYTES);
  if (!ffmpeg && oversized.length) {
    die(`有 ${oversized.length} 个视频超过 24MB（上游单个文件上限，超过的集分析结果会是空的），必须先压缩再传：\n` +
      oversized.slice(0, 8).map((f) => `    ${path.basename(f)}  ${(fs.statSync(f).size / 1048576).toFixed(1)}MB`).join('\n') + (oversized.length > 8 ? `\n    … 另有 ${oversized.length - 8} 个` : '') +
      `\n  本机没有可用的 ffmpeg${flag('no-compress') ? '（你加了 --no-compress）' : '，自带的那份也没下载成功'}。` +
      `\n  处理：重跑 chenyu-pro ffmpeg --install；或自行安装 ffmpeg 后设环境变量 CHENYU_FFMPEG 指向 ffmpeg.exe。本次没有上传、没有扣分。`);
  }
  if (ffmpeg) console.log("  上传前压缩：只降码率、不缩分辨率，每集压到 22MB 以内（计费按时长不变）");
  else if (files.length) console.log('  没有 ffmpeg，本批视频都在 24MB 以内，直接传原片。');

  // ⓪ 同一部剧只用一个项目：--project 追加到已有项目；集号按文件名。
  const projectFragment = arg('project', '');
  let target = null;
  let existingEpisodes = [];
  let failedEpisodes = [];
  if (projectFragment) {
    target = await findProject(projectFragment);
    if (target.mode && target.mode !== 'video_reverse') die(`项目《${target.title}》不是视频分析项目，不能追加视频`);
    const jobs = (await api(`/api/projects/${target.id}/jobs`)).jobs || [];
    if (jobs.some((j) => String(j.job_type || j.type || '') === 'video_reverse_analysis' && ['queued', 'running'].includes(String(j.status || '')))) {
      die(`项目《${target.title}》正在分析上一批，等它结束再追加（同一部剧不要并发提交）`);
    }
    const arts = (await api(`/api/projects/${target.id}/artifacts`)).artifacts || [];
    const indexArt = arts.find((a) => String(a.filename || a.title || '') === 'episode_index.json');
    if (indexArt) {
      // 只算真正分析出内容的集：分析失败的集（没有摘要）在剧集索引里也会占一行，重交它不算重复分析。
      try {
        const indexed = JSON.parse(await fetchArtifactText(indexArt)).episodes || [];
        const analyzed = (e) => (Array.isArray(e.summaries) ? e.summaries : []).some((s) => String(s || '').trim());
        existingEpisodes = indexed.filter(analyzed).map((e) => String(e.episode_id || '')).filter(Boolean);
        failedEpisodes = indexed.filter((e) => !analyzed(e)).map((e) => String(e.episode_id || '')).filter(Boolean);
      } catch { /* 读不到按空 */ }
    }
  }
  // 集号：--episodes 2,3,5（按 --video-file 的顺序一一对应）最优先；否则从文件名取。
  const explicitEpisodes = arg('episodes', '').split(',').map((s) => Number(String(s).trim())).filter((n) => Number.isInteger(n) && n > 0);
  if (arg('episodes', '') && (explicitEpisodes.length !== files.length || new Set(explicitEpisodes).size !== explicitEpisodes.length)) {
    die(`--episodes 要和 --video-file 一一对应：给了 ${files.length} 个视频、${explicitEpisodes.length} 个不重复的集号`);
  }
  const parsedNumbers = explicitEpisodes.length ? explicitEpisodes : files.map((f) => episodeNumberFromName(f));
  const useFileNumbers = files.length > 0 && parsedNumbers.every((n) => n > 0) && new Set(parsedNumbers).size === parsedNumbers.length;
  const existingMax = existingEpisodes.reduce((max, id) => Math.max(max, Number(String(id).replace(/\D/g, '')) || 0), 0);
  // 追加到已有项目但集号取不到：以前会悄悄接在最后一集后面顺序编号——补失败集时就编错位置
  // （2026-10-04 实例：文件名「9月15日-2.mp4」，补第 2、3、5…集被编成 EP072–EP088）。有缺集/失败集时必须明确集号。
  if (target && files.length && !useFileNumbers) {
    const have = new Set(existingEpisodes.map((id) => Number(String(id).replace(/\D/g, '')) || 0));
    const gaps = [];
    for (let n = 1; n <= existingMax; n += 1) if (!have.has(n)) gaps.push(n);
    const missing = [...new Set([...gaps, ...failedEpisodes.map((id) => Number(String(id).replace(/\D/g, '')) || 0)])].filter((n) => n > 0).sort((a, b) => a - b);
    if (missing.length) {
      die(`从文件名取不到集号（取到的是：${files.map((f, i) => `${path.basename(f)}→${parsedNumbers[i] || '无'}`).slice(0, 6).join('，')}${files.length > 6 ? ' …' : ''}），\n` +
        `而项目《${target.title}》里还有集没有分析结果：第 ${missing.slice(0, 30).join('、')} 集。\n` +
        `  补这些集请写明集号（和 --video-file 的顺序一一对应）：--episodes ${missing.slice(0, Math.min(files.length, 30)).join(',')}\n` +
        `  本次没有上传、没有扣分。`);
    }
  }
  if (useFileNumbers && !target && Math.min(...parsedNumbers) > 1 && !flag('new-series')) {
    die(`文件名看起来是第 ${Math.min(...parsedNumbers)} 集起，不是从第 1 集开始。\n` +
      '同一部剧必须放在同一个项目里（否则每集各认各的人，角色重复、对不上）：\n' +
      '  - 已经分析过前面的集：加 --project <那个项目的id片段或剧名> 追加\n' +
      '  - 还没分析过：把前面的集一起提交，或确认只分析这几集时加 --new-series');
  }
  if (useFileNumbers && existingEpisodes.length && !flag('reanalyze')) {
    const dup = parsedNumbers.map(episodeIdOf).filter((id) => existingEpisodes.includes(id));
    if (dup.length) die(`这些集项目里已经分析过：${dup.join(', ')}（重复分析会再扣分）。确需重做加 --reanalyze`);
  }

  // ① 先报价：必须把预估积分告诉用户、得到同意后再加 --yes 重跑
  let measured = 0, segments = 0, unknown = urls.length;
  // 每集测到的时长要传给平台：平台按它切段、检查分析有没有漏掉时间段；不传平台只能按 120 秒估算。
  const fileDurations = files.map((f) => probeDurationSeconds(f));
  for (const d of fileDurations) {
    if (d > 0) { measured += d; segments += Math.ceil(d / SEGMENT_SECONDS); } else unknown += 1;
  }
  // 视频分析之后，平台还要对整部剧（本次 + 项目已有的集）做人物身份审计等文本步骤，每次 TEXT_CALL_POINTS 分。
  // 次数随集数增长：约每 10 集 2~3 次，另加 2~4 次复核（真实数据：6 集 4 次，54 集 19 次）。
  const seriesEpisodes = existingEpisodes.length + files.length + urls.length;
  const textCallsLow = 2 * Math.ceil(seriesEpisodes / 10) + 2;
  const textCallsHigh = 3 * Math.ceil(seriesEpisodes / 10) + 4;
  const videoPoints = (segments + unknown) * POINTS_PER_SEGMENT;
  console.log('— 视频分析计费（仅分析走平台积分；写作由你 Agent 完成，零积分）—');
  if (segments) console.log(`  可测时长 ${Math.round(measured)} 秒 → ${segments} 段 x ${POINTS_PER_SEGMENT} 分 = 约 ${segments * POINTS_PER_SEGMENT} 分`);
  if (unknown) console.log(`  另有 ${unknown} 个来源本地测不到时长，按 ${POINTS_PER_SEGMENT} 分 / ${SEGMENT_SECONDS} 秒计（不足一段按一段）`);
  console.log(`  人物身份审计等文本步骤（按全剧 ${seriesEpisodes} 集）：约 ${textCallsLow}~${textCallsHigh} 次 x ${TEXT_CALL_POINTS} 分 = ${textCallsLow * TEXT_CALL_POINTS}~${textCallsHigh * TEXT_CALL_POINTS} 分`);
  // 视频层复查：有名牌或群戏的段按「说这句话时的原片关键帧」核对一次谁在开口；其余段说话人拿不准再看一次。每段最多一次，按段计费。
  const recheckHigh = videoPoints;
  console.log(`  视频复查（群戏/名牌段按关键帧核对谁在开口，或说话人拿不准的段再看一次，不一定发生）：0~${recheckHigh} 分`);
  console.log(`  合计约 ${videoPoints + textCallsLow * TEXT_CALL_POINTS}~${videoPoints + recheckHigh + textCallsHigh * TEXT_CALL_POINTS} 分`);
  if (!flag('yes')) die('请先把上面的预估积分告诉用户，得到同意后加 --yes 重跑');
  const quoted = videoPoints + recheckHigh + textCallsHigh * TEXT_CALL_POINTS;
  const balanceBefore = await pointsBalanceSafe();
  const reportCharge = async () => {
    const after = await pointsBalanceSafe();
    if (balanceBefore == null || after == null) return;
    const spent = balanceBefore - after;
    console.log(`  实际扣除 ${spent} 分（报价上限约 ${quoted} 分）${spent > quoted ? ' ⚠ 超出报价，请把这条原样告诉用户并反馈平台（同一账号同时跑别的任务时，这个差额会把别的任务也算进来）' : ''}`);
  };

  // ② 建 video_reverse 项目（或追加到 --project 指定的项目）：不设 auto_rewrite，平台分析完不会接着洗稿
  const count = files.length + urls.length;
  let pid = target?.id || '';
  const folderTitle = files.length ? inferTitleFromDir(path.dirname(path.resolve(files[0]))) : '';
  const title = target?.title || arg('title') || (folderTitle && !/^(downloads?|desktop|documents?|videos?|下载|桌面|文档|视频)$/i.test(folderTitle) ? folderTitle : '') || ('视频分析·' + new Date().toISOString().slice(0, 16).replace(/[-:T]/g, ''));
  if (!pid) {
    const totalEpisodes = useFileNumbers ? Math.max(count, ...parsedNumbers) : count;
    const created = await api('/api/projects', { method: 'POST', body: {
      title, working_title: title, mode: 'video_reverse',
      total_episodes: totalEpisodes, batch_episodes: Math.min(3, totalEpisodes), quality_tier: 'strong_review',
      config: {
        genre: '短剧', audience: '待确认', production_format: '真人剧',
        source_type: 'video_reverse_series', model_strategy: 'balanced',
        // write_mode=faithful：原片项目默认 1:1 还原；网页「开始生成」也按这个预设走，不会改写台词/改剧情。
        config_json: { created_from: 'chenyu-pro-cli-agent', authoring: 'agent', write_mode: 'faithful' }
      }
    } });
    pid = created.project?.id || created.id;
    if (!pid) die('建项目失败');
    console.log(`✓ 项目已建: ${pid.slice(-8)}  《${title}》`);
  } else {
    console.log(`✓ 追加到已有项目: ${pid.slice(-8)}  《${title}》（已分析 ${existingEpisodes.length} 集，本次和已有集一起做人物审计）`);
  }

  // ③ 上传本地视频：每个视频单独超时+重试（每次换新上传地址），传成功的记到本地清单，
  // 断网/超时后用同一条命令加 --project 重跑会跳过已传的，只补没传的。
  // 2026-09-21：38 集里一个超时就整批退出、重跑又从头全传，移动线路到存储不稳时永远传不完。
  const cacheDir = path.join(CONFIG_DIR, 'uploads');
  const cachePath = path.join(cacheDir, `${pid}.json`);
  let uploadCache = {};
  try { uploadCache = JSON.parse(fs.readFileSync(cachePath, 'utf8')) || {}; } catch {}
  // 上次分析失败的集重交时不复用旧上传：失败可能就是那份上传的文件坏了，复用只会一直失败。
  if (failedEpisodes.length && useFileNumbers) {
    files.forEach((f, i) => {
      if (!failedEpisodes.includes(episodeIdOf(parsedNumbers[i]))) return;
      const prefix = `${path.resolve(f)}|`;
      for (const key of Object.keys(uploadCache)) if (key.startsWith(prefix)) delete uploadCache[key];
    });
  }
  const saveCache = () => {
    try { fs.mkdirSync(cacheDir, { recursive: true }); fs.writeFileSync(cachePath, JSON.stringify(uploadCache, null, 1)); } catch {}
  };
  const proxyDir = path.join(CONFIG_DIR, 'proxy');
  const concurrency = Math.max(1, Math.min(4, Number(arg('upload-concurrency', '2')) || 2));
  const maxAttempts = Math.max(1, Number(arg('upload-retries', '4')) || 4);
  const uploaded = [];
  const failed = [];
  let next = 0;
  const uploadOne = async (i) => {
    const fp = files[i];
    const name = path.basename(fp);
    const mime = guessVideoMime(name);
    const stat = fs.statSync(fp);
    const size = stat.size;
    // 压缩参数也进缓存键：画质规则改了（v2.9.0 不缩分辨率、只降码率）就重新压、重新传，不复用旧的低清上传
    const cacheKey = `${path.resolve(fp)}|${size}|${Math.round(stat.mtimeMs)}|${ffmpeg ? 'cap22mb-v1' : 'orig'}`;
    if (uploadCache[cacheKey]?.client_media_path) {
      uploaded[i] = uploadCache[cacheKey];
      console.log(`  ✓ 已传过，跳过 ${name}`);
      return;
    }
    // 上传前压缩：有 ffmpeg 就压到代理分辨率；压完更大或失败都回退原片。压缩后的文件才是实际上传体。
    let sendPath = fp;
    let sendSize = size;
    let proxyTmp = '';
    if (ffmpeg) {
      try {
        fs.mkdirSync(proxyDir, { recursive: true });
        // 临时文件名必须带进程号：同时开两个窗口压缩同一个视频时，旧命名会让两个 ffmpeg 写同一个文件，
        // 上传的是写坏的视频，上游判「参数无效」（2026-09-30 联调实测：两条路同时跑，其中一路的第 2 集连续失败）。
        const tmp = path.join(proxyDir, `p${process.pid}_${Date.now().toString(36)}_${i}_${name.replace(/[^\w.\-]+/g, '_')}.mp4`);
        const durationSec = ffmpegDurationSeconds(ffmpeg, fp);
        await compressVideoProxy(ffmpeg, fp, tmp, durationSec);
        let tsize = fs.statSync(tmp).size;
        // 码率控制有误差：压完仍超过 23.5MB 就按超出的比例再压一次
        if (tsize > VIDEO_UPLOAD_LIMIT_BYTES - 512 * 1024) {
          await compressVideoProxy(ffmpeg, fp, tmp, durationSec, Math.min(0.85, (VIDEO_TARGET_BYTES / tsize) * 0.95));
          tsize = fs.statSync(tmp).size;
        }
        // 压完更小才用压缩版；原片本来就在上限内且压完没变小的，传原片
        if (tsize > 0 && (tsize < size || size > VIDEO_UPLOAD_LIMIT_BYTES)) { sendPath = tmp; sendSize = tsize; proxyTmp = tmp; }
        else { try { fs.rmSync(tmp, { force: true }); } catch { /* ignore */ } }
      } catch (error) {
        if (size > VIDEO_UPLOAD_LIMIT_BYTES) { failed.push({ name, error: `压缩失败且原片 ${(size / 1048576).toFixed(1)}MB 超过 24MB 上限：${String(error?.message || error).slice(0, 60)}` }); return; }
        console.log(`  … ${name} 压缩失败(${String(error?.message || error).slice(0, 40)})，原片在 24MB 以内，改传原片`);
      }
    }
    if (sendSize > VIDEO_UPLOAD_LIMIT_BYTES) { failed.push({ name, error: `压缩后仍有 ${(sendSize / 1048576).toFixed(1)}MB，超过 24MB 上限（这一集太长，请先剪成更短的段）` }); return; }
    const body = fs.readFileSync(sendPath);
    // 超时按体积放宽：至少 3 分钟，按 50KB/s 最慢速度估算
    const timeoutMs = Math.max(180000, Math.ceil(sendSize / 50000) * 1000);
    const cleanupProxy = () => { if (proxyTmp) { try { fs.rmSync(proxyTmp, { force: true }); } catch { /* ignore */ } } };
    let lastError = '';
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const signed = await api(`/api/projects/${pid}/client-media/signed-upload`, { method: 'POST', body: { kind: 'video', filename: name, mimeType: mime, size: sendSize } });
        const uploadUrl = signed.upload?.uploadUrl || signed.uploadUrl;
        const mediaPath = signed.upload?.path || signed.path;
        if (!uploadUrl || !mediaPath) throw new Error('获取视频上传地址失败');
        const put = await fetch(uploadUrl, { method: 'PUT', body, headers: { 'Content-Type': mime }, signal: AbortSignal.timeout(timeoutMs) });
        if (!put.ok) throw new Error(`HTTP ${put.status}`);
        uploaded[i] = { client_media_path: mediaPath, title: name, mime_type: mime, size_bytes: sendSize };
        uploadCache[cacheKey] = uploaded[i];
        saveCache();
        cleanupProxy();
        const label = proxyTmp ? `${(sendSize / 1048576).toFixed(1)}MB，压自 ${(size / 1048576).toFixed(1)}MB` : `${(sendSize / 1048576).toFixed(1)}MB`;
        console.log(`  ✓ 已上传 ${name} (${label})${attempt > 1 ? `，第 ${attempt} 次成功` : ''}`);
        return;
      } catch (error) {
        const cause = error?.cause?.code || error?.cause?.message || '';
        lastError = `${error?.name === 'TimeoutError' ? '超时' : error?.message || error}${cause ? ` (${cause})` : ''}`;
        if (attempt < maxAttempts) {
          console.log(`  … ${name} 第 ${attempt} 次上传失败：${lastError}，${attempt * 10} 秒后重试`);
          await sleep(attempt * 10000);
        }
      }
    }
    cleanupProxy();
    failed.push({ name, error: lastError });
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, files.length || 1) }, async () => {
    for (let i = next++; i < files.length; i = next++) await uploadOne(i);
  }));
  if (failed.length) {
    for (const item of failed) console.log(`  ✗ ${item.name}：${item.error}`);
    die(`${failed.length} 个视频没传上去（原因见上），本次没有提交分析、没有扣分。\n` +
      `  已传成功的 ${uploaded.filter(Boolean).length} 个已记录，重跑时会跳过。请用同一条命令加 --project ${pid.slice(-8)} 重跑，\n` +
      `  只会补传没传上的；网络持续超时可换网络（如手机热点）或加 --upload-concurrency 1。`);
  }

  // ④ 只分析：不传 auto_start_workflow，平台不会接着代写
  // 集号：文件名能取到就用文件名；否则接在项目已有集之后按顺序编。
  let nextEpisode = Math.max(existingMax, useFileNumbers ? Math.max(...parsedNumbers) : 0) + 1;
  const videos = urls.map((u) => ({ video_url: u, episode_id: episodeIdOf(nextEpisode++) }));
  uploaded.forEach((u, i) => {
    if (!u) return;
    const duration = fileDurations[i] > 0 ? Math.round(fileDurations[i] * 1000) / 1000 : 0;
    videos.push({ ...u, ...(duration ? { duration_seconds: duration } : {}), episode_id: useFileNumbers ? episodeIdOf(parsedNumbers[i]) : episodeIdOf(nextEpisode++) });
  });
  console.log(`  集号: ${videos.map((v) => v.episode_id).join(', ')}`);
  const note = arg('analysis-note', '');
  // asset_consolidation=agent：场景/道具按剧情合并由你(Agent)在本地做(assets-prepare/apply)，平台不重复整理。
  // 联调用：CHENYU_ASSET_CONSOLIDATION=platform 时让平台整理（等同网页端提交），用来对比两条路的结果。
  const consolidation = String(process.env.CHENYU_ASSET_CONSOLIDATION || '').toLowerCase() === 'platform' ? 'platform' : 'agent';
  // 联调用：CHENYU_DIALOGUE_TIMELINE=qwen|gemini|auto 先出台词时间表再分析（不传=平台默认）。
  const dialogueTimeline = String(process.env.CHENYU_DIALOGUE_TIMELINE || '').trim().toLowerCase();
  await api(`/api/projects/${pid}/video-reverse/start`, { method: 'POST', body: { videos, asset_consolidation: consolidation, ...(dialogueTimeline ? { dialogue_timeline: dialogueTimeline } : {}), ...(note ? { prompt: note } : {}) } });
  console.log(`✓ 已提交分析 ${videos.length} 个视频（仅分析，不代写）`);
  // 提交成功后平台在后台跑，和本命令是否还活着无关。很多 Agent 环境会在几分钟后掐掉长命令——把接着等的办法先说清楚。
  console.log(`ℹ 分析在平台后台进行（大任务可能几十分钟）。本命令会一直等到结束并自动取回；如果它被你的环境中断/超时：\n` +
    `   不要重新提交（会重复扣分）。接着等：chenyu-pro video-wait --project ${pid.slice(-8)} --out "${analysisOutDir(title)}"\n` +
    `   video-wait 每次最多等几分钟，没结束会返回「还在跑」——那就隔 2~3 分钟再跑一次，或建一个定时任务去跑，直到它打印「分析稿完整性」；拿到结果后把定时任务取消。`);
  if (flag('no-wait')) return;

  // ⑤ 轮询到分析结束
  const deadline = Date.now() + Number(arg('timeout-min', '90')) * 60000;
  let lastMsg = '';
  let partial = '';
  let identityOnly = false;
  let analysisEnded = false;
  let netFailStreak = 0;
  while (Date.now() < deadline) {
    await sleep(15000);
    let jobs;
    try {
      jobs = (await api(`/api/projects/${pid}/jobs`)).jobs || [];
      netFailStreak = 0;
    } catch (e) {
      // 进度查询网络暂时不通：平台仍在后台分析，绝不崩掉整个任务，下一轮继续查。
      if (e?.netFailed) { netFailStreak++; console.log(`  … 进度查询网络暂不通(${e.detail})，平台仍在后台分析，${netFailStreak} 次，继续等待…`); continue; }
      throw e;
    }
    const job = jobs.find((j) => String(j.type || j.job_type || '').includes('video_reverse')) || jobs[0];
    if (!job) continue;
    const st = String(job.status || '');
    const msg = `${st} ${job.progress != null ? job.progress + '%' : ''} ${job.message || ''}`.trim();
    if (msg !== lastMsg) { console.log('  … ' + msg); lastMsg = msg; }
    if (['succeeded', 'completed', 'done'].includes(st)) { analysisEnded = true; break; }
    // needs_review = 部分段未完成或需复核：已完成的段照常取回，不整批重交（重交会对已成功段重复扣分）。
    if (st === 'needs_review') {
      let rj = job.result_json || {};
      if (typeof rj === 'string') { try { rj = JSON.parse(rj); } catch { rj = {}; } }
      const failed = Array.isArray(rj.failed_segments) ? rj.failed_segments : [];
      // 没有失败段 = 分析完整，只是平台自动改编用的人物身份门没过（单包项目几乎必出），不是缺内容。
      if (failed.length) partial = `未完成的段: ${failed.map((f) => f.segment_id).join(', ')}`;
      else identityOnly = true;
      analysisEnded = true;
      break;
    }
    if (['failed', 'cancelled', 'error'].includes(st)) { await reportCharge(); die('分析失败: ' + (job.message || st)); }
  }

  if (!analysisEnded) {
    // 等到本命令的上限还没结束：平台还在跑。这时去取分析稿拿到的是旧稿（或没有），不能当成完成。
    console.log(`⏳ 等了 ${arg('timeout-min', '90')} 分钟分析还没结束（平台仍在后台跑，不是失败，不要重新提交）。\n  接着等：chenyu-pro video-wait --project ${pid.slice(-8)} --out "${analysisOutDir(title)}"`);
    process.exitCode = 3;
    return;
  }
  // ⑥ 取回分析稿交给 Agent
  const outDir = analysisOutDir(title);
  const { got, badSegments } = await downloadVideoAnalysis(pid, outDir);
  await reportCharge();
  if (badSegments.length) {
    console.log(`⛔ 以下段分析稿不完整（缺画面动作/镜头表）：\n  ${badSegments.join('\n  ')}\n  不要据此写作、不要用占位话凑 △——先原样告诉用户，由平台核实后重跑或退分。`);
  }
  if (!got) {
    console.log(`⚠ 分析已结束但未取到分析稿，用 chenyu-pro status --project ${pid.slice(-8)} 复查`);
    return;
  }
  console.log(`✓ 分析稿已取回 ${got} 个文件 -> ${outDir}`);
  console.log(`ℹ 这部剧后面的集请追加到同一个项目：chenyu-pro video-analyze --project ${pid.slice(-8)} --video-file 第N集.mp4 [--yes]`);
  if (partial) {
    // 全部集都拿到结果才交付（v2.14.1）：平台已对临时性失败追加重试过，仍缺的集只补这几集，已成功的不会重复扣分。
    console.log(`⛔ 还有集没分析成功：${partial}\n  全部集都拿到分析结果才能往下写、才能交付——不要拿不完整的分析稿写剧本，也不要跳过缺的集。\n` +
      `  补分析（只传缺的那几集，已成功的集不会重复扣分）：\n    chenyu-pro video-analyze --project ${pid.slice(-8)} --video-file <缺的集.mp4,逗号分隔> --episodes <对应集号,逗号分隔> --yes\n` +
      `  补了仍失败，把上面的缺集清单原样告诉用户，由平台核实。`);
    process.exitCode = 2;
  }
  if (partial) return; // 上面已经说明缺哪几集、怎么补
  const ok = printAnalysisVerdict({ outDir, pid, jobState: { status: identityOnly ? 'needs_review' : 'completed', failed: [] }, badSegments });
  if (!ok) process.exitCode = 2;
}

// ───────────── 资产整理（纯本地、零积分、不联网）─────────────
// 分工：平台看视频画面，给出逐集客观记录和剧情大纲；同一个人/地点/物件在不同集写法不同，
// 按剧情合并归类由 Agent 做。证据、合并表格式、校验、落地都在共用模块 asset_workbook.mjs 里，
// 平台自己整理时用的是同一份。
const ASSET_DIR = '资产整理';
const ASSET_MAP_FILE = '资产合并表.json';

function readDossierOrDie(dir) {
  const file = path.join(dir, DOSSIER_FILE);
  if (!fs.existsSync(file)) die(`目录里没有 ${DOSSIER_FILE}: ${dir}\n  视频：先用 chenyu-pro video-analyze 或 video-fetch 取回分析稿；现成剧本或小说：先跑 chenyu-pro text-analyze --src <剧本目录|文件> --out <分析稿目录>`);
  try { return parseDossier(fs.readFileSync(file, 'utf8')); } catch (e) { die(`${e.message}，请 chenyu-pro video-fetch 重新取回`); }
}

// text-analyze：现成剧本 / 小说没有视频分析稿，先整理成同一种分析稿，后面的资产合并、建议、写作、检查和视频反推走同一条链路。
async function cmdTextAnalyze() {
  const ta = await import('./text_analyze.mjs');
  const usage = '用法: chenyu-pro text-analyze --src <剧本目录|剧本文件|小说.txt> --out <分析稿目录>   （小说填完提取表后: text-analyze --build --out <分析稿目录>）';
  const outDir = path.resolve(arg('out', '') || die(usage));
  fs.mkdirSync(outDir, { recursive: true });
  const unitsDir = path.join(outDir, ta.TEXT_UNITS_DIR);
  const finish = (episodes, sourceKind) => {
    fs.writeFileSync(path.join(outDir, DOSSIER_FILE), ta.buildDossier(episodes, { sourceKind, title: arg('title', '') }), 'utf8');
    try { saveConfig({ ...loadConfig(), last_analysis_dir: outDir }); } catch { /* 记不住不影响 */ }
    const rows = episodes.reduce((n, e) => n + e.rows.length, 0);
    console.log(`✓ 文字分析稿 -> ${path.join(outDir, DOSSIER_FILE)}（${sourceKind}，${episodes.length} 集/段，${rows} 行；零积分、未联网）`);
    console.log('  从这一步起和视频反推完全一样，按顺序做（做到第 4 步停下来等用户）：');
    console.log(`   1) chenyu-pro assets-prepare --dir "${outDir}"   生成人物证据卡/场景清单/道具清单/台词清单 + 待填的资产合并表`);
    console.log('   2) 通读后按剧情填表：同一个人全剧一个名字、同一地点一个场景、只留关键道具');
    console.log(`   3) chenyu-pro assets-apply --dir "${outDir}"     到 ASSETS_PASS`);
    console.log('   4) 写《洗稿建议.md》（小说写改编建议）和草拟的 洗稿映射.json（"confirmed": false），连同资产整理结果交给用户，然后停下来。用户修改或确认后才逐集写。');
  };
  if (flag('build')) {
    const dir = path.join(unitsDir, '提取');
    if (!fs.existsSync(dir)) die(`没有找到 ${dir}：先跑 text-analyze --src <小说> --out <分析稿目录> 生成任务，再逐段填提取表`);
    const sources = fs.existsSync(path.join(unitsDir, '原文')) ? fs.readdirSync(path.join(unitsDir, '原文')).filter((n) => /^EP\d+/.test(n)) : [];
    const episodes = [], missing = [], empty = [];
    for (const name of sources.length ? sources : fs.readdirSync(dir).filter((n) => /^EP\d+\.md$/i.test(n))) {
      const n = Number(name.match(/\d+/)[0]);
      const file = path.join(dir, `EP${String(n).padStart(3, '0')}.md`);
      if (!fs.existsSync(file)) { missing.push(n); continue; }
      const unit = ta.parseUnitTable(fs.readFileSync(file, 'utf8'));
      if (!unit.rows.length) { empty.push(n); continue; }
      episodes.push({ n, file: name, summary: unit.summary, rows: unit.rows });
    }
    if (missing.length || empty.length) die(`提取还没做完：${missing.length ? `第 ${missing.join('、')} 段没有提取表；` : ''}${empty.length ? `第 ${empty.join('、')} 段的表里没有内容行（照任务书的 12 列格式填）` : ''}`);
    if (!episodes.length) die('一张提取表都没有');
    return finish(episodes.sort((a, b) => a.n - b.n), '小说（Agent 逐段提取）');
  }
  const src = path.resolve(arg('src', '') || die(usage));
  if (!fs.existsSync(src)) die('找不到: ' + src);
  // 剧本目录：每集一个文件
  if (fs.statSync(src).isDirectory()) {
    const files = listScriptFiles(src).filter((f) => episodeNoOfFile(path.basename(f)) > 0);
    if (!files.length) die('目录里没有文件名带「第N集」的剧本。小说或单个文件请直接把文件路径传给 --src');
    const episodes = files.map((f) => { const parsed = ta.scriptEpisodeRows(fs.readFileSync(f, 'utf8')); return { n: episodeNoOfFile(path.basename(f)), file: path.basename(f), title: parsed.title, rows: parsed.rows }; });
    const bad = episodes.filter((e) => !e.rows.length).map((e) => e.n);
    if (bad.length) die(`第 ${bad.join('、')} 集没有读出任何台词或动作行：不是「场次头 + △动作 + 角色：台词」的格式。格式不同的剧本把整份文件传给 --src，按小说的方式由你逐段提取`);
    return finish(episodes, '现成剧本（程序按格式直接转）');
  }
  if (/\.docx?$/i.test(src)) die('请先把 Word 另存为 .txt 再传进来');
  const text = fs.readFileSync(src, 'utf8').replace(/^﻿/, '');
  // 单个文件里是合并的分集剧本：按「第N集」切开直接转
  const parts = text.split(/^(?=第\s*\d+\s*集)/m).filter((p) => /^第\s*\d+\s*集/.test(p));
  if (parts.length >= 1 && ta.looksLikeScript(text)) {
    const episodes = parts.map((p) => { const parsed = ta.scriptEpisodeRows(p); return { n: Number(p.match(/^第\s*(\d+)\s*集/)[1]), file: `第${p.match(/^第\s*(\d+)\s*集/)[1]}集`, title: parsed.title, rows: parsed.rows }; }).filter((e) => e.rows.length);
    if (episodes.length) return finish(episodes, '现成剧本（程序按格式直接转）');
  }
  // 小说 / 没有固定格式的文本：分段，出任务书，由 Agent 逐段提取
  const chapters = ta.splitNovel(text);
  fs.mkdirSync(path.join(unitsDir, '原文'), { recursive: true });
  fs.mkdirSync(path.join(unitsDir, '提取'), { recursive: true });
  chapters.forEach((c, i) => fs.writeFileSync(path.join(unitsDir, '原文', `EP${String(i + 1).padStart(3, '0')}.txt`), `${c.title}\n\n${c.text}\n`, 'utf8'));
  fs.writeFileSync(path.join(unitsDir, '提取任务.md'), ta.novelTaskText(chapters.length), 'utf8');
  console.log(`✓ 原文已切成 ${chapters.length} 段 -> ${path.join(unitsDir, '原文')}（共 ${text.length} 字；零积分、未联网）`);
  console.log(`  这一步相当于视频分析，由你(Agent)来做：读 ${path.join(unitsDir, '提取任务.md')}，逐段把 原文/EPnnn.txt 提取成 提取/EPnnn.md（段多就分给子代理，各做各的段）。`);
  console.log(`  全部填完: chenyu-pro text-analyze --build --out "${outDir}"   合成分析稿，之后走 assets-prepare（和视频反推同一条链路）`);
}

function cmdAssetsPrepare() {
  const dir = resolveAnalysisDir();
  const dossier = readDossierOrDie(dir);
  const files = renderEvidenceFiles(dossier, collectAssetEvidence(dossier));
  const outDir = path.join(dir, ASSET_DIR);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, '整理规则.md'), files.rules, 'utf8');
  fs.writeFileSync(path.join(outDir, '人物证据卡.md'), files.cards, 'utf8');
  fs.writeFileSync(path.join(outDir, '场景清单.md'), files.scenes, 'utf8');
  fs.writeFileSync(path.join(outDir, '道具清单.md'), files.props, 'utf8');
  fs.writeFileSync(path.join(outDir, '台词清单.md'), files.lines, 'utf8');
  const mapFile = path.join(outDir, ASSET_MAP_FILE);
  const target = fs.existsSync(mapFile) ? path.join(outDir, '资产合并表.模板.json') : mapFile;
  fs.writeFileSync(target, JSON.stringify(files.template, null, 1), 'utf8');

  console.log(`✓ 资产证据已整理 -> ${outDir}（零积分，未联网）`);
  console.log(`  人物标签 ${files.counts.labels} 个（其中观察编号 ${files.counts.observed} 个）｜场景写法 ${files.counts.scenes} 种｜道具写法 ${files.counts.props} 种`);
  console.log(`  待填: ${target}${target === mapFile ? '' : '（已有合并表，模板另存，没有覆盖你填过的）'}`);
  console.log('  下一步（你 Agent 做）：先读 整理规则.md，再通读 人物证据卡.md / 场景清单.md / 道具清单.md / 台词清单.md，按剧情填写资产合并表：');
  console.log('   1) characters 列出全剧正式人物；labels 里每个标签填归属（同一个人全剧一个名字）');
  console.log('   2) scenes 里每集每个地点写法填场景名（同一地点一个名字，写成「归属+房间」）');
  console.log('   3) props 只列推动剧情的关键道具，writings 写合并进来的原写法；蛊虫/动物角色写进 creatures');
  console.log('   4) 逐句读 台词清单.md 核对说话人，标错的用 line_overrides 按集+时间码改正；拿不准的写进 review，不要硬改');
  console.log(`  填完: chenyu-pro assets-apply --dir "${dir}"   直到 ASSETS_PASS`);
}

function cmdAssetsApply() {
  const dir = resolveAnalysisDir();
  const mapFile = path.resolve(arg('map', path.join(dir, ASSET_DIR, ASSET_MAP_FILE)));
  const outDir = path.resolve(arg('out', path.join(dir, '整理版')));
  const dossier = readDossierOrDie(dir);
  const evidence = collectAssetEvidence(dossier);
  if (!fs.existsSync(mapFile)) die(`没有找到资产合并表: ${mapFile}\n  先跑 chenyu-pro assets-prepare --dir <分析稿目录>，填好后再 apply`);
  let raw;
  try { raw = JSON.parse(fs.readFileSync(mapFile, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`资产合并表不是合法 JSON: ${e.message}`); }
  const map = normalizeAssetMap(raw);
  const checked = checkAssetMap(map, evidence);
  if (checked.problems.length) {
    console.log(`ASSETS_FAIL  资产合并表还有 ${checked.problems.length} 处要补（分析稿没有被改动）：`);
    for (const p of checked.problems.slice(0, 40)) console.log('  ✗ ' + p);
    if (checked.problems.length > 40) console.log(`  … 另有 ${checked.problems.length - 40} 处`);
    for (const w of checked.warnings) console.log('  ⚠ ' + w);
    process.exit(1);
  }
  let result;
  try { result = applyAssetMap(dossier, evidence, map, checked, { by: ' Agent ' }); } catch (e) { die(`${e.message}。请把这条信息原样告诉用户。`); }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, DOSSIER_FILE), result.dossierText, 'utf8');
  for (const fn of ['video_reverse_replay_script.md', 'video_reverse_source.md']) {
    const src = path.join(dir, fn);
    if (fs.existsSync(src)) fs.writeFileSync(path.join(outDir, fn), result.relabel(fs.readFileSync(src, 'utf8')), 'utf8');
  }
  fs.writeFileSync(path.join(outDir, '资产合并表.md'), result.mapMarkdown, 'utf8');
  const s = result.stats;
  for (const w of [...checked.warnings, ...result.warnings]) console.log('  ⚠ ' + w);
  // 人物合并复核：合并后还剩下的「称谓/职业/镜头描述式」角色里戏份不小的，逐个要依据（是不是某个具名角色、剧里有没有名字）。
  const roleReview = prepareRoleReview(dir, result.dossierText, map);
  if (roleReview.pending.length) {
    console.log(`ASSETS_REVIEW_PENDING  表已填全（整理版已写出 -> ${outDir}），但还有 ${roleReview.pending.length}/${roleReview.total} 个称谓角色没复核——同一个人常被记成不同称呼，合并通过不等于合对了：`);
    for (const line of roleReview.pending.slice(0, 30)) console.log('  ✗ ' + line);
    if (roleReview.pending.length > 30) console.log(`  … 另有 ${roleReview.pending.length - 30} 个`);
    console.log(`  先读 ${roleReview.reviewFile}（每个角色的出现集、台词样例、同集出场的具名角色），逐个判断：\n   · 是某个具名角色 → 回 资产合并表.json 并掉；剧里有名字 → 改成真名。重跑本命令后它会自动消失。\n   · 确实是没名字的独立角色 → 在 ${roleReview.decisionFile} 里填 decision=independent + reason。\n  全部处理完重跑本命令，直到 ASSETS_PASS。\n  条目多、想快：chenyu-pro review-split --dir "${dir}" 分包后让子代理并行做，再 review-merge。`);
    process.exit(2);
  }
  if (roleReview.total) console.log(`  称谓角色复核 ${roleReview.total} 个已全部确认为独立角色（有依据）`);
  // 形象变体：分析结果一回来就定（和人物合并是同一步）。候选来自平台的 character_variants.json，每条都要表态，没表态完不给 PASS。
  const variantState = prepareVariantDecisions(dir, map);
  if (variantState.pending.length) {
    console.log(`ASSETS_VARIANTS_PENDING  人物/场景/道具已合并（整理版已写出 -> ${outDir}），但形象变体还有 ${variantState.pending.length}/${variantState.total} 条没定：`);
    for (const line of variantState.pending.slice(0, 30)) console.log('  ✗ ' + line);
    if (variantState.pending.length > 30) console.log(`  … 另有 ${variantState.pending.length - 30} 条`);
    console.log(`  先读 ${variantState.candidateFile}（平台记下的每个角色主造型以外的造型：哪几集、什么样、因何而变），\n  再逐条填 ${variantState.decisionFile}：decision=build（写 variant 变体名，身份/事件命名）或 skip（写 reason）。\n  强信号（住院、受伤包扎、怀孕、婚礼、伪装、年龄段不同…）默认要建。填完重跑本命令，直到 ASSETS_PASS。`);
    process.exit(2);
  }
  if (variantState.total) console.log(`  形象变体 ${variantState.total} 条候选已全部表态：建 ${variantState.built} 个、不建 ${variantState.skipped} 个 -> ${variantState.tableFile}`);
  console.log(`ASSETS_PASS  整理版已写出 -> ${outDir}（零积分，未联网；原分析稿没有改动）`);
  console.log(`  说话人 ${s.speakers_before} 种 -> ${s.speakers_after} 种（换名 ${s.speakers_changed} 行，其中逐句指定 ${s.line_overrides} 行）`);
  console.log(`  正式人物 ${s.characters} 个；场景 ${s.scene_writings} 种写法 -> ${s.scenes} 个；关键道具 ${s.key_props} 件；待核编号 ${s.unresolved_labels} 个；残留未处理编号 ${s.residual_observation_ids}`);
  console.log(`  台词列、字幕列、镜头列逐行核对一致（${s.rows} 行）`);
  console.log('  ■ 资产整理到此完成。先存档，接着写《洗稿建议.md》和草拟的 洗稿映射.json（"confirmed": false），内容照 SKILL.md「洗稿建议的标准内容」。');
  console.log('    然后【停下来交给用户】：资产整理结果（多少角色/场景/关键道具、哪几条还拿不准）+ 洗稿建议，告诉用户可以直接改、改完或确认后再开始写。');
  console.log('    用户修改或确认之前不写任何一集剧本（还原稿、草稿都不写），也不回传、不同步。');
  console.log('  用户确认之后：写作和洗稿都读 整理版/video_reverse_全剧合集.md；资产合并表.md 随稿交付。');
  if (variantState.built) console.log('  写每场【形象】时照 整理版/形象变体判定表.md：判定要建的变体，在它出现的那几集写 角色=变体名（原因）。写完跑 chenyu-pro variants --dir <剧本目录> --source <分析稿目录>，到 VARIANTS_PASS。');
  console.log(`  先存档（零积分，把合并结果留在平台项目里，换机器/换 Agent 接着做时能取回）：\n    chenyu-pro archive --project <项目id片段或剧名> --dir "${dir}"`);
}

// 称谓角色复核（assets-apply 调用）：在整理版合集上重新取证（说话人已换成合并后的名字）
function prepareRoleReview(dir, mergedDossierText, map = null) {
  const state = { total: 0, pending: [], reviewFile: '', decisionFile: '' };
  let labels;
  try { labels = [...collectAssetEvidence(parseDossier(mergedDossierText)).labels.values()]; } catch { return state; }
  const items = rolesNeedingReview(labels);
  // 角色名和地点/物件同名：不能标 independent 放过，必须改名
  const sceneNames = new Set();
  for (const bucket of Object.values(map?.scenes || {})) for (const value of Object.values(bucket || {})) { const to = String(value && typeof value === 'object' ? value.to : value || '').trim(); if (to) sceneNames.add(to); }
  const propNames = (Array.isArray(map?.props) ? map.props : []).map((p) => p?.name);
  const clashes = placeLikeRoleNames(labels.map((x) => x.name), { places: [...sceneNames], props: propNames });
  state.total = items.length + clashes.length;
  state.nameClashes = clashes.map((c) => `角色名「${c.name}」${c.why}——人和地点/物件用同一个词，后面会全部混掉。在 资产合并表.json 里把这个角色改成指人的名字（前台→前台接待、礼宾台→礼宾员、保安室→保安员），原来的词不要放进 aliases`);
  if (!items.length) { state.pending = [...state.nameClashes]; return state; }
  const workDir = path.join(dir, ASSET_DIR);
  fs.mkdirSync(workDir, { recursive: true });
  state.reviewFile = path.join(workDir, ROLE_REVIEW_FILE);
  state.decisionFile = path.join(workDir, ROLE_DECISION_FILE);
  let existing = [];
  if (fs.existsSync(state.decisionFile)) { try { existing = JSON.parse(fs.readFileSync(state.decisionFile, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`${state.decisionFile} 不是合法 JSON：${e.message}`); } }
  const decisions = roleDecisionTemplate(items, existing);
  fs.writeFileSync(state.reviewFile, renderRoleReview(items, { totalRoles: labels.length, descriptiveRoles: labels.filter((x) => isDescriptiveName(x.name)).length }), 'utf8');
  fs.writeFileSync(state.decisionFile, JSON.stringify(decisions, null, 1), 'utf8');
  state.pending = [...state.nameClashes, ...pendingRoleReviews(items, decisions)];
  return state;
}

// 候选 = 平台归并好的造型（character_variants.json，可能没有）+ 逐集分析表每个镜头外观原文里的强信号（一定有）。
// 两路都只读：不改 character_variants.json，也不改分析稿。
function collectVariantCandidates(dir, map) {
  const labels = Object.fromEntries([...(map.labels || new Map()).entries()].map(([key, value]) => [key, value?.to || '']));
  const resolve = nameResolver({ assetMap: { characters: map.characters, labels } });
  let candidates = [];
  const source = path.join(dir, 'character_variants.json');
  if (fs.existsSync(source)) {
    try { candidates = buildCandidates(JSON.parse(fs.readFileSync(source, 'utf8').replace(/^\uFEFF/, '')), resolve); } catch { candidates = []; }
  }
  const looks = [];
  const CHANGE_ACTION_RE = /换上|换成|换穿|换了一身|更衣|脱下[^，。；]{0,12}穿上/;
  const roleNames = [...new Set((map.characters || []).map((c) => String(c?.name || '').trim()).filter((name) => name.length >= 2))].sort((a, b) => b.length - a.length);
  try {
    const dossier = parseDossier(fs.readFileSync(path.join(dir, DOSSIER_FILE), 'utf8'));
    for (const row of dossier.rows) {
      const cell = row.cells[row.cells.length - 2] || '';
      // 动作栏里写明了谁换了衣服（换上/更衣…）：原文明确换装必须建变体，按动作里出现的角色名记一条
      const action = String(row.cells[3] || '');
      if (CHANGE_ACTION_RE.test(action)) for (const name of roleNames) if (action.includes(name)) looks.push({ episode: row.episode, time: row.cells[0], who: name, look: '换装动作：' + action.slice(0, 60) });
      for (const part of String(cell).split(/[；;]/)) {
        const at = part.search(/[=＝]/);
        if (at > 0) looks.push({ episode: row.episode, time: row.cells[0], who: resolve(part.slice(0, at).trim()).merged, look: part.slice(at + 1).trim() });
      }
    }
  } catch { /* 读不了合集就只用平台那一路 */ }
  return [...candidates, ...scanAppearanceSignals(looks, { existing: candidates })];
}

// 形象变体候选与判定（assets-apply 调用）。没有 character_variants.json（旧项目/平台没出）时不拦。
function prepareVariantDecisions(dir, map) {
  const state = { total: 0, built: 0, skipped: 0, pending: [], candidateFile: '', decisionFile: '', tableFile: '', candidates: [], decisions: [] };
  const candidates = collectVariantCandidates(dir, map);
  state.candidates = candidates;
  state.total = candidates.length;
  if (!candidates.length) return state;
  const workDir = path.join(dir, ASSET_DIR);
  fs.mkdirSync(workDir, { recursive: true });
  state.candidateFile = path.join(workDir, VARIANT_CANDIDATE_FILE);
  state.decisionFile = path.join(workDir, VARIANT_DECISION_FILE);
  let existing = [];
  if (fs.existsSync(state.decisionFile)) { try { existing = JSON.parse(fs.readFileSync(state.decisionFile, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`${state.decisionFile} 不是合法 JSON：${e.message}`); } }
  const decisions = decisionTemplate(candidates, existing);
  state.decisions = decisions;
  fs.writeFileSync(state.candidateFile, renderCandidates(candidates), 'utf8');
  fs.writeFileSync(state.decisionFile, JSON.stringify(decisions, null, 1), 'utf8');
  for (const d of decisions) {
    const c = candidates.find((item) => item.id === d.id);
    const where = `${d.id}「${d.look}」第 ${d.episodes} 集${c.signals.length ? '（强信号：' + c.signals.join('、') + '）' : ''}`;
    if (!['build', 'skip'].includes(d.decision)) state.pending.push(`${where} 还没表态`);
    else if (d.decision === 'build' && !String(d.variant || '').trim()) state.pending.push(`${where} 填了 build 但没写 variant（变体名）`);
    else if (d.decision === 'skip' && !String(d.reason || '').trim()) state.pending.push(`${where} 填了 skip 但没写 reason`);
    else if (d.decision === 'skip' && c.signals.length && String(d.reason).trim().length < 8) state.pending.push(`${where} 强信号造型不建变体，reason 要写清楚为什么观众不需要认出这个变化`);
    else if (d.decision === 'build') state.built += 1;
    else state.skipped += 1;
  }
  if (!state.pending.length) {
    const outDir = path.join(dir, '整理版');
    fs.mkdirSync(outDir, { recursive: true });
    state.tableFile = path.join(outDir, '形象变体判定表.md');
    const rows = ['# 形象变体判定表（写【形象】行时照这张表）', '', '| 角色 | 变体名 | 出现集 | 平台记录的造型 | 因何而变 | 判定 |', '| --- | --- | --- | --- | --- | --- |'];
    const cell = (value) => String(value || '').replace(/\|/g, '／').replace(/\s+/g, ' ').trim() || '-';
    for (const d of decisions) {
      const c = candidates.find((item) => item.id === d.id);
      rows.push(`| ${cell(d.role)} | ${d.decision === 'build' ? cell(d.variant) : '（并入主形象）'} | ${cell(d.episodes)} | ${cell(c.look)}：${cell(c.description)} | ${cell(c.cause)} | ${d.decision === 'build' ? '建变体' : '不建：' + cell(d.reason)} |`);
    }
    fs.writeFileSync(state.tableFile, rows.join('\n') + '\n', 'utf8');
  }
  return state;
}

// 没有分析稿的项目（小说改编、外部剧本洗稿）：直接扫剧本的动作行。某一场的 △ 里写到了病号服、滑雪、婚纱、换上…，
// 而句子里提到的角色这一场还是他最常用的那个形象，就列出来让 Agent 确认要不要建变体。只提醒，不拦。
function scanScriptForMissedVariants(scriptDir, usage) {
  const count = new Map();
  for (const u of usage) { if (!count.has(u.name)) count.set(u.name, new Map()); count.get(u.name).set(u.variant, (count.get(u.name).get(u.variant) || 0) + 1); }
  const usual = (name) => [...(count.get(name) || new Map()).entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  const hints = [];
  const seen = new Set();
  for (const file of listScriptFiles(scriptDir)) {
    const episode = episodeNoOfFile(path.basename(file));
    let declared = new Map();
    let head = '';
    for (const raw of String(fs.readFileSync(file, 'utf8')).split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      if (isSceneHead(line)) { declared = new Map(); head = line.split(/\s+/)[0]; continue; }
      if (isVariantLine(line)) { for (const e of parseVariantLine(line).entries) declared.set(e.name, e.variant); continue; }
      if (!isActionLine(line)) continue;
      const signals = strongSignals(line).filter((label) => label !== '身份制服');
      if (!signals.length) continue;
      for (const [name, variant] of declared) {
        if (!line.includes(name) || variant !== usual(name) || (count.get(name)?.size || 0) > 1 && false) continue;
        if (signals.some((label) => String(variant).includes(label.split('/')[0]))) continue;
        const key = `${name}|${signals[0]}|${episode}`;
        if (seen.has(key)) continue;
        seen.add(key);
        hints.push(`第${episode}集 ${head}：「${line.slice(0, 46)}…」（${signals.join('、')}），但 ${name} 这一场的形象还是平时的「${variant}」`);
      }
    }
  }
  if (!hints.length) { console.log('  · 动作行里没有发现「住院/受伤包扎/婚礼/功能性着装/换装…」却没建变体的地方'); return; }
  console.log(`  ⚠ ${hints.length} 处可能漏建了形象变体（动作里写到了事件或换装，形象却没变）——是剧情事件、功能性着装或明确换装就建变体，只是提了一句就不用改：`);
  for (const line of hints.slice(0, 30)) console.log('   - ' + line);
  if (hints.length > 30) console.log(`   … 另有 ${hints.length - 30} 处`);
}

// variants --source：对照资产整理时定下的形象变体判定，查「说了要建、剧本却没用上」的
function checkVariantsAgainstSource(scriptDir, sourceArg, usage) {
  if (!sourceArg) { scanScriptForMissedVariants(scriptDir, usage); return; }
  const src = path.resolve(sourceArg);
  const variantsFile = path.join(src, 'character_variants.json');
  const mapFile = path.join(src, ASSET_DIR, ASSET_MAP_FILE);
  const decisionFile = path.join(src, ASSET_DIR, VARIANT_DECISION_FILE);
  if (!fs.existsSync(mapFile) || !fs.existsSync(decisionFile)) die(`还没做形象变体判定：先 chenyu-pro assets-apply --dir "${src}" 到 ASSETS_PASS`);
  const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  const assetMap = normalizeAssetMap(readJson(mapFile));
  const labels = Object.fromEntries([...(assetMap.labels || new Map()).entries()].map(([key, value]) => [key, value?.to || '']));
  // 洗稿换过名：判定表里是原名，剧本里是新名，按洗稿映射对上
  const renameFile = arg('map', '') ? path.resolve(arg('map')) : [path.join(scriptDir, '洗稿映射.json'), path.join(path.dirname(scriptDir), '洗稿映射.json')].find((file) => fs.existsSync(file));
  const renames = renameFile && fs.existsSync(renameFile) ? (readJson(renameFile).renames || {}) : {};
  const baseCandidates = collectVariantCandidates(src, assetMap);
  const scriptCandidates = baseCandidates.map((c) => ({ ...c, role: renames[c.role] || c.role }));
  const report = checkAgainstScript(scriptCandidates, readJson(decisionFile), usage);
  if (!report.total) { console.log('  · 平台没有记录到主造型以外的造型，无需核对'); return; }
  const printHints = () => { if (!report.hints?.length) return; console.log(`  ⚠ 另有 ${report.hints.length} 处请确认（不影响通过）：`); for (const line of report.hints.slice(0, 20)) console.log('   - ' + line); };
  if (!report.flags.length) { console.log(`VARIANTS_PASS  ${report.total} 条造型候选：建 ${report.built} 个都已在剧本对应集用上，不建 ${report.skipped} 个都有原因`); printHints(); return; }
  console.log(`VARIANTS_FLAGGED  ${report.flags.length} 处要返工（建 ${report.built} / 不建 ${report.skipped} / 共 ${report.total}）：`);
  for (const line of report.flags.slice(0, 40)) console.log('  ✗ ' + line);
  if (report.flags.length > 40) console.log(`  … 另有 ${report.flags.length - 40} 处`);
  printHints();
  console.log('  按上面逐条改剧本的【形象】行（并在场内补可见的换装 △），或回到 资产整理/形象变体判定.json 改判定后重跑 assets-apply，再跑本命令直到 VARIANTS_PASS。');
  process.exitCode = 2;
}

// ---------- 复核分包：让多个子代理并行做「称谓角色复核」和「形象变体判定」 ----------
// 准确的复核要回到逐集分析表里看上下文，一个 Agent 串行做很慢。这里把待处理的条目按集数切成几包，
// 每包自带证据（相关镜头行的原文），子代理只读自己那一包、只写一份结论；主 Agent 用 review-merge 合并。
// 子代理不直接改合并表——两个子代理各改各的会互相覆盖；合并/改名由 review-merge 统一落到合并表。
const REVIEW_PACK_DIR = '复核分包';

function loadReviewContext(dir) {
  const mapFile = path.join(dir, ASSET_DIR, ASSET_MAP_FILE);
  const mergedFile = path.join(dir, '整理版', DOSSIER_FILE);
  if (!fs.existsSync(mapFile) || !fs.existsSync(mergedFile)) die(`还没到复核这一步：先 chenyu-pro assets-apply --dir "${dir}"，出现 ASSETS_REVIEW_PENDING 或 ASSETS_VARIANTS_PENDING 后再分包`);
  const map = normalizeAssetMap(JSON.parse(fs.readFileSync(mapFile, 'utf8').replace(/^﻿/, '')));
  const mergedText = fs.readFileSync(mergedFile, 'utf8');
  const dossier = parseDossier(mergedText);
  const labels = [...collectAssetEvidence(dossier).labels.values()];
  const readDecisions = (name) => { const file = path.join(dir, ASSET_DIR, name); try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')) : []; } catch { return []; } };
  const roleDone = new Set(readDecisions(ROLE_DECISION_FILE).filter((d) => d?.decision === 'independent' && String(d.reason || '').trim().length >= 8).map((d) => d.id));
  const variantDone = new Set(readDecisions(VARIANT_DECISION_FILE).filter((d) => (d?.decision === 'build' && String(d.variant || '').trim()) || (d?.decision === 'skip' && String(d.reason || '').trim())).map((d) => d.id));
  const roles = rolesNeedingReview(labels).filter((item) => !roleDone.has(item.id));
  const variants = collectVariantCandidates(dir, map).filter((item) => !variantDone.has(item.id));
  return { mapFile, map, dossier, labels, roles, variants };
}

// 某个角色在指定几集里的相关镜头行（他说话的、动作或外观里提到他的），各带前后一行上下文
function evidenceRows(dossier, name, episodes, cap = 36) {
  const wanted = new Set(episodes.map((n) => 'EP' + String(n).padStart(3, '0')));
  const rows = dossier.rows.filter((row) => wanted.has(row.episode));
  const keep = new Set();
  rows.forEach((row, index) => {
    const c = row.cells;
    if (c[2] === name || String(c[3] || '').includes(name) || String(c[c.length - 2] || '').includes(name + '=')) { keep.add(index - 1); keep.add(index); keep.add(index + 1); }
  });
  const picked = [...keep].filter((i) => i >= 0 && i < rows.length).sort((a, b) => a - b).slice(0, cap);
  return picked.map((i) => { const c = rows[i].cells; return `| ${rows[i].episode} ${c[0]} | ${c[2]} | ${c[1]} | ${c[3]} | ${c[4]} | ${c[c.length - 2] || ''} |`; });
}

function cmdReviewSplit() {
  const dir = resolveAnalysisDir();
  const ctx = loadReviewContext(dir);
  const items = [
    ...ctx.roles.map((item) => ({ kind: 'role', id: item.id, first: item.episodes[0] || 0, item })),
    ...ctx.variants.map((item) => ({ kind: 'variant', id: item.id, first: item.episode_list[0] || 0, item }))
  ].sort((a, b) => a.first - b.first);
  if (!items.length) { console.log('没有待复核的条目（称谓角色和形象变体都已处理完）。直接 chenyu-pro assets-apply 即可。'); return; }
  const parts = Math.max(1, Math.min(Number(arg('parts', '')) || Math.ceil(items.length / 8), 8, items.length));
  const size = Math.ceil(items.length / parts);
  const packDir = path.join(dir, ASSET_DIR, REVIEW_PACK_DIR);
  fs.mkdirSync(packDir, { recursive: true });
  for (const name of fs.readdirSync(packDir)) if (/^第\d+包/.test(name)) fs.rmSync(path.join(packDir, name), { force: true }); // 重新分包时清掉上一轮
  const named = ctx.labels.filter((x) => !isDescriptiveName(x.name)).map((x) => x.name);
  for (let p = 0; p < parts; p += 1) {
    const batch = items.slice(p * size, (p + 1) * size);
    if (!batch.length) continue;
    const lines = [
      `# 复核分包 第 ${p + 1}/${parts} 包（${batch.length} 条，第 ${batch[0].first}–${batch[batch.length - 1].first} 集一带）`,
      '',
      '你是复核子代理。只处理这一包里的条目，只根据下面给出的镜头行原文判断，不要改任何其他文件。',
      `做完把结论写成 JSON 数组，存到同目录的 \`第${p + 1}包.结论.json\`，每条一个对象，\`id\` 和 \`kind\` 原样照抄。`,
      '',
      '**称谓角色（kind=role）——他到底是谁？** `decision` 四选一：',
      '- `merge`：他就是某个已有的具名角色（同一个人被记成了另一个称呼）。`merge_to` 写那个角色名（必须是下面「全剧具名角色」里的，一字不差）。',
      '- `rename`：剧里的台词、字幕或名牌出现过他的名字。`real_name` 写这个名字。',
      '- `independent`：确实是没有名字的独立角色。',
      '- `unsure`：证据不够，判断不了。不要硬选，留给主 Agent。',
      '每条都要写 `reason`：依据是哪一集哪句台词/哪个镜头（带时间码）。只看衣服相似不算依据。',
      '',
      '**形象变体（kind=variant）——这个造型要不要单独建形象？** `decision`：',
      '- `build`：剧情里有原因、观众需要认出「他变了」（住院、受伤包扎、怀孕、婚礼、伪装、年龄段不同…）。`variant` 写变体名（身份/事件，不用服装名）。',
      '- `skip`：只是日常换衣、同一身衣服的不同拍法、瞬时状态，或其实是别人的外观被记错了。',
      '- `unsure`：判断不了。',
      '每条都要写 `reason`。',
      '',
      `全剧具名角色：${named.join('、')}`,
      ''
    ];
    for (const entry of batch) {
      const it = entry.item;
      if (entry.kind === 'role') {
        lines.push(`## [role] ${it.id}`, `- 出现集：${it.episodes.join('、')}；台词 ${it.line_count} 句；外观：${it.looks.join('；') || '无记录'}`, `- 同集出场的具名角色：${it.around.join('、') || '无'}`, '', '| 位置 | 说话人 | 台词 | 动作 | 场景 | 外观 |', '| --- | --- | --- | --- | --- | --- |', ...evidenceRows(ctx.dossier, it.name, it.episodes), '');
      } else {
        lines.push(`## [variant] ${it.id}`, `- 角色：${it.role}；造型：${it.look}——${it.description || ''}`, `- 出现集：${it.episodes}；首次：${it.first}；强信号：${it.signals.join('、') || '无'}；平台记录的原因：${it.cause || '无'}${it.main_look ? `；主造型：${it.main_look}` : ''}`, '', '| 位置 | 说话人 | 台词 | 动作 | 场景 | 外观 |', '| --- | --- | --- | --- | --- | --- |', ...evidenceRows(ctx.dossier, it.role, it.episode_list.slice(0, 6), 28), '');
      }
    }
    lines.push('## 结论文件格式', '```json', JSON.stringify(batch.slice(0, 2).map((entry) => (entry.kind === 'role'
      ? { id: entry.id, kind: 'role', decision: 'merge | rename | independent | unsure', merge_to: '', real_name: '', reason: '' }
      : { id: entry.id, kind: 'variant', decision: 'build | skip | unsure', variant: '', reason: '' })), null, 1), '```');
    fs.writeFileSync(path.join(packDir, `第${p + 1}包.md`), lines.join('\n') + '\n', 'utf8');
  }
  console.log(`✓ 待复核 ${items.length} 条（称谓角色 ${ctx.roles.length}、形象变体 ${ctx.variants.length}）已分成 ${parts} 包 -> ${packDir}`);
  console.log('  你的环境能开子代理/并行任务时：每个子代理只给它一个「第N包.md」，让它照文件开头的说明写出「第N包.结论.json」，几包同时跑。');
  console.log('  不能开子代理就自己按包顺序做，同样写结论文件。子代理不要改合并表。');
  console.log(`  全部结论写完：chenyu-pro review-merge --dir "${dir}"   合并结论（并人/改名落到合并表，独立/变体落到判定表），再重跑 assets-apply`);
}

function cmdReviewMerge() {
  const dir = resolveAnalysisDir();
  const ctx = loadReviewContext(dir);
  const packDir = path.join(dir, ASSET_DIR, REVIEW_PACK_DIR);
  if (!fs.existsSync(packDir)) die('还没分包：先 chenyu-pro review-split --dir <分析稿目录>');
  const results = [];
  for (const name of fs.readdirSync(packDir).filter((n) => /结论\.json$/.test(n)).sort()) {
    let list;
    try { list = JSON.parse(fs.readFileSync(path.join(packDir, name), 'utf8').replace(/^﻿/, '')); } catch (e) { die(`${name} 不是合法 JSON：${e.message}`); }
    for (const r of Array.isArray(list) ? list : []) if (r && r.id) results.push({ ...r, from: name });
  }
  if (!results.length) die(`没有读到结论文件（${packDir} 下的「第N包.结论.json」）`);
  const raw = JSON.parse(fs.readFileSync(ctx.mapFile, 'utf8').replace(/^﻿/, ''));
  const roleNames = new Set(ctx.labels.map((x) => x.name));
  const roleIds = new Set(ctx.roles.map((item) => item.id));
  const variantIds = new Map(ctx.variants.map((item) => [item.id, item]));
  const readList = (name) => { const file = path.join(dir, ASSET_DIR, name); try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')) : []; } catch { return []; } };
  const roleDecisions = new Map(readList(ROLE_DECISION_FILE).map((d) => [d.id, d]));
  const variantDecisions = new Map(readList(VARIANT_DECISION_FILE).map((d) => [d.id, d]));
  const text = (value) => String(value || '').trim();
  const done = { merge: [], rename: [], independent: 0, build: 0, skip: 0 };
  const left = [];
  // 把「整理后叫 from 的角色」改成 to：labels 里指向 from 的都指向 to；characters 里的 from 并进 to（改名时保留条目并换名）
  const redirect = (from, to, { keepAsAlias }) => {
    for (const [label, value] of Object.entries(raw.labels || {})) {
      const current = text(value && typeof value === 'object' ? value.to : value);
      if (current !== from) continue;
      if (value && typeof value === 'object') value.to = to; else raw.labels[label] = to;
    }
    const chars = Array.isArray(raw.characters) ? raw.characters : (raw.characters = []);
    const source = chars.find((c) => text(c?.name) === from);
    let target = chars.find((c) => text(c?.name) === to);
    if (!target) { target = { name: to, role: source?.role || '', aliases: [], note: source?.note || '' }; chars.push(target); }
    target.aliases = [...new Set([...(target.aliases || []), ...(source?.aliases || []), ...(keepAsAlias ? [from] : [])].map(text).filter((alias) => alias && alias !== to))];
    if (source && source !== target) chars.splice(chars.indexOf(source), 1);
  };
  for (const r of results) {
    const reason = text(r.reason);
    if (r.kind === 'role') {
      if (!roleIds.has(r.id)) continue; // 已经处理过或不在待复核里
      if (r.decision === 'merge' && text(r.merge_to)) {
        const to = text(r.merge_to);
        if (!roleNames.has(to) || to === r.id) { left.push(`${r.id}：merge_to「${to}」不是现有角色名（要和整理版里的名字一字不差）`); continue; }
        if (reason.length < 8) { left.push(`${r.id}：并到「${to}」但没写依据`); continue; }
        redirect(r.id, to, { keepAsAlias: false }); // 称谓式的旧名不进别名（别名只留剧里真出现过的叫法）
        done.merge.push(`${r.id} → ${to}（${reason.slice(0, 40)}）`);
      } else if (r.decision === 'rename' && text(r.real_name)) {
        if (reason.length < 8) { left.push(`${r.id}：改名「${text(r.real_name)}」但没写依据（哪一集哪句台词/名牌）`); continue; }
        redirect(r.id, text(r.real_name), { keepAsAlias: true });
        done.rename.push(`${r.id} → ${text(r.real_name)}（${reason.slice(0, 40)}）`);
      } else if (r.decision === 'independent') {
        if (reason.length < 8) { left.push(`${r.id}：independent 但依据太简略`); continue; }
        roleDecisions.set(r.id, { ...(roleDecisions.get(r.id) || { id: r.id }), decision: 'independent', reason });
        done.independent += 1;
      } else left.push(`${r.id}：子代理没给出结论（${text(r.decision) || '空'}）${reason ? '——' + reason.slice(0, 50) : ''}`);
    } else if (r.kind === 'variant') {
      if (!variantIds.has(r.id)) continue;
      if (r.decision === 'build' && text(r.variant)) { variantDecisions.set(r.id, { ...(variantDecisions.get(r.id) || { id: r.id }), decision: 'build', variant: text(r.variant), reason }); done.build += 1; }
      else if (r.decision === 'skip' && reason) { variantDecisions.set(r.id, { ...(variantDecisions.get(r.id) || { id: r.id }), decision: 'skip', variant: '', reason }); done.skip += 1; }
      else left.push(`${r.id}：子代理没给出结论（${text(r.decision) || '空'}）${reason ? '——' + reason.slice(0, 50) : ''}`);
    }
  }
  if (done.merge.length || done.rename.length) {
    fs.copyFileSync(ctx.mapFile, ctx.mapFile.replace(/\.json$/, `.复核前-${Date.now()}.json`));
    fs.writeFileSync(ctx.mapFile, JSON.stringify(raw, null, 1), 'utf8');
  }
  fs.writeFileSync(path.join(dir, ASSET_DIR, ROLE_DECISION_FILE), JSON.stringify([...roleDecisions.values()], null, 1), 'utf8');
  fs.writeFileSync(path.join(dir, ASSET_DIR, VARIANT_DECISION_FILE), JSON.stringify([...variantDecisions.values()], null, 1), 'utf8');
  const answered = new Set(results.map((r) => r.id));
  for (const item of ctx.roles) if (!answered.has(item.id)) left.push(`${item.id}：没有任何一包给出结论`);
  for (const item of ctx.variants) if (!answered.has(item.id)) left.push(`${item.id}：没有任何一包给出结论`);
  console.log(`✓ 已合并 ${results.length} 条结论：并人 ${done.merge.length}、改名 ${done.rename.length}、确认独立 ${done.independent}；形象变体 建 ${done.build}、不建 ${done.skip}`);
  for (const line of done.merge) console.log('  并人  ' + line);
  for (const line of done.rename) console.log('  改名  ' + line);
  if (done.merge.length || done.rename.length) console.log('  合并表已更新（改之前的版本存了一份「资产合并表.复核前-*.json」）。你要抽看这些并人/改名是否合理——子代理看的只是片段。');
  if (left.length) {
    console.log(`  ⚠ 还有 ${left.length} 条要你自己定（子代理没把握或结论不合格）：`);
    for (const line of left.slice(0, 30)) console.log('   - ' + line);
  }
  console.log(`  下一步：chenyu-pro assets-apply --dir "${dir}"（并人/改名后名单会变，可能冒出新的待复核条目；还有就再 review-split 一轮）`);
}

// ---------- 固定的项目目录：我的文档/辰屿项目/<剧名>/ ----------
// 以前各命令默认输出到「当前目录下的 chenyu-video-analysis」——Agent 的当前目录各不相同，用户找不到文件。
// 现在不传 --out 时一律放到 我的文档/辰屿项目/<剧名>/ 下面；CHENYU_PROJECTS_DIR 可改根目录。
function projectsRoot() {
  if (process.env.CHENYU_PROJECTS_DIR) return path.resolve(process.env.CHENYU_PROJECTS_DIR);
  const home = process.env.USERPROFILE || os.homedir();
  // Windows「文档」被 OneDrive 接管时在 OneDrive 下面；哪个存在用哪个
  const candidates = [path.join(home, 'Documents'), path.join(home, 'OneDrive', 'Documents'), path.join(home, 'OneDrive', '文档'), path.join(home, '文档')];
  const docs = candidates.find((dir) => { try { return fs.statSync(dir).isDirectory(); } catch { return false; } }) || candidates[0];
  return path.join(docs, '辰屿项目');
}
const safeDirName = (title) => String(title || '').replace(/[\\/:*?"<>|\r\n]+/g, '_').replace(/[. ]+$/g, '').trim().slice(0, 60) || '未命名项目';
const projectDir = (title) => path.join(projectsRoot(), safeDirName(title));
const analysisOutDir = (title) => (arg('out', '') ? path.resolve(arg('out')) : path.join(projectDir(title), '分析稿'));

// 不传 --dir 时用哪个分析稿目录：最近一次 video-analyze / video-fetch / video-wait 取回的那个（记在本机配置里）。
// 以前默认是「当前目录下的 chenyu-video-analysis」，而分析稿已经改放到 我的文档/辰屿项目/<剧名>/分析稿，不传 --dir 就找不到。
function resolveAnalysisDir() {
  if (arg('dir', '')) return path.resolve(arg('dir'));
  const last = String(loadConfig().last_analysis_dir || '');
  if (last && fs.existsSync(last)) { console.log(`（没传 --dir，用最近一次取回的分析稿目录：${last}）`); return last; }
  return path.resolve('./chenyu-video-analysis');
}
// 剧名：工作目录常是 <剧名>/工作/剧本 这种结构，往上跳过「工作、剧本、分集」这类通用目录名
const GENERIC_DIR_RE = /^(工作|剧本|分集|正文|脚本|整理版|分析稿|输出|交付|scripts?|work|works?pace|output|outputs|episodes?|src|dist|tmp|temp)$/i;
function inferTitleFromDir(dir) {
  let current = path.resolve(dir);
  for (let i = 0; i < 4; i += 1) {
    const name = path.basename(current);
    if (name && !GENERIC_DIR_RE.test(name)) return name;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return '';
}

// 交付整理：把最终要用的东西放在项目目录最外层，其余归类。只复制、不移动、不改原文件。
//   <剧名>/全集剧本.txt   <剧名>/形象表.json   <剧名>/分集/第001集.txt …   ← 用户和客户端要的就这三样
//   <剧名>/资产/   <剧名>/报告/   <剧名>/分析稿/   <剧名>/其他/              ← 其余归类
const DELIVER_RULES = [
  ['资产', /资产|形象|变体|道具|场景|映射|设计|音色/],
  ['报告', /审核|检查|报告|记录|建议|说明|核对|凭证|清单/]
];
function cmdDeliver() {
  const scriptDir = path.resolve(arg('dir', '') || die('用法: chenyu-pro deliver --dir <剧本目录(放着 第N集.txt)> [--source <分析稿目录>] [--title 剧名] [--out 目录]'));
  if (!fs.existsSync(scriptDir)) die('剧本目录不存在: ' + scriptDir);
  const episodeFiles = listScriptFiles(scriptDir).filter((file) => episodeNoOfFile(path.basename(file)) > 0);
  if (!episodeFiles.length) die('剧本目录里没有「第N集」文件: ' + scriptDir);
  const workDirs = [...new Set([scriptDir, path.dirname(scriptDir), ...String(arg('work', '') || '').split(',').map((item) => item.trim()).filter(Boolean).map((item) => path.resolve(item))])];
  // 剧名：--title > 形象表里的 title > 剧本目录的上一级目录名
  let lookTableFile = '';
  for (const dir of workDirs) { const file = path.join(dir, '形象表.json'); if (fs.existsSync(file)) { lookTableFile = file; break; } }
  let title = arg('title', '');
  if (!title && lookTableFile) { try { title = JSON.parse(fs.readFileSync(lookTableFile, 'utf8').replace(/^﻿/, '')).title || ''; } catch { /* 用目录名 */ } }
  if (!title) title = inferTitleFromDir(path.dirname(scriptDir)) || inferTitleFromDir(scriptDir) || '未命名项目';
  const root = arg('out', '') ? path.resolve(arg('out')) : projectDir(title);
  const put = (from, ...to) => { const target = path.join(root, ...to); fs.mkdirSync(path.dirname(target), { recursive: true }); if (path.resolve(from) !== path.resolve(target)) fs.copyFileSync(from, target); return target; };
  const copyDir = (from, ...to) => { let n = 0; for (const entry of fs.readdirSync(from, { withFileTypes: true })) { const src = path.join(from, entry.name); if (entry.isDirectory()) n += copyDir(src, ...to, entry.name); else { put(src, ...to, entry.name); n += 1; } } return n; };
  const count = { 分集: 0, 资产: 0, 报告: 0, 分析稿: 0, 其他: 0 };

  // ① 分集 + 全集
  const merged = [];
  for (const file of episodeFiles) {
    const n = episodeNoOfFile(path.basename(file));
    const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n').trim();
    put(file, '分集', `第${String(n).padStart(3, '0')}集.txt`);
    merged.push(text);
    count.分集 += 1;
  }
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, '全集剧本.txt'), merged.join('\n\n\n') + '\n', 'utf8');
  // ② 形象表
  let lookTableNote = '';
  if (lookTableFile) {
    let table = null;
    try { table = JSON.parse(fs.readFileSync(lookTableFile, 'utf8').replace(/^\uFEFF/, '')); } catch { /* 读不了按不完整处理 */ }
    const gaps = !table ? ['文件读不了'] : table.complete === true ? [] : lookTableCompleteness(table, { episodes: episodeFiles.map((file) => episodeNoOfFile(path.basename(file))), requireDesign: EDITION !== 'gate', allowNoProps: flag('no-props'), keep: readKeepNotes(path.dirname(lookTableFile)) });
    if (gaps.length) {
      lookTableNote = `⛔ 形象表不完整（${gaps.length} 项），没有放进交付目录：\n     ✗ ${gaps.slice(0, 8).join('\n     ✗ ')}\n     补完重跑 assets-export 到 LOOK_TABLE_PASS，再重新 deliver。不要把不完整的形象表交给用户。`;
      lookTableFile = '';
    } else put(lookTableFile, '形象表.json');
  } else lookTableNote = '⛔ 没有找到「形象表.json」（没导出过，或导出时不完整只有「形象表.未完成.json」）：先 assets-export 到 LOOK_TABLE_PASS。';
  // ③ 工作目录里的其他文件归类（只看这几个目录的第一层，子目录里只收 资产图）
  const taken = new Set([...episodeFiles.map((file) => path.resolve(file)), lookTableFile ? path.resolve(lookTableFile) : '']);
  for (const dir of workDirs) {
    if (path.resolve(dir) === path.resolve(root)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const src = path.join(dir, entry.name);
      // 资产图放在形象表旁边：形象表里记的是相对路径「资产图/xxx.png」，挪进别的目录就对不上了
      if (entry.isDirectory()) { if (entry.name === ASSET_IMAGE_DIR) count.资产 += copyDir(src, ASSET_IMAGE_DIR); continue; }
      if (taken.has(path.resolve(src)) || !/\.(md|txt|json|xlsx|csv|docx)$/i.test(entry.name)) continue;
      if (episodeNoOfFile(entry.name) > 0) continue; // 别的目录里的分集稿（旧版本）不收
      if (/^形象表.(未完成|旧版)/.test(entry.name)) continue; // 形象表的草稿和旧版不进交付目录
      if (/全剧|全集|合并稿|全\d+集/.test(entry.name) && /\.(txt|md)$/i.test(entry.name)) continue; // 旧的全集文件：全集剧本.txt 已按分集重新生成
      const bucket = (DELIVER_RULES.find(([, re]) => re.test(entry.name)) || ['其他'])[0];
      put(src, bucket, entry.name);
      count[bucket] += 1;
      taken.add(path.resolve(src));
    }
  }
  // ④ 分析稿（视频分析项目）：整理版在前，原始分析稿和整理过程留底
  const source = arg('source', '') ? path.resolve(arg('source')) : '';
  if (source && fs.existsSync(source) && path.resolve(source) !== path.resolve(path.join(root, '分析稿'))) count.分析稿 += copyDir(source, '分析稿');
  else if (fs.existsSync(path.join(root, '分析稿'))) count.分析稿 = -1;
  fs.writeFileSync(path.join(root, '目录说明.txt'), [
    `《${title}》交付目录（${new Date().toLocaleString()} 由 chenyu-pro deliver 整理）`,
    '',
    '最常用的三样在最外层：',
    `  全集剧本.txt      全部 ${count.分集} 集合在一个文件里`,
    '  形象表.json       导入辰屿客户端「人物设定与故事背景」，按表建角色/场景/道具卡' + (lookTableFile ? '' : '（本次没有找到形象表）'),
    '  分集\\            每集一个文件：第001集.txt …',
    '',
    '其余归类：',
    '  资产图\\          已出的角色/场景/道具资产图（形象表按这个相对位置引用，不要挪走；没出过图就没有这个目录）',
    '  资产\\            资产合并表、形象变体表、洗稿映射 等',
    '  报告\\            审核报告、检查报告、洗稿建议、核对记录 等',
    '  分析稿\\          视频分析取回的原始分析稿、整理版、资产整理过程',
    '  其他\\            上面都不算的文件',
    ''
  ].join('\r\n'), 'utf8');
  console.log(`✓ 已整理交付目录：${root}`);
  console.log(`   全集剧本.txt（${count.分集} 集）${lookTableFile ? '、形象表.json' : '（没有找到形象表.json）'}、分集\\ ${count.分集} 个文件`);
  console.log(`   资产\\ ${count.资产} 个、报告\\ ${count.报告} 个、其他\\ ${count.其他} 个${count.分析稿 > 0 ? `、分析稿\\ ${count.分析稿} 个` : count.分析稿 < 0 ? '、分析稿\\ 已在该目录下' : ''}`);
  if (lookTableNote) { console.log('  ' + lookTableNote); process.exitCode = 2; }
  console.log(lookTableNote ? '  形象表补完之前不算交付完成。' : '  把上面这个目录路径原样告诉用户：最外层就是全集、形象表和分集，其余都归好类了。原工作目录没有动。');
}

// 存档：把 Agent 本地做出来的东西回传到平台项目里留档（零积分）。只做记录，不改平台的原始分析稿、不改项目状态。
// 分阶段传：资产整理到 ASSETS_PASS 后传一次（合并表 + 整理版）；全部写完、检查通过后再传一次（--file 附上检查报告等）。
// 文件名一律加「存档_」前缀，和平台自己的分析稿（video-fetch 取回的那几份）分开，互不覆盖；同名重复上传时平台按最新的算。
const ARCHIVE_PREFIX = '存档_';
const ARCHIVE_DEFAULT_FILES = [
  [ASSET_DIR, ASSET_MAP_FILE],              // Agent 填的资产合并表（接着做时还原用）
  ['整理版', '资产合并表.md'],               // 可读版合并表
  ['整理版', DOSSIER_FILE]                   // 整理版全剧合集
];
async function cmdArchive() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const p = await findProject(fragment);
  const dir = resolveAnalysisDir();
  const targets = [];
  for (const parts of ARCHIVE_DEFAULT_FILES) {
    const file = path.join(dir, ...parts);
    if (fs.existsSync(file)) targets.push({ file, name: parts.join('_') });
  }
  // --file a.md,b.json：额外要留档的文件（洗稿检查报告、交付检查报告、形象表、改名映射等）
  for (const extra of String(arg('file', '') || '').split(',').map((item) => item.trim()).filter(Boolean)) {
    const file = path.resolve(extra);
    if (!fs.existsSync(file)) die('要存档的文件不存在: ' + file);
    targets.push({ file, name: path.basename(file) });
  }
  if (!targets.length) die(`没有可存档的文件：${dir} 下没有 资产整理/资产合并表.json 或 整理版/。\n  先做到 ASSETS_PASS，或用 --file 指定要存档的文件`);
  let done = 0;
  for (const t of targets) {
    const ext = path.extname(t.file).toLowerCase();
    if (!['.md', '.json', '.txt'].includes(ext)) { console.log(`  ⚠ 跳过（只存 .md/.json/.txt）：${t.file}`); continue; }
    const content = fs.readFileSync(t.file, 'utf8');
    if (!content.trim()) { console.log(`  ⚠ 跳过空文件：${t.file}`); continue; }
    if (Buffer.byteLength(content) > 12 * 1024 * 1024) { console.log(`  ⚠ 跳过（超过 12MB）：${t.file}`); continue; }
    const filename = ARCHIVE_PREFIX + t.name;
    await api(`/api/projects/${p.id}/files`, {
      method: 'POST',
      body: { filename, title: filename, type: ext === '.json' ? 'json' : 'markdown', step_id: 'A01V', content, metadata_json: { agent_archive: true, cli_version: VERSION, archived_at: new Date().toISOString() } }
    });
    console.log(`  ✓ 已存档 ${filename}（${Math.round(Buffer.byteLength(content) / 1024)}KB）`);
    done += 1;
  }
  if (!done) die('没有文件被存档');
  console.log(`✓ 共存档 ${done} 个文件到《${p.title}》（零积分；只是留档，平台的原始分析稿和项目状态不变）。`);
  console.log(`  以后取回：chenyu-pro archive-fetch --project ${p.id.slice(-8)} --dir <分析稿目录>`);
}

// ---------- 资产图（消耗积分）：按形象表出横版资产图，用户点名出哪些 ----------
// 图由平台出（和客户端同一条图片通道、同一套知识库版式提示词；16:9：角色=左半幅正脸特写+正面全身+背面全身，场景/道具=四格设定图），Agent 不碰提示词、不用自己的生图能力。
// 出完的图：① 下载到 <形象表所在目录>/资产图/ 给用户看；② 存在平台项目里；③ 把图的位置写回形象表对应条目的 image 字段
//（客户端导入形象表时据此取图挂到资产卡上，取不到就按原流程自己出）。
const ASSET_IMAGE_DIR = '资产图';
const ASSET_IMAGE_POINTS = 6; // 2026-10-04 实测：16:9、1080p、细节 low，和客户端资产图默认档一致
const ASSET_IMAGE_KIND = { look: '角色', place: '场景', prop: '道具' };

function loadLookTableOrDie(file) {
  if (!fs.existsSync(file)) die(`没有找到形象表: ${file}\n  先完成形象设计并 chenyu-pro assets-export 出 形象表.json`);
  let table;
  try { table = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`形象表不是合法 JSON: ${e.message}`); }
  if (table.schema !== 'chenyu.look-table/v1') die('这不是形象表（chenyu.look-table/v1）: ' + file);
  return table;
}

// 可出图的条目：有完整外观描述的角色形象、有描述的场景、建卡(card:true)的道具。编号在同一张表上是稳定的。
function assetImageCandidates(table) {
  const items = [];
  for (const c of table.characters || []) for (const l of c.looks || []) {
    const prompt = String(l.styling?.description || l.design?.prompt || l.appearance || '').trim();
    if (!prompt) continue;
    const mainLook = (c.looks || []).find((x) => x.main === true) || (c.looks || [])[0];
    items.push({ type: 'look', name: `${c.name}-${l.variant}`, owner: c.name, variant: l.variant, main: l === mainLook, mainRef: mainLook, prompt, ref: l, episodes: l.episodes || c.episodes || '' });
  }
  for (const p of table.places || []) if (String(p.description || '').trim()) items.push({ type: 'place', name: p.name, prompt: String(p.description).trim(), ref: p, episodes: p.episodes || '' });
  for (const p of table.props || []) if (p.card === true && String(p.description || '').trim()) items.push({ type: 'prop', name: p.name, prompt: String(p.description).trim(), ref: p, episodes: p.episodes || '' });
  items.forEach((item, index) => { item.no = index + 1; });
  return items;
}

async function cmdAssetImage() {
  const dir = path.resolve(arg('dir', '.'));
  const file = path.resolve(arg('look-table', path.join(dir, '形象表.json')));
  const table = loadLookTableOrDie(file);
  const items = assetImageCandidates(table);
  if (!items.length) die('形象表里没有可出图的条目（角色形象要有外观描述；场景要有 description；道具要 card:true 且有 description）。先把形象设计、场景道具设计做完并 assets-export。');
  const price = Number(arg('price', '')) || ASSET_IMAGE_POINTS;
  const pickArg = String(arg('pick', '') || '').trim();
  if (!pickArg) {
    console.log(`《${table.title || '未命名'}》可出资产图的条目（横版 16:9，约 ${price} 分/张；已出过的标 ✓）：`);
    for (const type of ['look', 'place', 'prop']) {
      const group = items.filter((item) => item.type === type);
      if (!group.length) continue;
      console.log(`\n【${ASSET_IMAGE_KIND[type]}】${group.length} 个`);
      for (const item of group) console.log(`  ${String(item.no).padStart(3)}. ${item.ref.image?.file ? '✓ ' : '  '}${item.name}${item.main ? '（主形象）' : item.type === 'look' ? `（变体，沿用主形象的脸${item.mainRef?.image?.artifact_id ? '' : '——要先出主形象'}）` : ''}${item.episodes ? '  出现集 ' + item.episodes : ''}`);
    }
    console.log('\n把这张清单给用户看，问：要不要出资产图、出哪些（可以只出主角主形象）。用户选好后：');
    console.log(`  chenyu-pro asset-image --project <项目> --look-table "${file}" --pick 1,3,7        先报价`);
    console.log('  用户同意报价后同一条命令加 --yes。不要自己替用户全选，不要用你自己的生图能力代替（风格和客户端对不上）。');
    return;
  }
  const picked = [];
  for (const token of pickArg.split(/[,，\s]+/).filter(Boolean)) {
    const range = token.match(/^(\d+)-(\d+)$/);
    const found = range
      ? items.filter((item) => item.no >= Number(range[1]) && item.no <= Number(range[2]))
      : items.filter((item) => String(item.no) === token || item.name === token);
    if (!found.length) die(`--pick 里的「${token}」在清单里找不到（不带 --pick 跑一次看编号）`);
    for (const item of found) if (!picked.includes(item)) picked.push(item);
  }
  const redo = flag('force');
  // 变体（非主形象）用主形象的图当参考图生图，保证同一张脸——和客户端一致。所以主形象要先出：同一批里主形象排前面；
  // 主形象既没出过图、这次也没选的变体，不出（各出各的会换脸，出了也不能用）。
  picked.sort((a, b) => (a.type === 'look' && b.type === 'look' ? (b.main ? 1 : 0) - (a.main ? 1 : 0) : 0));
  const mainMissing = picked.filter((item) => item.type === 'look' && !item.main && !item.mainRef?.image?.artifact_id && !picked.some((other) => other.type === 'look' && other.main && other.owner === item.owner));
  if (mainMissing.length) {
    const need = [...new Set(mainMissing.map((item) => items.find((other) => other.type === 'look' && other.main && other.owner === item.owner)).filter(Boolean))];
    die(`这几个是变体形象，要用主形象的图保证同一张脸，但主形象还没出图：${mainMissing.map((item) => item.name).join('、')}\n  把主形象一起选上再跑（告诉用户会多出 ${need.length} 张）：--pick ${[...need.map((item) => item.no), ...picked.map((item) => item.no)].join(',')}`);
  }
  const todo = picked.filter((item) => redo || !item.ref.image?.file);
  const skipped = picked.length - todo.length;
  console.log(`已选 ${picked.length} 个${skipped ? `（其中 ${skipped} 个已出过图，跳过；要重出加 --force）` : ''}：${todo.map((item) => item.name).join('、') || '无'}`);
  if (!todo.length) return;
  console.log(`报价：${todo.length} 张 × 约 ${price} 分 = 约 ${todo.length * price} 分（以实际扣除为准，命令结束会打印）。`);
  if (!flag('yes')) die('请把上面的清单和报价告诉用户，得到同意后同一条命令加 --yes');
  const fragment = arg('project') || die('缺 --project <id片段或剧名>（图存到哪个项目里）');
  const p = await findProject(fragment);
  const before = await currentCredits();
  const outDir = path.join(path.dirname(file), ASSET_IMAGE_DIR);
  fs.mkdirSync(outDir, { recursive: true });
  const cfg = loadConfig();
  let ok = 0;
  const failed = [];
  for (const item of todo) {
    process.stdout.write(`  … ${ASSET_IMAGE_KIND[item.type]}「${item.name}」出图中`);
    try {
      // 变体要用主形象的图；主形象这一批里没出成就不出这张（不花分、不换脸）
      if (item.type === 'look' && !item.main && !item.mainRef?.image?.artifact_id) throw new Error('主形象这次没出成，这个变体先不出（各出各的会换脸）');
      const res = await api(`/api/projects/${p.id}/assets/generate-image`, {
        method: 'POST', timeoutMs: 360000, retries: 0, softFail: true,
        body: {
          kind: ASSET_IMAGE_KIND[item.type], name: item.name, prompt: item.prompt, aspect_ratio: '16:9', force: redo,
          ...(item.type === 'look' ? { base_character_name: item.owner, state_name: item.variant } : {}),
          // 变体：主形象的图作参考（图生图），提示词按客户端「沿用主状态身份母版」的写法
          ...(item.type === 'look' && !item.main && item.mainRef?.image?.artifact_id
            ? { reference_artifact_ids: [item.mainRef.image.artifact_id], identity_reference: true, primary_description: String(item.mainRef.styling?.description || item.mainRef.design?.prompt || item.mainRef.appearance || '') }
            : {}),
          ...(arg('style', '') ? { visual_style: arg('style') } : {}),
          prompt_template: 'client', // 和客户端资产卡同一套出图提示词（版式在知识库里）
          save_scope: 'project', source_text: ''
        }
      });
      const artifact = res?.artifact;
      if (!artifact?.id) throw new Error(res?.error || '平台没有返回图片');
      const bin = await fetch((cfg.platform_base || DEFAULT_PLATFORM) + `/api/artifacts/${artifact.id}/download`, {
        headers: { Authorization: 'Bearer ' + loadConfig().session_token, 'User-Agent': CLI_UA }, signal: AbortSignal.timeout(120000)
      });
      if (!bin.ok) throw new Error(`图片下载失败 HTTP ${bin.status}`);
      const buffer = Buffer.from(await bin.arrayBuffer());
      const ext = (String(artifact.title || '').match(/\.(png|jpe?g|webp)$/i) || ['', 'png'])[1].toLowerCase();
      const fileName = `${ASSET_IMAGE_KIND[item.type]}_${item.name.replace(/[\\/:*?"<>|\s]+/g, '_')}.${ext}`;
      fs.writeFileSync(path.join(outDir, fileName), buffer);
      item.ref.image = {
        ...(item.type === 'look' && !item.main ? { identity_from: item.mainRef.image.artifact_id } : {}),
        file: `${ASSET_IMAGE_DIR}/${fileName}`, project_id: p.id, artifact_id: artifact.id,
        sha256: crypto.createHash('sha256').update(buffer).digest('hex'), bytes: buffer.length, ratio: '16:9', generated_at: new Date().toISOString()
      };
      fs.writeFileSync(file, JSON.stringify(table, null, 1), 'utf8'); // 出一张记一张，中途断了不丢
      ok += 1;
      console.log(`  ✓ ${fileName}（${Math.round(buffer.length / 1024)}KB）`);
    } catch (e) {
      failed.push(item.name);
      console.log(`  ✗ ${String(e?.message || e).slice(0, 160)}`);
    }
  }
  const after = await currentCredits();
  console.log(`✓ 出图 ${ok}/${todo.length} 张 -> ${outDir}；图的位置已写回形象表（${path.basename(file)}）。`);
  if (before != null && after != null) console.log(`  实际扣除 ${before - after} 分（同一账号同时有别的任务时，这个差额会把别的任务也算进来）`);
  if (failed.length) { console.log(`  ⚠ 没出成的：${failed.join('、')}——原样告诉用户；要重试只对这几个再跑一次（失败的不扣分或已退分，以实际扣除为准）。`); process.exitCode = 2; }
  console.log('  把图给用户看；用户不满意某张，用 --pick <编号> --force 重出那一张（再扣一次分，先问用户）。');
  console.log(`  形象表改过了，交付前再存档一次：chenyu-pro archive --project ${p.id.slice(-8)} --dir <分析稿目录> --file "${file}"`);
}

// 取回存档：换机器 / 换 Agent / 上下文丢了之后接着做。只取「存档_」开头的文件，按原来的相对位置放回分析稿目录。
async function cmdArchiveFetch() {
  const fragment = arg('project') || die('缺 --project <id片段或剧名>');
  const p = await findProject(fragment);
  const dir = resolveAnalysisDir();
  const arts = (await api(`/api/projects/${p.id}/artifacts`)).artifacts || [];
  const seen = new Set();
  let got = 0;
  for (const a of arts) { // 列表按更新时间倒序：同名只取最新一份
    const fn = String(a.filename || a.title || '');
    if (!fn.startsWith(ARCHIVE_PREFIX) || seen.has(fn)) continue;
    seen.add(fn);
    const content = await fetchArtifactText(a);
    if (!content.trim()) continue;
    const name = fn.slice(ARCHIVE_PREFIX.length);
    const known = ARCHIVE_DEFAULT_FILES.find((parts) => parts.join('_') === name);
    const target = known ? path.join(dir, ...known) : path.join(dir, '存档', name);
    if (fs.existsSync(target) && !flag('force')) { console.log(`  · 本地已有，未覆盖（要覆盖加 --force）：${target}`); continue; }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    console.log(`  ✓ ${target}`);
    got += 1;
  }
  if (!seen.size) { console.log(`项目《${p.title}》还没有存档。`); return; }
  console.log(`✓ 取回存档 ${got} 个文件（项目里共 ${seen.size} 份存档）-> ${dir}`);
}

// ---------- 洗稿：换名 + 洗稿检查（纯本地、零积分） ----------

function readWashMapOrDie(file) {
  if (!fs.existsSync(file)) die(`没有找到 ${WASH_MAP_FILE}: ${file}\n  洗稿动笔前先写名字对照表：{"renames":{"源名":"新名",...},"creatures":["会说话的动物/灵物新名"],"insiders":["听得懂它们的人"]}`);
  let raw;
  try { raw = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`${WASH_MAP_FILE} 不是合法 JSON: ${e.message}`); }
  // 洗稿建议要用户修改或确认后才能动笔：草稿写的是 "confirmed": false，用户确认后改成确认的原话和日期
  if (raw && raw.confirmed === false) die(`⛔ ${WASH_MAP_FILE} 还是草稿（"confirmed": false）——洗稿建议还没有经用户修改或确认，不能开始换名和写洗稿剧本。\n  把《洗稿建议.md》交给用户，用户改完或说确认后，把 confirmed 改成用户确认的原话和日期（如 "2026-10-04 用户：按这个写"）再继续。`);
  const map = normalizeWashMap(raw);
  if (!Object.keys(map.renames).length) die(`${WASH_MAP_FILE} 的 renames 是空的`);
  return map;
}

function washMapPath(dir) {
  return path.resolve(arg('map', fs.existsSync(path.join(dir, WASH_MAP_FILE)) ? path.join(dir, WASH_MAP_FILE) : path.join(dir, '..', WASH_MAP_FILE)));
}

// rename：按 洗稿映射.json 对目录里的剧本做一字不差的换名（长名优先、一次扫描、不链式替换）。
function cmdRename() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro rename --dir <剧本目录> [--map 洗稿映射.json] [--dry-run]'));
  const map = readWashMapOrDie(washMapPath(dir));
  const checked = checkWashMap(map);
  for (const w of checked.warnings) console.log('  ⚠ ' + w);
  if (checked.problems.length) { for (const p of checked.problems) console.log('  ✗ ' + p); die('名字对照表有问题，先改表'); }
  const dry = flag('dry-run');
  let files = 0, total = 0;
  for (const f of listScriptFiles(dir)) {
    const before = fs.readFileSync(f, 'utf8');
    const { text, count } = applyRenames(before, map.renames);
    if (!count) continue;
    files++; total += count;
    if (!dry) fs.writeFileSync(f, text, 'utf8');
    console.log(`  ${path.basename(f)}：换名 ${count} 处`);
  }
  console.log(`${dry ? '（试运行，未写盘）' : '✓'} ${files} 个文件、共 ${total} 处换名。换完跑 chenyu-pro gate --dir 和 wash-check。`);
}

// wash-check：洗稿正文逐集对照平台分析稿。输出 WASH_PASS / WASH_FAIL(exit 1)。
function cmdWashCheck() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro wash-check --dir <剧本目录> --source <分析稿目录> [--map 洗稿映射.json]'));
  const srcDir = path.resolve(arg('source', '') || die('缺 --source <分析稿目录>（video-analyze/video-fetch 取回的目录，写作用的整理版目录也可以）'));
  // --source 给目录或直接给合集文件都行
  const dossierFile = fs.existsSync(srcDir) && fs.statSync(srcDir).isFile() ? srcDir : path.join(srcDir, DOSSIER_FILE);
  if (!fs.existsSync(dossierFile)) die(`分析稿目录里没有 ${DOSSIER_FILE}: ${srcDir}`);
  const map = readWashMapOrDie(washMapPath(dir));
  const mapCheck = checkWashMap(map);
  const episodes = listScriptFiles(dir).map((f) => ({ n: episodeNoOfFile(path.basename(f)), text: fs.readFileSync(f, 'utf8') })).filter((e) => e.n > 0);
  if (!episodes.length) die('目录里没有文件名带「第N集」的剧本');
  let result;
  try { result = washCheck({ episodes, dossierText: fs.readFileSync(dossierFile, 'utf8'), map }); } catch (e) { die(e.message); }
  const errors = [...mapCheck.problems, ...result.errors], warnings = [...mapCheck.warnings, ...result.warnings];
  const s = result.stats;
  console.log(s.mode === 'keep'
    ? `洗稿检查（保留原台词）：${s.episodes} 集，台词 ${s.lines} 句（原片 ${s.sourceLines} 句），原台词保留 ${s.retained} 句（${(s.retainRate * 100).toFixed(1)}%）——没保留的逐句放回，或在审核结论 dialogue_changes 写理由`
    : `洗稿检查（台词换说法）：${s.episodes} 集，台词 ${s.lines} 句（原片 ${s.sourceLines} 句），和原片几乎一样的 ${s.copied} 句（${(s.copyRate * 100).toFixed(1)}%）`);
  const show = (list, mark, limit) => { for (const x of list.slice(0, limit)) console.log(`  ${mark} ${x}`); if (list.length > limit) console.log(`  … 另有 ${list.length - limit} 处（加 --all 全部列出）`); };
  const limit = flag('all') ? Infinity : 80;
  show(errors, '✗', limit);
  show(warnings, '⚠', limit);
  if (result.info.length) { console.log('  台词里出现的年数（核对时间线口径是否一致）：'); for (const x of result.info) console.log('    ' + x); }
  if (flag('address')) { console.log('  称呼对照（谁在台词里叫了谁/什么，出现在哪几集；同一人对同一对象叫法突变要核对）：'); for (const x of addressTable(episodes, map)) console.log('    ' + x); }
  if (errors.length) { console.log(`WASH_FAIL 硬伤${errors.length}处 警告${warnings.length}处 —— 照抄的逐句换说法（功能不变），残留名改成新名，改完重跑`); process.exit(1); }
  console.log(`WASH_PASS${warnings.length ? `（警告${warnings.length}处，逐条看一眼）` : ''}`);
}

// deliver-check：洗稿交付门。机器指标 + 审核结论.json（剧情完整/对话称呼/剧情逻辑）全部达标才 DELIVERY_PASS；
// 不达标时列出"下一轮要做的事"，Agent 照单修改后重跑，循环到通过为止。
function cmdDeliverCheck() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro deliver-check --dir <剧本目录> --source <分析稿目录> [--map 洗稿映射.json] [--review 审核结论.json]'));
  const srcDir = path.resolve(arg('source', '') || die('缺 --source <分析稿目录>'));
  // --source 给目录或直接给合集文件都行
  const dossierFile = fs.existsSync(srcDir) && fs.statSync(srcDir).isFile() ? srcDir : path.join(srcDir, DOSSIER_FILE);
  if (!fs.existsSync(dossierFile)) die(`分析稿目录里没有 ${DOSSIER_FILE}: ${srcDir}`);
  const map = readWashMapOrDie(washMapPath(dir));
  const reviewFile = path.resolve(arg('review', fs.existsSync(path.join(dir, REVIEW_FILE)) ? path.join(dir, REVIEW_FILE) : path.join(dir, '..', REVIEW_FILE)));
  let review = null;
  if (fs.existsSync(reviewFile)) {
    try { review = JSON.parse(fs.readFileSync(reviewFile, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`${REVIEW_FILE} 不是合法 JSON: ${e.message}`); }
  }
  const files = listScriptFiles(dir);
  const episodes = files.map((f) => ({ n: episodeNoOfFile(path.basename(f)), text: fs.readFileSync(f, 'utf8') })).filter((e) => e.n > 0);
  if (!episodes.length) die('目录里没有文件名带「第N集」的剧本');
  // 格式门（跨集形象延续）
  const { table } = loadVariantTable(dir);
  const ctx = newVariantContext(table);
  let gateErrors = 0; const gateWarnings = [];
  for (const f of files) {
    ctx.episode = episodeNoOfFile(path.basename(f));
    const { errors, warnings } = gateOneScript(fs.readFileSync(f, 'utf8'), ctx);
    gateErrors += errors.length;
    for (const w of warnings) gateWarnings.push(`第${String(ctx.episode).padStart(3, '0')}集 ${w}`);
  }
  let result;
  try { result = deliverCheck({ episodes, dossierText: fs.readFileSync(dossierFile, 'utf8'), map, review, gateErrors, gateWarnings }); } catch (e) { die(e.message); }
  console.log(`交付检查：${episodes.length} 集｜${review ? '审核结论 ' + path.basename(reviewFile) : '⚠ 没有审核结论.json'}`);
  for (const line of result.report) console.log('  · ' + line);
  if (!result.pass) {
    const limit = flag('all') ? Infinity : 60;
    console.log(`DELIVERY_FAIL 还有 ${result.todo.length} 件事要做（改完重跑 deliver-check，直到通过；不要把现在的稿子当成品交付）：`);
    result.todo.slice(0, limit).forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    if (result.todo.length > limit) console.log(`  … 另有 ${result.todo.length - limit} 件（加 --all 全部列出）`);
    if (!review) console.log(`  审核结论写到 ${reviewFile}，格式见 SKILL.md「洗稿交付标准」。`);
    process.exit(1);
  }
  console.log('DELIVERY_PASS 达到交付标准，可以 save 回传并交付（附审核报告）。');
}

// assets-export：全局资产清单（人物/形象/场景/道具），随稿交付给下游建角色卡、场景图、道具图。
// 原片时长标注：集标题下写【原片时长】、每场写【本场时长】，客户端转分镜按原片节奏分配时长（不写会被压短三成）
function cmdDurations() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro durations --dir <剧本目录> --source <分析稿目录或合集文件> [--dry-run]'));
  const srcArg = path.resolve(arg('source', '') || die('缺 --source <分析稿目录>（video-analyze/video-fetch 取回的目录或整理版目录）'));
  const dossierFile = fs.existsSync(srcArg) && fs.statSync(srcArg).isFile() ? srcArg : path.join(srcArg, DOSSIER_FILE);
  if (!fs.existsSync(dossierFile)) die(`分析稿目录里没有 ${DOSSIER_FILE}: ${srcArg}`);
  const files = listScriptFiles(dir).filter((f) => episodeNoOfFile(path.basename(f)) > 0);
  if (!files.length) die('目录里没有文件名带「第N集」的剧本');
  let renames = {};
  const mapFile = washMapPath(dir);
  if (fs.existsSync(mapFile)) renames = readWashMapOrDie(mapFile).renames;
  const episodes = files.map((f) => ({ file: f, n: episodeNoOfFile(path.basename(f)), text: fs.readFileSync(f, 'utf8') }));
  const results = annotateDurations(episodes, fs.readFileSync(dossierFile, 'utf8'), renames);
  const dry = flag('dry-run');
  let missing = 0;
  results.forEach((r, i) => {
    if (!r.total) { missing += 1; console.log(`  ⚠ 第${r.n}集 分析稿里没有这一集的时长，跳过`); return; }
    console.log(`  第${String(r.n).padStart(3, '0')}集 原片 ${r.total.toFixed(1)} 秒：${r.scenes.map((s) => `${s.head.split(/\s+/)[0]} ${s.seconds}s`).join('、')}`);
    if (!dry) fs.writeFileSync(episodes[i].file, r.text, 'utf8');
  });
  // 插了行，按行号登记的 waivers 跟着挪（审核结论.json 在剧本目录或上一级）
  for (const cand of [path.join(dir, REVIEW_FILE), path.join(dir, '..', REVIEW_FILE)]) {
    if (!fs.existsSync(cand)) continue;
    try {
      const review = JSON.parse(fs.readFileSync(cand, 'utf8').replace(/^﻿/, ''));
      const moved = shiftWaivers(review, results);
      if (moved && !dry) fs.writeFileSync(cand, JSON.stringify(review, null, 1), 'utf8');
      if (moved) console.log(`  审核结论 waivers 行号跟着挪了 ${moved} 条${dry ? '（试运行未写）' : ''}`);
    } catch (e) { console.log(`  ⚠ 审核结论读不了，waivers 行号没挪：${e.message}`); }
    break;
  }
  console.log(`${dry ? '（试运行，未写盘）' : '✓ 已写入'} ${results.length - missing} 集的【原片时长】和【本场时长】。改完跑 gate --dir 确认格式。`);
}

const LOOK_DESIGN_FILE = '形象设计.json';
const LOOK_KIT_DIR = '形象设计资料';
const STYLING_STATIC = path.join(path.dirname(fileURLToPath(import.meta.url)), 'styling_static.json');

// 造型资料：知识库两条提示词 + 全量形象库，用积分 KEY 实时取（和客户端造型 AI 收到的是同一份）
async function fetchStylingKit(kitDir) {
  const cfg = loadConfig();
  const key = String(cfg.credit_key || '').trim();
  if (!key) die('未绑定积分 KEY——先运行: chenyu-pro key set <你的KEY>（形象设计要用它取知识库造型提示词）');
  const base = String(cfg.credit_base || DEFAULT_CREDIT_BASE).replace(/\/$/, '');
  const headers = { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'User-Agent': CLI_UA };
  const token = (id) => `␞PMPT:${id}␞`;
  const r1 = await fetch(base + '/api/v1/prompt-registry/resolve', { method: 'POST', headers, body: JSON.stringify({ texts: [token('styling.core_rules'), token('styling.voice_preset_guide'), token('asset.global_table.system')] }) });
  const j1 = await r1.json().catch(() => ({}));
  if (!r1.ok || !j1.success || !Array.isArray(j1.texts)) die(`取知识库造型提示词失败：HTTP ${r1.status} ${j1.error || ''}`);
  const clean = (s) => String(s || '').replace(/␞/g, '').trim();
  const r2 = await fetch(base + '/api/v1/character-styling-catalog', { headers });
  const j2 = await r2.json().catch(() => ({}));
  const capsules = j2?.catalog?.wardrobeCapsules || j2?.wardrobeCapsules || [];
  if (!r2.ok || !capsules.length) die(`取形象库失败：HTTP ${r2.status} ${j2.error || ''}`);
  fs.mkdirSync(kitDir, { recursive: true });
  const kit = { coreRules: clean(j1.texts[0]), voicePresetGuide: clean(j1.texts[1]), assetTableRules: clean(j1.texts[2]), capsules, fetchedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(kitDir, 'kit.json'), JSON.stringify(kit), 'utf8');
  return kit;
}

const expandEpisodeSpan = (span) => new Set(String(span || '').split(/[、,]/).flatMap((p) => {
  const m = p.trim().match(/^(\d+)(?:[–-](\d+))?$/);
  if (!m) return [];
  const a = Number(m[1]), b = Number(m[2] || m[1]);
  return Array.from({ length: Math.min(b - a + 1, 200) }, (_, i) => a + i);
}));

// 洗稿（有名字对照表）默认要重做形象；用户明确要沿用原片形象时在 洗稿映射.json 写 "redesignLooks": "none"
function washRedesignMode(dir) {
  const file = washMapPath(dir);
  if (!fs.existsSync(file)) return false;
  try { const raw = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); return Object.keys(raw.renames || {}).length > 0 && raw.redesignLooks !== 'none'; } catch { return false; }
}
// 每个形象给 Agent 的角色信息：原片外观锚点（审核结论/分析稿）、状态、出现集、剧本里写到他的动作行和台词（判断身份、气质、声线）
function buildLookInputs(table, episodes, looks) {
  const lookText = new Map((looks || []).map((x) => [`${String(x.role || '').trim()}=${String(x.variant || '').trim()}`, x]));
  const inputs = new Map();
  for (const c of table.characters) for (const l of c.looks) {
    const lk = lookText.get(`${c.name}=${l.variant}`) || {};
    const eps = expandEpisodeSpan(l.episodes);
    const actions = [], lines = [];
    for (const ep of episodes) {
      if (!eps.has(ep.n) || (actions.length >= 4 && lines.length >= 4)) continue;
      for (const raw of String(ep.text).split('\n')) {
        const s = raw.trim();
        if (actions.length < 4 && s.startsWith('△') && s.includes(c.name)) actions.push(`第${ep.n}集 ${s.slice(0, 80)}`);
        if (lines.length < 4 && s.startsWith(c.name + '：')) lines.push(`第${ep.n}集 ${s.slice(0, 60)}`);
      }
    }
    inputs.set(`${c.name}=${l.variant}`, {
      characterName: `[${c.name}-${l.variant}]`, kind: c.kind, stateLabel: l.variant, stateReason: l.reason || '', isPrimaryState: l.main,
      episodes: l.episodes, appearanceFeatures: lk.appearance || l.appearance || '', sourceActions: actions, sourceLines: lines,
      // 洗稿：原片外观只作参考身份和状态，不照抄
      ...(String(lk.source || '').trim() ? { originalAppearance: String(lk.source).trim() } : {}),
    });
  }
  return inputs;
}

// 场景/道具给 Agent 的资料：场景取环境行和前几行 △，道具取写到它的 △ 和【道具】括号里的归属/状态
function buildPlacePropInputs(table, episodes) {
  const inputs = new Map();
  const placeSet = new Set((table.places || []).map((p) => p.name));
  const placeText = new Map([...placeSet].map((n) => [n, { env: [], actions: [] }]));
  for (const ep of episodes) {
    let cur = null, afterHead = 0;
    for (const raw of String(ep.text).split('\n')) {
      const s = raw.trim();
      if (!s) continue;
      const head = s.match(/^\d+\s*[-–—]\s*\d+\s+(?:日|夜|晨|昏|黄昏|清晨|傍晚|白天|夜晚)?\s*(?:内|外|室内|室外)?\s*(.+)$/);
      if (head && /^\d+-\d+\s/.test(s)) { cur = placeText.get(head[1].trim()) || null; afterHead = 0; continue; }
      if (!cur || /^(人物|【)/.test(s)) continue;
      afterHead++;
      if (afterHead <= 2 && !s.startsWith('△') && !/^[^：:]{1,14}[：:]/.test(s) && cur.env.length < 4) cur.env.push(`第${ep.n}集 ${s.slice(0, 120)}`);
      else if (s.startsWith('△') && cur.actions.length < 4) cur.actions.push(`第${ep.n}集 ${s.slice(0, 90)}`);
    }
  }
  for (const p of table.places || []) {
    const t = placeText.get(p.name) || { env: [], actions: [] };
    inputs.set(`place=${p.name}`, { times: p.times, episodes: p.episodes, parentGuess: p.name.includes('·') ? p.name.split('·')[0] : '', environmentLines: t.env, sampleActions: t.actions });
  }
  for (const p of table.props || []) {
    const eps = expandEpisodeSpan(p.episodes);
    const mentions = [];
    for (const ep of episodes) {
      if (!eps.has(ep.n) || mentions.length >= 4) continue;
      for (const raw of String(ep.text).split('\n')) {
        const s = raw.trim();
        if (mentions.length < 4 && s.startsWith('△') && s.includes(p.name)) mentions.push(`第${ep.n}集 ${s.slice(0, 90)}`);
      }
    }
    inputs.set(`prop=${p.name}`, { owners: p.owners, counts: p.counts, states: p.states, episodes: p.episodes, episodeCount: eps.size, mentions });
  }
  return inputs;
}

// 场景道具设计任务书：规则取知识库 asset.global_table.system（客户端全局资产表同一份），只看其中道具与场景的部分
function writePlacePropTask(kitDir, root, table, episodes, kit) {
  const file = path.join(root, PLACE_PROP_DESIGN_FILE);
  let existing = [];
  if (fs.existsSync(file)) { try { existing = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`${file} 不是合法 JSON：${e.message}`); } }
  const tpl = placePropTemplate(table, existing, buildPlacePropInputs(table, episodes));
  fs.writeFileSync(file, JSON.stringify(tpl, null, 1), 'utf8');
  const task = [
    '# 场景道具设计任务（和客户端全局资产表同一套规则，思考由你做）',
    '',
    `本剧场景 ${(table.places || []).length} 个、道具 ${(table.props || []).length} 件。逐条填写上一级 ${PLACE_PROP_DESIGN_FILE} 里每条的 design（input 是剧本里关于它的资料，只读），填完跑 \`chenyu-pro assets-export --dir <剧本目录>\` 检查，直到 ASSET_DESIGN_PASS。`,
    '',
    '## 一、规则（知识库 asset.global_table.system；这里只用其中「道具与场景」「通话设备」两部分，人物/形象部分由形象设计负责）',
    kit.assetTableRules || '（kit.json 缺 assetTableRules：重跑 looks-prepare 取知识库）',
    '',
    '## 道具建卡要克制（先看这一段）',
    `道具已按出现情况分了级（每条的 tier）：A=跨集反复出现的专属物件，要建卡，由你写外观；B=只在一两集起作用；C=随手用的普通物件。B、C 已经预填了 card:false 和原因，**默认不用动**。`,
    '建卡没有数量限制，按「是什么」判断：同一件东西只用一个名字、只建一张卡；不同的人各自拿的普通物件（手机、话筒、出租车、电脑）不建卡。标了建卡的，客户端导入时就全部建卡出图。',
    '只有同时满足「外观必须前后一致」和「观众会注意到它」的 B 级道具（信物、证据原件、标志性随身物），才把 card 改成 true 并写 description；水杯、盘子、文件夹、普通手机这类一律不建卡。',
    '',
    '## 二、输出格式',
    '场景：{"description":"80–180 个汉字的可搭建空间说明：布局、门窗墙地、固定家具、纵深；稀疏场景可做保守空间设计，不新增剧情实体","shortDescription":"4–18 字场景短标签","parentLocation":"所属物理地点（同一建筑/院落/机构/车辆填同一个名字，门口与室内同组但仍是不同场景）"}',
    '道具：{"card":true 或 false,"reason":"不建卡时写原因","description":"建卡时 50–140 个汉字的实体外观说明：材质、颜色、形状、尺寸、磨损、独特标记","shortDescription":"建卡时 4–18 字道具短标签"}',
    '',
    '- 道具建卡：确有稳定外观、跨镜头/跨集要连续、或外观独特的才建（信物、证据原件、关键图纸、标志性随身物）；普通一次性纸张、单据、食物、屏幕内容不建卡（剧情照写，只是不出卡）。',
    '- 例外：人物在剧本里实际拿起、拨打、接听、挂断的手机/电话等通话设备，必须建卡。',
    '- 描述只写看得见的外观，按原剧本世界（年代、身份、贫富）设计；不写剧情、不写人物动作、不写“被打翻”这类状态（状态留在分镜里）。',
    '- 同一物理地点的子场景（如「程家·客厅」「程家·书房」）风格统一：parentLocation 相同，描述里的建筑年代、装修风格、主色保持一致。',
  ].join('\n');
  fs.writeFileSync(path.join(kitDir, '场景道具设计任务.md'), task, 'utf8');
  const todo = tpl.filter((e) => (e.type === 'place' ? !String(e.design?.description || '').trim() : e.design?.card !== true && e.design?.card !== false)).length;
  console.log(`✓ 场景道具设计 -> ${file}：场景 ${(table.places || []).length} + 道具 ${(table.props || []).length}，待填 ${todo} 条（已填的保留）；任务书 ${path.join(kitDir, '场景道具设计任务.md')}`);
}

// 形象设计：走客户端造型 AI 的同一套固定流程（同样的知识库提示词、资料、输出格式），思考由 Agent 做
async function cmdLooksPrepare() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro looks-prepare --dir <剧本目录>'));
  const episodes = listScriptFiles(dir).map((f) => ({ n: episodeNoOfFile(path.basename(f)), text: fs.readFileSync(f, 'utf8') })).filter((e) => e.n > 0);
  if (!episodes.length) die('目录里没有文件名带「第N集」的剧本');
  let looks = [], creatures = [];
  for (const cand of [path.join(dir, REVIEW_FILE), path.join(dir, '..', REVIEW_FILE)]) {
    if (fs.existsSync(cand)) { try { looks = JSON.parse(fs.readFileSync(cand, 'utf8').replace(/^﻿/, '')).looks || []; } catch {} break; }
  }
  const mapFile = washMapPath(dir);
  if (fs.existsSync(mapFile)) { try { creatures = JSON.parse(fs.readFileSync(mapFile, 'utf8').replace(/^﻿/, '')).creatures || []; } catch {} }
  const table = lookTableJson(collectAssets(episodes, { looks, creatures }));
  const root = path.join(dir, '..');
  const kitDir = path.join(root, LOOK_KIT_DIR);
  const kit = await fetchStylingKit(kitDir);
  const st = JSON.parse(fs.readFileSync(STYLING_STATIC, 'utf8'));
  const file = path.resolve(arg('out', path.join(root, LOOK_DESIGN_FILE)));
  let existing = [];
  if (fs.existsSync(file)) { try { existing = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')); } catch (e) { die(`${file} 不是合法 JSON：${e.message}`); } }
  if (!Array.isArray(existing) || existing.some((e) => e && e.design && !e.styling)) existing = []; // 旧版 design 字段格式不再沿用
  const tpl = lookStylingTemplate(table, existing, buildLookInputs(table, episodes, looks));
  fs.writeFileSync(file, JSON.stringify(tpl, null, 1), 'utf8');
  const washRedesign = washRedesignMode(dir);
  const task = [
    '# 形象设计任务（和客户端造型 AI 同一套固定流程，思考由你做）',
    '',
    ...(washRedesign ? [
      '## 〇、这是洗稿：全部形象要重新设计，不能沿用原片',
      '目标是和原片拉开辨识度——脸型、发型、主色调、配色、服装款式都换；只保留服装类别和状态（病号服仍是病号服、制服仍是制服、婚纱仍是婚纱）、年龄段、身份。',
      '- 先在 审核结论.json 的 looks 里把每条写成两栏：source = 原片外观（一两句，照分析稿）；appearance = 重做后的外观（一两句）。写完重跑 looks-prepare，input.originalAppearance 就是原片外观，只用来看身份和状态，不要照抄它的脸、发型、配色、款式。',
      '- 主色调不能和原片同一个色系；剧本动作行里写到的服装、发型、颜色，要跟着新形象一起改。',
      '- 制式服装、剧情靠颜色认人的角色照原片，在 保留说明.json 写 名字: 原因。用户明确说沿用原片形象的，在 洗稿映射.json 写 "redesignLooks": "none"。',
      '- assets-export 会查：没写 source、新旧一样、主色调和原片同色系，都不给通过。',
      '',
    ] : []),
    `本剧 ${tpl.length} 个形象。做法：先通读全部形象的角色信息，按第七节先做全剧配色规划（同场的角色主色/发型/脸型错开；同一角色各形象脸、身形、发型、发色一致，只按状态换装），`,
    '再逐条按下面的「输出格式」填写同目录上一级 形象设计.json 里每条的 styling（input 是这个形象的角色信息，只读）。填完跑 `chenyu-pro assets-export --dir <剧本目录>` 检查，直到 STYLING_AUDIT_PASS（那是客户端原样的造型审核，不过就会被客户端打回重调模型扣分）。',
    '',
    '客户端审核最常打回的几处，动笔就避开：',
    ...STYLING_AUDIT_HINTS.slice(0, 6).map(([, h]) => `- ${h}`),
    '',
    '## 一、造型核心规则（知识库 styling.core_rules）', kit.coreRules, '',
    '## 二、音色库键名参考（知识库 styling.voice_preset_guide）', kit.voicePresetGuide, '',
    '## 三、Doubao voice ID candidates (default TTS provider)', st.doubaoVoiceCandidateGuide, '', ...st.voiceContract, '',
    '## 四、全量形象库索引（wardrobeCapsuleId 必须取这里的真实 id）', buildCatalogIndex(kit.capsules), '',
    '## 五、原文审核规则（客户端每次造型都带）', ...st.auditRules.map((r) => '- ' + r), '',
    '## 六、输出格式（每条 styling 一个对象，和造型 AI 单条返回一致）',
    '{"classification":{"roleDomain":"身份领域","roleTags":["具体身份标签"]},"wardrobeCapsuleId":"形象库真实 id","description":"性别：…。年龄段：…。外观特征：…。脸部：…。身材：…。发型：…。服饰类型：…。发色：…。主色调：…。部件配色：…。视觉锚点：…。（≥120 中文字，按这个顺序）","voicePresetKey":"女-青年-明亮利落","voiceRefDescription":"≤4 个声学特点","ttsProvider":"Doubao","doubaoVoiceId":"候选里的确切 ID","doubaoVoiceModel":"' + st.doubaoDefaultModel + '","doubaoVoiceSpeed":1}',
    '',
    '- 同一角色的各形象用同一个 voicePresetKey 和 doubaoVoiceId（回忆里不同年龄段的形象除外：幼年/少年换对应年龄的音色，否则客户端音色审核会打回重做）；群体角色写成一群人的统一装束；非人角色按物种外形写，音色按它的说话方式选（不说话的选最贴近的并在 voiceRefDescription 写明「不说话」）。',
    '- 身份、年龄、体貌、服装款式和状态以原片为准（input.appearanceFeatures 是原片外观锚点，不可改写）；主色调按第七节的全剧配色规划定。',
    '',
    '## 七、全剧配色规划（动笔填 styling 之前先做；和客户端的造型总监是同一套要求）',
    '先给**出现 3 集以上的角色**每人定一个主色、一个发型、一个脸部设计，写成一张表存到 形象设计资料/配色规划.md，再照表逐条填 styling。',
    '1. 同场出现的角色主色调必须错开色相（黑、白、灰、蓝、青、绿、红、粉、紫、橙、黄金、棕褐各算一个色相）；只换深浅、换个叫法、换成邻近近义色都算同色。主角和他最常同场的几个人优先错开。',
    '2. 主色要鲜明、一眼看得出是什么颜色（藏青、墨绿、宝蓝、孔雀蓝绿、深梅紫、酒红、砖红、姜黄、香槟金、靛蓝），黑白灰只留给一两个角色。',
    '3. 原片里几乎人人黑灰的（武馆、职场、古装门派），不要照搬成全员黑灰：服装款式照原片，主色按规划错开。',
    '4. 例外只有两种，照原片给色并在 保留说明.json 写 名字: 原因——身份锁定的制式服装（制服、警服、军装、校服、医护服、病号服）；剧情靠颜色认人的（白衣武者、黑衣随从、名字或台词里点了颜色）。',
    '5. 发型：任意两个出现 3 集以上的角色不得雷同（只换长度或换个说法算同款）；男性先服从人设，再按轮廓错开（露额后梳／极短／刘海遮额／中长发／卷发／分线短发）。',
    '6. 脸：同性别的两个角色脸型、眼型至少一项不同，辨识特征（痣、胡茬、法令纹、酒窝等）不重复；眼镜、伤疤、胎记只有原片里有才写。同制服同阵营的更要靠年龄、胖瘦、脸型、胡须拉开。',
    '7. 同一个角色的各个形象：脸、身材、发型、发色一致，只按状态换装；变体的主色可以不同。',
    'assets-export 会查：同场出现、出现 3 集以上的两个角色主色调是同一色相的，逐对列出来。',
    '',
    '## 八、原文特征和详细描述是两样东西',
    '- 原文特征 = 审核结论.json 里 looks 的 appearance，也就是这里的 input.appearanceFeatures：只写原片里看得到的一两句（约七十岁老妇人，灰白盘发，拄竹拐杖，深青色绣纹长袍）。不分段、不写设计。',
    '  里面写了颜色，客户端就认为这个颜色是原文锁定的，不再参与配色错开——所以只有剧情靠颜色认人的才在原文特征里写颜色。',
    '- 详细描述 = styling.description：按第六节的顺序逐段写，是你做完配色规划后的设计结果。',
    '- 两栏内容一样、或原文特征写成了「脸部：…身材：…部件配色：…」的分段稿，assets-export 不通过。',
  ].join('\n');
  fs.writeFileSync(path.join(kitDir, '形象设计任务.md'), task, 'utf8');
  const todo = tpl.filter((e) => !String(e.styling?.description || '').trim()).length;
  console.log(`✓ 形象设计任务 -> ${path.join(kitDir, '形象设计任务.md')}（知识库提示词 + 豆包音色 ${st.doubaoVoiceCandidateGuide.split('\n').length} 个 + 形象库 ${kit.capsules.length} 个 + 审核规则 ${st.auditRules.length} 条）`);
  console.log(`✓ 形象设计 -> ${file}：${tpl.length} 个形象，待填 ${todo} 个（已填的保留）。填 styling 后跑 assets-export 检查并进形象表.json`);
  writePlacePropTask(kitDir, root, table, episodes, kit);
}

// 客户端造型审核原样打包在 styling_audit.mjs（判定与客户端一致）：这里不通过的形象，上传后客户端会打回重调模型（扣用户积分）
const STYLING_AUDIT_HINTS = [
  [/未写完的段/, '段落不能以「和 与 及 为 呈 穿 套 披 系 戴 配 搭 、 ，」结尾（「手套」「头套」「内搭」也算），把这类词挪到段中间或换说法'],
  [/voice-id-profile-age-conflict|voice-id-age-conflict|voice-age-conflict/, '音色 ID 的年龄档和描述「年龄段」的数字没有交集（儿童0-12/少年12-18/青年18-39/中年35-60/老年55-120/成人18-60）；候选里没有老年女声，老年女性把年龄段下限写到 60（如「60-75岁」）配中年/成人女声'],
  [/gender-conflict/, '音色（预设/ID/说明）的性别和描述「性别」不一致'],
  [/unusable AI voice preset:\s*$/, 'voiceRefDescription 要以「青年男声 / 中年女声」这类 年龄+性别+声 开头，最多 4 个声学特征'],
  [/story-fit-missing:law-role/, '原文是警察/律师/法官，描述里要写出身份词（律师、警察、执法、制服等）'],
  [/story-fit-missing:service-role/, '原文是管家/佣人/厨师，描述里要写出身份词（管家、佣人、厨师、围裙等）'],
  [/story-fit-missing:/, '原文身份没有在描述里体现，写出身份词'],
  [/catalog text copied|description gender/, '描述照抄了形象库文字，或描述性别和原文性别不一致'],
  [/unknown exact catalog ID/, 'wardrobeCapsuleId 不在形象库里（先跑 looks-prepare 取云端形象库）'],
  [/classification missing/, '缺 classification（roleDomain/roleTags）'],
];
// 保留说明.json（和形象表放一起）：{ "角色名": "为什么这个没台词的单集人物也要单独建卡" }
function readKeepNotes(dir) {
  try { const notes = JSON.parse(fs.readFileSync(path.join(dir, '保留说明.json'), 'utf8').replace(/^﻿/, '')); return notes && typeof notes === 'object' ? notes : {}; } catch { return {}; }
}
// assets-export 一次运行里各项审核的结果：形象表完不完整要一起看
const exportState = { stylingAudit: '', designProblems: 0 };
async function auditStylingLikeClient(lookTable, kitDir) {
  const audit = await import('./styling_audit.mjs');
  const kitFile = path.join(kitDir, 'kit.json');
  if (fs.existsSync(kitFile)) {
    const kit = JSON.parse(fs.readFileSync(kitFile, 'utf8'));
    audit.setStylingCatalog({ source: 'cloud', version: kit.fetchedAt || '', wardrobeCapsules: kit.capsules || [] });
  } else console.log('  ⚠ 没有形象设计资料/kit.json，形象库按 Skill 内置版本核对，可能误报「不在形象库」；先跑 looks-prepare');
  const rows = await audit.auditLookTableStyling(lookTable);
  const bad = rows.filter((r) => r.modelCalls?.length);
  fs.mkdirSync(kitDir, { recursive: true });
  fs.writeFileSync(path.join(kitDir, '客户端审核.json'), JSON.stringify(rows, null, 1), 'utf8');
  if (!bad.length) {
    console.log(`  ✓ 客户端造型审核：${rows.length}/${rows.length} 通过（上传后不会重调模型）  STYLING_AUDIT_PASS`);
    exportState.stylingAudit = 'pass';
    return;
  }
  console.log(`  ✗ 客户端造型审核：${bad.length}/${rows.length} 个形象上传后会被客户端打回重调模型（扣用户积分），改 ${LOOK_DESIGN_FILE} 后重跑 assets-export：`);
  for (const r of bad) {
    const raw = r.issues.join(' / ');
    const hints = [...new Set(STYLING_AUDIT_HINTS.filter(([re]) => r.issues.some((i) => re.test(i))).map(([, h]) => h))];
    console.log(`    · ${r.tag}：${raw.slice(0, 200)}`);
    for (const h of hints) console.log(`        → ${h}`);
  }
  console.log(`  明细：${path.join(kitDir, '客户端审核.json')}  STYLING_AUDIT_FAIL`);
  exportState.stylingAudit = 'fail';
  process.exitCode = 2;
}

async function cmdAssetsExport() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro assets-export --dir <剧本目录> [--out 全局资产清单.md] [--title 剧名]'));
  const episodes = listScriptFiles(dir).map((f) => ({ n: episodeNoOfFile(path.basename(f)), text: fs.readFileSync(f, 'utf8') })).filter((e) => e.n > 0);
  if (!episodes.length) die('目录里没有文件名带「第N集」的剧本');
  let looks = [], creatures = [];
  for (const cand of [path.join(dir, REVIEW_FILE), path.join(dir, '..', REVIEW_FILE)]) {
    if (fs.existsSync(cand)) { try { looks = JSON.parse(fs.readFileSync(cand, 'utf8').replace(/^\uFEFF/, '')).looks || []; } catch {} break; }
  }
  const mapFile = washMapPath(dir);
  if (fs.existsSync(mapFile)) { try { creatures = JSON.parse(fs.readFileSync(mapFile, 'utf8').replace(/^\uFEFF/, '')).creatures || []; } catch {} }
  const assets = collectAssets(episodes, { looks, creatures });
  const out = path.resolve(arg('out', path.join(dir, '..', '全局资产清单.md')));
  fs.writeFileSync(out, renderAssetList(assets, { title: arg('title', '') }), 'utf8');
  fs.writeFileSync(out.replace(/\.md$/, '.json'), JSON.stringify(assetListJson(assets), null, 1), 'utf8');
  const noLook = [...assets.people.values()].reduce((s, p) => s + [...p.looks.values()].filter((l) => !l.appearance).length, 0);
  console.log(`✓ 全局资产清单 -> ${out}（同名 .json 供程序读取）`);
  const lookTable = lookTableJson(assets, { title: arg('title', '') || inferTitleFromDir(dir) });
  const lookFile = path.join(path.dirname(out), '形象表.json');
  // 形象设计（looks-prepare 生成任务、Agent 按造型 AI 格式回答）：并进形象表 look.styling，客户端当作模型回答走原流程
  const designFile = path.join(path.dirname(out), LOOK_DESIGN_FILE);
  if (EDITION !== 'gate' && fs.existsSync(designFile)) {
    try {
      const st = JSON.parse(fs.readFileSync(STYLING_STATIC, 'utf8'));
      const voiceIds = new Set(st.doubaoVoiceCandidateGuide.split('\n').map((l) => l.split('|')[0].trim()).filter(Boolean));
      let capsuleIds = null;
      const kitFile = path.join(path.dirname(out), LOOK_KIT_DIR, 'kit.json');
      if (fs.existsSync(kitFile)) { try { capsuleIds = new Set(JSON.parse(fs.readFileSync(kitFile, 'utf8')).capsules.map((c) => c.id)); } catch {} }
      const designIssues = mergeLookStylings(lookTable, JSON.parse(fs.readFileSync(designFile, 'utf8').replace(/^﻿/, '')), { voiceIds, capsuleIds });
      const done = lookTable.characters.reduce((s, c) => s + c.looks.filter((l) => l.styling).length, 0);
      const total = lookTable.characters.reduce((s, c) => s + c.looks.length, 0);
      console.log(`  形象设计：${done}/${total} 个形象已设计（客户端当作造型 AI 的回答走原流程；没设计的由客户端 AI 补）`);
      for (const x of designIssues.slice(0, 30)) console.log('  ⚠ ' + x);
      if (designIssues.length > 30) console.log(`  … 另有 ${designIssues.length - 30} 处`);
      if (done) await auditStylingLikeClient(lookTable, path.join(path.dirname(out), LOOK_KIT_DIR));
    } catch (e) { console.log(`  ⚠ ${LOOK_DESIGN_FILE} 读不了：${e.message}`); }
  }
  // 场景道具设计（looks-prepare 生成任务、Agent 按客户端全局资产表规则填）：并进形象表 places/props
  const placePropFile = path.join(path.dirname(out), PLACE_PROP_DESIGN_FILE);
  if (EDITION !== 'gate' && fs.existsSync(placePropFile)) {
    try {
      const ppIssues = mergePlacePropDesigns(lookTable, JSON.parse(fs.readFileSync(placePropFile, 'utf8').replace(/^﻿/, '')));
      const placeDone = (lookTable.places || []).filter((p) => p.description).length;
      const cards = (lookTable.props || []).filter((p) => p.card === true).length;
      const decided = (lookTable.props || []).filter((p) => p.card === true || p.card === false).length;
      console.log(`  场景道具设计：场景 ${placeDone}/${(lookTable.places || []).length} 有描述；道具 ${decided}/${(lookTable.props || []).length} 已判定，其中建卡 ${cards} 件`);
      exportState.designProblems = ppIssues.length;
      for (const x of ppIssues.slice(0, 30)) console.log('  ⚠ ' + x);
      if (ppIssues.length > 30) console.log(`  … 另有 ${ppIssues.length - 30} 处`);
      const budget = propBudgetNote(lookTable);
      console.log(`  ${budget.over ? '⚠' : '·'} ${budget.text}`);
      if (!ppIssues.length) console.log('  ✓ 场景道具设计齐全  ASSET_DESIGN_PASS');
      else { console.log(`  明细见上，改 ${PLACE_PROP_DESIGN_FILE} 后重跑  ASSET_DESIGN_FAIL`); process.exitCode = 2; }
    } catch (e) { console.log(`  ⚠ ${PLACE_PROP_DESIGN_FILE} 读不了：${e.message}`); }
  }
  // 完整性：客户端只收这一张表，缺什么客户端里就缺什么。不完整的表不叫「形象表.json」，免得被当成成品交出去。
  const draftFile = path.join(path.dirname(lookFile), '形象表.未完成.json');
  const incomplete = lookTableCompleteness(lookTable, { episodes: episodes.map((e) => e.n), requireDesign: EDITION !== 'gate', allowNoProps: flag('no-props'), keep: readKeepNotes(path.dirname(lookFile)) });
  if (EDITION !== 'gate' && washRedesignMode(dir)) {
    const redesign = washRedesignIssues(looks, lookTable, { keep: readKeepNotes(path.dirname(lookFile)), episodes });
    incomplete.push(...redesign.issues);
    for (const w of redesign.warnings.slice(0, 30)) console.log('  ⚠ ' + w);
    if (redesign.warnings.length > 30) console.log(`  … 另有 ${redesign.warnings.length - 30} 处`);
  }
  if (EDITION !== 'gate') {
    if (exportState.stylingAudit === 'fail') incomplete.push('客户端造型审核没通过（STYLING_AUDIT_FAIL）：这样的形象上传后会被客户端打回、重调模型扣用户积分，按上面的明细改「形象设计.json」');
    if (exportState.designProblems) incomplete.push(`场景道具设计还有 ${exportState.designProblems} 处问题（ASSET_DESIGN_FAIL）：按上面的明细改「场景道具设计.json」`);
  }
  // 不建卡的道具不放进形象表：客户端拿它没用，只会让「道具数量」看起来吓人；它们仍在 全局资产清单 里备查
  const droppedProps = (lookTable.props || []).filter((p) => p.card === false).length;
  if (droppedProps) lookTable.props = lookTable.props.filter((p) => p.card !== false);
  lookTable.complete = incomplete.length === 0;
  if (incomplete.length) {
    lookTable.incomplete = incomplete;
    fs.writeFileSync(draftFile, JSON.stringify(lookTable, null, 1), 'utf8');
    // 之前导出过的「形象表.json」已经和现在的剧本对不上了：改名留底，避免被误交
    if (fs.existsSync(lookFile)) fs.renameSync(lookFile, lookFile.replace(/\.json$/, `.旧版-${Date.now()}.json`));
    console.log(`⛔ LOOK_TABLE_INCOMPLETE  形象表还缺 ${incomplete.length} 项，没有生成「形象表.json」（草稿在 ${draftFile}，不要把草稿交给用户或导入客户端）：`);
    for (const x of incomplete) console.log('   ✗ ' + x);
    console.log('   逐项补完后重跑 chenyu-pro assets-export，出现 LOOK_TABLE_PASS 才有「形象表.json」。');
    process.exitCode = 2;
  } else {
    fs.writeFileSync(lookFile, JSON.stringify(lookTable, null, 1), 'utf8');
    try { fs.rmSync(draftFile, { force: true }); } catch { /* 草稿删不掉无妨 */ }
    console.log(`✓ LOOK_TABLE_PASS  形象表 -> ${lookFile}（角色 ${lookTable.characters.length}、场景 ${(lookTable.places || []).length}、建卡道具 ${(lookTable.props || []).length}${droppedProps ? `，另有 ${droppedProps} 件不建卡的没放进表里` : ''}；客户端「人物设定与故事背景」只上传这一个文件）`);
  }
  for (const x of lookTableIssues(lookTable).slice(0, 20)) console.log('  ⚠ ' + x);
  const pn = propNameIssues(assets);
  for (const x of pn.slice(0, 40)) console.log('  ⚠ ' + x);
  if (pn.length > 40) console.log(`  … 另有 ${pn.length - 40} 处`);
  console.log(`  人物 ${assets.people.size}｜场景 ${assets.scenes.size}｜道具 ${assets.props.size}${assets.props.size ? '' : '（剧本里还没有【道具】行）'}${noLook ? `｜${noLook} 个形象没写外观（审核结论 looks）` : ''}`);
}

// ---------- 输入分类 + 成片工程改写（remake）：直接改客户端已分镜的工程，不重新分镜 ----------
async function cmdInspect() {
  const file = path.resolve(process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : (arg('file', '') || die('用法: chenyu-pro inspect <文件>')));
  if (!fs.existsSync(file)) die(`找不到 ${file}`);
  const { detectInput } = await import('./remake.mjs');
  const r = detectInput(file);
  console.log(`${path.basename(file)} → ${r.label}`);
  if (r.route) console.log(`  走：${r.route}`);
}

async function cmdRemakePrepare() {
  const src = path.resolve(arg('src', '') || die('用法: chenyu-pro remake-prepare --src <script.json|工程.xlsx> --dir <工作目录> [--images <同工程导出的.xlsx>]'));
  const dir = path.resolve(arg('dir', '') || die('要 --dir <工作目录>（放映射表、改写单元和产出）'));
  const rm = await import('./remake.mjs');
  const { project, from } = await rm.loadProject(src);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, rm.REMAKE_SOURCE_FILE), JSON.stringify(project), 'utf8');
  const imagesSrc = arg('images', '') || (from === 'xlsx' ? src : '');
  if (imagesSrc) {
    const img = from === 'xlsx' && path.resolve(imagesSrc) === src ? project : (await rm.loadProject(path.resolve(imagesSrc))).project;
    fs.writeFileSync(path.join(dir, '参考图.json'), JSON.stringify({ referenceImages: img.referenceImages || {} }), 'utf8');
  }
  const inv = rm.inventory(project);
  const mapFile = path.join(dir, rm.REMAKE_MAP_FILE);
  const existing = fs.existsSync(mapFile) ? JSON.parse(fs.readFileSync(mapFile, 'utf8').replace(/^﻿/, '')) : null;
  fs.writeFileSync(mapFile, JSON.stringify(rm.mapTemplate(inv, existing), null, 1), 'utf8');
  console.log(`✓ 读入客户端工程（${from === 'xlsx' ? 'Excel，经客户端导入代码转换' : 'JSON'}）：《${inv.title}》${inv.episodes} 集 ${inv.tasks} 个任务，角色 ${inv.characters.length} 个，场景 ${inv.scenes.length}，道具 ${inv.props.length}${imagesSrc ? '，参考图另存 参考图.json' : ''}`);
  for (const c of inv.characters.slice(0, 40)) console.log(`  ${c.base}（${c.gender || '?'}）出现 ${c.mentions} 处，形象 ${c.looks.length} 个`);
  console.log(`✓ 改写映射 -> ${mapFile}：填 newBase / newGender / terms 后跑 remake-units`);
}

async function cmdRemakeUnits() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro remake-units --dir <工作目录>'));
  const rm = await import('./remake.mjs');
  const map = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_MAP_FILE), 'utf8').replace(/^﻿/, ''));
  const issues = rm.checkMap(map);
  if (issues.length) { issues.forEach((x) => console.log('  ✗ ' + x)); die('改写映射有问题，改完重跑'); }
  const original = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_SOURCE_FILE), 'utf8'));
  const { rename, pairs } = rm.buildRenamer(map);
  // 两字的替换词容易撞成语/常用词（「沉舟」撞「破釜沉舟」）：把命中处的前后文去重列出来，先看一遍再往下走
  const shortPairs = pairs.filter(([from]) => from.length <= 2);
  if (shortPairs.length) {
    const corpus = rm.collectUnits(original).map((u) => u.text).join('\n');
    const report = [];
    for (const [from, to] of shortPairs) {
      const ctx = new Map();
      // 被更长的替换词覆盖的命中（「顾沉舟」里的「沉舟」）不算，只看单独出现的
      let scan = corpus;
      for (const [longer] of pairs) if (longer.length > from.length && longer.includes(from)) scan = scan.split(longer).join('■');
      for (const m of scan.matchAll(new RegExp(`(.{0,3})${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(.{0,2})`, 'g'))) ctx.set(m[0], (ctx.get(m[0]) || 0) + 1);
      report.push(`## ${from} → ${to}（${[...ctx.values()].reduce((s, n) => s + n, 0)} 处）`, ...[...ctx].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, n]) => `${n}\t${k.replace(/\n/g, '⏎')}`), '');
    }
    // 只按全名替换抓不到的单字姓说法：「我姓江」「没姓顾」「江……江经理」「小江」「老顾」
    const renamedChars = (map.characters || []).filter((c) => c.newBase && c.newBase !== c.base && c.base.length >= 2);
    // 叠字昵称（果果、浩浩）没有姓
    const surnames = [...new Set(renamedChars.filter((c) => c.base[0] !== c.base[1] && c.newBase[0] !== c.base[0]).map((c) => c.base[0]))];
    if (surnames.length) {
      let bare = corpus;
      for (const [from] of pairs) if (from.length >= 2) bare = bare.split(from).join('■'); // 全名、已列的称呼先遮掉
      const S = surnames.join('');
      const sre = new RegExp(`.{0,6}(?:姓[${S}]|[${S}](?:…|—)|[小老阿][${S}](?![客虑续])).{0,6}`, 'g');
      const hits = new Map();
      for (const m of bare.matchAll(sre)) hits.set(m[0], (hits.get(m[0]) || 0) + 1);
      report.push(`## 单字姓说法（${surnames.join('、')}；全名替换抓不到，确认后写进 terms 或 lateTerms）`, ...[...hits].map(([k, n]) => `${n}\t${k.replace(/\n/g, '⏎')}`), '');
    }
    fs.mkdirSync(path.join(dir, rm.REMAKE_UNIT_DIR), { recursive: true });
    fs.writeFileSync(path.join(dir, rm.REMAKE_UNIT_DIR, '替换命中.txt'), report.join('\n'), 'utf8');
    console.log(`  两字替换词的命中上下文 -> ${rm.REMAKE_UNIT_DIR}/替换命中.txt（看有没有撞成语/常用词；撞了就把 terms 改成更长的词，或改完后在 lateTerms 里改回）`);
  }
  const renamed = rm.renameDeep(original, rename);
  fs.writeFileSync(path.join(dir, rm.REMAKE_RENAMED_FILE), JSON.stringify(renamed), 'utf8');
  const units = rm.collectUnits(renamed);
  const swapped = rm.swappedBases(map);
  const swappedNames = (map.characters || []).filter((c) => swapped.has(c.base)).map((c) => c.newBase || c.base);
  const unitDir = path.join(dir, rm.REMAKE_UNIT_DIR);
  const index = rm.writeUnitFiles(unitDir, units, swappedNames);
  const charFile = path.join(unitDir, rm.REMAKE_CHAR_FILE);
  const prevChars = fs.existsSync(charFile) ? JSON.parse(fs.readFileSync(charFile, 'utf8')) : [];
  // 免费版不做形象重新设计（要账号授权）；换了性别的形象需要 Pro 重新设计
  const chars = EDITION === 'gate' ? [] : rm.charTemplate(original, map, prevChars);
  if (EDITION === 'gate' && rm.swappedBases(map).size) console.log('  ⚠ 有角色换了性别：免费版只改文字，形象（长相、服装、音色）要用辰屿 Pro 重新设计，否则出图还是原性别');
  fs.writeFileSync(charFile, JSON.stringify(chars, null, 1), 'utf8');
  const st = JSON.parse(fs.readFileSync(STYLING_STATIC, 'utf8'));
  // 形象重设计任务书：和客户端造型 AI 同一套知识库规则，思考由 Agent 做
  if (chars.length) {
    const kit = await fetchStylingKit(path.join(dir, LOOK_KIT_DIR));
    const book = [
      `# 形象重设计任务（${chars.length} 个形象，填 ${rm.REMAKE_UNIT_DIR}/${rm.REMAKE_CHAR_FILE} 每条的 new）`, '',
      '洗稿重做形象的目标：和原片拉开辨识度——脸型、发型、主色调、配色都换；保留原形象的服装类别和状态（病号服仍是病号服、手术服仍是手术服、制服仍是制服）、年龄段、身份。',
      '先整部剧一次规划：主要角色之间脸型、发型、主色调互相错开；同一个人（base 相同）的各形象脸、身材、发型、发色一致，只按状态换装，用同一个音色；群像写成一群人的统一装束和代表成员。',
      'old 是原造型，只作参考身份/状态，不要照抄它的脸、发型、配色。swapped=true 的是换了性别的角色。', '',
      '每条 new 填：',
      '- styleDescription：按 性别→年龄段→外观特征→脸部→身材→发型→服饰类型→发色→主色调→部件配色→视觉锚点 写，≥120 字，结尾可加「双手自然放松，仅展示稳定角色造型，不携带临时道具」。',
      '- appearanceFeatures：一句外观锚点；shortDescription：如「女人 黑色低马尾 冰川蓝开衫」；state：沿用或按新设定改写原状态。',
      '- voice（如 女-青年-知性）、voiceRefDescription（以「青年女声」这类开头，≤4 个声学特征）、doubaoVoiceId（下面候选里的确切 ID，性别和年龄档要对）。',
      '', '客户端审核最常打回的几处，动笔就避开：', ...STYLING_AUDIT_HINTS.slice(0, 6).map(([, h]) => `- ${h}`), '',
      '## 一、造型核心规则（知识库 styling.core_rules）', kit.coreRules, '',
      '## 二、音色库键名参考（知识库 styling.voice_preset_guide）', kit.voicePresetGuide, '',
      '## 三、豆包音色候选', st.doubaoVoiceCandidateGuide, '',
      '填完跑 remake-apply：每个形象都过客户端造型审核（和客户端同一份代码），有问题会列出来，改到 REMAKE_PASS。',
    ].join('\n');
    fs.writeFileSync(path.join(unitDir, '角色设计任务.md'), book, 'utf8');
  }
  const task = [
    `# 成片工程改写任务：《${map.title?.old || ''}》${map.title?.new ? ` → 《${map.title.new}》` : ''}`,
    '', `方向：${map.direction || '（改写映射里 direction 没写）'}`, '',
    '已经由工具完成：角色改名、terms 精确替换（整个工程，含标签、台词、资产表；文件路径不动）。',
    `换性别的角色：${swappedNames.join('、') || '无'}。下面两件事由你做：`, '',
    '## 一、逐行改写（每个 第NN集.txt / 剧本与文字.txt）',
    '- 每个单元是一段分镜脚本或剧本原文，带行号。只改需要改的行：换性别角色的代词（她↔他）、称谓（老公↔老婆、嫂子↔姐夫、女士↔先生…）、外貌（长发/裙装 ↔ 短发/西装）、身体相关情节的等价替换（保持剧情功能）、台词里的音色括注。',
    '- 剧情、镜头数、每镜时长、动作走位、字段结构都不改；没换性别的人和事不动。',
    '- 输出写到同名的 .patch.json：{"单元id": {"行号": "整行新内容"}}，只写改了的行；一行对一行，不能含换行；### SHOT 行和 time: 行不能改；action:/prompt:/dialogue: 等字段名保持。',
    '- 标签只用工程里已有的（改名后的）[角色-形象]、[场景]、[道具]，不新增标签。',
    '',
    `## 二、换性别形象的新造型（${path.join(rm.REMAKE_UNIT_DIR, rm.REMAKE_CHAR_FILE)}，共 ${chars.length} 个）`,
    '- 每条 old 是原造型，填 new：styleDescription（按 性别→年龄段→外观特征→脸部→身材→发型→服饰类型→发色→主色调→部件配色→视觉锚点 写，≥120 字，段尾不能以「和与及为呈穿套披系戴配搭、，」结尾）、appearanceFeatures（一句外观锚点）、shortDescription（如「男人 黑色短发 深蓝套装」）、voice（如 男-青年-清冷）、voiceRefDescription（以「青年男声」这类开头）、doubaoVoiceId（下方候选里的确切 ID，性别和年龄档要对）。',
    '- 同一个人各形象脸、身材、发型、发色一致，只按状态换装；同一人用同一音色。服装状态（病号服、手术服、大衣）沿用原形象名的含义。',
    '',
    '## 三、豆包音色候选', st.doubaoVoiceCandidateGuide, '',
    '填完跑 `chenyu-pro remake-apply --dir <工作目录>`，改到 REMAKE_PASS。',
  ].join('\n');
  fs.writeFileSync(path.join(unitDir, '改写任务.md'), task, 'utf8');
  console.log(`✓ 改名：${pairs.length} 组精确替换 -> ${rm.REMAKE_RENAMED_FILE}`);
  console.log(`✓ 改写单元 -> ${unitDir}（任务书 改写任务.md）`);
  for (const x of index) console.log(`  ${x.file}：${x.units} 个单元，${x.needs} 个涉及换性别角色 → 补丁写 ${x.patch}`);
  console.log(`  ${rm.REMAKE_CHAR_FILE}：${chars.length} 个形象待重新设计（${(map.redesignLooks || 'all') === 'all' ? '全部形象重做' : '只重做换性别的'}；任务书 角色设计任务.md）`);
}

// 审稿读本：补丁打完后的当前文本（行号和改写单元一致），给审稿 Agent 逐集通读；问题写成 改写/审核_*.patch.json（最后生效）
async function cmdRemakeReview() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro remake-review --dir <工作目录>'));
  const rm = await import('./remake.mjs');
  const map = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_MAP_FILE), 'utf8').replace(/^﻿/, ''));
  const project = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_RENAMED_FILE), 'utf8'));
  const unitDir = path.join(dir, rm.REMAKE_UNIT_DIR);
  const units = rm.collectUnits(project);
  rm.applyUnitPatches(project, units, rm.readPatches(unitDir));
  // 角色卡也按新造型/补形象落好，体检和合并时一致
  const charFileR = path.join(unitDir, rm.REMAKE_CHAR_FILE);
  if (fs.existsSync(charFileR)) rm.applyCharacters(project, JSON.parse(fs.readFileSync(charFileR, 'utf8')).filter((e) => e.new?.styleDescription));
  rm.applySceneMapEdits(project, map.sceneMapEdits);
  const reviewDir = path.join(dir, '审核');
  fs.mkdirSync(reviewDir, { recursive: true });
  const now = (u) => String(u.where[0].reduce((o, k) => o?.[k], project) || '');
  // 剧本全文（可读版，带单元 id 和行号，主审通读用）
  const chapterUnits = units.filter((u) => u.kind === 'text' && u.where.some((w) => w[0] === 'novelChapters' && w[2] === 'content'));
  fs.writeFileSync(path.join(reviewDir, '剧本全文.txt'), chapterUnits.map((u) => [`=== ${u.id}  ${u.label}`, ...now(u).split('\n').map((l, i) => `${i + 1}| ${l}`), ''].join('\n')).join('\n'), 'utf8');
  // 每集分镜：只列台词、动作、画面行（行号同单元），读起来像一集戏
  const byEp = new Map();
  for (const u of units.filter((x) => x.kind === 'task')) { if (!byEp.has(u.episode)) byEp.set(u.episode, []); byEp.get(u.episode).push(u); }
  for (const [ep, list] of byEp) {
    const body = list.sort((a, b) => a.task - b.task).map((u) => [`=== ${u.id}  ${u.label} 任务${u.task + 1}`,
      ...now(u).split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /^(###\s*SHOT|镜头角色|action|dialogue|sfx)\s*[:：]?/i.test(l.trim())).map(([i, l]) => `${i}| ${l}`), ''].join('\n')).join('\n');
    fs.writeFileSync(path.join(reviewDir, `第${String(ep).padStart(2, '0')}集_分镜读本.txt`), body, 'utf8');
    // 完整当前文本（所有行，补丁已打）：修订补丁以这里的行内容为底
    const full = list.sort((a, b) => a.task - b.task).map((u) => [`=== ${u.id}  ${u.label} 任务${u.task + 1}`, ...now(u).split('\n').map((l, i) => `${i + 1}| ${l}`), ''].join('\n')).join('\n');
    fs.writeFileSync(path.join(reviewDir, `第${String(ep).padStart(2, '0')}集_当前全文.txt`), full, 'utf8');
  }
  // 分镜标签体检（客户端同一套检查）：按集列出 单元id+行号，原片就有的也一并修
  const original = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_SOURCE_FILE), 'utf8'));
  const findings = (await rm.storyboardFindings(project, rm.renameDeep(original, rm.buildRenamer(map).rename), units)) || [];
  const sbAvailable = fs.existsSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'storyboard_audit.mjs'));
  const fByEp = new Map();
  for (const f of findings) { if (!fByEp.has(f.episode)) fByEp.set(f.episode, []); fByEp.get(f.episode).push(f); }
  // 已清零的集不留旧清单（文件不存在 = 该集没有问题）
  for (const name of fs.readdirSync(reviewDir)) if (/_分镜标签问题\.txt$/.test(name)) fs.unlinkSync(path.join(reviewDir, name));
  for (const [ep, list] of fByEp) {
    fs.writeFileSync(path.join(reviewDir, `第${String(ep).padStart(2, '0')}集_分镜标签问题.txt`), list.map((f) => `${f.unit} ${f.line}| ${f.preexisting ? '[原片就有]' : '[改写新增]'} ${f.detail}`).join('\n') + '\n', 'utf8');
  }
  if (!sbAvailable) console.log('  （分镜标签体检模块未安装，跳过；审稿时人工核对镜头角色和标签）');
  else console.log(`  分镜标签体检：${findings.length} 处（改写新增 ${findings.filter((f) => !f.preexisting).length}，原片就有 ${findings.filter((f) => f.preexisting).length}）-> 审核/第NN集_分镜标签问题.txt`);
  const swapped = (map.characters || []).filter((c) => rm.swappedBases(map).has(c.base)).map((c) => `${c.base}→${c.newBase || c.base}（${c.gender}→${c.newGender}）`);
  const guide = [
    `# 改写审稿（${map.title?.new || map.title?.old || ''}）`, '',
    `方向：${map.direction || ''}`, swapped.length ? `换性别：${swapped.join('、')}` : '', '',
    '## 审什么（按观众视角读，不是查格式）',
    '1. 剧情顺不顺：改写后的台词和动作连起来读得通吗？有没有前后矛盾、接不上、语气突兀、指代不清。',
    '2. 设定一致：改写说明里的人物关系、等价替换线（如换性别后替换掉的情节）在每一集都一致，没有残留旧设定、没有自相矛盾。',
    '3. 指代和称谓：他/她、称呼、自称都指对了人；同一称呼全剧统一。',
    '4. 分镜和剧本一致：同一句台词在剧本章节和分镜 dialogue 里一致；动作描写和新形象（发型、服装、性别）一致。',
    '5. 跨集衔接：每集开头接得上上一集结尾，钩子还在。',
    '6. 分镜标签 bug（第NN集_分镜标签问题.txt，客户端同一套检查，原片就有的也修）：',
    '   - 「character absent from charactersInShot」：动作/画面写了这个人物标签，镜头角色行没有。人在画面里 → 把标签加进该 SHOT 的「镜头角色:」行；人不在画面里（电话、画外、回忆提及）→ 把那处方括号标签改成不带方括号的名字。',
    '   - 「declared character not referenced」：镜头角色列了人，画面提示没写到 → 人在画面里就在 prompt 里用标签写出他的位置动作；不在就从镜头角色行删掉。',
    '   - 「uses unknown tag」：标签不在资产目录（如 [系统-界面形态]）→ 是界面/系统提示音就去掉方括号写成普通文字；是漏建的人物要在结论里写明。',
    '   - 修完的 SHOT 里镜头角色、动作、画面、台词说话人要互相对得上。',
    '', '## 怎么交',
    '- 发现的问题写进 审核/审核结论_<范围>.md：每条写 位置（单元id+行号）/ 问题 / 改法。',
    '- 能直接改的写成修订补丁 改写/审核_<范围>.patch.json，格式同改写补丁 {"单元id": {"行号": "整行新内容"}}——以读本里显示的当前内容为底改，最后生效。',
    '- 不改剧情结构、镜头、时长、标签；只修顺、修逻辑、修指代。',
    '- 写完跑 remake-lint 查结构，再跑 remake-apply 到 REMAKE_PASS。',
  ].filter((x) => x !== null).join('\n');
  fs.writeFileSync(path.join(reviewDir, '审稿说明.md'), guide, 'utf8');
  console.log(`✓ 审稿读本 -> ${reviewDir}：剧本全文.txt（主审通读）、第NN集_分镜读本.txt ×${byEp.size}、审稿说明.md`);
  console.log('  审稿结论写 审核/审核结论_*.md，修订补丁写 改写/审核_*.patch.json（合并时最后生效）');
}

// 只查一个补丁文件（不写工程）：结构问题 + 打完补丁后这些单元里换性别角色同行还挂着原性别词的行
async function cmdRemakeLint() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro remake-lint --dir <工作目录> --file 第01集.patch.json'));
  const name = arg('file', '') || die('要 --file <补丁文件名>');
  const rm = await import('./remake.mjs');
  const map = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_MAP_FILE), 'utf8').replace(/^﻿/, ''));
  const project = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_RENAMED_FILE), 'utf8'));
  const units = rm.collectUnits(project);
  const patchFile = path.join(dir, rm.REMAKE_UNIT_DIR, path.basename(name));
  const patches = JSON.parse(fs.readFileSync(patchFile, 'utf8').replace(/^﻿/, ''));
  const mine = new Set(Object.keys(patches));
  // 改写补丁有同名单元文件（第01集.txt）；审稿补丁（审核_*.patch.json）跨单元，按补丁里出现的单元查
  const txtFile = patchFile.replace(/\.patch\.json$/, '.txt');
  const isReview = path.basename(name).startsWith('审核');
  const fileUnits = fs.existsSync(txtFile) ? new Set([...fs.readFileSync(txtFile, 'utf8').matchAll(/^=== (\S+)/gm)].map((m) => m[1])) : new Set(mine);
  // 审稿补丁以「其他补丁打完后的当前内容」为底：先打其他补丁，再打这一份
  if (isReview) {
    const others = rm.readPatches(path.join(dir, rm.REMAKE_UNIT_DIR));
    for (const [id, lines] of Object.entries(patches)) for (const no of Object.keys(lines)) if (others[id]) delete others[id][no];
    rm.applyUnitPatches(project, units, others);
    for (const u of units) u.text = String(u.where[0].reduce((o, k) => o?.[k], project) || '');
  }
  const { issues, changedLines } = rm.applyUnitPatches(project, units, patches);
  for (const id of mine) if (!fileUnits.has(id)) issues.push(`单元 ${id} 不在 ${path.basename(name).replace('.patch.json', '.txt')} 里`);
  const swapped = (map.characters || []).filter((c) => rm.swappedBases(map).has(c.base));
  const wrongRe = (c) => (String(c.newGender).startsWith('男') ? /她|女士|女人|女性|姑娘|小姐|夫人|太太|长发|裙|马尾|麻花辫|发髻/ : /他(?!们)|先生|男人|男性|小伙|大背头/);
  const voiceCue = /（[^（）]*[男女]声[^（）]*）/g;
  const left = [];
  for (const u of units) {
    if (!fileUnits.has(u.id)) continue;
    const text = String(u.where[0].reduce((o, k) => o?.[k], project) || '');
    text.split('\n').forEach((line, i) => {
      const bare = line.replace(voiceCue, '');
      for (const c of swapped) { const n = c.newBase || c.base; if (bare.includes(n) && wrongRe(c).test(bare)) { left.push(`${u.id} ${i + 1}| ${line.slice(0, 110)}`); break; } }
    });
  }
  console.log(`补丁 ${Object.keys(patches).length} 个单元 ${changedLines} 行；结构问题 ${issues.length} 处；换性别角色同行仍有原性别词 ${left.length} 行（可能指别人，逐条确认；音色括注由工具自动换，不算）`);
  for (const x of issues.slice(0, 50)) console.log('  ✗ ' + x);
  for (const x of left.slice(0, 80)) console.log('  ? ' + x);
}

async function cmdRemakeApply() {
  const dir = path.resolve(arg('dir', '') || die('用法: chenyu-pro remake-apply --dir <工作目录> [--out 新工程.json]'));
  const rm = await import('./remake.mjs');
  const map = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_MAP_FILE), 'utf8').replace(/^﻿/, ''));
  const original = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_SOURCE_FILE), 'utf8'));
  const project = JSON.parse(fs.readFileSync(path.join(dir, rm.REMAKE_RENAMED_FILE), 'utf8'));
  const unitDir = path.join(dir, rm.REMAKE_UNIT_DIR);
  const units = rm.collectUnits(project);
  const patched = rm.applyUnitPatches(project, units, rm.readPatches(unitDir));
  rm.rebuildAdaptationFromChapters(original, project);
  const chars = fs.existsSync(path.join(unitDir, rm.REMAKE_CHAR_FILE)) ? JSON.parse(fs.readFileSync(path.join(unitDir, rm.REMAKE_CHAR_FILE), 'utf8')) : [];
  const charRes = rm.applyCharacters(project, chars);
  const identityFixed = rm.ensureIdentityInDescriptions(project);
  const sceneEdits = rm.applySceneMapEdits(project, map.sceneMapEdits);
  const cueSwaps = rm.swapVoiceCues(project, units, charRes.voiceSwaps);
  rm.clearGenerated(project);
  let img = { filled: 0, missing: 0 };
  if (fs.existsSync(path.join(dir, '参考图.json'))) {
    const { rename } = rm.buildRenamer(map);
    const refs = rm.renameDeep(JSON.parse(fs.readFileSync(path.join(dir, '参考图.json'), 'utf8')), rename);
    img = rm.fillImagesFrom(project, refs, arg('storage', ''));
  }
  // 补充替换：改写过程中才发现的漏网称呼/误换（如「顾主任」「破釜若岚」），最后对整个工程再做一次精确替换（标签、目录、图片键都覆盖），不影响已写好的补丁
  if (Array.isArray(map.lateTerms) && map.lateTerms.some((t) => t.from)) {
    const late = rm.buildRenamer({ terms: map.lateTerms });
    Object.assign(project, rm.renameDeep(project, late.rename));
  }
  if (map.title?.new) project.title = map.title.new;
  project.updatedAt = Date.now();
  const { issues, warnings } = rm.remakeChecks(original, project, map);
  // 分镜标签体检（客户端同一套）：改写新增的算问题；原片就有的列数量，审稿时一并修
  const sbFindings = (await rm.storyboardFindings(project, rm.renameDeep(original, rm.buildRenamer(map).rename), units)) || [];
  const sbNew = sbFindings.filter((f) => !f.preexisting);
  for (const f of sbNew.slice(0, 20)) issues.push(`分镜标签（改写新增）第${f.episode}集 ${f.unit} ${f.line}行：${f.detail}`);
  if (sbNew.length > 20) issues.push(`分镜标签（改写新增）另有 ${sbNew.length - 20} 处`);
  if (sbFindings.length - sbNew.length) warnings.push(`分镜标签：原片就有的问题还剩 ${sbFindings.length - sbNew.length} 处（remake-review 的 审核/第NN集_分镜标签问题.txt，审稿时修）`);
  // 换性别形象：用客户端原样的造型审核看描述和音色（这些卡不会再进客户端造型，审核只做提示）
  const auditNotes = [];
  const audit = chars.some((e) => e.new?.styleDescription) ? await import('./styling_audit.mjs') : null;
  for (const e of chars) {
    if (!e.new?.styleDescription) continue;
    const r = await audit.auditLookStyling({ characterName: e.tag, gender: e.newGender === '男' ? 'male' : e.newGender === '女' ? 'female' : '', species: e.species || '', appearanceFeatures: e.new.appearanceFeatures || '', stateLabel: e.state || '',
      styling: { description: e.new.styleDescription, voicePresetKey: e.new.voice, voiceRefDescription: e.new.voiceRefDescription, ttsProvider: 'Doubao', doubaoVoiceId: e.new.doubaoVoiceId, doubaoVoiceModel: 'seed-tts-2.0', doubaoVoiceSpeed: 1 } });
    const bad = (r.issues || []).filter((x) => !/wardrobeCapsuleId|classification missing/.test(x));
    if (bad.length) auditNotes.push(`${e.tag}：${bad.join(' / ').slice(0, 200)}`);
  }
  const out = path.resolve(arg('out', path.join(dir, `${(project.title || 'remake').replace(/[\\/:*?"<>|]/g, '_')}.json`)));
  fs.writeFileSync(out, JSON.stringify(project), 'utf8');
  console.log(`✓ 补丁：${patched.changedUnits} 个单元 ${patched.changedLines} 行；换性别形象 ${chars.filter((e) => e.new?.styleDescription).length}/${chars.length} 个已落；台词音色括注替换 ${cueSwaps} 处；旧成片已清；参考图补 ${img.filled} 张${img.missing ? `（${img.missing} 张本机打不开，导入后需重出）` : ''}`);
  if (identityFixed.length) console.log(`✓ 造型描述补回 脸部/身材/发型 ${identityFixed.length} 张卡（客户端出图只读描述，缺这几段会画成同一个发型和脸；这些卡导入后重出角色图）`);
  const all = [...patched.issues, ...charRes.issues, ...issues, ...auditNotes.map((x) => `造型审核不通过 ${x}`)];
  for (const x of all.slice(0, 40)) console.log('  ✗ ' + x);
  if (all.length > 40) console.log(`  … 另有 ${all.length - 40} 处`);
  for (const x of warnings.slice(0, 20)) console.log('  ⚠ ' + x);
  console.log(`✓ 新工程 -> ${out}（客户端侧边栏「导入」选这个 .json；换性别的形象没有图，导入后先补出角色图，再出视频）`);
  console.log(all.length ? '  REMAKE_FAIL（改完重跑 remake-apply）' : '  REMAKE_PASS');
  if (all.length) process.exitCode = 2;
}

// 使用说明（安装完自动显示；chenyu-pro guide 看全部，chenyu-pro guide 视频 只看一节）。只讲怎么用，每种场景一个实例。
// 排版：■ 节标题 + 分隔线；◆ 场景；▶ 你说；✓ 得到；※ 说明。只用终端都能显示的符号（不用 emoji）。
const GUIDE_RULE = '─'.repeat(54);
const renderGuide = (title, sections, topic = '') => {
  const picked = topic ? sections.filter((s) => s.key === topic || topic.includes(s.key)) : sections;
  const out = ['', '━'.repeat(58), ` ${title}${topic && picked.length ? '：' + topic : ''}`, '━'.repeat(58), ''];
  for (const s of picked.length ? picked : sections) {
    out.push(`■ ${s.title}`, `  ${GUIDE_RULE}`);
    for (const l of s.lines || []) out.push(`  ${l}`);
    for (const n of s.notes || []) out.push(`  ※ ${n}`);
    (s.scenes || []).forEach((sc, i) => {
      out.push('', `  ◆ 场景 ${i + 1}：${sc.name}`);
      out.push(`      ▶ 你说：「${sc.say}」`);
      if (sc.get) out.push(`      ✓ 得到：${sc.get}`);
      for (const n of [].concat(sc.note || [])) out.push(`      ※ ${n}`);
    });
    out.push('');
  }
  out.push('━'.repeat(58));
  console.log(out.join('\n'));
};

const PRO_GUIDE_SECTIONS = [
  { key: '开始', title: '开始：绑定积分 KEY（只做一次）', lines: [
    'chenyu-pro key set <你的积分KEY>',
    'chenyu-pro credits            ← 看到用户名和余额就成功了'],
    notes: ['之后在 Codex / Claude Code 里用大白话说需求，命令由 Agent 自己跑，你不用记命令',
      '拿不准手上的文件该怎么处理，就说「看看这个文件该怎么用」'] },
  { key: '视频', title: '一、视频反推剧本 —— 手上只有成片视频',
    notes: ['计费：每 240 秒视频 30 积分（不足按一段算），Agent 先报价，你同意才扣；后面写剧本不扣积分', '上传前自动压缩：只降码率、不缩分辨率，每集压到 22MB 以内；Skill 自带 ffmpeg，不用自己装'],
    scenes: [
      { name: '整部剧 1:1 还原', say: '把 D:\\短剧\\霸总 里第1-30集视频反推成剧本，1:1 还原，台词保留原句',
        get: '分集剧本 + 全局资产清单 + 形象表.json + 交付审核报告',
        note: '过程：分析视频 → 整理人物/场景/道具 → 逐集写剧本 → 格式和交付检查 → 写入原片时长' },
      { name: '反推的同时洗稿', say: '把这 20 集视频反推，同时洗成现代都市背景，人名全换',
        get: '洗好的新剧本（剧情节拍不变，设定和名字换掉）+ 形象表.json' },
      { name: '先分析前几集，后面再追加', say: '先分析第1-10集 …（过几天）… 把第11-20集追加到同一部剧',
        note: '同一部剧一定追加到同一个项目，人物会跨集合并；不要一集开一个项目' },
      { name: '中途断网 / 想重新取分析稿', say: '上次那部剧的分析稿重新取回来', note: '不重新分析，不扣积分' },
      { name: '人物认错了（一个人被拆成两个、两个人被合成一个）', say: '用已有分析结果重建人物身份',
        note: '不重看视频，只扣少量文本分' },
      { name: '视频在链接里', say: '分析这个链接里的视频：https://…/ep01.mp4' },
    ] },
  { key: '改编', title: '二、小说改编成短剧 —— 手上是小说 / 网文 / 大纲', scenes: [
      { name: '整本改编', say: '把 D:\\小说\\重生千金.txt 改编成 60 集短剧，每集 90 秒，节奏要快',
        get: '分集剧本（每集开头有钩子、结尾有悬念）+ 形象表.json' },
      { name: '先试几集看风格', say: '先把前 5 章改成 5 集，我看看风格',
        note: '满意后说「继续改后面的」，人物和形象沿用前面的设定' },
    ] },
  { key: '洗稿', title: '三、剧本洗稿 —— 手上是分集剧本（第N集…）',
    notes: ['所有洗法都走：定人名设定 → 逐集写 → 机器检查 → 分段审稿 → 全剧主审 → 修订 → 通读，全部通过才交付，附审核报告'],
    scenes: [
      { name: '只改角色名（最常用）', say: '这部剧只改角色名字，其他都不动', get: '名字和称呼全剧统一替换，台词其余一字不改，没有旧名残留' },
      { name: '1:1 整理成标准格式（不洗）', say: '按原剧本 1:1 整理成标准格式，剧情台词都不改' },
      { name: '换背景 / 换设定', say: '把这部古装剧洗成现代豪门背景，身份职业都换成现代的',
        note: '剧情功能不变，道具、身份、称谓按新世界等价替换（如 玉佩 → 股权书）' },
      { name: '女频改男频（或男频改女频）', say: '把这部剧女频改男频，女主改成男主，剧情节奏不变',
        note: '代词、称谓、外貌全部换性别；男女不通用的情节按功能等价替换' },
      { name: '降重 / 去重', say: '这部剧要降重，台词全部换说法，剧情不变', note: '每句台词保留功能（威胁、打脸、反转…），换句式和措辞' },
      { name: '出海', say: '把这部剧洗成日本版',
        note: ['也可：欧美英语、拉美西语、巴西葡语、韩国、泰国、越南、印尼', '人名、地名、机构、货币、称谓按当地本地化，剧本正文用中文写'] },
    ] },
  { key: '形象', title: '四、人物形象设计 —— 让客户端照表建卡，不用自己猜', scenes: [
      { name: '给剧本做形象设计', say: '给这部剧的所有人物做形象设计，导出形象表',
        get: '形象表.json：每个形象都有长相、发型、服装配色、音色；场景和道具有出图描述',
        note: '上传客户端后直接出图，不用再等客户端设计' },
      { name: '已有形象表，只补缺的', say: '形象表里没设计的形象帮我补上' },
    ] },
  { key: '工程', title: '五、已分镜爆款工程改写 —— 手上是客户端导出的 .json 或 .xlsx',
    notes: ['不重新分镜：镜头数、每镜时长一个不动，只改文字、人物、音色'],
    scenes: [
      { name: '只改名 + 形象重做', say: '这个爆款工程不用重新分镜，角色全部改名，形象重新设计', get: '新工程 .json' },
      { name: '女频改男频', say: '这个工程女频改男频，主角换成男的，形象重新设计', get: '新工程 .json（剧情和分镜都审过）' },
      { name: '同一个工程有 .json 也有 .xlsx', say: '用这个 .json 改，图片从 .xlsx 里补' },
    ] },
  { key: '交付', title: '交付物在辰屿客户端怎么用', lines: [
    '剧本 + 形象表.json  →  新建项目贴剧本，在「人物设定与故事背景」上传形象表',
    '                        → 客户端按表建人物/场景/道具卡 → 分镜 → 出视频',
    '新工程 .json        →  左侧边栏「导入」→ 资产页先出角色图 → 出视频'],
    notes: ['积分：只有视频反推扣积分；写剧本、洗稿、形象设计、工程改写都不扣',
      '网络：连不上会自动改走系统代理；还不通就设置 CHENYU_PROXY=http://127.0.0.1:7890',
      '命令表：chenyu-pro help ｜ 只看一节：chenyu-pro guide 视频 / 改编 / 洗稿 / 形象 / 工程 / 交付',
      '升级：重新运行安装命令'] },
];

const GATE_GUIDE_SECTIONS = [
  { key: '开始', title: '开始', lines: ['装好就能用：纯本地，不联网，不用账号，不扣积分'],
    notes: ['在 Codex / Claude Code 里用大白话说需求，命令由 Agent 自己跑'] },
  { key: '用法', title: '每种用法一个例子', scenes: [
      { name: '小说改编成短剧剧本', say: '把 D:\\小说\\重生千金.txt 改编成 40 集短剧剧本，每集 90 秒左右',
        get: '每集一个剧本文件（第001集.txt …），格式检查全部通过' },
      { name: '剧本只改角色名', say: 'D:\\剧本\\ 这部剧只改角色名字，其他都不动', get: '换好名字的整套剧本，全剧称呼统一，没有旧名残留' },
      { name: '剧本洗稿（换背景 / 女频改男频 / 降重）', say: '把这部剧洗成男频，主角改成男的，剧情节奏不变',
        get: '新剧本 + 洗稿检查报告（照抄、旧名残留、剧情是否完整、称呼是否统一）' },
      { name: '整理资产：人物形象、场景、道具清单', say: '把这部剧的人物、形象、场景、道具整理成清单，导出形象表',
        get: '全局资产清单 + 形象表.json', note: '在辰屿客户端「人物设定与故事背景」上传形象表，客户端按表建卡、按场绑标签' },
      { name: '已分好镜的工程改写（客户端导出的 .json / .xlsx）', say: '这个工程不用重新分镜，角色全部改名，台词里的称呼也改掉',
        get: '新工程 .json，镜头数和时长不变', note: '在客户端左侧「导入」即可' },
      { name: '只检查剧本格式', say: '检查一下 D:\\剧本\\ 的格式，按报告改到通过', get: '逐行问题报告和改法，改到 GATE_PASS' },
    ] },
  { key: '格式', title: '剧本格式（Agent 照这个写）', lines: [
    '第001集 离婚协议',
    '1-1 日 内 客厅',
    '人物：林晚、陈序',
    '【形象】林晚=少夫人；陈序=总裁',
    '客厅灯光昏黄，茶几上摆着离婚协议。',
    '△林晚把协议推到陈序面前，指尖发白。',
    '林晚：（冷冷地）签吧。',
    '△陈序盯着她，迟迟没有拿笔。',
    '陈母（电话里）：你敢签字就别回家！'],
    notes: ['只在电话里出声的人，括号写在冒号前，不列进「人物」行'] },
  { key: '更多', title: '需要完整版（辰屿 Pro）的功能', lines: ['视频反推剧本 ｜ 人物形象设计（长相、服装、音色）｜ 换性别后重新设计形象 ｜ 交付到辰屿平台'],
    notes: ['命令表：chenyu-gate help ｜ 本说明：chenyu-gate guide', '升级：重新运行安装命令'] },
];

function cmdGuide() {
  const topic = String(args[1] || '').trim();
  if (EDITION === 'gate') return renderGuide(`辰屿剧本工具 免费版 v${VERSION}`, GATE_GUIDE_SECTIONS, topic);
  return renderGuide(`辰屿 Pro Skill v${VERSION} 使用说明`, PRO_GUIDE_SECTIONS, topic);
}

// 线上最新版：读 GitHub 上本版本（Pro / 免费版）的 SKILL.md 版本号。本机装的副本不会自己更新，
// Agent 只看本地文件会以为旧版就是最新（2026-10-03 有 Agent 把 2.10.0 当最新）。
const SKILL_RAW_BASE = `https://raw.githubusercontent.com/hieason4567-jpg/${EDITION === 'gate' ? 'chenyu-gate-skill' : 'chenyu-pro-skill'}/main`;
const compareVersions = (a, b) => {
  const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
  return 0;
};
async function cmdVersion() {
  console.log(`chenyu-pro v${VERSION}`);
  // 顺带查线上最新版：5 秒超时，查不到就不提示，不影响任何功能
  try {
    const res = await fetch(`${SKILL_RAW_BASE}/SKILL.md?t=${Date.now()}`, { signal: AbortSignal.timeout(5000) });
    const latest = ((await res.text()).match(/version:\s*"?(\d+\.\d+\.\d+)/) || [])[1];
    if (latest && compareVersions(latest, VERSION) > 0) console.log(`  线上最新 v${latest}，本机是旧版 → 重新运行安装命令升级：irm ${SKILL_RAW_BASE}/install.ps1 | iex`);
    else if (latest) console.log('  已是线上最新版');
  } catch { /* 网络不通时不提示 */ }
}

function cmdHelp() {
  if (EDITION === 'gate') {
    console.log(`辰屿剧本工具 免费版 v${VERSION}（纯本地，不联网，不用账号）

  chenyu-gate guide                                      使用说明（每种用法一个例子）
  chenyu-gate inspect <文件>                              判断是小说 / 剧本 / 客户端工程，该怎么处理
  【写剧本、洗稿】
  chenyu-gate gate --file 第001集.txt | --dir <目录>      格式检查，改到 GATE_PASS
  chenyu-gate variants --dir <目录>                       汇总每个人物的形象
  chenyu-gate rename --dir <目录> …                        按改名表精确换名
  chenyu-gate wash-check --dir <目录> --source <原稿目录>   洗稿检查：照抄、旧名残留
  chenyu-gate deliver-check --dir <目录> --source <原稿目录> 交付检查：剧情完整、称呼、逻辑，到 DELIVERY_PASS
  chenyu-gate durations --dir <目录> …                     写入原片时长
  【资产】
  chenyu-gate assets-prepare --dir <分析稿目录>            整理人物、场景、道具候选
  chenyu-gate assets-apply --dir <分析稿目录>              按合并表整理
  chenyu-gate assets-export --dir <剧本目录>               导出全局资产清单 + 形象表.json
  【已分镜工程改写（客户端导出的 .json / .xlsx）】
  chenyu-gate remake-prepare --src <工程文件> --dir <工作目录>
  chenyu-gate remake-units | remake-lint | remake-review | remake-apply --dir <工作目录>

  视频反推、形象设计、平台交付需要辰屿 Pro 完整版。`);
    return;
  }
  console.log(`辰屿 Pro CLI v${VERSION} —— 剧本平台命令行（Agent 写作模式：平台只鉴权，写作零积分）

  chenyu-pro login --web                                   网页授权登录你的账号（推荐；项目归你账号，KEY 自动带出）
  chenyu-pro login --username <账号> --password <密码>     密码登录你的账号
  chenyu-pro key set <积分KEY> | key show                  仅绑积分 KEY（快速免密，但走独立身份）
  chenyu-pro guide                                         使用说明（带实例，装完自动显示）
  chenyu-pro ffmpeg [--install]                            查看 / 下载自带的 ffmpeg（视频上传前压缩用）
  chenyu-pro credits                                       查用户名·余额
  【Agent 写作模式（默认）：写作由你的 Agent 完成，不消耗平台积分，平台只做鉴权与交付】
  chenyu-pro auth                                          鉴权门——Agent 动笔前必须通过(输出 AUTH_OK)
  chenyu-pro create --title <剧名> --episodes 30 [--market us_en]   建项目壳(零积分，不触发平台生成)
  chenyu-pro save --project <id片段> --episode 1 --file 第001集.txt  回传 Agent 写好的一集正文
  chenyu-pro save --project <id片段> --dir <目录>          批量回传(文件名含 第N集 的 .txt/.md)
  chenyu-pro gate --file 剧本.txt | --dir <目录>           格式门：确定性质量校验(对白连发/心理活动/超长台词/形象标记)，改到 GATE_PASS
  chenyu-pro variants --dir <剧本目录> --source <分析稿目录>            对照资产整理时定的形象变体，查剧本有没有漏用(到 VARIANTS_PASS)
  chenyu-pro variants --dir <目录> [--out 文件]           从正文【形象】标记汇总形象变体表（每人几个变体、出现在哪几集哪几场）
  chenyu-pro status --project <id片段|剧名> [--watch]      查/盯进度
  chenyu-pro fetch --project <id片段> --out <目录>          导出交付正文到本地
  chenyu-pro sync --project <id片段|剧名> [--look-table 形象表.json]  同步到云端脚本库（带上完整形象表，客户端按表建卡）
  chenyu-pro projects                                      项目列表
  【视频分析——本 Skill 唯一消耗积分的功能】
  chenyu-pro video-analyze --video-file a.mp4,b.mp4 [--yes]  视频→分析稿(只分析不代写)
  chenyu-pro video-analyze --video-url <链接> [--out <目录>]  计费: ${POINTS_PER_SEGMENT} 分 / ${SEGMENT_SECONDS} 秒段(不足一段按一段)
  chenyu-pro video-analyze --project <id片段|剧名> --video-file 第4集.mp4  同一部剧追加到已有项目(人物跨集合并)
  chenyu-pro video-wait --project <id片段|剧名> [--out <目录>] [--timeout-min 8]  等分析跑完并自动取回(没跑完退出码3,再跑一次)
  chenyu-pro asset-image --look-table <形象表.json>                         列出可出资产图的条目(零积分)
  chenyu-pro asset-image --project <项目> --look-table <形象表.json> --pick 1,3 [--yes] [--force]  出横版资产图(约6分/张,先报价)
  chenyu-pro deliver --dir <剧本目录> [--source <分析稿目录>] [--title 剧名]   整理交付目录到 我的文档\\辰屿项目\\<剧名>(全集/形象表/分集在最外层)
  chenyu-pro review-split --dir <分析稿目录> [--parts 4]   把待复核的称谓角色/形象变体分包，给子代理并行处理
  chenyu-pro review-merge --dir <分析稿目录>               合并各包结论到合并表和判定表
  chenyu-pro archive --project <id片段|剧名> --dir <分析稿目录> [--file a.md,b.json]  把合并表/整理版/检查报告存档到平台项目(零积分)
  chenyu-pro archive-fetch --project <id片段|剧名> --dir <分析稿目录> [--force]  取回存档接着做
  chenyu-pro video-fetch --project <id片段|剧名> [--out <目录>]  零积分重新取回最新分析稿(平台修复后用这个取)
  chenyu-pro video-rebuild --project <id片段|剧名> [--out <目录>] [--yes]  不重看视频，重建人物身份(和资产表)，只扣文本步骤分
    同一部剧只用一个项目：一次提交全部集，或后续用 --project 追加；不要一集一个项目、不要并发提交。
    集号按文件名(第N集/EPN/N.mp4)；文件名不是从第1集开始又没给 --project 会被拦下(新剧中途开始加 --new-series)。
    不加 --yes 只报价不执行；分析稿取回后由你(Agent)自己写剧本，写作零积分。
    视频一律用本命令做反推；不要用抽音频/转写/抽帧代替(只有台词没画面,剧本会乱)。
  【资产整理——分析稿取回后、动笔前必做；纯本地、零积分】
  chenyu-pro text-analyze --src <剧本目录|剧本文件|小说.txt> --out <分析稿目录>  现成剧本/小说整理成同一种分析稿(零积分；小说填完提取表加 --build)
  chenyu-pro assets-prepare --dir <分析稿目录>              把分析稿整理成人物证据卡/场景清单/道具清单 + 待填的资产合并表
  chenyu-pro assets-apply --dir <分析稿目录> [--out <目录>]  按你填好的资产合并表精确替换，出整理版(到 ASSETS_PASS)
    平台只看画面：同一个人/地点/物件在不同集写法不同。你(Agent)通读后按剧情合并归类，台词原文一个字不动。
  【洗稿——纯本地、零积分】
  chenyu-pro rename --dir <剧本目录> [--map 洗稿映射.json] [--dry-run]   按名字对照表一字不差换名
  chenyu-pro wash-check --dir <剧本目录> --source <分析稿目录> [--address]   对照原片查照抄/旧名残留/台词量/说话人在场/非人角色被接话，到 WASH_PASS
  chenyu-pro assets-export --dir <剧本目录> [--title 剧名]   导出全局资产清单（人物/形象/外观/场景/道具，.md + .json）+ 形象表.json
  chenyu-pro durations --dir <剧本目录> --source <分析稿目录> [--dry-run]   按原片写【原片时长】【本场时长】（视频还原/洗稿必跑）
  chenyu-pro looks-prepare --dir <剧本目录>              形象设计任务：取知识库造型提示词+形象库，生成 形象设计.json（按客户端造型 AI 格式填，assets-export 并进形象表）
  【成片工程改写——改客户端已分镜的工程（script.json / 导出的 .xlsx），不重新分镜，零积分】
  chenyu-pro inspect <文件>                                判断输入是小说 / 剧本 / 工程 JSON / 工程 Excel，该走哪条路
  chenyu-pro remake-prepare --src <工程.json|.xlsx> --dir <工作目录> [--images <工程.xlsx>]   读工程、盘点角色，生成 改写映射.json
  chenyu-pro remake-units --dir <工作目录>                 按映射精确改名，拆出逐行改写单元和换性别形象表
  chenyu-pro remake-lint --dir <工作目录> --file 第01集.patch.json   查一个补丁：结构问题 + 换性别角色残留词
  chenyu-pro remake-review --dir <工作目录>                审稿读本：补丁打完后的剧本全文和每集分镜，给审稿逐集通读（修订补丁 审核_*.patch.json 最后生效）
  chenyu-pro remake-apply --dir <工作目录> [--out 新工程.json]      合并补丁和新造型、清旧成片、校验，出新工程（REMAKE_PASS）
  chenyu-pro deliver-check --dir <剧本目录> --source <分析稿目录>   交付门：机器指标+审核结论.json(剧情完整/对话称呼/剧情逻辑)，列出下一轮要做的事，迭代到 DELIVERY_PASS

  市场: ${Object.entries(MARKETS).map(([k, v]) => k + '=' + v).join(' ')}
  升级: irm https://raw.githubusercontent.com/hieason4567-jpg/chenyu-pro-skill/main/install.ps1 | iex`);
}

const commands = { login: cmdLogin, key: cmdKey, credits: cmdCredits, status: cmdStatus, fetch: cmdFetch, sync: cmdSync, projects: cmdProjects, auth: cmdAuth, create: cmdCreate, save: cmdSave, gate: cmdGate, variants: cmdVariants, 'video-analyze': cmdVideoAnalyze, 'video-fetch': cmdVideoFetch, 'video-wait': cmdVideoWait, archive: cmdArchive, 'archive-fetch': cmdArchiveFetch, 'asset-image': cmdAssetImage, deliver: cmdDeliver, 'review-split': cmdReviewSplit, 'review-merge': cmdReviewMerge, 'video-rebuild': cmdVideoRebuild, 'text-analyze': cmdTextAnalyze, 'assets-prepare': cmdAssetsPrepare, 'assets-apply': cmdAssetsApply, rename: cmdRename, 'wash-check': cmdWashCheck, 'deliver-check': cmdDeliverCheck, 'assets-export': cmdAssetsExport, durations: cmdDurations, 'looks-prepare': cmdLooksPrepare, inspect: cmdInspect, 'remake-prepare': cmdRemakePrepare, 'remake-units': cmdRemakeUnits, 'remake-apply': cmdRemakeApply, 'remake-lint': cmdRemakeLint, 'remake-review': cmdRemakeReview, version: cmdVersion, ffmpeg: cmdFfmpeg, guide: cmdGuide, '--version': cmdVersion, '-v': cmdVersion, help: cmdHelp };
try {
  if (EDITION === 'gate' && commands[cmd] && !GATE_COMMANDS.has(cmd)) {
    console.log(`「${cmd}」需要账号授权，属于辰屿 Pro 完整版功能（视频反推、形象设计、平台交付等）。免费版可用的命令见 chenyu-gate help。`);
    process.exit(2);
  }
  await (commands[cmd] || cmdHelp)();
} catch (err) {
  // 顶层兜底：网络彻底不通时给出人话 + 恢复路径，绝不甩裸 node stack trace(会让 Agent 误判彻底失败而自造结果)。
  if (err?.netFailed) {
    console.error(`✗ 网络连接失败(${err.detail})：多次重试仍连不上平台 ${DEFAULT_PLATFORM}，通常是本机网络或代理(如 Clash)波动。`);
    console.error('  · 若刚在跑 video-analyze：视频多半已提交、平台在后台继续分析、积分不会白扣；网络恢复后用');
    console.error('    chenyu-pro video-fetch --project <剧名或id片段>   零积分取回，切勿整批重跑(会重复扣分)。');
    console.error('  · 直连失败会自动改走系统代理（环境变量 HTTP(S)_PROXY / Windows 系统代理 / macOS 系统代理）；都不通就检查网络。指定代理: CHENYU_PROXY=http://地址:端口；一开始就走系统代理: CHENYU_KEEP_PROXY=1。在 Agent 沙箱里跑的，先确认沙箱允许联网。');
    process.exit(1);
  }
  if (err?.apiFailed) { console.error('✗ ' + err.message); process.exit(1); }
  console.error('✗ 出错: ' + (err?.stack || err?.message || err));
  process.exit(1);
}
