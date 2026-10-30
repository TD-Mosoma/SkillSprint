const DATABASE_NAME = 'skillsprint-cv-storage'
const STORE_NAME = 'cvs'

function openDatabase() {
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('This browser does not support local CV storage.'))
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open local CV storage.'))
  })
}

export async function saveCv(id, file) {
  const database = await openDatabase()
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put({ id, file })
    transaction.oncomplete = resolve
    transaction.onerror = () => reject(transaction.error || new Error('Could not save the CV.'))
    transaction.onabort = () => reject(transaction.error || new Error('CV storage was interrupted.'))
  }).finally(() => database.close())
}

export async function getCv(id) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id)
    request.onsuccess = () => {
      database.close()
      resolve(request.result?.file || null)
    }
    request.onerror = () => {
      database.close()
      reject(request.error || new Error('Could not read the saved CV.'))
    }
  })
}
