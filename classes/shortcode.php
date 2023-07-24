<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

if ( ! class_exists( 'RS_Shortcode' ) ) :

class RS_Shortcode {

    // Initialize the shortcode
    public static function init() {
        add_shortcode( 'rp', array( __CLASS__, 'render' ) );
    }

    // Render the shortcode
    public static function render( $atts ) {
        $atts = shortcode_atts( array(
            'name' => '',
        ), $atts, 'rp' );

        if ( ! $atts['name'] ) {
            return '';
        }

        // Enqueue the main JS file
        wp_enqueue_script( 'rs_main_js', plugins_url( '/assets/main.js', RS_ABSPATH . 'rare-shortcodes.php' ), array(), RS_VERSION, true );

        // Localize the script with the shortcode data
        wp_localize_script( 'rs_main_js', 'rsData', array(
            'assetName' => $atts['name'],
        ) );

        // Return the HTML for the shortcode
        return '<a href="#" class="rs-link" data-asset-name="' . esc_attr( $atts['name'] ) . '">View Details</a>';
    }
}

endif;
