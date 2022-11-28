import 'dotenv/config'

import { promisify } from 'node:util'

import Imap from 'node-imap'
import { simpleParser } from 'mailparser'

function getEmails () {
  try {
    const imap = new Imap({
      host: process.env.MAIL_IMAP_HOST,
      port: process.env.MAIL_IMAP_PORT,
      tls: process.env.MAIL_SECURITY ? true : false,
      user: process.env.MAIL_LOGIN,
      password: process.env.MAIL_PASSWORD
    })
    const openBox = promisify(imap.openBox)
    const search = promisify(imap.search)
    
    imap.once('ready', async () => {
      console.log('ready');
      await openBox('INBOX')
      const ids = await search(['UNSEEN', ['SINCE', new Date(2022, 11, 20)]])
      const foundMessages = imap.fetch(ids)
      foundMessages.on('message', (message) => {
        message.on('body', async (stream) => {
          const {from, to, subject, html, text} = await simpleParser(stream)
          console.log(from, to, subject, html, text);
        })
        message.once('attributes', attributtes => {
          const { uid } = attributtes
        })
      })
      foundMessages.once('end', () => {
        console.log('Done fetching messages');
        imap.end()
      })
    })
    
    imap.once('error', function(err) {
      console.log(err);
    });
     
    imap.once('end', function() {
      console.log('Connection ended');
    });
    
    imap.connect()
  } catch (error) {
    console.log('an error occurred' + error);
  }
}

getEmails()