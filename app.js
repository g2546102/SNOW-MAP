
// =========================
// LOAD RESORT DATA
// =========================

let resorts = [];

async function loadResorts() {
    try {
        const response = await fetch("./data/resorts.json");

        if (!response.ok) {
            throw new Error("スキー場データを読み込めませんでした");
        }


        // SNOW MAP 掲載スキー場

        const allResorts = await response.json();

        // 表示するスキー場を各エリア2か所に限定
        const featuredResortIds = new Set([
            // 北海道
            4, 32,

            // 東北
            3, 37,

            // 関東
            46, 47,

            // 甲信越
            1, 2,

            // 北陸
            55, 56,

            // 東海
            6, 58,

            // 近畿
            59, 60,

            // 中国
            7, 12,

            // 四国
            25, 27
        ]);

        resorts = allResorts.filter(resort =>
            featuredResortIds.has(resort.id)
        );



        initializeApp();

    } catch (error) {
        console.error("データ読み込みエラー:", error);

        document.getElementById("resort-grid").textContent =
            "スキー場データを読み込めませんでした。";
    }
}

// =====================================
// RESORT COURSE MAP IMAGES
// スキー場ごとのコースマップ画像
// =====================================

const resortCourseMaps = {
"ニセコ東急 グラン・ヒラフ": {
    image: "https://www.grand-hirafu.jp/snow/maps/images/map_popup.webp",
    source: "ニセコ東急 グラン・ヒラフ 公式コースマップ"
    },

"ルスツリゾート": {
    image: "https://rusutsu.com/wp-content/uploads/trail-map-winter.jpg",
    source: "ルスツリゾート 公式ゲレンデマップ"
    },

"蔵王温泉スキー場": {
    image: "https://zaomountainresort.com/wp-content/uploads/2025/12/ed53c4ff5e3d9f4e6125d52781bc7b50-scaled.jpg",
    source: "蔵王温泉スキー場 公式ゲレンデマップ"
},

"安比高原スキー場": {
    image: "https://www.appi.co.jp/snow-mountain-resort/assets/img/course/course_2025-26_all.jpg",
    source: "安比高原スキー場 公式コースマップ"
},

"丸沼高原スキー場": {
    image: "https://www.marunuma.jp/winter/wp/wp-content/uploads/2025/10/2026wcoursemap.jpg",
    source: "丸沼高原スキー場 公式コースマップ"
},


// 甲信越
"苗場スキー場": {
    image: "./data/naeba.jpg",
    source: "苗場スキー場 公式"
},
"野沢温泉スキー場": {
    image: "./data/nozawa.jpg",
    source: "野沢温泉スキー場 公式"
},

// 北陸
"JAM福井勝山マウンテンリゾート": {
    image: "./data/jam.jpg",
    source: "JAM福井勝山 公式"
},
"白山一里野温泉スキー場": {
    image: "./data/sirayama.jpg",
    source: "白山一里野温泉スキー場 公式"
},

// 東海
"ダイナランド": {
    image: "./data/daina.jpg",
    source: "ダイナランド 公式"
},
"高鷲スノーパーク": {
    image: "./data/takataka.jpg",
    source: "高鷲スノーパーク 公式"
},

// 近畿
"グランスノー奥伊吹": {
    image: "./data/gurann.webp",
    source: "グランスノー奥伊吹 公式"
},
"びわ湖バレイ": {
    image: "./data/biwako.jpg",
    source: "びわ湖バレイ 公式"
},

// 中国
"だいせんホワイトリゾート": {
    image: "./data/daisenn.jpg",
    source: "だいせんホワイトリゾート 公式"
},
"瑞穂ハイランド": {
    image: "./data/mizuho.jpg",
    source: "瑞穂ハイランド 公式"
},

// 四国
"久万スキーランド": {
    image: "./data/kumann.jpg",
    source: "久万スキーランド 公式"
},
"石鎚スキー場": {
    image: "./data/sekitui.jpg",
    source: "石鎚スキー場 公式"
}

};


// =========================
// MAP
// =========================

const JAPAN_CENTER = [37.5, 137.5];
const JAPAN_ZOOM = 4.6;

const map = L.map("map", {
    scrollWheelZoom: false
}).setView(JAPAN_CENTER, JAPAN_ZOOM);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }
).addTo(map);


// =========================
// MAP STAGE CONTROL
// =========================

let currentMapStage = "japan";

