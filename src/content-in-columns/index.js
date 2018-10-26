/* eslint react/jsx-key: 0 */

import React from 'react';
import { i18n, components, editor, data } from 'wp';

import './style.scss';

const { __ } = i18n;
const { PanelBody, RangeControl, ToggleControl } = components;
const { InnerBlocks, InspectorControls } = editor;
const { select, dispatch } = data;

const ALLOWED_BLOCKS = ['cloudblocks/content-in-columns--column'];

function getTemplate (columns) {
  const columnBlocks = [];
  for (let i = 0; i < columns; i++) {
    columnBlocks.push(['cloudblocks/content-in-columns--column']);
  }
  return columnBlocks;
}

function updateInnerBlocks (clientId, { showImages, circledImages, showButtons }) {
  const blockInstance = select('core/editor').getBlocksByClientId(clientId)[0];

  if (blockInstance && blockInstance.innerBlocks) {
    blockInstance.innerBlocks.forEach(block => {
      dispatch('core/editor').updateBlockAttributes(block.clientId, {
        showImages,
        circledImages,
        showButtons,
      });
    });
  }
}


export const name = 'content-in-columns';

export const settings = {
  title: __('Content in columns'),
  description: __('Block which contains section with 1-4 columns that could have image, heading, description and button'),
  icon: 'cover-image',

  attributes: {
    columns: {
      type: 'number',
      default: 3,
    },
    showImages: {
      type: 'boolean',
      default: true,
    },
    circledImages: {
      type: 'boolean',
      default: true,
    },
    showButtons: {
      type: 'boolean',
      default: true,
    },
  },

  edit ({ attributes, className, setAttributes, clientId }) {
    const { columns, showImages, circledImages, showButtons } = attributes;

    const toggleImages = () => setAttributes({ showImages: !showImages });
    const toggleCircledImages = () => setAttributes({ circledImages: !circledImages });
    const toggleButtons = () => setAttributes({ showButtons: !showButtons });

    const changeColumns = value => {
      setAttributes({ columns: value });

      setTimeout(() => {
        dispatch('core/editor').selectBlock(clientId);
      }, 50);
    };

    updateInnerBlocks(clientId, attributes);

    return [
      <section className={`${className}`}>
        <InnerBlocks
          template={getTemplate(columns)}
          templateLock="all"
          allowedBlocks={ALLOWED_BLOCKS}
        />
      </section>,
      <InspectorControls>
        <PanelBody title={__('Block Settings')}>
          <RangeControl
            label={__('Columns count')}
            value={columns}
            onChange={changeColumns}
            min={1}
            max={4}
            step={1}
          />
          <ToggleControl
            label={__('Show images')}
            checked={!!showImages}
            onChange={toggleImages}
          />
          {showImages && (
            <ToggleControl
              label={__('Circled images')}
              checked={!!circledImages}
              onChange={toggleCircledImages}
            />
          )}
          <ToggleControl
            label={__('Show buttons')}
            checked={!!showButtons}
            onChange={toggleButtons}
          />
        </PanelBody>
      </InspectorControls>,
    ];
  },

  save ({ className }) {
    return (
      <section className={`${className}`}>
        <InnerBlocks.Content />
      </section>
    );
  },
};
