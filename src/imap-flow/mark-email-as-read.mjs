import { getImap } from "./imap.mjs";

async function markEmailAsRead (id) {
  const connection = await getImap()
  const lock = await connection.getMailboxLock('INBOX')
  
  await connection.messageFlagsAdd(id, ['\\Seen'])
  lock.release()

  await connection.logout()
}

markEmailAsRead([5])
.then(() => {
  console.log('Email marked as read');
})
.catch((error) => {
  console.log("🚀 ~ file: mark-email-as-read.mjs:23 ~ error", error)
})