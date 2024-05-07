export const statsOptions = {
    warnings:     false,        // Because of WARNING in ./~/css-loader?camelCase&sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]!./~/postcss-loader?sourceMap!./src/components/site/ApplicationPage.css
                                // postcss-custom-properties: /Users/noahshipley/dev/conning/vertical-slice/round-1/src/components/site/ApplicationPage.css:2:5: variable '--page-padding' is undefined and used without a fallback
    modules:      false,
    assets:       true,
    colors:       true,
    children:     false,
    version:      false,
    hash:         false,
    timings:      true,
    chunks:       false,
    chunkModules: false,
};

export class Environments {
    static Debug      = "debug";
    static Production = "production";
}
