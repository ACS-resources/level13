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
				logMessage: "建了一个陷阱, 它会收集食物",
				conditions: { improvements: { collector_food: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_BUCKET: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "放了一个桶, 它会积水",
				conditions: { improvements: { collector_water: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_HUT: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建了一个小屋, 人们了解到了营地就会来",
				conditions: { improvements: { house: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_BEACON: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "信标建好了, 惨白的灯光将周围的环境渲染成尖锐且僵硬的条纹",
				conditions: { improvements: { beacon: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_TOWER_BLOCK: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修好了一个旧的小高层, 它可以容纳几户人家",
				conditions: { improvements: { house2: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_GENERATOR: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "搭起来一个发电机, 它会让营地的生活舒服些",
				conditions: { improvements: { generator: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_STORAGE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建起一个仓库",
				conditions: { improvements: { storage: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_AQUEDUCT: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个渡槽",
				conditions: { improvements: { aqueduct: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_STABLE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建好一个篷车马厩, 现在我们可以让我们自己的商队出动了",
				conditions: { improvements: { stable: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_BARRACKS: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建了一个军营, 我们现在可以招兵防守营地了",
				conditions: { improvements: { barracks: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_SMITHY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个铁匠铺",
				conditions: { improvements: { smithy: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_APOTHECARY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个药坊",
				conditions: { improvements: { apothecary: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_CEMENT_MILL: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个水泥磨, 以生产水泥",
				conditions: { improvements: { cementmill: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_ROBOT_FACTORY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "机械工厂的大门向工人们敞开",
				conditions: { improvements: { robotFactory: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_ROBOT_RADIO: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建起来一个无线电塔",
				conditions: { improvements: { radiotower: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_CAMPFIRE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "燃起一片营火, 在这里, 人们可以分享和交流想法",
				conditions: { improvements: { campfire: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_DARKFARM: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建起一个在黑暗中培育蜗牛的农场, 蜗牛可以作为食物",
				conditions: { improvements: { darkfarm: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_HOSPITAL: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建起一个诊所",
				conditions: { improvements: { hospital: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_LIBRARY: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个图书馆",
				conditions: { improvements: { library: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_MARKET: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建了一个市场",
				conditions: { improvements: { market: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_INN: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个旅馆, 也许它会招揽些游客",
				conditions: { improvements: { inn: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_SQUARE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个广场, 这里更像城市中的一个小镇了",
				conditions: { improvements: { square: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_SHRINE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个寺以与地球的‘神’建立连接",
				conditions: { improvements: { shrine: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_GARDEN: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "建了一个苔藓花园, 这是城市锯齿状金属边缘中的一个舒缓的地方",
				conditions: { improvements: { garden: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_TEMPLE: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个庙, 在这里人们可以共同探索这个新的宗教",
				conditions: { improvements: { temple: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_RESEARCH_CENTER: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "修了一个研究中心, 和地表上的旧的那些一样好用",
				conditions: { improvements: { researchcenter: [ 1, 2 ] } }
			},
			TUTORIAL_BUILT_TRADEPOST_1: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "贸易站修好了, 但得建另一个才能构成贸易网",
				conditions: { tribe: { improvements: { tradepost: [ 1, 2 ] } } }
			},
			TUTORIAL_BUILT_TRADEPOST_2: {
				triggers: [ "action_build" ],
				repeats: "NEVER",
				logMessage: "贸易站修好了, 我们任意两个营地都可以共享物资",
				conditions: { tribe: { improvements: { tradepost: [ 2, 3 ] } } }
			},
			TUTORIAL_USED_HOSPITAL: {
				triggers: [ "action_any" ],
				repeats: "NEVER",
				delay: 1000,
				logMessage: "所有的伤全被治愈了",
				conditions: { perkEffects: { "Injury": [ -1, 0 ] } }
			},
			TUTORIAL_PRODUCED_ROBOT: {
				triggers: [ "feature_unlocked", "action_any" ],
				repeats: "NEVER",
				delay: 1000,
				logMessage: "我们的第一个工作机器人已经搞好了, 它会辅助工人工作.",
				conditions: { featureUnlocked: { resource_robots: true }, inCamp: true, campInventory: { resource_robots: [ 1, -1 ] } }
			},
			TUTORIAL_CAN_MAKE_LIGHT: {
				triggers: [ "change_inventory" ],
				repeats: "COOLDOWN",
				delay: 1500,
				logMessage: "弄了足够的铁可以合成一个灯笼了",
				conditions: { maxVision: [-1, 50], actionsAvailable: ["craft_light1"], featureUnlocked: { bag: true } }
			},
			TUTORIAL_CAN_BUILD_SHRINE: {
				triggers: [ "change_inventory", "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "现在我们可以为我们的‘神’修建一个寺了",
				conditions: { inCamp: true, deity: true }
			},
			TUTORIAL_CAN_BUILD_TEMPLE: {
				triggers: [ "change_inventory", "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "我们现在可以修一个庙了",
				conditions: { inCamp: true, actionsAvailable: ["build_in_temple"] }
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP_NO_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这里有个巨大的裂缝, 得想想怎么连接它两边",
				conditions: { sector: { blockers: { 1: true } }, upgrades: { "unlock_building_bridge": false } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP_HAS_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GAP",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这里有个巨大的裂缝, 但营地的工人现在可以连上它",
				conditions: { sector: { blockers: { 1: true } }, upgrades: { "unlock_building_bridge": true } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_GANG: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "有些骇物挡住路了",
				conditions: { sector: { blockers: { 3: true } } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_DEBRIS: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "太多残骸挡住路了, 营地的工人可以清除它们",
				conditions: { sector: { blockers: { 4: true } } }
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE_NO_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "太多放射性废物挡住路了, 得学点知识才能设法清除",
				conditions: { sector: { blockers: { 5: true } }, upgrades: { "unlock_action_clear_waste_r": false } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE_HAS_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_RADIOACTIVE",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "太多放射性废物挡住路了, 但现在我们可以清除它们了",
				conditions: { sector: { blockers: { 5: true } }, upgrades: { "unlock_action_clear_waste_r": true } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC_NO_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这里太多有毒物挡住路了, 得想想怎么清除它们",
				conditions: { sector: { blockers: { 6: true } }, upgrades: { "unlock_action_clear_waste_t": false } },
			},
			TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC_HAS_TECH: {
				group: "TUTORIAL_ENCOUNTER_BLOCKER_TYPE_WASTE_TOXIC",
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这里太多有毒物挡住路了, 得清除了它们才能过去",
				conditions: { sector: { blockers: { 6: true } }, upgrades: { "unlock_action_clear_waste_t": true } },
			},
			TUTORIAL_ENCOUNTER_LEVEL_14_RADIATION: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这个地方太危险了, 得有好的多的装备才能继续探索",
				conditions: { sector: { hazards: { radiation: [ 1, -1 ] } }, player: { affectedByHazard: true, position: { level: 14 } } },
			},
			TUTORIAL_ENCOUNTER_HAZARD_DEBRIS: {
				triggers: [ "change_position" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这个街上全是残骸, 想过去很难",
				conditions: { sector: { hazards: { debris: [ 1, -1 ] } } },
			},
			TUTORIAL_ENCOUNTER_SPRING: {
				triggers: [ "action_scout" ],
				repeats: "NEVER",
				logMessage: "这里有可靠的水源",
				conditions: { sector: { spring: true } },
			},
			TUTORIAL_ENCOUNTER_INGREDIENT_SECTOR: {
				triggers: [ "action_scout" ],
				repeats: "NEVER",
				delay: 500,
				logMessage: "看上去这里可能能找到一些合成用的材料",
				conditions: { sector: { scavengeableItems: { count: [ 1, -1 ] } } },
			},
			TUTORIAL_ENCOUNTER_SECTOR_ENEMIES: {
				triggers: [ "action_scout" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这里有很多有害生物, 在这里拾荒很麻烦",
				conditions: { sector: { enemies: true } },
			},
			TUTORIAL_ENCOUNTER_OUTPOST: {
				triggers: [ "action_enter_camp" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这层的人更少, 营地扩张会慢很多",
				conditions: { inCamp: true, "level": { "population": [ -1, 1 ] } }
			},
			TUTORIAL_FEATURE_UNLOCKED_MOVE: {
				triggers: [ "feature_unlocked", "change_inventory" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "探索周围的建筑物看上去很值得一试",
				conditions: { featureUnlocked: { move: true }, playerInventory: { resource_food: [2, -1], resource_water: [2, -1 ], inCamp: false } }
			},
			TUTORIAL_FEATURE_UNLOCKED_UPGRADES: {
				triggers: [ "feature_unlocked", "action_enter_camp" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "线索和传完可以被在营火旁转化为知识",
				conditions: { featureUnlocked: { upgrades: true }, inCamp: true }
			},
			TUTORIAL_FEATURE_UNLOCKED_MILESTONES: {
				triggers: [ "feature_unlocked", "action_enter_camp" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "这个营地还是很小, 不过之后它会扩大的, 我们一起可以成就更多",
				conditions: { featureUnlocked: { milestones: true }, inCamp: true }
			},
			TUTORIAL_FEATURE_UNLOCKED_BAG: {
				triggers: [ "feature_unlocked" ],
				repeats: "NEVER",
				delay: 1500,
				logMessage: "发现了一个包, 它可以带更多的东西",
				conditions: { featureUnlocked: { bag: true } }
			},
			TUTORIAL_FOUND_METAL: {
				triggers: [ "action_collect_rewards" ],
				delay: 0,
				repeats: "NEVER",
				logMessage: "发现了一些罐装食物",
				conditions: { playerInventory: { resource_food: [1, -1] } }
			},
			TUTORIAL_FOUND_FOOD: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				delay: 0,
				logMessage: "找到了一些废铁, 也许可以用于合成东西",
				conditions: { playerInventory: { resource_metal: [1, -1] } }
			},
			TUTORIAL_FOUND_ROPE: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了些绳子, 也许很适合建设和合成",
				conditions: { playerInventory: { resource_rope: [1, -1] } }
			},
			TUTORIAL_FOUND_HERBS: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了一些干草药",
				conditions: { playerInventory: { resource_herbs: [1, -1] } }
			},
			TUTORIAL_FOUND_FUEL: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了些燃料",
				conditions: { playerInventory: { resource_fuel: [1, -1] } }
			},
			TUTORIAL_FOUND_RUBBER: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了一些橡胶.",
				conditions: { playerInventory: { resource_rubber: [1, -1] } }
			},
			TUTORIAL_FOUND_MEDICINE: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了些药品, 是之前安全时代的遗留物",
				conditions: { playerInventory: { resource_medicine: [1, -1] } }
			},
			TUTORIAL_FOUND_TOOLS: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了些有用的工具",
				conditions: { playerInventory: { resource_tools: [1, -1] } }
			},
			TUTORIAL_FOUND_CONCRETE: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了些水泥",
				conditions: { playerInventory: { resource_concrete: [1, -1] } }
			},
			TUTORIAL_FOUND_ROBOT: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了一个有用的工作机器人, 带回营地也许有用",
				conditions: { playerInventory: { resource_robots: [1, -1] } }
			},
			TUTORIAL_FOUND_SILVER: {
				triggers: [ "action_collect_rewards" ],
				repeats: "NEVER",
				logMessage: "找到了一些银币, 有些贸易商会接受这些",
				conditions: { playerInventory: { silver: [1, -1] } }
			},
			TUTORIAL_WARNING_STORAGE_FULL: {
				triggers: [ "update" ],
				repeats: "COOLDOWN",
				logMessage: "仓库满了",
				conditions: { inCamp: true, campInventoryFull: true } 
			},
		},

	};
	
	return TutorialConstants;
});
