define(['ash', 'game/constants/OccurrenceConstants', 'game/constants/UIConstants'], function (Ash, OccurrenceConstants, UIConstants) {
	
	let TribeConstants = {
		
		milestones: [
			{
				name: "孤独营地",
				description: "为几个坚韧的流亡者提供的简陋避难所, 物资稀少",
				maxRumours: 100,
				maxEvidence: 100,
				maxHope: 0,
				maxInsight: 0,
				baseReputation: 0,
			},
			{
				name: "小型聚居地",
				description: "几个人称之为家的安全之地, 开始积累一些资源",
				maxRumours: 500,
				maxEvidence: 500,
				maxHope: 1,
				maxInsight: 0,
				baseReputation: 1,
				unlockedEvents: [ OccurrenceConstants.campOccurrenceTypes.raid ],
			},
			{
				name: "多层聚集地",
				description: "跨越多层区域的初步雏形",
				maxRumours: 800,
				maxEvidence: 500,
				maxHope: 10,
				maxInsight: 0,
				baseReputation: 2,
			},
			{
				name: "乐观的部落",
				description: "人数足够称之为部落的群体",
				maxRumours: 2000,
				maxEvidence: 1000,
				maxHope: 100,
				maxInsight: 0,
				baseReputation: 3,
			},
			{
				name: "城中之城",
				description: "拥有专业化分工和可靠食物生产方式的有组织社会",
				maxRumours: 3000,
				maxEvidence: 1500,
				maxHope: 300,
				maxInsight: 0,
				baseReputation: 4,
				unlockedFeatures: [ UIConstants.UNLOCKABLE_FEATURE_WORKER_AUTO_ASSIGNMENT ],
			},
			{
				name: "立体社会",
				description: "跨越多层区域的庞大部落",
				maxRumours: 8000,
				maxEvidence: 2000,
				maxHope: 600,
				maxInsight: 100,
				baseReputation: 5,
			},
			{
				name: "强势城邦",
				description: "不仅能够生存, 还能发展进步的社会",
				maxRumours: 15000,
				maxEvidence: 3000,
				maxHope: 1000,
				maxInsight: 200,
				baseReputation: 6,
			},
			{
				name: "文明重建",
				description: "在旧世界废墟中诞生的新文明",
				maxRumours: 20000,
				maxEvidence: 4000,
				maxHope: 1500,
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
				case TribeConstants.luxuryType.TRUFFLES: return "松露";
				case TribeConstants.luxuryType.CHOCOLATE: return "巧克力";
				case TribeConstants.luxuryType.COFFEE: return "咖啡";
				case TribeConstants.luxuryType.SPICES: return "香料";
				case TribeConstants.luxuryType.TOBACCO: return "烟草";
				case TribeConstants.luxuryType.TEA: return "茶叶";
				case TribeConstants.luxuryType.AMBER: return "琥珀";
				case TribeConstants.luxuryType.PEARLS: return "珍珠";
				case TribeConstants.luxuryType.IVORY: return "象牙";
				case TribeConstants.luxuryType.SALT: return "盐";
				case TribeConstants.luxuryType.DIAMONDS: return "钻石";
				case TribeConstants.luxuryType.EMERALDS: return "翡翠";
				case TribeConstants.luxuryType.GOLD: return "黄金";
				case TribeConstants.luxuryType.JADE: return "玉石";
				case TribeConstants.luxuryType.SILVER: return "白银";
				
				default:
					log.w("unknown luxury resource type: " + luxuryType);
					return luxuryType;
			}
		},
		
	};
	
	TribeConstants.init();
	
	return TribeConstants;
	
});
