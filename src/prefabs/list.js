(() => ({
  name: 'List',
  icon: 'UnorderedListIcon',
  category: 'DATA',
  structure: [
    {
      name: 'list',
      options: [
        {
          type: 'MODEL',
          label: 'Model',
          key: 'modelId',
          value: '',
        },
        {
          type: 'FILTER',
          label: 'Filter',
          key: 'filter',
          value: {},
          configuration: {
            dependsOn: 'modelId',
          },
        },
        {
          type: 'PROPERTY',
          label: 'Property',
          key: 'property',
          value: '',
          configuration: {
            dependsOn: 'modelId',
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
