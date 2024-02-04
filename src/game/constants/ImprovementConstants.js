define(['game/constants/CampConstants'], function (CampConstants) {
	
	var ImprovementConstants = {

		improvements: {
			beacon: {
				description: "发出亮光照亮一大片区域, 使得拾荒更加容易",
			},
			camp: {
				displayNames: [ "营地" ],
				canBeDismantled: false,
			},
			home: {
				displayNames: [ "帐篷" ],
				description: "营地之基",
				useActionName: "Rest",
				improvementLevelsPerTechLevel: 0,
				sortScore: 10000,
			},
			campfire: {
				displayNames: [ "篝火", "镇火", "永燃火" ],
				description: "增加传闻产量并解锁升级",
				useActionName: "坐下",
				improvementLevelsPerTechLevel: 5,
				improvementLevelsPerMajorLevel: 5,
				logMsgImproved: "Made the campfire a bit cozier",
			},
			house: {
				displayNames: [ "小屋", "房子" ],
				description: "A place for " + CampConstants.POPULATION_PER_HOUSE + " people to stay.",
				improvementLevelsPerTechLevel: 0,
				sortScore: 9000,
			},
			house2: {
				displayNames: [ "小高层" ],
				description: [ "可以住下" + CampConstants.POPULATION_PER_HOUSE2 + "人", "可以住下" + CampConstants.POPULATION_PER_HOUSE2_LEVEL_2 + "人" ],
				sortScore: 9000,
				improvementLevelsPerTechLevel: 1,
				improvementLevelsPerMajorLevel: 1,
			},
			storage: {
				displayNames: [ "仓库" ],
				description: "增加资源储量",
				improvementLevelsPerTechLevel: 1,
				sortScore: 8000,
			},
			hospital: {
				canBeDismantled: true,
				displayNames: [ "诊所", "医院", "医疗中心" ],
				description: "可以治疗创伤",
				useActionName: "治疗",
				useActionName2: "强化",
				improvementLevelsPerTechLevel: 1,
				improvementLevelsPerMajorLevel: 1,
			},
			market: {
				canBeDismantled: true,
				displayNames: [ "市场" ],
				description: "可以与外界游商贸易",
				useActionName: "访问",
				improvementLevelsPerTechLevel: 5,
				improvementLevelsPerMajorLevel: 5,
			},
			inn: {
				canBeDismantled: true,
				displayNames: [ "旅馆" ],
				description: "增加传闻产量, 同时允许招募追随者",
				improvementLevelsPerTechLevel: 5,
				improvementLevelsPerMajorLevel: 5,
			},
			library: {
				canBeDismantled: true,
				displayNames: [ "图书馆" ],
				description: "生成线索",
				useActionName: "学习",
				improvementLevelsPerTechLevel: 5,
				logMsgImproved: "升级了一下图书馆",
			},
			darkfarm: {
				canBeDismantled: true,
				displayNames: [ "暗农场" ],
				description: "生产食物",
				improvementLevelsPerTechLevel: 5,
				sortScore: 10,
			},
			aqueduct: {
				displayNames: [ "渡槽" ],
				description: "生产水",
				improvementLevelsPerTechLevel: 1,
			},
			temple: {
				canBeDismantled: true,
				displayNames: [ "庙" ],
				description: "用于宗教及文化用途的地方",
				useActionName: "施舍",
				improvementLevelsPerTechLevel: 5,
			},
			shrine: {
				canBeDismantled: true,
				displayNames: [ "寺" ],
				description: "与‘神’建立联系的地方",
				useActionName: "冥想",
				improvementLevelsPerTechLevel: 5,
				improvementLevelsPerMajorLevel: 5,
			},
			barracks: {
				canBeDismantled: true,
				displayNames: [ "军营" ],
				description: "增加士兵总量以加强营地防御",
				improvementLevelsPerTechLevel: 1,
			},
			apothecary: {
				canBeDismantled: true,
				displayNames: [ "药坊" ],
				description: "允许制药",
				improvementLevelsPerTechLevel: 5,
				sortScore: 50,
			},
			smithy: {
				canBeDismantled: true,
				displayNames: [ "铁匠铺" ],
				description: "给工具匠工作的地方",
				improvementLevelsPerTechLevel: 5,
				sortScore: 50,
			},
			cementmill: {
				canBeDismantled: true,
				displayNames: [ "水泥坊" ],
				description: "允许生产新的一种建筑材料",
				improvementLevelsPerTechLevel: 5,
				sortScore: 50,
			},
			stable: {
				canBeDismantled: true,
				displayNames: [ "篷车马厩" ],
				description: "打包贸易篷车的地方",
 				improvementLevelsPerTechLevel: 1,
			},
			fortification: {
				canBeDismantled: true,
				displayNames: [ "要塞" ],
				description: "加强营地防御",
				improvementLevelsPerTechLevel: 5,
				improvementLevelsPerMajorLevel: 5,
			},
			researchcenter: {
				canBeDismantled: true,
				displayNames: [ "研究中心" ],
				description: "生成线索",
				improvementLevelsPerTechLevel: 5,
			},
			tradepost: {
				displayNames: [ "贸易站" ],
				description: "将营地纳入贸易网络(营地互通)",
				improvementLevelsPerTechLevel: 1,
				improvementLevelsPerMajorLevel: 1,
			},
			radiotower: {
				displayNames: [ "无线电塔" ],
				canBeDismantled: true,
				description: "增加名誉",
				improvementLevelsPerTechLevel: 5,
			},
			robotFactory: {
				canBeDismantled: true,
				displayNames: [ "机械工厂" ],
				description: "允许生产和储存工作机器人",
				improvementLevelsPerTechLevel: 1,
				logMsgImproved: "Modernized the robot factory"
			},
			lights: {
				canBeDismantled: true,
				displayNames: [ "灯" ],
				description: "让光明净化一切污秽",
			},
			square: {
				canBeDismantled: true,
				displayNames: [ "广场" ],
				description: "放松和娱乐的绝佳去处",
				improvementLevelsPerTechLevel: 1,
			},
			garden: {
				canBeDismantled: true,
				displayNames: [ "小花园" ],
				description: "水泥森林之中的一线美好",
 				improvementLevelsPerTechLevel: 1,
			},
			generator: {
				canBeDismantled: true,
				displayNames: [ "发电机" ],
				description: "增加每栋房子带来的名誉加成(" + CampConstants.REPUTATION_PER_HOUSE_FROM_GENERATOR + "%每个房子).",
				improvementLevelsPerTechLevel: 10,
				logMsgImproved: "Fixed up the generator",
			},
			collector_water: {
				improvementLevelsPerTechLevel: 1,
			},
			collector_food: {
				improvementLevelsPerTechLevel: 1,
			},
			greenhouse: {
				isProject: true,
			},
			luxuryOutpost: {
				isProject: true,
			},
			passageUpStairs: {
				isPassage: true,
				isProject: true,
			},
			passageUpElevator: {
				isPassage: true,
				isProject: true,
			},
			passageUpHole: {
				isPassage: true,
				isProject: true,
			},
			passageDownStairs: {
				isPassage: true,
				isProject: true,
			},
			passageDownElevator: {
				isPassage: true,
				isProject: true,
			},
			passageDownHole: {
				isPassage: true,
				isProject: true,
			},
			tradepost_connector: {
				isProject: true,
			},
			spaceship1: {
				isProject: true,
			},
			spaceship2: {
				isProject: true,
			},
			spaceship3: {
				isProject: true,
			},
			sundome: {
				isProject: true,
			},
		},
		
		getDef: function (improvementID) {
			let def = this.improvements[improvementID];
			if (!def) {
				let id = this.getImprovementID(improvementID);
				def = this.improvements[id];
			}
			if (!def) {
				log.w("no improvement def found: " + improvementID);
				return {};
			}
			return def;
		},
		
		getMaxLevel: function (improvementID, techLevel) {
			techLevel = techLevel || 1;
			let def = this.getDef(improvementID);
			if (!def) return 1;
			
			let improvementLevelsPerTechLevel = def.improvementLevelsPerTechLevel || 0;
			
			return Math.max(1, improvementLevelsPerTechLevel * techLevel);
		},
		
		getRequiredTechLevelForLevel: function (improvementID, level) {
			let def = this.getDef(improvementID);
			if (!def) return 1;
			
			let improvementLevelsPerTechLevel = def.improvementLevelsPerTechLevel || 0;
			if (improvementLevelsPerTechLevel < 1) {
				return 1;
			}
			
			return Math.ceil(level / improvementLevelsPerTechLevel);
		},
		
		getMajorLevel: function (improvementID, level) {
			let def = this.getDef(improvementID);
			if (!def) return 1;
			
			let improvementLevelsPerMajorLevel = def.improvementLevelsPerMajorLevel || 0;
			if (improvementLevelsPerMajorLevel < 1) {
				return 1;
			}
			
			return Math.ceil(level / improvementLevelsPerMajorLevel);
		},
		
		getImprovementID: function (improvementName) {
			for (var key in improvementNames) {
				var name = improvementNames[key];
				if (name == improvementName) return key;
			}
			return null;
		},
		
		getImprovementDisplayName: function (improvementID, level) {
			level = level || 1;
			let def = this.getDef(improvementID);
			let result = improvementNames[improvementID] || "[" + improvementID + "]";
			if (!def) return result;
			let names = def.displayNames;
			if (!names || names.length == 0) return result;
			let majorLevel = this.getMajorLevel(improvementID, level);
			let index = Math.min(majorLevel - 1, names.length - 1);
			return names[index];
		},
		
		getImproveActionName: function (improvementName) {
			let improvementID = ImprovementConstants.getImprovementID(improvementName);
			let improvementType = getImprovementType(improvementName);
			if (improvementType == improvementTypes.camp) {
				return "improve_in_" + improvementID;
			} else {
				return "improve_out_" + improvementID;
			}
		},
		
		getImprovementDescription: function (improvementID, level) {
			level = level || 1;
			let def = this.getDef(improvementID);
			if (!def) return "";
			let descriptions = def.description;
			if (!descriptions || descriptions.length == 0) return "";
			if (typeof descriptions === "string") return descriptions;
			let majorLevel = this.getMajorLevel(improvementID, level);
			let index = Math.min(majorLevel - 1, descriptions.length - 1);
			return descriptions[index];
		},
		
		isProject: function (improvementName) {
			let improvementID = ImprovementConstants.getImprovementID(improvementName);
			let improvementDef = ImprovementConstants.getDef(improvementID);
			return improvementDef && improvementDef.isProject;
		},
		
		getImprovementActionOrdinalForImprovementLevel: function (improvementLevel) {
			return improvementLevel - 1;
		},
		
		getImprovedLogMessage: function (improvementID, level) {
			let def = this.getDef(improvementID);
			return def && def.logMsgImproved ? def.logMsgImproved : "改良了" + this.getImprovementDisplayName(improvementID, level);
		}

	};
	return ImprovementConstants;
});
