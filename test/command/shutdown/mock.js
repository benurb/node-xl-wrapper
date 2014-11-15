module.exports = {
    'shutdown test\\-domU': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': '',
            'stdout': 'Shutting down domain 5'
        }
    },
    'shutdown 5': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': '',
            'stdout': 'Shutting down domain 5'
        }
    },
    // Shutdown does resolve the name of the DomU id for filtering
    'domname 5': {
        'err': null,
        'data': {
            'code': 0,
            'signal': null,
            'stderr': '',
            'stdout': 'test-domU'
        }
    }
};