async function loadJapanMap() {
    const japanMap = document.getElementById("japan-map");

    try {
        const response = await fetch("./data/japan-map.svg");

        if (!response.ok) {
            throw new Error("日本地図SVGを読み込めませんでした");
        }

        const svgText = await response.text();
        japanMap.innerHTML = svgText;


        const svg = japanMap.querySelector("svg");

        if (svg) {
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");

            // 都道府県コードとSNOW MAPの地域を対応させる
            const prefectureRegions = {
                "1": "北海道",

                "2": "東北",
                "3": "東北",
                "4": "東北",
                "5": "東北",
                "6": "東北",
                "7": "東北",

                "8": "関東",
                "9": "関東",
                "10": "関東",
                "11": "関東",
                "12": "関東",
                "13": "関東",
                "14": "関東",

                "15": "甲信越",
                "16": "北陸",
                "17": "北陸",
                "18": "北陸",
                "19": "甲信越",
                "20": "甲信越",

                "21": "東海",
                "22": "東海",
                "23": "東海",
                "24": "東海",

                "25": "近畿",
                "26": "近畿",
                "27": "近畿",
                "28": "近畿",
                "29": "近畿",
                "30": "近畿",

                "31": "中国",
                "32": "中国",
                "33": "中国",
                "34": "中国",
                "35": "中国",

                "36": "四国",
                "37": "四国",
                "38": "四国",
                "39": "四国",

                "40": "九州",
                "41": "九州",
                "42": "九州",
                "43": "九州",
                "44": "九州",
                "45": "九州",
                "46": "九州",
                "47": "九州"
            };

            // 都道府県をクリック可能にする
            const prefectures = svg.querySelectorAll(".prefecture");

            prefectures.forEach(prefecture => {

                const region =
                    prefectureRegions[prefecture.dataset.code];

                if (!region) return;

                prefecture.style.cursor = "pointer";

                prefecture.addEventListener("click", () => {

                    selectedRegion = region;

                    // 左側の地域ボタンも連動させる
                    document.querySelectorAll(".region-button")
                        .forEach(button => {
                            button.classList.toggle(
                                "active",
                                button.dataset.region === region
                            );
                        });

                    closeResortDetails();

                    // 地域マップへ切り替える
                    showMapStage("region");

                    updateDisplay();

                    // Leafletが表示されてから地域にフォーカス
                    setTimeout(() => {
                        focusRegion(region);
                    }, 180);

                });

            });
        }


    } catch (error) {
        console.error("日本地図読み込みエラー:", error);
        japanMap.textContent = "日本地図を読み込めませんでした。";
    }
}


// =========================
// MAP STAGE TRANSITION
// =========================

function showMapStage(stage) {

    const stages = {
        japan: document.getElementById("japan-stage"),
        region: document.getElementById("region-stage"),
        mountain: document.getElementById("mountain-stage")
    };

    if (!stages[stage]) return;

    Object.entries(stages).forEach(([name, element]) => {
        element.hidden = name !== stage;
        element.classList.toggle("active", name === stage);
    });

    currentMapStage = stage;

    const stageNumbers = {
        japan: "01 / 03",
        region: "02 / 03",
        mountain: "03 / 03"
    };

    const stageLabels = {
        japan: "JAPAN / SNOW MAP",
        region: "REGION / TOPOGRAPHIC MAP",
        mountain: "COURSE MAP / RESORT GUIDE"
    };

    document.getElementById("map-stage-number").textContent =
        stageNumbers[stage];

    document.getElementById("map-stage-label").textContent =
        stageLabels[stage];

    document.getElementById("map-back").hidden =
        stage === "japan";

    // Leafletの表示サイズを再計算
    if (stage === "region") {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }

    // 3D地形の表示サイズを再計算
    if (stage === "mountain") {
        setTimeout(() => {
            resizeMountainScene();
        }, 150);
    }

}
/* =====================================
   SNOW MAP - 3D MOUNTAIN ENGINE
===================================== */

let mountainScene = null;
let mountainCamera = null;
let mountainRenderer = null;
let mountainTerrain = null;
let mountainAnimationStarted = false;

let mountainRotation = 0.45;
let mountainTilt = 0.85;
let mountainZoom = 1;

let mountainPointerDown = false;
let mountainPointerX = 0;
let mountainPointerY = 0;


// =====================================
// GSI ELEVATION DATA
// 国土地理院の標高タイルを取得
// =====================================

const DEM_ZOOM = 13;
const DEM_TILE_URL =
    "https://cyberjapandata.gsi.go.jp/xyz/dem5a_png";

