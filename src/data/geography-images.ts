/**
 * Photographs curated from Wikimedia Commons on 2026-09-06.
 * Captions distinguish present-day scenery, later monuments and museum models
 * from the historical geography described in the corresponding place entry.
 * WebP copies retain the full composition; see /geography/credits.json.
 */
export interface GeographyImage {
  src: string;
  alt: string;
  caption: string;
  sourceUrl: string;
  creator: string;
  license: string;
  licenseUrl: string;
  width: number;
  height: number;
}

export const geographyImageProcessing =
  "图片经等比例缩小并转换为 WebP，画面内容未改动；各图沿用所列原始许可。";

export const geographyImages: Record<string, GeographyImage> = {
  "qufu-temple": {
    src: "/geography/qufu-temple.webp",
    alt: "曲阜孔庙德侔天地坊与两侧树木",
    caption: "今天的曲阜孔庙。现存建筑主要形成于明清，是后世纪念孔子的场所，可帮助认识鲁都曲阜的文化延续。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Qufu_Confucian_Temple_49254-Qufu_(49055646621).jpg",
    creator: "xiquinhosilva",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    width: 1600,
    height: 1005,
  },
  "linzi-model": {
    src: "/geography/linzi-model.webp",
    alt: "齐国历史博物馆展出的临淄古城复原模型",
    caption: "齐国历史博物馆中的临淄古城复原模型，呈现对古代城市空间的现代解释；图中建筑为模型。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Linzi_model_2010_06_06.jpg",
    creator: "Rolfmueller",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    width: 1600,
    height: 1011,
  },
  "luoyang-luo-river": {
    src: "/geography/luoyang-luo-river.webp",
    alt: "洛河洛阳涧西区段与现代城市天际线",
    caption: "洛河洛阳涧西区段的当代景观，展示洛阳所在河谷的环境。河岸建筑属于现代城市。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Luo_River_Luoyang.jpg",
    creator: "Potatohai",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    width: 1600,
    height: 1200,
  },
  "shangqiu-city-wall": {
    src: "/geography/shangqiu-city-wall.webp",
    alt: "今天商丘古城的城门与城楼",
    caption: "今天的商丘古城城门。现存城墙属于明代城市遗产，可作为宋国故地的地域参照。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shangqiu_City_Wall_-_10287351905.jpg",
    creator: "Gary Todd",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    width: 1600,
    height: 1067,
  },
  "mount-tai": {
    src: "/geography/mount-tai.webp",
    alt: "泰山高处的山岩、植被与后世庙宇",
    caption: "泰山高处的当代景观。山体帮助理解鲁地的自然环境，画面中的庙宇为后世建筑。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mount_Tai.jpg",
    creator: "kanegen",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    width: 1600,
    height: 1064,
  },
  "yellow-river": {
    src: "/geography/yellow-river.webp",
    alt: "河南境内夏季黄河的河道与沙洲",
    caption: "河南境内黄河的当代河道与沙洲。黄河历代屡有改道，本图用于认识河流景观，不能据此还原春秋渡口。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Yellow_River_in_summer.jpg",
    creator: "Chrisding30",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    width: 1600,
    height: 1200,
  },
  "nishan-temple": {
    src: "/geography/nishan-temple.webp",
    alt: "尼山孔庙大成殿的正面建筑",
    caption: "今天的尼山孔庙大成殿，属于后世纪念建筑。照片展示尼山的文化景观，孔子出生地的记述仍须依据文献辨析。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Dachengdian,_Mount_Ni.jpg",
    creator: "大禾花",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    width: 1600,
    height: 900,
  },
  "suzhou-pan-gate": {
    src: "/geography/suzhou-pan-gate.webp",
    alt: "苏州盘门的水门、城墙与河道",
    caption: "今天的苏州盘门水门，展示江南城市与水系的关系。现存建筑经历后世修筑，用于说明吴地环境。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:20090926_Suzhou_Pan_Men_5941.jpg",
    creator: "Jakub Hałun",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    width: 1600,
    height: 1064,
  },
  "huaiyang-taihao": {
    src: "/geography/huaiyang-taihao.webp",
    alt: "河南淮阳太昊陵的门楼与前方广场",
    caption: "淮阳太昊陵的当代照片，作为陈国故地的地域参照。图中为后世纪念建筑，不能据此确认孔子在陈的具体活动地点。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:太昊陵.jpg",
    creator: "Lordary",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    width: 1600,
    height: 1067,
  },
  "jingzhou-city-wall": {
    src: "/geography/jingzhou-city-wall.webp",
    alt: "荆州古城东侧城墙、绿树与护城河",
    caption: "今天的荆州古城东侧城墙与护城河，作为楚地江汉地区的景观参照。现存城墙属于后世城市遗产。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Muraille_Est_de_Jingzhou.JPG",
    creator: "Popolon",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    width: 1600,
    height: 899,
  },
  "xinzheng-city-wall": {
    src: "/geography/xinzheng-city-wall.webp",
    alt: "新郑郑韩故城城墙遗存中层层夯筑的土墙断面",
    caption: "新郑郑韩故城夯土城墙遗存的现代照片，清楚呈现分层夯筑的结构。遗址帮助认识东周都城的营建，具体遗存年代须结合考古材料判断。",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Xinzheng_Ancient_City_Wall_of_Rammed_Earth,_Eastern_Zhou,_c._770-230_BC.jpg",
    creator: "Gary Todd",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    width: 1600,
    height: 1067,
  },
};

/** Only direct place matches and explicitly captioned regional references. */
export const geographyImageByPlaceSlug: Record<string, string> = {
  qufu: "qufu-temple",
  lu: "qufu-temple",
  qi: "linzi-model",
  linzi: "linzi-model",
  taishan: "mount-tai",
  zhou: "luoyang-luo-river",
  song: "shangqiu-city-wall",
  "yellow-river": "yellow-river",
  nishan: "nishan-temple",
  wu: "suzhou-pan-gate",
  chen: "huaiyang-taihao",
  chu: "jingzhou-city-wall",
  zheng: "xinzheng-city-wall",
};
