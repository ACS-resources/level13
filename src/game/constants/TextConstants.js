// Level 13 specific text helpers

define(['ash',
	'utils/DescriptionMapper',
	'text/Text',
	'text/TextBuilder',
	'game/constants/GameConstants',
	'game/constants/EnemyConstants',
	'game/constants/ItemConstants',
	'game/constants/SectorConstants',
	'game/constants/PositionConstants',
	'game/constants/MovementConstants',
	'game/constants/TradeConstants',
	'game/constants/WorldConstants',
],
function (Ash, DescriptionMapper, Text, TextBuilder, GameConstants, EnemyConstants, ItemConstants, SectorConstants, PositionConstants, MovementConstants, TradeConstants, WorldConstants) {
	
	var TextConstants = {
		
		sentencify: function (s) {
			s = s.trim();
			if (s.length > 0) {
				if (s.endsWith(", ")) s = s.slice(0, -2);
				if (!this.isPunctuation(s[s.length - 1])) s = s + ".";
				if (s[s.length - 1] != " ") s = s + " ";
			}
			return s;
		},
		
		pluralify: function (s) {
			return Text.pluralify(s);
		},

		isPunctuation: function (c) {
			return c == "." || c == "!" || c == "?";
		},
		
		getActionName: function (baseActionID) {
			switch (baseActionID) {
				case "scavenge_heap": return "搜索";
				case "scout_locale_i":
				case "scout_locale_u":
					return "侦查";
				case "clear_waste_r": return "清理放射性废物";
				case "clear_waste_t": return "清理有毒废物";
				case "build_out_greenhouse": return "建造温室";
				case "build_out_luxury_outpost": return "建造资源前哨站";
				case "build_out_tradepost_connector": "建造电梯";
				case "build_out_sundome": "建造太阳穹顶";
				case "bridge_gap": return "搭建桥梁";
				case "repair_item": return "修复物品";
				case "clear_workshop": return "清理工作坊";
				default:
					return baseActionID;
			}
		},
		
		getSectorName: function (isScouted, features) {
			var template = "[a-sectortype] [n-street]";
			var params = this.getSectorTextParams(features);
			var phrase = TextBuilder.build(template, params);
			return Text.capitalize(phrase);
		},
		
		getSectorHeader: function (hasVision, features) {
			var template = "[a-street] [a-sectortype] [n-street]";
			if (features.hasCamp) {
				template = "营地所在的 [n-street]";
			}
			if (features.hasGrove) {
				template = "[a-street] 公园";
			}
			if (!hasVision) {
				if (features.sunlit) {
					template = "阳光照耀的 [n-street]";
				} else {
					template = "黑暗的 [n-street]";
				}
			}
			var params = this.getSectorTextParams(features);
			var phrase = TextBuilder.build(template, params);
			return Text.capitalize(phrase);
		},
		
		getSectorDescription: function (hasVision, features) {
			var type = hasVision ? "sector-vision" : "sector-novision";
			var template = DescriptionMapper.get(type, features);
			if (features.hasGrove) {
				template = "[a] [a-street] park overrun by plant-life. In the middle there is a grove of tall trees. Though strange and wild, it also seems somehow peaceful";
			}
			var params = this.getSectorTextParams(features);
			var phrase = TextBuilder.build(template, params);
			return Text.capitalize(phrase);
		},
		
		getSectorTextParams: function (features) {
			// 1) Collect options for each param based on several features
			var options = {};
			var addOptions = function (param, values) {
				if (!options[param]) options[param] = [];
				for (let i = 0; i < values.length; i++) {
					options[param].push(values[i]);
				}
			};

			// - general: options always available
			addOptions("a-street", [ "安静的" ]);
			addOptions("n-building", [ "建筑", "结构" ]);
			addOptions("n-buildings", [ "建筑" ]);
			addOptions("a-building", [ "高耸的", "高大的", "阴暗的", "废弃的", "普通的", "小型的", "典型的", "整块的", "块状的", "巨大的", "庞大的", "宏伟的", "幽灵般的", "狭窄的", "笨重的", "无窗的" ]);
			addOptions("an-decos", [ "废弃的长椅", "损坏的电梯" ]);
			addOptions("an-items", [ "废墟" ]);

			// - sector type: determines n-sector and affects many others
			switch (features.sectorType) {
				case SectorConstants.SECTOR_TYPE_RESIDENTIAL:
					addOptions("n-sector", [ "公寓综合体", "住宅区", "居民区" ]);
					addOptions("a-street-past", [ "美丽的", "平静的", "整洁的", "轻松的", "宜人的" ]);
					addOptions("n-building", [ "居民楼", "公寓楼", "拥有无数排相同阳台的住宅楼", "住宅楼群", "住宅" ]);
					addOptions("n-buildings", [ "居民楼", "公寓", "高层住宅楼", "相同的居民楼", "住宅" ]);
					addOptions("an-decos", [ "电车轨道" ]);
					addOptions("a-building", [ "寂静的", "整齐的", "巨大的", "对称的" ]);
					addOptions("an-items", [ "垃圾" ]);
					break;
				case SectorConstants.SECTOR_TYPE_INDUSTRIAL:
					addOptions("n-sector", [ "工业园区", "工业区", "工业街区" ]);
					addOptions("a-street", [ "朴素的" ]);
					addOptions("a-street-past", [ "高安全性的" ]);
					addOptions("n-building", [ "发电厂", "工厂", "仓库", "工作坊" ]);
					addOptions("n-buildings", [ "工厂", "工作坊", "仓库", "大型仓库", "工作坊", "精炼厂" ]);
					addOptions("a-building", [ "已停用的", "普通的", "巨大的", "奇特的" ]);
					addOptions("an-items", [ "损坏的机器" ]);
					break;
				case SectorConstants.SECTOR_TYPE_MAINTENANCE:
					addOptions("n-sector", [ "交通大厅", "维护区", "交通枢纽" ]);
					addOptions("a-street", [ "混乱的", "杂乱的", "光秃的", "微微震动的" ]);
					addOptions("a-street-past", [ "整洁的" ]);
					addOptions("n-building", [ "维护中心", "缆车车站", "公用设施建筑", "水处理站" ]);
					addOptions("n-buildings", [ "公用设施建筑", "数据中心", "控制室", "自动化控制单元" ]);
					addOptions("a-building", [ "已停用的", "无法进入的" ]);
					addOptions("an-decos", [ "破损的管道", "损坏的电车" ]);
					addOptions("an-items", [ "电线" ]);
					break;
				case SectorConstants.SECTOR_TYPE_COMMERCIAL:
					addOptions("n-sector", [ "购物中心", "商业中心", "办公综合体", "商业街区" ]);
					addOptions("a-street-past", [ "华丽的", "繁忙的", "充满活力的" ]);
					addOptions("n-building", [ "购物中心", "百货商店", "办公楼", "咖啡馆", "酒吧", "办公楼" ]);
					addOptions("n-buildings", [ "购物大厦", "购物中心", "商店", "零售店", "办公室", "办公大楼" ]);
					addOptions("a-building", [ "空荡的", "废弃的", "被洗劫的", "巨大的", "奇异的", "对称的", "色彩缤纷的" ]);
					addOptions("an-decos", [ "干涸的喷泉", "废弃的摊位" ]);
					addOptions("an-items", [ "破碎的玻璃" ]);
					break;
				case SectorConstants.SECTOR_TYPE_PUBLIC:
					addOptions("n-sector", ["监狱综合体", "游乐园", "图书馆", "公园" ]);
					addOptions("a-street", [ "庄严的", "肃穆的", "宏伟的", "普通的" ]);
					addOptions("a-street-past", [ "悠闲的", "有序的", "欢快的" ]);
					addOptions("n-building", [ "图书馆", "监狱", "学校", "大学建筑", "公园", "公共广场", "运动场", "地铁站", "研究实验室", "政府大楼" ]);
					addOptions("n-buildings", [ "公共建筑", "政府建筑" ]);
					addOptions("a-building", [ "空荡的", "无法进入的", "巨大的", "神秘的", "对称的" ]);
					addOptions("an-decos", [ "枯萎的树木" ]);
					addOptions("an-items", [ "垃圾" ]);
					if (features.level > 13) addOptions("an-items", [ "研究样本" ]);
					break;
				case SectorConstants.SECTOR_TYPE_SLUM:
					addOptions("n-sector", [ "棚户区", "垃圾填埋场", "贫民窟" ]);
					addOptions("a-street", [ "破旧的", "混乱的" ]);
					addOptions("a-street-past", [ "阴暗的", "拥挤的", "热闹的" ]);
					addOptions("n-building", [ "公寓楼" ]);
					addOptions("a-building", [ "废弃的", "破旧的", "令人沮丧的", "杂乱的", "灰色的", "布满涂鸦的", "随意搭建的" ]);
					addOptions("n-buildings", [ "简陋木屋", "小棚屋", "贫民窟住宅", "公寓楼", "似乎从未接入电网的居民楼" ]);
					addOptions("an-decos", [ "倒塌的棚屋", "垃圾堆" ]);
					addOptions("an-items", [ "生锈的管道", "空罐头" ]);
					break;
			}

			// - building density
			if (features.buildingDensity < 3) {
				addOptions("n-street", [ "区域", "空间", "广场" ]);
				if (features.sectorType == SectorConstants.SECTOR_TYPE_RESIDENTIAL || features.sectorType == SectorConstants.SECTOR_TYPE_COMMERCIAL)
					addOptions("n-street", [ "广场", "庭院" ]);
				addOptions("a-street", [ "宽阔的", "宽敞的", "巨大的" ]);
			} else if (features.buildingDensity < 6) {
				addOptions("n-street", [ "广场", "区域", "大厅" ]);
				if (features.sectorType == SectorConstants.SECTOR_TYPE_RESIDENTIAL || features.sectorType == SectorConstants.SECTOR_TYPE_COMMERCIAL)
					addOptions("n-street", [ "林荫大道", "大街", "拱廊" ]);
				if (features.sectorType != SectorConstants.SECTOR_TYPE_SLUM)
					addOptions("n-street", [ "主干道" ]);
				addOptions("a-street", [ "宽阔的", "宽敞的" ]);
			} else if (features.buildingDensity < 9) {
				addOptions("n-street", [ "街道", "街道", "小巷", "综合体", "区域", "通道", "拱廊", "隧道" ]);
				addOptions("a-street", [ "狭窄的" ]);
			} else {
				addOptions("n-street", [ "走廊", "通道", "小巷" ]);
				addOptions("a-street", [ "狭窄的", "拥挤的", "密集的", "低矮的" ]);
			}

			// - wear and damage
			switch (features.condition) {
				case SectorConstants.SECTOR_CONDITION_RUINED:
					addOptions("a-street", [ "废墟的", "倒塌的" ]);
					addOptions("n-buildings", [ "倒塌的废墟" ]);
					addOptions("n-buildings", [ "倒塌的废墟" ]);
					addOptions("a-building", [ "废墟的", "只剩骨架的", "砖石结构的" ]);
					break;
				case SectorConstants.SECTOR_CONDITION_DAMAGED:
					addOptions("a-street", [ "损坏的", "摧毁的", "破碎的" ]);
					addOptions("a-building", [ "损坏的", "严重损坏的" ]);
					addOptions("an-decos", [ "坍塌的隧道" ]);
					break;
				case SectorConstants.SECTOR_CONDITION_ABANDONED:
					addOptions("a-street", [ "荒凉的", "凄凉的", "诡异寂静的" ]);
					addOptions("a-building", [ "腐朽的", "荒凉的", "缓慢腐烂的", "早已废弃的", "倒塌的", "长期废弃的", "木质的", "沉闷的" ]);
					break;
				case SectorConstants.SECTOR_CONDITION_WORN:
					addOptions("a-building", [ "荒凉的", "废弃的", "凄凉的", "多彩的" ]);
					break;
				case SectorConstants.SECTOR_CONDITION_RECENT:
					addOptions("a-building", [ "保存完好的", "现代的", "看起来舒适的", "强化塑料的", "砖石结构的", "玻璃幕墙的" ]);
					break;
				case SectorConstants.SECTOR_CONDITION_MAINTAINED:
					addOptions("a-street", [ "现代的", "光滑的", "几何形状的", "嗡嗡作响的" ]);
					addOptions("a-building", [ "气凝胶的", "屏幕覆盖的" ]);
					break;
			}

			// - sunlight
			if (features.sunlit) {
				addOptions("a-street", [ "阳光照射的", "阳光笼罩的", "耀眼的", "明亮的", "有风的" ]);
				if (features.wear < 5 && features.damage < 5)
					addOptions("a-street", [ "闪闪发光的", "晶莹发亮的" ]);
				if (features.wear > 5)
					addOptions("a-street", [ "杂草丛生的" ]);
				addOptions("a-building", [ "充满活力的", "阳光照射的" ]);
				addOptions("an-decos", [ "顽固的杂草" ]);
			} else {
				addOptions("a-street", [ "黑暗的", "黑暗的", "阴暗的", "阴影笼罩的", "沉闷的" ]);
			}

			// - hazards
			if (features.hazards.cold > 0) {
				addOptions("a-street", [ "寒冷的", "透风的" ]);
			}
			if (features.hazards.radiation > 0) {
				addOptions("a-street", [ "荒凉的" ]);
				addOptions("n-building", [ "核电站", "核废料仓库", "核废料处理单元" ]);
				addOptions("a-building", [ "废弃的" ]);
				addOptions("na-items", [ "丢弃的安全设备" ]);
			}
			if (features.hazards.poison > 0) {
				addOptions("a-street", [ "污染的" ]);
				addOptions("n-building", [ "化工厂", "精炼厂", "垃圾处理厂" ]);
				addOptions("a-building", [ "污染的" ]);
				addOptions("na-items", [ "使用过的医用口罩" ]);
			}
			if (features.hazards.flooded > 0) {
				addOptions("a-street", [ "被洪水淹没的", "浸水的", "潮湿的", "多水的" ]);
				addOptions("a-building", [ "被洪水淹没的" ]);
			}
			if (features.hazards.debris) {
				addOptions("a-street", [ "被摧毁的", "损坏的", "废墟的" ]);
				addOptions("n-building", [ "建筑" ]);
				addOptions("a-building", [ "被摧毁的", "无法辨认的", "被掏空的" ]);
				addOptions("na-items", [ "废墟" ]);
			}
			if (features.hazards.territory) {
				addOptions("na-items", [ "垃圾" ]);
			}

			// - level population
			if (features.habitability == 0) {
				addOptions("a-street", [ "空荡的", "无人居住的", "荒凉的", "废弃的", "布满灰尘的" ] )
				addOptions("a-building", [ "长期废弃的", "空荡的", "污染的" ]);
			} else if (features.habitability < 1) {
				addOptions("a-street", [ "平静的" ]);
				addOptions("a-building", [ "空荡的" ]);
			} else {
				addOptions("a-building", [ "最近被洗劫的" ]);
				addOptions("na-items", [ "最近有拾荒者活动的迹象" ]);
			}

			// - level raid danger factor
			if (features.raidDangerFactor > 1) {
				addOptions("a-street", [ "被洗劫的" ]);
				addOptions("a-building", [ "被洗劫的", "损坏的", "被掠夺的", "被洗劫的" ]);
			}

			// - level: architectural style / age
			if (features.level < 6) {
				addOptions("a-street", [ "古老的", "古雅的" ]);
				addOptions("a-building", [ "古老的", "过时的", "古雅的", "历史悠久的", "华丽的", "巴洛克式的", "装饰性的" ]);
				addOptions("an-decos", [ "木质元素" ])
			} else if (features.level < 14) {
				addOptions("a-street", [ "过时的" ]);
				addOptions("a-building", [ "过时的" ]);
				addOptions("an-decos", [ "假窗户" ])
			} else if (features.level < 18) {
				if (features.sectorType != SectorConstants.SECTOR_TYPE_SLUM) {
					addOptions("a-street", [ "现代的" ]);
					addOptions("a-building", [ "现代的", "时尚的", "实用的" ]);
				}
			} else {
				if (features.sectorType != SectorConstants.SECTOR_TYPE_SLUM) {
					addOptions("a-street", [ "现代的" ]);
					addOptions("a-building", [ "玻璃幕墙的", "时尚的" ]);
				}
				addOptions("an-decos", [ "废弃的标志" ])
			}
			
			// 2) Build final result by selecting from options
			let rand = Math.abs(Math.floor((features.buildingDensity + features.wear + features.damage) / 2) + features.sectorX + features.sectorY);

			let pickRandom = function (options, excluded) {
				if (!options || options.length <= 0) return "";
				let validOptions = options.filter(option => !excluded.includes(option));
				let i = rand % validOptions.length;
				return validOptions[i];
			};

			let selectFromOptions = function (key, num) {
				let selection = [];
				for (let i = 0; i < num; i++) {
					var sel = pickRandom(options[key], selection);
					if (sel) {
						selection.push(sel);
					} else {
						log.w("could not select valid [" + key + "] " + (i+1) + "/" + num)
						log.w(options);
					}
				}
				return selection;
			};

			let result = {};
			// result["a-sectortype"] = features.sectorType;
			// Suggestion: should add a getDisplay function here
			let sectorTypeMap = {
				"industrial": "工业区",
				"residential": "住宅区",
				"commercial": "商业区",
				"maintenance": "维护区",
				"public": "公共",
				"slum": "贫民窟"
			};
			result["a-sectortype"] = sectorTypeMap[features.sectorType] || features.sectorType;
			result["n-sector"] = selectFromOptions("n-sector", 1);
			result["n-street"] = selectFromOptions("n-street", 1);
			result["a-street"] = selectFromOptions("a-street", 2);
			result["a-street-past"] = selectFromOptions("a-street-past", 1);
			result["n-building"] = selectFromOptions("n-building", 2);
			result["n-buildings"] = selectFromOptions("n-buildings", 2);
			result["a-building"] = selectFromOptions("a-building", 2);
			result["an-decos"] = selectFromOptions("an-decos", 2);
			result["an-items"] = selectFromOptions("an-items", 2);
			
			return result;
		},
		
		getPassageFoundMessage: function (passageVO, direction, sunlit, isBuilt) {			
			let passageType = passageVO.type;
			let textKey = "passage_found_" + passageType + "_message";

			if (isBuilt) {
				textKey = "passage_found_" + passageType + "_built_message";
			}

			if (passageVO.type == MovementConstants.PASSAGE_TYPE_HOLE) {
				if (direction === PositionConstants.DIRECTION_UP) {
					if (!isBuilt) {
						if (sunlit) {
							textKey = "passage_found_hole_up_sunlit_message";
						} else {
							textKey = "passage_found_hole_up_dark_message";
						}
					}
				} else {
					if (!isBuilt) {
						if (sunlit) {
							textKey = "passage_found_hole_down_sunlit_message";
						} else {
							textKey = "passage_found_hole_down_dark_message";
						}
					}
				}
			}

			return Text.t("story.messages." + textKey);
		},
		
		getPassageRepairedMessage: function (passageType, direction, sectorPosVO, numCampsBuilt) {
			let directionName = (direction === PositionConstants.DIRECTION_UP ? " up" : " down");
			let includeLevelInPosition = numCampsBuilt > 1;
			switch (passageType) {
				case MovementConstants.PASSAGE_TYPE_HOLE:
					return "电梯 " + directionName + " 已在 " + sectorPosVO.getInGameFormat(includeLevelInPosition) + " 建造完成";
				case MovementConstants.PASSAGE_TYPE_ELEVATOR:
					return "电梯 " + directionName + " 已在 " + sectorPosVO.getInGameFormat(includeLevelInPosition) + " 修复完成";
				case MovementConstants.PASSAGE_TYPE_STAIRWELL:
					return "楼梯间 " + directionName + " 已在 " + sectorPosVO.getInGameFormat(includeLevelInPosition) + " 修复完成";
				default:
					log.w("Unknown passage type: [" + passageType + "]")
					return "通道 " + directionName + " 已在 " + sectorPosVO.getInGameFormat(includeLevelInPosition) + " 准备就绪";
			}
		},
				
		getPassageDescription: function (passageVO, direction, isBuilt, isShort) {
			let passageType = passageVO.type;
			let passageTypeName = passageType;
			let directionName = (direction === PositionConstants.DIRECTION_UP ? "up" : "down");

			let result = "";

			if (isShort) {
				let statusDescription = this.getPassageStatusDescription(passageVO, isBuilt);
				result = Text.t("ui.map.passage_description_template_short", { direction: directionName, passageType: passageTypeName, status: statusDescription });
			} else {
					let textKey = "ui.exploration.sector_status_passage_" + passageType + "_default_description";

					if (isBuilt) {
						textKey = "ui.exploration.sector_status_passage_" + passageType + "_built_description";
					}

					if (!isBuilt && passageType == MovementConstants.PASSAGE_TYPE_HOLE) {
						textKey = "ui.exploration.sector_status_passage_hole_" + directionName + "_default_description";
					}

					result = Text.t(textKey, { direction: directionName });
			}

			return result;
		},

		getPassageStatusDescription: function (passageVO, isBuilt) {
			switch (passageVO.type) {
				case MovementConstants.PASSAGE_TYPE_PREBUILT:
					return Text.t("ui.map.passage_status_prebuilt");
				case MovementConstants.PASSAGE_TYPE_HOLE:
					return isBuilt ? Text.t("ui.map.passage_status_built") : Text.t("ui.map.passage_status_hole");
				case MovementConstants.PASSAGE_TYPE_ELEVATOR:
					return isBuilt ? Text.t("ui.map.passage_status_repaired") : Text.t("ui.map.passage_status_broken");
				case MovementConstants.PASSAGE_TYPE_STAIRWELL:
					return isBuilt ? Text.t("ui.map.passage_status_repaired") : Text.t("ui.map.passage_status_broken");
			}
		},
		
		getReadBookMessage: function (itemVO, bookType, campOrdinal, storyFlags) {
			let features = {};
			let itemName = ItemConstants.getItemDisplayName(itemVO);
			features.bookType = bookType;
			features.bookName = itemName;
			features.bookLevel = itemVO.level || 1;
			features.campOrdinal = campOrdinal;
			features.randomSeed = itemVO.itemID;
			let params = this.getBookTextParams(features, storyFlags);
			
			let template = DescriptionMapper.get("book-intro", features) + " " + DescriptionMapper.get("book-description", features);
			let phrase = TextBuilder.build(template, params);
			
			return phrase;
		},
		
		getBookTextParams: function (features, storyFlags) {
			var result = {};
			
			let levels = [];
			switch (features.bookLevel) {
				case 1:
					levels.push("简单的");
					levels.push("过时的");
					levels.push("过于简化的");
					levels.push("有偏见的");
					break;
				case 2:
					levels.push("基础的");
					levels.push("普通的");
					levels.push("不错的");
					break;
				case 3:
					levels.push("高级的");
					levels.push("详细的");
					levels.push("有见解的");
					levels.push("厚重的");
					break;
			}
			result["a-level"] = DescriptionMapper.pickRandom(levels, features);
			
			let styles = [];
			switch (features.bookType) {
				case ItemConstants.bookTypes.science:
				case ItemConstants.bookTypes.engineering:
				case ItemConstants.bookTypes.history:
					styles.push("信息丰富的");
					styles.push("详细的");
					styles.push("枯燥的");
					styles.push("有见解的");
					styles.push("冗长的");
					styles.push("带插图的");
					styles.push("科学性的");
					styles.push("正式的");
					styles.push("系统性的");
					styles.push("官方的");
					break;
				case ItemConstants.bookTypes.fiction:
					styles.push("奇幻的");
					styles.push("鼓舞人心的");
					styles.push("写实的");
					styles.push("充满动作的");
					styles.push("喜剧的");
					styles.push("悲剧的");
					styles.push("浪漫的");
					styles.push("戏剧化的");
					styles.push("异想天开的");
					styles.push("无聊的");
					styles.push("黑暗的");
					styles.push("激动人心的");
					styles.push("令人难忘的");
					styles.push("华丽的");
					styles.push("真诚的");
					styles.push("真实的");
					styles.push("生动的");
					styles.push("节奏缓慢的");
					styles.push("精心制作的");
					styles.push("离奇的");
					break;
			}
			result["a-style"] = DescriptionMapper.pickRandom(styles, features);
			
			let goodAdjectives = [];
			goodAdjectives.push("雄辩的");
			goodAdjectives.push("难忘的");
			goodAdjectives.push("令人愉快的");
			goodAdjectives.push("优秀的");
			switch (features.bookType) {
				case ItemConstants.bookTypes.science:
				case ItemConstants.bookTypes.engineering:
				case ItemConstants.bookTypes.history:
					goodAdjectives.push("详细的");
					goodAdjectives.push("全面的");
					goodAdjectives.push("详尽的");
					goodAdjectives.push("引人入胜的");
					goodAdjectives.push("彻底的");
					goodAdjectives.push("有用的");
					break;
				case ItemConstants.bookTypes.fiction:
					goodAdjectives.push("精彩的");
					goodAdjectives.push("生动的");
					goodAdjectives.push("引人入胜的");
					break;
			}
			result["a-good"] = DescriptionMapper.pickRandom(goodAdjectives, features);
			
			let badAdjectives = [];
			badAdjectives.push("冗长乏味的");
			badAdjectives.push("单调的");
			badAdjectives.push("枯燥的");
			switch (features.bookType) {
				case ItemConstants.bookTypes.science:
				case ItemConstants.bookTypes.engineering:
				case ItemConstants.bookTypes.history:
					badAdjectives.push("不实用的");
					badAdjectives.push("模糊的");
					break;
				case ItemConstants.bookTypes.fiction:
					badAdjectives.push("容易忘记的");
					badAdjectives.push("缺乏创意的");
					badAdjectives.push("俗气的");
					break;
			}
			result["a-bad"] = DescriptionMapper.pickRandom(badAdjectives, features);
			
			let topics = [];
			switch (features.bookType) {
					case ItemConstants.bookTypes.science:
						topics.push("一种在放射性环境中茁壮成长的蛞蝓物种");
						topics.push("城市的基础设施");
						topics.push("海洋");
						topics.push("森林");
						topics.push("城市中的通风系统");
						topics.push("医学");
						topics.push("电子学");
						topics.push("如何保护自己免受阳光的有害影响");
						topics.push("生橡胶如何被加工成多种有用的形式");
						topics.push("癌症治疗");
						topics.push("DNA");
						topics.push("温室农业");
						topics.push("进化");
						topics.push("板块构造学");
						topics.push("电池");
						topics.push("化石");
						topics.push("地震");
						topics.push("发酵");
						topics.push("病毒");
						topics.push("太阳历");
						topics.push("涉及萨满教的奇怪农业实践");
						topics.push("雷达技术");
						topics.push("数学");
						topics.push("独裁政府对城市扩张的雄心勃勃但未实现的计划");
						topics.push("生态系统");
						topics.push("牙科学");
						topics.push("计算机");
						topics.push("火山");
						topics.push("通过医学进步实现永生");
						topics.push("陨石");
						topics.push("印刷机");
						topics.push("光学镜片");
						topics.push("焚烧垃圾获取能源");
						topics.push("肥料");
						topics.push("城市的水循环设施");
						topics.push("由于先进医学而实现永生的可能性");
					
					if (features.bookLevel == 1) {
						topics.push("古老的武器");
						topics.push("小苏打 (碳酸氢钠) 的多种用途");
						topics.push("板块构造学");
						topics.push("一种名为木材的古老材料");
						topics.push("食品保存");
					}
					if (features.bookLevel == 2) {
						topics.push("粮食作物轮作");
						topics.push("火药");
						topics.push("电");
						topics.push("无线电技术");
						topics.push("指南针");
						topics.push("行星大气");
						topics.push("温室维护");
						topics.push("生物化学");
						topics.push("历法的起源、太阳和月亮的运动");
					}
					if (features.bookLevel == 3) {
						topics.push("电磁学");
						topics.push("其他行星");
						topics.push("原子武器");
						topics.push("暗物质");
						topics.push("以可重用格式压缩和存储记忆");
					}
					break;
					
				case ItemConstants.bookTypes.fiction:
						topics.push("大灾变前的流行音乐");
						topics.push("黑暗层的生活");
						topics.push("城市早期移民");
						topics.push("遥远的岛屿");
						topics.push("不同行星之间的旅行");
						topics.push("著名女演员");
						topics.push("贫民窟的生活");
						topics.push("地表犯罪侦探的生活");
						topics.push("城市无人居住层中的幽灵");
						topics.push("古老的火山");
						topics.push("海底旅行");
						topics.push("生活在行星核心的怪物");
						topics.push("可怕的海怪");
						topics.push("男孩和他的蝙蝠之间的关系");
						topics.push("一场战争");
						topics.push("小行星撞击城市");
						topics.push("一名蓝军士兵及其在独裁政权崩溃后的经历");
					break;
					
				case ItemConstants.bookTypes.history:
						topics.push("生物战");
						topics.push("城市前文明");
						topics.push("农业发展");
						topics.push("海平面上升");
						topics.push("绘画史");
						topics.push("工业革命");
						topics.push("数字革命");
						topics.push("土地和矿场的产权");
						topics.push("大灾变前城市已经明显的人口下降");
						topics.push("特定族群");
						topics.push("城市建立后不久的饥荒");
						topics.push("城市前的全球法律组织");
						topics.push("数学史");
						topics.push("伟大的科学项目");
						topics.push("城邦时期");
						topics.push("城市战争");
						topics.push("阶级紧张");
						topics.push("人口危机");
						topics.push("沉船事件");
						topics.push("不同层级的建筑风格");
						topics.push("奴隶制");
						topics.push("生活在城市特定区域的人们的魔法信仰");
						topics.push("历史上的独裁政权");
						topics.push("城市中的神圣场所");
					
					if (features.bookLevel == 1) {
						topics.push("早期城市");
						topics.push("城市不同地区的建筑风格");
						topics.push("大地震对城市的影响");
						topics.push("大灾变前的宗教及其如何引发多场战争");
					}
					if (features.bookLevel == 2) {
						topics.push("一个强大犯罪集团的历史");
						topics.push("城市内两个派系之间的大战");
					}
					if (features.bookLevel == 3) {
						topics.push("一个强大犯罪集团的历史");
						topics.push("大灾变前政府是如何形成的");
					}
					break;
					
				case ItemConstants.bookTypes.engineering:
						topics.push("工业流程");
						topics.push("晶体管");
						topics.push("核反应堆");
						topics.push("核废料处理");
						topics.push("滞气层");
						topics.push("太阳穹顶");
						topics.push("无线电");
						topics.push("机器人学");
						topics.push("用于稳定城市抵御地震的结构");
						topics.push("器官移植");
						topics.push("建筑学");
						topics.push("3D打印");
						topics.push("机器控制系统");
						topics.push("用于分配阳光的镜面系统");
						topics.push("机器人设计");
						topics.push("城市中的电梯");
						topics.push("统计学");
						topics.push("太空飞行");
						topics.push("电子学");
						topics.push("桥梁");
						topics.push("城市的区域、地区、扇区和其他划分");
					
					if (features.bookLevel == 1) {
						topics.push("钢铁生产");
						topics.push("橡胶生产");
						topics.push("放射性废物管理");
					}
					if (features.bookLevel == 2) {
						topics.push("人工智能");
						topics.push("一种编程语言");
					}
					if (features.bookLevel == 3) {
						topics.push("编程");
						topics.push("机器人制造");
						topics.push("编程");
					}
					break;
			}
			result["n-topic"] = DescriptionMapper.pickRandom(topics, features);
			
			let objects = [];
			switch (features.bookType) {
				case ItemConstants.bookTypes.engineering:
						objects.push("晶体管");
						objects.push("机器人");
						objects.push("你不太理解的机器, 但它们似乎是用来稳定城市的");
						objects.push("一种覆盖整层的太阳能屏幕, 称为天花板");
						objects.push("大灾变前温室中的灌溉系统");
						objects.push("家用电器");
					
					if (features.bookLevel == 1) {
						objects.push("为旧电梯提供动力的引擎");
						objects.push("武器");
						objects.push("医疗仪器");
					}
					if (features.bookLevel == 2) {
						objects.push("覆盖整层城市的信息网络");
						objects.push("飞行载具");
						objects.push("用于收集和处理垃圾的机器人");
						objects.push("用于存储和传输数据的设备");
					}
					if (features.bookLevel == 3) {
						objects.push("不同类型的机器人");
						objects.push("伟大的火箭");
						objects.push("污水系统");
					}
					break;
			}
			result["n-object"] = DescriptionMapper.pickRandom(objects, features);
			
			let themes = [];
			switch (features.bookType) {
				case ItemConstants.bookTypes.fiction:
					themes.push("来自另一个大陆的难民");
					themes.push("第一次见到太阳的矿工");
					themes.push("一场撕裂城市边缘的可怕风暴");
					themes.push("大洪水");
					themes.push("能够预测天气的萨满");
					themes.push("城市内不同派系之间的战争");
					themes.push("英雄领袖的崛起");
					themes.push("一个贫民窟居民克服重重困难, 最终在城市中崛起");
					themes.push("大灾变前贫民窟中一个犯罪团伙的兴衰");
					themes.push("一个人放弃了城市的有人居住区域, 独自寻找地面");
					themes.push("一群科学家被困在城市旧区的研究站");
					themes.push("两个被迫在遥远地方工作的人之间的爱情故事");
					themes.push("一名负责评估个人对城市贡献价值的官僚");
					themes.push("城市人民在一个政府下的统一");
					themes.push("思念远方故土的人");
					themes.push("据说在城市废弃部分游荡的幽灵");
					themes.push("一个从未离开过房间的女孩");
					themes.push("一群在城市某部分从事电梯和电车工作的人");
					themes.push("大灾变前一家报纸办公室中复杂的社会等级");
					themes.push("城市中一个只有老年人的社区");
					themes.push("一个富有但孤独的商人的生活");
					themes.push("一个男孩与机器人的友谊");
					themes.push("一个让人忘记自己身份的计算机程序");
					themes.push("城市外被遗忘的地方");
					break;
			}
			result["c-theme"] = DescriptionMapper.pickRandom(themes, features);
			
			let facts = [];
			switch (features.bookType) {
				case ItemConstants.bookTypes.science:
					facts.push("大灾变前, 城市的人口已经在减少");
					facts.push("古代文明经常使用木材作为建筑材料, 因为地面上木材资源丰富");
					facts.push("城市深处曾有几个采矿小镇");
					facts.push("城市低于特定层的维护主要由机器人完成");
					facts.push("城市的大多数食物温室都位于其边缘");
					facts.push("城市中的大部分水是在地表和地面收集的雨水");
					facts.push("有些动物一生都生活在水下");
					facts.push("蜘蛛丝是已知的最坚固的天然材料");
					facts.push("香蕉具有放射性");
					facts.push("没有唾液就无法品尝食物");
					break;
				case ItemConstants.bookTypes.history:
					facts.push("大灾变前, 少数强大的采矿公司掌握着巨大权力");
					facts.push("古代文明的历法基于四季");
					facts.push("城市最初建在沼泽地上");
					facts.push("城市曾居住着来自多个古老文明的人们");
					facts.push("城市历史上经历过多次饥荒");
					facts.push("城市大约在700年前开始建造");
					facts.push("曾经有一段时间, 城市中所有宗教都被禁止");
					facts.push("最后一个水下研究站在大灾变前几十年就关闭了");
					facts.push("城市中的一些地方似乎因为过去的不公或恐怖事件而被诅咒");
					break;
				case ItemConstants.bookTypes.engineering:
					facts.push("城市的下层高度不均");
					facts.push("城市的大部分地区过去由电灯照明");
					facts.push("城市的地表曾经由一个巨大的穹顶保护");
					facts.push("阳光曾经通过复杂的镜面系统反射到城市更深处");
					facts.push("城市的部分区域建在山中");
					facts.push("海洋被严重污染");
					facts.push("在人口高峰期, 城市仅因居民产生的热量就需要复杂的冷却系统");
					// TODO get general facts like these in features / otherwise
					// TODO add more and splt by level so these don't get repetitive
					// facts.push("there are X levels in the City");
					// facts.push("the lowest level of the City is in fact number X");
					break;
			}
			result["c-fact"] = DescriptionMapper.pickRandom(facts, features);
			
			let events = [];
			switch (features.bookType) {
				case ItemConstants.bookTypes.history:
					events.push("数百年前城市对某个遥远文明发动的战争");
					events.push("过去500年间城市内的战争");
					events.push("城市最初几层的建设");
					events.push("从某个遥远岛屿向城市的移民");
					events.push("被称为大饥荒的事件, 发生在该书写作前几十年");
					events.push("城市范围政府的建立");
					events.push("一场重大的园丁起义");
					events.push("与城市外污染相关的丑闻");
					events.push("城市外的饥荒及由此引发的移民潮");
					events.push("一场核电站事故, 废物被释放到城市下层");
					events.push("农业从地面向温室的重大转变");
					events.push("城市内的一系列恐怖袭击");
					events.push("第一种计算机病毒");
					events.push("城市与外部某个国家之间的毁灭性战争");
					events.push("女性选举权运动");
					events.push("一系列人体植入物增强实验");
					events.push("涉及有影响力政客的丑闻");
					events.push("几十年前某个宗教教派尝试在城市外生活的失败尝试");
					events.push("绕行星运行的小型载人空间站的建设");
					break;
			}
			result["c-event"] = DescriptionMapper.pickRandom(events, features);
			
			return result;
		},
		
		getReadNewspaperMessage: function (itemVO) {
			let features = {};
			let itemName = ItemConstants.getItemDisplayName(itemVO);
			features.itemName = itemName;
			features.itemLevel = itemVO.level || 1;
			features.randomSeed = itemVO.itemID;
			let params = this.getNewspaperTextParams(features);
			
			let template = "You leaf through the newspaper. " + DescriptionMapper.get("newspaper-description", features);
			let phrase = TextBuilder.build(template, params);
			
			return phrase;
		},
		
		getNewspaperTextParams: function (features) {
			let result = {};
			
			let events = [];
			events.push("工人罢工");
			events.push("当地庆祝活动");
			events.push("一群难民的到来");
			events.push("三胞胎的出生");
			events.push("疾病爆发");
			events.push("失踪的贸易商队");
			events.push("幽灵目击事件");
			events.push("某栋建筑中无法解释的光芒");
			switch (features.itemLevel) {
				case 1:
					events.push("新狩猎场的发现");
					events.push("某层地板的坍塌");
					events.push("人口里程碑");
					break;
				case 2:
					events.push("新冶炼技术的发现");
					events.push("新领导者的选举");
					events.push("音乐节");
					events.push("新渡槽的建成");
					events.push("探索城市未知区域的探险队");
					break;
				case 3:
					events.push("新建筑材料的发现");
					events.push("新药物的发现");
					events.push("当地体育赛事");
					break;
			}
			result["c-event"] = DescriptionMapper.pickRandom(events, features);
			
			let topics = [];
			topics.push("当地政治");
			topics.push("当地八卦");
			topics.push("星座运势");
			topics.push("定居点周围的植物生命");
			topics.push("城市的侵蚀");
			topics.push("闹鬼的商业中心");
			topics.push("关于总督命运的各种理论");
			topics.push("关于大灾变真正原因的各种理论");
			topics.push("月光对健康的影响");
			switch (features.itemLevel) {
				case 1:
					topics.push("黑暗层的生存技巧");
					topics.push("大灾变前黑暗层的生活");
					topics.push("将蝙蝠作为宠物饲养");
					break;
				case 2:
					topics.push("医学");
					topics.push("烹饪");
					topics.push("私有财产");
					topics.push("小型园艺");
					break;
				case 3:
					topics.push("网络");
					topics.push("道德问题");
					break;
			}
			result["n-topic"] = DescriptionMapper.pickRandom(topics, features);

			let facts = [];
			facts.push("新年庆祝活动因洪水而中断")
			facts.push("17层开了一家新餐厅")
			facts.push("19层的毒品交易仍在继续")
			facts.push("疾病袭击了一个主要定居点")
			result["c-fact"] = DescriptionMapper.pickRandom(facts, features);
			
			return result;
		},
		
		getDonateSeedsMessage: function (itemVO) {
			return "将种子捐赠给了寺庙, 神职人员会珍视它们, 也许会有什么东西生长出来";
		},
		
		getReadResearchPaperMessage: function (itemVO) {
			let features = {};
			let itemName = ItemConstants.getItemDisplayName(itemVO);
			features.itemName = itemName;
			features.itemLevel = itemVO.level || 1;
			features.randomSeed = itemVO.itemID;
			let params = this.getResearchPaperTextParams(features);
			
			let template = "你阅读了这篇论文" + DescriptionMapper.get("researchpaper-description", features);
			let phrase = TextBuilder.build(template, params);
			
			return phrase;
		},
		
		getResearchPaperTextParams: function (features) {
			let result = {};
			
			let facts = [];
			facts.push("城市正在以比现有人口可能维持的速度更快地瓦解");
			facts.push("城市建在沼泽地上, 正在慢慢下沉");
			facts.push("大灾变前, 洋流正在改变方向");
			facts.push("一些研究人员在大灾变前几年就担心火山活动");
			facts.push("大灾变前有一个研究小组正在调查返回地表生活的可能性");
			facts.push("城市外的空气呼吸起来很危险");
			facts.push("大灾变前有一个最高机密研究小组");
			facts.push("大灾变前的政府正在大力投资太空研究");
			facts.push("囚犯被用于与太空旅行相关的秘密实验");
			facts.push("政府正在编制一份机密的优先撤离人员名单, 以备紧急情况");
			facts.push("大灾变前有一个最高机密基因库正在为某种目的做准备");
			facts.push("城市政府想要隐瞒大量燃料和建筑材料的储备");
			result["c-fact"] = DescriptionMapper.pickRandom(facts, features);
			
			let topics = [];
			topics.push("太空火箭发射失败对城市可能造成的后果");
			topics.push("一艘宇宙飞船可以居住的人数");
			topics.push("长途太空旅行的可能性");
			topics.push("附近行星和恒星系统的宜居性");
			topics.push("超大型宇宙飞船的燃料计算");
			topics.push("可持续定居点所需的人数");
			topics.push("超级火山");
			topics.push("城市空气质量");
			topics.push("通过歌声控制天气的可能性");
			topics.push("开花植物对掷骰子结果的影响");
			topics.push("黑暗层的洪水");
			topics.push("不同场景下城市应急电力的预期持续时间");
			topics.push("提高城市抵御飓风等极端天气的能力");
			
			result["n-topic"] = DescriptionMapper.pickRandom(topics, features);
			
			return result;
		},
		
		getFoundStashMessage: function (stashVO) {
			switch (stashVO.stashType) {
				case ItemConstants.STASH_TYPE_ITEM:
					let itemID = stashVO.itemID;
					let item = ItemConstants.getItemDefinitionByID(itemID);
					if (item.type == ItemConstants.itemTypes.note) {
						return "发现了一些有趣的文件";
					} else { 
						return "发现了一个物品储藏处";
					}
				case ItemConstants.STASH_TYPE_SILVER:
					return "发现了一些硬币";
				default:
					log.w("Unknown stash type: " + stashVO.stashType);
					return "发现了一个储藏处";
			}
		},
		
		getWaymarkText: function (waymarkVO, sectorFeatures) {
			let features = Object.assign({}, sectorFeatures);
			features.waymarkType = waymarkVO.type;
			features.direction = PositionConstants.getDirectionFrom(waymarkVO.fromPosition, waymarkVO.toPosition);
			
			let template = DescriptionMapper.get("waymark", features);
			let params = this.getWaymarkTextParams(waymarkVO, features);
			let phrase = TextBuilder.build(template, params);
			
			result = phrase;
			if (GameConstants.isDebugVersion) result += " [" + waymarkVO.toPosition + "]";
			
			return result;
		},
		
		getWaymarkTextParams: function (waymarkVO, features) {
			let result = {};
			
			let tradePartner = TradeConstants.getTradePartner(features.campOrdinal);
			
			result["n-target"] = "<span class='hl-functionality'>" + this.getWaymarkTargetName(waymarkVO) + "</span>";
			result["direction"] = PositionConstants.getDirectionName(features.direction, false);
			result["n-settlement-name"] = tradePartner ? tradePartner.name : null;
			return result;
		},
		
		getWaymarkTargetName: function (waymarkVO) {
			switch (waymarkVO.type) {
				case SectorConstants.WAYMARK_TYPE_SPRING: return "水源";
				case SectorConstants.WAYMARK_TYPE_CAMP: return "安全处";
				case SectorConstants.WAYMARK_TYPE_RADIATION: return "危险";
				case SectorConstants.WAYMARK_TYPE_POLLUTION: return "危险";
				case SectorConstants.WAYMARK_TYPE_SETTLEMENT: return "贸易";
				default:
					log.w("unknown waymark type: " + waymarkVO.type);
					return "安全";
			}
		},

		getResourceDisplayName: function (resourceName) {
			return Text.t("game.resources." + resourceName + "_name");
		},

		getHeapDisplayName: function (resourceName, features) {
			let sectorType = features.sectorType;
			let condition = features.getCondition();
			let isBadCondition = condition == SectorConstants.SECTOR_CONDITION_RUINED || condition == SectorConstants.SECTOR_CONDITION_DAMAGED;
			let isHumbleSectorType = sectorType == SectorConstants.SECTOR_TYPE_SLUM || sectorType == features.SECTOR_TYPE_MAINTENANCE || sectorType == SectorConstants.SECTOR_TYPE_INDUSTRIAL;
			let isLivable = !features.hasHazards() && !features.sunlit && features.buildingDensity > 1 && features.buildingDensity < 8;

			switch (resourceName) {
				case resourceNames.metal:
					if (features.buildingDensity > 3 && isBadCondition) return "倒塌的建筑";
					if (sectorType == SectorConstants.SECTOR_TYPE_MAINTENANCE) return "损毁的车辆";
					if (features.buildingDensity < 7 && isHumbleSectorType) return "垃圾填埋场";
					if (isLivable && !features.ground && condition == SectorConstants.SECTOR_CONDITION_ABANDONED) return "废弃营地";
					return "金属堆";
					
			}
			return "资源堆 (" + resourceName + ")";
		},

		getResourcesTextVO: function (resourcesVO, currency) {
			let list = [];

			for (let key in resourceNames) {
				let name = resourceNames[key];
				let amount = resourcesVO.getResource(name);
				if (amount > 0) {
					let listFragment = { textKey: "ui.common.value_and_name", textParams: { value: Math.round(amount), name: name } };
					list.push(listFragment);
				}
			}

			if (currency > 0) {
				let listFragment = { textKey: "ui.common.value_and_name", textParams: { value: Math.round(currency), name: "game.resources.currency_name" } };
				list.push(listFragment);
			}

			return this.getListTextVO(list);
		},

		getItemsTextVO: function (items) {
			let itemCounts = {};
			let itemsByID = {};

			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				let itemID = item.id;
				if (!itemCounts[itemID]) itemCounts[itemID] = 0;
				itemCounts[itemID]++;
				itemsByID[itemID] = item;
			}

			let list = [];

			for (let itemID in itemCounts) {
				let count = itemCounts[itemID];
				if (count == 0) continue;
				let item = itemsByID[itemID];
				let itemName = ItemConstants.getItemDisplayNameKey(item);
				let listFragment = { textKey: "ui.common.value_and_name", textParams: { value: count, name: itemName } };
				list.push(listFragment);
			}

			return this.getListTextVO(list);
		},
		
		getFightChancesText: function (probability) {
			if (probability >= 0.9) {
				return "相当无害";
			}
			if (probability > 0.8) {
				return "略微令人不安";
			}
			if (probability > 0.6) {
				return "令人生畏";
			}
			if (probability >= 0.5) {
				return "有风险";
			}
			if (probability >= 0.4) {
				return "危险";
			}
			if (probability >= 0.2) {
				return "非常危险";
			}
			return "致命";
		},
		
		getLocaleName: function (locale, sectorFeatures, isShort) {
			let condition = sectorFeatures.getCondition();
			let modifier = "";
			let noun = "";
			
			// default modifiers
			switch (condition) {
				case SectorConstants.SECTOR_CONDITION_RUINED:
					modifier = "废墟";
					break;
				case SectorConstants.SECTOR_CONDITION_DAMAGED:
					modifier = "损毁";
					break;
				case SectorConstants.SECTOR_CONDITION_ABANDONED:
					modifier = "废弃";
					break;
				case SectorConstants.SECTOR_CONDITION_WORN:
					modifier = "破旧";
					break;
				case SectorConstants.SECTOR_CONDITION_RECENT:
					modifier = "空置";
					break;
				case SectorConstants.SECTOR_CONDITION_MAINTAINED:
					modifier = "完好";
					break;
			}
			
			// nouns and special modifiers
			switch (locale.type) {
				case localeTypes.compound:
					modifier = "神秘";
					noun = "院落";
					break;
				case localeTypes.factory:
					noun = sectorFeatures.surface ? "办公室" : "工厂";
					break;
				case localeTypes.house:
				case localeTypes.shelter:
					if (condition === SectorConstants.SECTOR_CONDITION_DAMAGED) modifier = "摧毁";
					if (condition === SectorConstants.SECTOR_CONDITION_WORN) modifier = "荒废";
					noun = "房屋";
					break;
				case localeTypes.lab:
					noun = "实验室";
					break;
				case localeTypes.grove:
					modifier = "茂盛";
					noun = "小树林";
					break;
				case localeTypes.greenhouse:
					modifier = "废弃";
					noun = "温室";
					break;
				case localeTypes.depot:
					modifier = "锁着";
					noun = "仓库";
					break;
				case localeTypes.expedition:
					modifier = "探险";
					noun = "营地";
					break;
				case localeTypes.isolationCenter:
					modifier = "高傲";
					noun = "设施";
					break;
				case localeTypes.seedDepot:
					modifier = "政府";
					noun = "仓库";
					break;
				case localeTypes.spacefactory:
					modifier = "神秘";
					noun = "设施";
					break;
				case localeTypes.market:
					noun = sectorFeatures.level > 15 ? "购物中心" : "市场";
					break;
				case localeTypes.maintenance:
					switch (condition) {
						case SectorConstants.SECTOR_CONDITION_RUINED:
							noun = "控制单元";
							break;
						case SectorConstants.SECTOR_CONDITION_DAMAGED:
							noun = "控制单元";
							break;
						case SectorConstants.SECTOR_CONDITION_ABANDONED:
							modifier = "古老";
							noun = "网络交换机";
							break;
						case SectorConstants.SECTOR_CONDITION_WORN:
							modifier = "老旧";
							noun = "水塔";
							break;
						case SectorConstants.SECTOR_CONDITION_RECENT:
							modifier = "失效";
							noun = "控制单元";
							break;
						case SectorConstants.SECTOR_CONDITION_MAINTAINED:
							noun = "消防站";
							break;
						default:
					}
					break;
				case localeTypes.transport:
					noun = "车站";
					if (condition === SectorConstants.SECTOR_CONDITION_RUINED) noun = "火车仓库";
					if (condition === SectorConstants.SECTOR_CONDITION_WORN) modifier = "废弃电车";
					if (condition === SectorConstants.SECTOR_CONDITION_RECENT) modifier = "缆车";
					if (condition === SectorConstants.SECTOR_CONDITION_MAINTAINED) modifier = "火车";
					break;
				case localeTypes.junkyard:
					if (condition === SectorConstants.SECTOR_CONDITION_RECENT) modifier = "安静";
					if (condition === SectorConstants.SECTOR_CONDITION_MAINTAINED) modifier = "安静";
					noun = "垃圾场";
					break;
				case localeTypes.warehouse:
					if (condition === SectorConstants.SECTOR_CONDITION_RECENT) modifier = "坚固";
					if (condition === SectorConstants.SECTOR_CONDITION_MAINTAINED) modifier = "坚固";
					noun = "仓库";
					break;
				case localeTypes.camp:
				case localeTypes.tradingpartner:
					modifier = "外来";
					noun = "营地";
					break;
				case localeTypes.clinic:
					modifier = "临时";
					noun = "诊所";
					break;
				case localeTypes.library:
					modifier = "废弃";
					if (sectorFeatures.level < 10) modifier = "老旧";
					noun = "图书馆";
					break;
				case localeTypes.farm:
					modifier = "荒芜";
					if (sectorFeatures.level < 10) modifier = "古老";
					noun = "农场";
					break;
				case localeTypes.bunker:
					modifier = "空荡";
					noun = "地堡";
					break;
				case localeTypes.restaurant:
					noun = "餐厅";
					break;
				case localeTypes.hospital:
					noun = "医院";
					break;
				case localeTypes.grocery:
				case localeTypes.store:
					noun = "商店";
					break;
				case localeTypes.office:
					noun = "办公室";
					break;
				default:
					log.w("unknown locale type: " + locale.type);
					noun = "建筑";
					break;
			}
			
			return isShort ? noun : (modifier + " " + noun).trim();
		},
		
		getWorkshopName: function (resource) {
			switch (resource) {
				case resourceNames.fuel: return "精炼厂";
				case resourceNames.rubber: return "种植园";
				default: return "工坊";
			}
		},
		
		getSpringName: function (featuresComponent) {
			let hasHazards = featuresComponent.hazards.hasHazards();
			let type = featuresComponent.sectorType;
			if (featuresComponent.ground && featuresComponent.buildingDensity < 6
				 && !hasHazards && type != SectorConstants.SECTOR_TYPE_INDUSTRIAL) {
				return "溪流";
			}
			if (type == SectorConstants.SECTOR_TYPE_SLUM && featuresComponent.damage < 3 && featuresComponent.buildingDensity < 8) {
				return "古老水井";
			}
			if (type != SectorConstants.SECTOR_TYPE_SLUM && type != SectorConstants.SECTOR_TYPE_MAINTENANCE && featuresComponent.wear < 5 && featuresComponent.damage < 3) {
				return "饮水器";
			}
			if (featuresComponent.wear > 6 || featuresComponent.damage > 3) {
				return "漏水管道";
			}
			
			return "水塔";
		},
		
		getEnemyText: function (enemyList, sectorControlComponent) {
			let result = "";
			var enemyActiveV = this.getEnemyActiveVerb(enemyList);
			var enemyNounSector = this.getEnemyNoun(enemyList, true, true);
			result += enemyActiveV + " " + enemyNounSector;
			return result;
		},
		
		getEnemyNoun: function (enemyList, detailed, pluralify) {
			var baseNoun = this.getCommonText(enemyList, "nouns", detailed ? "name" : "", "某人或某物", true, pluralify);
			if (detailed) {
				return baseNoun;
			} else {
				var parts = baseNoun.split(" ");
				return parts[parts.length - 1];
			}
		},
		
		getEnemyGroupNoun: function (enemyList) {
			return this.getCommonText(enemyList, "groupN", "", "群体", false)
		},
		
		getEnemyActiveVerb: function(enemyList) {
			return this.getCommonText(enemyList, "activeV", "", "被占据", false);
		},
		
		getEnemeyDefeatedVerb: function (enemyList) {
			return this.getCommonText(enemyList, "defeatedV", "", "已击败", false);
		},
		
		getScaResourcesString: function (discoveredResources, knownResources, resourcesScavengable) {
			var s = "";
			 for(var key in resourceNames) {
				var name = resourceNames[key];
				var amount = resourcesScavengable.getResource(name);
				if (amount > 0 && discoveredResources.indexOf(name) >= 0) {
					var amountDesc = "稀少";
					if (amount == WorldConstants.resourcePrevalence.RARE) amountDesc = "罕见";
					if (amount == WorldConstants.resourcePrevalence.DEFAULT) amountDesc = "稀少";
					if (amount == WorldConstants.resourcePrevalence.COMMON) amountDesc = "常见";
					if (amount == WorldConstants.resourcePrevalence.ABUNDANT) amountDesc = "丰富";
					if (GameConstants.isDebugVersion) amountDesc += " " + Math.round(amount);
					s += key + " (" + amountDesc + "), ";
				} else if (amount > 0 && knownResources.indexOf(name) >= 0) {
					s += key + " (??), ";
				}
			}
			if (s.length > 0) return s.substring(0, s.length - 2);
			else if (resourcesScavengable.getTotal() > 0) return "未知";
			else return "无";
		},
		
		getScaItemString: function (discoveredItems, knownItems, itemsScavengeable) {
			let validItems = [];
			for (let i = 0; i < itemsScavengeable.length; i++) {
				let id = itemsScavengeable[i];
				if (knownItems.indexOf(id) < 0) continue;
				let item = ItemConstants.getItemDefinitionByID(id);
				if (!item) continue;
				let itemName = ItemConstants.getItemDisplayName(item);
				validItems.push(itemName);
			}
			
			if (validItems.length == 0) {
				if (itemsScavengeable.length > 0) {
					return "某种材料";
				} else {
					return "无";
				}
			}
			
			return validItems.join(", ");
		},
		
		getMovementBlockerName: function (blockerVO, gangComponent) {
			switch (blockerVO.type) {
				case MovementConstants.BLOCKER_TYPE_GANG:
					let enemies = this.getAllEnemies(null, gangComponent);
					var groupNoun = this.getEnemyGroupNoun(enemies);
					var enemyNoun = this.getEnemyNoun(enemies);
					return groupNoun + " of " + Text.pluralify(enemyNoun);
				default:
					return blockerVO.name;
			}
			return "";
		},
		
		getMovementBlockerAction: function (blockerVO, enemiesComponent, gangComponent) {
			switch (blockerVO.type) {
				case MovementConstants.BLOCKER_TYPE_GAP: return "搭建桥梁";
				case MovementConstants.BLOCKER_TYPE_WASTE_TOXIC: return "清理废物";
				case MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE: return "清理废物";
				case MovementConstants.BLOCKER_TYPE_GANG:
					let enemies = this.getAllEnemies(null, gangComponent);
					return "对抗 " + this.getEnemyNoun(enemies, false, true);
				case MovementConstants.BLOCKER_TYPE_TOLL_GATE: return "支付通行费";
			}
		},
		
		getAllEnemies: function (enemiesComponent, gangComponent) {
			let enemies = [];
			if (enemiesComponent && enemiesComponent.possibleEnemies) {
				enemies = enemiesComponent.possibleEnemies.concat();
			}
			if (gangComponent) {
				for (let i = 0; i < gangComponent.enemyIDs.length; i++) {
					var gangEnemy = EnemyConstants.getEnemy(gangComponent.enemyIDs[i]);
					enemies.push(gangEnemy);
				}
			}
			return enemies;
		},
		
		getUnblockedVerb: function (blockerType) {
			switch (blockerType) {
				case MovementConstants.BLOCKER_TYPE_GAP: return "已搭建桥梁";
				case MovementConstants.BLOCKER_TYPE_WASTE_TOXIC: return "已清理";
				case MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE: return "已清理";
				case MovementConstants.BLOCKER_TYPE_GANG: return "已击败";
				case MovementConstants.BLOCKER_TYPE_DEBRIS: return "已清理";
				case MovementConstants.BLOCKER_TYPE_EXPLOSIVES: return "已清理";
				case MovementConstants.BLOCKER_TYPE_TOLL_GATE: return "已支付";
			}
		},
		
		// get common description word for a list of objects that contain possible words are in arrays named objectAttribute
		// if nothing common is found, defaultWord is returned
		// is allowSeveral, two common words can be returned if one doesn't cover all objects
		getCommonText: function (objectList, objectAttribute, objectDetailAttribute, defaultWord, allowSeveral, pluralify) {
			var allWords = [];
			var allDetails = [];
			var minimumWords = [];
			for (var i1 in objectList) {
				var o = objectList[i1];
				if (!o) continue;
				for (var j1 in o[objectAttribute]) {
					var word = o[objectAttribute][j1];
					var detail = objectDetailAttribute ? o[objectDetailAttribute] : "";
					if (!word) continue;
					if ($.inArray(word, allWords) < 0) allWords.push(word);
					if (objectDetailAttribute && $.inArray(detail, allDetails) < 0) allDetails.push(detail);
					if (j1 == 0 && $.inArray(word, minimumWords) < 0) minimumWords.push(word);
				}
			}
			
			var validWords = [];
			for (var i2 in allWords) {
				var word = allWords[i2];
				var valid = true;
					for (var j2 in objectList) {
					var o = objectList[j2];
					if ($.inArray(word, o[objectAttribute]) < 0) valid = false;
				}
				if (valid) validWords.push(word);
			}
			
			var validDetail = "";
			if (objectDetailAttribute) {
			for (var i3 in allDetails) {
				var detail = allDetails[i3];
				var valid = true;
				for (var j3 in objectList) {
					var o = objectList[j3];
					if (o[objectDetailAttribute] != detail) valid = false;
					}
					if (valid) validDetail = detail;
				}
			}
			
			// log.i("getCommonText " + objectAttribute + " | " + validDetail + " | " + validWords.join(",") + " | " + minimumWords.join(",") + " | " + defaultWord);
			// log.i(objectList)
			
			if (validDetail.length > 0) {
				return pluralify ? Text.pluralify(validDetail) : validDetail;
			} else if (validWords.length > 0) {
				return pluralify ? Text.pluralify(validWords[0]) : validWords[0];
			} else if (allowSeveral && minimumWords.length > 1) {
				return pluralify ? (Text.pluralify(minimumWords[0]) + " and " + Text.pluralify(minimumWords[1])) : (minimumWords[0] + " and " + minimumWords[1]);
			} else {
				return defaultWord;
			}
		},
		
		getListText: function (list, max) {
			let textPieceVO = this.getListTextVO(list, max);
			return Text.compose(textPieceVO);
		},

		getListTextVO: function (list, max) {
			let fragments = [];

			if (!list || list.length == 0) {
				fragments.push( { textKey: "ui.common.list_template_zero", textParams: {} } );
			} else if (list.length == 1) {
				fragments.push( { textKey: "ui.common.list_template_one", textParams: { value: list[0] } } );
			} else if (list.length == 2) {
				fragments.push( { textKey: "ui.common.list_template_two", textParams: { value1: list[0], value2: list[1] }});
			} else if (max && list.length > max) {
				// cropped list
				let displayedList = list.slice(0, max);
				let numHiddenItems = list.length - displayedList.length;
				fragments.push( { textKey: "ui.common.list_template_cropped_start" });
				for (let i = 0; i < displayedList.length; i++) {
					if (i > 0) fragments.push( { textKey: "ui.common.list_template_cropped_delimiter" } );
					fragments.push( { textKey: "ui.common.value_simple_template", textParams: { value: displayedList[i] } } );
				}
				fragments.push( { textKey: "ui.common.list_template_cropped_end", textParams: { numCropped: numHiddenItems } })
			} else {
				// regular list
				fragments.push( { textKey: "ui.common.list_template_many_start" });
				for (let i = 0; i < list.length; i++) {
					if (i > 0) fragments.push( { textKey: "ui.common.list_template_many_delimiter" } );
					fragments.push( { textKey: "ui.common.value_simple_template", textParams: { value: list[i] } } );
				}
				fragments.push( { textKey: "ui.common.list_template_many_end" });
			}

			return { textFragments: fragments };
		}
	};
		
	function initSectorTexts() {
		let wildcard = DescriptionMapper.WILDCARD;
		
		let t_R = SectorConstants.SECTOR_TYPE_RESIDENTIAL;
		let t_I = SectorConstants.SECTOR_TYPE_INDUSTRIAL;
		let t_M = SectorConstants.SECTOR_TYPE_MAINTENANCE;
		let t_C = SectorConstants.SECTOR_TYPE_COMMERCIAL;
		let t_P = SectorConstants.SECTOR_TYPE_PUBLIC;
		let t_S = SectorConstants.SECTOR_TYPE_SLUM;
		
		// brackets for values like building density, wear, damage
		let b0 = [0, 0];
		let b1 = [1, 10];
		let bfull = [10, 10];
		let b12 = [0, 5];
		let b22 = [5, 10];
		let b13 = [0, 3];
		let b23 = [4, 6];
		let b33 = [7, 10];
		
		let lmodern = [15, 100];
		let lold = [10, 18];
		
		// TODO add some sunlit sector specific descriptions (can we determine WHY sunlit? edge / hole)
		
		// default descriptions (player has vision)
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "前方是一条 [n-street], 看起来像是一座 [a] [a-building] [n-building]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一条 [a] [a-street] [n-street], 位于两座 [a-building] [n-buildings]之间");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一条 [a] [a-street] [n-street], 位于两座 [n-buildings]之间, 两侧还有一些 [a-building] [n-buildings]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一个 [a] [a-sectortype] [n-street], 有几座 [a-building] [n-buildings]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一个 [a] [a-street] [n-sector], 散落着 [an-items]和 [an-items]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一个 [a] [a-sectortype] [n-street], 到处都是 [an-decos]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一条 [a] [a-street] [n-street], 两旁排列着 [a-building] [n-buildings]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一条 [a] [a-street] [n-street], 周围有一些 [n-buildings]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一条 [a] [a-street] [n-street], 周围是 [a-building] [n-buildings]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一条 [a] [a-street] [n-street], 由一座大型 [n-building]主导");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一个 [a] [a-sectortype] [n-street], 有一些 [an-decos]和 [a-building] [n-buildings]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一条 [a] [a-street] [n-street], 位于几座 [n-buildings]之间");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "这是一个 [a] [a-sectortype] [n-street], 曾经一定是相当 [a-street-past]");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard, level: lold }, "这是一条 [a] [a-street] [n-street], 似乎从灾变前就从未被触及过");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: false }, "在支撑上层的巨大支柱底部有一条 [n-street]");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: false, wear: b12, sunlit: false, debris: b0, campable: false }, "这是一条 [a] [a-street] [n-street], 有几座长期废弃的建筑, 上面覆盖着奇怪的苔藓");
		DescriptionMapper.add("sector-vision", { buildingDensity: b0, isGroundLevel: false }, "这是一个桥梁和通道系统, 连接着下方深不可测的开口周围的几座建筑");
		DescriptionMapper.add("sector-vision", { buildingDensity: b12, isGroundLevel: false, campable: false }, "这是一座 [a] [a-street]桥梁, 横跨下层, 有分开的轨道层、设施层和行人层");
		DescriptionMapper.add("sector-vision", { buildingDensity: b22 }, "这是某种 [a] [a-sectortype]综合体, 有多条狭窄的通道向各个方向延伸");
		DescriptionMapper.add("sector-vision", { buildingDensity: b13 }, "这是一个宽阔的广场, 一侧有一座 [a] [a-building] [n-building], 另一侧似乎是另一座 [a] [a-building] [n-building]的残骸");
		DescriptionMapper.add("sector-vision", { buildingDensity: b23, isSurfaceLevel: false, sunlit: false }, "在一座巨大的 [n-building]下方, 有一条 [a] [a-street] [n-street]");
		DescriptionMapper.add("sector-vision", { buildingDensity: b23, isSurfaceLevel: false }, "这是一条 [n-street], 周围 [a-sectortype]建筑的墙壁上爬满了多层通道");
		DescriptionMapper.add("sector-vision", { buildingDensity: b33 }, "这是某种 [a] [a-sectortype]走廊, 位于两座巨大的 [n-buildings]之间, 空间狭窄得几乎无法通行");
		DescriptionMapper.add("sector-vision", { buildingDensity: b33 }, "这是一条 [a] [a-street] [n-street], 布满了 [a-building] [n-buildings]和 [an-decos], 空间狭窄得几乎无法通过");
		DescriptionMapper.add("sector-vision", { buildingDensity: b33 }, "这是一条 [a] [a-street]小巷, 位于两座 [a-building] [n-buildings]之间");
		DescriptionMapper.add("sector-vision", { wear: b13, sunlit: false, level: lmodern, debris: b0 }, "这是一条 [a] [a-street] [n-street], 位于高大的 [n-buildings]之间, 两旁排列着枯萎的树木, 这些树木直到最近还在人工光下生长旺盛");
		DescriptionMapper.add("sector-vision", { wear: b13, level: lmodern, isSurfaceLevel: false }, "这是一条 [n-street], 位于一些骨架建筑之间, 这些建筑似乎在还在建设中就被遗弃了");
		DescriptionMapper.add("sector-vision", { wear: b23, damage: b0 }, "这是一个曾经的 [n-sector], 依然残留着 [a] [a-street-past]时代的氛围");
		DescriptionMapper.add("sector-vision", { wear: b23, damage: b0 }, "这里曾经是 [a-street-past] [n-sector], 中间有一些 [an-decos]和一座 [a] [a-building] [n-building]");
		DescriptionMapper.add("sector-vision", { wear: b33 }, "这是一座 [a] [a-building]建筑, 其原始用途难以确定, 已被剥蚀至裸露的混凝土结构");
		DescriptionMapper.add("sector-vision", { wear: b33 }, "这是一条 [n-street], 两旁排列着高大狭窄的 [a-sectortype]建筑, 采用已被遗忘的建筑风格, 尽管布满灰尘和磨损, 但仍显色彩斑斓");
		DescriptionMapper.add("sector-vision", { buildingDensity: b22, wear: b33 }, "这是一条 [a] [a-street]走廊, 散落着早已离开的居民留下的垃圾");
		DescriptionMapper.add("sector-vision", { wear: b33, isSurfaceLevel: false }, "这是一条 [a] [a-street] [a-sectortype] [n-street], 几处巨大的、无法辨认的废墟隐约矗立在上方");
		DescriptionMapper.add("sector-vision", { wear: b33 }, "这是一条完全被摧毁的 [a-sectortype] [n-street]");
		DescriptionMapper.add("sector-vision", { wear: b33 }, "这是一条被瓦砾覆盖的 [n-street], 周围环绕着 [a-sectortype]建筑的残垣断壁");
		DescriptionMapper.add("sector-vision", { damage: b22 }, "这是一个曾经的 [a-sectortype]区域, 如今 [n-buildings]和 [n-buildings]都已成为废墟");
		DescriptionMapper.add("sector-vision", { damage: b22 }, "这是一个严重受损的 [n-sector], 中间层的天花板坍塌, 部分阻塞了通道");
		DescriptionMapper.add("sector-vision", { damage: b33 }, "这是一条完全被摧毁的 [a-sectortype] [n-street]");
		DescriptionMapper.add("sector-vision", { damage: b22, buildingDensity: b12 }, "这是一条 [a] [a-street] [n-street], 两侧是被摧毁建筑的空壳");
		DescriptionMapper.add("sector-vision", { damage: b22, buildingDensity: b22 }, "这是一条 [n-street], 布满了瓦砾, 难以通行");
		DescriptionMapper.add("sector-vision", { sectorType: t_R }, "这是一条小型 [n-street], 位于几座 [a-building]公寓楼之间");
		DescriptionMapper.add("sector-vision", { sectorType: t_R, level: lold }, "这是一个历史悠久的住宅区, 有蛛网般的小路和通道连接着 [a-street]庭院和阳台");
		DescriptionMapper.add("sector-vision", { sectorType: t_R, wear: b22, level: lold }, "这是一个被长期废弃的独裁时代居民区, 有高大的混凝土墙和空荡的花坛");
		DescriptionMapper.add("sector-vision", { sectorType: t_R, buildingDensity: b23, isSurfaceLevel: false }, "这是一条 [a-street] [n-street], 沿着一堵巨大的墙壁延伸至上方的分层天花板, 墙壁上点缀着 [a-building]公寓");
		DescriptionMapper.add("sector-vision", { sectorType: t_R, buildingDensity: b12, level: [6, 100] }, "这是一条 [n-street], 两侧是几座完全相同的狭窄住宅楼");
		DescriptionMapper.add("sector-vision", { sectorType: t_R, buildingDensity: b23 }, "这是一条 [n-street], 位于一座 [a-building]住宅楼外, 建筑上有令人眩晕的几何图案阳台");
		DescriptionMapper.add("sector-vision", { sectorType: t_R, level: lmodern }, "这是一个广场, 周围环绕着曾经一定相当舒适的公寓楼");
		DescriptionMapper.add("sector-vision", { sectorType: t_R, level: lmodern }, "这是一条看起来像 [a-street]的住宅走廊, 建筑上装饰着假窗户");
		DescriptionMapper.add("sector-vision", { sectorType: t_I }, "这是一条街道, 位于一座巨大的 [a-building]工业综合体外");
		DescriptionMapper.add("sector-vision", { sectorType: t_I }, "这是一条沿着有顶棚的火车轨道延伸的街道");
		DescriptionMapper.add("sector-vision", { sectorType: t_I, wear: b13 }, "这是一条 [a-street]小径, 穿过一个现代化工业区, 该区域直到最近一定还在使用");
		DescriptionMapper.add("sector-vision", { sectorType: t_I, buildingDensity: b13 }, "这是一个空旷的广场, 有一些损坏的集装箱和巨大的生锈机械臂");
		DescriptionMapper.add("sector-vision", { sectorType: t_I, buildingDensity: b23 }, "这是一条 [a] [n-street], 位于两个看起来像 [a-building]控制室和办公室的街区之间");
		DescriptionMapper.add("sector-vision", { sectorType: t_M }, "这是一条 [a] [a-street] [n-street], 位于 [a] [n-building]后面, 低矮的天花板上纵横交错着旧电线和管道");
		DescriptionMapper.add("sector-vision", { sectorType: t_M, buildingDensity: b22 }, "这是一条尘土飞扬、无名的走廊, 连接着城市中的一些地方");
		DescriptionMapper.add("sector-vision", { sectorType: t_M, buildingDensity: b22, damage:b22 }, "这是一条受损的维修走廊, 两侧是断裂的电缆, 就像金属内脏一样");
		DescriptionMapper.add("sector-vision", { sectorType: t_M }, "这是一条荒凉的 [n-street], 布满了破碎的电缆系统和维修管道的残骸");
		DescriptionMapper.add("sector-vision", { sectorType: t_M, isSurfaceLevel: false }, "这是一条被淹没的通道, 位于一座巨大桥梁下方, 远处隐约可见 [a-building]建筑");
		DescriptionMapper.add("sector-vision", { sectorType: t_M }, "这是一个被遗忘的空间, 位于机器运行的城市设施之间, 光滑的表面只有管道和管线打破了单调");
		DescriptionMapper.add("sector-vision", { sectorType: t_M, level: lold, buildingDensity: b13 }, "这是一个宽敞的广场, 中央有一个控制室, 老旧的电缆系统线路向各个方向延伸消失");
		DescriptionMapper.add("sector-vision", { sectorType: t_M, buildingDensity: b33 }, "管道和导管的密集网络, 隐藏在为人类设计的空间之间");
		DescriptionMapper.add("sector-vision", { sectorType: t_C }, "这是一条 [a] [a-street]购物街, 有各种商店和咖啡馆的遗迹");
		DescriptionMapper.add("sector-vision", { sectorType: t_C }, "这是一条 [n-street], 位于一些商业建筑之间, 它们的 [a-building]墙壁上覆盖着拼贴的黑屏");
		DescriptionMapper.add("sector-vision", { sectorType: t_C }, "这是一条商业街道, 有许多小商店, 这些商店似乎最近被洗劫过");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, wear: b12 }, "这是一条 [a-street] [n-street], 多层空间挤满了小商店、广告牌和售货亭");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b12, isSurfaceLevel: false }, "这是一条 [a] [n-street], 建筑像巨大的钟乳石一样附着在层级的天花板上");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b12, isSurfaceLevel: false }, "这是一个围绕着巨大雕像建造的广场, 四周环绕着 [a-building]商店门面");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b13 }, "这是一个位于高架建筑下的广场, 中央曾经一定有一个瀑布");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b13 }, "这是一个宽阔的围栏露台, 连接着一座巨大的塔楼, 可以俯瞰下方的 [a-street]街道");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b13 }, "这是一个圆形庭院, 被一座 [a-building]办公楼包围");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b22, wear: b33 }, "这是一座 [a] [a-building]建筑, 其原始用途难以确定, 已被剥蚀至混凝土结构, 中央有一个令人印象深刻的螺旋楼梯");
		DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b22, level: lmodern }, "这是一条 [a-street]商业隧道, 其石墨烯墙壁上点缀着失效的标志");
		DescriptionMapper.add("sector-vision", { sectorType: t_P }, "这是一条 [a] [n-street], 被一座巨大的建筑所主导, 这座建筑看起来曾经是某种公共设施");
		DescriptionMapper.add("sector-vision", { sectorType: t_P }, "这是一段废弃的高速公路, 路边有一些较小的建筑" );
		DescriptionMapper.add("sector-vision", { sectorType: t_P, level: lold, buildingDensity: b12 }, "这是一个圆形的公共广场, 有一个失效的喷泉, 曾经一定是一个宜人的花园" );
		DescriptionMapper.add("sector-vision", { sectorType: t_P, level: lmodern, buildingDensity: b12 }, "这是一个公共广场, 最近似乎有人搭建了临时营地, 但后来又被遗弃了" );
		DescriptionMapper.add("sector-vision", { sectorType: t_P, level: lmodern, damage: b12 }, "这是一个标准的政府办公区, 有清晰的标志、大门和接待区, 同时给人一种既热情又缺乏人性的感觉" );
		DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b12 }, "这是一条 [a] [a-street] [n-street], 被一排庄严的雕像所主导" );
		DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b12, wear: b22 }, "这是一个装饰性的大厅, 似乎曾经是一个大型车站, 有圆顶屋顶、巨大的吊灯和两侧的小摊位" );
		DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b13 }, "这是一片开阔空间, 看起来曾经可能是专门用于某种运动的场所");
		DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b33}, "这是一条 [a] [a-street] [n-street], 位于两座巨大的 [n-buildings]之间, 空间狭窄得几乎无法通过");
		DescriptionMapper.add("sector-vision", { sectorType: t_S  }, "这是一群小型 [a-building]住宅, 已用不同材料扩建和修补");
		DescriptionMapper.add("sector-vision", { sectorType: t_S, buildingDensity: b33, wear: b22 }, "这是一条 [a] [a-street] [n-street], 被 [a-building]住宅环绕 (部分被覆盖) , 这些住宅已被遗弃一段时间");
		DescriptionMapper.add("sector-vision", { sectorType: t_S, buildingDensity: b13 }, "这是一个宽阔的广场, 其墙壁上支撑着一些临时搭建的棚屋");
		DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b13 }, "这是一个巨大的大厅, 看起来曾经被用作某种存储区域, 天花板上有生锈的自动化机械臂");
		DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b23 }, "这是一条 [a] [a-street]通道, 位于两个已失效、被围墙隔开的核反应堆之间");
		DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b23 }, "这是一条 [a] [a-street] [n-street], 位于一座巨大的工业处理综合体外, 所有入口都紧紧关闭");
		DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b33 }, "这是一条 [a] [a-street]通道, 似乎曾经用于在该层的各种设施之间运输货物");
		DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b33 }, "这是一条 [a] [a-sectortype]走廊, 曾经一定很干净, 但现在到处都是碎片");
		DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b33 }, "这是一条有窗户的走廊, 位于一个核设施废墟的上方");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13 }, "这是城市下方一片广阔的开放空间, 泥土、草地和其他植物从混凝土地板的裂缝中钻出来");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13 }, "这是一个古老的广场, 早已被遗忘, 两侧有巨大的柱子支撑着上方的城市");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13 }, "这是一片开放空间, 可能曾经是一个公园, 现在被奇怪的植物和蘑菇所占据");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13, sectorType: t_R }, "这是一条曾经繁华的 [a-street], 两旁排列着现代化住宅楼, 现在都已荒废");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b23 }, "这是一条 [a] [a-street]街道, 位于正在崩塌的古老 [a-sectortype]建筑之间");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b23 }, "这是一条没有天花板的开放街道, 城市的上一层高高悬在上方, 两侧是废墟");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b33 }, "这是一条穿过古老建筑的通道");
		DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b33 }, "这是一条狭窄的街道, 路面已开裂");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b13 }, "这是一个曾经 [a-street-past]的广场, 周围环绕着玻璃穹顶通道和小商店门面");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b13 }, "这是一条宽阔的 [n-street], 风吹动着周围的碎片");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b13, sectorType: t_P }, "这是一个大广场, 中央是一座华丽的公共建筑");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b23 }, "这是一条 [a-street]街道, 点缀着广告牌和黑屏, 周围环绕着高楼大厦");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b23 }, "这是一条暴露在外的街道, 两侧是高楼大厦, 被强风阵阵撼动");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b23 }, "这是一条多层街道, 下方有供电车行驶的空间, 再下方是行人道和小商店");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b33 }, "这是一条 [a] [a-street] [n-street], 位于高大华丽的 [n-buildings]之间");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b33 }, "这是一条 [a] [a-street]通道, 位于曾经的两个购物中心之间");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b33 }, "这是一条 [a] [a-street] [n-street], 狭窄的通道中狂风不断呼啸");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, sectorType: t_C }, "这是一条 [a] [a-street] [n-street], 位于曾经的两个购物中心之间");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, sectorType: t_C }, "这是一座宏伟的购物中心, 看起来曾经满是销售奢侈品的商店");
		DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, sectorType: t_I }, "这是一条 [a] [a-street], 两侧是宏伟的办公楼");
		DescriptionMapper.add("sector-vision", { debris: b22 }, "这是一条 [n-street], 满是瓦砾");
		DescriptionMapper.add("sector-vision", { debris: b22, sectorType: t_R }, "这是一条 [a] [n-street], 两侧是几座完全被摧毁的住宅楼");
		DescriptionMapper.add("sector-vision", { flooded: b1, level: lmodern, sectorType: t_R }, "这是一个被淹没的 [n-sector], 有匆忙撤离的迹象");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard, radiation: b1 }, "这是一个普通的 [n-sector], 早在大灾变前就因辐射而被废弃");
		DescriptionMapper.add("sector-vision", { sectorType: wildcard, poison: b1 }, "这是一个 [a-street] [n-sector], 被废弃且幽灵般, 因污染而任其腐烂");

		// descriptions when player has no vision (lamp/sunglasses)
		DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b0 }, "城市中罕见的空旷空间; 没有地板或墙壁, 没有建筑物, 什么都没有只有广阔的黑暗虚空");
		DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b13 }, "一条宽阔的街道或走廊在这片广阔的黑暗中很难找到任何东西");
		DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b23, wear: b22 }, "一条带有废弃气息的街道或走廊细节在黑暗中模糊不清");
		DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b23, wear: b12 }, "一条安静的街道或走廊细节在黑暗中模糊不清");
		DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b33 }, "一条狭窄的通道, 仅够勉强行走你在黑暗中摸索前进");
		DescriptionMapper.add("sector-novision", { sunlit: false }, "城市中的一片空间, 隐藏在黑暗之中");
		DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b0 }, "城市中罕见的空旷空间; 没有地板或墙壁, 没有建筑物, 什么都没有只有广阔的虚空");
		DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b13 }, "一条宽阔的街道或走廊在刺眼的阳光下很难找到任何东西");
		DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b23, wear: b22 }, "一条带有废弃气息的街道或走廊细节在刺眼的光线中模糊不清");
		DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b23, wear: b12 }, "一条安静的街道或走廊细节在阳光下模糊不清");
		DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b33 }, "一条狭窄的通道, 仅够勉强行走你在刺眼的光线中摸索前进");
		DescriptionMapper.add("sector-novision", { sunlit: true }, "城市中的一片空间, 在刺眼的光线中显得模糊不清");
	}
	
	function initWaymarkTexts() {
		var wildcard = DescriptionMapper.WILDCARD;
		
		var t_R = SectorConstants.SECTOR_TYPE_RESIDENTIAL;
		var t_I = SectorConstants.SECTOR_TYPE_INDUSTRIAL;
		var t_M = SectorConstants.SECTOR_TYPE_MAINTENANCE;
		var t_C = SectorConstants.SECTOR_TYPE_COMMERCIAL;
		var t_P = SectorConstants.SECTOR_TYPE_PUBLIC;
		var t_S = SectorConstants.SECTOR_TYPE_SLUM;
		
		var wt_C = SectorConstants.WAYMARK_TYPE_CAMP;
		var wt_W = SectorConstants.WAYMARK_TYPE_SPRING;
		var wt_P = SectorConstants.WAYMARK_TYPE_POLLUTION;
		var wt_R = SectorConstants.WAYMARK_TYPE_RADIATION;
		var wt_S = SectorConstants.WAYMARK_TYPE_SETTLEMENT;
		
		// brackets for values like building density, wear, damage
		var b0 = [0, 0];
		var b12 = [0, 5];
		var b22 = [5, 10];
		
		var lt1 = [ 0, 0.999 ];
		var gte1 = [ 1, 100 ];
		
		DescriptionMapper.add("waymark", { sectorType: wildcard }, "在通往 [direction]方向的走廊旁的墙上, 画着一个大大的 [n-target]符号");
		DescriptionMapper.add("waymark", { sectorType: wildcard }, "有一处涂鸦, 写着 [n-target]字样, 并带有一个指向 [direction]的箭头");
		DescriptionMapper.add("waymark", { buildingDensity: b12 }, "一些砖块被排列成指向 [direction]的箭头形状, 还有一个粗略的符号, 可能表示 [n-target]");
		DescriptionMapper.add("waymark", { waymarkType: wt_C }, "你发现几处涂鸦, 上面有指向 [direction]的箭头, 还有'安全'和'避难所'之类的字样");
		DescriptionMapper.add("waymark", { waymarkType: wt_R }, "朝向 [direction]方向走时, 墙上有多个骷髅标志");
		DescriptionMapper.add("waymark", { waymarkType: wt_P }, "朝向 [direction]方向走时, 墙上有多个骷髅标志");
		DescriptionMapper.add("waymark", { waymarkType: wt_S }, "在通往 [direction]方向的通道旁的墙上, 有一块金属牌匾, 上面写着'[n-settlement-name]'");
		DescriptionMapper.add("waymark", { waymarkType: wt_W }, "街道上画着一个蓝色箭头, 指向 [direction]方向");
		DescriptionMapper.add("waymark", { sectorType: t_C }, "一个商店广告牌被覆盖重绘, 上面有一个指向 [direction]的箭头和 [n-target]字样");
		DescriptionMapper.add("waymark", { sectorType: t_I }, "一个带方向指示的路牌被覆盖重绘朝向 [direction]方向写着 [n-target]");
		DescriptionMapper.add("waymark", { sectorType: t_M }, "天花板附近的管道上画着箭头其中一个指向 [direction]的箭头旁有 [n-target]的符号");
		DescriptionMapper.add("waymark", { sectorType: t_P }, "一座雕像手中拿着一个简陋的牌子, 上面写着往 [direction]方向有 [n-target]");
		DescriptionMapper.add("waymark", { sectorType: t_S }, "有几张破旧的海报, 指示往 [direction]方向有 [n-target]");
	}
	
	function initBookTexts() {
		var wildcard = DescriptionMapper.WILDCARD;
		
		let t_S = ItemConstants.bookTypes.science;
		let t_F = ItemConstants.bookTypes.fiction;
		let t_H = ItemConstants.bookTypes.history;
		let t_E = ItemConstants.bookTypes.engineering;
		
		let l_1 = 1;
		let l_2 = 2;
		let l_3 = 3;
		
		DescriptionMapper.add("book-intro", { bookType: wildcard }, "你阅读了这本书");
		DescriptionMapper.add("book-intro", { bookLevel: l_1 }, "你快速翻阅了这本书");
		DescriptionMapper.add("book-intro", { bookLevel: l_2 }, "你仔细研读了这本书");
		DescriptionMapper.add("book-intro", { bookLevel: l_3 }, "你花了些时间研读这本书");
		DescriptionMapper.add("book-intro", { bookType: t_S }, "你仔细研读了这本书");
		DescriptionMapper.add("book-intro", { bookType: t_F }, "你查阅了这本书");
		DescriptionMapper.add("book-intro", { bookType: t_H }, "你仔细研读了这本书");
		DescriptionMapper.add("book-intro", { bookType: t_H }, "你快速浏览了这本书");
		DescriptionMapper.add("book-intro", { bookType: t_E }, "你仔细研读了这本书");
		
		DescriptionMapper.add("book-description", { bookType: wildcard }, "一段描述 [n-topic]的内容引起了你的注意");
		DescriptionMapper.add("book-description", { bookType: wildcard }, "描述 [n-topic]的章节看起来很有趣");
		DescriptionMapper.add("book-description", { bookType: wildcard }, "你学到了一些关于 [n-topic]的知识");
		DescriptionMapper.add("book-description", { bookType: wildcard }, "这本书相当 [a-bad], 但你还是学到了一些东西");
		
		DescriptionMapper.add("book-description", { bookLevel: l_1 }, "它让你对 [n-topic]有了一些了解");
		DescriptionMapper.add("book-description", { bookLevel: l_2 }, "它似乎是关于 [n-topic]的良好资料来源");
		DescriptionMapper.add("book-description", { bookLevel: l_3 }, "这本书不容易理解, 但教会了你很多关于 [n-topic]的知识");
		DescriptionMapper.add("book-description", { bookLevel: l_3 }, "它详细描述了 [c-fact]的过程");
		DescriptionMapper.add("book-description", { bookLevel: l_3 }, "它详细描述了 [n-topic]");
		
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本烹饪书, 其中大部分内容与当今可用的食材无关");
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于 [n-topic]的 [a] [a-level]教科书");
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于 [n-topic]的 [a] [a-style]教科书");
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于 [n-topic]的 [a] [a-good]教科书");
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于 [n-topic]的 [a] [a-bad]教科书, 但你还是学到了一些新知识");
		DescriptionMapper.add("book-description", { bookType: t_S }, "它描述了 [n-topic]");
		DescriptionMapper.add("book-description", { bookType: t_S }, "书中有几处关于 [n-topic]的有趣章节");
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于 [n-topic]的相当枯燥的文本");
		DescriptionMapper.add("book-description", { bookType: t_S }, "它包含对 [n-topic]的描述");
		DescriptionMapper.add("book-description", { bookType: t_S }, "你了解到 [c-fact]");
		DescriptionMapper.add("book-description", { bookType: t_S }, "你发现 [c-fact]");
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本基辅语语法书");
		DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本汉萨语及其多种方言的语法书");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "这是一本关于 [n-topic]的入门读物");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "这是一本关于 [n-topic]的 [a] [a-bad]书籍");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "这是一本侦察兵手册");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "它包含一些关于 [n-topic]的基本信息");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "一段关于提炼过程的描述提供了关于大灾变前常用建筑材料的线索");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "它包含一份'黑暗层级'中已知动物生命的目录你认出了其中几种");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "你注意到一些关于每天接触阳光与不接触阳光人群的旧人口普查数据");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "它包含一个你不熟悉的基于太阳的历法系统的详细描述");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "你找到了关于 [n-topic]的详细信息");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "它包含关于 [n-topic]的详细信息");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "这是一本幸存者食谱, 包含一些有用的提示");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "这是一本探讨将城市扩展至海洋的可能性的旧书");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "你被一段关于地面上丰富植物生命的描述深深吸引");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "有大量关于 [n-topic]的信息");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "它包含一篇关于 [n-topic]的学术论文");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "它包含关于 [n-topic]的深入信息");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "这是一本关于实验室培养肉类与饲养动物的伦理探讨");
		DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "它探讨了在城市外重新开始人类生活的理论可能性, 并得出结论认为这几乎是不可能的");
		
		DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于 [n-topic]的 [a] [a-level]教科书");
		DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于 [n-topic]的 [a] [a-style]教科书");
		DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于 [n-topic]的 [a] [a-good]教科书");
		DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于 [n-topic]的 [a] [a-bad]教科书, 但你还是学到了一些新知识");
		DescriptionMapper.add("book-description", { bookType: t_E }, "有一些关于 [n-object]的废弃计划");
		DescriptionMapper.add("book-description", { bookType: t_E }, "它包含对 [n-object]的详细描述");
		DescriptionMapper.add("book-description", { bookType: t_E }, "有一张详细解释 [n-object]工作原理的图表");
		DescriptionMapper.add("book-description", { bookType: t_E }, "这是 [n-object]的操作手册");
		DescriptionMapper.add("book-description", { bookType: t_E }, "你学到了很多关于 [n-object]如何工作的知识");
		DescriptionMapper.add("book-description", { bookType: t_E }, "你了解到 [c-fact]");
		DescriptionMapper.add("book-description", { bookType: t_S }, "你发现 [c-fact]");
		DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_1 }, "有一张关于 [n-object]的有趣图表");
		DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_1 }, "它包含一些关于 [n-topic]的基本信息");
		DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_2 }, "它包含许多关于 [n-topic]的有用信息");
		DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_2 }, "它包含关于 [n-topic]的详细信息");
		DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_3 }, "有 [n-object]的技术图纸");
		DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_3 }, "它包含关于 [n-topic]的深入信息");
		DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_3 }, "这是一本关于机器人权利与义务以及编程行为规则的法律书籍");
		
		DescriptionMapper.add("book-description", { bookType: t_H }, "你找到了关于 [n-topic]的详细信息");
		DescriptionMapper.add("book-description", { bookType: t_H }, "它描述了 [n-topic]");
		DescriptionMapper.add("book-description", { bookType: t_H }, "它描述了 [c-event]");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这是一本关于 [n-topic]的相当枯燥的文本");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这是关于 [n-topic]的 [a] [a-style]概述");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这是关于 [n-topic]的非常 [a-level]的介绍");
		DescriptionMapper.add("book-description", { bookType: t_H }, "你了解到 [c-fact]");
		DescriptionMapper.add("book-description", { bookType: t_H }, "似乎 [c-fact]");
		DescriptionMapper.add("book-description", { bookType: t_H }, "你了解到 [c-event]");
		DescriptionMapper.add("book-description", { bookType: t_H }, "它描述了导致城市形成的爆炸性城市化过程");
		DescriptionMapper.add("book-description", { bookType: t_H }, "有关于 [c-event]的 [a] [a-style]章节");
		DescriptionMapper.add("book-description", { bookType: t_H }, "关于 [c-event]的一节引起了你的注意");
		DescriptionMapper.add("book-description", { bookType: t_H }, "有几处提到 [c-event]的地方");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这是对 [n-topic]的 [a]非常 [a-good]的解释");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这本书总体上很枯燥, 但有关于 [n-topic]的 [a] [a-good]章节");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这是关于顿巴利斯姆的历史, 这是一种在城市历史上一直流行的一神教");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这是关于乌古尔教的历史, 这是一种相当新的宗教, 融合了悲观的世界末日精神主义和将城市视为有感知实体的崇拜");
		DescriptionMapper.add("book-description", { bookType: t_H }, "书中提到城市的\"当前无人居住区域\", 提供了对大灾变前城市的一种视角");
		DescriptionMapper.add("book-description", { bookType: t_H }, "这是一本旧书, 预测由于移民和医学突破, 城市将出现巨大的人口爆炸");
		DescriptionMapper.add("book-description", { bookType: t_H }, "它描述了独裁时代, 它如何从乌托邦崛起, 与西方政府开战, 最终因叛乱而崩溃");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是关于 [n-topic]的入门文本");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是一位著名运动员的自传");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "它提到了 [c-event]");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "它讨论了 [c-event]");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "它讨论了城市的乌托邦根源, 以及它最初是如何建造和想象的");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是对一个宗教团体慈善工作的偏见性阐述");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是政府编写的城市历史教科书, 强调阶级差异和团结的重要性");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是一本关于城市最早层次建筑的艺术书籍, 有着古雅的窗户、通风设施和绿植");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是对卡尔博克建筑风格的概述, 作者认为它因为与独裁时代的联系而不公正地不受欢迎");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是对城邦建筑的颂歌");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_2 }, "有关于 [c-event]的长篇章节");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_2 }, "这是关于核武器使用的历史, 描述了城市首次对外部文明使用核武器, 然后是城市内部一个城邦对另一个城邦的第二次使用");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_2 }, "这是对 [n-topic]的详细探索");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_2 }, "它讨论了原始城市政府分裂为城市内多个城邦的过程, 以及它们的繁荣、战争和崩溃");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_2 }, "它讨论了城市外星球人口的逐渐减少, 首先是由经济驱动, 然后是污染, 最后是洪水");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_3 }, "你找到了关于 [c-event]的大量信息");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_3 }, "你找到了关于 [n-topic]的大量信息");
		DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_3 }, "你找到了 [c-event]的详细时间线");
		
		DescriptionMapper.add("book-description", { bookType: t_F }, "有一个关于 [c-theme]的 [a] [a-good]故事");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于 [c-theme]的故事");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是关于 [c-theme]的");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于 [n-topic]的故事");
		DescriptionMapper.add("book-description", { bookType: t_F }, "一个关于 [c-theme]的故事留在了你的脑海中");
		DescriptionMapper.add("book-description", { bookType: t_F }, "你被一首关于 [c-theme]的诗所打动");
		DescriptionMapper.add("book-description", { bookType: t_F }, "它包含对 [c-theme]的 [a] [a-good]描述");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是一本关于 [n-topic]的 [a] [a-style]小说");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于 [n-topic]的 [a] [a-style]故事");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是对 [n-topic]的非常 [a-style]的描绘");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于 [n-topic]的 [a] [a-style]故事");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是一本关于 [n-topic]的 [a-style]短篇小说集");
		DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于 [n-topic]的 [a] [a-style]且 [a-good]的故事");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_1 }, "这是一本以 [n-topic]为主题的儿童读物");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_1 }, "这是一个关于 [c-theme]的简单故事");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_1 }, "它似乎是针对学龄儿童的");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_2 }, "这是一本关于 [n-topic]的经典小说");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_2 }, "这是一本关于 [c-theme]的 [a-style]小说");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_2 }, "这是一个以大叛乱时期为背景的 [a-style]故事");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_3 }, "这是一本关于 [n-topic]的相当厚重的书籍");
		DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_3 }, "这是一个关于 [c-theme]的 [a-good]故事");
	}
	
	function initNewspaperTexts() {
		var wildcard = DescriptionMapper.WILDCARD;
		
		let l_1 = 1;
		let l_2 = 2;
		let l_3 = 3;
		
		DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "有一篇关于 [n-topic]的社论");
		DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "有一篇关于 [n-topic]的评论文章");
		DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "有一篇关于 [c-event]的重大报道");
		DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "这一期报纸主要围绕 [c-event]展开");
		DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "根据报纸内容,  [c-fact]");
		DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "与谣言相反,  [c-fact]");
		DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "这是一个关于某个定居点被机械蝗虫群困扰的故事, 这些蝗虫每次出现都会摧毁所有物资, 包括建筑材料");
		DescriptionMapper.add("newspaper-description", { itemLevel: l_2 }, "它包含了一些据称是目睹过大灾变的幸存者的故事, 这些故事各不相同");
		DescriptionMapper.add("newspaper-description", { itemLevel: l_3 }, "有一篇关于 [n-topic]的调查报道");
	}
	
	function initResearchPaperTexts() {
		var wildcard = DescriptionMapper.WILDCARD;
		
		let l_1 = 1;
		let l_2 = 2;
		let l_3 = 3;
		
		DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "这是关于 [n-topic]的");
		DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "你了解到 [c-fact]");
		DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "你推断出 [c-fact]");
		DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "似乎 [c-fact]");
		DescriptionMapper.add("researchpaper-description", { itemLevel: l_1 }, "这是对 [n-topic]的基本概述");
		DescriptionMapper.add("researchpaper-description", { itemLevel: l_2 }, "这是 [n-topic]的大纲");
		DescriptionMapper.add("researchpaper-description", { itemLevel: l_3 }, "这是对 [n-topic]的详细分析");
	}
	
	initSectorTexts();
	initWaymarkTexts();
	initBookTexts();
	initNewspaperTexts();
	initResearchPaperTexts();
	
	return TextConstants;
	
});
