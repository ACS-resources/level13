// Level 13 specific text helpers

define(['ash',
  'utils/DescriptionMapper',
  'text/Text',
  'text/TextBuilder',
  'game/constants/GameConstants',
  'game/constants/EnemyConstants',
  'game/constants/ItemConstants',
  'game/constants/SectorConstants',
  'game/constants/PositionConstants',
  'game/constants/MovementConstants',
  'game/constants/TradeConstants',
  'game/constants/WorldConstants',
],
  function (Ash, DescriptionMapper, Text, TextBuilder, GameConstants, EnemyConstants, ItemConstants, SectorConstants, PositionConstants, MovementConstants, TradeConstants, WorldConstants) {

    var TextConstants = {

      sentencify: function (s) {
        s = s.trim();
        if (s.length > 0) {
          if (s.endsWith(", ")) s = s.slice(0, -2);
          if (!this.isPunctuation(s[s.length - 1])) s = s + ".";
          if (s[s.length - 1] != " ") s = s + " ";
        }
        return s;
      },

      pluralify: function (s) {
        return Text.pluralify(s);
      },

      isPunctuation: function (c) {
        return c == "." || c == "!" || c == "?";
      },

      getActionName: function (baseActionID) {
        switch (baseActionID) {
          case "scavenge_heap": return "搜寻材料";
          case "scout_locale_i":
          case "scout_locale_u":
            return "探索";
          case "clear_waste_r": return "清除放射性废物";
          case "clear_waste_t": return "清除有毒废物";
          case "build_out_greenhouse": return "搭建温室";
          case "build_out_luxury_outpost": return "建立资源点";
          case "build_out_tradepost_connector": "搭建电梯";
          case "build_out_sundome": "搭建遮阳棚";
          case "bridge_gap": return "连接裂隙";
          case "repair_item": return "修缮物品";
          case "clear_workshop": return "清理车间";
          default:
            return baseActionID;
        }
      },

      getSectorName: function (isScouted, features) {
        var template = "[a-sectortype]的[n-street]";
        var params = this.getSectorTextParams(features);
        var phrase = TextBuilder.build(template, params);
        return Text.capitalize(phrase);
      },

      getSectorHeader: function (hasVision, features) {
        var template = "[a-street]的[a-sectortype]的[n-street]";
        if (features.hasCamp) {
          template = "有营地的[n-street]";
        }
        if (features.hasGrove) {
          template = "[a-street]公园";
        }
        if (!hasVision) {
          if (features.sunlit) {
            template = "阳光下的[n-street]";
          } else {
            template = "黑暗中的[n-street]";
          }
        }
        var params = this.getSectorTextParams(features);
        var phrase = TextBuilder.build(template, params);
        return Text.capitalize(phrase);
      },

      getSectorDescription: function (hasVision, features) {
        var type = hasVision ? "sector-vision" : "sector-novision";
        var template = DescriptionMapper.get(type, features);
        if (features.hasGrove) {
          template = "一个[a-street]的被植被覆盖的公园, 在它中心有一丛茂盛的大树, 尽管看上去很奇怪, 但是有种莫名的平和";
        }
        var params = this.getSectorTextParams(features);
        var phrase = TextBuilder.build(template, params);
        return Text.capitalize(phrase);
      },

      getSectorTextParams: function (features) {
        // 1) Collect options for each param based on several features
        var options = {};
        var addOptions = function (param, values) {
          if (!options[param]) options[param] = [];
          for (let i = 0; i < values.length; i++) {
            options[param].push(values[i]);
          }
        };
        // - general: options always available
        addOptions("a-street", ["安静"]);
        addOptions("n-building", ["建筑", "构筑物"]);
        addOptions("n-buildings", ["建筑"]);
        addOptions("a-building", ["顶天立地", "高", "昏暗", "废弃", "不可名状", "小", "常见", "庞大", "巨型", "巨大", "高大", "宏伟"]);
        addOptions("an-decos", ["坏掉的长凳", "损坏的电梯"]);
        addOptions("an-items", ["残骸"]);
        // - sector type: determines n-sector and affects many others
        switch (features.sectorType) {
          case SectorConstants.SECTOR_TYPE_RESIDENTIAL:
            addOptions("n-sector", ["公寓综合楼"]);
            addOptions("a-street-past", ["曾经美丽", "宁静", "有序", "放松"]);
            addOptions("n-building", ["居民楼楼", "公寓房", "带有无数相同阳台的住宅楼", "住宅区"]);
            addOptions("n-buildings", ["居民楼群", "公寓群", "楼楼群", "相同的居民楼"]);
            addOptions("an-decos", ["有轨电车轨道"]);
            addOptions("a-building", ["寂静", "规律", "巨大", "对称"]);
            addOptions("an-items", ["垃圾"]);
            break;
          case SectorConstants.SECTOR_TYPE_INDUSTRIAL:
            addOptions("n-sector", ["工业综合楼"]);
            addOptions("a-street", ["简朴"]);
            addOptions("a-street-past", ["安全"]);
            addOptions("n-building", ["发电厂", "工厂", "仓库", "车间"]);
            addOptions("n-buildings", ["工厂群", "车间群", "仓库群", "仓库", "车间", "炼油厂"]);
            addOptions("a-building", ["停用", "规律", "巨大", "奇怪"]);
            addOptions("an-items", ["损坏的机械"]);
            break;
          case SectorConstants.SECTOR_TYPE_MAINTENANCE:
            addOptions("n-sector", ["运输大厅", "维护区", "交通枢纽"]);
            addOptions("a-street", ["奇怪", "混乱", "杂乱", "空旷"]);
            addOptions("a-street-past", ["有序"]);
            addOptions("n-building", ["维护中心", "缆车站", "公用建筑", "水处理站"]);
            addOptions("n-buildings", ["公用建筑群", "数据中心", "控制室", "自动控制单元"]);
            addOptions("a-building", ["停用", "无法进入"]);
            addOptions("an-decos", ["破碎的管道", "损坏的电车"]);
            addOptions("an-items", ["电线"]);
            break;
          case SectorConstants.SECTOR_TYPE_COMMERCIAL:
            addOptions("n-sector", ["购物中心", "购物中心", "办公楼综合楼"]);
            addOptions("a-street-past", ["曾经繁华", "喧嚣", "充满活力"]);
            addOptions("n-building", ["购物中心", "百货公司", "办公楼", "咖啡馆", "酒吧"]);
            addOptions("n-buildings", ["购物楼", "购物中心", "商店", "商店", "办公室", "办公楼"]);
            addOptions("a-building", ["空置", "荒废", "被洗劫", "巨大", "古怪", "对称", "多彩"]);
            addOptions("an-decos", ["空的喷泉", "废弃的摊位"]);
            addOptions("an-items", ["破碎的玻璃"]);
            break;
          case SectorConstants.SECTOR_TYPE_PUBLIC:
            addOptions("n-sector", ["监狱综合楼", "游乐园", "图书馆", "公园"]);
            addOptions("a-street", ["庄严", "肃穆", "宏伟", "普通"]);
            addOptions("a-street-past", ["休闲", "有序", "愉快"]);
            addOptions("n-building", ["图书馆", "监狱", "学校", "大学建筑", "公园", "公共广场", "运动场", "地铁站", "研究实验室", "政府大楼"]);
            addOptions("n-buildings", ["公共建筑", "政府建筑"]);
            addOptions("a-building", ["空置", "无法进入", "巨大", "怪异", "对称"]);
            addOptions("an-decos", ["枯萎的树木"]);
            addOptions("an-items", ["垃圾"]);
            if (features.level > 13) addOptions("an-items", ["研究样品"]);
            break;
          case SectorConstants.SECTOR_TYPE_SLUM:
            addOptions("n-sector", ["棚户区", "垃圾填埋场"]);
            addOptions("a-street", ["破旧", "混乱"]);
            addOptions("a-street-past", ["阴暗", "拥挤", "活跃"]);
            addOptions("n-building", ["公寓楼"]);
            addOptions("a-building", ["废弃", "粗糙", "压抑", "凌乱", "灰暗", "涂鸦覆盖"]);
            addOptions("n-buildings", ["简陋小屋", "棚屋", "贫民窟住宅", "公寓楼", "看起来从未接入电网的居民楼"]);
            addOptions("an-decos", ["倒塌的棚屋", "垃圾堆"]);
            addOptions("an-items", ["生锈的管道", "空罐头"]);
            break;
        }
        // - 建筑密度
        if (features.buildingDensity < 3) {
          addOptions("n-street", ["区域", "空间", "广场"]);
          if (features.sectorType == SectorConstants.SECTOR_TYPE_RESIDENTIAL || features.sectorType == SectorConstants.SECTOR_TYPE_COMMERCIAL)
            addOptions("n-street", ["广场", "庭院"]);
          addOptions("a-street", ["宽阔", "宽敞", "巨大"]);
        } else if (features.buildingDensity < 6) {
          addOptions("n-street", ["广场", "区域", "大厅"]);
          if (features.sectorType == SectorConstants.SECTOR_TYPE_RESIDENTIAL || features.sectorType == SectorConstants.SECTOR_TYPE_COMMERCIAL)
            addOptions("n-street", ["林荫大道", "大街"]);
          if (features.sectorType != SectorConstants.SECTOR_TYPE_SLUM)
            addOptions("n-street", ["通道"]);
          addOptions("a-street", ["宽阔", "宽敞"]);
        } else if (features.buildingDensity < 9) {
          addOptions("n-street", ["街道", "街道", "小巷", "综合楼", "区域"]);
          addOptions("a-street", ["狭窄"]);
        } else {
          addOptions("n-street", ["走廊", "通道", "小巷"]);
          addOptions("a-street", ["狭窄", "拥挤", "密集", "低矮"]);
        }
        // - 磨损和损坏
        switch (features.condition) {
          case SectorConstants.SECTOR_CONDITION_RUINED:
            addOptions("a-street", ["毁坏", "摇摇欲坠"]);
            addOptions("n-buildings", ["摇摇欲坠的废墟"]);
            addOptions("n-buildings", ["摇摇欲坠的废墟"]);
            addOptions("a-building", ["毁坏", "骨架"]);
            break;
          case SectorConstants.SECTOR_CONDITION_DAMAGED:
            addOptions("a-street", ["损坏", "被摧毁", "破碎"]);
            addOptions("a-building", ["损坏"]);
            addOptions("an-decos", ["倒塌的隧道"]);
            break;
          case SectorConstants.SECTOR_CONDITION_ABANDONED:
            addOptions("a-street", ["荒凉", "阴郁"]);
            addOptions("a-building", ["腐朽", "荒废", "缓慢分解", "早已废弃", "摇摇欲坠"]);
            break;
          case SectorConstants.SECTOR_CONDITION_WORN:
            addOptions("a-building", ["荒凉", "废弃", "阴郁"]);
            break;
          case SectorConstants.SECTOR_CONDITION_RECENT:
            addOptions("a-building", ["保存良好", "现代"]);
            break;
          case SectorConstants.SECTOR_CONDITION_MAINTAINED:
            addOptions("a-street", ["现代", "光滑"]);
            break;
        }
        // - 阳光
        if (features.sunlit) {
          addOptions("a-street", ["阳光照耀", "沐浴在阳光下", "耀眼", "明亮", "有风", ""]);
          if (features.wear < 5 && features.damage < 5)
            addOptions("a-street", ["闪耀", "闪闪发光"]);
          if (features.wear > 5)
            addOptions("a-street", ["杂草丛生"]);
          addOptions("a-building", ["充满活力", "阳光照耀"]);
          addOptions("an-decos", ["顽强的野草"]);
        } else {
          addOptions("a-street", ["黑暗", "黑暗", "阴暗", "阴影", "暗淡"]);
        }
        // - 危害
        if (features.hazards.cold > 0) {
          addOptions("a-street", ["寒冷"]);
        }
        if (features.hazards.radiation > 0) {
          addOptions("a-street", ["荒凉"]);
          addOptions("n-building", ["核电站", "核废料仓库", "核废料处理单位"]);
          addOptions("a-building", ["被遗弃"]);
          addOptions("na-items", ["丢弃的安全设备"]);
        }
        if (features.hazards.poison > 0) {
          addOptions("a-street", ["污染"]);
          addOptions("n-building", ["化工厂", "炼油厂", "垃圾处理厂"]);
          addOptions("a-building", ["污染"]);
          addOptions("na-items", ["使用过的医用口罩"]);
        }
        if (features.hazards.debris) {
          addOptions("a-street", ["被摧毁", "损坏", "毁坏"]);
          addOptions("n-building", ["建筑"]);
          addOptions("a-building", ["被摧毁", "无法辨认", "空心"]);
          addOptions("na-items", ["碎片"]);
        }
        // - 人口水平
        if (features.populationFactor == 0) {
          addOptions("a-street", ["空无一人", "无人居住", "荒凉", "荒废", "尘土飞扬"])
          addOptions("a-building", ["长期废弃", "空无一人", "污染"]);
        } else if (features.populationFactor < 1) {
          addOptions("a-street", ["宁静"]);
          addOptions("a-building", ["空无一人"]);
        } else {
          addOptions("a-building", ["最近被洗劫"]);
          addOptions("na-items", ["最近的捡荒者痕迹"]);
        }
        // - 突袭危险因素
        if (features.raidDangerFactor > 1) {
          addOptions("a-street", ["被洗劫"]);
          addOptions("a-building", ["被洗劫", "损坏", "被掠夺", "被洗劫"]);
        }
        // - 层次：建筑风格/年代
        if (features.level < 6) {
          addOptions("a-street", ["古老", "古朴"]);
          addOptions("a-building", ["古老", "过时", "古朴", "历史", "装饰华丽", "巴洛克风格"]);
        } else if (features.level < 14) {
          addOptions("a-street", ["过时"]);
          addOptions("a-building", ["过时"]);
        } else if (features.level < 18) {
          addOptions("a-street", ["现代"]);
          addOptions("a-building", ["现代", "时尚", "功能性"]);
        }

        // 2) 构建最终结果通过选择选项
        let result = {};
        var rand = (features.buildingDensity + features.wear + features.damage) / 30;
        var pickRandom = function (options, excluded) {
          if (!options || options.length <= 0) return "";
          var validOptions = options.filter(option => !excluded.includes(option));
          let i = Math.floor(rand * validOptions.length);
          return validOptions[i];
        };
        var selectFromOptions = function (key, num) {
          var selection = [];
          for (let i = 0; i < num; i++) {
            var sel = pickRandom(options[key], selection);
            if (sel) {
              selection.push(sel);
            } else {
              log.w("could not select valid [" + key + "] " + (i + 1) + "/" + num)
              log.w(options);
            }
          }
          return selection;
        };
        result["a-sectortype"] = features.sectorType;
        result["n-sector"] = selectFromOptions("n-sector", 1);
        result["n-street"] = selectFromOptions("n-street", 1);
        result["a-street"] = selectFromOptions("a-street", 2);
        result["a-street-past"] = selectFromOptions("a-street-past", 1);
        result["n-building"] = selectFromOptions("n-building", 2);
        result["n-buildings"] = selectFromOptions("n-buildings", 2);
        result["a-building"] = selectFromOptions("a-building", 2);
        result["an-decos"] = selectFromOptions("an-decos", 2);
        result["an-items"] = selectFromOptions("an-items", 2);

        return result;
      },

      getPassageFoundMessage: function (passageVO, direction, sunlit, isBuilt) {
        switch (passageVO.type) {
          case MovementConstants.PASSAGE_TYPE_HOLE:
            if (direction === PositionConstants.DIRECTION_UP) {
              if (isBuilt) {
                return "这里建好了一个电梯";
              } else {
                if (sunlit)
                  return "远距离之上的顶端有一个洞";
                else
                  return "远距离之上的顶端有一个洞, 洞口通向黑暗的深处";
              }
            } else {
              if (isBuilt) {
                return "这里曾经是一个巨大的地陷, 现在这里建好了一个电梯";
              } else {
                if (sunlit)
                  return "这里是一个巨大的地陷, 下面的一条街隐约可见";
                else
                  return "这里是一个巨大的地陷, 所见之处皆是一片黑暗的虚空";
              }
            }
          case MovementConstants.PASSAGE_TYPE_BLOCKED:
            return "There seems to have been a staircase here once but it has been destroyed beyond repair.";
          default:
            if (isBuilt) {
              return "这里有一个" + Text.addArticle(passageVO.name.toLowerCase());
            } else {
              return "这里曾经有一个" + Text.addArticle(passageVO.name.toLowerCase());
            }
        }
      },

      getPassageRepairedMessage: function (passageType, direction, sectorPosVO, numCampsBuilt) {
        let directionName = (direction === PositionConstants.DIRECTION_UP ? " up" : " down");
        let includeLevelInPosition = numCampsBuilt > 1;
        switch (passageType) {
          case MovementConstants.PASSAGE_TYPE_HOLE:
            return "有个向" + directionName + "的电梯被建在了" + sectorPosVO.getInGameFormat(includeLevelInPosition);
          case MovementConstants.PASSAGE_TYPE_ELEVATOR:
            return "有个向" + directionName + "的电梯已经修好, 位于" + sectorPosVO.getInGameFormat(includeLevelInPosition);
          case MovementConstants.PASSAGE_TYPE_STAIRWELL:
            return "有个向" + directionName + "的楼梯井已经修好, 位于" + sectorPosVO.getInGameFormat(includeLevelInPosition);
          default:
            log.w("Unknown passage type: [" + passageType + "]")
            return "Passage " + directionName + " ready at " + sectorPosVO.getInGameFormat(includeLevelInPosition);
        }
      },

      getPassageDescription: function (passageVO, direction, isBuilt, isShort) {
        var makeHighlight = function (content) { return "<span class='hl-functionality'>" + content + "</span>"; };
        var directionName = (direction === PositionConstants.DIRECTION_UP ? " up" : " down");
        if (isShort) {
          switch (passageVO.type) {
            case MovementConstants.PASSAGE_TYPE_HOLE:
              if (isBuilt) {
                return "passage " + directionName + " (elevator) (built)";
              } else {
                return "hole in the level " + (direction === PositionConstants.DIRECTION_UP ? "ceiling" : "floor");
              }
            default:
              var status = isBuilt ? "修好" : "损坏";
              if (passageVO.type === MovementConstants.PASSAGE_TYPE_BLOCKED) {
                status = "修不了的"
              }
              return "通往" + directionName + "的过道 (" + passageVO.name.toLowerCase() + ") (" + status + ")";
          }
        } else {
          switch (passageVO.type) {
            case MovementConstants.PASSAGE_TYPE_HOLE:
              if (isBuilt) {
                return "一个新的" + makeHighlight("向" + directionName + "的电梯") + "在这里修好了";
              } else {
                return "有个" + makeHighlight("洞") + "在这个层级的" + (direction === PositionConstants.DIRECTION_UP ? "天花板" : "地板") + "上";
              }
            default:
              var name = passageVO.name.toLowerCase() + " " + directionName;
              var article = Text.getArticle(name);
              var span = article + " " + makeHighlight(name);
              var state;
              if (isBuilt) {
                state = "而它已经被修好了";
              } else if (passageVO.type === MovementConstants.PASSAGE_TYPE_ELEVATOR) {
                state = "但它损坏了";
              } else if (passageVO.type === MovementConstants.PASSAGE_TYPE_BLOCKED) {
                state = "但它修不了";
              } else {
                state = "但它得修一下";
              }
              return "这里有个 " + span + ", 已经" + state + "了";
          }
        }
      },

      getReadBookMessage: function (itemVO, bookType, campOrdinal) {
        let features = {};
        features.bookType = bookType;
        features.bookName = itemVO.name;
        features.bookLevel = itemVO.level || 1;
        features.campOrdinal = campOrdinal;
        features.randomSeed = itemVO.itemID;
        let params = this.getBookTextParams(features);

        let template = DescriptionMapper.get("book-intro", features) + " " + DescriptionMapper.get("book-description", features);
        let phrase = TextBuilder.build(template, params);

        return phrase;
      },

      getBookTextParams: function (features) {
        var result = {};

        let levels = [];
        switch (features.bookLevel) {
          case 1:
            levels.push("简单");
            levels.push("过时");
            levels.push("简化");
            break;
          case 2:
            levels.push("基础");
            levels.push("常规");
            levels.push("体面");
            break;
          case 3:
            levels.push("高级");
            levels.push("详细");
            levels.push("富有洞察力");
            levels.push("沉重");
            break;
        }
        result["a-level"] = DescriptionMapper.pickRandom(levels, features);

        let styles = [];
        switch (features.bookType) {
          case ItemConstants.bookTypes.science:
          case ItemConstants.bookTypes.engineering:
          case ItemConstants.bookTypes.history:
            styles.push("信息丰富");
            styles.push("详细");
            styles.push("枯燥");
            styles.push("富有洞察力");
            styles.push("漫无目的");
            styles.push("插图");
            styles.push("科学性");
            styles.push("正式");
            styles.push("系统性");
            break;
          case ItemConstants.bookTypes.fiction:
            styles.push("鼓舞人心");
            styles.push("现实");
            styles.push("动作密集");
            styles.push("喜剧");
            styles.push("悲剧");
            styles.push("浪漫");
            styles.push("戏剧性");
            styles.push("异想天开");
            styles.push("无聊");
            styles.push("黑暗");
            styles.push("令人兴奋");
            styles.push("令人不安");
            styles.push("迷人");
            styles.push("感人");
            styles.push("真实");
            styles.push("图形化");
            styles.push("缓慢");
            styles.push("详尽");
            styles.push("离奇");
            break;
        }
        result["a-style"] = DescriptionMapper.pickRandom(styles, features);

        let goodAdjectives = [];
        goodAdjectives.push("雄辩");
        goodAdjectives.push("难忘");
        goodAdjectives.push("愉快");
        goodAdjectives.push("优秀");
        switch (features.bookType) {
          case ItemConstants.bookTypes.science:
          case ItemConstants.bookTypes.engineering:
          case ItemConstants.bookTypes.history:
            goodAdjectives.push("详细");
            goodAdjectives.push("全面");
            goodAdjectives.push("彻底");
            goodAdjectives.push("吸引人");
            goodAdjectives.push("彻底");
            goodAdjectives.push("有用");
            break;
          case ItemConstants.bookTypes.fiction:
            goodAdjectives.push("杰出");
            goodAdjectives.push("生动");
            goodAdjectives.push("吸引人");
            break;
        }
        result["a-good"] = DescriptionMapper.pickRandom(goodAdjectives, features);

        let badAdjectives = [];
        badAdjectives.push("乏味");
        badAdjectives.push("单调");
        badAdjectives.push("枯燥");
        switch (features.bookType) {
          case ItemConstants.bookTypes.science:
          case ItemConstants.bookTypes.engineering:
          case ItemConstants.bookTypes.history:
            badAdjectives.push("不切实际");
            badAdjectives.push("模糊");
            break;
          case ItemConstants.bookTypes.fiction:
            badAdjectives.push("易忘");
            badAdjectives.push("非原创");
            badAdjectives.push("俗气");
            break;
        }
        result["a-bad"] = DescriptionMapper.pickRandom(badAdjectives, features);

        let topics = [];
        switch (features.bookType) {
          case ItemConstants.bookTypes.science:
            topics.push("一种在放射性环境中茁壮成长的蛞蝓物种");
            topics.push("城市的基础设施");
            topics.push("海洋");
            topics.push("森林");
            topics.push("城市的通风系统");
            topics.push("医学");
            topics.push("电子学");
            topics.push("如何保护自己免受阳光的有害影响");
            topics.push("如何将原始橡胶加工成多种有用的形式");
            topics.push("癌症治疗");
            topics.push("DNA");
            topics.push("进化");
            topics.push("板块构造");
            topics.push("电池");
            topics.push("化石");
            topics.push("发酵");
            topics.push("病毒");
            topics.push("太阳历");
            topics.push("雷达技术");
            topics.push("数学");
            topics.push("生态系统");
            topics.push("牙科");
            topics.push("计算机");
            topics.push("印刷机");
            topics.push("光学镜片");
            topics.push("肥料");

            if (features.bookLevel == 1) {
              topics.push("古代武器");
              topics.push("小苏打的多种用途");
              topics.push("板块构造");
              topics.push("一种古老的材料叫做木头");
              topics.push("食品保存");
            }
            if (features.bookLevel == 2) {
              topics.push("粮食作物轮作");
              topics.push("火药");
              topics.push("电");
              topics.push("无线电技术");
              topics.push("磁性指南针");
              topics.push("地球大气层");
              topics.push("温室维护");
              topics.push("生物化学");
            }
            if (features.bookLevel == 3) {
              topics.push("电磁学");
              topics.push("其他行星");
              topics.push("原子武器");
              topics.push("暗物质");
            }
            break;

          case ItemConstants.bookTypes.fiction:
            topics.push("前坠落时期的流行音乐");
            topics.push("黑暗层次的生活");
            topics.push("早期移民到城市的生活");
            topics.push("一个遥远的岛屿");
            topics.push("在不同行星之间的旅行");
            topics.push("一位著名女演员");
            topics.push("贫民窟的生活");
            topics.push("地表上的犯罪侦探的生活");
            topics.push("城市无人居住层次的鬼魂");
            topics.push("一个古老的火山");
            topics.push("海底旅行");
            topics.push("一个可怕的海怪");
            topics.push("一个男孩和他的蝙蝠的关系");
            break;

          case ItemConstants.bookTypes.history:
            topics.push("生物战");
            topics.push("前城市文明");
            topics.push("农业的发展");
            topics.push("绘画历史");
            topics.push("工业革命");
            topics.push("数字革命");
            topics.push("一个特定的民族群体");
            topics.push("城市建立后不久的一场饥荒");
            topics.push("一个前城市全球法律组织");
            topics.push("数学的历史");
            topics.push("一个伟大的科学项目");
            topics.push("沉船");
            topics.push("奴隶制");
            topics.push("城市某个特定部分居民的魔法信仰");
            topics.push("一个历史上的独裁统治");

            if (features.bookLevel == 1) {
              topics.push("早期的城市");
              topics.push("城市不同部分的建筑风格");
              topics.push("一次大地震对城市的影响");
              topics.push("前坠落时期的宗教以及它们如何导致了几场战争");
            }
            if (features.bookLevel == 2) {
              topics.push("一个强大的犯罪集团的历史");
              topics.push("城市内两个派系之间的一场大战");
            }
            if (features.bookLevel == 3) {
              topics.push("一个强大的犯罪集团的历史");
              topics.push("前坠落政府是如何形成的");
            }
            break;

          case ItemConstants.bookTypes.engineering:
            topics.push("一个工业过程");
            topics.push("晶体管");
            topics.push("核反应堆");
            topics.push("无线电");
            topics.push("建筑");
            topics.push("3D打印");
            topics.push("机器控制系统");
            topics.push("机器人设计");
            topics.push("电梯");
            topics.push("统计学");
            topics.push("电子学");
            topics.push("桥梁");

            if (features.bookLevel == 1) {
              topics.push("钢铁生产");
              topics.push("橡胶生产");
              topics.push("放射性废物管理");
            }
            if (features.bookLevel == 2) {
              topics.push("人工智能");
              topics.push("一种编程语言");
            }
            if (features.bookLevel == 3) {
              topics.push("编程");
              topics.push("机器人的制造");
              topics.push("编程");
            }
            break;
        }
        result["n-topic"] = DescriptionMapper.pickRandom(topics, features);

        let objects = [];
        switch (features.bookType) {
          case ItemConstants.bookTypes.engineering:
            objects.push("晶体管");
            objects.push("你并不真正理解的机器，但看起来它们被用于稳定城市");
            objects.push("一个称为天花板的全层面太阳能屏幕");
            objects.push("前坠落时期温室中的灌溉系统");
            objects.push("一种家用电器");

            if (features.bookLevel == 1) {
              objects.push("旧电梯的引擎");
              objects.push("一种武器");
              objects.push("一种医疗仪器");
            }
            if (features.bookLevel == 2) {
              objects.push("跨越城市整个层面的信息网络");
              objects.push("一种飞行器");
              objects.push("一种用于收集和处理垃圾的机器人");
              objects.push("一种用于存储和传输数据的设备");
            }
            if (features.bookLevel == 3) {
              objects.push("不同类型的机器人");
              objects.push("一枚伟大的火箭");
              objects.push("污水系统");
            }
            break;
        }
        result["n-object"] = DescriptionMapper.pickRandom(objects, features);

        let themes = [];
        switch (features.bookType) {
          case ItemConstants.bookTypes.fiction:
            themes.push("来自另一个大陆的难民");
            themes.push("一个矿工第一次看到太阳");
            themes.push("一场可怕的风暴撕裂了城市的边缘");
            themes.push("一场大洪水");
            themes.push("一个能预测天气的萨满");
            themes.push("城市内不同派系之间的战争");
            themes.push("英雄领袖的崛起");
            themes.push("一个贫民区居民经历许多障碍最终在城市中上升");
            themes.push("前坠落时期贫民区一个犯罪团伙的兴衰");
            themes.push("一个男人放弃城市的居住部分，试图自己找到地面");
            themes.push("一群科学家被困在城市旧部分的一个研究站");
            themes.push("两个被迫远离彼此工作的人之间的爱情");
            themes.push("一个官员的工作是评估个人对城市的贡献价值");
            themes.push("城市人民在一个政府下的统一");
            themes.push("怀念遥远故土的人");
            themes.push("据说在城市废弃部分徘徊的鬼魂");
            themes.push("一个从未离开她房间的女孩");
            themes.push("一队在城市某部分的电梯和电车上工作的人");
            themes.push("前坠落时期一家报纸办公室复杂的社会等级");
            themes.push("城市中只有老人的一个邻里");
            themes.push("一个富裕但孤独的商人的生活");
            themes.push("一个男孩与机器人的友谊");
            themes.push("一个让人们忘记自己是谁的计算机程序");
            break;
        }
        result["c-theme"] = DescriptionMapper.pickRandom(themes, features);

        let facts = [];
        switch (features.bookType) {
          case ItemConstants.bookTypes.science:
            facts.push("城市的人口在坠落前就已经开始下降了");
            facts.push("古代文明常常使用木头作为建筑材料，因为在地面上它很丰富");
            facts.push("城市深处有几个采矿镇");
            facts.push("城市下面某些层次的维护主要由机器人完成");
            facts.push("城市的大部分食品温室位于其边缘");
            facts.push("城市中的大部分水是在地面和地表收集的雨水");
            facts.push("有些动物一生都在水下生活");
            facts.push("蜘蛛丝是已知的最强大的天然材料");
            facts.push("香蕉是放射性的");
            facts.push("没有唾液就无法品尝食物");
            break;
          case ItemConstants.bookTypes.history:
            facts.push("几个强大的采矿公司在坠落前拥有巨大的权力");
            facts.push("古代文明根据四季来制定他们的日历");
            facts.push("城市最初是建在沼泽地上的");
            facts.push("城市由来自几个古老文明的人居住");
            facts.push("曾经有一个叫做城市政府的东西");
            facts.push("城市在其历史中经历了几次饥荒");
            facts.push("城市开始建造大约是700年前");
            facts.push("曾经有一个时期，所有的宗教在城市中都被禁止");
            facts.push("最后一个水下研究站在坠落前几十年关闭");
            break;
          case ItemConstants.bookTypes.engineering:
            facts.push("城市的下层有不等的高度");
            facts.push("城市的大部分区域过去是由电灯照明的");
            facts.push("城市的表面过去被一个巨大的圆顶所保护");
            facts.push("阳光过去通过复杂的镜子系统被反射到城市更深处");
            facts.push("城市的部分区域建造在山中");
            facts.push("海洋被严重污染了");
            // TODO get general facts like these in features / otherwise
            // TODO add more and splt by level so these don't get repetitive
            // facts.push("城市有X个层次");
            // facts.push("城市的最低层实际上是第X层");
            break;
        }
        let events = [];
        switch (features.bookType) {
          case ItemConstants.bookTypes.history:
            events.push("城市几百年前对某个遥远文明发动的一场战争");
            events.push("过去500年来城市的战争");
            events.push("城市最初级别的建设");
            events.push("从某个遥远岛屿迁徙到城市");
            events.push("书写之前几十年发生的所谓“大饥荒”");
            events.push("全市范围内政府的建立");
            events.push("一次重大园艺师起义");
            events.push("核电厂事故，废料泄漏至城市较低层级");
            events.push("农业从地面转向温室的重大转变");
            events.push("城市发生的一系列恐怖袭击");
            events.push("第一个电脑病毒");
            events.push("城市与外部某个国家之间的一场毁灭性战争");
            events.push("妇女参政权");
            events.push("一系列关于植入体改造人体的实验");
            events.push("涉及一个有影响力的政治家的丑闻");
            break;
        }
        result["c-event"] = DescriptionMapper.pickRandom(events, features);

        return result;
      },

      getReadNewspaperMessage: function (itemVO) {
        let features = {};
        features.itemName = itemVO.name;
        features.itemLevel = itemVO.level || 1;
        features.randomSeed = itemVO.itemID;
        let params = this.getNewspaperTextParams(features);

        let template = "你翻了翻报纸, " + DescriptionMapper.get("newspaper-description", features);
        let phrase = TextBuilder.build(template, params);

        return phrase;
      },

      getNewspaperTextParams: function (features) {
        let result = {};

        let events = [];
        events.push("一场工人罢工");
        events.push("一个地方庆典");
        events.push("一群难民的到来");
        events.push("三胞胎的出生");
        events.push("一次疾病爆发");
        events.push("一支失踪的商队");
        events.push("一次幽灵目击事件");
        events.push("某个建筑中不可解释的光亮");
        switch (features.itemLevel) {
          case 1:
            events.push("新狩猎场的发现");
            events.push("一层楼的倒塌");
            events.push("一个人口里程碑");
            break;
          case 2:
            events.push("新熔炼技术的发现");
            events.push("新领导的选举");
            events.push("一个音乐节");
            events.push("新渠道的完工");
            events.push("对城市未探索部分的远征");
            break;
          case 3:
            events.push("新建筑材料的发现");
            events.push("新药物的发现");
            events.push("一个地方体育赛事");
            break;
        }
        result["c-event"] = DescriptionMapper.pickRandom(events, features);

        let topics = [];
        topics.push("地方政治");
        topics.push("地方八卦");
        topics.push("星座运势");
        topics.push("定居点周围的植物生活");
        topics.push("城市的侵蚀");
        topics.push("一个闹鬼的商业中心");
        switch (features.itemLevel) {
          case 1:
            topics.push("黑暗层级中的生存技巧");
            topics.push("坠落前黑暗层级的生活");
            topics.push("养蝙蝠作为宠物");
            break;
          case 2:
            topics.push("医学");
            topics.push("烹饪");
            topics.push("私有财产");
            topics.push("小规模园艺");
            break;
          case 3:
            topics.push("网络");
            topics.push("道德问题");
            break;
        }
        result["n-topic"] = DescriptionMapper.pickRandom(topics, features);

        return result;
      },

      getDonateSeedsMessage: function (itemVO) {
        return "将种子捐赠给了寺庙。神职人员将珍视它们，也许会有东西生长。";
      },

      getReadResearchPaperMessage: function (itemVO) {
        let features = {};
        features.itemName = itemVO.name;
        features.itemLevel = itemVO.level || 1;
        features.randomSeed = itemVO.itemID;
        let params = this.getResearchPaperTextParams(features);

        let template = "你读了这篇论文。" + DescriptionMapper.get("researchpaper-description", features);
        let phrase = TextBuilder.build(template, params);

        return phrase;
      },

      getResearchPaperTextParams: function (features) {
        let result = {};

        let facts = [];
        facts.push("城市比其当前人口可能维持的速度更快地分崩离析");
        facts.push("城市建在沼泽地上，正在慢慢下沉");
        facts.push("坠落前海洋流向正在改变");
        facts.push("坠落前几年，一些研究人员对火山活动感到担忧");
        facts.push("坠落前有一个研究小组在调查返回地面生活的可能性");
        facts.push("城市外的空气对呼吸有害");
        facts.push("坠落前有一个顶级秘密研究小组");
        facts.push("坠落涉及城市表面附近的一次大爆炸");
        facts.push("坠落前的政府在太空研究上投入巨资");
        facts.push("囚犯被用于与太空旅行相关的秘密实验");
        facts.push("政府正在编制一份紧急疏散情况下的优先个人名单");
        facts.push("坠落前正在为某事准备的顶级秘密基因库");
        facts.push("城市政府想要隐藏大量燃料和建筑材料的囤积");
        result["c-fact"] = DescriptionMapper.pickRandom(facts, features);

        let topics = [];
        topics.push("一次太空火箭发射失败对城市可能的后果");
        topics.push("可以住在宇宙飞船上的人数");
        topics.push("长距离太空旅行的可能性");
        topics.push("附近行星和恒星系统的宜居性");
        topics.push("非常大型宇宙飞船的燃料计算");
        topics.push("一个可持续定居点所需的人数");
        topics.push("超级火山");
        topics.push("空气质量");
        topics.push("通过歌唱控制天气的可能性");
        topics.push("开花植物对骰子掷出结果的影响");

        result["n-topic"] = DescriptionMapper.pickRandom(topics, features);

        return result;
      },

      getFoundStashMessage: function (stashVO) {
        switch (stashVO.stashType) {
          case ItemConstants.STASH_TYPE_ITEM:
            return "发现了一个物品藏匿处。";
          case ItemConstants.STASH_TYPE_SILVER:
            return "找到了一些硬币。";
          default:
            log.w("未知的藏匿类型: " + stashVO.stashType);
            return "找到了一个藏匿处。";
        }
      },

      getWaymarkText: function (waymarkVO, sectorFeatures) {
        let features = Object.assign({}, sectorFeatures);
        features.waymarkType = waymarkVO.type;
        features.direction = PositionConstants.getDirectionFrom(waymarkVO.fromPosition, waymarkVO.toPosition);

        let template = DescriptionMapper.get("waymark", features);
        let params = this.getWaymarkTextParams(waymarkVO, features);
        let phrase = TextBuilder.build(template, params);

        result = phrase;
        if (GameConstants.isDebugVersion) result += " [" + waymarkVO.toPosition + "]";

        return result;
      },

      getWaymarkTextParams: function (waymarkVO, features) {
        let result = {};

        let tradePartner = TradeConstants.getTradePartner(features.campOrdinal);

        result["n-target"] = "<span class='hl-functionality'>" + this.getWaymarkTargetName(waymarkVO) + "</span>";
        result["direction"] = PositionConstants.getDirectionName(features.direction, false);
        result["n-settlement-name"] = tradePartner ? tradePartner.name : null;
        return result;
      },
      getWaymarkTargetName: function (waymarkVO) {
        switch (waymarkVO.type) {
          case SectorConstants.WAYMARK_TYPE_SPRING: return "水源";
          case SectorConstants.WAYMARK_TYPE_CAMP: return "安全";
          case SectorConstants.WAYMARK_TYPE_RADIATION: return "危险";
          case SectorConstants.WAYMARK_TYPE_POLLUTION: return "危险";
          case SectorConstants.WAYMARK_TYPE_SETTLEMENT: return "贸易点";
          default:
            log.w("未知的路标类型: " + waymarkVO.type);
            return "安全";
        }
      },

      getResourceDisplayName: function (resourceName) {
        return resourceName;
      },

      getHeapDisplayName: function (resourceName, features) {
        let sectorType = features.sectorType;
        let condition = features.getCondition();
        let isBadCondition = condition == SectorConstants.SECTOR_CONDITION_RUINED || condition == SectorConstants.SECTOR_CONDITION_DAMAGED;
        let isHumbleSectorType = sectorType == SectorConstants.SECTOR_TYPE_SLUM || sectorType == features.SECTOR_TYPE_MAINTENANCE || sectorType == SectorConstants.SECTOR_TYPE_INDUSTRIAL;
        let isLivable = !features.hasHazards() && !features.sunlit && features.buildingDensity > 1 && features.buildingDensity < 8;

        switch (resourceName) {
          case resourceNames.metal:
            if (features.buildingDensity > 3 && isBadCondition) return "坍塌的建筑";
            if (sectorType == SectorConstants.SECTOR_TYPE_MAINTENANCE) return "损毁的车辆";
            if (features.buildingDensity < 7 && isHumbleSectorType) return "垃圾场";
            if (isLivable && condition == SectorConstants.SECTOR_CONDITION_ABANDONED) return "废弃的营地";
            return "金属堆";
        }
        return "资源堆 (" + resourceName + ")";
      },

      getLogResourceText: function (resourcesVO) {
        var msg = "";
        var replacements = [];
        var values = [];
        for (let key in resourceNames) {
          let name = resourceNames[key];
          let amount = resourcesVO.getResource(name);
          if (amount > 0) {
            msg += "$" + replacements.length + ", ";
            replacements.push("#" + replacements.length + " " + name);
            values.push(Math.round(amount));
          }
        }
        msg = msg.slice(0, -2);
        return { msg: msg, replacements: replacements, values: values };
      },

      getLogItemsText: function (items) {
        var msg = "";
        var replacements = [];
        var values = [];
        var loggedItems = {};
        for (let i = 0; i < items.length; i++) {
          var item = items[i];
          if (typeof loggedItems[item.id] === 'undefined') {
            msg += "$" + replacements.length + ", ";
            replacements.push("#" + replacements.length + " " + item.name.toLowerCase());
            values.push(1);
            loggedItems[item.id] = replacements.length - 1;
          } else {
            values[loggedItems[item.id]]++;
          }
        }
        msg = msg.slice(0, -2);
        if (Object.keys(loggedItems).length > 1) {
          var lastCommaIndex = msg.lastIndexOf(",");
          msg = msg.substring(0, lastCommaIndex) + " 和" + msg.substring(lastCommaIndex + 1);
        }
        return { msg: msg, replacements: replacements, values: values };
      },

      createTextFromLogMessage: function (msg, replacements, values, includePeriod) {
        var text = msg;
        var value = 0;
        var useValues = values.length > 0;
        for (let i = 0; i < replacements.length; i++) {
          if (useValues) {
            value = values[i];
          }
          if (value > 0 || value.length > 0 || !useValues) {
            text = text.replace("$" + i, replacements[i]);
          } else {
            text = text.replace("$" + i, "");
          }

          if (useValues) {
            text = text.replace("#" + i, values[i]);
          }
        }

        text = text.trim();
        text = text.replace(/ ,/g, "");
        text = text.replace(/^,/g, "");
        text = text.replace(/,$/g, "");
        text = text.replace(/\, \./g, ".");
        if (includePeriod && text.substr(text.length - 1) !== "." && text.substr(text.length - 1) !== "!")
          text += ".";
        text = text.trim();
        return text;
      },

      getFightChancesText: function (probability) {
        if (probability >= 0.9) {
          return "相当无害";
        }
        if (probability > 0.8) {
          return "略微不安";
        }
        if (probability > 0.6) {
          return "令人生畏";
        }
        if (probability >= 0.5) {
          return "冒险";
        }
        if (probability >= 0.4) {
          return "危险";
        }
        if (probability >= 0.2) {
          return "非常危险";
        }
        return "致命";
      },

      getLocaleName: function (locale, sectorFeatures, isShort) {
        let condition = sectorFeatures.getCondition();
        let modifier = "";
        let noun = "";

        // default modifiers
        switch (condition) {
          case SectorConstants.SECTOR_CONDITION_RUINED:
            modifier = "废墟";
            break;
          case SectorConstants.SECTOR_CONDITION_DAMAGED:
            modifier = "受损";
            break;
          case SectorConstants.SECTOR_CONDITION_ABANDONED:
            modifier = "被遗弃";
            break;
          case SectorConstants.SECTOR_CONDITION_WORN:
            modifier = "破旧";
            break;
          case SectorConstants.SECTOR_CONDITION_RECENT:
            modifier = "空无一人";
            break;
          case SectorConstants.SECTOR_CONDITION_MAINTAINED:
            modifier = "维护良好";
            break;
        }

        // nouns and special modifiers
        switch (locale.type) {
          case localeTypes.factory:
            noun = sectorFeatures.surface ? "办公室" : "工厂";
            break;
          case localeTypes.house:
            if (condition === SectorConstants.SECTOR_CONDITION_DAMAGED) modifier = "被摧毁";
            if (condition === SectorConstants.SECTOR_CONDITION_WORN) modifier = "破旧";
            noun = "房子";
            break;
          case localeTypes.lab:
            noun = "实验室";
            break;
          case localeTypes.grove:
            modifier = "茂盛";
            noun = "小树林";
            break;
          case localeTypes.market:
            noun = sectorFeatures.level > 15 ? "购物中心" : "市场";
            break;
          case localeTypes.maintenance:
            switch (condition) {
              case SectorConstants.SECTOR_CONDITION_RUINED:
                noun = "控制单元";
                break;
              case SectorConstants.SECTOR_CONDITION_DAMAGED:
                noun = "控制单元";
                break;
              case SectorConstants.SECTOR_CONDITION_ABANDONED:
                modifier = "古老";
                noun = "网络交换机";
                break;
              case SectorConstants.SECTOR_CONDITION_WORN:
                modifier = "旧";
                noun = "水塔";
                break;
              case SectorConstants.SECTOR_CONDITION_RECENT:
                modifier = "废弃";
                noun = "控制单元";
                break;
              case SectorConstants.SECTOR_CONDITION_MAINTAINED:
                noun = "消防站";
                break;
              default:
            }
            break;
          case localeTypes.transport:
            noun = "站点";
            if (condition === SectorConstants.SECTOR_CONDITION_RUINED) noun = "火车站";
            if (condition === SectorConstants.SECTOR_CONDITION_WORN) modifier = "废弃的有轨电车";
            if (condition === SectorConstants.SECTOR_CONDITION_RECENT) modifier = "缆车";
            if (condition === SectorConstants.SECTOR_CONDITION_MAINTAINED) modifier = "火车";
            break;
          case localeTypes.sewer:
            if (condition === SectorConstants.SECTOR_CONDITION_RECENT) modifier = "安静";
            if (condition === SectorConstants.SECTOR_CONDITION_MAINTAINED) modifier = "安静";
            noun = "下水道";
            break;
          case localeTypes.warehouse:
            if (condition === SectorConstants.SECTOR_CONDITION_RECENT) modifier = "坚固";
            if (condition === SectorConstants.SECTOR_CONDITION_MAINTAINED) modifier = "坚固";
            noun = "仓库";
            break;
          case localeTypes.camp:
          case localeTypes.tradingpartner:
            modifier = "非本组织";
            noun = "营地";
            break;
          case localeTypes.hut:
          case localeTypes.hermit:
            if (condition === SectorConstants.SECTOR_CONDITION_RECENT) modifier = "新建";
            if (condition === SectorConstants.SECTOR_CONDITION_MAINTAINED) modifier = "维护良好";
            noun = "小屋";
            break;
          case localeTypes.library:
            modifier = "废弃";
            if (sectorFeatures.level < 10) modifier = "古老";
            noun = "图书馆";
            break;
          case localeTypes.farm:
            modifier = "杂草丛生";
            if (sectorFeatures.level < 10) modifier = "古老";
            noun = "农场";
          default:
            log.w("unknown locale type: " + locale.type);
            noun = "建筑";
            break;
        }

        return isShort ? noun : (modifier + " " + noun).trim();
        },

        getWorkshopName: function (resource) {
          switch (resource) {
            case resourceNames.fuel: return "炼油厂";
            case resourceNames.rubber: return "种植园";
            default: return "工坊";
          }
        },

        getSpringName: function (featuresComponent) {
          let hasHazards = featuresComponent.hazards.hasHazards();
          let type = featuresComponent.sectorType;
          if (featuresComponent.ground && featuresComponent.buildingDensity < 6
            && !hasHazards && type != SectorConstants.SECTOR_TYPE_INDUSTRIAL) {
            return "小溪";
          }
          if (type == SectorConstants.SECTOR_TYPE_SLUM && featuresComponent.damage < 3 && featuresComponent.buildingDensity < 8) {
            return "旧井";
          }
          if (type != SectorConstants.SECTOR_TYPE_SLUM && type != SectorConstants.SECTOR_TYPE_MAINTENANCE && featuresComponent.wear < 5 && featuresComponent.damage < 3) {
            return "饮水机";
          }
          if (featuresComponent.wear > 6 || featuresComponent.damage > 3) {
            return "漏水的水管";
          }
          return "水塔";
        },

        getEnemyText: function (enemyList, sectorControlComponent) {
          let result = "";
          var enemyActiveV = this.getEnemyActiveVerb(enemyList);
          var enemyNounSector = this.getEnemyNoun(enemyList, true, true);
          result += enemyActiveV + " " + enemyNounSector;
          return result;
        },

        getEnemyNoun: function (enemyList, detailed, pluralify) {
          var baseNoun = this.getCommonText(enemyList, "nouns", detailed ? "name" : "", "某人或某物", true, pluralify);
          if (detailed) {
            return baseNoun;
          } else {
            var parts = baseNoun.split(" ");
            return parts[parts.length - 1];
          }
        },

        getEnemyGroupNoun: function (enemyList) {
          return this.getCommonText(enemyList, "groupN", "", "群体", false)
        },

        getEnemyActiveVerb: function (enemyList) {
          return this.getCommonText(enemyList, "activeV", "", "被占领", false);
        },

        getEnemeyDefeatedVerb: function (enemyList) {
          return this.getCommonText(enemyList, "defeatedV", "", "被击败", false);
        },

        getScaResourcesString: function (discoveredResources, knownResources, resourcesScavengable) {
          var s = "";
          for (var key in resourceNames) {
            var name = resourceNames[key];
            var amount = resourcesScavengable.getResource(name);
            if (amount > 0 && discoveredResources.indexOf(name) >= 0) {
              var amountDesc = "稀有";
              if (amount == WorldConstants.resourcePrevalence.RARE) amountDesc = "罕见";
              if (amount == WorldConstants.resourcePrevalence.DEFAULT) amountDesc = "稀有";
              if (amount == WorldConstants.resourcePrevalence.COMMON) amountDesc = "常见";
              if (amount == WorldConstants.resourcePrevalence.ABUNDANT) amountDesc = "充裕";
              if (GameConstants.isDebugVersion) amountDesc += " " + Math.round(amount);
              s += key + " (" + amountDesc + "), ";
            } else if (amount > 0 && knownResources.indexOf(name) >= 0) {
              s += key + " (??), ";
            }
          }
          if (s.length > 0) return s.substring(0, s.length - 2);
          else if (resourcesScavengable.getTotal() > 0) return "未知";
          else return "无";
        },

        getScaItemString: function (discoveredItems, knownItems, itemsScavengeable) {
          let validItems = [];
          for (let i = 0; i < itemsScavengeable.length; i++) {
            let id = itemsScavengeable[i];
            if (knownItems.indexOf(id) < 0) continue;
            let item = ItemConstants.getItemDefinitionByID(id);
            if (!item) continue;
            validItems.push(item.name);
          }

          if (validItems.length == 0) {
            if (itemsScavengeable.length > 0) {
              return "某些原料";
            } else {
              return "无";
            }
          }

          return validItems.join(", ");
        },

        getMovementBlockerName: function (blockerVO, enemiesComponent, gangComponent) {
          switch (blockerVO.type) {
            case MovementConstants.BLOCKER_TYPE_GANG:
              let enemies = this.getAllEnemies(null, gangComponent);
              var groupNoun = this.getEnemyGroupNoun(enemies);
              var enemyNoun = this.getEnemyNoun(enemies);
              return groupNoun + "的" + Text.pluralify(enemyNoun);
            default:
              return blockerVO.name;
          }
          return "";
        },

        getMovementBlockerAction: function (blockerVO, enemiesComponent, gangComponent) {
          switch (blockerVO.type) {
            case MovementConstants.BLOCKER_TYPE_GAP: return "连接缺口";
            case MovementConstants.BLOCKER_TYPE_WASTE_TOXIC: return "清理废物";
            case MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE: return "清理废物";
            case MovementConstants.BLOCKER_TYPE_GANG:
              let enemies = this.getAllEnemies(null, gangComponent);
              return "战斗 " + this.getEnemyNoun(enemies, false, true);
          }
        },

        getAllEnemies: function (enemiesComponent, gangComponent) {
          let enemies = [];
          if (enemiesComponent && enemiesComponent.possibleEnemies) {
            enemies = enemiesComponent.possibleEnemies.concat();
          }
          if (gangComponent) {
            for (let i = 0; i < gangComponent.enemyIDs.length; i++) {
              var gangEnemy = EnemyConstants.getEnemy(gangComponent.enemyIDs[i]);
              enemies.push(gangEnemy);
            }
          }
          return enemies;
        },

        getUnblockedVerb: function (blockerType) {
          switch (blockerType) {
            case MovementConstants.BLOCKER_TYPE_GAP: return "已连接";
            case MovementConstants.BLOCKER_TYPE_WASTE_TOXIC: return "已清理";
            case MovementConstants.BLOCKER_TYPE_WASTE_RADIOACTIVE: return "已清理";
            case MovementConstants.BLOCKER_TYPE_GANG: return "已击败";
            case MovementConstants.BLOCKER_TYPE_DEBRIS: return "已清理";
          }
        },

      // get common description word for a list of objects that contain possible words are in arrays named objectAttribute
      // if nothing common is found, defaultWord is returned
      // is allowSeveral, two common words can be returned if one doesn't cover all objects
      getCommonText: function (objectList, objectAttribute, objectDetailAttribute, defaultWord, allowSeveral, pluralify) {
        var allWords = [];
        var allDetails = [];
        var minimumWords = [];
        for (var i1 in objectList) {
          var o = objectList[i1];
          if (!o) continue;
          for (var j1 in o[objectAttribute]) {
            var word = o[objectAttribute][j1];
            var detail = objectDetailAttribute ? o[objectDetailAttribute] : "";
            if (!word) continue;
            if ($.inArray(word, allWords) < 0) allWords.push(word);
            if (objectDetailAttribute && $.inArray(detail, allDetails) < 0) allDetails.push(detail);
            if (j1 == 0 && $.inArray(word, minimumWords) < 0) minimumWords.push(word);
          }
        }

        var validWords = [];
        for (var i2 in allWords) {
          var word = allWords[i2];
          var valid = true;
          for (var j2 in objectList) {
            var o = objectList[j2];
            if ($.inArray(word, o[objectAttribute]) < 0) valid = false;
          }
          if (valid) validWords.push(word);
        }

        var validDetail = "";
        if (objectDetailAttribute) {
          for (var i3 in allDetails) {
            var detail = allDetails[i3];
            var valid = true;
            for (var j3 in objectList) {
              var o = objectList[j3];
              if (o[objectDetailAttribute] != detail) valid = false;
            }
            if (valid) validDetail = detail;
          }
        }

        // log.i("getCommonText " + objectAttribute + " | " + validDetail + " | " + validWords.join(",") + " | " + minimumWords.join(",") + " | " + defaultWord);
        // log.i(objectList)

        if (validDetail.length > 0) {
          return pluralify ? Text.pluralify(validDetail) : validDetail;
        } else if (validWords.length > 0) {
          return pluralify ? Text.pluralify(validWords[0]) : validWords[0];
        } else if (allowSeveral && minimumWords.length > 1) {
          return pluralify ? (Text.pluralify(minimumWords[0]) + "和" + Text.pluralify(minimumWords[1])) : (minimumWords[0] + "和" + minimumWords[1]);
        } else {
          return defaultWord;
        }
      },

      getListText: function (list, max) {
        if (!list || list.length == 0) {
          return "none";
        } else if (list.length == 1) {
          return list[0];
        } else if (list.length == 2) {
          return list[0] + " and " + list[1];
        } else if (max && list.length > max) {
          let displayedList = list.slice(0, max);
          let numHiddenItems = list.length - displayedList.length;
          return displayedList.join(", ") + ", +" + numHiddenItems;
        } else {
          return list.join(", ");
        }
      },

    };

    function initSectorTexts() {
      let wildcard = DescriptionMapper.WILDCARD;

      let t_R = SectorConstants.SECTOR_TYPE_RESIDENTIAL;
      let t_I = SectorConstants.SECTOR_TYPE_INDUSTRIAL;
      let t_M = SectorConstants.SECTOR_TYPE_MAINTENANCE;
      let t_C = SectorConstants.SECTOR_TYPE_COMMERCIAL;
      let t_P = SectorConstants.SECTOR_TYPE_PUBLIC;
      let t_S = SectorConstants.SECTOR_TYPE_SLUM;

      let b0 = [0, 0];
      let bfull = [10, 10];
      let b12 = [0, 5];
      let b22 = [5, 10];
      let b13 = [0, 3];
      let b23 = [4, 6];
      let b33 = [7, 10];

      let lmodern = [15, 100];
      let lold = [10, 18];

      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[n-street]在一个[a-building]的[n-building]前");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-street]位于两个[a-building]的[n-buildings]之间");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-street位于两个[n-buildings]之间，两边各有一些[a-building]的[n-buildings]");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-street]与少数[a-building]的[n-buildings]一同出现");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-sector]散布着[an-items]和[an-items]");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-street]两旁是[a-building]的[n-buildings]");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-street]被[n-buildings]包围");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-street]被[a-building]的[n-buildings]包围");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[n-street]带有一些[an-decos]和[a-building]的[n-buildings]");
      DescriptionMapper.add("sector-vision", { sectorType: wildcard }, "一个[a-street]的[n-street]位于一些[n-buildings]之间");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: false }, "一个[n-street]位于一个巨大支柱的底部，该支柱支撑着上面的层级");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: false, wear: b12, sunlit: false, debris: b0 }, "一个[a-street]的[n-street]长期无人居住的建筑覆盖着奇异的苔藓");
      DescriptionMapper.add("sector-vision", { buildingDensity: b0, isGroundLevel: false }, "连接几栋建筑的桥梁和通道系统围绕着令人眩晕的开口至下层-");
      DescriptionMapper.add("sector-vision", { buildingDensity: b12, isGroundLevel: false, campable: false }, "一个[a-street]桥梁跨越下方层级，为有轨电车轨道、公用设施和行人设置了不同的层级");
      DescriptionMapper.add("sector-vision", { buildingDensity: b22 }, "[a-sectortype]综合体，有几条狭窄的通道");
      DescriptionMapper.add("sector-vision", { buildingDensity: b13 }, "一个宽阔的广场，一侧是一个[a-building]的[n-building]，另一侧似乎是一个[a-building]的[n-building]的遗迹");
      DescriptionMapper.add("sector-vision", { buildingDensity: b23, isSurfaceLevel: false, sunlit: false }, "一个[a-street]的[n-street]在一座巨大的[n-building]下方");
      DescriptionMapper.add("sector-vision", { buildingDensity: b23, isSurfaceLevel: false }, "一个[n-street]的多层通道沿着周围[a-sectortype]建筑的墙壁爬行");
      DescriptionMapper.add("sector-vision", { buildingDensity: b33 }, "一个[a-sectortype]走廊位于两座巨大[n-buildings]之间，几乎没有足够的空间行走");
      DescriptionMapper.add("sector-vision", { buildingDensity: b33 }, "一个[a-street]的[n-street]挤满了[a-building]的[n-buildings]和[an-decos]，几乎没有足够的空间通过");
      DescriptionMapper.add("sector-vision", { buildingDensity: b33 }, "一个[a-street]巷子位于两个[a-building]的[n-buildings]之间");
      DescriptionMapper.add("sector-vision", { wear: b13, sunlit: false, level: lmodern, debris: b0 }, "一个[a-street]的[n-street]两旁是高大的[n-buildings]，排列着枯萎的树木，这些树木直到不久前还必须在人造光中茁壮成长");
      DescriptionMapper.add("sector-vision", { wear: b13, level: lmodern, isSurfaceLevel: false }, "一条[n-street]位于一些还在建设中就被遗弃的骨架建筑之间");
      DescriptionMapper.add("sector-vision", { wear: b23, damage: b0 }, "一个曾经的[n-sector]，带着其过去的[a-street-past]氛围");
      DescriptionMapper.add("sector-vision", { wear: b23, damage: b0 }, "曾经是[a-street-past]的[n-sector]，中间有一些[an-decos]和一个[a-building]的[n-building]");
      DescriptionMapper.add("sector-vision", { wear: b33 }, "一个[a-building]建筑，很难确定其原始用途，被剥离至裸露的混凝土");
      DescriptionMapper.add("sector-vision", { buildingDensity: b22, wear: b33 }, "一个[a-street]走廊，散布着长时间居民留下的垃圾");
      DescriptionMapper.add("sector-vision", { wear: b33, isSurfaceLevel: false }, "一个[a-street]的[a-sectortype]的[n-street]，几座巨大的无法识别的废墟在其上方隐约可见");
      DescriptionMapper.add("sector-vision", { wear: b33 }, "一个完全被毁的[a-sectortype]的[n-street]");
      DescriptionMapper.add("sector-vision", { wear: b33 }, "一个被瓦砾覆盖的[n-street]，周围是[a-sectortype]建筑的摇摇欲坠的残骸");
      DescriptionMapper.add("sector-vision", { damage: b22 }, "一个曾经的[a-sectortype]区域，[n-buildings]和[n-buildings]都已成为废墟");
      DescriptionMapper.add("sector-vision", { damage: b33 }, "一个完全被摧毁的[a-sectortype]的[n-street]");
      DescriptionMapper.add("sector-vision", { damage: b22, buildingDensity: b12 }, "一条[a-street]的[n-street]，两旁是被摧毁的建筑的外壳");
      DescriptionMapper.add("sector-vision", { damage: b22, buildingDensity: b22 }, "一条[n-street]，满是瓦砾，难以通过");
      DescriptionMapper.add("sector-vision", { sectorType: t_R }, "一条小[n-street]，位于一些[a-building]公寓塔楼之间");
      DescriptionMapper.add("sector-vision", { sectorType: t_R, buildingDensity: b23, isSurfaceLevel: false }, "一条[a-street]的[n-street]沿着一堵巨大的墙延伸至上方层级的天花板，点缀着[a-building]公寓");
      DescriptionMapper.add("sector-vision", { sectorType: t_R, buildingDensity: b12, level:[6, 100] }, "一条[n-street]，两旁是几座相同的狭窄住宅塔楼");
      DescriptionMapper.add("sector-vision", { sectorType: t_R, buildingDensity: b23 }, "一条[n-street]在一个带有令人眼花缭乱的几何图案阳台的[a-building]居民楼外");
      DescriptionMapper.add("sector-vision", { sectorType: t_R, level: lmodern }, "一个广场，周围曾经是相当舒适的公寓塔楼");
      DescriptionMapper.add("sector-vision", { sectorType: t_I }, "一条街道在一个巨大的[a-building]工业综合体外");
      DescriptionMapper.add("sector-vision", { sectorType: t_I, buildingDensity: b13 }, "一个空荡的广场，有一些损坏的集装箱和巨大的生锈机械臂");
      DescriptionMapper.add("sector-vision", { sectorType: t_I, buildingDensity: b23 }, "一个[n-street]位于[a-building]控制室和办公室的两栋建筑之间");
      DescriptionMapper.add("sector-vision", { sectorType: t_M }, "一个[a-street]的[n-street]在一个[n-building]后面，低矮的天花板交错着旧电线和管道");
      DescriptionMapper.add("sector-vision", { sectorType: t_M }, "一个荒凉的[n-street]，交错着破碎的电缆系统和维护管道的残骸");
      DescriptionMapper.add("sector-vision", { sectorType: t_M, isSurfaceLevel: false }, "一个在巨大桥梁下的洪水通道，远处可见[a-building]建筑隐约可见");
      DescriptionMapper.add("sector-vision", { sectorType: t_M }, "一个在机器运行的城市设施之间被遗忘的空间，只有管道和管线打破了光滑的表面");
      DescriptionMapper.add("sector-vision", { sectorType: t_M, level: lold, buildingDensity: b13 }, "一个宽阔的广场，中间有一个控制室，旧电缆系统的线路向四面八方延伸");
      DescriptionMapper.add("sector-vision", { sectorType: t_C }, "一个[a-street]购物街，遗留着各种商店和咖啡馆的残骸");
      DescriptionMapper.add("sector-vision", { sectorType: t_C }, "一条[n-street]，位于一些建筑之间，它们的[a-building]墙面覆盖着死屏的拼接");
      DescriptionMapper.add("sector-vision", { sectorType: t_C, wear: b12 }, "一条[a-street]的[n-street]挤满了小商店、广告牌和多层次的小亭子");
      DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b12, isSurfaceLevel: false }, "一条[n-street]，建筑像巨大的钟乳石一样附着在上方层级的天花板上");
      DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b12, isSurfaceLevel: false }, "一个围绕着一座巨大雕像建造的广场，每一面都被[a-building]商店前面包围");
      DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b13 }, "一个位于高架建筑下的广场，中间曾经有一个瀑布");
      DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b13 }, "一个宽阔的围栏露台附着在一座巨大的塔楼上，俯瞰下方的[a-street]街道");
      DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b13 }, "一个由[a-building]办公楼包围的圆形庭院");
      DescriptionMapper.add("sector-vision", { sectorType: t_C, buildingDensity: b22, wear: b33 }, "一个[a-building]建筑，很难确定其原始用途，被剥离至混凝土，中间有一个令人印象深刻的螺旋楼梯");
      DescriptionMapper.add("sector-vision", { sectorType: t_P }, "一个[n-street]，看起来曾经是某种公共设施的巨大建筑在一旁");
      DescriptionMapper.add("sector-vision", { sectorType: t_P }, "一段被一些较小建筑包围的废弃高速公路");
      DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b12 }, "一个[a-street]的[n-street]列着着一排庄严的雕像");
      DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b12, wear: b22 }, "一个装饰性的大厅，似乎曾经是一个大型车站，有一个穹顶屋顶、巨大的吊灯和两侧的小亭子");
      DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b13 }, "一个开放的空间，看起来可能曾经专门用于某种运动");
      DescriptionMapper.add("sector-vision", { sectorType: t_P, buildingDensity: b33 }, "一个[a-street]的[n-street]位于两座巨大[n-buildings]之间，几乎没有足够的空间通过");
      DescriptionMapper.add("sector-vision", { sectorType: t_S, buildingDensity: b33, wear: b22 }, "一个[a-street]的[n-street]被[a-building]住宅包围（部分覆盖），这些建筑已经被遗弃了一段时间");
      DescriptionMapper.add("sector-vision", { sectorType: t_S, buildingDensity: b13 }, "一个宽阔的广场，其墙壁支撑着一些临时搭建的棚屋");
      DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b13 }, "一个巨大的大厅，看起来曾经被用作某种存储区域，天花板上有生锈的自动手臂");
      DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b23 }, "一个[a-street]通道位于两个失效的、被墙壁封闭的核反应堆之间");
      DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b23 }, "一个[a-street]的[n-street]在一个巨大的工业加工综合体外，所有入口都紧紧关闭");
      DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b33 }, "一个[a-street]通道似乎曾经用于在这一层的各种设施之间运输货物");
      DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b33 }, "一个[a-sectortype]走廊，曾经看起来很干净，但现在满是碎片");
      DescriptionMapper.add("sector-vision", { level: 14, buildingDensity: b33 }, "一条设有窗户的走廊，位于一个核设施的废墟上方");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13 }, "城市下方一个开阔的空间，泥土、草和其他植物通过混凝土地面的裂缝挤出来");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13 }, "一个古老的广场，早已被遗忘，两侧有巨大的柱子支撑着上方的城市");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13 }, "一个开放的空间，可能曾经是一个公园，现在被奇怪的植物和蘑菇占据");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b13, sectorType: t_R }, "一条辉煌的[a-street]，两旁是现代化的住宅楼】，现在都已荒废");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b23 }, "一个[a-street]街道，两旁是摇摇欲坠的古老[a-sectortype]建筑");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b23 }, "一个没有天花板的开放街道，城市的下一层楼高悬在上方，两边是废墟");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b33 }, "穿过一座古老建筑的通道");
      DescriptionMapper.add("sector-vision", { isGroundLevel: true, buildingDensity: b33 }, "一条狭窄的街道，路面有裂缝");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b13 }, "一个曾经[a-street-past]的广场，周围环绕着玻璃穹顶的通道和小商店");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b13 }, "一个宽阔的[n-street]，风吹动着散落的碎片");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b13, sectorType: t_P }, "一个华丽的公共建筑的中心的大广场");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b23 }, "一个[a-street]街道，点缀着广告牌和死屏，周围是高楼");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b23 }, "一个暴露的街道，两侧是高楼，被强风吹拂");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b23 }, "一个多层的街道，下面有电车空间，再下面是行人和小商店的空间");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b33 }, "一个[a-street]的[n-street]在高大、华丽的[n-buildings]之间");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b33 }, "一个[a-street]通道在曾经的两个购物中心之间");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, buildingDensity: b33 }, "一个[a-street]的[n-street]，风不断地在狭窄的通道中呼啸");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, sectorType: t_C }, "一个[a-street]的[n-street]在曾经的两个购物中心之间");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, sectorType: t_C }, "一个令人印象深刻的购物中心，似乎曾满是出售奢侈品的商店");
      DescriptionMapper.add("sector-vision", { isSurfaceLevel: true, sectorType: t_I }, "一个[a-street]与宏伟的办公楼");
      DescriptionMapper.add("sector-vision", { debris: b22 }, "[n-street]满是碎片");
      DescriptionMapper.add("sector-vision", { debris: b22, sectorType: t_R }, "一个[n-street]两侧是几栋完全被摧毁的住宅楼");

      DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b0 }, "城市内罕见的空地；没有地板或墙壁，没有建筑，什么也没有。只有广阔的空虚黑暗");
      DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b13 }, "一条宽阔的街道或走廊。在浩瀚的黑暗中很难找到任何东西");
      DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b23, wear: b22 }, "一条走廊或带有被遗弃气息的街道。黑暗中看不清细节");
      DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b23, wear: b12 }, "一条安静的街道或走廊。黑暗中看不清细节");
      DescriptionMapper.add("sector-novision", { sunlit: false, buildingDensity: b33 }, "一个密集的通道，几乎没有足够的空间行走。你在黑暗中摸索前行");
      DescriptionMapper.add("sector-novision", { sunlit: false }, "城市内隐藏在黑暗中的空间");
      DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b0 }, "城市内罕见的空地；没有地板或墙壁，没有建筑，什么也没有。只有广阔的空虚");
      DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b13 }, "一条宽阔的街道或走廊。在刺眼的阳光下很难找到任何东西");
      DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b23, wear: b22 }, "一条走廊或带有被遗弃气息的街道。刺眼的光线中看不清细节");
      DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b23, wear: b12 }, "一条安静的街道或走廊。刺眼的光线中看不清细节");
      DescriptionMapper.add("sector-novision", { sunlit: true, buildingDensity: b33 }, "一个密集的通道，几乎没有足够的空间行走。你在耀眼的光线中摸索前行");
      DescriptionMapper.add("sector-novision", { sunlit: true }, "城市内在耀眼的光线中模糊不清的空间");
    }

    function initWaymarkTexts() {
      var wildcard = DescriptionMapper.WILDCARD;

      var t_R = SectorConstants.SECTOR_TYPE_RESIDENTIAL;
      var t_I = SectorConstants.SECTOR_TYPE_INDUSTRIAL;
      var t_M = SectorConstants.SECTOR_TYPE_MAINTENANCE;
      var t_C = SectorConstants.SECTOR_TYPE_COMMERCIAL;
      var t_P = SectorConstants.SECTOR_TYPE_PUBLIC;
      var t_S = SectorConstants.SECTOR_TYPE_SLUM;

      var wt_C = SectorConstants.WAYMARK_TYPE_CAMP;
      var wt_W = SectorConstants.WAYMARK_TYPE_SPRING;
      var wt_P = SectorConstants.WAYMARK_TYPE_POLLUTION;
      var wt_R = SectorConstants.WAYMARK_TYPE_RADIATION;
      var wt_S = SectorConstants.WAYMARK_TYPE_SETTLEMENT;

      // brackets for values like building density, wear, damage
      var b0 = [0, 0];
      var b12 = [0, 5];
      var b22 = [5, 10];

      var lt1 = [0, 0.999];
      var gte1 = [1, 100];

      DescriptionMapper.add("waymark", { sectorType: wildcard }, "一堵走廊旁的墙上画着一个指向[direction]的大的[n-target]符号");
      DescriptionMapper.add("waymark", { sectorType: wildcard }, "有一个涂鸦写着[n-target]和一个指向[direction]的箭头");
      DescriptionMapper.add("waymark", { buildingDensity: b12 }, "一些砖块被排列成一个指向[direction]的箭头和一个可能意味着[n-target]的粗糙符号");
      DescriptionMapper.add("waymark", { waymarkType: wt_C }, "你发现了几个带有指向[direction]的箭头和‘安全’、‘避难所’等字样的涂鸦");
      DescriptionMapper.add("waymark", { waymarkType: wt_R }, "朝向[direction]的路上墙上有多个骷髅标志");
      DescriptionMapper.add("waymark", { waymarkType: wt_P }, "朝向[direction]的路上墙上有多个骷髅标志");
      DescriptionMapper.add("waymark", { waymarkType: wt_S }, "在通往[direction]的通道旁的墙上有一块金属牌，上面写着‘[n-settlement-name]’");
      DescriptionMapper.add("waymark", { waymarkType: wt_W }, "街道上有一个指向[direction]的蓝色箭头");
      DescriptionMapper.add("waymark", { sectorType: t_C }, "一块商店广告牌被画上了一个指向[direction]的箭头和[n-target]字样");
      DescriptionMapper.add("waymark", { sectorType: t_I }, "一个带有方向的街道标志被涂改。朝向[direction]的地方写着[n-target]");
      DescriptionMapper.add("waymark", { sectorType: t_M }, "天花板附近的管道上画有箭头。指向[direction]的旁边是[n-target]的符号");
      DescriptionMapper.add("waymark", { sectorType: t_P }, "一个雕像手持一个粗糙的标志，上面说有[n-target]在[direction]");
      DescriptionMapper.add("waymark", { sectorType: t_S }, "有几张破旧的海报显示有[n-target]在[direction]");
    }

    function initBookTexts() {
      var wildcard = DescriptionMapper.WILDCARD;

      let t_S = ItemConstants.bookTypes.science;
      let t_F = ItemConstants.bookTypes.fiction;
      let t_H = ItemConstants.bookTypes.history;
      let t_E = ItemConstants.bookTypes.engineering;

      let l_1 = 1;
      let l_2 = 2;
      let l_3 = 3;

      DescriptionMapper.add("book-intro", { bookType: wildcard }, "你读这本书。");
      DescriptionMapper.add("book-intro", { bookLevel: l_1 }, "你浏览这本书。");
      DescriptionMapper.add("book-intro", { bookLevel: l_2 }, "你研究这本书。");
      DescriptionMapper.add("book-intro", { bookLevel: l_3 }, "你花了一些时间研究这本书。");
      DescriptionMapper.add("book-intro", { bookType: t_S }, "你研究这本书。");
      DescriptionMapper.add("book-intro", { bookType: t_F }, "你检查这本书。");
      DescriptionMapper.add("book-intro", { bookType: t_H }, "你研究这本书。");
      DescriptionMapper.add("book-intro", { bookType: t_H }, "你快速浏览这本书。");
      DescriptionMapper.add("book-intro", { bookType: t_E }, "你研究这本书。");

      DescriptionMapper.add("book-description", { bookType: wildcard }, "一个描述[n-topic]的段落吸引了你的注意。");
      DescriptionMapper.add("book-description", { bookType: wildcard }, "一个描述[n-topic]的部分似乎很有趣。");
      DescriptionMapper.add("book-description", { bookType: wildcard }, "你学到了一些关于[n-topic]的知识。");
      DescriptionMapper.add("book-description", { bookType: wildcard }, "它相当[a-bad]，但你还是学到了一些东西。");

      DescriptionMapper.add("book-description", { bookLevel: l_1 }, "它给了你一些关于[n-topic]的见解。");
      DescriptionMapper.add("book-description", { bookLevel: l_2 }, "它看起来是关于[n-topic]的好资源。");
      DescriptionMapper.add("book-description", { bookLevel: l_3 }, "它不容易理解，但教会了你很多关于[n-topic]的知识。");

      DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于[n-topic]的一个[a-level]教科书。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于[n-topic]的一个[a-style]教科书。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于[n-topic]的一个[a-good]教科书。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "这是一本关于[n-topic]的一个[a-bad]教科书，但你还是学到了新东西。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "它描述了[n-topic]。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "有几个关于[n-topic]的有趣段落。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "这是一篇关于[n-topic]的相当枯燥的文本。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "它包含了对[n-topic]的描述。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "你了解到[c-fact]。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "你发现[c-fact]。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "这是一本关于[n-topic]的入门文本。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "这是一本关于[n-topic]的一个[a-bad]书。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "它包含了一些关于[n-topic]的基本信息。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "一篇关于精炼过程的描述提供了有关坠落前常用建筑材料的线索。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_1 }, "它包含了一个已知的‘暗层’动物生活的目录。你认出了几个。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "你注意到了关于每天暴露于阳光下的人与否的旧普查数据。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "它包含了一个你不熟悉的基于太阳的日历系统的详细描述。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "你找到了关于[n-topic]的细节。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_2 }, "它包含了关于[n-topic]的详细信息。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "你被地面上丰富植物生活的描述所吸引。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "它包含了关于[n-topic]的大量信息。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "它包含了关于[n-topic]的论文。");
      DescriptionMapper.add("book-description", { bookType: t_S, bookLevel: l_3 }, "它包含了关于[n-topic]的深入信息。");

      DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于[n-topic]的一个[a-level]教科书。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于[n-topic]的一个[a-style]教科书。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于[n-topic]的一个[a-good]教科书。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "这是一本关于[n-topic]的一个[a-bad]教科书，但你还是学到了新东西。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "有关于[n-object]的废弃计划。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "它包含了对[n-object]的详细描述。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "有一个图表详细解释了[n-object]是如何工作的。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "这是[n-object]的操作手册。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "你学到了很多关于[n-object]的知识。");
      DescriptionMapper.add("book-description", { bookType: t_E }, "你了解到[c-fact]。");
      DescriptionMapper.add("book-description", { bookType: t_S }, "你发现[c-fact]。");
      DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_1 }, "有一个关于[n-object]的有趣图表。");
      DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_1 }, "它包含了一些关于[n-topic]的基本信息。");
      DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_2 }, "它包含了许多关于[n-topic]有用的信息。");
      DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_2 }, "它包含了关于[n-topic]的详细信息。");
      DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_3 }, "有关于[n-object]的技术图纸");
      DescriptionMapper.add("book-description", { bookType: t_E, bookLevel: l_3 }, "它包含了关于[n-topic]的深入信息。");

      DescriptionMapper.add("book-description", { bookType: t_H }, "你找到了关于[n-topic]的细节。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "它描述了[n-topic]。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "它描述了[c-event]。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "这是一篇关于[n-topic]的相当枯燥的文本。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "这是一本关于[n-topic]的一个[a-style]概述。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "这是一个非常[a-level]的关于[n-topic]的介绍。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "你了解到[c-fact]。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "看来[c-fact]。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "你了解到[c-event]。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "有关[c-event]的一个[a-style]章节引起了你的注意。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "有几处提到[c-event]。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "这是一个非常[a-good]的关于[n-topic]的解释。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "虽然其他地方很枯燥，但有一个关于[n-topic]的一个[a-good]章节。");
      DescriptionMapper.add("book-description", { bookType: t_H }, "提到“当前无人居住的层次”的参考为坠落前的城市提供了一个视角。");
      DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "这是一本关于[n-topic]的入门文本。");
      DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_1 }, "它提到[c-event]。");
      DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_2 }, "有一个关于[c-event]的长节。");
      DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_2 }, "这是一次关于[n-topic]的详细探索。");
      DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_3 }, "你找到了大量关于[c-event]的信息。");
      DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_3 }, "你找到了大量关于[n-topic]的信息。");
      DescriptionMapper.add("book-description", { bookType: t_H, bookLevel: l_3 }, "你找到了关于[c-event]的详细时间线。");

      DescriptionMapper.add("book-description", { bookType: t_F }, "有一个关于[c-theme]的一个[a-good]故事。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于[c-theme]的故事。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "它是关于[c-theme]的。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "一个关于[c-theme]的故事让你印象深刻。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "你被一个关于[c-theme]的诗所感动。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "它包含了关于[c-theme]的一个[a-good]描述。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "这是一部处理[n-topic]的一个[a-style]小说。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于[n-topic]的一个[a-style]故事。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于[n-topic]的非常[a-style]的描绘。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于[n-topic]的一个[a-style]故事。");
      DescriptionMapper.add("book-description", { bookType: t_F }, "这是一个关于[n-topic]的[a-style]短篇故事集。");
      DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_1 }, "这是一本以[n-topic]为特色的儿童书。");
      DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_1 }, "这是一个关于[c-theme]的简单故事。");
      DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_2 }, "这是一部关于[n-topic]的经典小说。");
      DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_2 }, "这是一本关于[c-theme]的[a-style]小说。");
      DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_3 }, "这是一本关于[n-topic]的相当沉重的书。");
      DescriptionMapper.add("book-description", { bookType: t_F, bookLevel: l_3 }, "这是一个关于[n-theme]的[a-good]故事。");
    }

    function initNewspaperTexts() {
      var wildcard = DescriptionMapper.WILDCARD;

      let l_1 = 1;
      let l_2 = 2;
      let l_3 = 3;

      DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "有一篇关于[n-topic]的社论。");
      DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "有一篇关于[n-topic]的评论文章。");
      DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "有一个关于[c-event]的大新闻。");
      DescriptionMapper.add("newspaper-description", { itemLevel: wildcard }, "该问题围绕[c-event]展开。");
      DescriptionMapper.add("newspaper-description", { itemLevel: l_3 }, "有一篇关于[n-topic]的调查性报道。");
    }

    function initResearchPaperTexts() {
      var wildcard = DescriptionMapper.WILDCARD;

      let l_1 = 1;
      let l_2 = 2;
      let l_3 = 3;

      DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "它讲述了[n-topic]。");
      DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "你了解到[c-fact]。");
      DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "你推断出[c-fact]。");
      DescriptionMapper.add("researchpaper-description", { itemLevel: wildcard }, "看来[c-fact]。");
      DescriptionMapper.add("researchpaper-description", { itemLevel: l_1 }, "这是关于[n-topic]的基础概述。");
      DescriptionMapper.add("researchpaper-description", { itemLevel: l_2 }, "这是关于[n-topic]的大纲。");
      DescriptionMapper.add("researchpaper-description", { itemLevel: l_3 }, "这是关于[n-topic]的详细分析。");
    }

    initSectorTexts();
    initWaymarkTexts();
    initBookTexts();
    initNewspaperTexts();
    initResearchPaperTexts();

    return TextConstants;

  });
