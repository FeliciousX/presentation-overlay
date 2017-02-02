require('reset.css/reset.css')

import xs from 'xstream'

xs.periodic(1000).take(5).addListener({next: console.log})
