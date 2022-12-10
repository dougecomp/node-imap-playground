import { getImap } from "./imap.mjs";

async function markEmailAsRead (id) {
  const imap = await getImap()
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 ~ file: mark-email-as-read.mjs:6 ~ imap.once ~ ", 'ready')
      await imap.addFlagsAsync(id, [
        'SEEN'
      ])
      resolve('ok')
    } catch (error) {
      reject(error)
    } finally {
      imap.end()
    }
  })
}

markEmailAsRead(5)
.then(data => {
  console.log(data);
})
.catch(error => {
  console.log(error);
})