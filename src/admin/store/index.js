/**
 * GutenX Blocks — Admin Data Store
 *
 * @wordpress/data store for managing block settings state.
 * Store name: gutenx/settings
 *
 * @package GutenX_Blocks
 */

import { createReduxStore, register } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

// Store name constant.
const STORE_NAME = 'gutenx/settings';

// Default state.
const DEFAULT_STATE = {
	blocks: {},
	isLoading: false,
	isSaving: false,
	error: null,
	notice: null,
};

// Action types.
const SET_BLOCKS = 'SET_BLOCKS';
const TOGGLE_BLOCK = 'TOGGLE_BLOCK';
const SET_LOADING = 'SET_LOADING';
const SET_SAVING = 'SET_SAVING';
const SET_ERROR = 'SET_ERROR';
const SET_NOTICE = 'SET_NOTICE';

/**
 * Reducer — handles state changes based on dispatched actions.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} New state.
 */
const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case SET_BLOCKS:
			return { ...state, blocks: action.blocks };
		case TOGGLE_BLOCK:
			return {
				...state,
				blocks: {
					...state.blocks,
					[ action.slug ]: ! state.blocks[ action.slug ],
				},
			};
		case SET_LOADING:
			return { ...state, isLoading: action.isLoading };
		case SET_SAVING:
			return { ...state, isSaving: action.isSaving };
		case SET_ERROR:
			return { ...state, error: action.error };
		case SET_NOTICE:
			return { ...state, notice: action.notice };
		default:
			return state;
	}
};

/**
 * Action creators.
 */
const actions = {
	setBlocks( blocks ) {
		return { type: SET_BLOCKS, blocks };
	},
	toggleBlock( slug ) {
		return { type: TOGGLE_BLOCK, slug };
	},
	setLoading( isLoading ) {
		return { type: SET_LOADING, isLoading };
	},
	setSaving( isSaving ) {
		return { type: SET_SAVING, isSaving };
	},
	setError( error ) {
		return { type: SET_ERROR, error };
	},
	setNotice( notice ) {
		return { type: SET_NOTICE, notice };
	},

	/**
	 * Thunk: Fetch settings from REST API.
	 */
	fetchSettings() {
		return async ( { dispatch } ) => {
			dispatch.setLoading( true );
			dispatch.setError( null );

			try {
				const response = await apiFetch( {
					path: '/gutenx/v1/settings',
					headers: {
						'X-WP-Nonce': window.gutenxAdminData?.nonce || '',
					},
				} );

				if ( response?.blocks ) {
					dispatch.setBlocks( response.blocks );
				}
			} catch ( err ) {
				dispatch.setError(
					err?.message || 'Failed to load settings.'
				);
			} finally {
				dispatch.setLoading( false );
			}
		};
	},

	/**
	 * Thunk: Save settings to REST API.
	 *
	 * @param {Object} blocks Block states to save.
	 */
	saveSettings( blocks ) {
		return async ( { dispatch } ) => {
			dispatch.setSaving( true );
			dispatch.setError( null );
			dispatch.setNotice( null );

			try {
				const response = await apiFetch( {
					path: '/gutenx/v1/settings',
					method: 'POST',
					headers: {
						'X-WP-Nonce': window.gutenxAdminData?.nonce || '',
					},
					data: { blocks },
				} );

				if ( response?.success ) {
					dispatch.setNotice( 'Settings saved successfully! ✅' );
					if ( response?.saved ) {
						dispatch.setBlocks( response.saved );
					}
				} else {
					dispatch.setError( 'Failed to save. Please try again.' );
				}
			} catch ( err ) {
				dispatch.setError(
					err?.message || 'Failed to save. Please try again.'
				);
			} finally {
				dispatch.setSaving( false );
			}
		};
	},
};

/**
 * Selectors — read state values.
 */
const selectors = {
	getBlocks( state ) {
		return state.blocks;
	},
	isBlockEnabled( state, slug ) {
		return !! state.blocks[ slug ];
	},
	getIsLoading( state ) {
		return state.isLoading;
	},
	getIsSaving( state ) {
		return state.isSaving;
	},
	getError( state ) {
		return state.error;
	},
	getNotice( state ) {
		return state.notice;
	},
};

/**
 * Create and register the store.
 */
const store = createReduxStore( STORE_NAME, {
	reducer,
	actions,
	selectors,
} );

register( store );

export default store;
export { STORE_NAME };
