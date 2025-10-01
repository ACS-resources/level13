define(['ash', 'game/vos/EnemyVO', 'game/constants/PerkConstants'],
function (Ash, EnemyVO, PerkConstants) {

	var EnemyConstants = {
		
		enemyDefinitions: [],

		enemyUsage: {}, // usage in current world, just for debug
		
		enemyTexts: {
			apparition: {
				nouns: ["幽灵", "实体"],
				groupNouns: ["一团", "一群"],
				verbsActive: ["被占据", "在闹鬼"],
				verbsDefeated: ["驱散", "击败", "清除"],
			},
			bandit: {
				nouns: ["土匪", "暴徒"],
				groupNouns: [ "一群", "一帮"],
				verbsActive: [ "被巡逻", "被控制", "被守卫", "被占据"],
				verbsDefeated: [ "驱散", "击杀"],
			},
			big_animal: {
				nouns: ["攻击性动物", "野生动物", "动物", "敌对生物"],
				groupNouns: ["一群", "一些"],
				verbsActive: ["被占据", "被守卫", "被占领"],
				verbsDefeated: ["清除", "击杀"],
			},
			bird: {
				nouns: ["骇物", "鸟类", "动物", "危险生物", "敌对生物" ],
				groupNouns: ["一群", "一些"],
				verbsActive: ["被占据", "被侵扰", "被占领", "被守护"],
				verbsDefeated: ["击杀", "清除", "驱散"],
			},
			flora: {
				nouns: ["骇物", "恶性植物", "敌对生物" ],
				groupNouns: ["一簇", "一团"],
				verbsActive: ["被侵扰", "被覆盖", "被占据"],
				verbsDefeated: ["清除"],
			},
			fungi: {
				nouns: ["骇物", "危险真菌", "敌对生物"],
				groupNouns: ["一簇", "一团"],
				verbsActive: ["被侵扰", "被覆盖", "被占据"],
				verbsDefeated: ["清除", "消灭"],
			},
			humanoid: {
				nouns: ["恶意人形生物"],
				groupNouns: ["一帮", "一群"],
				verbsActive: ["被守卫", "被占据"],
				verbsDefeated: ["驱散"],
			},
			robot: {
				nouns: ["攻击性机器人"],
				groupNouns: ["一群", "一团", "一单元"],
				verbsActive: ["被巡逻", "被控制", "被守卫", "被占据"],
				verbsDefeated: ["瘫痪", "清除", "摧毁"],
			},
			small_animal: {
				nouns: ["骇物", "危险动物", "野生动物", "动物", "敌对生物"],
				groupNouns: ["一群", "一团", "一些"],
				verbsActive: ["被侵扰", "被占据" ],
				verbsDefeated: ["击杀", "清除"],
			},
			structure: {
				nouns: ["自动化建筑"],
				groupNouns: ["一群", "一台"],
				verbsActive: ["被阻挡"],
				verbsDefeated: ["瘫痪"],
			}
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
			let enemyVO = this.tryGetEnemy(enemyID);
			if (enemyVO) return enemyVO;
			log.w("no such enemy found: " + enemyID);
			return null;
		},

		tryGetEnemy: function (enemyID) {
			for (let i in this.enemyDefinitions) {
				let enemy = this.enemyDefinitions[i];
				if (enemy.id == enemyID) {
					return enemy;
				}
			}
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
