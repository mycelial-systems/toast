import { test } from '@substrate-system/tapzero'
import { waitFor, click, sleep } from '@substrate-system/dom'
import { type SubstrateToast } from '../src/index.js'
import '../src/index.js'

// ============================================================================
// Basic Rendering Tests
// ============================================================================

test('should render toast with SVG icon', async t => {
    clearToasts()
    document.body.innerHTML += `
        <substrate-toast timeout="5000" open>
            Test message
        </substrate-toast>
    `

    const el = await waitFor('substrate-toast svg')
    t.ok(el, 'Should find the inner svg icon')
})

test('should render all variant types correctly', async t => {
    clearToasts()
    const variants = ['primary', 'success', 'neutral', 'warning', 'danger']

    for (const variant of variants) {
        clearToasts()
        document.body.innerHTML =
            `<substrate-toast ${variant} open></substrate-toast>`
        const toast = await waitFor('substrate-toast')
        const container = toast?.querySelector(`.toast-${variant}`)
        t.ok(container, `Should have toast-${variant} class`)
    }
})

test('should render content from innerHTML', async t => {
    clearToasts()
    document.body.innerHTML = `
        <substrate-toast open>
            <strong>Bold text</strong> and normal text
        </substrate-toast>
    `

    const content = await waitFor('.toast-content')
    const strong = content?.querySelector('strong')
    t.ok(strong, 'Should preserve HTML content')
    t.equal(strong?.textContent, 'Bold text',
        'Should have correct text content')
})

// ============================================================================
// Attribute Tests
// ============================================================================

test('should have timeout attribute', async t => {
    clearToasts()
    document.body.innerHTML = `
        <substrate-toast timeout="500" open>
            Quick message
        </substrate-toast>
    `

    const toast = (await waitFor('substrate-toast'))! as SubstrateToast
    t.ok(toast, 'Toast should exist')
    t.equal(toast.getAttribute('timeout'), '500',
        'Should have timeout attribute')
})

test('should show close button when closable', async t => {
    clearToasts()
    document.body.innerHTML = `
        <substrate-toast closable open>
            Closable message
        </substrate-toast>
    `

    const closeButton = await waitFor('.toast-close')
    t.ok(closeButton, 'Should render close button')
})

test('should not show close button by default', async t => {
    clearToasts()
    document.body.innerHTML = `
        <substrate-toast open>
            Not closable
        </substrate-toast>
    `

    await waitFor('substrate-toast')
    const closeButton = document.querySelector('.toast-close')
    t.ok(!closeButton, 'Should not render close button')
})

// ============================================================================
// Interaction Tests
// ============================================================================

test('clicking close button should call hide', async t => {
    clearToasts()

    document.body.innerHTML = `
        <substrate-toast closable open timeout="0">
            Click to close
        </substrate-toast>
    `

    const toast = await waitFor('substrate-toast') as SubstrateToast
    t.ok(toast, 'Toast should exist')

    // Manually make it visible for testing
    toast.classList.add('toast-visible')

    // Click close button
    const closeButton = document.querySelector('.toast-close')! as HTMLElement
    t.ok(closeButton, 'Close button should exist')
    await click(closeButton)

    // Wait for hide animation
    await sleep(100)

    t.ok(!toast.classList.contains('toast-visible'),
        'Should not have visible class after close')
})

test('programmatic hide() should work', async t => {
    clearToasts()
    document.body.innerHTML = `
        <substrate-toast open timeout="0">
            Test message
        </substrate-toast>
    `

    const toast = await waitFor('substrate-toast') as SubstrateToast
    // Manually set visible for testing
    toast.classList.add('toast-visible')

    t.ok(toast.classList.contains('toast-visible'),
        'Should be visible initially')

    // Call hide programmatically
    toast.hide()

    t.ok(!toast.classList.contains('toast-visible'),
        'Should immediately remove visible class')
})

test('programmatic toast() method exists', async t => {
    clearToasts()
    document.body.innerHTML = `
        <substrate-toast timeout="0">
            Manual toast
        </substrate-toast>
    `

    const toast = await waitFor('substrate-toast') as SubstrateToast
    t.ok(toast, 'Toast should exist')
    t.equal(typeof toast.toast, 'function',
        'Should have toast() method')
    t.equal(typeof toast.hide, 'function',
        'Should have hide() method')
})

// ============================================================================
// Event Tests
// ============================================================================

test('should support custom event listeners', async t => {
    clearToasts()
    t.plan(3)

    document.body.innerHTML = `
        <substrate-toast success open timeout="0">
            Success message
        </substrate-toast>
    `

    const toast = await waitFor('substrate-toast') as SubstrateToast
    t.ok(toast, 'Toast should exist')

    let showEventFired = false
    toast.addEventListener('substrate-toast:show', ((e: CustomEvent) => {
        showEventFired = true
        t.equal(e.detail.variant, 'success',
            'Should emit show event with correct variant')
    }) as EventListener)

    // Manually trigger _showToast to test event
    ;(toast as any)._showToast()
    await sleep(10)
    t.ok(showEventFired, 'Show event should have fired')
})

test('should have warning variant', async t => {
    clearToasts()

    document.body.innerHTML = `
        <substrate-toast warning open timeout="500">
            Warning message
        </substrate-toast>
    `

    const toast = await waitFor('substrate-toast') as SubstrateToast
    t.ok(toast, 'Toast should exist')
    t.ok(toast.hasAttribute('warning'), 'Should have warning attribute')
})

// ============================================================================
// Queue Tests
// ============================================================================

test('should create multiple toasts', async t => {
    clearToasts()

    document.body.innerHTML = `
        <substrate-toast id="toast1" open timeout="300">
            First
        </substrate-toast>
        <substrate-toast id="toast2" open timeout="300">
            Second
        </substrate-toast>
        <substrate-toast id="toast3" open timeout="300">
            Third
        </substrate-toast>
    `

    await waitFor('substrate-toast')

    const toast1 = document.getElementById('toast1')
    const toast2 = document.getElementById('toast2')
    const toast3 = document.getElementById('toast3')

    t.ok(toast1, 'First toast should exist')
    t.ok(toast2, 'Second toast should exist')
    t.ok(toast3, 'Third toast should exist')
})

test('should have toast and hide methods', async t => {
    clearToasts()

    document.body.innerHTML = `
        <substrate-toast class="t1" open timeout="0">
            Toast 1
        </substrate-toast>
    `

    const toast = await waitFor('substrate-toast') as SubstrateToast
    t.ok(typeof toast.toast === 'function',
        'Should have toast method')
    t.ok(typeof toast.hide === 'function',
        'Should have hide method')
})

// ============================================================================
// Accessibility Tests
// ============================================================================

test('should have correct ARIA attributes', async t => {
    clearToasts()
    document.body.innerHTML = `
        <substrate-toast open>
            Accessible message
        </substrate-toast>
    `

    const container = await waitFor('.toast')
    t.equal(container?.getAttribute('role'), 'status',
        'Should have role="status"')
    t.equal(container?.getAttribute('aria-live'), 'polite',
        'Should have aria-live="polite"')
    t.equal(container?.getAttribute('aria-atomic'), 'true',
        'Should have aria-atomic="true"')
})

// ============================================================================
// Cleanup
// ============================================================================

test('all done', () => {
    clearToasts()
    // @ts-expect-error test env
    window.testsFinished = true
})

// Helper to clear DOM between tests
function clearToasts () {
    document.querySelectorAll('substrate-toast').forEach(el => el.remove())
}
