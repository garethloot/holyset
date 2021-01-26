(() => ({
  name: 'chapterPlaylist',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { gql } = window;
    const { Query, useProperty, useText, env, useAction } = B;
    const isDev = env === 'dev';

    const { chapterId, cSlug, cUser, actionId, actionProperties } = options;
    const id = isDev || useProperty(chapterId);
    const currentSlug = isDev || useText(cSlug);
    const currentUser = isDev || useProperty(cUser);

    const history = !isDev && useHistory();

    const GET_ITEMS = gql`
      query Items($id: String!) {
        allChapteritem(
          where: { chapter: { id: { eq: $id } } }
          sort: { relation: { index: ASC } }
        ) {
          results {
            chapter {
              course {
                slug
              }
            }
            itemType
            itemTitle
            duration
            slug
            video {
              link
            }
            coursefile {
              id
              fileTitle
              fileitem {
                fileName
                fileProperty {
                  url
                }
              }
            }
            mycourseprogresses {
              isFinished
            }
          }
        }
      }
    `;

    const GET_ITEMS_ANON = gql`
      query Items($id: String!) {
        allChapteritem(
          where: { chapter: { id: { eq: $id } } }
          sort: { relation: { index: ASC } }
        ) {
          results {
            chapter {
              course {
                slug
              }
            }
            itemType
            itemTitle
            duration
            slug
            video {
              link
            }
            coursefile {
              id
              fileTitle
              fileitem {
                fileName
              }
            }
            mycourseprogresses {
              isFinished
            }
          }
        }
      }
    `;

    function user() {
      return currentUser;
    }

    const Icon = props => {
      const { icon } = props;
      const iconSelection = {
        video: 'zmdi-videocam',
        exercise: 'zmdi-file-text',
        play: 'zmdi-play-circle-outline',
        lock: 'zmdi-lock',
      }[icon];
      const classText = `zmdi ${iconSelection} zmdi-hc-lg zmdi-hc-fw`;
      return (
        <div className={[classes.icon, classes[icon]].join(' ')}>
          <i class={classText}></i>
        </div>
      );
    };

    const Body = props => {
      const { title, subtitle, type } = props;
      return (
        <div className={classes.body}>
          <div
            className={[type === 'playvideo' ? classes.play : null].join(' ')}
          >
            {title}
          </div>
          <div className={classes.medium}>{subtitle}</div>
        </div>
      );
    };

    const CheckIcon = props => {
      const { seen: initSeen, hasaccess, slug } = props;
      const propertyMappings = new Map(actionProperties);
      const input = Array.from(propertyMappings.keys()).reduce((acc, key) => {
        const propertyId = propertyMappings.get(key);

        const value = isDev ? '' : B.useProperty(propertyId);
        acc[key] = value;
        return acc;
      }, {});
      const [value, setValue] = useState(input);
      const [seen, setSeen] = useState(initSeen);

      const [actionCallback, { loading }] = useAction(actionId, {
        variables: {
          input: value,
        },
        onCompleted(data) {
          setSeen(data.actionb5);
          B.triggerEvent('onToggleSeenSuccess', data.actionb5);
        },
        onError(error) {
          B.triggerEvent('onToggleSeenError', error.message);
        },
      });

      useEffect(() => {
        if (value.slug) actionCallback();
      }, [value]);

      function click(evt) {
        evt.stopPropagation();
        input.seen = seen;
        input.slug = slug;
        setValue({ ...input });
      }
      if (loading) {
        return (
          <div className={[classes.icon].join(' ')}>
            <i class="zmdi zmdi-spinner zmdi-hc-spin zmdi-hc-lg zmdi-hc-fw"></i>
          </div>
        );
      }
      return hasaccess ? (
        <div
          onClick={e => click(e)}
          className={[
            classes.icon,
            !seen ? classes.accent : classes.green,
          ].join(' ')}
        >
          {user() ? (
            <i class="zmdi zmdi-check zmdi-hc-lg zmdi-hc-fw"></i>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className={[classes.icon, classes.accent].join(' ')}>
          <i class="zmdi zmdi-lock zmdi-hc-lg zmdi-hc-fw"></i>
        </div>
      );
    };

    function checkType(item) {
      const { itemType, slug } = item;
      if (currentSlug === slug) return { icon: 'play', type: 'playvideo' };
      if (itemType === 'Video') return { icon: 'video', type: 'video' };
      if (itemType === 'Exercise')
        return { icon: 'exercise', type: 'exercise' };
    }

    function handleClick(slug, courseSlug, hasAccess, type, fileitem) {
      if (hasAccess) {
        if (type === 'video') {
          history.push(`/courses/${courseSlug}/${slug}`);
        } else if (fileitem) {
          window.open(fileitem.fileProperty.url, '_blank');
        }
      }
    }

    function Item(props) {
      const {
        item,
        item: {
          itemTitle,
          itemType,
          duration,
          mycourseprogresses,
          video,
          coursefile,
          slug,
          chapter: {
            course: { slug: courseSlug },
          },
        },
      } = props;
      const seen =
        mycourseprogresses.length > 0 && mycourseprogresses[0].isFinished;
      const { icon, type } = checkType(item);
      const hasAccess = video || (coursefile && coursefile.fileitem);
      const fileitem = coursefile && coursefile.fileitem;
      return (
        <div
          onClick={() =>
            handleClick(slug, courseSlug, hasAccess, type, fileitem)
          }
          className={classes.item}
        >
          <Icon icon={icon} />
          <Body
            title={itemTitle}
            subtitle={type === 'exercise' ? 'File download' : duration}
            type={type}
          />
          <CheckIcon seen={seen} hasaccess={hasAccess} slug={slug} />
        </div>
      );
    }

    function playList() {
      const query = currentUser ? GET_ITEMS : GET_ITEMS_ANON;
      return (
        <div className={classes.root}>
          <Query fetchPolicy="network-only" query={query} variables={{ id }}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              const {
                allChapteritem: { results },
              } = data;
              return results.map(item => <Item key={item.id} item={item} />);
            }}
          </Query>
        </div>
      );
    }
    return isDev ? (
      <div className={classes.root}>
        <div className={classes.item}>
          <Icon icon="video" />
          <Body title="Video unseen" subtitle="12m 34s" type="video" />
          <CheckIcon hasaccess />
        </div>
        <div className={classes.item}>
          <Icon icon="play" />
          <Body title="Playing video" subtitle="12m 34s" type="playvideo" />
          <CheckIcon seen hasaccess />
        </div>
        <div className={classes.item}>
          <Icon icon="exercise" />
          <Body title="Exercise" subtitle="File download" type="exercise" />
          <CheckIcon seen hasaccess />
        </div>
      </div>
    ) : (
      playList()
    );
  })(),
  styles: B => theme => {
    const style = new B.Styling(theme);
    return {
      root: {
        fontFamily: '"Ubuntu"',
      },
      item: {
        display: 'flex',
        marginBottom: '10px',
        transition: '0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      },
      body: {
        flexGrow: 1,
      },
      icon: {
        marginRight: '10px',
      },
      medium: {
        color: style.getColor('Medium'),
        fontSize: '14px',
      },
      accent: {
        color: style.getColor('Accent1'),
      },
      green: {
        color: '#38E66B',
      },
      play: {
        color: '#3C6FFA',
      },
      lock: {
        color: style.getColor('Accent1'),
      },
    };
  },
}))();
