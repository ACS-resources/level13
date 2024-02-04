define(['ash', 'game/vos/PerkVO'], function (Ash, PerkVO) {
	
	var PerkConstants = {
	
		perkTypes: {
			injury: "Injury",
			movement: "Movement",
			health: "Health",
			stamina: "Stamina",
			light: "Light",
			luck: "Luck",
			visualNegative: "VisualN",
			visualPositive: "VisualP",
		},
		
		perkIds: {
			hunger: "hunger",
			thirst: "thirst",
			tired: "tired",
			blessed: "blessed",
			restartBonusSmall: "restart-small",
			restartBonusCompletion: "restart-completion",
			healthPenalty: "health--",
			healthBonus1: "health-1",
			healthBonus2: "health-2",
			healthBonus3: "health-3",
			hazardRadiation: "hazard-radiation",
			hazardPoison: "hazard-poison",
			hazardCold: "hazard-cold",
			encumbered: "encumbered",
			staminaBonus: "energized",
			staminaBonusPenalty: "headache",
			lightBeacon: "beacon",
		},
		
		perkDefinitions: {
			injury: [],
			health: [],
			stamina: [],
			movement: [],
			luck: [],
			visualNegative: [],
			visualPositive: [],
		},
		
		perkStatus: {
			ACTIVATING: 1,
			ACTIVE: 2,
			DEACTIVATING: 3,
		},
		
		injuryType: {
			BLUNT: "BLUNT",
			SHARP: "SHARP",
			FIRE: "FIRE",
			CHEMICAL: "CHEMICAL",
		},
		
		injuryLevel: {
			LIGHT: "LIGHT",
			MEDIUM: "MEDIUM",
			SERIOUS: "SERIOUS"
		},

		restartPerkIDs: [ "restart-small", "restart-completion" ],
		
		PERK_RECOVERY_FACTOR_REST: 3,
		TIMER_DISABLED: -1,
		
		ACTIVATION_TIME_HEALTH_DEBUFF: 30,
		
		addInjuryDefinition: function (injuryLevel, injuryType, idBase, name) {
			let id = "injury-" + injuryLevel.toLowerCase() + "-" + idBase;
			let effect = 1;
			
			switch (injuryLevel) {
				case PerkConstants.injuryLevel.LIGHT:
					effect = 0.9;
					levelAsNumber = 3;
					break;
				case PerkConstants.injuryLevel.MEDIUM:
					effect = 0.7;
					levelAsNumber = 2;
					break;
				case PerkConstants.injuryLevel.SERIOUS:
					effect = 0.5;
					levelAsNumber = 1;
					break;
			}
			
			let icon = "img/items/injury-" + levelAsNumber + ".png";
			let perkVO = new PerkVO(id, name, "Injury", effect, icon, 0);
			perkVO.injuryType = injuryType;
			
			PerkConstants.perkDefinitions.injury.push(perkVO);
		},
	
		getPerk: function (perkId, startTimer, removeTimer) {
			for (var key in this.perkDefinitions) {
				for (let i = 0; i < this.perkDefinitions[key].length; i++) {
					if (this.perkDefinitions[key][i].id === perkId) {
						let result = this.perkDefinitions[key][i].clone();
						result.setStartTimer(startTimer || PerkConstants.TIMER_DISABLED);
						result.setRemoveTimer(removeTimer || PerkConstants.TIMER_DISABLED);
						return result;
					};
				}
			}
			return null;
		},
		
		getRandomInjury: function (allowedTypes) {
			let options = [];
			
			for (let i = 0; i < PerkConstants.perkDefinitions.injury.length; i++) {
				let perk = PerkConstants.perkDefinitions.injury[i];
				if (!allowedTypes || allowedTypes.length == 0 || allowedTypes.indexOf(perk.injuryType) >= 0) {
					options.push(perk);
				}
			}
			
			return options[Math.floor(Math.random() * options.length)];
		},
		
		isPercentageEffect: function (perkType) {
			switch (perkType) {
				case this.perkTypes.health: return true;
				case this.perkTypes.injury: return true;
				case this.perkTypes.stamina: return true;
				case this.perkTypes.movement: return true;
				default: return false;
			}
		},

		isNegative: function (perk) {
			switch (perk.type) {
				case PerkConstants.perkTypes.injury:
				case PerkConstants.perkTypes.visualNegative:
					return true;
				case PerkConstants.perkTypes.movement:
					return perk.effect > 1;
				default:
					return perk.effect < 1;
			}
		},
		
		getCurrentEffect: function (perk) {
			var status = this.getStatus(perk);
			switch (status) {
				case PerkConstants.perkStatus.ACTIVE: return perk.effect;
				case PerkConstants.perkStatus.DEACTIVATING:
					return this.getPartialEffect(perk, perk.effectFactor);
				case PerkConstants.perkStatus.ACTIVATING:
					var activePercent = this.getPerkActivePercent(perk, true);
					return this.getPartialEffect(perk, activePercent);
			}
		},
		
		getPerkActivePercent: function (perk, round) {
			if (perk.removeTimer != PerkConstants.TIMER_DISABLED)
				return 1;
			if (perk.startTimer == PerkConstants.TIMER_DISABLED)
				return 1;
			var duration = perk.startTimerDuration || perk.startTimer;
			var activePercent = Math.min(1, 1 - perk.startTimer / duration);
			if (round) activePercent = Math.round(activePercent * 10) / 10;
			return activePercent;
		},
		
		getPartialEffect: function (perk, percent) {
			if (this.isPercentageEffect(perk.type)) {
				if (perk.effect > 1) {
					let mod = perk.effect - 1;
					return 1 + mod * percent;
				} else {
					let mod = 1 - perk.effect;
					return 1 - mod * percent;
				}
			} else {
				return perk.effect * percent;
			}
		},
		
		getStatus: function (perk) {
			if (perk.removeTimer != PerkConstants.TIMER_DISABLED) {
				return PerkConstants.perkStatus.DEACTIVATING;
			}
			if (perk.startTimer != PerkConstants.TIMER_DISABLED) {
				return PerkConstants.perkStatus.ACTIVATING;
			}
			return PerkConstants.perkStatus.ACTIVE;
		},
		
		getRemoveTimeFactor: function (perk, isResting) {
			return this.isNegative(perk) && isResting ? PerkConstants.PERK_RECOVERY_FACTOR_REST : 1;
		},
		
		getStartTimeFactor: function (perk, isResting) {
			return 1;
		},
		
	};
	
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.healthBonus1, "健康", "Health", 1.1, "img/items/health-positive.png"));
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.healthBonus2, "加强 (L1)", "Health", 1.25, "img/items/health-positive.png"));
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.healthBonus3, "加强 (L2)", "Health", 1.5, "img/items/health-positive.png"));
	
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.hunger, "饥饿", "Health", 0.75, "img/items/health-negative.png"));
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.thirst, "口渴", "Health", 0.75, "img/items/health-negative.png"));
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.hazardRadiation, "辐射症", "Health", 0.25, "img/items/health-negative.png"));
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.hazardPoison, "中毒", "Health", 0.5, "img/items/health-negative.png"));
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.hazardCold, "室温", "Health", 0.75, "img/items/health-negative.png"));
	
	PerkConstants.perkDefinitions.health.push(new PerkVO(PerkConstants.perkIds.encumbered, "劳累", "Movement", 1.5, "img/items/weight.png"));
	
	PerkConstants.perkDefinitions.stamina.push(new PerkVO(PerkConstants.perkIds.staminaBonus, "精力充沛", "Stamina", 1, "img/items/health-positive.png"));
	PerkConstants.perkDefinitions.stamina.push(new PerkVO(PerkConstants.perkIds.staminaBonusPenalty, "头疼", "Stamina", 0.9, "img/items/health-negative.png"));
	
	PerkConstants.perkDefinitions.stamina.push(new PerkVO(PerkConstants.perkIds.lightBeacon, "信标照射", "Light", 20, "img/items/perk-light-beacon.png"));
	
	PerkConstants.perkDefinitions.luck.push(new PerkVO(PerkConstants.perkIds.blessed, "幸运", "Luck", 20, "img/items/perk-blessed.png"));
	PerkConstants.perkDefinitions.luck.push(new PerkVO(PerkConstants.perkIds.restartBonusSmall, "逝魂之梦", "Luck", 10, "img/items/perk-restart.png"));
	PerkConstants.perkDefinitions.luck.push(new PerkVO(PerkConstants.perkIds.restartBonusCompletion, "逃脱之梦", "Luck", 30, "img/items/perk-restart.png"));
	
	PerkConstants.perkDefinitions.visualNegative.push(new PerkVO(PerkConstants.perkIds.tired, "疲惫", "VisualN", 0, "img/items/perk-tired.png"));
	
	let woundBodyParts = ["Leg", "Arm", "Head", "Foot", "Chest", "Hand"];
	for (let i = 0; i < woundBodyParts.length; i++) {
		let bodyPart = woundBodyParts[i];
		let id = "wounded-" + bodyPart.toLowerCase();
		
		if (bodyPart != "Head") {
			PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.LIGHT, PerkConstants.injuryType.SHARP, id, bodyPart + "伤口(轻伤)");
		}
		if (bodyPart != "Hand") {
			PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.SHARP, id, bodyPart + "伤口(中度)");
		}
		if (bodyPart != "Foot" && bodyPart != "Hand") {
			PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.SERIOUS, PerkConstants.injuryType.SHARP, id, bodyPart + "伤口(严重)");
		}
	}
	
	let bruiseBodyParts = ["Leg", "Arm", "Shoulder", "Knee"];
	for (let i = 0; i < bruiseBodyParts.length; i++) {
		let bodyPart = bruiseBodyParts[i];
		let id = "bruised-" + bodyPart.toLowerCase();
		
		PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.LIGHT, PerkConstants.injuryType.BLUNT, id, "瘀伤的" + bodyPart + "(轻伤)");
		PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.BLUNT, id, "瘀伤的" + bodyPart + "(中度)");
	}
	
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.LIGHT, PerkConstants.injuryType.FIRE, "burn-fire", "烧伤(轻伤)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.FIRE, "burn-fire", "烧伤(中度)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.SERIOUS, PerkConstants.injuryType.FIRE, "burn-fire", "烧伤(严重)");
	
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.LIGHT, PerkConstants.injuryType.CHEMICAL, "burn-chemical", "化学品烧伤(轻伤)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.CHEMICAL, "burn-chemical", "化学品烧伤(中度)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.SERIOUS, PerkConstants.injuryType.CHEMICAL, "burn-chemical", "化学品烧伤(严重)");
	
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.BLUNT, "sprained-ankle", "脚踝扭伤(中度)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.SERIOUS, PerkConstants.injuryType.BLUNT, "sprained-ankle", "脚踝扭伤(严重)");
	
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.BLUNT, "broken-wrist", "手腕骨裂(中度)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.SERIOUS, PerkConstants.injuryType.BLUNT, "broken-wrist", "手腕骨折(严重)");
	
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.BLUNT, "broken-thumb", "大拇指骨折(中度)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.BLUNT, "broken-finger", "手指骨折(中度)");
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.BLUNT, "broken-toe", "脚趾骨折(中度)");
	
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.MEDIUM, PerkConstants.injuryType.BLUNT, "dislocated-shoulder", "肩膀脱臼");
	
	PerkConstants.addInjuryDefinition(PerkConstants.injuryLevel.SERIOUS, PerkConstants.injuryType.BLUNT, "broken-rib", "肋骨骨折");
		
	return PerkConstants;
	
});
