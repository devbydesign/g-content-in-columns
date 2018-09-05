import { i18n, editor } from 'wp';

const { __ } = i18n;
const { InnerBlocks } = editor;

const ALLOWED_BLOCKS = ['cloudblocks/content-in-columns--column'];

export const name = 'content-in-columns--columns';

export const settings = {
  title: __('Columns'),
  description: __('Container for columns'),
  parent: ['cloudblocks/content-in-columns'],

  attributes: {
    columns: {
      type: 'number'
    }
  },

  getColumnsTemplate(columns) {
    const columnBlocks = [];
    for (let i = 0; i < columns; i++) {
      columnBlocks.push(['cloudblocks/content-in-columns--column']);
    }
    return columnBlocks;
  },

  edit({ attributes, className }) {
    const { columns } = attributes;

    return [
      <div className={`${className} columns has-${columns}-columns`}>
        <InnerBlocks
          template={settings.getColumnsTemplate(columns)}
          templateLock="all"
          allowedBlocks={ALLOWED_BLOCKS}
        />
      </div>
    ];
  },

  save({ attributes, className }) {
    const { columns } = attributes;

    return (
      <div className={`${className} columns has-${columns}-columns`}>
        <InnerBlocks.Content />
      </div>
    );
  }
};
