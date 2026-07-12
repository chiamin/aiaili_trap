// 我愛陷阱題 — 單位陷阱題產生器 (demo)
// 範圍：國小三年級。陷阱類型 ⑤ 單位陷阱。
// 執行：node unitTrapGenerator.mjs [題數]
//
// 設計重點：
//   - 隨機的是「數字與名字」，陷阱結構是固定模板。
//   - 每個模板都內建檢查規則（整除、範圍、大小關係），不合格就重抽。
//   - 答案由程式算出，保證正確、可自動對答。

// ---- 小工具 ----
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const NAMES = ['小明', '小華', '小美', '小傑', '小安', '阿寶', '小雲', '小柏'];

// ---- 三個單位陷阱模板 ----
// 每個模板回傳 { question, answer, unit, trap }；若這次隨機數字不合格就回傳 null，交給重抽。

// 模板 A：公尺 ↔ 公分（緞帶做蝴蝶結）
function templateRibbon() {
  const meters = randInt(2, 6);                 // 緞帶長 2~6 公尺
  const perCm = pick([20, 25, 40, 50]);         // 每個蝴蝶結用的公分數（保證能整除）
  const totalCm = meters * 100;
  if (totalCm % perCm !== 0) return null;        // 整除檢查
  const answer = totalCm / perCm;
  const name = pick(NAMES);
  return {
    question: `一條緞帶長 ${meters} 公尺，${name}做一個蝴蝶結要用 ${perCm} 公分。這條緞帶最多可以做幾個蝴蝶結？`,
    answer,
    unit: '個',
    trap: `${meters} 公尺要先換成 ${totalCm} 公分，不能直接用 ${meters}÷${perCm}。`,
  };
}

// 模板 B：公升 ↔ 毫升（買幾瓶，喝掉幾公升，剩幾毫升）
function templateJuice() {
  const perBottle = pick([250, 500]);           // 每瓶毫升
  const bottles = randInt(3, 6);                // 買幾瓶
  const totalMl = perBottle * bottles;
  const drinkL = randInt(1, Math.floor(totalMl / 1000)); // 喝掉幾「公升」（整數，且不超過總量）
  const answer = totalMl - drinkL * 1000;
  if (answer <= 0) return null;                  // 要剩下正的量
  const name = pick(NAMES);
  return {
    question: `一瓶果汁 ${perBottle} 毫升。${name}家買了 ${bottles} 瓶，全家喝掉 ${drinkL} 公升，還剩下多少毫升？`,
    answer,
    unit: '毫升',
    trap: `喝掉的量用「公升」，要換成 ${drinkL * 1000} 毫升再減；剩下用「毫升」回答。`,
  };
}

// 模板 C：分 ↔ 秒（跑步誰比較快、快幾秒）
function templateRace() {
  const nameA = pick(NAMES);
  let nameB = pick(NAMES);
  while (nameB === nameA) nameB = pick(NAMES);
  const minA = randInt(1, 2);
  const secA = randInt(5, 55);
  const totalA = minA * 60 + secA;              // A 用「幾分幾秒」表示
  // B 用純秒表示，且和 A 不相等（才有快慢差）
  let totalB = randInt(70, 175);
  if (totalB === totalA) return null;
  const secOfA = secA;
  const faster = totalA < totalB ? nameA : nameB;
  const diff = Math.abs(totalA - totalB);
  return {
    question: `運動會上，${nameA}跑了 ${minA} 分 ${secOfA} 秒，${nameB}跑了 ${totalB} 秒。誰跑得比較快？快了幾秒？`,
    answer: `${faster}比較快，快 ${diff} 秒`,
    unit: '',
    trap: `${minA} 分 ${secOfA} 秒要換成 ${totalA} 秒再比；時間短的才是跑得快。`,
  };
}

const TEMPLATES = [templateRibbon, templateJuice, templateRace];

// 產生一題（自動重抽直到合格）
function genOne() {
  for (let tries = 0; tries < 50; tries++) {
    const q = pick(TEMPLATES)();
    if (q) return q;
  }
  throw new Error('連續 50 次都抽不到合格題目，請檢查模板範圍。');
}

// ---- 主程式：印出 N 題 ----
const N = parseInt(process.argv[2] ?? '10', 10);

console.log('======================================');
console.log('        我愛陷阱題 — 單位陷阱 (⑤)');
console.log(`        隨機產生 ${N} 題（附答案與陷阱解析）`);
console.log('======================================\n');

for (let i = 1; i <= N; i++) {
  const q = genOne();
  console.log(`第 ${i} 題`);
  console.log(`  ${q.question}`);
  console.log(`  ✅ 答案：${q.answer}${q.unit}`);
  console.log(`  ⚠️ 陷阱：${q.trap}`);
  console.log('');
}
