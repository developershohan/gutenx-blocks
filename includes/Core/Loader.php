<?php
/**
 * Hook Loader
 *
 * Stores and registers all WordPress actions and filters.
 *
 * @package GutenX_Blocks\Core
 * @since   1.0.0
 */

namespace GutenX_Blocks\Core;

// Security check.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Loader
 *
 * Manages the registration of all hooks (actions and filters)
 * used throughout the plugin.
 *
 * @since 1.0.0
 */
class Loader {

	/**
	 * Array of actions registered with WordPress.
	 *
	 * @var array
	 */
	protected array $actions = array();

	/**
	 * Array of filters registered with WordPress.
	 *
	 * @var array
	 */
	protected array $filters = array();

	/**
	 * Add a new action to the collection.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook          The WordPress hook name.
	 * @param object $component     The object containing the callback method.
	 * @param string $callback      The method name on the component.
	 * @param int    $priority      Hook priority. Default 10.
	 * @param int    $accepted_args Number of accepted arguments. Default 1.
	 *
	 * @return void
	 */
	public function add_action( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->actions = $this->add( $this->actions, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Add a new filter to the collection.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook          The WordPress hook name.
	 * @param object $component     The object containing the callback method.
	 * @param string $callback      The method name on the component.
	 * @param int    $priority      Hook priority. Default 10.
	 * @param int    $accepted_args Number of accepted arguments. Default 1.
	 *
	 * @return void
	 */
	public function add_filter( string $hook, object $component, string $callback, int $priority = 10, int $accepted_args = 1 ): void {
		$this->filters = $this->add( $this->filters, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Utility to add a hook to the internal collection.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $hooks         The current hook collection.
	 * @param string $hook          The WordPress hook name.
	 * @param object $component     The object containing the callback method.
	 * @param string $callback      The method name on the component.
	 * @param int    $priority      Hook priority.
	 * @param int    $accepted_args Number of accepted arguments.
	 *
	 * @return array The updated hook collection.
	 */
	private function add( array $hooks, string $hook, object $component, string $callback, int $priority, int $accepted_args ): array {
		$hooks[] = array(
			'hook'          => $hook,
			'component'     => $component,
			'callback'      => $callback,
			'priority'      => $priority,
			'accepted_args' => $accepted_args,
		);
		return $hooks;
	}

	/**
	 * Register all stored actions and filters with WordPress.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function run(): void {
		foreach ( $this->filters as $hook ) {
			add_filter(
				$hook['hook'],
				array( $hook['component'], $hook['callback'] ),
				$hook['priority'],
				$hook['accepted_args']
			);
		}

		foreach ( $this->actions as $hook ) {
			add_action(
				$hook['hook'],
				array( $hook['component'], $hook['callback'] ),
				$hook['priority'],
				$hook['accepted_args']
			);
		}
	}
}
