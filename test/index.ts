import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <substrate-toast class="test">
        </substrate-toast>
    `

    const el = await waitFor('substrate-toast')

    t.ok(el, 'should find an element')
})
