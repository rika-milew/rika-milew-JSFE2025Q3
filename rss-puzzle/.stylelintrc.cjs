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
        { properties: ['display', 'width', 'height', 'margin', 'padding', 'box-sizing'] },
        { properties: ['border', 'border-width', 'border-style', 'border-color', 'border-radius', 'box-shadow'] },
        { properties: ['list-style-type', 'overflow', 'overflow-x', 'overflow-y'] },
        { properties: ['font', 'font-size', 'line-height', 'color', 'text-align'] },
        { properties: ['background', 'background-color', 'color', 'font', 'font-size', 'line-height', 'text-align', 'text-decoration'] },
        { properties: ['transition', 'animation'] }
      ],
      {
        unspecified: 'bottomAlphabetical'
      }
    ]
  }
};