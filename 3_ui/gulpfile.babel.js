require('@babel/register')({ 
    extensions: ['.js', '.jsx', '.ts', '.tsx'] 
});
require('./build/gulpfile.js');