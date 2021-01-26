(() => ({
  name: 'Chapter Playlist',
  icon: 'UnorderedListIcon',
  category: 'PLAYER',
  structure: [
    {
      name: 'chapterPlaylist',
      options: [
        {
          type: 'PROPERTY',
          label: 'Chapter ID',
          key: 'chapterId',
          value: '',
        },
        {
          type: 'VARIABLE',
          label: 'Current slug',
          key: 'cSlug',
          value: [''],
        },
        {
          type: 'PROPERTY',
          label: 'Current user',
          key: 'cUser',
          value: '',
        },
        {
          type: 'ACTION',
          label: 'Progress Action',
          key: 'actionId',
          value: '',
          configuration: {
            apiVersion: 'v1',
          },
        },
        {
          value: [],
          label: 'Action properties',
          key: 'actionProperties',
          type: 'ACTION_PROPERTIES',
          configuration: {
            apiVersion: 'v1',
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
