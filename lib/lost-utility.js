var newBlock = require('./new-block.js');

/**
 * lost-utility: A general utility toolbelt for Lost. Included are mixins
 * that require no additional input other than being called.
 *
 * @param {string} [edit|clearfix] - The mixin to create.
 *
 * @example
 *   body {
 *     lost-utility: edit;
 *   }
 *
 * @example
 *   body {
 *     lost-utility: edit rgb(33,44,55);
 *   }
 *
 * @example
 *   body {
 *     lost-utility: overlay 1200px 12 30px 10px rgb(33,44,55);
 *   }
 *
 * @example
 *   .parent {
 *     lost-utility: clearfix;
 *   }
 *   .child {
 *     lost-column: 1/2;
 *   }
 */

function getColorValue(string) {
  var color = string.split('rgb(')[1];
  color = color.split(')')[0];
  return color;
}

module.exports = function lostUtilityDecl(css) {
  css.walkDecls('lost-utility', function lostUtilityDeclFunction(decl) {
    var utilityArray = decl.value.split(' ');
    var utility = utilityArray[0];
    var color;

    if (utility === 'edit') {
      if (utilityArray[1]) {
        color = getColorValue(decl.value);

        newBlock(
          decl,
          ' *:not(input):not(textarea):not(select)',
          ['background-color'],
          ['rgba(' + color + ', 0.1)']
        );
      } else {
        newBlock(
          decl,
          ' *:not(input):not(textarea):not(select)',
          ['background-color'],
          ['rgba(0, 0, 255, 0.1)']
        );
      }
    }

    if (utility === 'overlay') {
      var maxWidth = utilityArray[1] || '1200px',
        numCols = utilityArray[2] || 12,
        padding = utilityArray[3] || '30px',
        gutter = utilityArray[4] || '10px',
        actualWidth = 'calc(' + maxWidth + ' - ( 2 * ' + padding + '))',
        colWidth = 'calc( (' + actualWidth + ' + ' + gutter + ') / ' + numCols + ')',
        color = (utilityArray[5]) ? getColorValue(getColorValue(decl.value)) : '255, 0, 0',
        gradient = '';

        for(var i=0; i < numCols; i++){
          var x1 = 'calc( ' + colWidth + ' * ' + i + ' )',
            x2 = 'calc( ( ' + colWidth + ' * ' + (i + 1) + ' ) - ' + gutter + ')',
            x3 = 'calc( ' + colWidth + ' * ' + (i + 1) + ' )';
          if(i === 0){
              gradient += 'rgba(' + color + ', 0.1) ' + x2 + ', rgba(' + color + ', 0) ' + x2 + ', rgba(' + color + ', 0) ' + x3 + ',';
          }else if(i >= (numCols - 1)){
              gradient += 'rgba(' + color + ', 0.1) ' + x1;
          }else{
              gradient += 'rgba(' + color + ', 0.1) ' + x1 + ', rgba(' + color + ', 0.1) ' + x2 + ', rgba(' + color + ', 0) ' + x2 + ', rgba(' + color + ', 0) ' + x3 + ',';
          }
        }

        newBlock(
          decl,
          '::after',
          ['content', 'position', 'top', 'left', 'height', 'width', 'pointer-events', 'background-image', 'background-size', 'background-repeat', 'background-position', 'background-attachment'],
          ['""', 'fixed', 0, 0, '100%', '100%', 'none', 'linear-gradient(90deg, ' + gradient + ')', actualWidth + ' 1px', 'repeat-y', 'center', 'fixed']
        );
    }

    if (utility === 'clearfix') {
      newBlock(
        decl,
        ':after',
        ['content', 'display', 'clear'],
        ['\'\'', 'table', 'both']
      );

      newBlock(
        decl,
        ':before',
        ['content', 'display'],
        ['\'\'', 'table']
      );
    }

    if (decl.parent.nodes.length === 1) {
      decl.parent.remove();
    } else {
      decl.remove();
    }
  });
};
