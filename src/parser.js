import zlib from 'zlib'
// import Byte from './utils/Byte.js'
import CtrUtil from './utils/CtrUtil.js'
// import { gunzipSync } from './utils/zlib.cjs'
import fs from 'fs'
import unZip from './utils/unZip.js' 
import sqlite3 from 'sqlite3';
import {pinyin} from 'pinyin-pro'



export default class Config {
  constructor() {
    this.initConfigerList()
    CtrUtil.Init()
    try {
      fs.mkdirSync('./dist/config', { recursive: true })
    } catch (error) {
      console.error('创建目录失败:', error)
    }
  }

  preloadConfigerList = []
  initConfigerList() {
    this.preloadConfigerList.length = 0
    this.preloadConfigerList = ['Cards','GeneralCards','GeneralSkinInfoConfig','GeneralSkinSuitConfig','GameSoundConfig','GameRuleConfig','GameGeneralConfig','GameModeConfig','GameSpriteConfig']//, 'ff_exchange_new', 'ff_dbs_lottery_new', 'sys_treasure_chest']
  }

  ParsePreloadConfig(data) {
    unZip(data, this, function (zipFiles) {
      this.zipFiles = zipFiles

      if (this.zipFiles && this.zipFiles.length) {
        this.parseConfig()
      } else {
        console.log('解压Config.sgs异常')
      }
    })
  }

  configLen = 0
  parseIndex = 0
  workerList = []
  parseConfig() {
    this.configLen = this.preloadConfigerList.length
    this.parseIndex = 0
    let length = (this.configLen = this.preloadConfigerList.length)

    for (let i = 0; i < length; i++) {
      let configName = this.preloadConfigerList[i]
      let data = this.WorkParse(this.getZipConfigData(configName))
      //console.log("data")
      //console.log(data)

      if(configName=="GeneralCards"){
        var GeneralCardsdata=`INSERT OR REPLACE INTO "main"."wujiang"("CharacterId", "Name", "pinyin") VALUES`
        var dataJson=JSON.parse(data)
        var Characterlist=dataJson["Character"]
        for (let j =0;j<Characterlist.length;j++){
          if(Characterlist[j]["Name"]){
            GeneralCardsdata+=` ('${Characterlist[j]["CharacterId"]}', '${Characterlist[j]["Name"]}', '${pinyin(Characterlist[j]["Name"])}'),`
          }
        }
        GeneralCardsdata=GeneralCardsdata.substring(0,GeneralCardsdata.length-1)+";"
        fs.writeFileSync(`./dist/config/${configName}.sql`, GeneralCardsdata)

        // 创建并连接到数据库（如果不存在，将创建一个名为 mydatabase.db 的文件）
        let db = new sqlite3.Database('D:/shenglvdata/NEWSHENGLV.DB.2025', (err) => {
          if (err) {
            console.error('Error opening database ' + err.message);
          } else {
            console.log('Connected to the SQLite database.');
          }
        });

        // 执行 SQL 语句
        db.serialize(() => {
          db.run(GeneralCardsdata);
        });

        // 关闭数据库连接
        db.close((err) => {
          if (err) {
            console.error('Error closing database ' + err.message);
          } else {
            console.log('Closed the database connection.');
          }
        });

      }
      if(configName=="GeneralSkinInfoConfig"){
        var alist=[]
        var dataJson=JSON.parse(data)
        var SkinConflist=dataJson["SkinConf"]
        var ClientAwakeSkinlist=dataJson["ClientAwakeSkin"]
        var SkinSpineConflist=dataJson["SkinSpineConf"]
        for (let i=0;i<SkinConflist.length;i++){
          alist.push(SkinConflist[i]["SkinID"])
        }
        for (let i=0;i<ClientAwakeSkinlist.length;i++){
          alist.push(ClientAwakeSkinlist[i]["SkinID"])
        }
        for (let i=0;i<SkinSpineConflist.length;i++){
          alist.push(SkinSpineConflist[i]["SkinID"])
        }
        fs.writeFileSync(`./dist/config/${configName}.data`, alist.toString())
        console.log(`解析配置${configName}`)
      }
      try {
        fs.writeFileSync(`./dist/config/${configName}.json`, data)
        console.log(`解析配置${configName}`)
      } catch (error) {
        console.log(err)
      }
    }
  }

  getZipConfigData(configName) {
    let name = configName + '.sgs'

    if (this.zipFiles?.length) {
      let len = this.zipFiles.length

      for (let i = 0; i < len; i++) {
        console.log(this.zipFiles[i].name)
        if (this.zipFiles[i].name == name) {
          return this.zipFiles[i].data
        }
      }
    }

    console.log('找不到配置文件：', configName)
    return null
  }



  /**
   *
   * @param {ArrayBuffer} data zip data
   * @returns {string} config data
   */
  WorkParse(data) {
    if (!data || !(data instanceof ArrayBuffer)) {
      console.log('配置解析出错：')
      return ''
    }

    if (!this.crypt) this.crypt = CtrUtil.Ctr

    let baseData = this.crypt.Ofb_Dec(data)
    // let plain = gunzipSync(baseData)
    let plain = zlib.gunzipSync(Buffer.from(baseData))
    // const arrayBuffer = plain.buffer.slice(plain.byteOffset, plain.byteOffset + plain.byteLength)

    // let temp = new Byte()
    // temp.endian = Byte.LITTLE_ENDIAN
    // temp.writeArrayBuffer(arrayBuffer)
    // temp.pos = 0
    // let res = temp.readUTFBytes()
    const dec = new TextDecoder()
    let res = dec.decode(plain)
    return res
  }
}
