const IPFS = require('ipfs');
const multiaddr = require('multiaddr')
const fs = require('fs');
const uuid = require('uuid')

class StorageLayer{

  constructor(cb){
    this.startIPFS(cb)
  }

  async startIPFS(cb){
    const phwoopIpfs = multiaddr('/ip4/13.238.211.99/tcp/4001/p2p/QmTaWkVWou67eTdhh2FnwEb5jtoTPWiFTQt437sw8PVfZX')
    this.node = await IPFS.create();
    this.node.swarm.connect(phwoopIpfs)
    this.version = await this.node.version()

    console.log('IPFS Version: ', this.version.version)
    cb()
  }
  
  lsPins(){
   async function ls(node){
      for await (const {cid, type} of node.pin.ls()){
        console.log({cid, type})
      }
   }
    ls(this.node)
  }

  pin(_cid){
    async function _pin(node, cid){
      console.log("Pinning: ", cid)
      node.pin.add(cid).then((pinnedcid) => {
        console.log("PINNED", pinnedcid)
      })
    }
    _pin(this.node, _cid)
  }

  addFile(path, cb){
    const info = fs.readFileSync(path);
    this.add(uuid.v4(), info)
  }

  add(path, content){
    this.node.add({
      path: path, 
      content: content 
    }).then((r) => {
      console.log(r)
    }).catch((r) => {
      console.log(r)
    })  
  }
}

module.exports = (cb) => {
  return new StorageLayer(cb)
}

