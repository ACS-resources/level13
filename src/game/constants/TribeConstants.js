define(['ash', 'game/constants/OccurrenceConstants', 'game/constants/UIConstants'], function (Ash, OccurrenceConstants, UIConstants) {
	
	let TribeConstants = {
		
		milestones: [
			{
				name: "孤独营地",
				description: "一些身无一物却坚强的被遗弃者的小营地",
				maxRumours: 100,
				maxEvidence: 300,
				maxHope: 0,
				maxInsight: 0,
				baseReputation: 0,
			},
			{
				name: "小定居点",
				description: "被几个人称之为家的安全地带, 而且正在积攒一些资源",
				maxRumours: 500,
				maxEvidence: 400,
				maxHope: 0,
				maxInsight: 0,
				baseReputation: 1,
				unlockedEvents: [ OccurrenceConstants.campOccurrenceTypes.raid ],
			},
			{
				name: "多层聚居点",
				description: "一个横跨多层的聚居地的开始",
				maxRumours: 1000,
				maxEvidence: 500,
				maxHope: 0,
				maxInsight: 0,
				baseReputation: 2,
			},
			{
				name: "欣欣向荣的聚落",
				description: "可以称之为聚落啦",
				maxRumours: 3000,
				maxEvidence: 700,
				maxHope: 100,
				maxInsight: 0,
				baseReputation: 3,
			},
			{
				name: "城中之城",
				description: "一个有稳定食物供应和劳动力分工的有序社会",
				maxRumours: 5000,
				maxEvidence: 900,
				maxHope: 400,
				maxInsight: 0,
				baseReputation: 4,
				unlockedFeatures: [ UIConstants.UNLOCKABLE_FEATURE_WORKER_AUTO_ASSIGNMENT ],
			},
			{
				name: "多元社会",
				description: "横跨多层的大型聚落",
				maxRumours: 10000,
				maxEvidence: 1200,
				maxHope: 500,
				maxInsight: 100,
				baseReputation: 5,
			},
			{
				name: "主导势力",
				description: "一个社会, 证明了其不仅可以生存, 更可以向前发展",
				maxRumours: 15000,
				maxEvidence: 3000,
				maxHope: 1000,
				maxInsight: 200,
				baseReputation: 6,
			},
			{
				name: "重建的文明",
				description: "涅槃于失落文明的新生",
				maxRumours: 20000,
				maxEvidence: 6000,
				maxHope: 2000,
				maxInsight: 500,
				baseReputation: 8,
			},
		],
		
		luxuryType: {
			// consumable
			CHOCOLATE: "CHOCOLATE",
			COFFEE: "COFFEE",
			HONEY: "HONEY",
			OLIVES: "OLIVES",
			SALT: "SALT",
			SPICES: "SPICES",
			TEA: "TEA",
			TOBACCO: "TOBACCO",
			TRUFFLES: "TRUFFLES",
			// materials
			AMBER: "AMBER",
			DIAMONDS: "DIAMONDS",
			EMERALDS: "EMERALDS",
			GOLD: "GOLD",
			IVORY: "IVORY",
			JADE: "JADE",
			PEARLS: "PEARLS",
			SILVER: "SILVER",
		},
		
		possibleLuxuriesByCampOrdinal: [
			{ campOrdinal: 3, possibleLuxuries: [ "CHOCOLATE", "COFFEE", "TEA", "DIAMONDS", "JADE" ] },
			{ campOrdinal: 6, possibleLuxuries: [ "COFFEE", "SALT", "TEA", "AMBER", "GOLD", "JADE", "SILVER", "EMERALDS" ] },
			{ campOrdinal: 8, possibleLuxuries: [ "COFFEE", "HONEY", "TRUFFLES", "OLIVES", "SALT", "AMBER", "PEARLS" ] },
			{ campOrdinal: 10, possibleLuxuries: [ "CHOCOLATE", "COFFEE", "SPICES", "TOBACCO", "DIAMONDS", "EMERALDS", "GOLD", "SILVER" ] },
			{ campOrdinal: 13, possibleLuxuries: [ "CHOCOLATE", "COFFEE", "IVORY", "TOBACCO" ] },
			{ campOrdinal: 15, possibleLuxuries: [ "CHOCOLATE", "COFFEE", "HONEY", "OLIVES", "IVORY", "PEARLS", "SPICES" ] },
		],
		
		init: function () {
			for (let i = 0; i < this.milestones.length; i++) {
				this.milestones[i].index = i;
			}
		},
		
		getMilestone: function (i) {
			let milestone = this.milestones[i] || {};
			milestone.index = i;
			return milestone;
		},
		
		getPreviousMilestone: function (milestone) {
			let previousIndex = milestone.index - 1;
			if (previousIndex < 0) return null;
			return this.milestones[previousIndex];
		},
		
		getNextMilestone: function (milestone) {
			let nextIndex = milestone.index + 1;
			if (nextIndex >= this.milestones.length) return null;
			return this.milestones[nextIndex];
		},
		
		getPossibleLuxuriesByCampOrdinal: function (campOrdinal) {
			for (let i = 0; i < this.possibleLuxuriesByCampOrdinal.length; i++) {
				let entry = this.possibleLuxuriesByCampOrdinal[i];
				if (entry.campOrdinal == campOrdinal) {
					return entry.possibleLuxuries;
				}
			}
			return [];
		},
		
		getMaxNumAvailableLuxuryResources: function (campOrdinal) {
			let result = 0;
			for (let i = 0; i < this.possibleLuxuriesByCampOrdinal.length; i++) {
				let entry = this.possibleLuxuriesByCampOrdinal[i];
				if (entry.campOrdinal <= campOrdinal) {
					result++;
				}
			}
			return result;
		},
		
		getLuxuryDisplayName: function (luxuryType) {
			switch (luxuryType) {
				case TribeConstants.luxuryType.HONEY: return "蜂蜜";
				case TribeConstants.luxuryType.OLIVES: return "橄榄";
				case TribeConstants.luxuryType.TRUFFLES: return "块菌";
				case TribeConstants.luxuryType.CHOCOLATE: return "巧克力";
				case TribeConstants.luxuryType.COFFEE: return "咖啡";
				case TribeConstants.luxuryType.SPICES: return "香料";
				case TribeConstants.luxuryType.TOBACCO: return "烟草";
				case TribeConstants.luxuryType.TEA: return "茶";
				case TribeConstants.luxuryType.AMBER: return "琥珀";
				case TribeConstants.luxuryType.PEARLS: return "珍珠";
				case TribeConstants.luxuryType.IVORY: return "象牙";
				case TribeConstants.luxuryType.SALT: return "纱露朵";
				case TribeConstants.luxuryType.DIAMONDS: return "钻石";
				case TribeConstants.luxuryType.EMERALDS: return "翡翠";
				case TribeConstants.luxuryType.GOLD: return "金锭";
				case TribeConstants.luxuryType.JADE: return "玉石";
				case TribeConstants.luxuryType.SILVER: return "银锭";
				
				default:
					log.w("unknown luxury resource type: " + luxuryType);
					return luxuryType;
			}
		},
		
	};
	
	TribeConstants.init();
	
	return TribeConstants;
	
});
