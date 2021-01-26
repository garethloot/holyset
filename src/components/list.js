(() => ({
  name: 'list',
  type: 'BODY_COMPONENT',
  allowedTypes: ['BODY_COMPONENT', 'CONTAINER_COMPONENT', 'CONTENT_COMPONENT'],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useAllQuery, useFilter, ModelProvider } = B;
    const { modelId, filter } = options;

    const isDev = env === 'dev';
    const isEmpty = children.length === 0;

    const where = useFilter(filter);

    const { loading, error, data, refetch } =
      modelId &&
      useAllQuery(modelId, {
        rawFilter: where,
      });

    B.defineFunction('Refetch', () => refetch());
    B.defineFunction('SetValue', v => console.log(v));

    function devCanvas() {
      return (
        <div className={classes.root}>
          {isEmpty ? 'Add components' : children}
        </div>
      );
    }

    function Loading() {
      return <div className={classes.root}>Loading</div>;
    }

    function Error() {
      return <div className={classes.root}>Some error: {error.message}</div>;
    }

    function prodCanvas() {
      if (loading) return <Loading />;
      if (error) return <Error />;

      const { totalCount, results } = data;
      return (
        <div className={classes.root}>
          <p>There are: {totalCount} records</p>
          <div>
            {results.map(item => (
              <ModelProvider key={item.id} value={item} id={modelId}>
                {children}
              </ModelProvider>
            ))}
          </div>
        </div>
      );
    }

    return isDev ? devCanvas() : prodCanvas();
  })(),
  styles: B => theme => {
    const style = new B.Styling(theme);
    return {
      root: {},
    };
  },
}))();
