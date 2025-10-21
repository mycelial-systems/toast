import Debug from '@substrate-system/debug'
const debug = Debug('toast')

export type ToastVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger'

// for document.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'substrate-toast': SubstrateToast
    }
}

export class SubstrateToast extends HTMLElement {
    static observedAttributes = ['open', 'variant', 'closable', 'duration']

    private _open = false
    private _variant:ToastVariant = 'neutral'
    private _closable = false
    private _duration = Infinity
    private _timeoutId:number|null = null
    private _container:HTMLDivElement|null = null
    private _closeButton:HTMLButtonElement|null = null

    constructor () {
        super()
        this._open = this.hasAttribute('open')
        this._variant = (this.getAttribute('variant') as ToastVariant) || 'neutral'
        this._closable = this.hasAttribute('closable')
        const duration = this.getAttribute('duration')
        this._duration = duration ? parseInt(duration, 10) : Infinity
    }

    connectedCallback () {
        debug('connected')
        this.render()

        if (this._open) {
            // Trigger show animation
            requestAnimationFrame(() => {
                this._container?.classList.add('toast--visible')
                this.dispatchEvent(new CustomEvent('toast-show'))

                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('toast-after-show'))
                }, 300) // Animation duration
            })
        }

        this._startAutoDismiss()
    }

    disconnectedCallback () {
        debug('disconnected')
        this._clearAutoDismiss()
    }

    /**
     * Handle 'open' attribute changes
     *
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    handleChange_open (oldValue:string|null, newValue:string|null) {
        debug('handling open change', oldValue, newValue)

        if (newValue !== null) {
            this.show()
        } else {
            this.hide()
        }
    }

    /**
     * Handle 'variant' attribute changes
     *
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    handleChange_variant (oldValue:string|null, newValue:string|null) {
        debug('handling variant change', oldValue, newValue)
        this._variant = (newValue as ToastVariant) || 'neutral'
        this.render()
    }

    /**
     * Handle 'closable' attribute changes
     *
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    handleChange_closable (oldValue:string|null, newValue:string|null) {
        debug('handling closable change', oldValue, newValue)
        this._closable = newValue !== null
        this.render()
    }

    /**
     * Handle 'duration' attribute changes
     *
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attribute value
     */
    handleChange_duration (oldValue:string|null, newValue:string|null) {
        debug('handling duration change', oldValue, newValue)
        this._duration = newValue ? parseInt(newValue, 10) : Infinity
        this._clearAutoDismiss()
        this._startAutoDismiss()
    }

    /**
     * Runs when the value of an attribute is changed
     *
     * @param  {string} name     The attribute name
     * @param  {string|null} oldValue The old attribute value
     * @param  {string|null} newValue The new attribute value
     */
    attributeChangedCallback (name:string, oldValue:string|null, newValue:string|null) {
        debug('an attribute changed', name)
        const handler = this[`handleChange_${name}`] as ((oldValue:string|null, newValue:string|null) => void) | undefined
        if (handler) {
            handler.call(this, oldValue, newValue)
        }
    }

    /**
     * Show the toast
     */
    show () {
        if (this._open) return

        this._open = true
        this.dispatchEvent(new CustomEvent('toast-show'))

        if (this._container) {
            this._container.classList.add('toast--visible')
        }

        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('toast-after-show'))
        }, 300) // Animation duration

        this._startAutoDismiss()
    }

    /**
     * Hide the toast
     */
    hide () {
        if (!this._open) return

        this._open = false
        this._clearAutoDismiss()
        this.dispatchEvent(new CustomEvent('toast-hide'))

        if (this._container) {
            this._container.classList.remove('toast--visible')
        }

        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('toast-after-hide'))
            this.removeAttribute('open')
        }, 300) // Animation duration
    }

    /**
     * Start auto-dismiss timer
     */
    private _startAutoDismiss () {
        if (!this._open || this._duration === Infinity) return

        this._clearAutoDismiss()
        this._timeoutId = window.setTimeout(() => {
            this.hide()
        }, this._duration)
    }

    /**
     * Clear auto-dismiss timer
     */
    private _clearAutoDismiss () {
        if (this._timeoutId !== null) {
            clearTimeout(this._timeoutId)
            this._timeoutId = null
        }
    }

    /**
     * Handle close button click
     */
    private _handleClose () {
        this.hide()
    }

    render () {
        const slotContent = Array.from(this.childNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE ||
                           (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))

        this.innerHTML = ''

        this._container = document.createElement('div')
        this._container.className = `toast toast--${this._variant}${this._open ? ' toast--visible' : ''}`
        this._container.setAttribute('role', 'alert')
        this._container.setAttribute('aria-live', 'polite')

        const iconSlot = document.createElement('span')
        iconSlot.className = 'toast__icon'
        iconSlot.innerHTML = this._getDefaultIcon(this._variant)
        this._container.appendChild(iconSlot)

        const content = document.createElement('div')
        content.className = 'toast__content'
        slotContent.forEach(node => content.appendChild(node.cloneNode(true)))
        this._container.appendChild(content)

        if (this._closable) {
            this._closeButton = document.createElement('button')
            this._closeButton.type = 'button'
            this._closeButton.className = 'toast__close'
            this._closeButton.setAttribute('aria-label', 'Close')
            this._closeButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `
            this._closeButton.addEventListener('click', () => this._handleClose())
            this._container.appendChild(this._closeButton)
        }

        this.appendChild(this._container)
    }

    /**
     * Get default icon for variant
     */
    private _getDefaultIcon (variant:ToastVariant):string {
        const icons = {
            primary: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`,
            success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`,
            neutral: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`,
            warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`,
            danger: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`
        }

        return icons[variant] || icons.neutral
    }
}

if ('customElements' in window) {
    customElements.define('substrate-toast', SubstrateToast)
}
