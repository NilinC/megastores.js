'use strict';

const BaseStore = require('./../common/store');

class Store extends BaseStore {

    /**
     * @param name
     * @param initialState
     * @param options
     */
    constructor (name, intialState = [], options = {}) {
        super(name, intialState, options);

        this.cache = [];
	// Enable caching items when connection with server lost
	this.enableSynchronize = options.enableSynchronize || true;

        if (!!this.options.offline) {
            this.enableOfflineMode();
        }
    }

    /**
     * Enable offline, no interaction with server
     */
    enableOfflineMode () {
        // merge initialState with local storage state
        let offlineState = JSON.parse(localStorage.getItem(`state_${this.name}`));
        if (!!offlineState) {
            this.intialState = this.merge(this.intialState, offlineState);
        }

        // Use middleware to update local storage state
        this.use((action, oldstate, newState, next) => {
            localStorage.setItem(`state_${this.name}`, JSON.stringify(newState));
            next(action, oldstate, newState);
        });
    }

    /**
     * Put item or property into state
     * @param item
     */
    put (item) {
        // Cache action if there are no connection
        if (!this.options.offline && !this.store.connected && this.enableSynchronize) {
            this.cache.push({ type: this.ADD_ITEM, payload: item });
        }

        super.put(item);
    }

    /**
     * Update item or property
     * @param index
     * @param item
     */
    update (index, item) {
        // Cache action if there are no connection
        if (!this.options.offline && !this.store.connected && this.enableSynchronize) {
            this.cache.push({ type: this.UPDATE_ITEM, payload: item, index: index });
        }

        super.update(index, item);
    }

    /**
     * Remove item or property
     * @param index
     * @param item
     */
    remove (index, item) {
        // Cache action if there are no connection
        if (!this.options.offline && !this.store.connected && this.enableSynchronize) {
            this.cache.push({ type: this.DELETE_ITEM, payload: item, index: index });
        }

        super.remove(index, item);
    }
}

module.exports = Store;
