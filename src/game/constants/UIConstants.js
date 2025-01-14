// Singleton with helper methods for UI elements used throughout the game
define(['ash',
	'game/GameGlobals',
	'game/constants/ColorConstants',
	'game/constants/StoryConstants',
	'game/constants/PositionConstants',
	'game/constants/SectorConstants',
	'game/constants/FollowerConstants',
	'game/constants/ItemConstants',
	'game/constants/BagConstants',
	'game/constants/PerkConstants',
	'game/constants/UpgradeConstants',
	'game/constants/PlayerActionConstants',
	'game/components/common/PositionComponent',
	'game/components/common/CampComponent',
	'game/components/sector/SectorStatusComponent',
	'game/components/sector/SectorLocalesComponent',
	'game/components/sector/PassagesComponent',
	'utils/UIAnimations'
], function (Ash, GameGlobals,
	ColorConstants, StoryConstants, PositionConstants, SectorConstants, FollowerConstants, ItemConstants, BagConstants, PerkConstants, UpgradeConstants, PlayerActionConstants,
	PositionComponent, CampComponent, SectorStatusComponent, SectorLocalesComponent,
	PassagesComponent, UIAnimations) {

	var UIConstants = {

		FEATURE_MISSING_TITLE: "Missing feature",
		FEATURE_MISSING_COPY: "This feature is not yet implemented. Come back later!",

		MAP_MINIMAP_SIZE: 7,
		SCROLL_INDICATOR_SIZE: 5,

		SMALL_LAYOUT_THRESHOLD: 850,  // make sure this corresponds to something in gridism.css
		
		UNLOCKABLE_FEATURE_WORKER_AUTO_ASSIGNMENT: "workerAutoAssignment",
		UNLOCKABLE_FEATURE_MAP_MODES: "mapModes",
		
		ICON_FALLBACK: "img/eldorado/icon_placeholder.png",
		
		LAUNCH_FADEOUT_DURATION: 1000,
		THEME_TRANSITION_DURATION: 1200,

		names: {
			resources: {
				stamina: "耐力",
				resource_metal: "金属",
				resource_fuel: "燃料",
				resource_rubber: "橡胶",
				resource_rope: "绳子",
				resource_food: "食物",
				resource_water: "水",
				resource_concrete: "水泥",
				resource_herbs: "药草",
				resource_medicine: "药品",
				resource_tools: "工具",
				resource_robots: "机器人",
				item_exploration_1: "撬锁钳",
				rumours: "传闻",
				evidence: "证据",
				insight: "洞察",
			}
		},
		
		getIconOrFallback: function (icon) {
			if (icon) return icon;
			return this.ICON_FALLBACK;
		},

		getItemDiv: function (itemsComponent, item, count, calloutContent, hideComparisonIndicator) {
			var url = item ? item.icon : null;
			var hasCount = count || count === 0;

			var classes = "item";
			if (item && item.equipped) classes += " item-equipped";
			if (item && item.broken) classes += " item-broken";
			if (hasCount) classes += " item-with-count";
			
			let div = "";

			if (item && calloutContent) {
				div += "<div class='info-callout-target info-callout-target-small' description='" + this.cleanupText(calloutContent) + "'>";
			}
			
			div += "<div class='" + classes + (item ? "' data-itemid='" + item.id + "' data-iteminstanceid='" + item.itemID + "'>" : ">");

			if (item) div += "<img src='" + url + "' alt='" + item.name + "'/>";

			if (hasCount)
				div += "<div class='item-count lvl13-box-1 vision-text'>" + count + "x </div>";

			if (!hideComparisonIndicator && item && item.equippable) {
				var comparisonClass = "indicator-even";
				if (item.equipped) {
					comparisonClass = "indicator-equipped";
				} else {
					var comparison = itemsComponent.getEquipmentComparison(item);
					if (comparison > 0) {
						comparisonClass = "indicator-increase";
					} else if (comparison < 0) {
						comparisonClass = "indicator-decrease";
					}
				}
				div += "<div class='item-comparison-badge'><div class='item-comparison-indicator " + comparisonClass + "'/></div>";
			}

			if (calloutContent) div += "</div>";

			div += "</div>"

			return div;
		},
		
		getItemSlot: function (itemsComponent, item, count, isLost, simple, showBagOptions, bagOptions, tab) {
			let itemCategory = ItemConstants.getItemCategory(item);
			let itemDev = this.getItemDiv(itemsComponent, item, count, this.getItemCallout(item, false, showBagOptions, bagOptions, tab));
			let imageDiv = "<div class='item-slot-image'>"+ itemDev + "</div>";
			let liclasses = "item-slot item-slot-small lvl13-box-1 ";
			if (simple) liclasses += "item-slot-simple";
			if (isLost) liclasses += "item-slot-lost";
			if (itemCategory == ItemConstants.itemCategories.equipment) liclasses += " item-slot-equipment";
			if (itemCategory == ItemConstants.itemCategories.ingredient) liclasses += " item-slot-ingredient";
			if (itemCategory == ItemConstants.itemCategories.consumable) liclasses += " item-slot-consumable";
			if (itemCategory == ItemConstants.itemCategories.other) liclasses += " item-slot-other";
			return "<li class='" + liclasses + "'>" + imageDiv + "</li>"
		},

		updateItemSlot: function (slot, count) {
			var $slot = this.parseElement(slot);
			if (!$slot) return;
			$slot.find(".item-count").text(count + "x");
			GameGlobals.uiFunctions.toggle($slot, count > 0);
		},

		getItemCallout: function (item, smallCallout, showBagOptions, bagOptions, tab) {
			if (!item) return "";
			var detail = " (" + this.getItemBonusDescription(item, false) + ")";
			if (detail.length < 5) detail = "";
			var weight = BagConstants.getItemCapacity(item);
			var itemCalloutContent = "<b>" + item.name + "</b><br/>Type: " + ItemConstants.getItemTypeDisplayName(item.type, false) + " " + detail;
			itemCalloutContent += "</br>Weight: " + weight;
			if (ItemConstants.hasItemTypeQualityLevels(item.type)) {
				let quality = ItemConstants.getItemQuality(item);
				itemCalloutContent += "</br>Quality: " + ItemConstants.getQualityDisplayName(quality);
			}
			if (item.broken) itemCalloutContent += "<br><span class='warning'>Broken</span>";
			itemCalloutContent += "</br>" + ItemConstants.getItemDescription(item);
			if (smallCallout) itemCalloutContent = item.name + (detail.length > 0 ? " " + detail : "");
			
			var makeButton = function (action, name) {
				if (!tab) {
					 return "<button class='action btn-narrow' action='" + action + "'>" + name + "</button>";
				} else {
					 return "<button class='action tabbutton btn-narrow' data-tab='" + tab + "' action='" + action + "'>" + name + "</button>";
				}
			};

			if (showBagOptions) {
				let options = "<div class='item-bag-options'>";

				if (bagOptions.canUse) {
					var action = "use_item_" + item.id;
					options += makeButton(action, ItemConstants.getUseItemVerb(item));
				}

				if (bagOptions.canRepair) {
					var action = "repair_item_" + item.itemID;
					options += makeButton(action, "修复");
				}

				if (bagOptions.canEquip) {
					var action = "equip_" + item.itemID;
					options += makeButton(action, "装配");
				} else if (bagOptions.canUnequip) {
					var action = "unequip_" + item.id;
					options += makeButton(action, "卸下");
				}

				if (bagOptions.canDiscard) {
					var action = "discard_" + item.id;
					options += makeButton(action, "丢弃");
				}

				options += "</div>";
				itemCalloutContent += options;
			}

			return itemCalloutContent;
		},

		getItemList: function (items) {
			var html = "";
			var itemsCounted = {};
			var itemsById = {};
			for (let i = 0; i < items.length; i++) {
				if (typeof itemsCounted[items[i].id] === 'undefined') {
					itemsCounted[items[i].id] = 1;
					itemsById[items[i].id] = items[i];
				} else {
					itemsCounted[items[i].id]++;
				}
			}

			for (var key in itemsById) {
				var item = itemsById[key];
				var amount = itemsCounted[key];
				html += "<li>" + this.getItemDiv(itemsComponent, item, amount, this.getItemCallout(item, true)) + "</li>";
			}
			return html;
		},
		
		getFollowerDiv: function (follower, isRecruited, isInCamp, hideComparisonIndicator) {
			let classes = "item";
			let div = "<div class='" + classes + "' data-followerid='" + follower.id + "'>";
			let calloutContent = this.getFollowerCallout(follower, isRecruited, isInCamp);
			
			div += "<div class='info-callout-target info-callout-target-small' description='" + this.cleanupText(calloutContent) + "'>";
			div += "<img src='" + follower.icon + "' alt='" + follower.name + "'/>";
			
			if (!hideComparisonIndicator) {
				div += "<div class='item-comparison-badge'><div class='item-comparison-indicator indicator-even'/></div>";
			}
			
			div += "</div>";
			div += "</div>"
			
			return div;
		},
		
		getFollowerCallout: function (follower, isRecruited, isInCamp) {
			let followerType = FollowerConstants.getFollowerTypeForAbilityType(follower.abilityType);
			let result = "<b>" + follower.name + "</b>";
			if (isRecruited) {
				result += "<br/>是否在小队中: " + (follower.inParty ? "yes" : "no");
			}
			result += "<br/>Type: " + FollowerConstants.getFollowerTypeDisplayName(followerType);
			result += "<br/>Ability: " + FollowerConstants.getAbilityTypeDisplayName(follower.abilityType)
				+ " (" + UIConstants.getFollowerAbilityDescription(follower) + ")";
			
			if (isRecruited && isInCamp) {
				var makeButton = function (action, name) {
					 return "<button class='action btn-narrow' action='" + action + "'>" + name + "</button>";
				};

				var options = "<div class='item-bag-options'>";
				options += makeButton("dismiss_follower_" + follower.id, "遣散");
				if (!follower.inParty) {
					options += makeButton("select_follower_" + follower.id, "加入小队");
				} else {
					options += makeButton("deselect_follower_" + follower.id, "换出");
				}
				options += "</div>";
				result += options;
			}

			return result;
		},
		
		getFollowerAbilityDescription: function (follower) {
			switch (follower.abilityType) {
				case FollowerConstants.abilityType.ATTACK:
				case FollowerConstants.abilityType.DEFENCE:
					let att = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.fight_att);
					let def = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.fight_def);
					return "攻 +" + att + ", 防 +" + def;
				case FollowerConstants.abilityType.COST_MOVEMENT:
					let movementCostReduction = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.movement);
					return "移动成本 -" + UIConstants.getMultiplierBonusDisplayValue(movementCostReduction);
				case FollowerConstants.abilityType.COST_SCAVENGE:
					let scavengeCostReduction = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.scavenge_cost);
					return "拾荒成本 -" + UIConstants.getMultiplierBonusDisplayValue(scavengeCostReduction);
				case FollowerConstants.abilityType.COST_SCOUT:
					let scoutCostReduction = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.scout_cost);
					return "探索成本 -" + UIConstants.getMultiplierBonusDisplayValue(scoutCostReduction);
				case FollowerConstants.abilityType.DETECT_HAZARDS:
					return "了解未到达区域的危害";
				case FollowerConstants.abilityType.DETECT_SUPPLIES:
					return "了解未到达当前区域及相邻区域的补给";
				case FollowerConstants.abilityType.DETECT_INGREDIENTS:
					return "了解未到达当前区域及相邻区域的合成材料";
				case FollowerConstants.abilityType.SCAVENGE_GENERAL:
					let scaBonus = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.scavenge_general);
					return "+" + UIConstants.getMultiplierBonusDisplayValue(scaBonus) + " 拾荒获得额外物品概率";
				case FollowerConstants.abilityType.SCAVENGE_INGREDIENTS:
					let ingredientBonus = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.scavenge_ingredients);
					return "+" + UIConstants.getMultiplierBonusDisplayValue(ingredientBonus) + " 拾荒获得合成材料概率";
				case FollowerConstants.abilityType.SCAVENGE_SUPPLIES:
					let suppliesBonus = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.scavenge_supplies);
					return "+" + UIConstants.getMultiplierBonusDisplayValue(suppliesBonus) + " 拾荒获得额外补给概率";
				case FollowerConstants.abilityType.SCAVENGE_CAPACITY:
					let capacityBonus = FollowerConstants.getFollowerItemBonus(follower, ItemConstants.itemBonusTypes.bag);
					return "+" + capacityBonus + " 物品容量";
				default:
					log.w("no display name defined for abilityType: " + follower.abilityType);
					return follower.abilityType;
			}
		},

		getResourceLi: function (name, amount, isLost, simple) {
			var divclasses = "res item-with-count";
			var div = "<div class='" + divclasses + "' data-resourcename='" + name + "'>";
			div += "<div class='info-callout-target info-callout-target-small' description='" + name + "'>";
			div += this.getResourceImg(name);
			if (amount || amount === 0)
				div += "<div class='item-count lvl13-box-1'>" + Math.floor(amount) + "x</div>";
			div += "</div>";
			div += "</div>";
			var liclasses = "item-slot item-slot-small lvl13-box-1 ";
			if (simple) liclasses += "item-slot-simple";
			if (isLost) liclasses += "item-slot-lost";
			var imageDiv = "<div class='item-slot-image'>" + div + "</div>";
			return "<li class='" + liclasses + "'>" + imageDiv + "</li>";
		},

		updateResourceLi: function (li, amount) {
			var $li = this.parseElement(li);
			if (!$li) return;
			var showAmount = Math.floor(amount);
			$li.find(".item-count").text(showAmount + "x");
			GameGlobals.uiFunctions.toggle($li, showAmount > 0);
		},

		getCurrencyLi: function (amount, simple) {
			var classes = "res item-with-count";
			var div = "<div class='" + classes + "' data-resourcename='货币'>";
			div += "<div class='info-callout-target info-callout-target-small' description='银'>";
			div += this.getResourceImg("currency");
			div += "<div class='item-count lvl13-box-1'>" + Math.floor(amount) + "x </div>";
			div += "</div>";
			div += "</div>";
			var liclasses = "item-slot item-slot-small lvl13-box-1 ";
			if (simple) liclasses += "item-slot-simple";
			var imageDiv = "<div class='item-slot-image'>" + div + "</div>";
			return "<li class='" + liclasses + "'>" + imageDiv + "</li>";
		},

		updateCurrencyLi: function (li, amount) {
			var $li = this.parseElement(li);
			if (!$li) return;
			var showAmount = Math.floor(amount);
			$li.find(".item-count").text(showAmount + "x");
			GameGlobals.uiFunctions.toggle($li, showAmount > 0);
		},

		getBlueprintPieceLI: function (upgradeID) {
			var upgradeDefinition = UpgradeConstants.upgradeDefinitions[upgradeID];
			var name = upgradeDefinition.name;
			return "<li><div class='info-callout-target' description='蓝图 (" + name + ")'>" + this.getBlueprintPieceIcon(upgradeID) + " 蓝图</li>";
		},

		getResourceList: function (resourceVO) {
			var html = "";
			for (var key in resourceNames) {
				var name = resourceNames[key];
				var amount = resourceVO.getResource(name);
				if (Math.round(amount) > 0) {
					var li = this.getResourceLi(name, amount);
					html += li;
				}
			}
			return html;
		},

		getItemBonusDescription: function (item, useLineBreaks) {
			let result = "";
			if (!item) return result;
			let defaultType = ItemConstants.getItemDefaultBonus(item);
			for (var bonusKey in ItemConstants.itemBonusTypes) {
				var bonusType = ItemConstants.itemBonusTypes[bonusKey];
				let baseValue = ItemConstants.getDefaultBonus(item, bonusType);
				if (baseValue <= 0) continue;
				let currentValue = ItemConstants.getCurrentBonus(item, bonusType);
				
				result += this.getItemBonusName(bonusType, true);
				if (currentValue == baseValue) {
					result += this.getItemBonusText(item, bonusType, baseValue);
				} else {
					result += "<span class='strike-through'>";
					result += this.getItemBonusText(item, bonusType, baseValue);
					result += "</span>";
					result += "<span class='warning'>";
					result += this.getItemBonusText(item, bonusType, currentValue);
					result += "</span>";
				}
				result += useLineBreaks ? "<br/>" : ", ";
			}

			result = result.substring(0, result.length - (useLineBreaks ? 5 : 2));

			return result;
		},

		getItemBonusName: function (bonusType, short) {
			switch (bonusType) {
				case ItemConstants.itemBonusTypes.light: return "最大视野";
				case ItemConstants.itemBonusTypes.fight_att: return "攻";
				case ItemConstants.itemBonusTypes.fight_def: return "防";
				case ItemConstants.itemBonusTypes.fight_shield: return "盾";
				case ItemConstants.itemBonusTypes.fight_speed: return "攻速";
				case ItemConstants.itemBonusTypes.movement: return "移动消耗";
				case ItemConstants.itemBonusTypes.scavenge_cost: return "拾荒效率";
				case ItemConstants.itemBonusTypes.scavenge_general: return "拾荒加成";
				case ItemConstants.itemBonusTypes.scavenge_supplies: return "拾荒加成";
				case ItemConstants.itemBonusTypes.scavenge_ingredients: return "拾荒加成";
				case ItemConstants.itemBonusTypes.scout_cost: return "探索加成";
				case ItemConstants.itemBonusTypes.bag: return "背包大小";
				case ItemConstants.itemBonusTypes.res_cold: return "温暖";
				case ItemConstants.itemBonusTypes.res_radiation: return short ? "辐射物保护" : "辐射物保护";
				case ItemConstants.itemBonusTypes.res_poison: return short ? "有毒物保护" : "有毒物保护";
				case ItemConstants.itemBonusTypes.shade: return short ? "阳光防护" : "阳光致盲防护";
				case ItemConstants.itemBonusTypes.detect_hazards: return short ? "危害" : "调研(危害)";
				case ItemConstants.itemBonusTypes.detect_supplies: return short ? "补给" : "调研(补给)";
				case ItemConstants.itemBonusTypes.detect_ingredients: return short ? "材料" : "调研(材料)";
				default:
					log.w("no display name defined for item bonus type: " + bonusType);
					return "";
			}
		},

		getItemBonusText: function (item, bonusType, bonusValue) {
			var baseValue = item.getBaseBonus(bonusType);
			
			if (ItemConstants.isStaticValue(baseValue)) {
				return " " + bonusValue;
			} else if (bonusValue === 0) {
				return "+0";
			} else if (ItemConstants.isMultiplier(bonusType) && ItemConstants.isIncreasing(bonusType)) {
				// increasing multiplier: fight speed
				var val = Math.abs(Math.round((1 - bonusValue) * 100));
				return bonusValue == 1 ? "+0%" : (bonusValue < 1 ? "-" + val + "%" : "+" + val + "%");
			} else if (baseValue >= 1) {
				return " +" + bonusValue;
			} else if (baseValue > 0) {
				return " -" + UIConstants.getMultiplierBonusDisplayValue(bonusValue);
			} else if (baseValue > -1) {
				return " +" + UIConstants.getMultiplierBonusDisplayValue(bonusValue);
			} else {
				return " " + bonusValue;
			}
		},

		getPerkDetailText: function (perk, isResting) {
			let bonusText = this.getPerkBonusText(perk);
			let timerText = this.getPerkTimerText(perk, isResting);
			let result = "";
			if (bonusText) result += bonusText;
			if (timerText) {
				if (bonusText && bonusText.length > 0) result += ", ";
				result += timerText;
			}
			return result;
		},
		
		getPerkTimerText: function (perk, isResting) {
			if (perk.removeTimer >= 0) {
				var factor = PerkConstants.getRemoveTimeFactor(perk, isResting);
				var timeleft = perk.removeTimer / factor;
				return "time left: " + this.getTimeToNum(timeleft);
			} else if (perk.startTimer >= 0) {
				return "time to full: " + this.getTimeToNum(perk.startTimer);
			} else {
				return null;
			}
		},

		getPerkBonusText: function (perk) {
			let value = 0;
			if (PerkConstants.isPercentageEffect(perk.type)) {
				if (perk.effect == 1) return null;
				if (perk.effect < 1) {
					value = "-" + UIConstants.getMultiplierBonusDisplayValue(PerkConstants.getCurrentEffect(perk));
				} else {
					value = "+" + UIConstants.getMultiplierBonusDisplayValue(PerkConstants.getCurrentEffect(perk));
				}
			} else {
				if (perk.effect == 0) return null;
				value = "+" + PerkConstants.getCurrentEffect(perk);
			}

			let effect = perk.type;
			switch (perk.type) {
				case PerkConstants.perkTypes.movement:
					effect = "移动消耗";
					break;
				case PerkConstants.perkTypes.injury:
				case PerkConstants.perkTypes.health:
					effect = "健康";
					break;
				case PerkConstants.perkTypes.luck:
					return "减少随机负面事件在探索之中出现的概率";
			}

			return effect + " " + value;
		},

		getCostsSpans: function (action, costs) {
			let result = "";
			let hasCosts = action && costs && Object.keys(costs).length > 0;
			if (hasCosts) {
				for (let key in costs) {
					let itemName = key.replace("item_", "");
					let item = ItemConstants.getItemDefinitionByID(itemName, true);
					let name = (this.names.resources[key] ? this.names.resources[key] : item !== null ? item.name : key).toLowerCase();
					let value = costs[key];
					result += "<span class='action-cost action-cost-" + key + "'>" + name + ": <span class='action-cost-value'>" + UIConstants.getDisplayValue(value) + "</span><br/></span>";
				}
			} else if (this.isActionFreeCostShown(action)) {
				result += "<span class='action-cost p-meta'>自由</span><br />";
			}
			return result;
		},
		
		getCostsSpansElements: function (action, costs, elements, $container) {
			elements.costSpans = {};
			elements.costSpanValues = {};
			for (let key in costs) {
				elements.costSpans[key] = $container.children(".action-cost-" + key);
				elements.costSpanValues[key] = elements.costSpans[key].children(".action-cost-value");
			}
		},
		
		isActionFreeCostShown: function (action) {
			let baseId = GameGlobals.playerActionsHelper.getBaseActionID(action);
			switch (baseId) {
				case "recruit_follower": return true;
				case "wait": return true;
			}
			return false;
		},
		
		canHideProject: function (projectID) {
			if (projectID.indexOf("greenhouse") >= 0) return false;
			if (projectID.indexOf("passage") >= 0) return false;
			if (projectID.indexOf("tradepost_") >= 0) return false;
			return true;
		},
		
		getMultiplierBonusDisplayValue: function (value) {
			return Math.round(Math.abs(1 - value) * 100) + "%";
		},

		sortItemsByType: function (a, b) {
			var getItemSortVal = function (itemVO) {
				var typeVal = 0;
				switch (itemVO.type) {
					case ItemConstants.itemTypes.uniqueEquipment: typeVal = 0; break;
					case ItemConstants.itemTypes.exploration: typeVal = 1; break;
					
					case ItemConstants.itemTypes.bag: typeVal = 11; break;
					case ItemConstants.itemTypes.light: typeVal = 12; break;
					case ItemConstants.itemTypes.weapon: typeVal = 13; break;
					case ItemConstants.itemTypes.clothing_over: typeVal = 14; break;
					case ItemConstants.itemTypes.clothing_upper: typeVal = 15; break;
					case ItemConstants.itemTypes.clothing_lower: typeVal = 16; break;
					case ItemConstants.itemTypes.clothing_hands: typeVal = 17; break;
					case ItemConstants.itemTypes.clothing_head: typeVal = 18; break;
					case ItemConstants.itemTypes.shoes: typeVal = 19; break;
					
					case ItemConstants.itemTypes.ingredient: typeVal = 21; break;
					case ItemConstants.itemTypes.voucher: typeVal = 22; break;
					case ItemConstants.itemTypes.trade: typeVal = 23; break;
					
					case ItemConstants.itemTypes.artefact: typeVal = 31; break;
					case ItemConstants.itemTypes.note: typeVal = 32; break;
				}
				return typeVal * 1000 - itemVO.getBaseTotalBonus();
			};
			var aVal = getItemSortVal(a);
			var bVal = getItemSortVal(b);
			return aVal - bVal;
		},
		
		sortFollowersByType: function (a, b) {
			let getFollowerSortVal = function (followerVO) {
				let abilityType = followerVO.abilityType;
				let followerType = FollowerConstants.getFollowerTypeForAbilityType(abilityType);
				let typeVal = 0;
				switch (followerType) {
					case FollowerConstants.followerType.FIGHTER: typeVal = 1; break;
					case FollowerConstants.followerType.EXPLORER: typeVal = 2; break;
					case FollowerConstants.followerType.SCAVENGER: typeVal = 3; break;
				}
				return typeVal * 1000 - followerVO.abilityLevel;
			};
			let aVal = getFollowerSortVal(a);
			let bVal = getFollowerSortVal(b);
			return aVal - bVal;
		},

		createResourceIndicator: function (name, showName, id, showAmount, showChange, showDetails, showFill) {
			let classes = [ "stat-indicator" ];
			if (showFill) classes.push("stat-indicator-with-fill");
			
			let div = "<div class='" + classes.join(" ") + "' id='" + id + "'>";

			if (!showName) div = "<div class='info-callout-target info-callout-target-small' description='" + name + "'>" + div;
			else if (showChange) div = "<div class='info-callout-target' description=''>" + div;

			div += "<span class='icon'>";
			div += this.getResourceImg(name);
			if (!showName && !showChange) div += "</div>";
			div += "</span>";

			if (showName) div += "<span class='label'>" + name + "</span>";

			if (showAmount) div += "<span class='value'></span>";
			div += "<span class='change-indicator'></span>";
			if (showDetails) div += "<span class='change'></span>";
			if (showDetails) div += "<span class='forecast'></span>";
			div += "</div>";

			if (!showName || showChange) div = div + "</div>";

			return div;
		},
		
		completeResourceIndicatorAnimations: function (id) {
			let $valueElement = $(id).children(".value");
			UIAnimations.animateNumberEnd($valueElement);
		},

		updateResourceIndicator: function (id, value, change, storage, showChangeIcon, showChange, showDetails, showWarning, visible, animate) {
			let $indicator = $(id);
			GameGlobals.uiFunctions.toggle($indicator, visible);
			GameGlobals.uiFunctions.toggle($indicator.parent(), visible);
			if (visible) {
				let $valueElement = $indicator.children(".value");
				animate = animate || UIAnimations.isAnimating($valueElement);
				UIAnimations.animateOrSetNumber($valueElement, animate, value, "", false, (v) => { return UIConstants.roundValue(v, true, false); });
				$indicator.children(".value").toggleClass("warning", showWarning && value < 5);
				$indicator.children(".change").toggleClass("warning", change < 0);
				GameGlobals.uiFunctions.toggle($indicator.children(".change"), showChange);
				GameGlobals.uiFunctions.toggle($indicator.children(".forecast"), showDetails);
				$indicator.children(".forecast").toggleClass("warning", change < 0);

				var isCappedByStorage = change > 0 && value >= storage;

				if (showChange) {
					$indicator.children(".change").text(Math.round(change * 10000) / 10000 + "/s");
				}
				
				if (showDetails) {
					if (change > 0 && (storage - value > 0)) {
						$indicator.children(".forecast").text("(" + this.getTimeToNum((storage - value) / change) + " to cap)");
					} else if (change < 0 && value > 0) {
						$indicator.children(".forecast").text("(" + this.getTimeToNum(value / change) + " to 0)");
					} else if (value >= storage) {
						$indicator.children(".forecast").text("(full)");
					} else {
						$indicator.children(".forecast").text("");
					}
				}
				
				if ($indicator.hasClass("stat-indicator-with-fill")) {
					let sunlit = $("body").hasClass("sunlit");
					let fillColor = ColorConstants.getColor(sunlit, "bg_element_1");
					let fillPercent = Math.round(value / storage * 100);
					$(id).css("background", "linear-gradient(to right, " + fillColor + " " + fillPercent + "%, transparent " + fillPercent + "%)");
				}

				change = Math.round(change * 10000) / 10000;
				$indicator.children(".change-indicator").toggleClass("indicator-increase", change > 0 && !isCappedByStorage);
				$indicator.children(".change-indicator").toggleClass("indicator-decrease", change < 0);
				$indicator.children(".change-indicator").toggleClass("indicator-even", change === 0 || isCappedByStorage);
				GameGlobals.uiFunctions.toggle($indicator.children(".change-indicator"), showChangeIcon);
			}
		},

		updateResourceIndicatorCallout: function (id, changeSources) {
			var content = "";
			var source;
			for (let i in changeSources) {
				source = changeSources[i];
				if (source.amount != 0) {
					content += this.getResourceAccumulationSourceText(source) + "<br/>";
				}
			}

			if (content.length <= 0) {
				content = "(no change)";
			}

			this.updateCalloutContent(id, content);
		},
		
		getResourceAccumulationSourceText: function (source) {
			let divisor = 10000;
			if (source.amount < 0.0001) divisor = 100000;
			return source.source + " (" + source.sourceCount + ")" + ": " + Math.round(source.amount * divisor) / divisor + "/s";
		},

		getAccumulationText: function (value) {
			if (value == 0) return "-";

			if (Math.abs(value) < 0.01) {
				let minutesValue = value * 60;
				return this.roundValue(minutesValue, true) + "/m";
			}

			return this.roundValue(value, true) + "/s";
		},

		updateCalloutContent: function ($targetElement, content, isTargetDirect) {
			$targetElement = UIConstants.parseElement($targetElement);
			let $calloutTarget = isTargetDirect ? $targetElement : $targetElement.parents(".info-callout-target");

			$calloutTarget.attr("description", content);
			$calloutTarget.siblings(".info-callout").children(".info-callout-content").html(content);
		},

		parseElement: function ($elem) {
			if (typeof $elem == 'object') {
				return $elem;
			}
			if (typeof $elem == 'string' && $elem.length > 0) {
				if ($elem[0] == '#' || $elem[0] == '.') {
					return $($elem);
				} else {
					return $("#" + $elem);
				}
			}
			return null;
		},

		getBlueprintPieceIcon: function (upgradeID) {
			let type = UpgradeConstants.getUpgradeType(upgradeID);
			return "<img src='img/items/blueprints/blueprint-" + type + ".png' alt='' />";
		},
		
		getMilestoneUnlocksDescriptionHTML: function (milestone, previousMilestone, isNew, showMultiline, hasDeity, hasInvestigate) {
			if (!previousMilestone) previousMilestone = {};
			let html = "";
			let baseReputation = Math.max(milestone.baseReputation || 0, previousMilestone.baseReputation || 0);
			
			let addValue = function (label, value) {
				html += "<span class='unlocks-list-entry'>";
				html += label;
				if (value || value === 0) {
					html += ": ";
					html += value;
				}
				html += "</span>";
			};
			
			let addGroup = function (title, items, getItemDisplayName) {
				if (!items || items.length == 0) return
				if  (title && title.length > 0) html += title + ": ";
				if (showMultiline) html += "<br/>";
				for (let i = 0; i < items.length; i++) {
					if (i > 0) html += ", ";
					html += getItemDisplayName ? getItemDisplayName(items[i]).toLowerCase() : items[i];
				}
				html += "<br/>";
			};
			
			addValue("基础名誉", baseReputation);
			
			addValue("线索最大值", milestone.maxEvidence);
			addValue("传闻最大值", milestone.maxRumours);
			
			if (milestone.maxFavour && hasDeity) {
				addValue("神佑最大值", milestone.maxFavour);
			}
			
			if (milestone.maxInsight && hasInvestigate) {
				addValue("洞察最大值", milestone.maxInsight);
			}
			
			if (isNew) {
				addGroup("", milestone.unlockedFeatures, UIConstants.getUnlockedFeatureDisplayName);
				addGroup("新事件", milestone.unlockedEvents);
				
				let unlockedUpgrades = GameGlobals.milestoneEffectsHelper.getUnlockedUpgrades(milestone.index);
				addGroup("Unlocked upgrades", unlockedUpgrades, (upgradeID) => {
					let upgrade = UpgradeConstants.upgradeDefinitions[upgradeID];
					let isOtherRequirementsMet = GameGlobals.playerActionsHelper.isRequirementsMet(upgradeID, null, [ PlayerActionConstants.DISABLED_REASON_MILESTONE ]);
					let c = isOtherRequirementsMet ? "" : "strike-through";
					return "<span class='" + c + "'>" + upgrade.name + "</span>";
				});
				
				let unlockedActions = GameGlobals.milestoneEffectsHelper.getUnlockedGeneralActions(milestone.index);
				addGroup("Other", unlockedActions);
			}
			
			return html;
		},

		getTimeToNum: function (seconds) {
			seconds = Math.ceil(Math.abs(seconds));

			var minutes = seconds / 60;
			var hours = minutes / 60;
			var days = hours / 24;

			if (days > 2) {
				return Math.floor(days) + "days";
			} else if (hours > 2) {
				return Math.floor(hours) + "h";
			} else if (minutes > 2) {
				return Math.floor(minutes) + "min";
			} else {
				return Math.round(seconds) + "s";
			}
		},

		getTimeSinceText: function (date) {
			var seconds = Math.floor((new Date() - date) / 1000);

			var interval = Math.floor(seconds / 31536000);
			if (interval > 1) {
				return interval + " 年";
			}
			interval = Math.floor(seconds / 2592000);
			if (interval > 1) {
				return interval + " 月";
			}
			interval = Math.floor(seconds / 86400);
			if (interval > 1) {
				return interval + " 日";
			}
			interval = Math.floor(seconds / 3600);
			if (interval > 1) {
				return interval + " 时";
			}
			interval = Math.floor(seconds / 60);
			if (interval > 1) {
				return interval + " 分";
			}
			if (interval === 1) {
				return interval + " 秒";
			}
			if (seconds < 10) {
				return "几秒";
			}

			return "小于一分钟";
		},

		getInGameDate: function (gameTime) {
			var secondSinceGameStart = gameTime;
			var inGameDaysSinceGameStart = Math.floor(secondSinceGameStart / 86400 * 365);
			var inGameWeeksSinceGameStart = inGameDaysSinceGameStart / 40;

			var year = StoryConstants.GAME_START_YEAR;
			var week = StoryConstants.GAME_START_WEEK;
			if (inGameWeeksSinceGameStart < 40 - StoryConstants.GAME_START_WEEK) {
				week += inGameWeeksSinceGameStart;
			} else {
				var weeksSinceFirstNewYear = inGameWeeksSinceGameStart - (40 - StoryConstants.GAME_START_WEEK);
				week = weeksSinceFirstNewYear - (Math.floor(weeksSinceFirstNewYear / 40) * 40) + 1;
				year += 1 + (weeksSinceFirstNewYear) / 40;
			}

			year = Math.floor(year);
			week = Math.floor(week);

			return "Y" + year + "-N" + week;
		},

		getUnlockedFeatureDisplayName: function (featureID) {
			switch (featureID) {
				case UIConstants.UNLOCKABLE_FEATURE_MAP_MODES: return "地图节点";
				case UIConstants.UNLOCKABLE_FEATURE_WORKER_AUTO_ASSIGNMENT: return "自动分配工人";
			}
			return featureID;
		},

		getCampDisplayName: function (campNode, short) {
			return "在" + campNode.position.level + "层的营地";
		},

		roundValue: function (value, showDecimalsWhenSmall, showDecimalsAlways, decimalDivisor) {
			decimalDivisor = decimalDivisor || 100;
			let divisor = 0;
			if (showDecimalsWhenSmall && value <= 10) divisor = decimalDivisor;
			if (showDecimalsAlways) divisor = decimalDivisor;

			let result = value;
			if (value % 1 === 0 || divisor <= 0) {
				result = Math.round(value);
			} else {
				result = Math.round(value * divisor) / divisor;
			}
			
			if (value > 0 && result == 0) {
				return "< 1";
			}
			
			return result;
		},

		getDisplayValue: function (value) {
			return value.toLocaleString();
		},

		getResourceImg: function (name) {
			return "<img src='img/res-" + name + ".png' alt='" + name + "'/>"
		},
		
		getRangeText: function (range, count) {
			var min = range[0];
			var max = range[1];
			
			if (!count && count !== 0) {
				// text without current count
				if (min >= 0 && max >= 0) {
					return min + "-" + max;
				}
				if (min >= 0) {
					return "min " + min;
				}
				if (max >= 0) {
					return "max " + max;
				}
			} else {
				// text with current count
				if (min >= 0 && max >= 0) {
					return count + "/" + min + "-" + max;
				}
				if (min >= 0) {
					return count + "/" + min;
				}
				if (max >= 0) {
					return count + "/" + max;
				}
			}
			
			return "";
		},

		getBagCapacityDisplayValue: function (bagComponent, isSimple) {
			if (bagComponent.bonusCapacity > 0 && !isSimple) {
				return bagComponent.baseCapacity + " + " + bagComponent.bonusCapacity;
			} else {
				return bagComponent.totalCapacity;
			}
		},

		cleanupText: function (text) {
			return text.replace(/'/g, "&#39;")
		},

	};

	return UIConstants;
});
