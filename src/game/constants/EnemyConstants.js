define(['ash', 'game/vos/EnemyVO', 'game/constants/PerkConstants'],
function (Ash, EnemyVO, PerkConstants) {

	var EnemyConstants = {
		
		enemyDefinitions: [],

		enemyUsage: {}, // usage in current world, just for debug
		
		enemyTexts: {
		    bandit: {
			nouns: [ "土匪", "暴徒" ],
			groupNouns: [ "团", "帮" ],
			verbsActive: [ "巡逻", "控制", "守卫", "占据" ],
			verbsDefeated: [ "被驱逐", "被消灭" ],
		    },
		    big_animal: {
			nouns: [ "具有攻击性的动物", "野生动物", "动物", "敌对生物" ],
			groupNouns: ["群", "团", "帮"],
			verbsActive: ["遍布", "守卫", "占据"],
			verbsDefeated: ["被清除", "被消灭"],
		    },
		    bird: {
			nouns: ["城市害鸟", "鸟群", "动物", "具有攻击性的动物", "敌对生物" ],
			groupNouns: ["群", "群", "帮", "团"],
			verbsActive: ["遍布", "滋生", "占据", "守卫"],
			verbsDefeated: ["被消灭", "被清除", "被驱逐"],
		    },
		    flora: {
			nouns: ["城市害植", "剧毒植物", "敌对生物" ],
			groupNouns: ["丛", "群"],
			verbsActive: ["滋生", "覆盖", "遍布"],
			verbsDefeated: ["被清除"],
		    },
		    fungi: {
			nouns: ["城市害菌", "危险真菌", "敌对生物"],
			groupNouns: ["簇", "群"],
			verbsActive: ["滋生", "覆盖", "遍布"],
			verbsDefeated: ["被清除", "被消灭"],
		    },
		    humanoid: {
			nouns: ["邪恶生物"],
			groupNouns: ["团", "帮", "群"],
			verbsActive: ["守卫", "占据"],
			verbsDefeated: ["被驱逐"],
		    },
		    robot: {
			nouns: ["攻击型机器人"],
			groupNouns: ["暴民团伙", "帮派", "群组", "集群", "特工小组"],
			verbsActive: ["巡逻", "控制", "守卫", "占据"],
			verbsDefeated: ["被瘫痪", "被清除", "被摧毁"],
		    },
		    small_animal: {
			nouns: ["城市害兽", "具有攻击性的动物", "野生动物", "动物", "敌对生物"],
			groupNouns: ["群", "群", "团", "群", "群"],
			verbsActive: ["滋生", "遍布" ],
			verbsDefeated: ["被消灭", "被清除"],
		    },
		    structure: {
			nouns: ["自动防御设施"],
			groupNouns: ["群组", "装置组"],
			verbsActive: ["阻挡"],
			verbsDefeated: ["被瘫痪"],
		    },
		},
		
		enemyLoot: {
			apparition: {
				droppedResources: [ "water" ],
			},
			bandit: {
				droppedResources: [ "food", "water", "rope" ],
				droppedIngredients: [ "res_bands", "res_bottle", "res_hairpin", "res_leather", "res_silk", "res_tape" ],
			},
			big_animal: {
				droppedResources: [ "food" ],
				droppedIngredients: [ "res_bands", "res_leather" ],
			},
			bird: {
				droppedResources: [ "food" ],
				droppedIngredients: [ "res_bands", "res_bottle", "res_hairpin", "res_leather", "res_tape" ],
			},
			flora: {
				droppedResources: [ "food" ],
				droppedIngredients: [ "res_glowbug", "res_silk" ],
			},
			fungi: {
				droppedResources: [ "food" ],
				droppedIngredients: [ "res_bottle", "res_glowbug", "res_silk" ],
			},
			humanoid: {
				droppedResources: [ "water" ],
				droppedIngredients: [ "res_bands", "res_bottle", "res_hairpin", "res_leather", "res_silk", "res_tape" ],
			},
			robot: {
				droppedResources: [ "metal", "fuel" ],
				droppedIngredients: [ "res_bands", "res_bottle", "res_hairpin", "res_tape" ],
			},
			small_animal: {
				droppedResources: [ "food" ],
				droppedIngredients: [ "res_bands", "res_glowbug", "res_hairpin", "res_leather", "res_silk" ],
			},
			structure: {
				droppedResources: [ "metal" ],
				droppedIngredients: [ "res_bands", "res_bottle", "res_glowbug", "res_hairpin", "res_tape" ],
			},
		},
		
		enemyInjuries: {
			bandit: [ PerkConstants.injuryType.SHARP, PerkConstants.injuryType.BLUNT ],
			big_animal: [ PerkConstants.injuryType.SHARP, PerkConstants.injuryType.BLUNT ],
			bird: [ PerkConstants.injuryType.SHARP ],
			flora: [ PerkConstants.injuryType.BLUNT ],
			fungi: [ PerkConstants.injuryType.BLUNT ],
			humanoid: [ PerkConstants.injuryType.SHARP, PerkConstants.injuryType.BLUNT ],
			robot: [ PerkConstants.injuryType.SHARP, PerkConstants.injuryType.BLUNT ],
			small_animal: [ PerkConstants.injuryType.SHARP ],
			structure: [ PerkConstants.injuryType.BLUNT ],
		},
		
		// saved for convenience & startup speed
		enemyDifficulties: {},
		
		getEnemy: function (enemyID) {
			for (let i in this.enemyDefinitions) {
				let enemy = this.enemyDefinitions[i];
				if (enemy.id == enemyID) {
					return enemy;
				}
			}
			log.w("no such enemy found: " + enemyID);
			return null;
		},
		
		getAll: function () {
			let result = [];
			for (let i in this.enemyDefinitions) {
				let enemy = this.enemyDefinitions[i];
				result.push(enemy);
			}
			return result;
		},
		
		getDifficulty: function (enemy) {
			return this.enemyDifficulties[enemy.id];
		},

		getDropsCurrency: function (enemyVO) {
			switch (enemyVO.enemyClass) {
				case "bandit": return true;
				default: return false;
			}
		}
		
	};
		
	
	return EnemyConstants;
	
});
