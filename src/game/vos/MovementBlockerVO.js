define(['ash', 'game/constants/MovementConstants'], function (Ash, MovementConstants) {
	
	var MovementBlockerVO = Ash.Class.extend({
	
		constructor: function (type) {
			this.type = type;
			this.name = this.getName();
			this.bridgeable = type === MovementConstants.BLOCKER_TYPE_GAP;
			this.cleanable = type === MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE || MovementConstants.BLOCKER_TYPE_WASTE_TOXIC;
			this.defeatable = type === MovementConstants.BLOCKER_TYPE_GANG;
			
			this.actionBaseID = this.getActionBaseId();
		},
		
		getName: function () {
			switch (this.type) {
				case MovementConstants.BLOCKER_TYPE_GAP: return "缺口";
				case MovementConstants.BLOCKER_TYPE_WASTE_TOXIC: return "有毒废物";
				case MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE: return "放射性废物";
				case MovementConstants.BLOCKER_TYPE_GANG: return "帮派";
				case MovementConstants.BLOCKER_TYPE_DEBRIS: return "残骸";
				case MovementConstants.BLOCKER_TYPE_EXPLOSIVES: return "爆炸物";
				case MovementConstants.BLOCKER_TYPE_TOLL_GATE: return "收费站";
			}
		},
		
		getActionBaseId: function () {
			switch (this.type) {
				case MovementConstants.BLOCKER_TYPE_GAP: return "bridge_gap";
				case MovementConstants.BLOCKER_TYPE_WASTE_TOXIC: return "clear_waste_t";
				case MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE: return "clear_waste_r";
				case MovementConstants.BLOCKER_TYPE_GANG: return "fight_gang";
				case MovementConstants.BLOCKER_TYPE_DEBRIS: return "clear_debris";
				case MovementConstants.BLOCKER_TYPE_EXPLOSIVES: return "clear_explosives";
				case MovementConstants.BLOCKER_TYPE_TOLL_GATE: return "clear_gate";
			}
		},
		
	});

	return MovementBlockerVO;
});
