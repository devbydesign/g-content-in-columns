import { i18n, components, editor, data } from 'wp';

import './style.scss';

const { __ } = i18n;
const { PanelBody, RangeControl, ToggleControl } = components;
const { InnerBlocks, InspectorControls } = editor;
const { select, dispatch } = data;

export const name = 'content-in-columns';

export const settings = {
  title: __('Content in columns'),
  description: __('Block which contains section with 1-4 columns that could have image, heading, description and button'),
  icon: 'cover-image',

  attributes: {
    columns: {
      type: 'number',
      default: 3
    },
    showImages: {
      type: 'boolean',
      default: true
    },
    circledImages: {
      type: 'boolean',
      default: true
    },
    showButtons: {
      type: 'boolean',
      default: true
    }
  },

  getTemplate(attributes) {
    return [
      [
        'core/heading',
        {
          placeholder: 'Section header',
          content: 'Section header',
          level: 2,
          align: 'center'
        }
      ],
      [
        'cloudblocks/content-in-columns--columns',
        { columns: attributes.columns }
      ]
    ];
  },

  updateInnerBlocks(
    clientId,
    { columns, showImages, circledImages, showButtons }
  ) {
    const blockInstance = select('core/editor').getBlocksByClientId(
      clientId
    )[0];

    if (blockInstance && blockInstance.innerBlocks) {
      const columnsBlockInstance = blockInstance.innerBlocks[1];

      if (columnsBlockInstance && columnsBlockInstance.innerBlocks) {
        dispatch('core/editor').updateBlockAttributes(
          columnsBlockInstance.clientId,
          { columns }
        );

        columnsBlockInstance.innerBlocks.forEach(block => {
          dispatch('core/editor').updateBlockAttributes(block.clientId, {
            showImages,
            circledImages,
            showButtons
          });
        });
      }
    }
  },

  edit({ attributes, className, setAttributes, clientId }) {
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

    settings.updateInnerBlocks(clientId, attributes);

    return [
      <section className={`${className} wp-block-storypage-columns`}>
        <InnerBlocks
          template={settings.getTemplate(attributes)}
          templateLock="all"
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
      </InspectorControls>
    ];
  },

  save({ className }) {
    return (
      <section className={`${className} wp-block-storypage-columns`}>
        <InnerBlocks.Content />
      </section>
    );
  }
};
