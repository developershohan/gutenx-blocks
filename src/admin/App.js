/**
 * GutenX Blocks — Admin App Root
 *
 * Main React component for the admin dashboard SPA.
 *
 * @package GutenX_Blocks
 */

import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { STORE_NAME } from './store';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import BlockGrid from './components/BlockGrid';
import SaveBar from './components/SaveBar';

/**
 * App component — Root admin dashboard.
 *
 * @return {JSX.Element} The admin dashboard UI.
 */
const App = () => {
	const { fetchSettings, setError, setNotice } = useDispatch( STORE_NAME );
	const { error, notice } = useSelect( ( select ) => ( {
		error: select( STORE_NAME ).getError(),
		notice: select( STORE_NAME ).getNotice(),
	} ) );

	// Fetch settings on mount.
	useEffect( () => {
		fetchSettings();
	}, [] );

	// Auto-dismiss notices after 3 seconds.
	useEffect( () => {
		if ( notice ) {
			const timer = setTimeout( () => setNotice( null ), 3000 );
			return () => clearTimeout( timer );
		}
	}, [ notice ] );

	useEffect( () => {
		if ( error ) {
			const timer = setTimeout( () => setError( null ), 5000 );
			return () => clearTimeout( timer );
		}
	}, [ error ] );

	return (
		<div className="gutenx-admin">
			<Header />

			{ /* Notice Bar */ }
			{ notice && (
				<div className="gutenx-notice gutenx-notice--success">
					<span>{ notice }</span>
					<button
						type="button"
						className="gutenx-notice__dismiss"
						onClick={ () => setNotice( null ) }
						aria-label={ __( 'Dismiss notice', 'gutenx-blocks' ) }
					>
						✕
					</button>
				</div>
			) }

			{ error && (
				<div className="gutenx-notice gutenx-notice--error">
					<span>{ error }</span>
					<button
						type="button"
						className="gutenx-notice__dismiss"
						onClick={ () => setError( null ) }
						aria-label={ __( 'Dismiss error', 'gutenx-blocks' ) }
					>
						✕
					</button>
				</div>
			) }

			<div className="gutenx-admin__content">
				<DashboardStats />
				<BlockGrid />
			</div>

			<SaveBar />
		</div>
	);
};

export default App;
