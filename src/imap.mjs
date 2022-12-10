import 'dotenv/config'

import Imap from 'node-imap'
import bluebird from 'bluebird'

export async function getImap () {
  return new Promise((resolve, reject) => {
    const imap = bluebird.promisifyAll(new Imap({
      host: process.env.MAIL_IMAP_HOST,
      port: process.env.MAIL_IMAP_PORT,
      tls: process.env.MAIL_SECURITY ? true : false,
      user: process.env.MAIL_LOGIN,
      password: process.env.MAIL_PASSWORD
    }))
    
    imap.connect()

    imap.once('ready', async () => {
      console.log("🚀 ~ file: imap.mjs:20 ~ imap.once ~ 'ready'")
      await imap.openBoxAsync('INBOX')
      resolve(imap)
    })
  
    imap.on('error', (error) => {
      reject(error)
    })
  })
}