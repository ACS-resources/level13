define(['ash', 
	'utils/UIList', 
	'utils/FileUtils', 
	'game/GameGlobals', 
	'game/GlobalSignals', 
	'game/constants/GameConstants', 
	'game/constants/UIConstants', 
	'game/systems/SaveSystem',],
function (Ash, UIList, FileUtils, GameGlobals, GlobalSignals, GameConstants, UIConstants, SaveSystem) {

	let UIOutManageSaveSystem = Ash.System.extend({

		showImport: false,
		showExport: false,
		selectedSaveSlot: null,

		constructor: function () {
			this.initElements();
			return this;
		},

		addToEngine: function (engine) {
			this.engine = engine;
			GlobalSignals.add(this, GlobalSignals.popupOpenedSignal, this.onPopupOpened);
		},

		removeFromEngine: function (engine) {
			this.engine = null;
			GlobalSignals.removeAll(this);
		},

		initElements: function () {			
			this.containerSaveList = $("#save-list-container");
			this.containerSaveListOptions = $("#save-list-options");
			this.containerSaveListOptionsEmpty = $("#save-list-options-empty");
			this.containerSaveListOptionsSelected = $("#save-list-options-selected");
			this.containerSaveListOptionsExport = $("#save-list-options-export");
			this.containerImport = $("#save-import-container");

			this.saveSlotList = UIList.create(this, $("#save-list"), this.createSaveSlotListItem, this.updateSaveSlotListItem, this.isSaveSlotListItemDataSame);

			let system = this;
			$("#open-import").click(function () {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.openImport();
			});
			$("#open-save-list").click(function () {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.closeImport();
			});
			$("#paste-import").click(function () {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.pasteImport();
			});
			$("#load-import").click(function () {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.loadImport();
			});
			$("#btn-download-export").click(function () {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.downloadExport();
			});
			$("#btn-copy-export").click(function () {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				navigator.clipboard.writeText($("#textarea-export-save").val());
			});
			$("#btn-back-from-export").click(function () {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.closeExport();
			});
			$("#close-manage-save-popup").click(function (e) {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.resetElements();
				GameGlobals.uiFunctions.popupManager.closePopup("manage-save-popup");
			});
			$("#btn-save-list-options-save").click(function (e) {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.saveToSelectedSlot();
			});
			$("#btn-save-list-options-load").click(function (e) {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.loadFromSelectedSlot();
			});
			$("#btn-save-list-options-export").click(function (e) {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				system.openExport();
			});
		},

		update: function () { },

		refresh: function () {
			this.showImport = false;
			this.showExport = false;
			this.selectedSaveSlot = null;

			this.resetElements();
			this.updateHeader();
			this.updateContainers();
			this.updateSlotList();
		},

		resetElements: function () {
			$("#textarea-import-save").val("");
			$(".li-save-slot").toggleClass("selected", false);
		},

		updateHeader: function () {
			$("#manage-save-popup-header").text(this.showImport ? "Import save" : "Manage saves");
			$("#manage-save-info").text(this.showImport ? "Paste an exported save below to load it." : "Note that the game is still in alpha and updates can break old saves.");
			$("#manage-save-info").toggleClass("p-meta", !this.showImport);
		},

		updateContainers: function () {
			let showSaveList = !this.showImport;

			GameGlobals.uiFunctions.toggle(this.containerSaveList, showSaveList);
			GameGlobals.uiFunctions.toggle(this.containerSaveListOptions, showSaveList);

			GameGlobals.uiFunctions.toggle(this.containerSaveListOptionsEmpty, showSaveList && this.selectedSaveSlot == null);
			GameGlobals.uiFunctions.toggle(this.containerSaveListOptionsSelected, showSaveList && this.selectedSaveSlot != null && !this.showExport);
			GameGlobals.uiFunctions.toggle(this.containerSaveListOptionsExport, showSaveList && this.selectedSaveSlot != null && this.showExport);
			
			this.containerSaveListOptions.toggleClass("selected", this.selectedSaveSlot != null);

			GameGlobals.uiFunctions.toggle(this.containerImport, this.showImport);
			GameGlobals.uiFunctions.toggle("#open-import", !this.showImport);
			GameGlobals.uiFunctions.toggle("#open-save-list", this.showImport);
		},
		
		updateSlotList: function () {
			UIList.update(this.saveSlotList, this.getSaveSlotListData());
		},

		updateSlotDetails: function () {
			let slotID = this.selectedSaveSlot;
			let data = this.getSaveSlotData(slotID);
			let showSave = GameGlobals.saveHelper.hasManualSave(slotID);
			let showLoad = data.hasData;
			let showExport = data.hasData;
			let showRename = GameGlobals.saveHelper.isCustomSaveSlot(slotID);
			let showVersionWarning = this.showSaveVersionWarning(data);

			let slotInfoText = data.slotDisplayName + "<br/>";
			if (data.hasData) {
				slotInfoText += "<span class='secondary'>" + this.getDateDisplayString(data.date) +"</span></br><br/>";
				slotInfoText += "<span class='secondary'>"
				slotInfoText += "world seed: " + data.seed +"</br>";
				slotInfoText += "camps: " + data.numCamps +"</br>";
				slotInfoText += "<span class='" + (showVersionWarning ? "warning" : "") + "'>version: " + data.version + "</span>";
				slotInfoText += "</span>";
				slotInfoText += "</br>";
			} else {
				slotInfoText += "<span class='secondary'>(empty)</span>"
			}

			if (!GameGlobals.saveHelper.hasManualSave(slotID)) {
				slotInfoText += "<br><span class='p-meta'>" + this.getAutomaticSaveInfoText(slotID) + "</span>"
			}

			$("#save-list-options-info").html(slotInfoText);
			GameGlobals.uiFunctions.toggle($("#btn-save-list-options-save"), showSave);
			GameGlobals.uiFunctions.toggle($("#btn-save-list-options-load"), showLoad);
			GameGlobals.uiFunctions.toggle($("#btn-save-list-options-export"), showExport);
			GameGlobals.uiFunctions.toggle($("#btn-save-list-options-rename"), showRename);
		},

		createSaveSlotListItem: function () {
			let li = {};
			let slotName = "<span class='save-slot-name'></span>";
			let saveName = "<span class='save-name'></span>";
			let date = "<span class='save-slot-date'></span>";
			let info = "<span class='save-slot-info'></span>";
			li.$root = $("<div class='li li-save-slot'>" 
				+ "<div class='save-slot-header'>" + date + slotName + saveName + "</div>" 
				+ "<div class='save-slot-content'>" + info + "</div>"
				+ "</div>"
			);
			li.$slotName = li.$root.find(".save-slot-name");
			li.$saveName = li.$root.find(".save-name");
			li.$date = li.$root.find(".save-slot-date");
			li.$info = li.$root.find(".save-slot-info");

			let sys = GameGlobals.engine.getSystem(UIOutManageSaveSystem);
			li.$root.click(function (e) {
				GlobalSignals.triggerSoundSignal.dispatch(UIConstants.soundTriggerIDs.buttonClicked);
				let $target = $(e.currentTarget);
				let slotID = $target.data("slotID");
				$(".li-save-slot").toggleClass("selected", false);
				$target.toggleClass("selected", true);
				sys.selectSlot(slotID);
			});

			return li;
		},

		updateSaveSlotListItem: function (li, data) {
			let hasData = data.hasData;
			let sys = GameGlobals.engine.getSystem(UIOutManageSaveSystem);
			let infoText = hasData ? ("seed: " + data.seed + ", camps: " + data.numCamps) : "(empty)";
			li.$root.data("slotID", data.slotID);
			li.$slotName.text(data.slotDisplayName);
			li.$saveName.text(data.saveName || "");
			li.$date.text(hasData ? sys.getDateDisplayString(data.date) : "");
			li.$info.text(infoText);
			li.$info.toggleClass("dimmed", !hasData);
		},

		isSaveSlotListItemDataSame: function (d1, d2) {
			return d1.slotID == d2.slotID;
		},

		getSaveSlotListData: function () {
			let slotIDs = [ GameConstants.SAVE_SLOT_DEFAULT, GameConstants.SAVE_SLOT_BACKUP, GameConstants.SAVE_SLOT_LOADED, GameConstants.SAVE_SLOT_USER_1, GameConstants.SAVE_SLOT_USER_2, GameConstants.SAVE_SLOT_USER_3 ];

			let result = [];
			for (let i = 0; i < slotIDs.length; i++) {
				let slotID = slotIDs[i];
				let data = this.getSaveSlotData(slotID);
				result.push(data);
			}

			return result;
		},

		getSaveSlotData: function (slotID) {
			let saveDataRaw = this.getSaveData(slotID);
			let saveData = saveDataRaw || {};
			let hasData = saveDataRaw != null;
			let date = hasData ? new Date(saveData.timeStamp) : null;
			let data = {
				slotID: slotID,
				slotDisplayName: this.getSaveSlotDisplayName(slotID),
				hasData: hasData,
				saveName: saveData.saveName,
				date: date,
				version: saveData.version,
				seed: hasData ? saveData.gameState.worldSeed : null,
				numCamps: hasData ? saveData.gameState.numCamps : 0,
			};
			return data;
		},

		getSaveData: function (slotID) {
			let saveSystem = this.getSaveSystem();
			let saveString = saveSystem.getDataFromSlot(slotID);
			if (!saveString) return null;
			let json = saveSystem.getSaveJSONfromCompressed(saveString);
			let saveObject = GameGlobals.saveHelper.parseSaveJSON(json);
			return saveObject;
		},

		getSaveDataSummary: function (saveObject) {
			let result = "";
			let showVersionWarning = this.showSaveVersionWarning(saveObject);

			result += "Save version: <span" + (showVersionWarning ? " class='warning'" : "") + ">" + saveObject.version + "</span><br/>";
			result += "Save timestamp: " + this.getDateDisplayStringFromDateString(saveObject.timeStamp) + "<br/>";
			result += "Save world seed: " + saveObject.gameState.worldSeed;

			if (showVersionWarning) {
				result += "<br/><br/>This save is from an old, incompatible version. It may not work properly.";
			}

			return result;
		},

		getSaveSlotDisplayName: function (slotID) {
			switch (slotID) {
				case GameConstants.SAVE_SLOT_DEFAULT: return "默认";
				case GameConstants.SAVE_SLOT_BACKUP: return "自动 #1（备份）";
				case GameConstants.SAVE_SLOT_LOADED: return "自动 #2（已加载）";
				case GameConstants.SAVE_SLOT_USER_1: return "自定义 #1";
				case GameConstants.SAVE_SLOT_USER_2: return "自定义 #2";
				case GameConstants.SAVE_SLOT_USER_3: return "自定义 #3";
			}
			log.w("Unknown save slot ID: " + slotID);
			return "";
		},

		getAutomaticSaveInfoText: function (slotID) {
			switch (slotID) {
				case GameConstants.SAVE_SLOT_BACKUP: return "建造营地时自动保存。";
				case GameConstants.SAVE_SLOT_LOADED: return "加载页面时自动保存。";
				case GameConstants.SAVE_SLOT_USER_1: return "自定义 #1";
				case GameConstants.SAVE_SLOT_USER_2: return "自定义 #2";
				case GameConstants.SAVE_SLOT_USER_3: return "自定义 #3";
			}
			return "此槽位无法手动覆盖。";
		},

		getDateDisplayStringFromDateString: function (s) {
			return this.getDateDisplayString(new Date(Date.parse(s)));
		},

		getDateDisplayString: function (date) {
			return date.toLocaleString(navigator.language, { timeStyle: "short", dateStyle: "short" });
		},

		getByteSizeText: function (bytes, decimals = 2) {
			if (!bytes) return "0B";
		
			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['B', 'KB', 'MN', 'GB', 'TB' ];
		
			const i = Math.floor(Math.log(bytes) / Math.log(k));
		
			return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
		},

		showSaveVersionWarning: function (saveObject) {			
			let version = saveObject ? saveObject.version : null;
			return GameGlobals.changeLogHelper.isOldVersion(version);
		},

		getSaveSystem: function () {
			return this.engine.getSystem(SaveSystem);
		},

		selectSlot: function (slotID) {
			if (!slotID) return;
			if (!slotID == this.selectedSaveSlot) return;
			this.closeExport();
			this.selectedSaveSlot = slotID;
			this.updateContainers();
			this.updateSlotDetails();
		},

		openImport: function () {
			this.selectedSaveSlot = null;
			this.showImport = true;
			this.resetElements();
			this.updateHeader();
			this.updateContainers();

			GameGlobals.uiFunctions.toggle("#textarea-import-save", true);
			GameGlobals.uiFunctions.toggle("#import-save-msg", false);
		},
		
		closeImport: function () {
			this.selectedSaveSlot = null;
			this.showImport = false;
			this.resetElements();
			this.updateHeader();
			this.updateContainers();
			this.updateSlotList();
		},

		pasteImport: function () {
			navigator.clipboard.readText().then((text) => ($("#textarea-import-save").val(text)));
		},

		loadImport: function () {
			let saveSystem = this.engine.getSystem(SaveSystem);

			let importTextArea = $("#textarea-import-save");
			let importString = importTextArea.val();
			let importJSON = saveSystem.getSaveJSONfromCompressed(importString);
			let saveObject = GameGlobals.saveHelper.parseSaveJSON(importJSON);
			let isOk = saveObject;
			if (isOk) {
				let sys = this;
				let confirmationText = "确定要加载此存档吗？您当前的进度将会丢失。<br/><br/>";
				confirmationText += "加载的数据：<br/>";
				confirmationText += this.getSaveDataSummary(isOk);
				
				importTextArea.val("");
				GameGlobals.uiFunctions.popupManager.closePopup("manage-save-popup");
				GameGlobals.uiFunctions.showConfirmation(
					confirmationText,
					function () {
						sys.loadState(importJSON);
					},
					true
				);
			} else {
				let msg = "这似乎不是有效的存档。";
				$("#import-save-msg").text(msg);
				$("#import-save-msg").toggleClass("warning", true);
				GameGlobals.uiFunctions.toggle("#import-save-msg", true);
			}
		},

		loadState: function (importJSON) {
			let saveSystem = this.getSaveSystem();
			let data = saveSystem.getCompressedSaveJSON(importJSON);
			let success = saveSystem.saveDataToDefaultSlot(data);
			if (!success) return;
			
			GameGlobals.uiFunctions.hideGame(true);
			
			GlobalSignals.restartGameSignal.dispatch(false);
			GameGlobals.uiFunctions.showGame();
		},
		
		downloadExport: function () {
			let now = new Date();
			FileUtils.saveTextToFile("level13-save-" + this.selectedSaveSlot, $("#textarea-export-save").val());
		},

		saveToSelectedSlot: function () {
			let slotID = this.selectedSaveSlot;
			let saveSystem = this.getSaveSystem();
			let data = saveSystem.getCompressedSaveJSON();
			saveSystem.saveDataToSlot(slotID, data);

			this.updateSlotList();
			this.updateSlotDetails();
		},

		loadFromSelectedSlot: function () {
			let slotID = this.selectedSaveSlot;
			let saveSystem = this.getSaveSystem();
			let saveString = saveSystem.getDataFromSlot(slotID);
			let saveJSON = saveSystem.getSaveJSONfromCompressed(saveString);
			let isOk = GameGlobals.saveHelper.parseSaveJSON(saveJSON);
			if (!isOk) {
				log.w("failed to parse save loaded from selected slot");
				return;
			}

			let sys = this;
			GameGlobals.uiFunctions.popupManager.closePopup("manage-save-popup");
			GameGlobals.uiFunctions.showConfirmation(
				"确定要加载此存档吗？任何未保存的进度将会丢失。<br/><br/>"
				+ "加载的数据：<br/>" 
				+ this.getSaveDataSummary(isOk),
				function () {
					sys.loadState(saveJSON);
				},
				true
			);
		},

		openExport: function () {
			let slotID = this.selectedSaveSlot;
			let saveSystem = this.getSaveSystem();
			let saveString = saveSystem.getDataFromSlot(slotID);
			$("#textarea-export-save").val(saveString);

			if (GameConstants.isDebugVersion) {
				let size = new Blob([saveString]).size;
				$("#save-export-info").text(this.getByteSizeText(size));
				GameGlobals.uiFunctions.toggle($("#save-export-info"), true);
			} else {
				GameGlobals.uiFunctions.toggle($("#save-export-info"), false);
			}

			this.showExport = true;
			this.updateContainers();
		},

		closeExport: function () {
			$("#textarea-export-save").val("");
			this.showExport = false;
			this.updateContainers();
		},

		onPopupOpened: function (popupID) {
			if (popupID === "manage-save-popup") {
				this.refresh();
			}
		},

	});
	return UIOutManageSaveSystem;
});
