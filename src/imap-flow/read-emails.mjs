import { simpleParser } from "mailparser";
import { getImap } from "./imap.mjs";

async function readEmails () {
  const emailsRead = []
  const connection = await getImap()
  const lock = await connection.getMailboxLock('INBOX')
  
  const messages = connection.fetch({
    seen: false
  }, {
    uid: true,
    internalDate: true,
    labels: true,
    envelope: true,
    source: true,
    bodyParts: [],
    bodyStructure: true,
    headers: true
  })
  for await (const message of messages) {
    console.log("🚀 ~ file: read-emails.mjs:14 ~ for await ~ message", message)
    console.log("🚀 ~ file: read-emails.mjs:23 ~ forawait ~ message.headers.toString()", message.headers.toString())
    const body = await simpleParser(message.source)
    emailsRead.push({
      id: message.uid,
      from: {
        name: message.envelope.from[0].name,
        address: message.envelope.from[0].address
      },
      to: {
        name: message.envelope.to[0].name,
        address: message.envelope.to[0].address
      },
      subject: message.envelope.subject,
      body: body.html || body.textAsHtml
    })
  }

  lock.release()
  await connection.logout()

  return emailsRead
}

readEmails()
.then((data) => {
  console.log('e-mails read');
  // console.log("🚀 ~ file: read-emails.mjs:42 ~ .then ~ data", data)
})