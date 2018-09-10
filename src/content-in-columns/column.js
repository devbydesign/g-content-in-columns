/* eslint react/jsx-key: 0 */

import React from 'react';
import { i18n, editor, data } from 'wp';

const { __ } = i18n;
const { InnerBlocks } = editor;
const { select, dispatch } = data;

const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph', 'core/button'];

export const name = 'content-in-columns--column';

export const settings = {
  title: __('Column'),
  description: __('A single column within a columns block.'),
  icon: 'columns',
  parent: ['cloudblocks/content-in-columns--columns'],

  attributes: {
    showImages: {
      type: 'boolean',
    },
    circledImages: {
      type: 'boolean',
    },
    showButtons: {
      type: 'boolean',
    },
  },

  getTemplate ({ showImages, circledImages, showButtons }) {
    const template = [];
    if (showImages) {
      template.push(['core/image', { className: circledImages ? 'column__image circled' : 'column__image' }]);
    }

    template.push(
      ['core/heading', {
        placeholder: 'Column title',
        content: 'Column Title Here',
        level: 3,
      }],
      ['core/paragraph', {
        placeholder: 'Column description',
        content: 'Some random text here. Make sure to replace this.',
        className: 'column__description',
      }]
    );

    if (showButtons) {
      template.push([ 'core/button', {
        text: 'Learn more',
        url: 'https://github.com/front/gutenberg-js',
        className: 'column__cta',
      }]);
    }

    return template;
  },

  updateInnerBlocks (clientId, { circledImages }) {
    const blockInstance = select('core/editor').getBlocksByClientId(clientId)[0];

    if (blockInstance) {
      const imageBlockInstance = blockInstance.innerBlocks[0];

      if (imageBlockInstance) {
        dispatch('core/editor').updateBlockAttributes(
          imageBlockInstance.clientId,
          {
            className: circledImages ? 'column__image circled' : 'column__image',
          }
        );
      }
    }
  },

  edit ({ attributes, clientId }) {
    settings.updateInnerBlocks(clientId, attributes);

    return (
      <div className="column">
        <InnerBlocks
          template={settings.getTemplate(attributes)}
          templateLock="all"
          allowedBlocks={ALLOWED_BLOCKS}
        />
      </div>
    );
  },

  save () {
    return (
      <div className="column">
        <InnerBlocks.Content />
      </div>
    );
  },
};
