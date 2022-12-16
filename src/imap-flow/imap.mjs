import 'dotenv/config'

import { ImapFlow } from 'imapflow'

export async function getImap () {
  const connection = new ImapFlow({
    host: process.env.MAIL_IMAP_HOST,
    port: process.env.MAIL_IMAP_PORT,
    secure: process.env.MAIL_SECURITY ? true : false,
    auth: {
      user: process.env.MAIL_LOGIN,
      pass: process.env.MAIL_PASSWORD
    },
    logger: false
  })

  await connection.connect()

  return connection
}