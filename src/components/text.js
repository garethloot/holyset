(() => ({
  name: 'text',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { content } = options;
    const { useText } = B;

    function translateVariable(source) {
      const translations = JSON.parse(localStorage.getItem('translations'));

      const translatedVariable = source.map(element => {
        if (typeof element === 'string') {
          return element.replaceAll(/\[(.*?)\]/g, orig => {
            const keyValue = orig
              .slice(1, -1)
              .trim()
              .split(':');
            if (translations && translations.hasOwnProperty(keyValue[0])) {
              return translations[keyValue[0]];
            } else {
              return keyValue[1] ? keyValue[1] : orig;
            }
          });
        }
        return element;
      });
      return translatedVariable;
    }

    function clickHandler() {
      B.triggerEvent('onClick', useText(content));
    }
    return (
      <div onClick={clickHandler} className={classes.root}>
        {useText(translateVariable(content))}
      </div>
    );
  })(),
  styles: B => theme => {
    const style = new B.Styling(theme);
    return {
      root: {
        color: ({ options: { font, color, override } }) =>
          override ? style.getColor(color) : style.getFontColor(font),
        fontSize: ({ options: { font } }) => style.getFontSize(font),
        fontFamily: ({ options: { font } }) => style.getFontFamily(font),
        fontWeight: ({ options: { font } }) => style.getFontWeight(font),
        textTransform: ({ options: { font } }) => style.getTextTransform(font),
        letterSpacing: ({ options: { font } }) => style.getLetterSpacing(font),
      },
    };
  },
}))();
