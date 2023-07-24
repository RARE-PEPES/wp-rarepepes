# Rare Shortcodes
Contributors: Jeff Ruoss
Donate link: https://wp.jeffruoss.com/
Tags: shortcodes, assets, rare
Requires at least: 5.8
Tested up to: 5.8
Stable tag: 1.0
Requires PHP: 8.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

This is a plugin that creates a shortcode to display rare asset data.

## Prerequisites
The Gulp dev setup works on Node 16.10.0 and not Node 18. 

## Description

This plugin provides a shortcode that you can use to fetch and display data about rare assets.

You can use the shortcode like this:

```html
[rp name="ASSET_NAME"]
```

Replace "ASSET_NAME" with the name of the asset you want to display data for.

When you hover over the link that the shortcode generates, it will display a tooltip with data fetched from the API.

## Installation

1. Upload the plugin files to the `/wp-content/plugins/rare-shortcodes` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.

## Changelog

= 1.0 =
* Initial release
