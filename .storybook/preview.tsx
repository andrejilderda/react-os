import clsx from 'clsx';
import React from 'react';
import {
  classNamePrefix,
  pseudoWrapperClassNames,
} from '../packages/lib/constants/styles';
import { themes } from '../packages/lib/themes/themes.css';
import { vars } from '../packages/lib/themes/theme.css';
import { storybookPreview } from './preview.css';
import ThemeProvider from './../src/contexts/ThemeProvider/ThemeProvider';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: { disable: true },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Docs', 'Getting Started', 'Components'],
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme/OS',
    defaultValue: 'windows',
    toolbar: {
      icon: 'browser',
      shortcuts: {
        next: {
          label: 'Go to next theme',
          keys: ['L'],
        },
        previous: {
          label: 'Go to previous theme',
          keys: ['K'],
        },
      },
      items: [
        {
          title: 'macOS',
          value: 'macos',
        },
        {
          title: 'Windows',
          value: 'windows',
        },
      ],
      showName: true,
    },
  },
  mode: {
    name: 'Mode',
    defaultValue: 'side-by-side',
    toolbar: {
      icon: 'contrast',
      items: [
        'auto',
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
        { value: 'side-by-side', icon: 'sidebar', title: 'side by side' },
        { value: 'stacked', icon: 'bottombar', title: 'stacked' },
      ],
      showName: true,
      shortcuts: {
        next: {
          label: 'Go to next mode',
          keys: ['O'],
        },
        previous: {
          label: 'Go to previous mode',
          keys: ['I'],
        },
      },
    },
  },
  pseudo: {
    name: 'Pseudo',
    defaultValue: 'light',
    toolbar: {
      icon: 'contrast',
      items: ['default', 'hover', 'active', 'focus-visible', 'all'],
      showName: true,
    },
  },
};

const StoryWrapper = ({
  story,
  pseudoState = 'default',
}: {
  story: React.ReactNode;
  pseudoState?: keyof typeof pseudoWrapperClassNames | 'all';
}) => {
  if (pseudoState === 'all') {
    return (
      <>
        <div className={pseudoWrapperClassNames['default']}>{story}</div>
        <div className={pseudoWrapperClassNames['hover']}>{story}</div>
        <div className={pseudoWrapperClassNames['active']}>{story}</div>
        <div className={pseudoWrapperClassNames['focusVisible']}>{story}</div>
      </>
    );
  }

  return <div className={pseudoWrapperClassNames[pseudoState]}>{story}</div>;
};

export const decorators = [
  (Story, context) => {
    const { theme, mode, pseudo } = context.globals;
    const activeTheme = themes[theme][mode];
    const lightTheme = themes[theme].light;
    const darkTheme = themes[theme].dark;
    const themeClassName = `${classNamePrefix}-${theme}`;

    if (mode === 'side-by-side' || mode === 'stacked')
      return (
        <div className={storybookPreview({ layout: mode })}>
          <ThemeProvider
            theme={context.globals.theme}
            mode="light"
            withGlobalStyles
          >
            <div className={clsx(themeClassName, lightTheme)}>
              <StoryWrapper story={<Story />} pseudoState={pseudo} />
            </div>
          </ThemeProvider>
          <ThemeProvider
            theme={context.globals.theme}
            mode="dark"
            withGlobalStyles
          >
            <div className={clsx(themeClassName, darkTheme)}>
              <StoryWrapper story={<Story />} pseudoState={pseudo} />
            </div>
          </ThemeProvider>
        </div>
      );

    return (
      <div
        className={clsx(
          themeClassName,
          activeTheme,
          storybookPreview(),
          pseudoWrapperClassNames[pseudo],
        )}
      >
        <ThemeProvider
          theme={context.globals.theme}
          mode={context.globals.mode}
          withGlobalStyles
        >
          <StoryWrapper story={<Story />} pseudoState={pseudo} />
        </ThemeProvider>
      </div>
    );
  },
];