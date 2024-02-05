define(['ash', 'json!game/data/UpgradeData.json', 'game/constants/PlayerActionConstants', 'game/constants/WorldConstants', 'game/vos/UpgradeVO'],
function (Ash, UpgradeData, PlayerActionConstants, WorldConstants, UpgradeVO) {
	
	let UpgradeConstants = {
		
		BLUEPRINT_BRACKET_EARLY: "b-early",
		BLUEPRINT_BRACKET_LATE: "b-late",
		
		UPGRADE_TYPE_RUMOURS: "rumours",
		UPGRADE_TYPE_FAVOUR: "favour",
		UPGRADE_TYPE_EVIDENCE: "evidence",
		UPGRADE_TYPE_INSIGHT: "insight",

		upgradeStatus: {
			HIDDEN: "HIDDEN",
			BLUEPRINT_IN_PROGRESS: "BLUEPRINT_IN_PROGRESS",
			BLUEPRINT_USABLE: "BLUEPRINT_USABLE", 
			VISIBLE_HINT: "VISIBLE_HINT",
			VISIBLE_FULL: "VISIBLE_FULL",
			UNLOCKABLE: "UNLOCKABLE", 
			UNLOCKED: "UNLOCKED", 
		},

		upgradeDefinitions: {},
		
		upgradeUIEffects: {
			calendar: "calendar",
		},
		
		unlockingUpgradesByWorker: {},
		unlockingUpgradesByUIEffect: {},
		improvingUpgradesByImprovement: {},
		improvingUpgradesByWorker: {},
		improvingUpgradesByEvent: {},
		
		// camp ordinal > a list of blueprints, first array is early, second is late, third is blueprints that can appear on campless levels
		blueprintsByCampOrdinal: {},
		
		upgradeDescriptions: {
				unlock_item_clothing_body_15: "增强型衣物，能够抵御最恶劣的环境。",
			unlock_item_clothing_over_15: "现代化的装甲，灵感来源于军用自动机器人。",
			unlock_item_weapon_15: "制作最致命武器的知识。",
			unlock_building_spaceship1: "殖民太空船船壳的设计，可以离开这个星球并远行。",
			unlock_building_spaceship2: "殖民太空船的防护罩，可以保护它免受太空危险。",
			unlock_building_spaceship3: "支持殖民船上生命在长时间内生存所需的技术。",
			unlock_item_bag_4: "制作更好背包的皮革工艺。",
			improve_building_market3: "部分恢复据说曾覆盖整个城市的网络。",
			improve_building_cementmill: "新的水泥混合物，用于制造更强的混凝土。",
			unlock_building_researchcenter: "生成新知识的地方，而不仅仅是收集和归档旧知识。",
			unlock_item_weapon_14: "将武器和战斗提升到新的破坏性水平。",
			unlock_item_clothing_head_5: "制作严肃头盔的艺术。",
			improve_building_apothecary: "重新发现现代技术，用于预防和治疗疾病。",
			unlock_item_weapon_13: "解锁新类别的致命武器。",
			unlock_building_radio: "建造无线电塔以提高你的文明声誉。",
			unlock_building_robots: "建造可以帮助工人更有效地完成工作的机器人。",
			improve_building_hospital: "修复人体的复杂程序。",
			unlock_item_clothing_body_13: "更好地利用蜘蛛丝和回收材料。",
			unlock_item_weapon_12: "一种强大的火器，近距离尤其破坏力强大。",
			unlock_item_scavenger_gear: "改进旧设计的新技术。",
			improve_worker_chemist_2: "重新发现物质和化学反应的研究。",
			unlock_item_clothing_upper_4: "",
			improve_building_shrine: "寻找答案的另一种方式。",
			unlock_item_weapon_11: "改良的战斧。",
			unlock_item_clothing6: "改进现有探索服装的技术",
			improve_building_storage2: "通过控制温度来改进存储。",
			improve_building_fortification_2: "更好的防御工事",
			unlock_item_clothing3h: "保护探险者安全的好手套",
			unlock_item_clothing4he: "对环境危害的防护",
			unlock_item_bag_3: "制作更好的背包。",
			unlock_item_weapon_10: "一把枪，允许使用者在不重新装弹的情况下发射多发子弹。",
			unlock_building_aqueduct: "把早已废弃的水资源设施转化为更有效的储水及运水措施",
			unlock_item_clothing4: "基本的防护服装，可以在战斗中占据优势。",
			improve_building_library2: "增长新知识的有组织方法",
			unlock_building_apothecary: "制作草药的基本知识。",
			improve_worker_trapper_2: "腌制、烟熏和腌制食物使其更持久。",
			unlock_building_barracks: "一群经过专业训练保护营地的工人",
			improve_building_campfire_1: "将营火变成定居点的骄傲。",
			improve_building_inn: "另一种提升精神和团结群体的有用方式。",
			improve_building_market2: "通过使用更轻便的货币进一步改善贸易，这使得货币更容易携带。",
			unlock_item_weapon_8: "更好的金属加工技术允许制作更好的武器和更多的工具。",
			unlock_item_clothing5: "将新的金属加工技术用于保护。",
			unlock_item_clothing3: "提供基本保护的标准化服装。",
			improve_building_stable: "管理更大的商队，可以携带更多的货物",
			unlock_item_clothing_hands_25: "手套是拾荒者的好伴侣",
			improve_building_storage1: "让别的动物远离食物和建材, 使得仓库更高效",
			unlock_building_passage_hole: "在没有现有楼梯或电梯的情况下，可以建造通道以跨越楼层。",
			unlock_building_house2: "回收可以容纳更多人的塔楼。",
			unlock_building_smithy: "铁匠可以将废金属转化为工具和武器。",
			unlock_item_bag_2: "为探险者制作更好的背包。",
			unlock_item_weapon_6: "由相当简单的材料制成的致命远程武器。",
			unlock_item_firstaid: "随时治疗伤口。",
			improve_building_market: "通用的交换媒介使交易更高效。",
			improve_worker_water_2: "大规模过滤和消毒饮用水的技术，允许使用更多的水源。",
			unlock_building_cementmill: "解锁混凝土的生产，这是一种强大且通用的建筑材料。",
			unlock_item_clothing4h: "创建和操纵新的、更强的纤维以获得更好的保护和更容易的制造。",
			unlock_building_passage_elevator: "修复可以通往新层的电梯。",
			unlock_item_weapon_5: "为战争制作的武器。",
			unlock_building_bridge: "在倒塌的区域上建造桥梁。",
			improve_building_library: "对知识收集和保存的更系统化的方法。将来会启用更专业的工人。",
			unlock_building_lights: "一旦有了灯，营地中的黑暗将一去不复返。",
			unlock_item_weapon_4: "古老但有效的武器。",
			improve_worker_scavenger_2: "处理技术，允许回收以前居民遗留下来的更多金属。",
			improve_worker_scavenger_4: "利用以前的文明留下的最先进的材料",
			unlock_building_stable: "前往其他派系交易商品。",
			unlock_building_library: "集中努力建立和储存知识。",
			unlock_building_inn: "有时旅行者会经过营地。也许我们可以为他们提供一个睡觉的地方？",
			unlock_building_market: "与外界营地和合作社的人贸易",
			unlock_building_fortifications: "这些建筑让不速之客远离",
			unlock_building_fortifications2: "建造更好的防御工事。",
			unlock_item_bag_1: "制作耐用物品的皮革工艺。",
			unlock_item_weapon_2: "比短剑稍微可靠一些。",
			unlock_clothing_basic: "制作基本服装的技术。",
			unlock_clothing_warm: "制作纺织品的新方法。",
			unlock_building_darkfarm: "食物的替代来源。",
			unlock_building_tradingpost: "在营地之间建立基本的贸易路线，允许他们分享资源。",
			unlock_item_clothing2: "用布料制作衣服的工艺。",
			unlock_building_passage_staircase: "管理大型建筑项目并建造允许通往不同楼层的结构。",
			unlock_building_hospital: "治疗基本伤害。",
			unlock_worker_rope: "使用清理出的纤维和布料制作绳索，这是有用的建筑和制作材料。",
			unlock_item_shoe1: "利用手头上的东西制作有用物品的技能",
			unlock_action_clear_waste_r: "允许清理环境中的一些放射性废物。",
			unlock_action_clear_waste_t: "允许清理环境中的一些有毒废物。",
			improve_building_temple2: "也许‘神’会接受这些食物, 珠宝, 骨头, 植物和衣服吧",
			improve_building_temple3: "把庙扩展成每个人都可以来冥想的地方",
			unlock_building_greenhouse: "在城市中的一些稀有地点种植草药，那里的条件适合。",
			unlock_item_clothingl14: "防护放射性环境的服装。",
			unlock_building_beacon: "城市中的灯光，使探索变得不那么危险。",
			improve_building_campfire_2: "改善营火，使其成为整个定居点的聚集地。",
			unlock_building_square: "建造一个仅用于休息和社交的空间。",
			unlock_item_clothing_head_27: "用皮革制作更多的东西。",
			improve_building_collector_water_2: "改进水桶并收集更多的水。",
			improve_building_stable_2: "通过带更多的驮兽来提高商队的运载能力",
			improve_building_collector_food_2: "改进陷阱，使其可以收集更多的食物。",
			unlock_building_generator: "建造能为定居点提供电力的简单发电机，提高整体生活质量。",
			improve_worker_cleric_2: "通过共享仪式将社区更紧密地联系在一起",
			improve_worker_cleric_3: "使用经文存储关于精神的知识 - 并允许神职人员证明他们的权威。",
			improve_worker_gardener_2: "培育不同的草药品种以更好地适应新的条件",
			improve_worker_gardener_3: "自动化灌溉系统以增加温室产量",
			improve_worker_rubber_2: "橡胶生产的更好的处理技术",
			improve_worker_rubber_3: "一种新型橡胶，生产更快",
			improve_building_barracks_3: "在军营下设置更多职务以提高效率",
			improve_worker_scavenger_3: "进一步处理回收的金属，使以前无法使用的来源的金属再次变得可用",
			improve_worker_smith_2: "改进金属加工技术，使工具匠工作更有效率",
			improve_worker_smith_3: "模块化是大规模生产的基础",
			improve_worker_trapper_3: "加工食品使其更持久，并允许使用其他不太好的成分，最终提高猎手的效率",
			improve_worker_water_3: "从收集的所有水中获取更多的水",
			unlock_project_tradingpost_connector: "一个巨大的电梯，跨越整个楼层，允许商人绕过整个危险环境。",
			improve_building_hospital_3: "使医院访问变得不那么痛苦并启用新的植入物。",
			improve_worker_chemist_3: "进一步提炼燃料生产",
			improve_building_radiotower: "改进无线电台，将消息发送到更远的距离",
			improve_building_robots: "改进机器人工厂以生产更多的机器人。",
			improve_worker_scientist: "在图书馆中增加专门的工作空间",
			improve_building_house2: "建造更高的塔楼，可以容纳更多的人",
			improve_worker_chemist_4: "进一步提高燃料生产",
			improve_worker_smith_4: "优化工具生产",
		},
		
		piecesByBlueprint: {},
		
		// caches for faster world generation / page load
		campOrdinalsByBlueprint: {},
		minCampOrdinalsByUpgrade: {},
		minimumCampOrdinalForUpgrade: {},
		
		loadData: function (data) {
			for (upgradeID in data) {
				this.loadUpgradeData(data[upgradeID])
			}
		},
		
		loadUpgradeData: function (def) {
			let addUpgradeEffectToList = function (dict, key, upgradeID) {
				if (!dict[key]) dict[key] = [];
				dict[key].push(upgradeID);
			};
			let desc = UpgradeConstants.upgradeDescriptions[def.id];
			if (!desc) {
				log.w("No description found for upgrade id: " + def.id);
			}
			UpgradeConstants.upgradeDefinitions[def.id] = new UpgradeVO(def.id, def.name, desc);
			UpgradeConstants.upgradeDefinitions[def.id].campOrdinal = def.campOrdinal;
			
			if (def.blueprintPieces) {
				UpgradeConstants.piecesByBlueprint[def.id] = def.blueprintPieces;
				
				if (!UpgradeConstants.blueprintsByCampOrdinal[def.blueprintCampOrdinal])
					UpgradeConstants.blueprintsByCampOrdinal[def.blueprintCampOrdinal] = [[],[],[]];
				let index = def.blueprintIsCampless ? 2 : def.blueprintIsEarly ? 0 : 1;
				UpgradeConstants.blueprintsByCampOrdinal[def.blueprintCampOrdinal][index].push(def.id);
			}
			
			if (def.effects) {
				if (def.effects.unlocksWorker) {
					UpgradeConstants.unlockingUpgradesByWorker[def.effects.unlocksWorker] = def.id;
				}
				if (def.effects.improvesBuildings) {
					let buildings = def.effects.improvesBuildings.split(" ");
					for (let i = 0; i < buildings.length; i++) {
						let building = buildings[i];
						if (building.length < 2) continue;
						addUpgradeEffectToList(UpgradeConstants.improvingUpgradesByImprovement, building, def.id);
					}
				}
				if (def.effects.improvesWorker) {
					addUpgradeEffectToList(UpgradeConstants.improvingUpgradesByWorker, def.effects.improvesWorker, def.id);
				}
				if (def.effects.unlocksUI) {
					UpgradeConstants.unlockingUpgradesByUIEffect[def.effects.unlocksUI] = def.id;
				}
				if (def.effects.improvesOccurrence) {
					let occurrence = def.effects.improvesOccurrence.replaceAll("+", "");
					addUpgradeEffectToList(UpgradeConstants.improvingUpgradesByEvent, occurrence, def.id);
				}
			}
		},
		
		getBlueprintCampOrdinal: function (upgradeID) {
			if (this.campOrdinalsByBlueprint[upgradeID]) {
				return this.campOrdinalsByBlueprint[upgradeID];
			}
			for (var key in this.blueprintsByCampOrdinal) {
				for (let i = 0; i < 3; i++) {
					if (this.blueprintsByCampOrdinal[key][i].indexOf(upgradeID) >= 0) {
						this.campOrdinalsByBlueprint[upgradeID] = key;
						return key;
					}
				}
			}
			return 1;
		},
		
		getMaxPiecesForBlueprint: function (upgradeID) {
			if (this.piecesByBlueprint[upgradeID]) return this.piecesByBlueprint[upgradeID];
			return 3;
		},
		
		getBlueprintBracket: function (upgradeID) {
			var ordinal = this.getBlueprintCampOrdinal(upgradeID);
			if (this.blueprintsByCampOrdinal[ordinal][0].indexOf(upgradeID) >= 0) return this.BLUEPRINT_BRACKET_EARLY;
			if (this.blueprintsByCampOrdinal[ordinal][1].indexOf(upgradeID) >= 0) return this.BLUEPRINT_BRACKET_LATE;
			if (this.blueprintsByCampOrdinal[ordinal][2].indexOf(upgradeID) >= 0) return this.BLUEPRINT_BRACKET_LATE;
			return null;
		},
		
		getUpgradeType: function (upgradeID) {
			let costs = PlayerActionConstants.costs[upgradeID] || {};
			let type = UpgradeConstants.UPGRADE_TYPE_RUMOURS;
			if (costs.insight > 0) type = UpgradeConstants.UPGRADE_TYPE_INSIGHT;
			if (costs.favour > 0) type = UpgradeConstants.UPGRADE_TYPE_FAVOUR;
			else if (costs.evidence > 0) type = UpgradeConstants.UPGRADE_TYPE_EVIDENCE;
			return type;
		},
		
		getBlueprintsByCampOrdinal: function (campOrdinal, blueprintType, levelIndex, maxLevelIndex) {
			if (!this.blueprintsByCampOrdinal[campOrdinal]) return [];
			let result = [];
			
			if (blueprintType == this.BLUEPRINT_BRACKET_EARLY || !blueprintType) {
				if (levelIndex == 0 || levelIndex == undefined) {
					result = result.concat(this.blueprintsByCampOrdinal[campOrdinal][0]);
				}
			}
			if (blueprintType == this.BLUEPRINT_BRACKET_LATE || !blueprintType) {
				if (levelIndex == 0 || levelIndex == undefined) {
					result = result.concat(this.blueprintsByCampOrdinal[campOrdinal][1]);
				}
				
				if (levelIndex == 1 || maxLevelIndex < 1 || levelIndex == undefined) {
					result = result.concat(this.blueprintsByCampOrdinal[campOrdinal][2]);
				}
			}
			
			return result;
		},
		
		getPiecesByCampOrdinal: function (campOrdinal, blueprintType, levelIndex, maxLevelIndex) {
			var pieceCount = 0;
			var blueprints = this.getBlueprintsByCampOrdinal(campOrdinal, blueprintType, levelIndex, maxLevelIndex);
			for (let i = 0; i < blueprints.length; i++) {
				pieceCount += this.getMaxPiecesForBlueprint(blueprints[i]);
			}
			return pieceCount;
		},
		
		getRequiredTech: function (upgradeID) {
			var reqs = PlayerActionConstants.requirements[upgradeID];
			if (reqs && reqs.upgrades) {
				return Object.keys(reqs.upgrades);
			}
			return [];
		},
		
		getRequiredTechAll: function (upgradeID) {
			let result = [];
			let direct = this.getRequiredTech(upgradeID);
			for (let i = 0; i < direct.length; i++) {
				result.push(direct[i])
				let indirect = this.getRequiredTechAll(direct[i]);
				for (let j = 0; j < indirect.length; j++) {
					result.push(indirect[j]);
				}
			}
			return result;
		},

		getUnlockedTech: function (upgradeID) {
			let result = [];
			for (let otherID in UpgradeConstants.upgradeDefinitions) {
				let requiredTech = this.getRequiredTech(otherID);
				if (requiredTech.indexOf(upgradeID) >= 0) {
					result.push(otherID);
				}
			}
			return result;
		},
		
		getAllUpgradesRequiringInsight: function () {
			if (this.allUpgradesRequiringInsight) return this.allUpgradesRequiringInsight;
			
			let result = [];
			
			for (let upgradeID in UpgradeConstants.upgradeDefinitions) {
				let costs = PlayerActionConstants.costs[upgradeID] || {};
				if (costs.insight > 0) {
					result.push(upgradeID);
				}
			}
			
			this.allUpgradesRequiringInsight = result;
			
			return result;
		},
		
	};
	
	UpgradeConstants.loadData(UpgradeData);

	return UpgradeConstants;
	
});
