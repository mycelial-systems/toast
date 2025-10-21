import { type SubstrateToast } from '../src/index.js'
import '../src/index.css'

const container = document.getElementById('toast-container')

function createToast (
    variant:'primary'|'success'|'neutral'|'warning'|'danger',
    message:string,
    options:{ closable?:boolean, duration?:number } = {}
) {
    const toast = document.createElement('substrate-toast') as SubstrateToast
    toast.setAttribute('variant', variant)
    toast.setAttribute('open', '')

    if (options.closable) {
        toast.setAttribute('closable', '')
    }

    if (options.duration) {
        toast.setAttribute('duration', options.duration.toString())
    }

    toast.innerHTML = `<div>${message}</div>`

    // Remove toast after hide animation completes
    toast.addEventListener('toast-after-hide', () => {
        toast.remove()
    })

    container?.appendChild(toast)
    return toast
}

// Variant buttons
document.getElementById('btn-primary')?.addEventListener('click', () => {
    createToast(
        'primary',
        '<strong>Primary</strong><p>This is a primary toast notification.</p>'
    )
})

document.getElementById('btn-success')?.addEventListener('click', () => {
    createToast(
        'success',
        '<strong>Success!</strong><p>Your changes have been saved successfully.</p>'
    )
})

document.getElementById('btn-warning')?.addEventListener('click', () => {
    createToast(
        'warning',
        '<strong>Warning</strong><p>Please review your input before continuing.</p>'
    )
})

document.getElementById('btn-danger')?.addEventListener('click', () => {
    createToast(
        'danger',
        '<strong>Error</strong><p>Something went wrong. Please try again.</p>'
    )
})

document.getElementById('btn-neutral')?.addEventListener('click', () => {
    createToast(
        'neutral',
        '<strong>Information</strong><p>Here is some neutral information for you.</p>'
    )
})

// Closable buttons
document.getElementById('btn-closable-success')?.addEventListener('click', () => {
    createToast(
        'success',
        '<strong>Closable Success</strong><p>Click the × button to dismiss this toast.</p>',
        { closable: true }
    )
})

document.getElementById('btn-closable-warning')?.addEventListener('click', () => {
    createToast(
        'warning',
        '<strong>Closable Warning</strong><p>You can close this whenever you want.</p>',
        { closable: true }
    )
})

document.getElementById('btn-closable-danger')?.addEventListener('click', () => {
    createToast(
        'danger',
        '<strong>Closable Error</strong><p>Dismiss this error message manually.</p>',
        { closable: true }
    )
})

// Duration buttons
document.getElementById('btn-duration-3s')?.addEventListener('click', () => {
    createToast(
        'primary',
        '<strong>3 Second Toast</strong><p>This will disappear in 3 seconds.</p>',
        { duration: 3000 }
    )
})

document.getElementById('btn-duration-5s')?.addEventListener('click', () => {
    createToast(
        'success',
        '<strong>5 Second Toast</strong><p>This will disappear in 5 seconds.</p>',
        { duration: 5000 }
    )
})

document.getElementById('btn-duration-10s')?.addEventListener('click', () => {
    createToast(
        'warning',
        '<strong>10 Second Toast</strong><p>This will disappear in 10 seconds.</p>',
        { duration: 10000 }
    )
})

// Manual control
const manualToast = document.getElementById('manual-toast') as SubstrateToast

document.getElementById('btn-show-manual')?.addEventListener('click', () => {
    manualToast?.show()
})

document.getElementById('btn-hide-manual')?.addEventListener('click', () => {
    manualToast?.hide()
})

// Event listeners for demonstration
manualToast?.addEventListener('toast-show', () => {
    console.log('Toast is showing')
})

manualToast?.addEventListener('toast-after-show', () => {
    console.log('Toast finished showing')
})

manualToast?.addEventListener('toast-hide', () => {
    console.log('Toast is hiding')
})

manualToast?.addEventListener('toast-after-hide', () => {
    console.log('Toast finished hiding')
})
