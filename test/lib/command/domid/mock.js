module.exports = {
    'domid test\\-domU': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': '',
            'stdout': '5'
        }
    },
    'domid test\\-domU\\-notexists': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': 'Can\'t get domid of domain name \'test-domU-notexists\', maybe this domain does not exist.',
            'stdout': ''
        }
    },
    'domid test\\-domU\\-error': {
        'err': new Error('Could not connect to dummy'),
        'data': {}
    }
};
