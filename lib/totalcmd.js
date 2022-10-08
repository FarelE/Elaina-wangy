const fs = require('fs')
const toMs = require('ms')
//const allcommand = JSON.parse(fs.readFileSync('./database/allcommand.json'));

global.cmdAdd = function (run, time, _db) {
    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].id === run) {
            position = i
        }
    })
    if (position !== false) {
        _db[position].totalcmd += 1
        global.setDatabase('hitToday.json', JSON.stringify(_db))
    } else {
        const bulin = {
            id: run,
            expired: Date.now() + toMs(time),
            totalcmd: 1,
        }
        _db.push(bulin)
        global.setDatabase('hitToday.json', JSON.stringify(_db))
    }
}

global.expiredCmd = (_dir, db) => {
    setInterval(() => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired && _dir[i].id === 'run') {
                position = i
            }
        })
        if (position !== null) {
            console.log(`Total hit telah di reset`)
            db.length = 0
            global.setDatabase('dashboard.json', JSON.stringify(db))

            _dir.splice(position, 1)
            global.setDatabase('hitToday.json', JSON.stringify(_dir))

            // _dir.length = 0
        }
    }, 2000)
}

global.getHit = function (run, _db) {
    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].id === run) {
            position = i
        }
    })
    if (position !== false) {
        return _db[position].totalcmd
    }
}

//Fitur Autoclear chat
global.addAutoClear = (namenya, waktu, _level) => {
    obj = { id: namenya, expired: Date.now() + toMs(waktu) }
    _level.push(obj)
    global.setDatabase('hitToday.json', JSON.stringify(_level))
}

global.autoClearChat = async (totalchat, xdev, ChatModification, _dir) => {
    // setInterval(() => {
    let position = null
    Object.keys(_dir).forEach((i) => {
        if (Date.now() >= _dir[i].expired && _dir[i].id === 'AutoClearChat') {
            position = i
        }
    })
    if (position !== null) {
        //Copas dari bootstyle
        let chats = xdev.chats
            .all()
            .filter((v) => !v.read_only && v.message)
            .map((v) => v.jid)
        grup = []
        for (let id of chats) {
            if (id.endsWith('g.us')) {
                grup.push(id)
            } else {
                xdev.modifyChat(id, 'delete').catch((_) => _)
            }
        }
        for (let i = 0; i < 1; i++) {
            await xdev
                .modifyChat(grup[i], 'clear', {
                    includeStarred: false,
                })
                .catch((_) => _)
        }

        /* //Fitu buatan gua yg ini
        console.log(`Sukses clear all chat`)
        for ( let i of totalchat){
        xdev.modifyChat(i.jid, ChatModification.delete).catch(_ => _) 
        }
        */
        _dir.splice(position, 1)
        global.setDatabase('hitToday.json', JSON.stringify(_dir))
    }
    //  }, 1000)
}

global.checkAutoClear = function (namenya, claim) {
    let status = false
    Object.keys(claim).forEach((i) => {
        if (claim[i].id === namenya) {
            status = true
        }
    })
    return status
}

//FITUR CLAIM

//Add User Claim
global.addUserClaim = (waktu, jam, pushname, sender, _level) => {
    obj = { name: pushname, id: sender, time: jam, expired: Date.now() + toMs(waktu) }
    _level.push(obj)
    global.setDatabase('claim.json', JSON.stringify(_level))
}

global.expiredClaim = (_dir) => {
    setInterval(() => {
        let position = null
        Object.keys(_dir).forEach((i) => {
            if (Date.now() >= _dir[i].expired) {
                position = i
            }
        })
        if (position !== null) {
            _dir.splice(position, 1)
            global.setDatabase('claim.json', JSON.stringify(_dir))
        }
    }, 2000)
}

global.getClaim = function (id, _db) {
    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].id === id) {
            position = i
        }
    })
    if (position !== false) {
        return _db[position].time
    }
}

global.checkClaim = function (senderNumber, claim) {
    let status = false
    Object.keys(claim).forEach((i) => {
        if (claim[i].id === senderNumber) {
            status = true
        }
    })
    return status
}



global.Succes = function (cmd, _db, allcommand) {
    let index = false
    for (let i of allcommand) {
        if (i == cmd) {
            index = true
        }
    }

    if (index == false) {
        allcommand.push(cmd)
        global.setDatabase('allcommand.json', JSON.stringify(allcommand))
    }

    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].cmd === cmd) {
            position = i
        }
    })
    if (position !== false) {
        _db[position].succes += 1
        global.setDatabase('dashboard.json', JSON.stringify(_db))
    } else {
        const bulin = {
            cmd: cmd,
            succes: 1,
            failed: 0,
        }
        _db.push(bulin)
        global.setDatabase('dashboard.json', JSON.stringify(_db))
    }
}

global.Failed = function (cmd, _db) {
    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].cmd === cmd) {
            position = i
        }
    })
    if (position !== false) {
        _db[position].succes -= 1
        _db[position].failed += 1
        global.setDatabase('dashboard.json', JSON.stringify(_db))
    } else {
        const bulin = {
            cmd: cmd,
            succes: 0,
            failed: 1,
        }
        _db.push(bulin)
        global.setDatabase('dashboard.json', JSON.stringify(_db))
    }
}

global.Nothing = function (cmd, _db, allcommand) {
    allcommand.splice(allcommand.indexOf(cmd), 1)
    global.setDatabase('allcommand.json', JSON.stringify(allcommand))

    Object.keys(_db).forEach((i) => {
        if (_db[i].cmd === cmd) {
            _db.splice(i, 1)
            global.setDatabase('dashboard.json', JSON.stringify(_db))
        }
    })
    return true
}

const { color } = require('../lib/color')
const chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})