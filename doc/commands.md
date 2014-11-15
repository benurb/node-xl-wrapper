# Commands
## <a name="domid">domid</a>
Options:

- `name` (String - alternative `domName`, `domainName`) - __Required:__ The name of the DomU, whose id you want to know

Return value:

- (Number) id of the DomU

## <a name="domname">domname</a>
Options:

- `id` (String - alternative `domId`, `domainId`) - __Required:__ The id of the DomU, whose name you want to know

Return value:

- (String) name of the DomU

## <a name="list">list</a>
Options:

- none

Return value:

- (Object) Output of `xl list -l`. It's a bit strange structure, but you will get used to it :smile:

## <a name="shutdown">shutdown</a>
Options:

- `name` (String - alternative `domName`, `domainName`) - __Required:__ The name of the DomU to shutdown
(use this __or__ `id`, not both)
- `id` (String - alternative `domId`, `domainId`) - __Required:__ The id of the DomU to shutdown
(use this __or__ `name`, not both)
- `all` (Boolean) - Shuts down all VMs on this Xen host. This will only work if the granted filter from the constructor
matches all running VMs (checked first via the list command). If you set this to true you can omit the required `name`
and `id` property.

Return value:

- (String) Output of `xl shutdown`
