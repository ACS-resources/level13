define(['ash'], function (Ash) {

	let TutorialConstants = {
		
		TUTORIAL_REPEATS_TYPE_NEVER: "NEVER",
		TUTORIAL_REPEATS_TYPE_ALWAYS: "ALWAYS",
		TUTORIAL_REPEATS_TYPE_COOLDOWN: "COOLDOWN",
		
		TUTORIAL_COOLDOWN_DURATION: 1000 * 60 * 10,
		
		tutorials: {
			TUTORIAL_BUILT_TRAP: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建造了一个陷阱。它可以用来捕捉食物。",
				conditions: { improvements: { collector_food: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_BUCKET: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建造了水桶。它可以收集水资源。",
				conditions: { improvements: { collector_water: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_HUT: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建造了棚屋。听说这里有营地后，人们会陆续前来。",
				conditions: { improvements: { house: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_BEACON: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "信标已就绪。它那苍白的光芒将周围环境勾勒出锐利而固定的轮廓。",
				conditions: { improvements: { beacon: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_TOWER_BLOCK: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修复了旧塔楼。这里可以容纳多个家庭居住。",
				conditions: { improvements: { house2: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_GENERATOR: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "发电机已安装。它将为营地生活提供更多便利。",
				conditions: { improvements: { generator: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_STORAGE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "仓库建造完成。",
				conditions: { improvements: { storage: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_AQUEDUCT: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "输水管道建造完成。",
				conditions: { improvements: { aqueduct: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_STABLE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建造了商队马厩。我们现在可以派出自己的贸易队伍了。",
				conditions: { improvements: { stable: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_BARRACKS: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "兵营建造完成。现在可以招募士兵来保卫营地了。",
				conditions: { improvements: { barracks: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_SMITHY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "铁匠铺建造完成。",
				conditions: { improvements: { smithy: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_APOTHECARY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "药剂店建造完成。",
				conditions: { improvements: { apothecary: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_CEMENT_MILL: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "水泥厂建造完成，可以生产混凝土了。",
				conditions: { improvements: { cementmill: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_ROBOT_FACTORY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "机器人工厂已就绪，随时可以投入生产。",
				conditions: { improvements: { robotFactory: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_ROBOT_RADIO: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "无线电塔建造完成。",
				conditions: { improvements: { radiotower: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_CAMPFIRE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "营火已点燃。这里是分享和讨论想法的聚集地。",
				conditions: { improvements: { campfire: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_DARKFARM: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建造了蜗牛农场。这里将稳定产出食物。",
				conditions: { improvements: { darkfarm: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_HOSPITAL: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "医疗诊所建造完成。",
				conditions: { improvements: { hospital: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_LIBRARY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "图书馆建造完成。",
				conditions: { improvements: { library: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_MARKET: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "市场建造完成。",
				conditions: { improvements: { market: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_INN: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "旅店建造完成。或许会吸引外来访客。",
				conditions: { improvements: { inn: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_SQUARE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "中央广场建造完成。营地已初具城镇规模。",
				conditions: { improvements: { square: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_SHRINE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "为大地之神建造了祭坛。",
				conditions: { improvements: { shrine: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_GARDEN: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "苔藓花园建造完成。在钢铁都市的棱角之间，这里宛如一片绿洲。",
				conditions: { improvements: { garden: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_TEMPLE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "神庙建造完成。人们可以在此共同探索新的信仰。",
				conditions: { improvements: { temple: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_RESEARCH_CENTER: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "研究中心建造完成，其规模可与旧日地表文明相媲美。",
				conditions: { improvements: { researchcenter: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_TRADEPOST_1: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "贸易站已就绪，但需要再建造一个才能进行贸易。",
				conditions: { tribe: { improvements: { tradepost: [ 1, 2 ] } } }
			},
			TUTORIAL_BUILT_TRADEPOST_2: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "第二个贸易站建造完成。现在两个营地可以共享资源。",
				conditions: { tribe: { improvements: { tradepost: [ 2, 3 ] } } }
			},
			TUTORIAL_USED_HOSPITAL: {
				triggers: [ "action_any" ],
				repeats: "NEVER",
				delay: 1000,
				logMessage: "已治愈所有伤患。",
				conditions: { perkEffects: { "Injury": [ -1, 0 ] } }
			},
			TUTORIAL_PRODUCED_ROBOT: {
				triggers: [ "feature_unlocked", "action_any" ],
				repeats: "NEVER",
				delay: 1000,
				logMessage: "首台工作机器人已就绪。它将协助居民完成日常工作。",
				conditions: { featureUnlocked: { resource_robots: true }, inCamp: true, campInventory: { resource_robots: [ 1, -1 ] } }
			},
			TUTORIAL_CAN_MAKE_LIGHT: {
				triggers: [ "change_inventory" ],
				repeats: "COOLDOWN",
				delay: 1500,
				logMessage: "已收集足够金属材料，可以制造提灯了",
				conditions: { maxVision: [-1, 50], actionsAvailable: ["craft_light1"], featureUnlocked: { bag: true } }
			},
			TUTORIAL_CAN_BUILD_SHRINE: {
				triggers: [ "change_inventory", "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "现在可以建造神灵祭坛了",
				conditions: { inCamp: true, deity: true }
			},
			TUTORIAL_CAN_BUILD_TEMPLE: {
				triggers: [ "change_inventory", "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "材料已齐备，可以建造神庙了",
				conditions: { inCamp: true, actionsAvailable: ["build_in_temple"] }
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP_NO_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "此处有巨大裂缝。需要寻找架桥方法才能通过。",
				conditions: { sector: { blockers: { 1: true } }, upgrades: { "unlock_building_bridge": false } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP_HAS_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "此处有巨大裂缝，但营地工人可以架桥通过。",
				conditions: { sector: { blockers: { 1: true } }, upgrades: { "unlock_building_bridge": true } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GANG: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "有劫掠者挡住了去路。",
				conditions: { sector: { blockers: { 3: true } } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_DEBRIS: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "瓦砾堵塞了道路。营地工人可以前来清理。",
				conditions: { sector: { blockers: { 4: true } } }
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_EXPLOSIVES: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "旧战争遗留的爆炸物阻挡了道路。需要营地工人清理。",
				conditions: { sector: { blockers: { 7: true } } }
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE_NO_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "放射性废料堆积如山，需掌握更多技术才能清理。",
				conditions: { sector: { blockers: { 5: true } }, upgrades: { "unlock_action_clear_waste_r": false } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE_HAS_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "存在放射性废料，但现有技术已可处理。",
				conditions: { sector: { blockers: { 5: true } }, upgrades: { "unlock_action_clear_waste_r": true } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC_NO_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "剧毒废料阻断道路，需研发清理技术。",
				conditions: { sector: { blockers: { 6: true } }, upgrades: { "unlock_action_clear_waste_t": false } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC_HAS_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "剧毒废料区域，必须净化后方可通过。",
				conditions: { sector: { blockers: { 6: true } }, upgrades: { "unlock_action_clear_waste_t": true } },
			},
			TUTORIAL_ENCOUNTER_LEVEL_14_RADIATION: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "此区域辐射严重，需要更精良的装备才能探索。",
				conditions: { sector: { hazards: { radiation: [ 1, -1 ] } }, player: { affectedByHazard: true, position: { level: 14 } } },
			},
			TUTORIAL_ENCOUNTER_HAZARD_DEBRIS: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "街道上遍布瓦砾，行进异常艰难。",
				conditions: { sector: { hazards: { debris: [ 1, -1 ] } } },
			},
			TUTORIAL_ENCOUNTER_SPRING: {
				triggers: [ "action_scout" ],
				repeats: "NEVER",
				logMessage: "此处发现稳定水源。",
				conditions: { sector: { spring: true } },
			},
			TUTORIAL_ENCOUNTER_INGREDIENT_SECTOR: {
				triggers: [ "action_scout" ],
				repeats: "NEVER",
				delay: 500,
				logMessage: "这类区域可能藏有制作材料。",
				conditions: { sector: { scavengeableItems: { count: [ 1, -1 ] } } },
			},
			TUTORIAL_ENCOUNTER_SECTOR_ENEMIES: {
				triggers: [ "action_scout" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "There are some hostile creatures here. Scavenging is more risky.",
				conditions: { sector: { enemies: true } },
			},
			TUTORIAL_ENCOUNTER_OUTPOST: {
				triggers: [ "action_enter_camp" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "There are few people living on this level. The camp will grow slower.",
				conditions: { inCamp: true, "level": { "population": [ -1, 1 ] } }
			},
			TUTORIAL_FEATURE_UNLOCKED_MOVE: {
				triggers: [ "feature_unlocked", "change_inventory" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "Might be worthwhile to explore the surroundings.",
				conditions: { featureUnlocked: { move: true }, playerInventory: { resource_food: [2, -1], resource_water: [2, -1 ], inCamp: false } }
			},
			TUTORIAL_FEATURE_UNLOCKED_UPGRADES: {
				triggers: [ "feature_unlocked", "action_enter_camp" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "Evidence and rumours can be distilled into knowledge at the Campfire.",
				conditions: { featureUnlocked: { upgrades: true }, inCamp: true }
			},
			TUTORIAL_FEATURE_UNLOCKED_MILESTONES: {
				triggers: [ "feature_unlocked", "action_enter_camp" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "The camp is small now, but it will grow. Together we can do more.",
				conditions: { featureUnlocked: { milestones: true }, inCamp: true }
			},
			TUTORIAL_FEATURE_UNLOCKED_BAG: {
				triggers: [ "feature_unlocked" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "Found a bag that allows carrying more stuff.",
				conditions: { featureUnlocked: { bag: true } }
			},
			TUTORIAL_FOUND_METAL: {
				triggers: [ "action_collect_rewards" ],
				delay: 0,
				repeats: "NEVER",
				logMessage: "Found some canned food",
				conditions: { playerInventory: { resource_food: [1, -1] } }
			},
			TUTORIAL_FOUND_FOOD: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				delay: 0,
				logMessage: "Found some scrap metal. It could be useful for crafting.",
				conditions: { playerInventory: { resource_metal: [1, -1] } }
			},
			TUTORIAL_FOUND_ROPE: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some rope. Could be useful for building and crafting.",
				conditions: { playerInventory: { resource_rope: [1, -1] }, campInventory: { resource_rope: [ -1, 1 ] } }
			},
			TUTORIAL_FOUND_HERBS: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some dried herbs",
				conditions: { playerInventory: { resource_herbs: [1, -1] } }
			},
			TUTORIAL_FOUND_FUEL: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some fuel.",
				conditions: { playerInventory: { resource_fuel: [1, -1] } }
			},
			TUTORIAL_FOUND_RUBBER: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some rubber.",
				conditions: { playerInventory: { resource_rubber: [1, -1] } }
			},
			TUTORIAL_FOUND_MEDICINE: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some medicine. Rare remnants of safer times.",
				conditions: { playerInventory: { resource_medicine: [1, -1] } }
			},
			TUTORIAL_FOUND_TOOLS: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some useful tools.",
				conditions: { playerInventory: { resource_tools: [1, -1] } }
			},
			TUTORIAL_FOUND_CONCRETE: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some concrete.",
				conditions: { playerInventory: { resource_concrete: [1, -1] } }
			},
			TUTORIAL_FOUND_ROBOT: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found a working robot. This could be useful back in camp.",
				conditions: { playerInventory: { resource_robots: [1, -1] } }
			},
			TUTORIAL_FOUND_SILVER: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "Found some silver coins. Some traders accept these.",
				conditions: { playerInventory: { silver: [1, -1] } }
			},
			TUTORIAL_WARNING_STORAGE_FULL: {
				triggers: [ "update" ],
				repeats: "COOLDOWN",
				logMessage: "Storage is full.",
				conditions: { inCamp: true, campInventoryFull: true } 
			},
		},

	};
	
	return TutorialConstants;
});