// 緯度経度をタイル座標に変換
function getTilePosition(lat, lon, zoom) {

    const n = 2 ** zoom;

    const x =
        (lon + 180) / 360 * n;

    const latRad =
        lat * Math.PI / 180;

    const y =
        (1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n;

    return { x, y };
}


// =====================================
// ELEVATION TILE LOADER
// 複数の標高データに対応
// =====================================

// 利用する標高データ
const DEM_SOURCES = [
    "dem5a_png",
    "dem5b_png",
    "dem5c_png",
    "dem_png"
];


// 標高タイル画像を読み込む
function loadElevationTile(url) {

    return new Promise((resolve, reject) => {

        const image = new Image();

        image.crossOrigin = "anonymous";

        image.onload = () => resolve(image);

        image.onerror = () => reject(
            new Error("タイルが見つかりません: " + url)
        );

        image.src = url;
    });
}


// 利用可能な標高タイルを探す
async function loadAvailableElevationTile(x, y, zoom) {

    for (const source of DEM_SOURCES) {

        const url =
            `https://cyberjapandata.gsi.go.jp/xyz/${source}/${zoom}/${x}/${y}.png`;

        try {

            const image = await loadElevationTile(url);

            return image;

        } catch (error) {

            console.warn(
                `${source} の取得に失敗。次のデータを試します。`
            );

        }
    }

    return null;
}



// =====================================
// ELEVATION DATA LOADER
// 同じ種類の標高データで地形を構成
// =====================================

async function loadElevationData(lat, lon) {

    const tilePosition =
        getTilePosition(lat, lon, DEM_ZOOM);

    const centerTileX =
        Math.floor(tilePosition.x);

    const centerTileY =
        Math.floor(tilePosition.y);

    const centerPixelX =
        (tilePosition.x - centerTileX) * 256;

    const centerPixelY =
        (tilePosition.y - centerTileY) * 256;

    const canvas = document.createElement("canvas");

    canvas.width = 768;
    canvas.height = 768;

    const context = canvas.getContext("2d", {
        willReadFrequently: true
    });

    let selectedSource = null;

    // 中央タイルで利用できるデータ種類を決定
    for (const source of DEM_SOURCES) {

        const url =
            `https://cyberjapandata.gsi.go.jp/xyz/${source}/${DEM_ZOOM}/${centerTileX}/${centerTileY}.png`;

        try {

            await loadElevationTile(url);

            selectedSource = source;

            break;

        } catch (error) {

            console.warn(
                `${source} は中央タイルで利用できません`
            );

        }
    }

    if (!selectedSource) {
        throw new Error(
            "利用できる標高データがありません"
        );
    }

    console.log(
        "使用する標高データ:",
        selectedSource
    );

    // NoDataで初期化
    context.fillStyle = "rgb(128, 0, 0)";
    context.fillRect(0, 0, 768, 768);

    let loadedCount = 0;

    // 選択した種類のデータだけを取得
    for (let dy = -1; dy <= 1; dy++) {

        for (let dx = -1; dx <= 1; dx++) {

            const tileX = centerTileX + dx;
            const tileY = centerTileY + dy;

            const url =
                `https://cyberjapandata.gsi.go.jp/xyz/${selectedSource}/${DEM_ZOOM}/${tileX}/${tileY}.png`;

            try {

                const image =
                    await loadElevationTile(url);

                context.drawImage(
                    image,
                    (dx + 1) * 256,
                    (dy + 1) * 256,
                    256,
                    256
                );

                loadedCount++;

            } catch (error) {

                console.warn(
                    `タイル欠損: ${tileX}/${tileY}`
                );

            }
        }
    }

    const imageData =
        context.getImageData(0, 0, 768, 768);

    console.log(
        `標高タイル取得成功: ${loadedCount}/9`
    );

    return {
        data: imageData.data,
        centerX: 256 + centerPixelX,
        centerY: 256 + centerPixelY,
        source: selectedSource,
        loadedCount: loadedCount
    };
}


// =====================================
// SKI COURSE DATA
// OpenStreetMapからコース情報を取得
// =====================================

async function loadSkiCourses(resort) {

    // 富良野周辺の検索範囲
    const bbox = [
        resort.latitude - 0.045,
        resort.longitude - 0.055,
        resort.latitude + 0.045,
        resort.longitude + 0.055
    ];

    const query = `
        [out:json][timeout:30];
        (
            way["piste:type"="downhill"]
            (${bbox.join(",")});
        );
        out geom;
    `;

    const endpoint =
        "https://overpass-api.de/api/interpreter";

    const response = await fetch(endpoint, {
        method: "POST",
        body: new URLSearchParams({
            data: query
        })
    });

    if (!response.ok) {
        throw new Error(
            "スキーコースデータを取得できませんでした"
        );
    }

    const result = await response.json();

    const courses = result.elements
        .filter(element =>
            element.type === "way" &&
            element.geometry &&
            element.geometry.length >= 2
        )
        .map(element => ({
            id: element.id,
            name:
                element.tags.name ||
                element.tags["piste:name"] ||
                "名称未登録コース",

            difficulty:
                element.tags["piste:difficulty"] ||
                "unknown",

            coordinates: element.geometry.map(point => [
                point.lat,
                point.lon
            ])
        }));

    // コース名ごとに整理
    const courseGroups = {};

    courses.forEach(course => {

        const name = course.name;

        if (!courseGroups[name]) {
            courseGroups[name] = {
                name: name,
                difficulty: course.difficulty,
                segments: 0,
                points: 0
            };
        }

        courseGroups[name].segments++;
        courseGroups[name].points +=
            course.coordinates.length;
    });

    console.log("取得したコース一覧:");

    console.table(
        Object.values(courseGroups)
    );

    console.log("取得した線データ数:", courses.length);
    console.log(
        "コース名の種類:",
        Object.keys(courseGroups).length
    );

    return courses;
}



// RGB値を標高に変換
function decodeElevation(r, g, b) {

    const value =
        r * 65536 + g * 256 + b;

    // 標高データが存在しない場所
    if (value === 8388608) {
        return null;
    }

    if (value < 8388608) {
        return value * 0.01;
    }

    return (value - 16777216) * 0.01;
}


// 指定した画像座標から標高を取得
function getElevationAt(data, x, y) {

    const pixelX = Math.round(x);
    const pixelY = Math.round(y);

    if (
        pixelX < 0 || pixelX >= 768 ||
        pixelY < 0 || pixelY >= 768
    ) {
        return null;
    }

    const index =
        (pixelY * 768 + pixelX) * 4;

    return decodeElevation(
        data[index],
        data[index + 1],
        data[index + 2]
    );
}

// =====================================
// REAL MOUNTAIN TERRAIN
// 実際の標高データから3D地形を生成
// =====================================

async function createMountainTerrain(resort) {

    // スキー場周辺の標高データを取得
    const elevationData = await loadElevationData(
        resort.latitude,
        resort.longitude
    );

    const segments = 180;
    const size = 20;

    const geometry = new THREE.PlaneGeometry(
        size,
        size,
        segments,
        segments
    );

    geometry.rotateX(-Math.PI / 2);

    const positions =
        geometry.attributes.position;

    const elevations = [];

    let minElevation = Infinity;

    // 各頂点の標高を取得
    for (let i = 0; i < positions.count; i++) {

        const x = positions.getX(i);
        const z = positions.getZ(i);

        const pixelX =
            elevationData.centerX + (x / size) * 256;

        const pixelY =
            elevationData.centerY + (z / size) * 256;

        const elevation = getElevationAt(
            elevationData.data,
            pixelX,
            pixelY
        );

        elevations.push(elevation);

        if (
            elevation !== null &&
            elevation < minElevation
        ) {
            minElevation = elevation;
        }
    }

    if (!Number.isFinite(minElevation)) {
        throw new Error("有効な標高データがありません");
    }

// =====================================
// MISSING ELEVATION INTERPOLATION
// 欠損した標高を周囲から補間
// =====================================

const gridSize = segments + 1;

for (let i = 0; i < elevations.length; i++) {

    if (elevations[i] !== null) continue;

    const x = i % gridSize;
    const z = Math.floor(i / gridSize);

    let values = [];

    // 周囲の有効な標高を探す
    for (let radius = 1; radius <= 5; radius++) {

        values = [];

        for (let dz = -radius; dz <= radius; dz++) {

            for (let dx = -radius; dx <= radius; dx++) {

                const nx = x + dx;
                const nz = z + dz;

                if (
                    nx < 0 || nx >= gridSize ||
                    nz < 0 || nz >= gridSize
                ) continue;

                const neighborIndex =
                    nz * gridSize + nx;

                const value =
                    elevations[neighborIndex];

                if (value !== null) {
                    values.push(value);
                }
            }
        }

        if (values.length > 0) break;
    }

    if (values.length > 0) {

        elevations[i] =
            values.reduce((sum, value) => sum + value, 0) /
            values.length;

    } else {

        elevations[i] = minElevation;

    }
}

    const colors = [];

    const lowColor =
        new THREE.Color("#527D91");

    const middleColor =
        new THREE.Color("#A9C7D5");

    const highColor =
        new THREE.Color("#FFFFFF");

    // 標高を3D座標に変換
    for (let i = 0; i < positions.count; i++) {

        let elevation = elevations[i];

        if (elevation === null) {
            elevation = minElevation;
        }

        const relativeHeight =
            elevation - minElevation;

        // 高さを3D空間に変換
        positions.setY(
            i,
            relativeHeight * 0.008
        );

        // 高さに応じて色を変える
        let color;

        if (relativeHeight > 700) {
            color = highColor;
        } else if (relativeHeight > 300) {
            color = middleColor;
        } else {
            color = lowColor;
        }

        colors.push(
            color.r,
            color.g,
            color.b
        );
    }

    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
    );

    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.95,
        metalness: 0,
        side: THREE.DoubleSide
    });

    return new THREE.Mesh(
        geometry,
        material
    );
}


