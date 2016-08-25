var app = require('./server-config.js');

var port = 4568;

app.listen(port);

console.log('Server now listening on port ' + port);

//comment

// #!/bin/sh
// git --work-tree=/var/www/128.199.33.157:4568 --git-dir=/var/repo/site.git checkout -f 