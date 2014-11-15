module.exports = {
    'domname 5': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': '',
            'stdout': 'test-domU'
        }
    },
    'domname 6': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': '',
            'stdout': ''
        }
    },
    'domname 7': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': 'Can\'t get domid of domain name \'test-domU-notexists\', maybe this domain does not exist.',
            'stdout': ''
        }
    },
    'domname 8': {
        'err': new Error('Could not connect to dummy'),
        'data': {}
    }
};
