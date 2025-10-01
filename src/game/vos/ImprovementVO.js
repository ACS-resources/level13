define(['ash', 'game/vos/ResourcesVO'], function (Ash, ResourcesVO) {
	
	// Global static definitions
	improvementNames = {
		camp: "营地",
		collector_food: "陷阱",
		collector_water: "水桶",
		beacon: "灯塔",
		
		passageUpStairs: "向上楼梯",
		passageUpElevator: "电梯（向上, 修复）",
		passageUpHole: "电梯（向上, 建造）",
		passageDownStairs: "向下楼梯",
		passageDownElevator: "电梯（向下, 修复）",
		passageDownHole: "电梯（向下, 建造）",
		spaceship1: "殖民船体",
		spaceship2: "殖民护盾",
		spaceship3: "殖民生命支持系统",
		greenhouse: "温室",
		tradepost_connector: "大电梯",
		sundome: "阳光穹顶",
		luxuryOutpost: "资源前哨站",
		
		home: "帐篷",
		house: "小屋",
		house2: "塔楼",
		storage: "储物箱",
		campfire: "篝火",
		darkfarm: "蜗牛养殖场",
		hospital: "诊所",
		generator: "发电机",
		tradepost: "贸易站",
		inn: "旅馆",
		apothecary: "药房",
		smithy: "铁匠铺",
		cementmill: "水泥厂",
		robotFactory: "机器人工厂",
		library: "图书馆",
		shrine: "神龛",
		temple: "寺庙",
		market: "市场",
		radiotower: "无线电塔",
		barracks: "军营",
		fortification: "防御工事",
		stable: "商队马厩",
		aqueduct: "引水渠",
		researchcenter: "研究中心",
		lights: "照明",
		square: "广场",
		garden: "苔藓花园",
	};
	
	improvementTypes = {
		camp: "营地",
		level: "层级",
	};
	
	var ImprovementVO = Ash.Class.extend({
	
		constructor: function (name) {
			this.name = name;
			this.count = 0;
			this.level = 1;
			this.numDamaged = 0;
			this.damagedSource = null;
			
			this.initStorage();
		},
	
		initStorage: function() {
			switch (this.name) {
				case improvementNames.collector_food:
					this.storedResources = new ResourcesVO();
					this.storageCapacity = new ResourcesVO();
					this.storageCapacity.food = 10;
					break;
				case improvementNames.collector_water:
					this.storedResources = new ResourcesVO();
					this.storageCapacity = new ResourcesVO();
					this.storageCapacity.water = 10;
					break;
			}
		},
		
		getType: function() {
			return getImprovementType(this.name);
		},
		
		getKey: function () {
			return this.name.toLowerCase().replace(" ", "-");
		},
		
		isPassage: function () {
			switch (this.name) {
				case improvementNames.passageUpStairs:
				case improvementNames.passageUpElevator:
				case improvementNames.passageUpHole:
				case improvementNames.passageDownStairs:
				case improvementNames.passageDownElevator:
				case improvementNames.passageDownHole:
					return true;
				default:
					return false;
			}
		},
		
		getVisCount: function () {
			switch (this.name) {
				case improvementNames.lights:
					return 4;
				case improvementNames.fortification:
					return 2;
				default:
					return 1;
			}
		},
		
		getCustomSaveObject: function () {
			let copy = {};
			copy.name = this.name;
			if (this.count !== 1) {
				copy.count = this.count;
			}
			if (this.level > 1) {
				copy.level = this.level;
			}
			if (this.numDamaged > 0) {
				copy.numDamaged = this.numDamaged;
			}
			if (this.damagedSource) {
				copy.damagedSource = this.damagedSource;
			}
			if (this.storedResources) copy.storedResources = this.storedResources.getCustomSaveObject();
			if (this.storageCapacity) copy.storageCapacity = this.storageCapacity.getCustomSaveObject();
			return copy;
		},

		customLoadFromSave: function (componentValues) {
			if (!componentValues) return;
			if (componentValues.name) this.name = componentValues.name;
			if (componentValues.count) this.count = componentValues.count;
			
			this.count = componentValues.count === 0 ? 0 : componentValues.count ? componentValues.count : 1;
			this.level = componentValues.level ? componentValues.level : 1;
			this.numDamaged = componentValues.numDamaged ? componentValues.numDamaged : 0;
			this.damagedSource = componentValues.damagedSource ? componentValues.damagedSource : null;
			
			if (this.storedResources) this.storedResources.customLoadFromSave(componentValues.storedResources);
			if (this.storageCapacity) this.storageCapacity.customLoadFromSave(componentValues.storageCapacity);
		},
	});
	
	// TODO move to ImprovementConstants
	
	getImprovementType = function (name) {
		if (!name) return null;
		switch (name) {
			case improvementNames.camp:
			case improvementNames.collector_food:
			case improvementNames.collector_water:
			case improvementNames.greenhouse:
			case improvementNames.spaceship1:
			case improvementNames.spaceship2:
			case improvementNames.spaceship3:
			case improvementNames.passageUpStairs:
			case improvementNames.passageUpElevator:
			case improvementNames.passageUpHole:
			case improvementNames.passageDownStairs:
			case improvementNames.passageDownElevator:
			case improvementNames.passageDownHole:
			case improvementNames.beacon:
			case improvementNames.tradepost_connector:
			case improvementNames.sundome:
			case improvementNames.luxuryOutpost:
				return improvementTypes.level;

			default:
				return improvementTypes.camp;
		}
	};
	
	return ImprovementVO;
});
