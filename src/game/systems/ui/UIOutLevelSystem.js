define([
	'ash',
	'text/Text',
	'utils/MapUtils',
	'utils/UIList',
	'utils/UIState',
	'game/GameGlobals',
	'game/GlobalSignals',
	'game/constants/ExplorationConstants',
	'game/constants/PlayerActionConstants',
	'game/constants/PlayerStatConstants',
	'game/constants/TextConstants',
	'game/constants/LogConstants',
	'game/constants/UIConstants',
	'game/constants/PositionConstants',
	'game/constants/LocaleConstants',
	'game/constants/LevelConstants',
	'game/constants/MovementConstants',
	'game/constants/StoryConstants',
	'game/constants/TradeConstants',
	'game/constants/TribeConstants',
	'game/nodes/PlayerPositionNode',
	'game/nodes/PlayerLocationNode',
	'game/nodes/NearestCampNode',
	'game/components/player/VisionComponent',
	'game/components/player/StaminaComponent',
	'game/components/player/ItemsComponent',
	'game/components/sector/PassagesComponent',
	'game/components/sector/SectorControlComponent',
	'game/components/sector/SectorFeaturesComponent',
	'game/components/sector/SectorLocalesComponent',
	'game/components/sector/MovementOptionsComponent',
	'game/components/common/PositionComponent',
	'game/components/common/LogMessagesComponent',
	'game/components/common/CampComponent',
	'game/components/sector/improvements/SectorImprovementsComponent',
	'game/components/sector/improvements/WorkshopComponent',
	'game/components/sector/SectorStatusComponent',
	'game/components/sector/EnemiesComponent'
], function (
	Ash,
	Text, MapUtils,  UIList, UIState, GameGlobals, GlobalSignals, ExplorationConstants, PlayerActionConstants, PlayerStatConstants, TextConstants,
	LogConstants, UIConstants, PositionConstants, LocaleConstants, LevelConstants, MovementConstants, StoryConstants, TradeConstants,
	TribeConstants, PlayerPositionNode, PlayerLocationNode, NearestCampNode, VisionComponent, StaminaComponent,
	ItemsComponent, PassagesComponent, SectorControlComponent, SectorFeaturesComponent, SectorLocalesComponent,
	MovementOptionsComponent, PositionComponent, LogMessagesComponent, CampComponent, SectorImprovementsComponent,
	WorkshopComponent, SectorStatusComponent, EnemiesComponent
) {
	var UIOutLevelSystem = Ash.System.extend({

		engine: null,

		playerPosNodes: null,
		playerLocationNodes: null,
		nearestCampNodes: null,

		pendingUpdateMap: true,

		constructor: function () {
			GameGlobals.uiFunctions.toggle("#switch-out .bubble", false);

			this.elements = {};
			this.elements.sectorHeader = $("#header-sector");
			this.elements.description = $("#out-desc");
			this.elements.btnScavengeHeap = $("#out-action-scavenge-heap");
			this.elements.btnClearWorkshop = $("#out-action-clear-workshop");
			this.elements.btnNap = $("#out-action-nap");
			this.elements.btnWait = $("#out-action-wait");
			this.elements.outImprovementsTR = $("#out-improvements tr");
			
			this.initElements();

			return this;
		},

		addToEngine: function (engine) {
			this.playerPosNodes = engine.getNodeList(PlayerPositionNode);
			this.playerLocationNodes = engine.getNodeList(PlayerLocationNode);
			this.nearestCampNodes = engine.getNodeList(NearestCampNode);

			this.initListeners();

			this.engine = engine;
		},

		removeFromEngine: function (engine) {
			this.playerPosNodes = null;
			this.playerLocationNodes = null;
			this.engine = null;
		},
		
		initElements: function () {
			this.localeList = UIList.create(this, $("#table-out-actions-locales"), this.createLocaleListItem, this.updateLocaleListItem, this.isLocaleListItemDataEqual);

			let makeMovementActionsTD = function (direction) {
				let normalID = "out-action-move-" + direction;
				let gritID = "out-action-move-" + direction + "-grit";
				let normalAction = "move_sector_" + direction;
				let gritAction = "move_sector_grit_" + direction;
				let textKey = "ui.map.direction_" + direction + "_name_short";

				let result = "";
				result += "<td>";
				result += "<button class='action btn-icon action-move text-key movement-action-normal' id='" + normalID + "' action='" + normalAction + "' data-text-key='" + textKey + "'></button>";
				result += "<button class='action btn-icon action-move text-key movement-action-grit' id='" + gritID + "' action='" + gritAction + "' data-text-key='" + textKey + "'></button>";
				result += "</td>";
				return result;
			};

			let $movementActionsTable = $("#table-out-actions-movement");
			$movementActionsTable.append("<tr>");
			$movementActionsTable.append(makeMovementActionsTD("nw"));
			$movementActionsTable.append(makeMovementActionsTD("north"));
			$movementActionsTable.append(makeMovementActionsTD("ne"));
			$movementActionsTable.append("</tr>");
			$movementActionsTable.append("<tr>");
			$movementActionsTable.append(makeMovementActionsTD("west"));
			$movementActionsTable.append("<td></td>");
			$movementActionsTable.append(makeMovementActionsTD("east"));
			$movementActionsTable.append("</tr>");
			$movementActionsTable.append("<tr>");
			$movementActionsTable.append(makeMovementActionsTD("sw"));
			$movementActionsTable.append(makeMovementActionsTD("south"));
			$movementActionsTable.append(makeMovementActionsTD("se"));
			$movementActionsTable.append("</tr>");
		},

		initListeners: function () {
			var sys = this;
			GlobalSignals.playerPositionChangedSignal.add(function () {
				if (GameGlobals.gameState.uiStatus.isHidden) return;
				sys.updateAll();
			});
			GlobalSignals.improvementBuiltSignal.add(function () {
				sys.updateAll();
			});
			GlobalSignals.inventoryChangedSignal.add(function () {
				sys.updateSectorDescription();
				sys.updateOutImprovementsList();
				sys.updateDespair();
			});
			GlobalSignals.featureUnlockedSignal.add(function () {
				sys.updateUnlockedFeatures();
			});
			GlobalSignals.fightEndedSignal.add(function () {
				sys.updateSectorDescription();
				sys.updateMovementRelatedActions();
			});
			GlobalSignals.sectorScoutedSignal.add(function () {
				sys.updateAll();
			});
			GlobalSignals.sectorScavengedSignal.add(function () {
				sys.updateSectorDescription();
			});
			GlobalSignals.actionCompletedSignal.add(function () {
				sys.updateSectorDescription();
				sys.updateMovementActions();
			});
			GlobalSignals.visionChangedSignal.add(function () {
				sys.updateAll();
			});
			GlobalSignals.gameShownSignal.add(function () {
				sys.updateAll();
			});
			GlobalSignals.add(this, GlobalSignals.playerLeftCampSignal, this.updateAll);
			GlobalSignals.add(this, GlobalSignals.collectorCollectedSignal, this.updateOutImprovementsStatus);
			GlobalSignals.add(this, GlobalSignals.movementBlockerClearedSignal, this.updateAll);
			GlobalSignals.add(this, GlobalSignals.slowUpdateSignal, this.slowUpdate);
			GlobalSignals.add(this, GlobalSignals.popupClosedSignal, this.updateLocales);
			GlobalSignals.add(this, GlobalSignals.buttonStateChangedSignal, this.onButtonStateChanged);
			GlobalSignals.add(this, GlobalSignals.inventoryChangedSignal, this.scheduleMapUpdate);
			GlobalSignals.add(this, GlobalSignals.equipmentChangedSignal, this.scheduleMapUpdate);
			GlobalSignals.add(this, GlobalSignals.sectorRevealedSignal, this.scheduleMapUpdate);
			GlobalSignals.add(this, GlobalSignals.themeToggledSignal, this.scheduleMapUpdate);
			this.rebuildVis();
			this.updateUnlockedFeatures();
		},

		update: function (time) {
			if (GameGlobals.gameState.isPaused) return;
			if (GameGlobals.gameState.uiStatus.currentTab !== GameGlobals.uiFunctions.elementIDs.tabs.out) return;

			var posComponent = this.playerPosNodes.head.position;

			if (!this.playerLocationNodes.head) return;

			if (!posComponent.inCamp) {
				if (this.pendingUpdateMap)
					this.rebuildVis();
			}
		},
		
		slowUpdate: function () {
			if (!this.playerLocationNodes.head) return;
			this.updateOutImprovementsStatus();
			this.updateLevelPageActionsSlow();
		},

		updateAll: function () {
			if (GameGlobals.gameState.uiStatus.isHidden) return;
			if (!this.playerLocationNodes.head) return;

			this.rebuildVis();
			this.updateLocales();
			this.updateMovementRelatedActions();
			this.updateLocationDetails();
			this.updateSectorDescription();
			this.updateLevelPageActions();
			this.updateLevelPageActionsSlow();
			this.updateUnlockedFeatures();
			this.updateOutImprovementsList();
			this.updateOutImprovementsStatus();
			this.updateMovementActions();
		},
		
		scheduleMapUpdate: function () {
			this.pendingUpdateMap = true;
		},

		updateUnlockedFeatures: function () {
			GameGlobals.uiFunctions.toggle("#out-container-compass", GameGlobals.gameState.unlockedFeatures.scout);
			GameGlobals.uiFunctions.toggle("#out-container-compass-actions", GameGlobals.gameState.unlockedFeatures.scout);
			GameGlobals.uiFunctions.toggle("#minimap-background-container", GameGlobals.gameState.unlockedFeatures.scout);
			GameGlobals.uiFunctions.toggle("#minimap", GameGlobals.gameState.unlockedFeatures.scout);
		},

		updateLevelPageActionsSlow: function () {
			if (GameGlobals.gameState.uiStatus.isHidden) return;
			var sectorStatus = this.playerLocationNodes.head.entity.get(SectorStatusComponent);

			var hasCampHere = this.playerLocationNodes.head.entity.has(CampComponent);
			var isScouted = sectorStatus.scouted;

			this.updateNap(isScouted, hasCampHere);
			this.updateWait(hasCampHere);
			this.updateDespair();
		},

		updateLevelPageActions: function (isScouted, hasCamp, hasCampHere) {
			if (GameGlobals.gameState.uiStatus.isHidden) return;
			
			var sectorStatus = this.playerLocationNodes.head.entity.get(SectorStatusComponent);
			var hasCamp = GameGlobals.levelHelper.getLevelEntityForSector(this.playerLocationNodes.head.entity).has(CampComponent);
			var hasCampHere = this.playerLocationNodes.head.entity.has(CampComponent);
			var isScouted = sectorStatus.scouted;
			
			var sectorLocalesComponent = this.playerLocationNodes.head.entity.get(SectorLocalesComponent);
			var sectorControlComponent = this.playerLocationNodes.head.entity.get(SectorControlComponent);
			var featuresComponent = this.playerLocationNodes.head.entity.get(SectorFeaturesComponent);
			var workshopComponent = this.playerLocationNodes.head.entity.get(WorkshopComponent);
			var improvements = this.playerLocationNodes.head.entity.get(SectorImprovementsComponent);
			var passagesComponent = this.playerLocationNodes.head.entity.get(PassagesComponent);

			var passageUpBuilt = improvements.getCount(improvementNames.passageUpStairs) +
				improvements.getCount(improvementNames.passageUpElevator) +
				improvements.getCount(improvementNames.passageUpHole) > 0;
			var passageDownBuilt = improvements.getCount(improvementNames.passageDownStairs) +
				improvements.getCount(improvementNames.passageDownElevator) +
				improvements.getCount(improvementNames.passageDownHole) > 0;

			GameGlobals.uiFunctions.toggle("#out-action-move-up", (isScouted && passagesComponent.passageUp != null) || passageUpBuilt);
			GameGlobals.uiFunctions.toggle("#out-action-move-down", (isScouted && passagesComponent.passageDown != null) || passageDownBuilt);
			GameGlobals.uiFunctions.toggle("#out-action-move-camp", hasCamp && !hasCampHere);
			GameGlobals.uiFunctions.toggle("#out-action-move-camp-details", hasCamp && !hasCampHere);

			GameGlobals.uiFunctions.toggle("#out-action-enter", hasCampHere);
			GameGlobals.uiFunctions.toggle("#out-action-scout", GameGlobals.gameState.unlockedFeatures.vision);
			GameGlobals.uiFunctions.toggle("#out-action-use-spring", isScouted && featuresComponent.hasSpring);
			GameGlobals.uiFunctions.toggle("#out-action-investigate", this.showInvestigate());

			// examine spots
			let showExamine = featuresComponent.examineSpots.length > 0;
			GameGlobals.uiFunctions.toggle("#out-action-examine", showExamine);
			if (showExamine) {
				let spotID = featuresComponent.examineSpots[0];
				let spotDef = StoryConstants.getSectorExampineSpot(spotID);
				let examineSpotName = spotDef.shortName;
				$("#out-action-examine").find(".btn-label").text("examine " + examineSpotName);
			}

			// workshop
			let showWorkshop = isScouted && workshopComponent != null && workshopComponent.isClearable && !sectorControlComponent.hasControlOfLocale(LocaleConstants.LOCALE_ID_WORKSHOP)
			GameGlobals.uiFunctions.toggle(this.elements.btnClearWorkshop, showWorkshop);
			if (showWorkshop) {
				let workshopName = TextConstants.getWorkshopName(workshopComponent.resource);
				this.elements.btnClearWorkshop.find(".btn-label").text("scout " + workshopName);
			}

			// resource heap
			let showHeap = isScouted && featuresComponent.heapResource != null;
			GameGlobals.uiFunctions.toggle(this.elements.btnScavengeHeap, showHeap);
			if (showHeap) {
				let heapName = TextConstants.getHeapDisplayName(featuresComponent.heapResource, featuresComponent);
				this.elements.btnScavengeHeap.find(".btn-label").text("scavenge " + heapName);
			}

			GameGlobals.uiFunctions.slideToggleIf("#out-locales", null, isScouted && sectorLocalesComponent.locales.length > 0, 200, 0);
			GameGlobals.uiFunctions.slideToggleIf("#container-out-actions-movement-related", null, isScouted, 200, 0);

			GameGlobals.uiFunctions.toggle("#table-out-actions-movement", GameGlobals.gameState.isFeatureUnlocked("move"));
			GameGlobals.uiFunctions.toggle("#container-tab-two-out-actions h3", GameGlobals.gameState.isFeatureUnlocked("move"));
			GameGlobals.uiFunctions.toggle("#out-improvements", GameGlobals.gameState.unlockedFeatures.vision);
			GameGlobals.uiFunctions.toggle("#out-improvements table", GameGlobals.gameState.unlockedFeatures.vision);
		},

		updateNap: function (isScouted, hasCampHere) {
			if (hasCampHere) {
				GameGlobals.uiFunctions.toggle(this.elements.btnNap, false);
				return;
			}
			
			var staminaComponent = this.playerPosNodes.head.entity.get(StaminaComponent);
			var hasFirstCamp = GameGlobals.gameState.numCamps > 0;

			var costToCamp = GameGlobals.playerActionsHelper.getCosts("move_camp_level");
			var staminaToCamp = costToCamp.stamina || 10;
			var staminaCostToMove = staminaToCamp;
			var missingStamina = staminaCostToMove - staminaComponent.stamina;
			var lowStamina = missingStamina > 0 || staminaComponent.stamina <= PlayerStatConstants.STAMINA_GAINED_FROM_NAP;

			let blockedByTutorial = !hasFirstCamp && staminaComponent.stamina > 15;
			GameGlobals.uiFunctions.toggle(this.elements.btnNap, lowStamina && !blockedByTutorial);
		},
		
		updateWait: function (hasCampHere) {
			let hasFirstCamp = GameGlobals.gameState.numCamps > 0;
			let showWait = false;
			
			if (!hasCampHere && hasFirstCamp) {
				let maxResourcesToShowWait = 3;
				let resources = [ "food", "water" ];
				for (let i = 0; i < resources.length; i++) {
					let name = resources[i];
					if (!GameGlobals.gameState.unlockedFeatures["resource_" + name]) continue;
					if (!GameGlobals.playerHelper.hasCollectibleResource(name, false)) continue;
					let total = Math.floor(GameGlobals.playerHelper.getResouceInInventory(name)) + Math.floor(this.getResourceCurrentlyAvailableToCollect(name));
					if (total < maxResourcesToShowWait) showWait = true;
				}
			}
			
			GameGlobals.uiFunctions.toggle(this.elements.btnWait, showWait);
		},

		updateDespair: function () {
			if (GameGlobals.playerHelper.isInCamp()) return;
			if (GameGlobals.playerHelper.isBusy()) return;
			if (GameGlobals.gameState.uiStatus.isHidden) return;

			let activeDespairType = GameGlobals.playerHelper.getActiveDespairType();
			let delay = 1250;
			
			let canMove = GameGlobals.playerHelper.canMove();
			let showCantMove = !canMove;

			UIState.refreshStateDelayedFeedback(this, "cant-move", showCantMove, showCantMove ? delay : 0, () => {
				if (showCantMove) {
					let msg = LogConstants.getCantMoveMessage(activeDespairType);
					GameGlobals.playerHelper.addLogMessage(LogConstants.MSD_ID_MOVE_UNAVAILABLE, msg);
				}
			});
			
			let showDespairButton = activeDespairType != null;

			UIState.refreshStateDelayedFeedback(this, "despair-button", showDespairButton, showDespairButton ? delay : 0, () => {
				GameGlobals.uiFunctions.toggle("#out-action-despair", showDespairButton);
				if (showDespairButton) {
					let logDespair = activeDespairType == MovementConstants.DESPAIR_TYPE_STAMINA || activeDespairType == MovementConstants.DESPAIR_TYPE_MOVEMENT;
					if (logDespair) {
						let msg = LogConstants.getDespairMessage(activeDespairType);
						GameGlobals.playerHelper.addLogMessage(LogConstants.MSG_ID_DESPAIR_AVAILABLE, msg);
					}
				}
			});
		},

		getDescription: function (entity, hasCampHere, hasCampOnLevel, hasVision, isScouted) {
			var position = entity.get(PositionComponent).getPosition();
			var passagesComponent = this.playerLocationNodes.head.entity.get(PassagesComponent);
			var workshopComponent = this.playerLocationNodes.head.entity.get(WorkshopComponent);
			var featuresComponent = this.playerLocationNodes.head.entity.get(SectorFeaturesComponent);
			var sectorStatus = this.playerLocationNodes.head.entity.get(SectorStatusComponent);
			var enemiesComponent = this.playerLocationNodes.head.entity.get(EnemiesComponent);
			var localesComponent = entity.get(SectorLocalesComponent);
			var hasEnemies = enemiesComponent.hasEnemies;

			var description = "<p>";
			description += this.getTextureDescription(hasVision, entity, position, featuresComponent, sectorStatus, localesComponent);
			description += this.getFunctionalDescription(hasVision, isScouted, featuresComponent, workshopComponent, hasCampHere, hasCampOnLevel);
			description += "</p><p>";
			description += this.getStatusDescription(hasVision, isScouted, hasEnemies, featuresComponent, passagesComponent, hasCampHere, hasCampOnLevel);
			description += this.getMovementDescription(isScouted, passagesComponent, entity);
			description += "</p><p>";
			
			if (isScouted) {
				if (sectorStatus.graffiti) {
					description += "这里有片涂鸦: " + sectorStatus.graffiti;
					description += "</p><p>";
				}
			}
			
			description += this.getResourcesDescription(isScouted, featuresComponent, sectorStatus);
			description += "</p>";
			return description;
		},

		getTextureDescription: function (hasVision, sector, position, featuresComponent, sectorStatus, localesComponent) {
			var campOrdinal = GameGlobals.gameState.getCampOrdinal(position.level);
			
			// sector static description
			var features = GameGlobals.sectorHelper.getTextFeatures(sector);
			var desc = TextConstants.getSectorDescription(hasVision, features).split(" ").join("") + ". ";

			// light / darkness description
			if (featuresComponent.sunlit) {
				if (hasVision) desc += "<span class='hl-functionality'>阳光</span>洒满了这里. ";
				else desc += "<span class='hl-functionality'>sunlight</span>有些刺眼. ";
			} else {
				if (sectorStatus.glowStickSeconds > -5) {
					if (sectorStatus.glowStickSeconds < 5)
						desc += "荧光棒渐渐熄灭";
					else
						desc += "荧光棒发出暗淡的<span class='hl-functionality'>光</span>. ";
				} else {
					if (hasVision) desc += "";
					else desc += "这里没有<span class='hl-functionality'>光照</span>. ";
				}
			}
			
			// locales / POIs description
			for (let i = 0; i < localesComponent.locales.length; i++) {
				var locale = localesComponent.locales[i];
				if (sectorStatus.isLocaleScouted(i)) {
					if (locale.type == localeTypes.tradingpartner) {
						var partner = TradeConstants.getTradePartner(campOrdinal);
						if (partner) {
							desc += "<span class='hl-functionality'>" + partner.name + "</span>的营地在这里. ";
						}
					}
				}
			}

			return desc;
		},

		// Existing improvements. Workshops. Potential improvements (camp).
		getFunctionalDescription: function (hasVision, isScouted, featuresComponent, workshopComponent, hasCampHere, hasCampOnLevel) {
			let currentSector = this.playerLocationNodes.head.entity;
			let positionComponent = currentSector.get(PositionComponent);
			let position = positionComponent.getPosition();

			var sectorControlComponent = this.playerLocationNodes.head.entity.get(SectorControlComponent);
			var sectorStatus = this.playerLocationNodes.head.entity.get(SectorStatusComponent);
			var improvements = this.playerLocationNodes.head.entity.get(SectorImprovementsComponent);

			var description = "";

			if (isScouted && featuresComponent.hasSpring) {
				description += "这里有个<span class='hl-functionality'>" + TextConstants.getSpringName(featuresComponent) + "</span>. ";
			}

			if (isScouted) {
				let canBucket = featuresComponent.resourcesCollectable.water > 0;
				let canTrap = featuresComponent.resourcesCollectable.food > 0;
				
				if (canBucket && canTrap) {
					description += "这里可以收集<span class='hl-functionality'>水</span>和<span class='hl-functionality'>食物</span>. ";
				} else if (canBucket) {
					if (featuresComponent.sunlit) {
						description += "这里看上去可以收集<span class='hl-functionality'>雨水</span>. ";
					} else {
						description += "可以收集一点漏下的<span class='hl-functionality'>水</span>. ";
					}
				} else if (canTrap) {
					description += "这里或许值得搭一个<span class='hl-functionality'>陷阱</span>. ";
				}

				if (featuresComponent.heapResource) {
					let heapDisplayName = 
						"<span class='hl-functionality'>" +
						Text.addArticle(TextConstants.getHeapDisplayName(featuresComponent.heapResource, featuresComponent)) +
						"</span>";
					let resourceDisplayName = TextConstants.getResourceDisplayName(featuresComponent.heapResource);
					if (sectorStatus.getHeapScavengedPercent() >= 100) {
						description += "这里有个" + heapDisplayName + ", 不过已经被清空了. ";
					} else {
						description += "这里有个" + heapDisplayName + ", 可以到里面收集" + resourceDisplayName + ". ";
					}
				}
			}

			if (hasCampHere) {
				let campOrdinal = GameGlobals.gameState.getCampOrdinal(position.level);
				let isOutpost = GameGlobals.campBalancingHelper.isOutpost(campOrdinal);
				let campTerm = "营地";
				if (isOutpost) campTerm = "小型营地";

				description += "这里有个<span class='hl-functionality'>" + campTerm + "</span>. ";
			}

			if (isScouted && featuresComponent.examineSpots.length > 0) {
				for (let i = 0; i < featuresComponent.examineSpots.length; i++) {
					let spotID = featuresComponent.examineSpots[i];
					let spotDef = StoryConstants.getSectorExampineSpot(spotID);
					if (!spotDef) continue;
					description += "这里有个" + spotDef.name + ". ";
				}
			}

			if (isScouted && workshopComponent && workshopComponent.isClearable) {
				var workshopName = TextConstants.getWorkshopName(workshopComponent.resource);
				var workshopControl = sectorControlComponent.hasControlOfLocale(LocaleConstants.LOCALE_ID_WORKSHOP);
				var workshopStatus = workshopControl ? "已清理" : "未清理";
				description += "这里有个<span class='hl-functionality'>" + Text.addArticle(workshopName) + "</span> (" + workshopStatus + "). ";
			}

			if (isScouted && improvements.getCount(improvementNames.greenhouse) > 0) {
				description += "这里有个<span class='hl-functionality'>温室</span>. ";
			}
			
			let luxuryResource = GameGlobals.sectorHelper.getLuxuryResourceOnSector(this.playerLocationNodes.head.entity, true);
			if (isScouted && luxuryResource) {
				description += "这里是<span class='hl-functionality'>" + TribeConstants.getLuxuryDisplayName(luxuryResource) + "</span>的来源. ";
			}
			
			if (isScouted && GameGlobals.levelHelper.isFirstScoutedSectorWithFeatureOnLevel(this.playerLocationNodes.head.entity, "hasTradeConnectorSpot")) {
				description += "可以在这里建一个大型工程";
			}

			return description;
		},

		// Found resources, enemies
		getStatusDescription: function (hasVision, isScouted, hasEnemies, featuresComponent, passagesComponent, hasCampHere, hasCampOnLevel) {
			let description = "";

			// Scouted status
			if (hasVision && !isScouted) {
				description += Text.t("ui.exploration.sector_status_not_scouted_description");
			}

			// Danger
			if (hasVision) {
				description += this.getDangerDescription(isScouted, featuresComponent, hasCampHere);
			}
			
			// Waymarks
			if (isScouted) {
				for (let i = 0; i < featuresComponent.waymarks.length; i++) {
					let waymark = featuresComponent.waymarks[i];
					description += this.getWaymarkText(waymark) + ". ";
				}
			}

			// Camp
			if (isScouted && hasVision && !hasCampHere && !hasCampOnLevel) {
				if (featuresComponent.canHaveCamp() && !hasEnemies && !passagesComponent.passageUp && !passagesComponent.passageDown)
					description += "这里适合建一个<span class='hl-functionality'>营地</span>. ";
			}

			return description;
		},

		getResourcesDescription: function (isScouted, featuresComponent, statusComponent) {
			if (!featuresComponent) return;
			let description = "";

			if (isScouted && GameGlobals.gameState.unlockedFeatures.scavenge) {
				description += Text.t("ui.exploration.sector_status_scavenged_percent_field", UIConstants.roundValue(statusComponent.getScavengedPercent()));
				description += "<br />";
			}

			if (this.showInvestigate()) {
				let investigatedPercent = statusComponent.getInvestigatedPercent();
				let investigationComplete = investigatedPercent >= 100;
				if (investigationComplete) {
					description += Text.t("ui.exploration.sector_status_investigated_percent_field_completed", Math.floor(investigatedPercent));
				} else {
					description += Text.t("ui.exploration.sector_status_investigated_percent_field_default", Math.floor(investigatedPercent));
				}
				description += "<br/>";
			}
			
			let scavengedPercent = statusComponent.getScavengedPercent();
			let discoveredResources = GameGlobals.sectorHelper.getLocationDiscoveredResources();
			let knownResources = GameGlobals.sectorHelper.getLocationKnownResources();
			
			let resourcesFoundValueText = "";
			if (knownResources.length > 0) {
				resourcesFoundValueText = TextConstants.getScaResourcesString(discoveredResources, knownResources, featuresComponent.resourcesScavengable);
			} else if (scavengedPercent >= ExplorationConstants.THRESHOLD_SCAVENGED_PERCENT_REVEAL_NO_RESOURCES) {
				if (featuresComponent.resourcesScavengable.getTotal() > 0) {
					resourcesFoundValueText = Text.t("ui.common.value_unknown");
				} else {
					resourcesFoundValueText = Text.t("ui.common.list_template_zero");
				}
			} else {
				resourcesFoundValueText = Text.t("ui.common.value_unknown");
			}
			description += Text.t("ui.exploration.sector_status_resources_found_field", resourcesFoundValueText);
			description += "<br />";
			
			if (featuresComponent.itemsScavengeable.length > 0) {
				let discoveredItems = GameGlobals.sectorHelper.getLocationDiscoveredItems();
				let knownItems = GameGlobals.sectorHelper.getLocationKnownItems();
				let showIngredients = GameGlobals.sectorHelper.hasSectorVisibleIngredients();
				if (showIngredients) {
					description += Text.t("ui.exploration.sector_status_items_found_field", TextConstants.getScaItemString(discoveredItems, knownItems, featuresComponent.itemsScavengeable));
					description += "<br />";
				}
			}

			return description;
		},

		getMovementDescription: function (isScouted, passagesComponent, entity) {
			var description = "";
			var improvements = this.playerLocationNodes.head.entity.get(SectorImprovementsComponent);
			var position = entity.get(PositionComponent);

			// Passages up / down
			var passageUpBuilt = improvements.getCount(improvementNames.passageUpStairs) +
				improvements.getCount(improvementNames.passageUpElevator) +
				improvements.getCount(improvementNames.passageUpHole) > 0;
			var passageDownBuilt = improvements.getCount(improvementNames.passageDownStairs) +
				improvements.getCount(improvementNames.passageDownElevator) +
				improvements.getCount(improvementNames.passageDownHole) > 0;

			if (isScouted) {
				if (passagesComponent.passageUp)
					description += TextConstants.getPassageDescription(passagesComponent.passageUp, PositionConstants.DIRECTION_UP, passageUpBuilt);
				if (passagesComponent.passageDown)
					description += TextConstants.getPassageDescription(passagesComponent.passageDown, PositionConstants.DIRECTION_DOWN, passageDownBuilt);
			}

			// Blockers n/s/w/e
			for (let i in PositionConstants.getLevelDirections()) {
				var direction = PositionConstants.getLevelDirections()[i];
				var directionName = PositionConstants.getDirectionName(direction);
				var blocker = passagesComponent.getBlocker(direction);

				if (blocker) {
					var enemiesComponent = this.playerLocationNodes.head.entity.get(EnemiesComponent);
					var gangComponent = GameGlobals.levelHelper.getGangComponent(position, direction);
					var blockerName = TextConstants.getMovementBlockerName(blocker, enemiesComponent, gangComponent).toLowerCase();
					if (GameGlobals.movementHelper.isBlocked(entity, direction)) {
						switch (blocker.type) {
							case MovementConstants.BLOCKER_TYPE_DEBRIS:
							case MovementConstants.BLOCKER_TYPE_WASTE_TOXIC:
							case MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE:
								description += "向" + directionName + "的通道被<span class='hl-functionality'>" + blockerName + "</span>堵住. ";
								break;
							default:
								description += "向" + directionName + "的通道被<span class='hl-functionality'>" + blockerName + "</span>堵住. ";
								break;
						}
					} else {
						var gang = GameGlobals.levelHelper.getGang(position, direction);
						if (blocker.type == MovementConstants.BLOCKER_TYPE_DEBRIS) {
							description += "堵住" + directionName + "方向通路的残骸被清除了. ";
						} else if (blocker.type == MovementConstants.BLOCKED_TYPE_EXPLOSIVES) {
							description += "堆积在" + directionName + "的爆炸物被清除了. ";
						} else if (blocker.type == MovementConstants.BLOCKER_TYPE_GANG) {
							if (gang) {
								description += directionName + "方向的" + blockerName + "已经被" + TextConstants.getUnblockedVerb(blocker.type) + ". ";
							} else {
								log.w("gang blocker but no gang component at " + position, this);
							}
						} else {
							description += directionName + "方向的" + blockerName + "已经被" + TextConstants.getUnblockedVerb(blocker.type) + ". ";
						}
					}
				}
			}

			return description;
		},

		getDangerDescription: function (isScouted, featuresComponent, hasCampOnLevel) {
			let sectorControlComponent = this.playerLocationNodes.head.entity.get(SectorControlComponent);
			let sectorStatus = this.playerLocationNodes.head.entity.get(SectorStatusComponent);
			let enemiesComponent = this.playerLocationNodes.head.entity.get(EnemiesComponent);
			let hasEnemies = enemiesComponent.hasEnemies;

			let enemyDesc = "";

			if (hasEnemies) {
				if (isScouted) {
					enemyDesc = "This area is " + TextConstants.getEnemyText(enemiesComponent.possibleEnemies, sectorControlComponent).toLowerCase() + ". ";
				}
			} else if (isScouted) {
				enemyDesc += Text.t("ui.exploration.sector_status_no_enemies_description");
				enemyDesc += Text.t("ui.common.sentence_separator");
			}

			var notCampableDesc = "";
			if (isScouted) {
				if (!featuresComponent.campable) {
					var inhabited = featuresComponent.level > 10;
					switch (featuresComponent.notCampableReason) {
						case LevelConstants.UNCAMPABLE_LEVEL_TYPE_RADIATION:
							if (inhabited && featuresComponent.wear < 6)
								notCampableDesc = "许多入口挂着显眼的黄色示警标志, 上面写着\"请勿靠近\", 还有<span class='hl-functionality'>辐射</span>图标. ";
							else if (inhabited && featuresComponent.buildingDensity > 5)
								notCampableDesc = "墙壁上涂满了警示<span class='hl-functionality'>辐射</span>的涂鸦. ";
							else
								notCampableDesc = "古怪的气氛让人不禁推测这里之前被突然<span class='hl-functionality'>荒废</span>了. ";
							break;

						case LevelConstants.UNCAMPABLE_LEVEL_TYPE_POLLUTION:
							if (inhabited && featuresComponent.wear < 6)
								notCampableDesc = "许多入口挂着大红色的<span class='hl-functionality'>骷髅头</span>警示标志, 上面写着\"请勿靠近\". ";
							else if (inhabited && featuresComponent.buildingDensity > 5)
								notCampableDesc = "墙壁上涂满了某种警示<span class='hl-functionality'>污染</span>的涂鸦. ";
							else
								notCampableDesc = "一股<span class='hl-functionality'>刺鼻的气味</span>在空中飘荡. ";
							break;

						case LevelConstants.UNCAMPABLE_LEVEL_TYPE_SUPERSTITION:
							if (inhabited)
								notCampableDesc = "这里没有近期<span class='hl-functionality'>人类活动</span>的迹象. ";
							else
								notCampableDesc = "令人不安的<span class='hl-functionality'>死寂</span>笼罩在街道上空. ";
							break;
					}
				}
			}

			var hasHazards = GameGlobals.sectorHelper.hasHazards(featuresComponent, sectorStatus);
			var hazards = GameGlobals.sectorHelper.getEffectiveHazards(featuresComponent, sectorStatus);
			var hazardDesc = "";
			if (hasHazards) {
				if (hazards.radiation > 0) {
					hazardDesc += "这里有<span class='hl-functionality'>辐射</span> (" + hazards.radiation + "). ";
				}
				if (hazards.poison > 0) {
					hazardDesc += "这里被严重<span class='hl-functionality'>污染</span> (" + hazards.poison + "). ";
				}
				if (hazards.cold > 0) {
					let coldAdjective = hazards.cold < 20 ? "有点" : hazards.cold < 50 ? "非常" : "极其";
					hazardDesc += "这里" + coldAdjective + "<span class='hl-functionality'>冷</span> (" + hazards.cold + "). ";
				}
				if (hazards.flooded > 0) {
					hazardDesc += "这里被<span class='hl-functionality'>淹没</span>了. ";
				}
				if (hazards.debris > 0) {
					hazardDesc += "这里的<span class='hl-functionality'>残骸</span>太多, 难以移动.";
				}
			}

			return enemyDesc + (hasHazards ? hazardDesc : notCampableDesc);
		},

		updateOutImprovementsList: function (improvements) {
			if (!this.playerLocationNodes.head) return;
			if (GameGlobals.playerHelper.isInCamp()) return;
			var improvements = this.playerLocationNodes.head.entity.get(SectorImprovementsComponent);
			var uiFunctions = GameGlobals.uiFunctions;
			var numVisible = 0;
			$.each(this.elements.outImprovementsTR, function () {
				var actionName = $(this).attr("btn-action");

				if (!actionName) {
					actionName = $(this).find("button.action-build").attr("action");
					$(this).attr("btn-action", actionName);
				}

				if (actionName) {
					let improvementName = GameGlobals.playerActionsHelper.getImprovementNameForAction(actionName);
					if (improvementName) {
						let actionVisible = GameGlobals.playerActionsHelper.isVisible(actionName);
						let existingImprovements = improvements.getCount(improvementName);
						$(this).find(".list-amount").text(existingImprovements);
						GameGlobals.uiFunctions.toggle($(this).find(".action-use"), existingImprovements > 0);

						let isVisible = actionVisible || existingImprovements > 0;
						GameGlobals.uiFunctions.toggle($(this), isVisible);
						if (isVisible) numVisible++;
					}
				}
			});
			GameGlobals.uiFunctions.toggle("#header-out-improvements", numVisible > 0);
		},

		updateOutImprovementsStatus: function () {
			if (!this.playerLocationNodes.head) return;
			var improvements = this.playerLocationNodes.head.entity.get(SectorImprovementsComponent);
			var hasCamp = GameGlobals.levelHelper.getLevelEntityForSector(this.playerLocationNodes.head.entity).has(CampComponent);
		
			var collectorFood = improvements.getVO(improvementNames.collector_food);
			var collectorWater = improvements.getVO(improvementNames.collector_water);
			var collectorFoodCapacity = collectorFood.storageCapacity.food * collectorFood.count;
			var collectorWaterCapacity = collectorWater.storageCapacity.water * collectorWater.count;
			$("#out-improvements-collector-food .list-storage").text(
				collectorFoodCapacity > 0 ? (Math.floor(collectorFood.storedResources.food * 10) / 10) + " / " + collectorFoodCapacity : "");
			$("#out-improvements-collector-water .list-storage").text(
				collectorWaterCapacity > 0 ? (Math.floor(collectorWater.storedResources.water * 10) / 10) + " / " + collectorWaterCapacity : "");
				
			let bucketMaxLevel = GameGlobals.campHelper.getCurrentMaxImprovementLevel(improvementNames.collector_water);
			let trapMaxLevel = GameGlobals.campHelper.getCurrentMaxImprovementLevel(improvementNames.collector_food);
				
			GameGlobals.uiFunctions.toggle("#out-action-improve-bucket", collectorWaterCapacity > 0 && bucketMaxLevel > 1);
			GameGlobals.uiFunctions.toggle("#out-action-improve-trap", collectorFoodCapacity > 0 && trapMaxLevel > 1);
		},

		updateLocales: function () {
			if (!this.playerLocationNodes.head) return;

			let currentSector = this.playerLocationNodes.head.entity;
			let positionComponent = currentSector.get(PositionComponent);
			let position = positionComponent.getPosition();
			let campOrdinal = GameGlobals.gameState.getCampOrdinal(position.level);
			
			let sectorLocalesComponent = currentSector.get(SectorLocalesComponent);
			let sectorFeaturesComponent = currentSector.get(SectorFeaturesComponent);
			let sectorStatusComponent = currentSector.get(SectorStatusComponent);
			
			let data = sectorLocalesComponent.locales.map((locale, index) => {
				let isScouted = sectorStatusComponent.isLocaleScouted(index);
				let result = {};
				result.campOrdinal = campOrdinal;
				result.position = position;
				result.index = index;
				result.locale = locale;
				result.isScouted = isScouted;
				result.sectorFeaturesComponent = sectorFeaturesComponent;
				return result;
			});
			
			let numNewItems = UIList.update(this.localeList, data).length;
			
			if (numNewItems > 0) {
				GameGlobals.buttonHelper.updateButtonDisabledStates("#table-out-actions-locales", true);
				GameGlobals.uiFunctions.createButtons("#table-out-actions-locales");
				GlobalSignals.elementCreatedSignal.dispatch();
			}
		},
		
		createLocaleListItem: function () {
			let li = {};
			let button = "<button class='action multiline'></button>";
			let info = "<span class='p-meta'></span";
			li.$root = $("<tr><td>" + button + "</td><td>" + info + "</td></tr>");
			li.$button = li.$root.find("button");
			li.$info = li.$root.find("span");
			return li;
		},
		
		isLocaleListItemDataEqual: function (d1, d2) {
			return d1.index == d2.index && d1.position.equals(d2.position) && d1.isScouted == d2.isScouted;
		},
		
		updateLocaleListItem: function (li, data) {
			let locale = data.locale;
			
			li.$button.attr("action", "scout_locale_" + locale.getCategory() + "_" + data.index);
			li.$button.find(".btn-label").html(TextConstants.getLocaleName(locale, data.sectorFeaturesComponent));
			
			let info = "";
			if (data.isScouted) {
				if (locale.type == localeTypes.tradingpartner) {
					let partner = TradeConstants.getTradePartner(data.campOrdinal);
					if (partner) {
						info += "已探索 (" + partner.name + ")";
					} else {
						info += "已探索";
					}
				} else if (locale.luxuryResource != null) {
					info += "已探索 (" + TribeConstants.getLuxuryDisplayName(locale.luxuryResource) + ")";
				} else {
					info += "已探索";
				}
			}
			li.$info.html(info);
		},

		updateMovementActions: function () {
			let activeDespairType = GameGlobals.playerHelper.getActiveDespairType();
			let showGrit = activeDespairType == MovementConstants.DESPAIR_TYPE_HUNGRER || activeDespairType == MovementConstants.DESPAIR_TYPE_THIRST;
			GameGlobals.uiFunctions.toggle(".movement-action-normal", !showGrit);
			GameGlobals.uiFunctions.toggle(".movement-action-grit", showGrit);
		},

		updateMovementRelatedActions: function () {
			if (!this.playerLocationNodes.head) return;
			if (GameGlobals.playerHelper.isInCamp()) return;

			var currentSector = this.playerLocationNodes.head.entity;
			var movementOptionsComponent = currentSector.get(MovementOptionsComponent);
			var enemiesComponent = currentSector.get(EnemiesComponent);
			var enemiesComponent = currentSector.get(PositionComponent);
			var position = currentSector.get(PositionComponent).getPosition();
			$("#container-out-actions-movement-related").empty();

			function addBlockerActionButton(blocker, direction) {
				if (blocker.type !== MovementConstants.BLOCKER_TYPE_GAP) {
					if (!movementOptionsComponent.canMoveToDirection(direction)) {
						var action = blocker.actionBaseID + "_" + direction;
						var gangComponent = GameGlobals.levelHelper.getGangComponent(position, direction);
						var description = TextConstants.getMovementBlockerAction(blocker, enemiesComponent, gangComponent) + " (" + PositionConstants.getDirectionName(direction, true) + ")";
						var button = "<button class='action' action='" + action + "'>" + description + "</button>";
						$("#container-out-actions-movement-related").append(button);
					}
				}
			}

			for (let i in PositionConstants.getLevelDirections()) {
				var direction = PositionConstants.getLevelDirections()[i];
				var directionBlocker = GameGlobals.movementHelper.getBlocker(currentSector, direction);
				if (directionBlocker && !GameGlobals.movementHelper.isProjectBlocker(directionBlocker.type)) {
					addBlockerActionButton(directionBlocker, direction);
				}
			}

			GameGlobals.uiFunctions.createButtons("#container-out-actions-movement-related");
			GameGlobals.uiFunctions.updateButtonCooldowns("#container-out-actions-movement-related");
			
			GlobalSignals.elementCreatedSignal.dispatch();
		},

		updateSectorDescription: function () {
			if (GameGlobals.gameState.uiStatus.isHidden) return;
			var featuresComponent = this.playerLocationNodes.head.entity.get(SectorFeaturesComponent);
			var sectorStatus = this.playerLocationNodes.head.entity.get(SectorStatusComponent);

			var sector = this.playerLocationNodes.head.entity;
			var vision = this.playerPosNodes.head.entity.get(VisionComponent).value;
			var hasVision = vision > PlayerStatConstants.VISION_BASE;
			var hasCampOnLevel = GameGlobals.levelHelper.getLevelEntityForSector(this.playerLocationNodes.head.entity).has(CampComponent);
			var hasCampHere = this.playerLocationNodes.head.entity.has(CampComponent);
			var isScouted = sectorStatus.scouted;

			// Header
			var features = GameGlobals.sectorHelper.getTextFeatures(sector);
			this.elements.sectorHeader.text(TextConstants.getSectorHeader(hasVision, features));

			// Description
			this.elements.description.html(this.getDescription(
				sector,
				hasCampHere,
				hasCampOnLevel,
				hasVision,
				isScouted
			));
		},

		updateLocationDetails: function () {
			let hasFirstCamp = GameGlobals.gameState.numCamps > 0;
			let hasCampOnLevel = GameGlobals.levelHelper.getLevelEntityForSector(this.playerLocationNodes.head.entity).has(CampComponent);
			let pathToCamp = GameGlobals.playerHelper.getPathToCamp();
			let pathToCampLen = pathToCamp ? pathToCamp.length : "?";
			
			$("#out-action-move-camp-details").text("(" + pathToCampLen + " blocks)");
			
			let showDistanceIndicator = hasFirstCamp;
			GameGlobals.uiFunctions.toggle($("#out-distance-indicator"), showDistanceIndicator);
			if (showDistanceIndicator) {
				if (hasCampOnLevel) {
					$("#out-distance-indicator").text(Text.t("ui.exploration.current_distance_to_camp_field", pathToCampLen));
				} else {
					let pathToPassage = GameGlobals.playerHelper.getPathToPassage();
					let pathToPassageLen = pathToPassage ? pathToPassage.length : "?";
					$("#out-distance-indicator").text(Text.t("ui.exploration.current_distance_to_passage_field", pathToPassageLen));
				}
			}
		},

		rebuildVis: function () {
			if (GameGlobals.gameState.uiStatus.isHidden) return;
			if (!this.playerLocationNodes.head) return;
			this.pendingUpdateMap = false;
			
			let mapPosition = this.playerLocationNodes.head.position.getPosition();
			GameGlobals.uiMapHelper.rebuildMapHints("minimap-background", "minimap", mapPosition);
			GameGlobals.uiMapHelper.rebuildMap("minimap", null, mapPosition, UIConstants.MAP_MINIMAP_SIZE, true, MapUtils.MAP_MODE_DEFAULT);
		},
		
		showInvestigate: function () {
			return GameGlobals.playerActionsHelper.isVisible("investigate");
		},
		
		getResourceCurrentlyAvailableToCollect: function (resourceName) {
			var improvements = this.playerLocationNodes.head.entity.get(SectorImprovementsComponent);
			var collectorName = GameGlobals.sectorHelper.getCollectorName(resourceName);
			var collector = improvements.getVO(collectorName);
			var availableResource = collector.storedResources[resourceName];
			return availableResource || 0;
		},
		
		getWaymarkText: function (waymarkVO) {
			let pos = waymarkVO.fromPosition;
			let sector = GameGlobals.levelHelper.getSectorByPosition(pos.level, pos.sectorX, pos.sectorY);
			let sectorFeatures = GameGlobals.sectorHelper.getTextFeatures(sector);
			return TextConstants.getWaymarkText(waymarkVO, sectorFeatures);
		},
		
		onButtonStateChanged: function (action, isEnabled) {
			switch (action) {
				case "use_out_collector_water":
				case "use_out_collector_water_one":
				case "use_out_collector_food":
				case "use_out_collector_food_one":
					this.updateOutImprovementsStatus();
					break;
			}
		},
	});

	return UIOutLevelSystem;
});
