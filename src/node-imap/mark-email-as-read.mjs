import { getImap } from "./imap.mjs";

async function markEmailAsRead (id) {
  const imap = await getImap()  
  await imap.addFlagsAsync(id, [
    'SEEN'
  ])
  imap.end()
}

markEmailAsRead(5)
.then(data => {
  console.log(data);
})
.catch(error => {
  console.log(error);
})