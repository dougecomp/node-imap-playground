import fs from 'node:fs'

import { simpleParser } from 'mailparser'

import { getImap } from './imap.mjs'

const criteria = [
  'UNSEEN',
  ['SINCE', new Date()]
]
const fetchOptions = {
  bodies: ''
}

function isLastEmailWasRead (ids, emailsRead) {
  return ids.length === emailsRead.length
}

async function loadEmails () {
  const imap = await getImap()
  const emailsRead = []
  return new Promise(async (resolve, reject) => {
    try {
      const ids = await imap.searchAsync(criteria)
        for (const id of ids) {
          const foundMessage = imap.fetch(id, fetchOptions)
          foundMessage.on('message', (message) => {
            message.on('body', async (stream) => {
              console.log('🚀 ~ file: read-emails.mjs:18 ~ message.on', 'Received body event')
              const emailMessage = await simpleParser(stream)
              console.log('🚀 ~ file: read-emails.mjs:22 ~ message.on ~ emailMessage.from', emailMessage.from)
              console.log('🚀 ~ file: read-emails.mjs:23 ~ message.on ~ emailMessage.to', emailMessage.to)
              emailsRead.push({
                id,
                from: {
                  address: emailMessage.from.value[0].address,
                  name: emailMessage.from.value[0].name,
                },
                to: {
                  address: emailMessage.to.value[0].address,
                  name: emailMessage.to.value[0].name,
                },
                subject: emailMessage.subject,
                body: emailMessage.html || emailMessage.textAsHtml
              })
              if (isLastEmailWasRead(ids, emailsRead)) imap.end()
            })
          })
          foundMessage.on('error', (error) => {
            console.log(error);
            reject(error)
          })
        }
      
      imap.once('error', function(error) {
        console.log(error);
        reject(error)
      });
       
      imap.once('end', function() {
        console.log('Connection ended');
        resolve(emailsRead)
      });
    } catch (error) {
      console.log('an error occurred' + error);
      reject(error)
    }
  })
}

loadEmails()
.then(data => {
  fs.writeFileSync('example-result-read-emails.json', JSON.stringify(data))
})
.catch(error => {
  console.log(error);
})