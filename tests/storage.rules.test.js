import { test, before, after, describe } from 'node:test'
import { readFileSync } from 'node:fs'
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing'
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage'

let env

const ALICE = 'alice-uid'
const BOB = 'bob-uid'

function bytes(n) {
  return new Uint8Array(n)
}

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-cs8803',
    storage: {
      rules: readFileSync('storage.rules', 'utf8'),
      host: '127.0.0.1',
      port: 9199,
    },
  })
  await env.clearStorage()
})

after(async () => {
  await env?.cleanup()
})

describe('storage.rules', () => {
  test('a user can upload into their own prefix', async () => {
    const s = env.authenticatedContext(ALICE).storage()
    await assertSucceeds(uploadBytes(ref(s, `users/${ALICE}/doc.txt`), bytes(10)))
  })

  test('a user can read their own file', async () => {
    const s = env.authenticatedContext(ALICE).storage()
    await assertSucceeds(getBytes(ref(s, `users/${ALICE}/doc.txt`)))
  })

  test('another user CANNOT read that file, even knowing the exact path', async () => {
    const s = env.authenticatedContext(BOB).storage()
    await assertFails(getBytes(ref(s, `users/${ALICE}/doc.txt`)))
  })

  test('another user CANNOT delete that file', async () => {
    const s = env.authenticatedContext(BOB).storage()
    await assertFails(deleteObject(ref(s, `users/${ALICE}/doc.txt`)))
  })

  test('another user CANNOT write into someone else’s prefix', async () => {
    const s = env.authenticatedContext(BOB).storage()
    await assertFails(uploadBytes(ref(s, `users/${ALICE}/evil.txt`), bytes(10)))
  })

  test('a signed-out visitor CANNOT read', async () => {
    const s = env.unauthenticatedContext().storage()
    await assertFails(getBytes(ref(s, `users/${ALICE}/doc.txt`)))
  })

  test('a signed-out visitor CANNOT upload', async () => {
    const s = env.unauthenticatedContext().storage()
    await assertFails(uploadBytes(ref(s, `users/${ALICE}/anon.txt`), bytes(10)))
  })

  test('uploads at or above the 25 MB cap are rejected', async () => {
    const s = env.authenticatedContext(ALICE).storage()
    await assertFails(uploadBytes(ref(s, `users/${ALICE}/huge.bin`), bytes(25 * 1024 * 1024)))
  })

  test('uploads under the cap are accepted', async () => {
    const s = env.authenticatedContext(ALICE).storage()
    await assertSucceeds(uploadBytes(ref(s, `users/${ALICE}/ok.bin`), bytes(1024)))
  })

  test('paths outside users/{uid}/ are denied by default', async () => {
    const s = env.authenticatedContext(ALICE).storage()
    await assertFails(uploadBytes(ref(s, 'public/anything.txt'), bytes(10)))
  })

  test('a user can delete their own file', async () => {
    const s = env.authenticatedContext(ALICE).storage()
    await assertSucceeds(deleteObject(ref(s, `users/${ALICE}/doc.txt`)))
  })
})
