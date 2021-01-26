(() => ({
  name: 'translations',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    function loadTranslations() {
      if (window.artifact) {
        const app = `https://${window.artifact.applicationIdentifier}.bettywebblocks.com/api/translations`;
        fetch(app)
          .then(response => response.json())
          .then(data =>
            localStorage.setItem('translations', JSON.stringify(data)),
          );
      }
    }

    loadTranslations();
    return <div className={classes.root}>Translations</div>;
  })(),
  styles: B => theme => {
    const style = new B.Styling(theme);
    return {
      root: {},
    };
  },
}))();
