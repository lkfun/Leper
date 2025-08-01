import fs from 'fs'
import Config from './src/parser.js'
 import download from './src/utils/download.js'
 import readline from 'readline'


 const configUrl = `https://web.sanguosha.com/10/pc/res/config/Config.sgs`
const fileName = './Config.sgs'

const configer = new Config()
 await download(configUrl, fileName)
 const data = await fs.promises.readFile(fileName)
 configer.ParsePreloadConfig(data)




// const data = await fs.promises.readFile(fileName)
// fs.readFile(fileName, function (err, data) {
//   if (err) throw err
//   configer.ParsePreloadConfig(data)
// })


async function findManagerInstances(filePath) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const pattern = /return\s+([a-zA-Z_$][\w$]*Manager)\.GetInstance\(\);/g;
  const matches = new Set();

  for await (const line of rl) {
    let match;
    while ((match = pattern.exec(line)) !== null) {
      matches.add(match[1]);
    }
  }

  return Array.from(matches);
}

// // 使用示例
// findManagerInstances('1209.txt')
//   .then(results => console.log('找到的管理器:', results))
//   .catch(console.error);

// 开始解压----------
// unZip.js:7
// 解压文件结束------
// unZip.js:19
// Achievement.sgs
// parser.js:125
// ActivityAreaConfig.sgs
// parser.js:125
// ActivityViewConfig.sgs
// parser.js:125
// AdPushConfig.sgs
// parser.js:125
// AloneRideConfig.sgs
// parser.js:125
// AthleticsClientCardConfig.sgs
// parser.js:125
// AthleticsSeasonConf.sgs
// parser.js:125
// AthleticsSeasonRewardConf.sgs
// parser.js:125
// AuctionConfig.sgs
// parser.js:125
// AutoChessConfig.sgs
// parser.js:125
// BattleBgConfig.sgs
// parser.js:125
// BattleOfRelativesConfig.sgs
// parser.js:125
// BattlePassConfig.sgs
// parser.js:125
// BountyRaceConfig.sgs
// parser.js:125
// CalendarConfig.sgs
// parser.js:125
// Cards.sgs
// parser.js:125
// ChatFaceConfig.sgs
// parser.js:125
// ChessGeneralConfig.sgs
// parser.js:125
// CityConfig.sgs
// parser.js:125
// CityUnderSiegeConfig.sgs
// parser.js:125
// ClientHolidayEffectConf.sgs
// parser.js:125
// ClientXiaoShaServiceConf.sgs
// parser.js:125
// CommonActivityConfig.sgs
// parser.js:125
// CustomerCenter.sgs
// parser.js:125