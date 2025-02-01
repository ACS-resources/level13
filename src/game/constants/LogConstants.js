define(['ash', 'text/Text', 'game/constants/TextConstants', 'game/constants/ItemConstants', 'game/constants/ItemConstants'], function (Ash, Text, TextConstants, ItemConstants, MovementConstants) {

	let LogConstants = {

		MSG_VISIBILITY_DEFAULT: "MSG_VISIBILITY_DEFAULT",
		MGS_VISIBILITY_LEVEL: "MGS_VISIBILITY_LEVEL",
		MSG_VISIBILITY_PRIORITY: "MSG_VISIBILITY_PRIORITY",
		MSG_VISIBILITY_GLOBAL: "MSG_VISIBILITY_GLOBAL",

		// story
		MSG_ID_START: "START",

		// out actions
		MSG_ID_SCAVENGE: "SCAVENGE",
		MSG_ID_SCAVENGE_HEAP: "MSG_ID_SCAVENGE_HEAP",
		MSG_ID_SCOUT: "SCOUT",
		MSG_ID_SCOUT_FOUND_SOMETHING: "MSG_ID_SCOUT_FOUND_SOMETHING",
		MSG_ID_INVESTIGATE: "MSG_ID_INVESTIGATE",
		MSG_ID_USE_SPRING: "MSG_ID_USE_SPRING",
		MSG_ID_CLEAR_WASTE: "MSG_ID_CLEAR_WASTE",
		MSG_ID_CLEAR_DEBRIS: "MSG_ID_CLEAR_DEBRIS",
		MSG_ID_BRIDGED_GAP: "BRIDGED_GAP",
		MSG_ID_SCOUT_LOCALE: "SCOUT_LOCALE",
		MSG_ID_WORKSHOP_CLEARED: "WORKSHOP_CLEARED",
		MSG_ID_GANG_DEFEATED: "GANG_DEFEATED",
		MSG_ID_USE_COLLECTOR_FAIL: "USE_COLLECTOR_FAIL",
		MSG_ID_NAP: "MSG_ID_NAP",
		MSG_ID_WAIT: "MAS_ID_WAIT",

		// in actions
		MSG_ID_USE_CAMPFIRE_SUCC: "USE_CAMPFIRE_SUCC",
		MSG_ID_USE_CAMPFIRE_FAIL: "USE_CAMPFIRE_FAIL",
		MSG_ID_USE_LIBRARY: "MSG_ID_USE_LIBRARY",
		MSG_ID_USE_MARKET: "USE_MARKET",
		MSG_ID_USE_HOSPITAL: "USE_HOSPITAL",
		MSG_ID_USE_HOSPITAL2: "USE_HOSPITAL2",
		MSG_ID_USE_TEMPLE: "USE_TEMPLE",
		MSG_ID_USE_SHRINE: "USE_SHRINE",
		MSG_ID_BOUGHT_UPGRADE: "MSG_ID_BOUGHT_UPGRADE",
		MSG_ID_START_SEND_CAMP: "MSG_ID_START_SEND_CAMP",
		MSG_ID_FINISH_SEND_CAMP: "MSG_ID_FINISH_SEND_CAMP",
		MSG_ID_TRADE_WITH_CARAVAN: "MSG_ID_TRADE_WITH_CARAVAN",
		MSG_ID_RECRUIT: "MSG_ID_RECRUIT",

		// out atmospheric and results
		MSG_ID_ADD_HAZARD_PERK: "MSG_ID_ADD_HAZARD_PERK",
		MSG_ID_TIME_HAZARD_PERK: "MSG_ID_TIME_HAZARD_PERK",
		MSG_ID_REMOVE_HAZARD_PERK: "MSG_ID_REMOVE_HAZARD_PERK",
		MSG_ID_REMOVE_STAMINA_PERK: "MSG_ID_REMOVE_STAMINA_PERK",
		MSG_ID_FOUND_BLUEPRINT_FIRST: "MSG_ID_FOUND_BLUEPRINT_FIRST",
		MSG_ID_FOUND_BLUEPRINT_CONSECUTIVE: "MSG_ID_FOUND_BLUEPRINT_CONSECUTIVE",
		MSG_ID_FOUND_BLUEPRINT_LAST: "MSG_ID_FOUND_BLUEPRINT_LAST",
		MSG_ID_FOUND_ITEM_FIRST: "MSG_ID_FOUND_ITEM_FIRST",
		MSG_ID_LOST_ITEM: "MSG_ID_LOST_ITEM",
		MSG_ID_BROKE_ITEM: "MSG_ID_BROKE_ITEM",
		MSG_ID_LOST_EXPLORER: "MSG_ID_LOST_EXPLORER",
		MSG_ID_GOT_INJURED: "MSG_ID_GOT_INJURED",
		MSG_ID_FAINTED: "MSG_ID_FAINTED",
		MSG_ID_DESPAIR_AVAILABLE: "MSG_ID_DESPAIR_AVAILABLE",
		MSD_ID_MOVE_UNAVAILABLE: "MSD_ID_MOVE_UNAVAILABLE",
		MSG_ID_STAMINA_WARNING: "MSG_ID_STAMINA_WARNING",
		MSG_ID_VISION_RESET: "MSG_ID_VISION_RESET",
		MSG_ID_ENTER_OUTSKIRTS: "MSG_ID_ENTER_OUTSKIRTS",

		// in atmospheric and results
		MSG_ID_POPULATION_NATURAL: "POPULATION_NATURAL",
		MSG_ID_PLAYER_HUNGER: "MSG_ID_PLAYER_HUNGER",
		MSG_ID_AMBIENT_PLAYER: "MSG_ID_AMBIENT_PLAYER",
		MSG_ID_AMBIENT_CAMP: "MSG_ID_AMBIENT_CAMP",
		MSG_ID_CAMP_EVENT: "CAMP_EVENT",
		MSG_ID_BUILT_CAMP_LEVEL_POPULATION: "MSG_ID_BUILT_CAMP_LEVEL_POPULATION",
		MSG_ID_ENTER_LEVEL: "MSG_ID_ENTER_LEVEL",
		MSG_ID_REPUTATION_PENALTY_FOOD: "MSG_ID_REPUTATION_PENALTY_FOOD",
		MSG_ID_REPUTATION_PENALTY_WATER: "MSG_ID_REPUTATION_PENALTY_WATER",
		MSG_ID_REPUTATION_PENALTY_DEFENCES: "MSG_ID_REPUTATION_PENALTY_DEFENCES",
		MSG_ID_REPUTATION_PENALTY_HOUSING: "MSG_ID_REPUTATION_PENALTY_HOUSING",
		MDS_ID_EXPLORER_LEVEL_UP: "MDS_ID_EXPLORER_LEVEL_UP",

		// in buildings
		MSG_ID_BUILT_CAMP: "BUILT_CAMP",
		MSG_ID_BUILT_HOUSE: "BUILT_HOUSE",
		MSG_ID_BUILT_GENERATOR: "BUILT_GENERATOR",
		MSG_ID_BUILT_LIGHTS: "BUILT_LIGHTS",
		MSG_ID_BUILT_STORAGE: "BUILT_STORAGE",
		MSG_ID_BUILT_FORTIFICATION: "BUILT_FORTIFICATION",
		MSG_ID_BUILT_AQUEDUCT: "BUILT_AQUEDUCT",
		MSG_ID_BUILT_STABLE: "BUILT_STABLE",
		MSG_ID_BUILT_BARRACKS: "BUILT_BARRACKS",
		MSG_ID_BUILT_SMITHY: "BUILT_SMITHY",
		MSG_ID_BUILT_APOTHECARY: "BUILT_APOTHECARY",
		MSG_ID_BUILT_CEMENT_MILL: "BUILT_CEMENT_MILL",
		MSG_ID_BUILT_RADIO: "BUILT_RADIO",
		MSG_ID_BUILT_CAMPFIRE: "BUILT_CAMPFIRE",
		MSG_ID_BUILT_DARKFARM: "BUILT_DARKFARM",
		MSG_ID_BUILT_HOSPITAL: "BUILT_HOSPITAL",
		MSG_ID_BUILT_LIBRARY: "BUILT_LIBRARY",
		MSG_ID_BUILT_MARKET: "BUILT_MARKET",
		MSG_ID_BUILT_TRADING_POST: "BUILT_TRADING_POST",
		MSG_ID_BUILT_INN: "BUILT_INN",
		MSG_ID_BUILT_SQUARE: "MSG_ID_BUILT_SQUARE",
		MSG_ID_BUILT_GARDEN: "MSG_ID_BUILT_GARDEN",
		MSG_ID_BUILT_TEMPLE: "MSG_ID_BUILT_TEMPLE",
		MSG_ID_BUILT_SHRINE: "MSG_ID_BUILT_SHRINE",
		
		MSG_ID_IMPROVED_CAMPFIRE: "MSG_ID_IMPROVED_CAMPFIRE",
		MSG_ID_IMPROVED_LIBRARY: "MSG_ID_IMPROVED_LIBRARY",
		MSG_ID_IMPROVED_SQUARE: "MSG_ID_IMPROVED_SQUARE",
		MSG_ID_IMPROVED_GENERATOR: "MSG_ID_IMPROVED_GENERATOR",
		MSG_ID_IMPROVED_APOTHECARY: "MSG_ID_IMPROVED_APOTHECARY",
		MSG_ID_IMPROVED_SMITHY: "MSG_ID_IMPROVED_SMITHY",
		MSG_ID_IMPROVED_CEMENTMILL: "MSG_ID_IMPROVED_CEMENTMILL",
		MSG_ID_IMPROVED_MARKET: "MSG_ID_IMPROVED_MARKET",
		MSG_ID_IMPROVED_TEMPLE: "MSG_ID_IMPROVED_TEMPLE",

		// out buildings
		MSG_ID_BUILT_PASSAGE: "BUILT_PASSAGE",
		MSG_ID_BUILT_TRAP: "BUILT_TRAP",
		MSG_ID_BUILT_BUCKET: "BUILT_BUCKET",
		MSG_ID_BUILT_BEACON: "MSG_ID_BUILT_BEACON",
		MSG_ID_BUILT_SPACESHIP: "BUILT_SPACESHIP",

		// items
		MSG_ID_ADD_EXPLORER: "ADD_EXPLORER",
		MSG_ID_CRAFT_ITEM: "CRAFT_ITEM",
		MSG_ID_USE_FIRST_AID_KIT: "MSG_ID_USE_FIRST_AID_KIT",
		MSG_ID_USE_STAMINA_POTION: "MSG_ID_USE_STAMINA",
		MSG_ID_USE_SUPPLIES_CACHE: "MSG_ID_USE_SUPPLIES_CACHE",
		MSG_ID_USE_METAL_CACHE: "MSG_ID_USE_METAL_CACHE",
		MSG_ID_USE_BOOK: "MSG_ID_USE_BOOK",
		MSG_ID_USE_NEWSPAPER: "MSG_ID_USE_NEWSPAPER",
		MSG_ID_USE_SEED: "MSG_ID_USE_SEED",
		MSG_ID_USE_RESEARCHPAPER: "MSG_ID_USE_RESEARCHPAPER",
		MSG_ID_USE_MAP_PIECE: "MSG_ID_USE_MAP_PIECE",

		mergedMessages: [
			["SCAVENGE", "SCOUT", "SCOUT"],
		],
		
		getUniqueID: function () {
			return "unique-" + Math.floor(Math.random() * 100000);
		},

		isUniqueID: function (id) {
			return id.indexOf("unique-") == 0;
		},

		getCooldown: function (id) {
			let seconds = 0;
			let minutes = 0;

			switch (id) {
				case LogConstants.MSG_ID_ENTER_OUTSKIRTS: minutes = 10; break;
				case LogConstants.MSG_ID_AMBIENT_PLAYER: minutes = 3; break;
				case LogConstants.MSG_ID_AMBIENT_CAMP: minutes = 10; break;
			}

			return (minutes * 60 + seconds) * 1000;
		},

		getMergedMsgID: function (messages) {
			var messageIDsToMatch = [];
			for (var m = 0; m < messages.length; m++) {
				if (messages[m].logsgID) {
					messageIDsToMatch = messageIDsToMatch.concat(messages[m].logMsgID.split("-"));
				}
			}

			var mergeIDs;
			var allMatch;
			var messageID;
			for (let i = 0; i < this.mergedMessages.length; i++) {
				mergeIDs = this.mergedMessages[i];
				if (mergeIDs.length > messageIDsToMatch.length) continue;
				allMatch = true;
				for (let j = 0; j < messageIDsToMatch.length; j++) {
					messageID = messageIDsToMatch[j];
					if (mergeIDs.indexOf(messageID) < 0) allMatch = false;
				}
				if (allMatch) {
					return mergeIDs.join("-");
				}
			}
			return null;
		},

		getMergedMsgText: function (mergedId) {
			switch (mergedId) {
				case "SCAVENGE-SCOUT-SCOUT":
					return "继续探索. ";

				default:
					log.w("text not defined for merged log message: " + mergedId);
					return String(mergedId);
			}
		},

		getLostItemMessage: function (resultVO) {
			var template = TextConstants.getLogItemsText(resultVO.lostItems);
			template.msg = "丢失了" + template.msg + ". ";

			var intros = [];
			switch (resultVO.action) {
				default:
					intros.push("差点掉进一个街上的裂缝里面");
					intros.push("从烂地板里掉了下去");
					intros.push("翻栅栏的时候掉了一个东西");
					intros.push("在一些废管子上绊倒了");
					intros.push("口袋开了, 一些东西掉了出去");
					intros.push("被一些影子吓跑了, 一些东西也掉了");
					break;
			}
			var intro = intros[Math.floor(Math.random() * intros.length)];
			intro = intro + ". ";
			template.msg = intro + template.msg;

			return { msg: template.msg, replacements: template.replacements, values: template.values };
		},

		getBrokeItemMessage: function (resultVO) {
			var template = TextConstants.getLogItemsText(resultVO.brokenItems);
			template.msg = "弄坏了" + template.msg + ". ";

			var intros = [];
			switch (resultVO.action) {
				default:
					intros.push("差点掉进一个街上的裂缝里面");
					intros.push("从烂地板里掉了下去");
					intros.push("翻栅栏的时候掉了一个东西");
					intros.push("在一些废管子上绊倒了");
					intros.push("攀爬时掉了下来");
					break;
			}
			var intro = intros[Math.floor(Math.random() * intros.length)];
			intro = intro + ". ";
			template.msg = intro + template.msg;

			return { msg: template.msg, replacements: template.replacements, values: template.values };
		},

		getLostPerksMessage: function (resultVO) {
			return "丢失了强化.";
		},

		getDespairMessage: function (despairType) {
			if (despairType == MovementConstants.DESPAIR_TYPE_THIRST) {
				// NOTE: thirst perk will trigger message
				return null;
			}
			if (despairType == MovementConstants.DESPAIR_TYPE_HUNGRER) {
				// NOTE: hunger perk will trigger message
				return null;
			}
			if (despairType == MovementConstants.DESPAIR_TYPE_STAMINA) {
				// NOTE: will be logged when not able to move anymore
				return null;
			}
			if (despairType == MovementConstants.DESPAIR_TYPE_MOVEMENT) {
				return "无处可去了.";
			}

			return null;
		},

		getCantMoveMessage: function (despairType) {		
			if (despairType == MovementConstants.DESPAIR_TYPE_STAMINA) {
				return "走不动了.";
			}

			if (despairType == MovementConstants.DESPAIR_TYPE_THIRST) {
				return "没水了, 走不了了.";
			}
			if (despairType == MovementConstants.DESPAIR_TYPE_HUNGRER) {
				return "没食物了, 走不了了.";
			}

			return null;
		},

		getCraftItemMessage: function (itemVO) {
			var itemDetails = "";
			switch (itemVO.id) {
				case ItemConstants.itemDefinitions.light[0].id:
					itemDetails = "光会让拾荒更加安全.";
					break;
			}
			let itemName = ItemConstants.getItemDisplayName(itemVO);
			return "合成了" + Text.addArticle(itemName).toLowerCase() + "." + itemDetails;
		},

	}

	return LogConstants;

});