// 3Dシーンを初期化
function initializeMountainScene() {

    const container =
        document.getElementById("mountain-view");

    if (!container || !window.THREE) {
        console.error("Three.jsを読み込めませんでした");
        return;
    }

    if (mountainRenderer) return;

    mountainScene = new THREE.Scene();

    mountainScene.background =
        new THREE.Color("#EAF0F3");

    mountainCamera = new THREE.PerspectiveCamera(
        45,
        1,
        0.1,
        1000
    );

    mountainCamera.position.set(16, 13, 18);

    mountainRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    mountainRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    mountainRenderer.toneMappingExposure = 1.15;

    mountainRenderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    mountainRenderer.shadowMap.enabled = true;

    mountainRenderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    mountainRenderer.outputColorSpace =
        THREE.SRGBColorSpace;

    container.appendChild(
        mountainRenderer.domElement
    );

    // 光源
    const hemisphereLight = new THREE.HemisphereLight(
        "#FFFFFF",
        "#8CA6B5",
        1.4
    );

    mountainScene.add(hemisphereLight);

    const ambientLight = new THREE.AmbientLight(
        "#FFFFFF",
        0.5
    );

    mountainScene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
        "#FFFFFF",
        2.8
    );

    sunLight.position.set(-12, 20, 10);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;

    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.bottom = -15;

    sunLight.shadow.bias = -0.0002;

    mountainScene.add(sunLight);

    // 地面
    const groundGeometry =
        new THREE.PlaneGeometry(200, 200);

    groundGeometry.rotateX(-Math.PI / 2);

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: "#DCE8ED",
            roughness: 1
        });

    const ground = new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

    ground.position.y = -0.08;

    ground.receiveShadow = true;
    mountainScene.add(ground);



    // マウス操作
    container.addEventListener(
        "pointerdown",
        event => {
            mountainPointerDown = true;
            mountainPointerX = event.clientX;
            mountainPointerY = event.clientY;
            container.setPointerCapture(event.pointerId);
        }
    );

    container.addEventListener(
        "pointermove",
        event => {

            if (!mountainPointerDown) return;

            const dx = event.clientX - mountainPointerX;
            const dy = event.clientY - mountainPointerY;

            mountainRotation += dx * 0.008;

            mountainTilt = Math.max(
                0.25,
                Math.min(1.35, mountainTilt + dy * 0.005)
            );

            mountainPointerX = event.clientX;
            mountainPointerY = event.clientY;
        }
    );

    container.addEventListener(
        "pointerup",
        () => {
            mountainPointerDown = false;
        }
    );

    container.addEventListener(
        "pointercancel",
        () => {
            mountainPointerDown = false;
        }
    );

    // 拡大・縮小
    container.addEventListener(
        "wheel",
        event => {
            event.preventDefault();

            mountainZoom += event.deltaY * -0.001;

            mountainZoom = Math.max(
                0.65,
                Math.min(1.8, mountainZoom)
            );
        },
        { passive: false }
    );

    resizeMountainScene();

    if (!mountainAnimationStarted) {
        mountainAnimationStarted = true;
        animateMountain();
    }

    window.addEventListener(
        "resize",
        resizeMountainScene
    );
}


