'use strict'

const { compose, applyMiddleware, createStore } = require('redux')
const { persistStore, autoRehydrate } = require('redux-persist')

const metaSync = require('./metaSync')
const reducers = require('../reducers')

// Enhance the store with third-party capabilities
const enhancers = compose(
	autoRehydrate(),
	applyMiddleware(metaSync)
)

// Reducers to persist
const whitelist = [
	'currentComponent',
	'currentTab'
]

// Create the store
module.exports = (state, next) => {

	const store = createStore(reducers, state, enhancers)

	// Begin periodically persisting the store
	persistStore(store, { whitelist }, () => {

		// Rehydration complete
		next(null, store)

	})

}