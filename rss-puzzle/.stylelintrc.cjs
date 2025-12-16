module.exports = {
  root: true,
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-clean-order'],
  rules: {
    'max-nesting-depth': 3,
    'no-descending-specificity': true,
    'order/properties-order': [
      [
        { properties: ['position', 'top', 'right', 'bottom', 'float', 'clear', 'z-index'] },
        {
          properties: ['display',
            'justify-content',
            'align-items',
            'flex-direction',
            'gap',
            'width',
            'max-width',
            'height',
            'margin',
            'margin-bottom',
            'padding',
            'box-sizing',
          ],
        },
        { properties: ['border', 'border-width', 'border-style', 'border-color', 'border-radius', 'box-shadow'] },
        { properties: ['list-style-type', 'overflow', 'overflow-x', 'overflow-y'] },
        { properties: ['font', 'font-size', 'font-weight', 'line-height', 'color', 'text-align'] },
        { properties: ['background', 'background-color', 'text-decoration'] },
        { properties: ['cursor', 'transition', 'animation'] },
      ],
      {
        unspecified: 'bottomAlphabetical',
      },
    ],
  },
};
