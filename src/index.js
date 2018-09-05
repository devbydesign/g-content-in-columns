import { blocks, data, i18n } from 'wp';

import * as contentInColumns from './content-in-columns';
import * as columns from './content-in-columns/columns';
import * as column from './content-in-columns/column';

const { registerBlockType } = blocks;
const { dispatch, select } = data;
const { __ } = i18n;

// Category name and slug
const category = {
  slug: 'cloudblocks', // needs to match the css class of the block container: ".wp-block-cloudblocks-[block-name]"
  title: __('Gutenberg-Cloud Blocks')
};

// Register the new category and blocks
export function registerBlocks() {
  // Add the new category to the list
  const currentCategories = select('core/blocks')
    .getCategories()
    .filter(item => item.slug !== category.slug);

  dispatch('core/blocks').setCategories([category, ...currentCategories]);

  for ({ name, settings } of [contentInColumns, columns, column]) {
    // Register each block
    registerBlockType(`${category.slug}/${name}`, {
      category: category.slug,
      ...settings
    });
  }
}

registerBlocks();
