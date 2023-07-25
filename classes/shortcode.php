<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

if ( ! class_exists( 'RS_Shortcode' ) ) :

class RS_Shortcode {

    // Add a static property to store asset names
    public static $assetNames = array();

    // Initialize the shortcode
    public static function init() {
        add_shortcode( 'rp', array( __CLASS__, 'render' ) );

        // This function will localize the script with the array of asset names
        add_action( 'wp_footer', array( __CLASS__, 'localize_script' ) );
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
        wp_enqueue_script( 'rs_main_js', plugins_url( '/dist/main.min.js', RS_ABSPATH . 'rare-shortcodes.php' ), array(), RS_VERSION, true );

        // Enqueue the main CSS file
        wp_enqueue_style( 'rs_main_css', plugins_url( '/dist/styles.min.css', RS_ABSPATH . 'rare-shortcodes.php' ), array(), RS_VERSION );

        // Add the asset name to the array
        self::$assetNames[] = $atts['name'];

        // Return the HTML for the shortcode
        return '<a href="#" class="rs-link" data-asset-name="' . esc_attr( $atts['name'] ) . '">' . esc_html( $atts['name'] ) . '</a>';
    }

    // This function will localize the script with the array of asset names
    public static function localize_script() {
        wp_localize_script( 'rs_main_js', 'rsData', array(
            'assetNames' => self::$assetNames,
        ));
    }
}

endif;
