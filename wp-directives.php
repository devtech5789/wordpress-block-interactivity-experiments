<?php
/**
 * Plugin Name:       wp-directives
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      5.6
 * Author:            Gutenberg Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-directives
 */

/**
 * Register the scripts
 */
function wp_directives_register_scripts()
{
	wp_register_script(
		'wp-directive-vendors',
		plugins_url('build/vendors.js', __FILE__),
		[],
		'1.0.0',
		true
	);
	wp_register_script(
		'wp-directive-runtime',
		plugins_url('build/runtime.js', __FILE__),
		['wp-directive-vendors'],
		'1.0.0',
		true
	);

	// For now we can always enqueue the runtime. We'll figure out how to
	// conditionally enqueue directives later.
	wp_enqueue_script('wp-directive-runtime');
}
add_action('wp_enqueue_scripts', 'wp_directives_register_scripts');

function wp_directives_add_wp_link_attribute($block_content)
{
	$site_url = parse_url(get_site_url());
	$w = new WP_HTML_Tag_Processor($block_content);
	while ($w->next_tag('a')) {
		if ($w->get_attribute('target') === '_blank') {
			break;
		}

		$link = parse_url($w->get_attribute('href'));
		if (!isset($link['host']) || $link['host'] === $site_url['host']) {
			$w->set_attribute('wp-link', 'true');
		}
	}
	return (string) $w;
}
add_filter('render_block', 'wp_directives_add_wp_link_attribute', 10, 2);

function wp_directives_client_site_transitions_meta_tag()
{
	if (apply_filters('client_side_transitions', false)) {
		echo '<meta itemprop="wp-client-side-transitions" content="active">';
	}
}
add_action('wp_head', 'wp_directives_client_site_transitions_meta_tag', 10, 0);

/* User code */
add_filter('client_side_transitions', '__return_true');