// 画面サイズに合わせる
function resizeMountainScene() {

    const container =
        document.getElementById("mountain-view");

    if (!container || !mountainRenderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    mountainCamera.aspect = width / height;
    mountainCamera.updateProjectionMatrix();

    mountainRenderer.setSize(width, height);
}


// カメラを更新
function updateMountainCamera() {

    const distance = 27 / mountainZoom;

    mountainCamera.position.set(
        Math.sin(mountainRotation) *
            distance * Math.cos(mountainTilt),

        distance * Math.sin(mountainTilt),

        Math.cos(mountainRotation) *
            distance * Math.cos(mountainTilt)
    );

    mountainCamera.lookAt(0, 1.2, 0);
}


// アニメーション
function animateMountain() {

    requestAnimationFrame(animateMountain);

    if (!mountainRenderer || !mountainScene) return;

    updateMountainCamera();

    mountainRenderer.render(
        mountainScene,
        mountainCamera
    );
}





// =====================================
// RESORT COURSE MAP
// コースマップ表示・拡大機能
// =====================================

function renderMountain(resort) {

    const title = document.getElementById("mountain-title");
    const container = document.getElementById("mountain-view");

    if (!container) return;

    if (title) {
        title.textContent = resort.name;
    }

    const courseMap = resortCourseMaps[resort.name];

    container.innerHTML = "";

    if (!courseMap || !courseMap.image) {
        container.innerHTML = `
            <div class="course-map-error">
                <p>コースマップは準備中です。</p>
            </div>
        `;
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "course-map-wrapper";

    const guide = document.createElement("p");
    guide.className = "course-map-guide";
    guide.textContent = "画像をクリックすると拡大できます";

    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "course-map-image-button";
    imageButton.setAttribute("aria-label", "コースマップを拡大");

    const image = document.createElement("img");
    image.src = courseMap.image;
    image.alt = `${resort.name} 公式コースマップ`;
    image.className = "course-map-image";

    image.onerror = () => {
        imageButton.remove();

        const error = document.createElement("p");
        error.className = "course-map-error";
        error.textContent = "コースマップを読み込めませんでした。";

        wrapper.appendChild(error);
    };

    imageButton.appendChild(image);

    imageButton.addEventListener("click", () => {
        openCourseMapViewer(courseMap.image, resort.name);
    });

    const source = document.createElement("p");
    source.className = "course-map-source";
    source.textContent = courseMap.source;

    wrapper.appendChild(guide);
    wrapper.appendChild(imageButton);
    wrapper.appendChild(source);

    container.appendChild(wrapper);
}




// =====================================
// COURSE MAP IMAGE VIEWER
// =====================================

function openCourseMapViewer(imageUrl, resortName) {

    let dialog = document.getElementById("course-map-dialog");

    // ダイアログがなければ作成
    if (!dialog) {

        dialog = document.createElement("dialog");
        dialog.id = "course-map-dialog";
        dialog.className = "course-map-dialog";

        dialog.innerHTML = `
            <div class="course-map-viewer">

                <div class="course-map-viewer-header">
                    <span id="course-map-viewer-title"></span>

                    <button
                        type="button"
                        id="course-map-close"
                        class="course-map-close">
                        ×
                    </button>
                </div>

                <div class="course-map-viewer-content">
                    <img
                        id="course-map-large-image"
                        alt="">
                </div>

                <p class="course-map-viewer-guide">
                    拡大画像はスクロールして確認できます
                </p>

            </div>
        `;

        document.body.appendChild(dialog);

        // 閉じるボタン
        dialog.querySelector("#course-map-close")
            .addEventListener("click", () => {
                dialog.close();
            });

        // 背景クリックで閉じる
        dialog.addEventListener("click", event => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    }

    // 画像とタイトルを更新
    dialog.querySelector("#course-map-viewer-title")
        .textContent = resortName;

    const largeImage =
        dialog.querySelector("#course-map-large-image");

    largeImage.src = imageUrl;
    largeImage.alt = `${resortName} コースマップ`;

    dialog.showModal();
}


// =========================
// MAP BACK BUTTON
// =========================
function initializeMapNavigation() {

    document.getElementById("map-back")
        .addEventListener("click", () => {

            // 山の画面 → 地域マップ
            if (currentMapStage === "mountain") {
                returnToRegion();
            }

            // 地域マップ → 全国マップ
            else if (currentMapStage === "region") {

                selectedRegion = "all";

                document.querySelectorAll(".region-button")
                    .forEach(button => {
                        button.classList.toggle(
                            "active",
                            button.dataset.region === "all"
                        );
                    });

                closeResortDetails();

                showMapStage("japan");

                updateDisplay();
            }

        });
}



// =========================
// MAP MARKERS
// =========================

const markerLayer = L.layerGroup().addTo(map);

let selectedResortId = null;
let selectedRegion = "all";

function showMarkers(data) {

    markerLayer.clearLayers();

        const mapGuide = document.getElementById("map-guide");

    if (mapGuide) {
        mapGuide.hidden = selectedRegion !== "all";
    }

    // 地域が選択されていない場合はマーカーを表示しない
    if (selectedRegion === "all") {
        document.getElementById("resort-count").textContent =
            "SELECT AREA";

        return;
    }

    data.forEach(resort => {


        const customIcon = L.divIcon({
            className: "snow-marker-wrapper",
            html: '<div class="snow-pin"><span></span></div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });


        const marker = L.marker(
            [resort.latitude, resort.longitude],
            { icon: customIcon }
        ).addTo(markerLayer);


        marker.on("click", () => {

            // ほかのマーカーの選択状態を解除
            document.querySelectorAll(".snow-pin").forEach(pin => {
                pin.classList.remove("selected");
            });

            // 選択したマーカーを強調
            marker.getElement()
                .querySelector(".snow-pin")
                .classList.add("selected");

            // ズームが完全に終わってから画面を切り替える
            map.once("moveend", () => {

                showResortDetails(resort);

                showMapStage("mountain");

                renderMountain(resort);

            });

            // ゆっくり滑らかにズーム
            map.flyTo(
                [resort.latitude, resort.longitude],
                11,
                {
                    duration: 2.2,
                    easeLinearity: 0.12
                }
            );

        });


    });

    document.getElementById("resort-count").textContent =
        `${data.length} RESORTS`;

    // 選択中の施設が絞り込みで消えた場合
    if (
        selectedResortId !== null &&
        !data.some(resort => resort.id === selectedResortId)
    ) {
        closeResortDetails();
    }
}


// =========================
// REGION MAP FOCUS
// =========================

function focusRegion(region) {

    // 全国表示に戻す
    if (region === "all") {

        map.flyTo(
            JAPAN_CENTER,
            JAPAN_ZOOM,
            {
                duration: 1.2
            }
        );

        return;
    }

    // 選択地域に属する全スキー場を取得
    const regionResorts = resorts.filter(
        resort => resort.region === region
    );

    if (regionResorts.length === 0) {
        return;
    }

    // 地域内の緯度・経度から表示範囲を作成
    const bounds = L.latLngBounds(
        regionResorts.map(resort => [
            resort.latitude,
            resort.longitude
        ])
    );

    // 地域全体が見えるようにズーム
    map.flyToBounds(bounds, {
        padding: [45, 45],
        maxZoom: 8,
        duration: 1.2
    });
}


// =========================
// RESORT DETAIL PANEL
// =========================

function showResortDetails(resort) {

    selectedResortId = resort.id;

    document.getElementById("detail-empty").hidden = true;
    document.getElementById("detail-content").hidden = false;

    document.getElementById("detail-name").textContent =
        resort.name;

    document.getElementById("detail-region").textContent =
        `${resort.prefecture} / ${resort.region}`;

    const statusLabels = {
        active: "営業中",
        seasonal: "季節営業",
        suspended: "営業休止",
        unknown: "状況確認中"
    };

    document.getElementById("detail-status").textContent =
        statusLabels[resort.status] || "状況確認中";

    document.getElementById("detail-snow").textContent =
        resort.snowDepth === null
            ? "未取得"
            : `${resort.snowDepth} cm`;

    document.getElementById("detail-temperature").textContent =
        resort.temperature === null
            ? "未取得"
            : `${resort.temperature} ℃`;

    document.getElementById("detail-weather").textContent =
        resort.weather || "未取得";

    document.getElementById("detail-courses").textContent =
        resort.openCourses === null
            ? "未取得"
            : `${resort.openCourses} / ${resort.totalCourses ?? "?"}`;

    document.getElementById("detail-lifts").textContent =
        resort.activeLifts === null
            ? "未取得"
            : `${resort.activeLifts} / ${resort.totalLifts ?? "?"}`;

    const officialLink =
        document.getElementById("official-link");

    const officialUnavailable =
        document.getElementById("official-unavailable");

    if (
        resort.officialUrl &&
        resort.officialUrl.startsWith("https://")
    ) {

        officialLink.href = resort.officialUrl;
        officialLink.hidden = false;
        officialUnavailable.hidden = true;

    } else {

        officialLink.hidden = true;
        officialUnavailable.hidden = false;

    }
}


// =========================
// CLOSE DETAIL PANEL
// =========================

function closeResortDetails() {

    selectedResortId = null;

    document.querySelectorAll(".snow-pin").forEach(pin => {
        pin.classList.remove("selected");
    });

    document.getElementById("detail-content").hidden = true;
    document.getElementById("detail-empty").hidden = false;
}


/* =========================
   RETURN TO REGION MAP
========================= */

function returnToRegion() {

    // 詳細情報を閉じる
    closeResortDetails();

    // 山の画面にいる場合は地域マップへ戻る
    if (currentMapStage === "mountain") {
        showMapStage("region");
    }
}


// =========================
// RESORT CARDS
// =========================

function displayResorts(data) {

    const grid = document.getElementById("resort-grid");

    grid.innerHTML = "";

    data.forEach(resort => {

        const card = document.createElement("article");

        card.className = "resort-card";

        const snow = resort.snowDepth === null
            ? "未取得"
            : `${resort.snowDepth} cm`;

        const temperature = resort.temperature === null
            ? "未取得"
            : `${resort.temperature} ℃`;

        const courses = resort.openCourses === null
            ? "未取得"
            : `${resort.openCourses}/${resort.totalCourses ?? "?"}`;

        const statusText = {
            active: "営業中",
            seasonal: "季節営業",
            suspended: "営業休止",
            unknown: "状況確認中"
        };

        card.innerHTML = `
            <div class="resort-info">

                <p class="resort-region">
                    ${resort.prefecture} / ${resort.region}
                </p>

                <h3 class="resort-name">
                    ${resort.name}
                </h3>

                <p class="resort-status">
                    ${statusText[resort.status] || "状況確認中"}
                </p>

                <div class="resort-stats">

                    <div>
                        <span>積雪量</span>
                        <strong>${snow}</strong>
                    </div>

                    <div>
                        <span>気温</span>
                        <strong>${temperature}</strong>
                    </div>

                    <div>
                        <span>営業コース</span>
                        <strong>${courses}</strong>
                    </div>

                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}


// =========================
// FILTER
// =========================

function updateDisplay() {

    const searchWord =
        document.getElementById("search-input").value.trim();

    const openOnly =
        document.getElementById("open-only").checked;

    const sortType =
        document.getElementById("sort-select").value;

    let filtered = resorts.filter(resort => {

        const matchesRegion =
            selectedRegion === "all" ||
            resort.region === selectedRegion;

        const matchesSearch =
            resort.name.includes(searchWord);

        const matchesOpen =
            !openOnly || resort.isOpen === true;

        return matchesRegion &&
            matchesSearch &&
            matchesOpen;
    });


    // SORT

    if (sortType === "snow") {
        filtered.sort((a, b) =>
            (b.snowDepth ?? -1) - (a.snowDepth ?? -1)
        );
    }

    if (sortType === "name") {
        filtered.sort((a, b) =>
            a.name.localeCompare(b.name, "ja")
        );
    }


    displayResorts(filtered);
    showMarkers(filtered);
}


// =========================
// INITIALIZE APP
// =========================

function initializeApp() {

    // 地図ステージの初期設定
    initializeMapNavigation();
    loadJapanMap();
    showMapStage("japan");

    // Region buttons

    document.querySelectorAll(".region-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                document.querySelectorAll(".region-button")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                button.classList.add("active");

                selectedRegion = button.dataset.region;

                // 地域を切り替えたら詳細を閉じる
                closeResortDetails();

                // 地図を選択地域に移動
                if (selectedRegion === "all") {
                    showMapStage("japan");
                } else {
                    showMapStage("region");
                    focusRegion(selectedRegion);
                }

                updateDisplay();

            });

        });


    // Close detail panel

    document.getElementById("detail-close")
        .addEventListener("click", returnToRegion);


    // Search

    document.getElementById("search-input")
        .addEventListener("input", updateDisplay);


    // Open only

    document.getElementById("open-only")
        .addEventListener("change", updateDisplay);


    // Sort

    document.getElementById("sort-select")
        .addEventListener("change", updateDisplay);


    // Initial display

    updateDisplay();
}

// =====================================
// PDF COURSE MAP VIEWER
// PDF形式のコースマップを表示
// =====================================

function openPdfCourseMap(pdfUrl, resortName) {
    const dialog = document.createElement("dialog");

    dialog.className = "course-map-dialog";

    dialog.innerHTML = `
        <div class="course-map-viewer">
            <div class="course-map-viewer-header">
                <h2>${resortName} 公式コースマップ</h2>
                <button class="course-map-close">閉じる ×</button>
            </div>

            <iframe
                src="${pdfUrl}"
                title="${resortName} 公式コースマップ"
                class="course-map-pdf">
            </iframe>

            <a
                href="${pdfUrl}"
                target="_blank"
                rel="noopener noreferrer">
                PDFを別タブで開く
            </a>
        </div>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector(".course-map-close").addEventListener("click", () => {
        dialog.close();
        dialog.remove();
    });

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
            dialog.remove();
        }
    });

    dialog.showModal();
}

// =========================
// START
// =========================

loadResorts();
