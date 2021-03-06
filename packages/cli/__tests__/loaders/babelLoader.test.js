const babelLoader = require('../../ak-webpack-config/lib/loaders/babelLoader');
const { localBuildEnv, browserTarget } = require('../../config/index');
const getPresets = require('../../ak-webpack-config/presets/index.js');

const path = require('path');

describe('loader-babelLoader', () => {
    const workDir = './';

    it('默认babel配置', () => {
        const babelLoaderOptions = babelLoader({ workDir }, {});

        expect(babelLoaderOptions).toMatchObject([
            {
                include: [expect.any(String)],
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: expect.stringMatching('babel-loader/lib/index.js'),
                        options: {
                            cacheCompression: false,
                            cacheDirectory: true,
                            plugins: [
                                [
                                    expect.stringMatching(
                                        '@babel/plugin-transform-runtime/lib/index.js',
                                    ),
                                    {
                                        absoluteRuntime: expect.stringMatching('@babel/runtime'),
                                    },
                                ],
                            ],
                            presets: [
                                [
                                    expect.stringMatching('@babel/preset-env/lib/index.js'),
                                    {
                                        bugfixes: true,
                                        corejs: {
                                            proposals: true,
                                            version: 3.18,
                                        },
                                        useBuiltIns: 'usage',
                                    },
                                ],
                                [
                                    expect.stringMatching('@babel/preset-react/lib/index.js'),
                                    {
                                        runtime: 'automatic',
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            {
                include: [expect.any(String)],
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: expect.stringMatching('babel-loader/lib/index.js'),
                        options: {
                            cacheCompression: false,
                            cacheDirectory: true,
                            plugins: [
                                [
                                    expect.stringMatching(
                                        '@babel/plugin-transform-runtime/lib/index.js',
                                    ),
                                    {
                                        absoluteRuntime: expect.stringMatching('@babel/runtime'),
                                    },
                                ],
                            ],
                            presets: [
                                [
                                    expect.stringMatching('@babel/preset-env/lib/index.js'),
                                    {
                                        bugfixes: true,
                                        corejs: {
                                            proposals: true,
                                            version: 3.18,
                                        },
                                        useBuiltIns: 'usage',
                                    },
                                ],
                                [
                                    expect.stringMatching('@babel/preset-react/lib/index.js'),
                                    {
                                        runtime: 'automatic',
                                    },
                                ],
                                expect.stringMatching('@babel/preset-typescript/lib/index.js'),
                            ],
                        },
                    },
                ],
            },
        ]);
    });

    it('传入babelInclude应当包含在include配置内', () => {
        const babelInclude = ['./a'];
        const babelLoaderConfig = babelLoader(
            {
                babelInclude,
                workDir,
            },
            {},
        );

        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < babelLoaderConfig.length; index++) {
            const element = babelLoaderConfig[index];

            expect(element.include).toEqual(
                expect.arrayContaining([...babelInclude.map(v => path.resolve(workDir, v))]),
            );
        }
    });

    it('local环境并且开启liveReload则添加react-refresh', () => {
        const localPreset = getPresets(localBuildEnv, browserTarget);

        const babelLoaderConfig = babelLoader(
            {
                workDir,
                hotReplace: true,
            },
            localPreset,
        );

        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < babelLoaderConfig.length; index++) {
            const element = babelLoaderConfig[index];

            // @ts-ignore 测试options
            expect(element.use[0].options.plugins).toEqual(
                expect.arrayContaining([require.resolve('react-refresh/babel')]),
            );
        }
    });
    it('开启antdModuleLazyOff应该添加import插件', () => {
        const babelLoaderConfig = babelLoader(
            {
                workDir,
                antdModuleLazyOff: true,
            },
            {},
        );

        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < babelLoaderConfig.length; index++) {
            const element = babelLoaderConfig[index];

            // @ts-ignore 测试options
            expect(element.use[0].options.plugins).toEqual(
                expect.arrayContaining([
                    [
                        require.resolve('babel-plugin-import'),
                        {
                            libraryName: 'antd',
                            libraryDirectory: 'es',
                            style: true,
                        },
                    ],
                ]),
            );
        }
    });
});
