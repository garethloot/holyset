(() => ({
  name: 'Text comp',
  icon: 'ParagraphIcon',
  category: 'CONTENT',
  structure: [
    {
      name: 'text',
      options: [
        {
          type: 'VARIABLE',
          label: 'Content',
          key: 'content',
          value: ['Hello World'],
        },

        {
          type: 'FONT',
          label: 'Font',
          key: 'font',
          value: 'Title4',
        },
        {
          type: 'TOGGLE',
          label: 'Override',
          key: 'override',
          value: false,
        },
        {
          type: 'COLOR',
          label: 'Color',
          key: 'color',
          value: 'Primary',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'override',
              comparator: 'EQ',
              value: true,
            },
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
