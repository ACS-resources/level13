define(['ash', 'game/vos/EnemyVO', 'game/constants/PerkConstants'],
function (Ash, EnemyVO, PerkConstants) {

	var EnemyConstants = {
		
		enemyTypes: {
			global: "global",			// anywhere
			nohazard: "nohazard",    	// sectors with no hazards
			cold: "cold",            	// cold sectors
			dark: "dark",            	// dark sectors
			radiation: "radiation",  	// radiactive sectors
			dense: "dense",          	// densely built sectors
			sparse: "sparse",        	// sparsely built sectors
			inhabited: "inhabited",  	// has fairly recent human habitation
			uninhabited: "inhabited",	// no recent human habitation
			sunlit: "sunlit",        	// sunlit sectors
			toxic: "toxic",          	// polluted sectors
			water: "water",          	// sectors with water (or neighbours)
		},
		
		enemyDefinitions: {
			global: [ ],
			nohazard: [ ],
			cold: [ ],
			dark: [ ],
			radiation: [ ],
			dense: [ ],
			sparse: [ ],
			inhabited: [ ],
			uninhabited: [ ],
			sunlit: [ ],
			toxic: [ ],
			water: [ ],
		},
		
		enemyTexts: {
			bandit: {
				nouns: [ "强盗", "暴徒" ],
				groupNouns: [ "暴民", "帮派"],
				verbsActive: [ "被巡逻", "被控制", "被守卫", "被占领"],
				verbsDefeated: [ "被驱逐", "被杀死"],
			},
			big_animal: {
				nouns: [ "攻击性动物", "野生动物", "动物", "敌对野生动物" ],
				groupNouns: ["群体", "片", "帮"],
				verbsActive: ["充斥", "被守卫", "被占领"],
				verbsDefeated: ["清除", "杀死"],
			},
			bird: {
				nouns: ["都市骇物", "鸟类", "动物", "攻击性动物", "敌对野生动物" ],
				groupNouns: ["群", "片", "帮", "簇"],
				verbsActive: ["充斥", "被感染", "被占领", "被守卫"],
				verbsDefeated: ["杀死", "清除", "被驱逐"],
			},
			flora: {
				nouns: ["都市骇物", "恶性植物", "敌对野生动物" ],
				groupNouns: ["簇", "片"],
				verbsActive: ["感染", "覆盖", "充斥"],
				verbsDefeated: ["清除"],
			},
			fungi: {
				nouns: ["都市骇物", "危险真菌", "敌对野生动物"],
				groupNouns: ["簇", "片"],
				verbsActive: ["感染", "覆盖", "充斥"],
				verbsDefeated: ["清除", "杀死"],
			},
			humanoid: {
				nouns: ["恶意生物"],
				groupNouns: ["暴民", "帮派", "组"],
				verbsActive: ["被守卫", "被占领"],
				verbsDefeated: ["被驱逐"],
			},
			robot: {
				nouns: ["攻击性机器人"],
				groupNouns: ["暴民", "帮派", "组", "群体", "单位"],
				verbsActive: ["被巡逻", "被控制", "被守卫", "被占领"],
				verbsDefeated: ["被禁用", "清除", "被摧毁"],
			},
			small_animal: {
				nouns: ["城市害虫", "攻击性动物", "野生动物", "动物", "敌对野生动物"],
				groupNouns: ["群体", "群", "片", "组", "大群"],
				verbsActive: ["感染", "充斥" ],
				verbsDefeated: ["杀死", "清除"],
			},
			structure: {
				nouns: ["自动化结构"],
				groupNouns: ["组", "套"],
				verbsActive: ["被阻塞"],
				verbsDefeated: ["被禁用"],
			},
		},
		
		enemyLoot: {
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
				droppedIngredients: [ "res_bands", "res_bottle", "res_glowbug", "res_hairpin", "res_leather", "res_tape" ],
			},
			flora: {
				droppedResources: [ "food" ],
				droppedIngredients: [ "res_bottle", "res_glowbug", "res_silk" ],
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
			for (var type in this.enemyDefinitions) {
				for (let i in this.enemyDefinitions[type]) {
					var enemy = this.enemyDefinitions[type][i];
					if (enemy.id == enemyID) {
						return enemy;
					}
				}
			}
			log.w("no such enemy found: " + enemyID);
			return null;
		},
		
		getAll: function () {
			let result = [];
			for (var type in this.enemyDefinitions ) {
				for (let i in this.enemyDefinitions[type]) {
					var enemy = this.enemyDefinitions[type][i];
					result.push(enemy);
				}
			}
			return result;
		},
		
		getDifficulty: function (enemy) {
			return this.enemyDifficulties[enemy.id];
		}
		
	};
		
	
	return EnemyConstants;
	
});
