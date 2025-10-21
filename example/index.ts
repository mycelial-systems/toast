import Debug from '@substrate-system/debug'
import { SubstrateToast, VARIANTS } from '../src/index.js'
import '../src/index.css'

window.localStorage.setItem('DEBUG', 'toast')

const qs = document.querySelector.bind(document)
const byId = document.getElementById.bind(document)

const debug = Debug(import.meta.env.DEV)

// @ts-expect-error dev
window.SubstrateToast = SubstrateToast

// Look for buttons
// each button has an ID of the toast variant
VARIANTS.forEach(v => {
    const el = byId(v)
    el?.addEventListener('click', () => {
        const toast = qs<SubstrateToast>(`substrate-toast[${v}]`)
        debug('the toast elelemnt', toast)
        toast?.toast()
    })
})

byId('permatoast')?.addEventListener('click', ev => {
    ev.preventDefault()
    const el = byId('permanent-toast') as SubstrateToast
    el.toast()
})
