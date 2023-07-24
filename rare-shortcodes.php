<?php
/**
 * Plugin Name: Rare Shortcodes
 * Plugin URI: https://wp.jeffruoss.com/
 * Description: This is a simple plugin that creates a shortcode to display rare asset data.
 * Version: 1.0
 * Author: Jeff Ruoss
 * Author URI: https://zenthree.com/
**/

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

if ( ! class_exists( 'Rare_Shortcodes' ) ) :

class Rare_Shortcodes {

    // Plugin version.
    const VERSION = '1.0.0';

    // Instance of this class.
    protected static $instance = null;

    // Initialize the plugin.
    public function __construct() {
        $this->define_constants();
        $this->includes();
        $this->init_hooks();
    }

    // Define RS Constants.
    private function define_constants() {
        $this->define( 'RS_ABSPATH', dirname( __FILE__ ) . '/' );
        $this->define( 'RS_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
        $this->define( 'RS_VERSION', self::VERSION );
    }

    // Include required core files.
    public function includes() {
        include_once RS_ABSPATH . 'classes/shortcode.php';
    }

    // Hook into actions and filters.
    private function init_hooks() {
        register_activation_hook( __FILE__, array( 'RS_Install', 'install' ) );
        add_action( 'init', array( 'RS_Shortcode', 'init' ) );
    }

    // Define constant if not already set.
    private function define( $name, $value ) {
        if ( ! defined( $name ) ) {
            define( $name, $value );
        }
    }

    // Main RS Instance, ensures only one instance of RS is loaded or can be loaded.
    public static function instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}

endif;

function RS() {
    return Rare_Shortcodes::instance();
}

// Initialize the plugin
RS();
