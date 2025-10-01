define(function () {
	
	var CultureConstants = {
		
		cultures: {
			ASSURIAN: "assurian",
			DOMA: "doma",
			ETRURIAN: "etrurian",
			HANSA: "hansa",
			INDUS: "indus",
			KIEVAN: "kievan",
			SAHEL: "sahel",
			YUAN: "yuan",
		},
		
		origins: {
			UNKNOWN: "unknown",
			SURFACE: "surface",
			SLUMS: "slums",
			DARKLEVELS: "darklevels"
		},
		
		genders: {
			MALE: "male",
			FEMALE: "female",
			OTHER: "other",
		},

		skinColors: {
			LIGHT: "light",
			MID: "mid",
			DARK: "dark",
		},
		
		names: {
			personalNames: [],
			nickNames: [],
		},
		
		initNames: function () {
			// common names
			this.names.personalNames.push({name: "阿迪娅" });
			this.names.personalNames.push({name: "伊德里斯" });
			this.names.personalNames.push({name: "诺亚" });
			
			this.names.personalNames.push({name: "阿曼达", gender: this.genders.FEMALE });
			this.names.personalNames.push({name: "哈娜", gender: this.genders.FEMALE });
			this.names.personalNames.push({name: "朱莉娅", gender: this.genders.FEMALE });
			this.names.personalNames.push({name: "莉娜", gender: this.genders.FEMALE });
			this.names.personalNames.push({name: "奥尔加", gender: this.genders.FEMALE });
			this.names.personalNames.push({name: "乌拉", gender: this.genders.FEMALE });
			this.names.personalNames.push({name: "旺达", gender: this.genders.FEMALE });
			
			this.names.personalNames.push({name: "亚历", gender: this.genders.MALE });
			this.names.personalNames.push({name: "雨果", gender: this.genders.MALE });
			this.names.personalNames.push({name: "雅各布", gender: this.genders.MALE });
			this.names.personalNames.push({name: "雅库布", gender: this.genders.MALE });
			this.names.personalNames.push({name: "扬", gender: this.genders.MALE });
			this.names.personalNames.push({name: "利奥", gender: this.genders.MALE });
			this.names.personalNames.push({name: "马克斯", gender: this.genders.MALE });
			this.names.personalNames.push({name: "纳克斯", gender: this.genders.MALE });

			// names by origin
			this.names.personalNames.push({name: "吉芙特", origin: this.origins.SURFACE });
			this.names.personalNames.push({name: "帕尔·诺亚", origin: this.origins.SURFACE });
			this.names.personalNames.push({name: "辛·诺亚", origin: this.origins.SURFACE });
			this.names.personalNames.push({name: "扬·巴尼", origin: this.origins.SURFACE });
			this.names.personalNames.push({name: "扬·纳瑟", origin: this.origins.SURFACE });
			this.names.personalNames.push({name: "娜特", origin: this.origins.SURFACE });

			this.names.personalNames.push({name: "露西", origin: this.origins.SURFACE, gender: this.genders.FEMALE });
			this.names.personalNames.push({name: "莉兹", origin: this.origins.SURFACE, gender: this.genders.FEMALE });

			this.names.personalNames.push({name: "纳克斯·阿米尔", origin: this.origins.SURFACE, gender: this.genders.MALE });
			this.names.personalNames.push({name: "莫里斯", origin: this.origins.SURFACE, gender: this.genders.MALE });
			this.names.personalNames.push({name: "普林斯", origin: this.origins.SURFACE, gender: this.genders.MALE });

			this.names.personalNames.push({name: "乔里克", origin: this.origins.SLUMS, gender: this.genders.MALE });
			this.names.personalNames.push({name: "杰瑞德", origin: this.origins.SLUMS, gender: this.genders.MALE });
			this.names.personalNames.push({name: "亚罗", origin: this.origins.SLUMS, gender: this.genders.MALE });
			this.names.personalNames.push({name: "卡特琳", origin: this.origins.SLUMS, gender: this.genders.FEMALE });

			this.names.personalNames.push({name: "艾比", origin: this.origins.DARKLEVELS });
			this.names.personalNames.push({name: "赛伦斯", origin: this.origins.DARKLEVELS });

			// ethnic names
			this.names.personalNames.push({name: "法里德", culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "费兹", culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "霍达", culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "迈赫迪", culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "尼拉里", culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "山姆", culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "帕亚姆", culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "菲奥雷", culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "朱西", culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "卢埃", culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "海克", culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "卢卡", culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "拉伊", culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "内哈尔", culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "伊斯马特", culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "托梅尔", culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "帕尔文", culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "纳西姆", culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "努尔", culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "罗宾", culture: this.cultures.KIEVAN });
			this.names.personalNames.push({name: "瓦尼亚", culture: this.cultures.KIEVAN });
			this.names.personalNames.push({name: "达约", culture: this.cultures.SAHEL });
			this.names.personalNames.push({name: "格巴德拉", culture: this.cultures.SAHEL });
			this.names.personalNames.push({name: "米希尔", culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "纳兰", culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "托格图恩", culture: this.cultures.YUAN });

			this.names.personalNames.push({name: "伊兹拉", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "拉蕾", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "莱妮", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "玛莎", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "米姆拉", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "维罗妮卡", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "米努", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "安娜希塔", gender: this.genders.FEMALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "安伯莉", gender: this.genders.FEMALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "迪安娜", gender: this.genders.FEMALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "杰萨米", gender: this.genders.FEMALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "莉迪", gender: this.genders.FEMALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "拉妮娅", gender: this.genders.FEMALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "安娜", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "奥蕾莉娅", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "索菲亚", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "朱莉亚", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "萨宾娜", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "吉娅", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "埃尔达", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN, origin: this.origins.DARKLEVELS });
			this.names.personalNames.push({name: "奥蕾莉娅", gender: this.genders.FEMALE, culture: this.cultures.ETRURIAN, origin: this.origins.DARKLEVELS });
			this.names.personalNames.push({name: "安妮克", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "艾尔克", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "艾娜", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "伊尔莎", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "伊尔玛", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "安雅", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "露丝", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "约翰娜", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "阿斯特丽德", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "埃芭", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "玛乔琳", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "罗莎琳娜", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "塔贝娅", gender: this.genders.FEMALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "莎乐美", gender: this.genders.FEMALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "扎赫拉", gender: this.genders.FEMALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "米里亚姆", gender: this.genders.FEMALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "塔拉", gender: this.genders.FEMALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "米拉", gender: this.genders.FEMALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "索菲亚", gender: this.genders.FEMALE, culture: this.cultures.KIEVAN })
			this.names.personalNames.push({name: "玛格达", gender: this.genders.FEMALE, culture: this.cultures.KIEVAN })
			this.names.personalNames.push({name: "娜迪亚", gender: this.genders.FEMALE, culture: this.cultures.KIEVAN })
			this.names.personalNames.push({name: "叶芙拉", gender: this.genders.FEMALE, culture: this.cultures.KIEVAN })
			this.names.personalNames.push({name: "娜塔莉亚", gender: this.genders.FEMALE, culture: this.cultures.KIEVAN })
			this.names.personalNames.push({name: "玛雅·阿梅利亚", gender: this.genders.FEMALE, culture: this.cultures.KIEVAN, origin: this.origins.SURFACE })
			this.names.personalNames.push({name: "阿达娜娅", gender: this.genders.FEMALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "阿乔科", gender: this.genders.FEMALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "伊布库恩", gender: this.genders.FEMALE, culture: this.cultures.SAHEL, origin: this.origins.SURFACE })
			this.names.personalNames.push({name: "朱迈伊", gender: this.genders.FEMALE, culture: this.cultures.SAHEL, origin: this.origins.SURFACE })
			this.names.personalNames.push({name: "玛伦", gender: this.genders.FEMALE, culture: this.cultures.SAHEL, origin: this.origins.SURFACE })
			this.names.personalNames.push({name: "莫尼法", gender: this.genders.FEMALE, culture: this.cultures.SAHEL, origin: this.origins.SURFACE })
			this.names.personalNames.push({name: "奥里萨", gender: this.genders.FEMALE, culture: this.cultures.SAHEL, origin: this.origins.SURFACE })
			this.names.personalNames.push({name: "卡柳恩", gender: this.genders.FEMALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "雅尔吉", gender: this.genders.FEMALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "穆尔", gender: this.genders.FEMALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "库兰", gender: this.genders.FEMALE, culture: this.cultures.YUAN });

			this.names.personalNames.push({name: "阿米尔", gender: this.genders.MALE, culture: this.cultures.ASSURIAN, origin: this.origins.SURFACE });
			this.names.personalNames.push({name: "贾瓦德", gender: this.genders.MALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "纳尔赛", gender: this.genders.MALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "萨尔贡", gender: this.genders.MALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "沙鲁", gender: this.genders.MALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "卡维", gender: this.genders.MALE, culture: this.cultures.ASSURIAN });
			this.names.personalNames.push({name: "巴尤斯", gender: this.genders.MALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "卡姆洛", gender: this.genders.MALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "布伊", gender: this.genders.MALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "梅里克", gender: this.genders.MALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "莫伊卢斯", gender: this.genders.MALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "泰米", gender: this.genders.MALE, culture: this.cultures.DOMA });
			this.names.personalNames.push({name: "阿莱西奥", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "奥雷利奥", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "马泰奥", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "洛伦佐", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "安东尼奥", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "埃利奥", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "恩尼奥", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "翁贝托", gender: this.genders.MALE, culture: this.cultures.ETRURIAN });
			this.names.personalNames.push({name: "米克", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "乌特雷德", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "弗洛里安", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "奥托", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "埃诺", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "鲁纳尔", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "奥莱", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "约里", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "埃利泽", gender: this.genders.MALE, culture: this.cultures.HANSA });
			this.names.personalNames.push({name: "阿西姆", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "阿尔明", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "巴图", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "汉内斯", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "迈赫迪", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "梅达德", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "奥马尔", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "维万", gender: this.genders.MALE, culture: this.cultures.INDUS });
			this.names.personalNames.push({name: "尤里", gender: this.genders.MALE, culture: this.cultures.KIEVAN });
			this.names.personalNames.push({name: "西蒙", gender: this.genders.MALE, culture: this.cultures.KIEVAN });
			this.names.personalNames.push({name: "帕维尔", gender: this.genders.MALE, culture: this.cultures.KIEVAN });
			this.names.personalNames.push({name: "谢尔盖", gender: this.genders.MALE, culture: this.cultures.KIEVAN });
			this.names.personalNames.push({name: "阿金德", gender: this.genders.MALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "博塞德", gender: this.genders.MALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "福拉凯", gender: this.genders.MALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "奥科罗", gender: this.genders.MALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "特莱奥拉", gender: this.genders.MALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "特米托佩", gender: this.genders.MALE, culture: this.cultures.SAHEL })
			this.names.personalNames.push({name: "阿尔班", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "额尔辛", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "楚伦", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "扎尔嘎勒", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "巴塔尔", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "库安利", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "巴特巴亚尔", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "帖木儿", gender: this.genders.MALE, culture: this.cultures.YUAN });
			this.names.personalNames.push({name: "特姆", gender: this.genders.MALE, culture: this.cultures.YUAN });
			
			// nicknames by origin
			this.names.nickNames.push({name: "子弹", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "火花", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "小不点儿", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "狮子", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "幸运儿", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "针", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "老鼠", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "尖刺", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "狡猾", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "头巾", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "节点", origin: this.origins.SLUMS });
			this.names.nickNames.push({name: "阿克森", origin: this.origins.SLUMS });

			this.names.nickNames.push({name: "本尼", origin: this.origins.SLUMS, gender: this.genders.MALE });
			this.names.nickNames.push({name: "秃鹫", origin: this.origins.SLUMS, gender: this.genders.MALE });

			this.names.nickNames.push({name: "丹鲁", origin: this.origins.SLUMS, culture: this.cultures.YUAN });
			this.names.nickNames.push({name: "奇登", origin: this.origins.SLUMS, culture: this.cultures.YUAN }); 

			this.names.nickNames.push({name: "鼠辈", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "彗星", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "蜘蛛", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "斜眼", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "尖牙", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "光明", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "指南针", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "河流", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "煤烟", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "阴影", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "面纱", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "根须", origin: this.origins.DARKLEVELS });
			this.names.nickNames.push({name: "预兆", origin: this.origins.DARKLEVELS });
		},
		
		getRandomGender: function () {
			let r = Math.random();
			if (r < 0.4) return this.genders.MALE;
			if (r < 0.8) return this.genders.FEMALE;
			return this.genders.OTHER;
		},
		
		getRandomOrigin: function (level) {
			let r = Math.random();
			
			let surfaceThreshold = level > 14 ? 0.25 : 0;
			if (r < surfaceThreshold) return this.origins.SURFACE;
			
			let darkLevelThreshold = level < 10 ? 0.75 : 0.25;
			if (r < surfaceThreshold + darkLevelThreshold) return this.origins.DARKLEVELS;
			
			return this.origins.SLUMS;
		},
		
		getRandomCultures: function (num, origin, excludedCultures) {
			let result = [];
			for (let i = 0; i < num; i++) {
				result.push(this.getRandomCulture(origin, result, excludedCultures));
			}
			return result;
		},
		
		getRandomCulture: function (origin, excludedCultures) {
			let possibleCultures = [];
			
			for (let k in this.cultures) {
				let culture = this.cultures[k];
				if (excludedCultures.indexOf(culture) >= 0) continue;
				let probability = this.getCultureProbability(culture, origin);
				if (Math.random() < probability) possibleCultures.push(culture);
			}
				
			return possibleCultures[Math.floor(Math.random() * possibleCultures.length)];
		},
		
		getCultureProbability: function (culture, origin) {
			switch (culture) {
				case this.cultures.ASSURIAN: return 1.5;
				case this.cultures.INDUS: return 1.5;
				case this.cultures.KIEVAN: return 1;
				case this.cultures.ETRURIAN: return origin == this.origins.SURFACE ? 0.5 : 1;
				case this.cultures.SAHEL: return origin == this.origins.SURFACE ? 1 : 0.5;
				case this.cultures.YUAN: return 0.75;
				case this.cultures.HANSA: return origin == this.origins.SLUMS ? 1 : 0.25;
				case this.cultures.DOMA: return origin == this.origins.DARKLEVELS ? 1 : 0;
				default: return 1;
			}
		},
		
		getRandomShortName: function (gender, origin, culturalHeritage) {
			let validNames = this.getValidShortNames(gender, origin, culturalHeritage);
			return validNames[Math.floor(Math.random() * validNames.length)];
		},
		
		getValidShortNames: function (gender, origin, culturalHeritage) {
			let result = [];
			for (let i in CultureConstants.names.personalNames) {
				let name = CultureConstants.names.personalNames[i];
				if (CultureConstants.isValidName(name, gender, origin, culturalHeritage)) {
					result.push(name.name);
				}
			}
			for (let i in CultureConstants.names.nickNames) {
				let name = CultureConstants.names.nickNames[i];
				if (CultureConstants.isValidName(name, gender, origin, culturalHeritage)) {
					result.push(name.name);
				}
			}
			return result;
		},
		
		isValidName: function (name, gender, origin, culturalHeritage) {
			if (!name.name) return false;
			if (name.gender && gender && name.gender != gender) return false;
			if (name.origin && origin && name.origin != origin) return false;
			if (name.culture && culturalHeritage && culturalHeritage.length > 0) {
				let foundMatchingCulture = false;
				for (let i = 0; i < culturalHeritage.length; i++) {
					if (name.culture == culturalHeritage[i]) {
						foundMatchingCulture = true;
						break;
					}
				}
				if (!foundMatchingCulture) return false;
			}
			return true;
		},
		
	};
	
	CultureConstants.initNames();
	
	return CultureConstants;
});
